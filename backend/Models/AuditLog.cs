namespace MedicalDashboard.Api.Models;

// Records who did what, when. Written by AuditLoggingMiddleware after each
// authenticated mutating request (POST/PUT/PATCH/DELETE). Read-only queries
// are not logged here to keep the table focused on changes.
public class AuditLog
{
    public int Id { get; set; }

    // Authenticated user who performed the action.
    public int? UserId { get; set; }
    public string UserEmail { get; set; } = string.Empty;
    public string UserRole { get; set; } = string.Empty;

    // What they did.
    public string Method { get; set; } = string.Empty;       // GET / POST / PUT / DELETE
    public string Path { get; set; } = string.Empty;         // /api/patients/42
    public string? Resource { get; set; }                    // "patients", "vitals", etc.
    public string? ResourceId { get; set; }                  // "42"

    // Request metadata.
    public int StatusCode { get; set; }
    public string? IpAddress { get; set; }
    public string? UserAgent { get; set; }

    public DateTime Timestamp { get; set; } = DateTime.UtcNow;
}
