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
public class MedicalConditionsController : ControllerBase
{
    private readonly MedicalContext _context;
    private readonly ILogger<MedicalConditionsController> _logger;

    public MedicalConditionsController(MedicalContext context, ILogger<MedicalConditionsController> logger)
    {
        _context = context;
        _logger = logger;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<MedicalConditionDto>>> GetConditions([FromQuery] int? patientId = null, [FromQuery] string? status = null)
    {
        var query = _context.MedicalConditions.AsQueryable();

        if (patientId.HasValue)
        {
            query = query.Where(c => c.PatientId == patientId.Value);
        }

        if (!string.IsNullOrWhiteSpace(status))
        {
            query = query.Where(c => c.Status == status);
        }

        var items = await query
            .OrderByDescending(c => c.DiagnosedDate)
            .ToListAsync();

        return Ok(items.Select(MapToDto).ToList());
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<MedicalConditionDto>> GetCondition(int id)
    {
        var c = await _context.MedicalConditions.FindAsync(id);
        if (c == null)
        {
            return NotFound();
        }

        return Ok(MapToDto(c));
    }

    [HttpPost]
    [Authorize(Roles = "Doctor,Admin")]
    public async Task<ActionResult<MedicalConditionDto>> CreateCondition(MedicalConditionDto dto)
    {
        var patientExists = await _context.Patients.AnyAsync(p => p.Id == dto.PatientId);
        if (!patientExists)
        {
            return BadRequest(new { message = $"Patient {dto.PatientId} does not exist" });
        }

        var c = new MedicalCondition
        {
            PatientId = dto.PatientId,
            Condition = dto.Condition,
            DiagnosedDate = DateTime.Parse(dto.DiagnosedDate),
            Severity = dto.Severity,
            Status = string.IsNullOrWhiteSpace(dto.Status) ? "Active" : dto.Status,
            Notes = dto.Notes ?? string.Empty,
            CreatedAt = DateTime.UtcNow
        };

        _context.MedicalConditions.Add(c);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetCondition), new { id = c.Id }, MapToDto(c));
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "Doctor,Admin")]
    public async Task<IActionResult> UpdateCondition(int id, MedicalConditionDto dto)
    {
        if (id != dto.Id)
        {
            return BadRequest();
        }

        var c = await _context.MedicalConditions.FindAsync(id);
        if (c == null)
        {
            return NotFound();
        }

        c.Condition = dto.Condition;
        c.DiagnosedDate = DateTime.Parse(dto.DiagnosedDate);
        c.Severity = dto.Severity;
        c.Status = dto.Status;
        c.Notes = dto.Notes ?? string.Empty;
        c.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "Doctor,Admin")]
    public async Task<IActionResult> DeleteCondition(int id)
    {
        var c = await _context.MedicalConditions.FindAsync(id);
        if (c == null)
        {
            return NotFound();
        }

        _context.MedicalConditions.Remove(c);
        await _context.SaveChangesAsync();
        return NoContent();
    }

    private static MedicalConditionDto MapToDto(MedicalCondition c)
    {
        return new MedicalConditionDto
        {
            Id = c.Id,
            PatientId = c.PatientId,
            Condition = c.Condition,
            DiagnosedDate = c.DiagnosedDate.ToString("yyyy-MM-dd"),
            Severity = c.Severity,
            Status = c.Status,
            Notes = c.Notes,
            CreatedAt = c.CreatedAt.ToString("yyyy-MM-ddTHH:mm:ss"),
            UpdatedAt = c.UpdatedAt?.ToString("yyyy-MM-ddTHH:mm:ss")
        };
    }
}
