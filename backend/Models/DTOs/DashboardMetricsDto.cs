namespace MedicalDashboard.Api.Models.DTOs;

public class DashboardMetricsDto
{
    public int TotalPatients { get; set; }
    public int ActivePatients { get; set; }
    public int CriticalCases { get; set; }
    public double AverageHeartRate { get; set; }
    public string AverageBloodPressure { get; set; } = string.Empty;
    public List<ConditionCountDto> CommonConditions { get; set; } = new();
    public int LifetimePatients { get; set; }
    public int CurrentPatients { get; set; }
    public int RecoveredPatients { get; set; }
    public int DischargedPatients { get; set; }
}

public class ConditionCountDto
{
    public string Condition { get; set; } = string.Empty;
    public int Count { get; set; }
}

