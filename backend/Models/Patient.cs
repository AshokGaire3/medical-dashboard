namespace MedicalDashboard.Api.Models;

public class Patient
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public int Age { get; set; }
    public string Gender { get; set; } = string.Empty; // "Male", "Female", "Other"
    public string Condition { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty; // "Stable", "Critical", "Improving", etc.
    public DateTime LastVisit { get; set; }
    public DateTime? AdmissionDate { get; set; }
    public DateTime? DischargeDate { get; set; }
    public DateTime? TreatmentStartDate { get; set; }
    public bool IsCurrentPatient { get; set; }
    public string? TreatmentNotes { get; set; }

    // Contact Information (stored as JSON or separate table)
    public string ContactPhone { get; set; } = string.Empty;
    public string ContactEmail { get; set; } = string.Empty;
    public string ContactAddress { get; set; } = string.Empty;

    // Emergency Contact
    public string EmergencyContactName { get; set; } = string.Empty;
    public string EmergencyContactRelationship { get; set; } = string.Empty;
    public string EmergencyContactPhone { get; set; } = string.Empty;

    // Allergies (stored as JSON array)
    public string AllergiesJson { get; set; } = "[]";

    // Navigation Properties
    public ICollection<Vital> Vitals { get; set; } = new List<Vital>();
    public ICollection<MedicalCondition> MedicalHistory { get; set; } = new List<MedicalCondition>();
    public ICollection<Medication> Medications { get; set; } = new List<Medication>();
    public ICollection<TestResult> TestResults { get; set; } = new List<TestResult>();
}

