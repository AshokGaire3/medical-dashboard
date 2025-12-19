namespace MedicalDashboard.Api.Models;

public class MedicalCondition
{
    public int Id { get; set; }
    public int PatientId { get; set; }
    public string Condition { get; set; } = string.Empty;
    public DateTime DiagnosedDate { get; set; }
    public string Severity { get; set; } = string.Empty; // "Mild", "Moderate", "Severe"
    public string Status { get; set; } = string.Empty; // "Active", "Resolved", "Chronic"
    public string Notes { get; set; } = string.Empty;

    // Navigation Property
    public Patient Patient { get; set; } = null!;
}

