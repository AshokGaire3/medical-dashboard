using System.Security.Claims;
using MedicalDashboard.Api.Auth;
using MedicalDashboard.Api.Data;
using MedicalDashboard.Api.Models;
using MedicalDashboard.Api.Models.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace MedicalDashboard.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private static readonly string[] AllowedRoles = { "Doctor", "Nurse", "Admin" };

    private readonly MedicalContext _context;
    private readonly IPasswordHasher _hasher;
    private readonly IJwtTokenService _jwt;
    private readonly ILogger<AuthController> _logger;

    public AuthController(
        MedicalContext context,
        IPasswordHasher hasher,
        IJwtTokenService jwt,
        ILogger<AuthController> logger)
    {
        _context = context;
        _hasher = hasher;
        _jwt = jwt;
        _logger = logger;
    }

    [HttpPost("register")]
    [AllowAnonymous]
    public async Task<ActionResult<AuthResponseDto>> Register([FromBody] RegisterRequestDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.Email) || string.IsNullOrWhiteSpace(dto.Password))
            return BadRequest(new { message = "Email and password are required." });

        if (dto.Password.Length < 8)
            return BadRequest(new { message = "Password must be at least 8 characters." });

        var email = dto.Email.Trim().ToLowerInvariant();
        var exists = await _context.Users.AnyAsync(u => u.Email == email);
        if (exists)
            return Conflict(new { message = "An account with that email already exists." });

        var role = AllowedRoles.Contains(dto.Role) ? dto.Role : "Doctor";
        // First user ever may self-register as Admin; otherwise admin role requires existing admin.
        var hasAnyUser = await _context.Users.AnyAsync();
        if (role == "Admin" && hasAnyUser && !(User.Identity?.IsAuthenticated ?? false && User.IsInRole("Admin")))
        {
            role = "Doctor";
        }

        var user = new User
        {
            Name = string.IsNullOrWhiteSpace(dto.Name) ? email : dto.Name.Trim(),
            Email = email,
            PasswordHash = _hasher.Hash(dto.Password),
            Role = role,
            CreatedAt = DateTime.UtcNow,
        };

        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        _logger.LogInformation("User registered: {Email} ({Role})", user.Email, user.Role);
        return Ok(BuildResponse(user));
    }

    [HttpPost("login")]
    [AllowAnonymous]
    public async Task<ActionResult<AuthResponseDto>> Login([FromBody] LoginRequestDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.Email) || string.IsNullOrWhiteSpace(dto.Password))
            return BadRequest(new { message = "Email and password are required." });

        var email = dto.Email.Trim().ToLowerInvariant();
        // AsTracking() because we mutate LastLoginAt below; the global
        // default is NoTracking for read-only performance.
        var user = await _context.Users.AsTracking().FirstOrDefaultAsync(u => u.Email == email);
        if (user is null || !_hasher.Verify(dto.Password, user.PasswordHash))
            return Unauthorized(new { message = "Invalid email or password." });

        user.LastLoginAt = DateTime.UtcNow;
        await _context.SaveChangesAsync();

        return Ok(BuildResponse(user));
    }

    [HttpGet("me")]
    [Authorize]
    public async Task<ActionResult<UserDto>> Me()
    {
        var idClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!int.TryParse(idClaim, out var id))
            return Unauthorized();

        var user = await _context.Users.FindAsync(id);
        if (user is null) return Unauthorized();

        return Ok(ToDto(user));
    }

    private AuthResponseDto BuildResponse(User user)
    {
        var (token, expiresAt) = _jwt.CreateToken(user);
        return new AuthResponseDto
        {
            Token = token,
            ExpiresAt = expiresAt.ToString("yyyy-MM-ddTHH:mm:ss"),
            User = ToDto(user),
        };
    }

    private static UserDto ToDto(User u) => new()
    {
        Id = u.Id,
        Name = u.Name,
        Email = u.Email,
        Role = u.Role,
        Avatar = u.Avatar,
        PracticeStartDate = u.PracticeStartDate?.ToString("yyyy-MM-dd"),
    };
}
