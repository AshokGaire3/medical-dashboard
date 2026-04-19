namespace MedicalDashboard.Api.Auth;

public class JwtOptions
{
    public const string SectionName = "Jwt";

    public string Key { get; set; } = string.Empty;
    public string Issuer { get; set; } = "MedicalDashboard";
    public string Audience { get; set; } = "MedicalDashboardClient";
    public int ExpiresMinutes { get; set; } = 120;
}
