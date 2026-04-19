using MedicalDashboard.Api.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace MedicalDashboard.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[AllowAnonymous]
public class HealthController : ControllerBase
{
    private readonly MedicalContext _context;

    public HealthController(MedicalContext context) => _context = context;

    [HttpGet]
    public async Task<IActionResult> Get()
    {
        var dbReachable = await _context.Database.CanConnectAsync();
        var payload = new
        {
            status = dbReachable ? "Healthy" : "Degraded",
            database = dbReachable ? "Up" : "Down",
            timestamp = DateTime.UtcNow.ToString("O"),
            version = typeof(HealthController).Assembly.GetName().Version?.ToString() ?? "1.0.0",
        };
        return dbReachable ? Ok(payload) : StatusCode(503, payload);
    }
}
