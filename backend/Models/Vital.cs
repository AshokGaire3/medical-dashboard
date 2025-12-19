namespace MedicalDashboard.Api.Models;

public class Vital
{
    public int Id { get; set; }
    public int PatientId { get; set; }
    public DateTime Timestamp { get; set; }
    public int HeartRate { get; set; }
    public int BloodPressureSystemic { get; set; }
    public int BloodPressureDiastolic { get; set; }
    public double Temperature { get; set; }
    public int OxygenSaturation { get; set; }
    public int RespiratoryRate { get; set; }

    // Navigation Property
    public Patient Patient { get; set; } = null!;
}

