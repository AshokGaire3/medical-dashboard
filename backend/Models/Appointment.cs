namespace MedicalDashboard.Api.Models;

public class Appointment
{
    public int Id { get; set; }
    public int PatientId { get; set; }
    public DateTime ScheduledAt { get; set; }
    public int DurationMinutes { get; set; } = 30;
    public string Reason { get; set; } = string.Empty;
    public string Status { get; set; } = "Scheduled"; // Scheduled, Completed, Cancelled, NoShow
    public string? Notes { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }

    public Patient Patient { get; set; } = null!;
}
