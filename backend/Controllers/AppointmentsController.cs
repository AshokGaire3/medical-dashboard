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
public class AppointmentsController : ControllerBase
{
    private static readonly string[] ValidStatuses = { "Scheduled", "Completed", "Cancelled", "NoShow" };

    private readonly MedicalContext _context;
    private readonly ILogger<AppointmentsController> _logger;

    public AppointmentsController(MedicalContext context, ILogger<AppointmentsController> logger)
    {
        _context = context;
        _logger = logger;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<AppointmentDto>>> Get(
        [FromQuery] int? patientId,
        [FromQuery] string? status,
        [FromQuery] DateTime? from,
        [FromQuery] DateTime? to)
    {
        var query = _context.Appointments.Include(a => a.Patient).AsQueryable();

        if (patientId.HasValue) query = query.Where(a => a.PatientId == patientId.Value);
        if (!string.IsNullOrWhiteSpace(status)) query = query.Where(a => a.Status == status);
        if (from.HasValue) query = query.Where(a => a.ScheduledAt >= from.Value);
        if (to.HasValue) query = query.Where(a => a.ScheduledAt <= to.Value);

        var items = await query
            .OrderBy(a => a.ScheduledAt)
            .Select(a => ToDto(a))
            .ToListAsync();

        return Ok(items);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<AppointmentDto>> GetById(int id)
    {
        var appt = await _context.Appointments.Include(a => a.Patient).FirstOrDefaultAsync(a => a.Id == id);
        return appt is null ? NotFound() : Ok(ToDto(appt));
    }

    [HttpPost]
    [Authorize(Roles = "Doctor,Admin,Nurse")]
    public async Task<ActionResult<AppointmentDto>> Create([FromBody] AppointmentDto dto)
    {
        if (dto.PatientId <= 0) return BadRequest(new { message = "patientId is required." });
        if (string.IsNullOrWhiteSpace(dto.ScheduledAt)) return BadRequest(new { message = "scheduledAt is required." });
        if (!DateTime.TryParse(dto.ScheduledAt, out var scheduled))
            return BadRequest(new { message = "scheduledAt must be a valid date/time." });

        var patientExists = await _context.Patients.AnyAsync(p => p.Id == dto.PatientId);
        if (!patientExists) return NotFound(new { message = "Patient not found." });

        var status = ValidStatuses.Contains(dto.Status) ? dto.Status : "Scheduled";

        var entity = new Appointment
        {
            PatientId = dto.PatientId,
            ScheduledAt = scheduled,
            DurationMinutes = dto.DurationMinutes <= 0 ? 30 : dto.DurationMinutes,
            Reason = dto.Reason ?? string.Empty,
            Status = status,
            Notes = dto.Notes,
            CreatedAt = DateTime.UtcNow,
        };

        _context.Appointments.Add(entity);
        await _context.SaveChangesAsync();
        await _context.Entry(entity).Reference(a => a.Patient).LoadAsync();

        _logger.LogInformation("Appointment created {Id} for patient {PatientId}", entity.Id, entity.PatientId);
        return CreatedAtAction(nameof(GetById), new { id = entity.Id }, ToDto(entity));
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "Doctor,Admin,Nurse")]
    public async Task<IActionResult> Update(int id, [FromBody] AppointmentDto dto)
    {
        var entity = await _context.Appointments.FindAsync(id);
        if (entity is null) return NotFound();

        if (!DateTime.TryParse(dto.ScheduledAt, out var scheduled))
            return BadRequest(new { message = "scheduledAt must be a valid date/time." });

        entity.ScheduledAt = scheduled;
        entity.DurationMinutes = dto.DurationMinutes <= 0 ? entity.DurationMinutes : dto.DurationMinutes;
        entity.Reason = dto.Reason ?? entity.Reason;
        entity.Notes = dto.Notes;
        if (ValidStatuses.Contains(dto.Status)) entity.Status = dto.Status;
        entity.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();
        return NoContent();
    }

    [HttpPatch("{id}/status")]
    [Authorize(Roles = "Doctor,Admin,Nurse")]
    public async Task<IActionResult> UpdateStatus(int id, [FromBody] UpdateAppointmentStatusDto dto)
    {
        if (!ValidStatuses.Contains(dto.Status))
            return BadRequest(new { message = $"Status must be one of: {string.Join(", ", ValidStatuses)}." });

        var entity = await _context.Appointments.FindAsync(id);
        if (entity is null) return NotFound();

        entity.Status = dto.Status;
        entity.UpdatedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "Doctor,Admin")]
    public async Task<IActionResult> Delete(int id)
    {
        var entity = await _context.Appointments.FindAsync(id);
        if (entity is null) return NotFound();

        _context.Appointments.Remove(entity);
        await _context.SaveChangesAsync();
        return NoContent();
    }

    private static AppointmentDto ToDto(Appointment a) => new()
    {
        Id = a.Id,
        PatientId = a.PatientId,
        PatientName = a.Patient?.Name,
        ScheduledAt = a.ScheduledAt.ToString("yyyy-MM-ddTHH:mm:ss"),
        DurationMinutes = a.DurationMinutes,
        Reason = a.Reason,
        Status = a.Status,
        Notes = a.Notes,
    };
}
