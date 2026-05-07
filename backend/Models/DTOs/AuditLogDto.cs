namespace MedicalDashboard.Api.Models.DTOs;

// Shape returned by GET /api/audit-logs. Matches AuditLog 1:1 with date as ISO string.
public class AuditLogDto
{
    public int Id { get; set; }
    public int? UserId { get; set; }
    public string UserEmail { get; set; } = string.Empty;
    public string UserRole { get; set; } = string.Empty;
    public string Method { get; set; } = string.Empty;
    public string Path { get; set; } = string.Empty;
    public string? Resource { get; set; }
    public string? ResourceId { get; set; }
    public int StatusCode { get; set; }
    public string? IpAddress { get; set; }
    public string? UserAgent { get; set; }
    public string Timestamp { get; set; } = string.Empty;
}
