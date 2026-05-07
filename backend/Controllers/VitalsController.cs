using MedicalDashboard.Api.Auth;
using MedicalDashboard.Api.Data;
using MedicalDashboard.Api.Hubs;
using MedicalDashboard.Api.Models;
using MedicalDashboard.Api.Models.DTOs;
using MedicalDashboard.Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;

namespace MedicalDashboard.Api.Controllers;

[ApiController]
[Authorize]
[Route("api/[controller]")]
public class VitalsController : ControllerBase
{
    private readonly MedicalContext _context;
    private readonly ILogger<VitalsController> _logger;
    private readonly IHubContext<VitalsHub> _hub;
    private readonly IHealthScoreService _healthScore;

    public VitalsController(
        MedicalContext context,
        ILogger<VitalsController> logger,
        IHubContext<VitalsHub> hub,
        IHealthScoreService healthScore)
    {
        _context = context;
        _logger = logger;
        _hub = hub;
        _healthScore = healthScore;
    }

    // GET: api/vitals
    [HttpGet]
    public async Task<ActionResult<IEnumerable<VitalDto>>> GetVitals([FromQuery] int? patientId = null)
    {
        try
        {
            // Restrict to vitals belonging to patients in the caller's roster.
            var rosterIds = _context.Patients.ScopedToCaller(User).Select(p => p.Id);
            var query = _context.Vitals.Where(v => rosterIds.Contains(v.PatientId));

            if (patientId.HasValue)
            {
                query = query.Where(v => v.PatientId == patientId.Value);
            }

            var vitals = await query
                .OrderByDescending(v => v.Timestamp)
                .ToListAsync();

            var vitalDtos = vitals.Select(v => MapToDto(v)).ToList();
            return Ok(vitalDtos);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching vitals");
            return StatusCode(500, "An error occurred while fetching vitals");
        }
    }

    // GET: api/vitals/5
    [HttpGet("{id}")]
    public async Task<ActionResult<VitalDto>> GetVital(int id)
    {
        try
        {
            var vital = await _context.Vitals.FindAsync(id);

            if (vital == null)
            {
                return NotFound();
            }

            if (!await _context.Patients.CallerCanAccessPatientAsync(User, vital.PatientId))
                return NotFound();

            return Ok(MapToDto(vital));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching vital {VitalId}", id);
            return StatusCode(500, "An error occurred while fetching vital");
        }
    }

    // POST: api/vitals
    [HttpPost]
    [Authorize(Roles = "Doctor,Admin,Nurse")]
    public async Task<ActionResult<VitalDto>> CreateVital(VitalDto vitalDto)
    {
        try
        {
            if (!await _context.Patients.CallerCanAccessPatientAsync(User, vitalDto.PatientId))
                return NotFound(new { message = "Patient not found." });

            if (!DateTime.TryParse(vitalDto.Timestamp, out var ts))
                return BadRequest(new { message = "Timestamp must be a valid ISO date/time." });

            var vital = new Vital
            {
                PatientId = vitalDto.PatientId,
                Timestamp = ts,
                HeartRate = vitalDto.HeartRate,
                BloodPressureSystemic = vitalDto.BloodPressureSystemic,
                BloodPressureDiastolic = vitalDto.BloodPressureDiastolic,
                Temperature = vitalDto.Temperature,
                OxygenSaturation = vitalDto.OxygenSaturation,
                RespiratoryRate = vitalDto.RespiratoryRate,
                CreatedAt = DateTime.UtcNow
            };

            _context.Vitals.Add(vital);
            await _context.SaveChangesAsync();

            var createdDto = MapToDto(vital);

            // Broadcast to anyone subscribed to this patient's group so live dashboards can update.
            // Includes the freshly-computed NEWS2 score so clients can flash alerts without a second request.
            var score = _healthScore.Score(vital);
            await _hub.Clients
                .Group($"patient-{vital.PatientId}")
                .SendAsync("VitalRecorded", new { vital = createdDto, score });

            return CreatedAtAction(nameof(GetVital), new { id = vital.Id }, createdDto);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating vital");
            return StatusCode(500, "An error occurred while creating vital");
        }
    }

    // PUT: api/vitals/5
    [HttpPut("{id}")]
    [Authorize(Roles = "Doctor,Admin,Nurse")]
    public async Task<IActionResult> UpdateVital(int id, VitalDto vitalDto)
    {
        if (id != vitalDto.Id)
        {
            return BadRequest();
        }

        try
        {
            var vital = await _context.Vitals.FindAsync(id);
            if (vital == null)
            {
                return NotFound();
            }

            if (!await _context.Patients.CallerCanAccessPatientAsync(User, vital.PatientId))
                return NotFound();

            if (!DateTime.TryParse(vitalDto.Timestamp, out var ts))
                return BadRequest(new { message = "Timestamp must be a valid ISO date/time." });

            vital.PatientId = vitalDto.PatientId;
            vital.Timestamp = ts;
            vital.HeartRate = vitalDto.HeartRate;
            vital.BloodPressureSystemic = vitalDto.BloodPressureSystemic;
            vital.BloodPressureDiastolic = vitalDto.BloodPressureDiastolic;
            vital.Temperature = vitalDto.Temperature;
            vital.OxygenSaturation = vitalDto.OxygenSaturation;
            vital.RespiratoryRate = vitalDto.RespiratoryRate;
            vital.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return NoContent();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating vital {VitalId}", id);
            return StatusCode(500, "An error occurred while updating vital");
        }
    }

    // DELETE: api/vitals/5
    [HttpDelete("{id}")]
    [Authorize(Roles = "Doctor,Admin")]
    public async Task<IActionResult> DeleteVital(int id)
    {
        try
        {
            var vital = await _context.Vitals.FindAsync(id);
            if (vital == null)
            {
                return NotFound();
            }

            if (!await _context.Patients.CallerCanAccessPatientAsync(User, vital.PatientId))
                return NotFound();

            _context.Vitals.Remove(vital);
            await _context.SaveChangesAsync();

            return NoContent();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting vital {VitalId}", id);
            return StatusCode(500, "An error occurred while deleting vital");
        }
    }

    private VitalDto MapToDto(Vital vital)
    {
        return new VitalDto
        {
            Id = vital.Id,
            PatientId = vital.PatientId,
            Timestamp = vital.Timestamp.ToString("yyyy-MM-ddTHH:mm:ss"),
            HeartRate = vital.HeartRate,
            BloodPressureSystemic = vital.BloodPressureSystemic,
            BloodPressureDiastolic = vital.BloodPressureDiastolic,
            Temperature = vital.Temperature,
            OxygenSaturation = vital.OxygenSaturation,
            RespiratoryRate = vital.RespiratoryRate,
            CreatedAt = vital.CreatedAt.ToString("yyyy-MM-ddTHH:mm:ss"),
            UpdatedAt = vital.UpdatedAt?.ToString("yyyy-MM-ddTHH:mm:ss")
        };
    }
}

