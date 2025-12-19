namespace MedicalDashboard.Api.Models;

public class TestResult
{
    public int Id { get; set; }
    public int PatientId { get; set; }
    public string TestName { get; set; } = string.Empty;
    public string TestType { get; set; } = string.Empty; // "Blood Test", "Imaging", "Biopsy", etc.
    public DateTime Date { get; set; }
    public string Result { get; set; } = string.Empty;
    public string? NormalRange { get; set; }
    public string Status { get; set; } = string.Empty; // "Normal", "Abnormal", "Critical"
    public string OrderedBy { get; set; } = string.Empty;
    public string? Notes { get; set; }

    // Navigation Property
    public Patient Patient { get; set; } = null!;
}

