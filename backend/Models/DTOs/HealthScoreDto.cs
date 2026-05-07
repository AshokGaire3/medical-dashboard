namespace MedicalDashboard.Api.Models.DTOs;

public class HealthScoreDto
{
    public int Total { get; set; }
    public string Band { get; set; } = string.Empty;
    public string BandLabel { get; set; } = string.Empty;
    public string Recommendation { get; set; } = string.Empty;
    public string ComputedAt { get; set; } = string.Empty;
    public int VitalId { get; set; }
    public string VitalTimestamp { get; set; } = string.Empty;
    public List<HealthScoreComponentDto> Components { get; set; } = new();
}

public class HealthScoreComponentDto
{
    public string Parameter { get; set; } = string.Empty;
    public string Value { get; set; } = string.Empty;
    public int Points { get; set; }
}
