namespace MedicalDashboard.Api.Models;

public class User
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;
    public string Role { get; set; } = "Doctor"; // "Doctor", "Nurse", "Admin"
    public string? Avatar { get; set; }
    // Clinical specialty for doctors (e.g., "Cardiology", "Endocrinology",
    // "Pulmonology", "Internal Medicine"). Null for nurses and admins.
    public string? Specialty { get; set; }
    public DateTime? PracticeStartDate { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? LastLoginAt { get; set; }
}
