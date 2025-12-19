using MedicalDashboard.Api.Data;
using MedicalDashboard.Api.Models;
using MedicalDashboard.Api.Models.DTOs;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace MedicalDashboard.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class VitalsController : ControllerBase
{
    private readonly MedicalContext _context;
    private readonly ILogger<VitalsController> _logger;

    public VitalsController(MedicalContext context, ILogger<VitalsController> logger)
    {
        _context = context;
        _logger = logger;
    }

    // GET: api/vitals
    [HttpGet]
    public async Task<ActionResult<IEnumerable<VitalDto>>> GetVitals([FromQuery] int? patientId = null)
    {
        try
        {
            var query = _context.Vitals.AsQueryable();

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
    public async Task<ActionResult<VitalDto>> CreateVital(VitalDto vitalDto)
    {
        try
        {
            var vital = new Vital
            {
                PatientId = vitalDto.PatientId,
                Timestamp = DateTime.Parse(vitalDto.Timestamp),
                HeartRate = vitalDto.HeartRate,
                BloodPressureSystemic = vitalDto.BloodPressureSystemic,
                BloodPressureDiastolic = vitalDto.BloodPressureDiastolic,
                Temperature = vitalDto.Temperature,
                OxygenSaturation = vitalDto.OxygenSaturation,
                RespiratoryRate = vitalDto.RespiratoryRate
            };

            _context.Vitals.Add(vital);
            await _context.SaveChangesAsync();

            var createdDto = MapToDto(vital);
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

            vital.PatientId = vitalDto.PatientId;
            vital.Timestamp = DateTime.Parse(vitalDto.Timestamp);
            vital.HeartRate = vitalDto.HeartRate;
            vital.BloodPressureSystemic = vitalDto.BloodPressureSystemic;
            vital.BloodPressureDiastolic = vitalDto.BloodPressureDiastolic;
            vital.Temperature = vitalDto.Temperature;
            vital.OxygenSaturation = vitalDto.OxygenSaturation;
            vital.RespiratoryRate = vitalDto.RespiratoryRate;

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
    public async Task<IActionResult> DeleteVital(int id)
    {
        try
        {
            var vital = await _context.Vitals.FindAsync(id);
            if (vital == null)
            {
                return NotFound();
            }

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
            RespiratoryRate = vital.RespiratoryRate
        };
    }
}

