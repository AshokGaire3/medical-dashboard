using System.Text.Json;

namespace MedicalDashboard.Api.Models.DTOs;

public class PatientDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public int Age { get; set; }
    public string Gender { get; set; } = string.Empty;
    public string Condition { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public string LastVisit { get; set; } = string.Empty;
    public string? AdmissionDate { get; set; }
    public string? DischargeDate { get; set; }
    public string? TreatmentStartDate { get; set; }
    public ContactInfoDto ContactInfo { get; set; } = new();
    public List<VitalDto> Vitals { get; set; } = new();
    public List<MedicalConditionDto> MedicalHistory { get; set; } = new();
    public List<MedicationDto> Medications { get; set; } = new();
    public List<TestResultDto> TestResults { get; set; } = new();
    public List<string> Allergies { get; set; } = new();
    public EmergencyContactDto EmergencyContact { get; set; } = new();
    public bool IsCurrentPatient { get; set; }
    public string? TreatmentNotes { get; set; }
}

public class ContactInfoDto
{
    public string Phone { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Address { get; set; } = string.Empty;
}

public class VitalDto
{
    public int Id { get; set; }
    public int PatientId { get; set; }
    public string Timestamp { get; set; } = string.Empty;
    public int HeartRate { get; set; }
    public int BloodPressureSystemic { get; set; }
    public int BloodPressureDiastolic { get; set; }
    public double Temperature { get; set; }
    public int OxygenSaturation { get; set; }
    public int RespiratoryRate { get; set; }
}

public class MedicalConditionDto
{
    public int Id { get; set; }
    public string Condition { get; set; } = string.Empty;
    public string DiagnosedDate { get; set; } = string.Empty;
    public string Severity { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public string Notes { get; set; } = string.Empty;
}

public class MedicationDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Dosage { get; set; } = string.Empty;
    public string Frequency { get; set; } = string.Empty;
    public string StartDate { get; set; } = string.Empty;
    public string? EndDate { get; set; }
    public string PrescribedBy { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public string? Notes { get; set; }
}

public class TestResultDto
{
    public int Id { get; set; }
    public string TestName { get; set; } = string.Empty;
    public string TestType { get; set; } = string.Empty;
    public string Date { get; set; } = string.Empty;
    public string Result { get; set; } = string.Empty;
    public string? NormalRange { get; set; }
    public string Status { get; set; } = string.Empty;
    public string OrderedBy { get; set; } = string.Empty;
    public string? Notes { get; set; }
}

public class EmergencyContactDto
{
    public string Name { get; set; } = string.Empty;
    public string Relationship { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
}

