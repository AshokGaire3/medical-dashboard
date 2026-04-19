using System.Net;
using System.Text.Json;

namespace MedicalDashboard.Api.Middleware;

public class ExceptionHandlingMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<ExceptionHandlingMiddleware> _logger;
    private readonly IHostEnvironment _env;

    public ExceptionHandlingMiddleware(
        RequestDelegate next,
        ILogger<ExceptionHandlingMiddleware> logger,
        IHostEnvironment env)
    {
        _next = next;
        _logger = logger;
        _env = env;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Unhandled exception for {Path}", context.Request.Path);
            await WriteProblemAsync(context, ex);
        }
    }

    private async Task WriteProblemAsync(HttpContext context, Exception ex)
    {
        var status = ex switch
        {
            ArgumentException or ArgumentNullException => HttpStatusCode.BadRequest,
            UnauthorizedAccessException => HttpStatusCode.Unauthorized,
            KeyNotFoundException => HttpStatusCode.NotFound,
            InvalidOperationException => HttpStatusCode.Conflict,
            _ => HttpStatusCode.InternalServerError,
        };

        context.Response.StatusCode = (int)status;
        context.Response.ContentType = "application/problem+json";

        var problem = new Dictionary<string, object?>
        {
            ["type"] = $"https://httpstatuses.io/{(int)status}",
            ["title"] = status.ToString(),
            ["status"] = (int)status,
            ["detail"] = _env.IsDevelopment() ? ex.Message : "An unexpected error occurred.",
            ["traceId"] = context.TraceIdentifier,
        };

        if (_env.IsDevelopment())
        {
            problem["exception"] = ex.GetType().Name;
            problem["stackTrace"] = ex.StackTrace?.Split('\n').Take(20).ToArray();
        }

        await context.Response.WriteAsync(JsonSerializer.Serialize(problem));
    }
}
