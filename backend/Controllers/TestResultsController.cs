using MedicalDashboard.Api.Auth;
using MedicalDashboard.Api.Data;
using MedicalDashboard.Api.Models;
using MedicalDashboard.Api.Models.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace MedicalDashboard.Api.Controllers;

[ApiController]
[Authorize]
[Route("api/[controller]")]
public class TestResultsController : ControllerBase
{
    private readonly MedicalContext _context;
    private readonly ILogger<TestResultsController> _logger;

    public TestResultsController(MedicalContext context, ILogger<TestResultsController> logger)
    {
        _context = context;
        _logger = logger;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<TestResultDto>>> GetTestResults([FromQuery] int? patientId = null, [FromQuery] string? status = null)
    {
        var rosterIds = _context.Patients.ScopedToCaller(User).Select(p => p.Id);
        var query = _context.TestResults.Where(t => rosterIds.Contains(t.PatientId));

        if (patientId.HasValue)
        {
            query = query.Where(t => t.PatientId == patientId.Value);
        }

        if (!string.IsNullOrWhiteSpace(status))
        {
            query = query.Where(t => t.Status == status);
        }

        var items = await query
            .OrderByDescending(t => t.Date)
            .ToListAsync();

        return Ok(items.Select(MapToDto).ToList());
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<TestResultDto>> GetTestResult(int id)
    {
        var t = await _context.TestResults.FindAsync(id);
        if (t == null)
        {
            return NotFound();
        }

        if (!await _context.Patients.CallerCanAccessPatientAsync(User, t.PatientId))
            return NotFound();

        return Ok(MapToDto(t));
    }

    [HttpPost]
    [Authorize(Roles = "Doctor,Admin")]
    public async Task<ActionResult<TestResultDto>> CreateTestResult(TestResultDto dto)
    {
        if (!await _context.Patients.CallerCanAccessPatientAsync(User, dto.PatientId))
        {
            return NotFound(new { message = $"Patient {dto.PatientId} does not exist" });
        }

        var t = new TestResult
        {
            PatientId = dto.PatientId,
            TestName = dto.TestName,
            TestType = dto.TestType,
            Date = DateTime.Parse(dto.Date),
            Result = dto.Result,
            NormalRange = dto.NormalRange,
            Status = string.IsNullOrWhiteSpace(dto.Status) ? "Normal" : dto.Status,
            OrderedBy = dto.OrderedBy,
            Notes = dto.Notes,
            CreatedAt = DateTime.UtcNow
        };

        _context.TestResults.Add(t);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetTestResult), new { id = t.Id }, MapToDto(t));
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "Doctor,Admin")]
    public async Task<IActionResult> UpdateTestResult(int id, TestResultDto dto)
    {
        if (id != dto.Id)
        {
            return BadRequest();
        }

        var t = await _context.TestResults.FindAsync(id);
        if (t == null)
        {
            return NotFound();
        }

        if (!await _context.Patients.CallerCanAccessPatientAsync(User, t.PatientId))
            return NotFound();

        t.TestName = dto.TestName;
        t.TestType = dto.TestType;
        t.Date = DateTime.Parse(dto.Date);
        t.Result = dto.Result;
        t.NormalRange = dto.NormalRange;
        t.Status = dto.Status;
        t.OrderedBy = dto.OrderedBy;
        t.Notes = dto.Notes;
        t.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "Doctor,Admin")]
    public async Task<IActionResult> DeleteTestResult(int id)
    {
        var t = await _context.TestResults.FindAsync(id);
        if (t == null)
        {
            return NotFound();
        }

        if (!await _context.Patients.CallerCanAccessPatientAsync(User, t.PatientId))
            return NotFound();

        _context.TestResults.Remove(t);
        await _context.SaveChangesAsync();
        return NoContent();
    }

    private static TestResultDto MapToDto(TestResult t)
    {
        return new TestResultDto
        {
            Id = t.Id,
            PatientId = t.PatientId,
            TestName = t.TestName,
            TestType = t.TestType,
            Date = t.Date.ToString("yyyy-MM-dd"),
            Result = t.Result,
            NormalRange = t.NormalRange,
            Status = t.Status,
            OrderedBy = t.OrderedBy,
            Notes = t.Notes,
            CreatedAt = t.CreatedAt.ToString("yyyy-MM-ddTHH:mm:ss"),
            UpdatedAt = t.UpdatedAt?.ToString("yyyy-MM-ddTHH:mm:ss")
        };
    }
}
