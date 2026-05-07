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

    // Care team assignment. Restricts which clinicians can see this patient:
    // doctors and nurses are scoped to their own roster; admins see everyone.
    public int? AssignedDoctorId { get; set; }
    public User? AssignedDoctor { get; set; }
    public int? AssignedNurseId { get; set; }
    public User? AssignedNurse { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }

    // Soft-delete: set when the record is "removed" through the API.
    // A global query filter in MedicalContext hides rows where this is non-null.
    public DateTime? DeletedAt { get; set; }

    // Optimistic concurrency token. Rotated by MedicalContext.SaveChangesAsync
    // on every update so two concurrent writers can't silently overwrite.
    public Guid ConcurrencyStamp { get; set; } = Guid.NewGuid();

    // Navigation Properties
    public ICollection<Vital> Vitals { get; set; } = new List<Vital>();
    public ICollection<MedicalCondition> MedicalHistory { get; set; } = new List<MedicalCondition>();
    public ICollection<Medication> Medications { get; set; } = new List<Medication>();
    public ICollection<TestResult> TestResults { get; set; } = new List<TestResult>();
    public ICollection<Appointment> Appointments { get; set; } = new List<Appointment>();
}

