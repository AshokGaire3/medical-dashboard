using System.Security.Claims;
using MedicalDashboard.Api.Data;
using MedicalDashboard.Api.Models;

namespace MedicalDashboard.Api.Middleware;

// Records mutating API calls (POST/PUT/PATCH/DELETE) for an audit trail.
// Runs *after* the inner pipeline so we know the response status code.
// Failures to write are swallowed — auditing must not break the request.
public class AuditLoggingMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<AuditLoggingMiddleware> _logger;

    // Only these methods are logged. GET requests would flood the table.
    private static readonly HashSet<string> AuditedMethods = new(StringComparer.OrdinalIgnoreCase)
    {
        "POST", "PUT", "PATCH", "DELETE"
    };

    public AuditLoggingMiddleware(RequestDelegate next, ILogger<AuditLoggingMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context, MedicalContext db)
    {
        await _next(context);

        // Only audit mutating, authenticated API calls. Skip auth endpoints — login is high-volume.
        if (!ShouldAudit(context)) return;

        try
        {
            var entry = BuildEntry(context);
            db.AuditLogs.Add(entry);
            await db.SaveChangesAsync();
        }
        catch (Exception ex)
        {
            // Never let an audit failure break a successful business request.
            _logger.LogWarning(ex, "Failed to write audit log for {Path}", context.Request.Path);
        }
    }

    private static bool ShouldAudit(HttpContext context)
    {
        if (!AuditedMethods.Contains(context.Request.Method)) return false;

        var path = context.Request.Path.Value ?? string.Empty;
        if (!path.StartsWith("/api/", StringComparison.OrdinalIgnoreCase)) return false;
        if (path.StartsWith("/api/auth", StringComparison.OrdinalIgnoreCase)) return false;
        if (path.StartsWith("/api/health", StringComparison.OrdinalIgnoreCase)) return false;

        return context.User?.Identity?.IsAuthenticated == true;
    }

    private static AuditLog BuildEntry(HttpContext context)
    {
        var user = context.User;

        // Try common claim shapes for user id (sub or NameIdentifier).
        int? userId = null;
        var idClaim = user.FindFirst("sub")?.Value ?? user.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (int.TryParse(idClaim, out var parsedId)) userId = parsedId;

        var path = context.Request.Path.Value ?? string.Empty;
        var (resource, resourceId) = ParseResource(path);

        return new AuditLog
        {
            UserId = userId,
            UserEmail = user.FindFirst(ClaimTypes.Email)?.Value ?? user.Identity?.Name ?? string.Empty,
            UserRole = user.FindFirst(ClaimTypes.Role)?.Value ?? string.Empty,
            Method = context.Request.Method,
            Path = path,
            Resource = resource,
            ResourceId = resourceId,
            StatusCode = context.Response.StatusCode,
            IpAddress = context.Connection.RemoteIpAddress?.ToString(),
            UserAgent = context.Request.Headers.UserAgent.ToString(),
            Timestamp = DateTime.UtcNow,
        };
    }

    // Splits "/api/patients/42" into resource="patients", resourceId="42".
    private static (string? resource, string? resourceId) ParseResource(string path)
    {
        var segments = path.Split('/', StringSplitOptions.RemoveEmptyEntries);
        if (segments.Length < 2) return (null, null);

        var resource = segments[1].ToLowerInvariant();
        var resourceId = segments.Length >= 3 ? segments[2] : null;
        return (resource, resourceId);
    }
}
