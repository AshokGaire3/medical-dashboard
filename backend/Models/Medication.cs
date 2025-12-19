namespace MedicalDashboard.Api.Models;

public class Medication
{
    public int Id { get; set; }
    public int PatientId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Dosage { get; set; } = string.Empty;
    public string Frequency { get; set; } = string.Empty;
    public DateTime StartDate { get; set; }
    public DateTime? EndDate { get; set; }
    public string PrescribedBy { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty; // "Active", "Discontinued", "Completed"
    public string? Notes { get; set; }

    // Navigation Property
    public Patient Patient { get; set; } = null!;
}

