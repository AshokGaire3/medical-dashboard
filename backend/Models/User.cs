namespace MedicalDashboard.Api.Models;

public class User
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Role { get; set; } = string.Empty; // "Doctor", "Nurse", "Admin"
    public string? Avatar { get; set; }
    public DateTime? PracticeStartDate { get; set; }
}

