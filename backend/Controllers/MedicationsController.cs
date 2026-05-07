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
public class MedicationsController : ControllerBase
{
    private readonly MedicalContext _context;
    private readonly ILogger<MedicationsController> _logger;

    public MedicationsController(MedicalContext context, ILogger<MedicationsController> logger)
    {
        _context = context;
        _logger = logger;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<MedicationDto>>> GetMedications([FromQuery] int? patientId = null, [FromQuery] string? status = null)
    {
        var rosterIds = _context.Patients.ScopedToCaller(User).Select(p => p.Id);
        var query = _context.Medications.Where(m => rosterIds.Contains(m.PatientId));

        if (patientId.HasValue)
        {
            query = query.Where(m => m.PatientId == patientId.Value);
        }

        if (!string.IsNullOrWhiteSpace(status))
        {
            query = query.Where(m => m.Status == status);
        }

        var items = await query
            .OrderByDescending(m => m.StartDate)
            .ToListAsync();

        return Ok(items.Select(MapToDto).ToList());
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<MedicationDto>> GetMedication(int id)
    {
        var med = await _context.Medications.FindAsync(id);
        if (med == null)
        {
            return NotFound();
        }

        if (!await _context.Patients.CallerCanAccessPatientAsync(User, med.PatientId))
            return NotFound();

        return Ok(MapToDto(med));
    }

    [HttpPost]
    [Authorize(Roles = "Doctor,Admin")]
    public async Task<ActionResult<MedicationDto>> CreateMedication(MedicationDto dto)
    {
        if (!await _context.Patients.CallerCanAccessPatientAsync(User, dto.PatientId))
        {
            return NotFound(new { message = $"Patient {dto.PatientId} does not exist" });
        }

        var med = new Medication
        {
            PatientId = dto.PatientId,
            Name = dto.Name,
            Dosage = dto.Dosage,
            Frequency = dto.Frequency,
            StartDate = DateTime.Parse(dto.StartDate),
            EndDate = string.IsNullOrWhiteSpace(dto.EndDate) ? null : DateTime.Parse(dto.EndDate),
            PrescribedBy = dto.PrescribedBy,
            Status = string.IsNullOrWhiteSpace(dto.Status) ? "Active" : dto.Status,
            Notes = dto.Notes,
            CreatedAt = DateTime.UtcNow
        };

        _context.Medications.Add(med);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetMedication), new { id = med.Id }, MapToDto(med));
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "Doctor,Admin,Nurse")]
    public async Task<IActionResult> UpdateMedication(int id, MedicationDto dto)
    {
        if (id != dto.Id)
        {
            return BadRequest();
        }

        var med = await _context.Medications.FindAsync(id);
        if (med == null)
        {
            return NotFound();
        }

        if (!await _context.Patients.CallerCanAccessPatientAsync(User, med.PatientId))
            return NotFound();

        med.Name = dto.Name;
        med.Dosage = dto.Dosage;
        med.Frequency = dto.Frequency;
        med.StartDate = DateTime.Parse(dto.StartDate);
        med.EndDate = string.IsNullOrWhiteSpace(dto.EndDate) ? null : DateTime.Parse(dto.EndDate);
        med.PrescribedBy = dto.PrescribedBy;
        med.Status = dto.Status;
        med.Notes = dto.Notes;
        med.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "Doctor,Admin")]
    public async Task<IActionResult> DeleteMedication(int id)
    {
        var med = await _context.Medications.FindAsync(id);
        if (med == null)
        {
            return NotFound();
        }

        if (!await _context.Patients.CallerCanAccessPatientAsync(User, med.PatientId))
            return NotFound();

        _context.Medications.Remove(med);
        await _context.SaveChangesAsync();
        return NoContent();
    }

    private static MedicationDto MapToDto(Medication m)
    {
        return new MedicationDto
        {
            Id = m.Id,
            PatientId = m.PatientId,
            Name = m.Name,
            Dosage = m.Dosage,
            Frequency = m.Frequency,
            StartDate = m.StartDate.ToString("yyyy-MM-dd"),
            EndDate = m.EndDate?.ToString("yyyy-MM-dd"),
            PrescribedBy = m.PrescribedBy,
            Status = m.Status,
            Notes = m.Notes,
            CreatedAt = m.CreatedAt.ToString("yyyy-MM-ddTHH:mm:ss"),
            UpdatedAt = m.UpdatedAt?.ToString("yyyy-MM-ddTHH:mm:ss")
        };
    }
}
