namespace MedicalDashboard.Api.Models.DTOs;

public class AppointmentDto
{
    public int Id { get; set; }
    public int PatientId { get; set; }
    public string? PatientName { get; set; }
    public string ScheduledAt { get; set; } = string.Empty;
    public int DurationMinutes { get; set; }
    public string Reason { get; set; } = string.Empty;
    public string Status { get; set; } = "Scheduled";
    public string? Notes { get; set; }
}

public class UpdateAppointmentStatusDto
{
    public string Status { get; set; } = string.Empty;
}
