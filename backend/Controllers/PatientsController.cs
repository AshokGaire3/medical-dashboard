using MedicalDashboard.Api.Data;
using MedicalDashboard.Api.Models;
using MedicalDashboard.Api.Models.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;

namespace MedicalDashboard.Api.Controllers;

[ApiController]
[Authorize]
[Route("api/[controller]")]
public class PatientsController : ControllerBase
{
    private readonly MedicalContext _context;
    private readonly ILogger<PatientsController> _logger;

    public PatientsController(MedicalContext context, ILogger<PatientsController> logger)
    {
        _context = context;
        _logger = logger;
    }

    // GET: api/patients?search=&status=&isCurrent=&page=&pageSize=&sortBy=&sortDir=
    [HttpGet]
    public async Task<ActionResult<PagedResultDto<PatientDto>>> GetPatients(
        [FromQuery] string? search,
        [FromQuery] string? status,
        [FromQuery] bool? isCurrent,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20,
        [FromQuery] string sortBy = "name",
        [FromQuery] string sortDir = "asc")
    {
        page = Math.Max(1, page);
        pageSize = Math.Clamp(pageSize, 1, 100);

        var query = _context.Patients
            .Include(p => p.Vitals)
            .Include(p => p.MedicalHistory)
            .Include(p => p.Medications)
            .Include(p => p.TestResults)
            .AsQueryable();

        if (!string.IsNullOrWhiteSpace(search))
        {
            var term = search.Trim().ToLower();
            query = query.Where(p =>
                p.Name.ToLower().Contains(term) ||
                p.Condition.ToLower().Contains(term));
        }

        if (!string.IsNullOrWhiteSpace(status))
            query = query.Where(p => p.Status == status);

        if (isCurrent.HasValue)
            query = query.Where(p => p.IsCurrentPatient == isCurrent.Value);

        query = (sortBy?.ToLower(), sortDir?.ToLower()) switch
        {
            ("age", "desc") => query.OrderByDescending(p => p.Age),
            ("age", _) => query.OrderBy(p => p.Age),
            ("lastvisit", "desc") => query.OrderByDescending(p => p.LastVisit),
            ("lastvisit", _) => query.OrderBy(p => p.LastVisit),
            (_, "desc") => query.OrderByDescending(p => p.Name),
            _ => query.OrderBy(p => p.Name),
        };

        var total = await query.CountAsync();
        var patients = await query
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        return Ok(new PagedResultDto<PatientDto>
        {
            Items = patients.Select(MapToDto).ToList(),
            Page = page,
            PageSize = pageSize,
            Total = total,
        });
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<PatientDto>> GetPatient(int id)
    {
        var patient = await _context.Patients
            .Include(p => p.Vitals)
            .Include(p => p.MedicalHistory)
            .Include(p => p.Medications)
            .Include(p => p.TestResults)
            .FirstOrDefaultAsync(p => p.Id == id);

        return patient is null ? NotFound() : Ok(MapToDto(patient));
    }

    [HttpPost]
    public async Task<ActionResult<PatientDto>> CreatePatient(PatientDto patientDto)
    {
        if (string.IsNullOrWhiteSpace(patientDto.Name))
            return BadRequest(new { message = "Name is required." });
        if (patientDto.Age < 0 || patientDto.Age > 130)
            return BadRequest(new { message = "Age must be between 0 and 130." });

        var patient = MapFromDto(patientDto);
        patient.Id = 0;
        patient.CreatedAt = DateTime.UtcNow;

        _context.Patients.Add(patient);
        await _context.SaveChangesAsync();

        _logger.LogInformation("Patient created {PatientId}", patient.Id);
        return CreatedAtAction(nameof(GetPatient), new { id = patient.Id }, MapToDto(patient));
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdatePatient(int id, PatientDto patientDto)
    {
        if (id != patientDto.Id) return BadRequest();

        var patient = await _context.Patients.FindAsync(id);
        if (patient is null) return NotFound();

        UpdatePatientFromDto(patient, patientDto);
        patient.UpdatedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "Doctor,Admin")]
    public async Task<IActionResult> DeletePatient(int id)
    {
        var patient = await _context.Patients.FindAsync(id);
        if (patient is null) return NotFound();

        _context.Patients.Remove(patient);
        await _context.SaveChangesAsync();
        _logger.LogInformation("Patient deleted {PatientId}", id);
        return NoContent();
    }

    private static PatientDto MapToDto(Patient patient)
    {
        List<string> allergies;
        try
        {
            allergies = JsonSerializer.Deserialize<List<string>>(patient.AllergiesJson) ?? new List<string>();
        }
        catch
        {
            allergies = new List<string>();
        }

        return new PatientDto
        {
            Id = patient.Id,
            Name = patient.Name,
            Age = patient.Age,
            Gender = patient.Gender,
            Condition = patient.Condition,
            Status = patient.Status,
            LastVisit = patient.LastVisit.ToString("yyyy-MM-dd"),
            AdmissionDate = patient.AdmissionDate?.ToString("yyyy-MM-dd"),
            DischargeDate = patient.DischargeDate?.ToString("yyyy-MM-dd"),
            TreatmentStartDate = patient.TreatmentStartDate?.ToString("yyyy-MM-dd"),
            IsCurrentPatient = patient.IsCurrentPatient,
            TreatmentNotes = patient.TreatmentNotes,
            ContactInfo = new ContactInfoDto
            {
                Phone = patient.ContactPhone,
                Email = patient.ContactEmail,
                Address = patient.ContactAddress
            },
            EmergencyContact = new EmergencyContactDto
            {
                Name = patient.EmergencyContactName,
                Relationship = patient.EmergencyContactRelationship,
                Phone = patient.EmergencyContactPhone
            },
            Allergies = allergies,
            Vitals = patient.Vitals.Select(v => new VitalDto
            {
                Id = v.Id,
                PatientId = v.PatientId,
                Timestamp = v.Timestamp.ToString("yyyy-MM-ddTHH:mm:ss"),
                HeartRate = v.HeartRate,
                BloodPressureSystemic = v.BloodPressureSystemic,
                BloodPressureDiastolic = v.BloodPressureDiastolic,
                Temperature = v.Temperature,
                OxygenSaturation = v.OxygenSaturation,
                RespiratoryRate = v.RespiratoryRate
            }).ToList(),
            MedicalHistory = patient.MedicalHistory.Select(mc => new MedicalConditionDto
            {
                Id = mc.Id,
                PatientId = mc.PatientId,
                Condition = mc.Condition,
                DiagnosedDate = mc.DiagnosedDate.ToString("yyyy-MM-dd"),
                Severity = mc.Severity,
                Status = mc.Status,
                Notes = mc.Notes
            }).ToList(),
            Medications = patient.Medications.Select(m => new MedicationDto
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
                Notes = m.Notes
            }).ToList(),
            TestResults = patient.TestResults.Select(tr => new TestResultDto
            {
                Id = tr.Id,
                PatientId = tr.PatientId,
                TestName = tr.TestName,
                TestType = tr.TestType,
                Date = tr.Date.ToString("yyyy-MM-dd"),
                Result = tr.Result,
                NormalRange = tr.NormalRange,
                Status = tr.Status,
                OrderedBy = tr.OrderedBy,
                Notes = tr.Notes
            }).ToList()
        };
    }

    private static Patient MapFromDto(PatientDto dto)
    {
        var allergiesJson = JsonSerializer.Serialize(dto.Allergies ?? new List<string>());

        return new Patient
        {
            Id = dto.Id,
            Name = dto.Name,
            Age = dto.Age,
            Gender = dto.Gender,
            Condition = dto.Condition,
            Status = dto.Status,
            LastVisit = DateTime.TryParse(dto.LastVisit, out var lv) ? lv : DateTime.UtcNow,
            AdmissionDate = TryParse(dto.AdmissionDate),
            DischargeDate = TryParse(dto.DischargeDate),
            TreatmentStartDate = TryParse(dto.TreatmentStartDate),
            IsCurrentPatient = dto.IsCurrentPatient,
            TreatmentNotes = dto.TreatmentNotes,
            ContactPhone = dto.ContactInfo?.Phone ?? string.Empty,
            ContactEmail = dto.ContactInfo?.Email ?? string.Empty,
            ContactAddress = dto.ContactInfo?.Address ?? string.Empty,
            EmergencyContactName = dto.EmergencyContact?.Name ?? string.Empty,
            EmergencyContactRelationship = dto.EmergencyContact?.Relationship ?? string.Empty,
            EmergencyContactPhone = dto.EmergencyContact?.Phone ?? string.Empty,
            AllergiesJson = allergiesJson,
        };
    }

    private static void UpdatePatientFromDto(Patient patient, PatientDto dto)
    {
        var allergiesJson = JsonSerializer.Serialize(dto.Allergies ?? new List<string>());

        patient.Name = dto.Name;
        patient.Age = dto.Age;
        patient.Gender = dto.Gender;
        patient.Condition = dto.Condition;
        patient.Status = dto.Status;
        if (DateTime.TryParse(dto.LastVisit, out var lv)) patient.LastVisit = lv;
        patient.AdmissionDate = TryParse(dto.AdmissionDate);
        patient.DischargeDate = TryParse(dto.DischargeDate);
        patient.TreatmentStartDate = TryParse(dto.TreatmentStartDate);
        patient.IsCurrentPatient = dto.IsCurrentPatient;
        patient.TreatmentNotes = dto.TreatmentNotes;
        patient.ContactPhone = dto.ContactInfo?.Phone ?? string.Empty;
        patient.ContactEmail = dto.ContactInfo?.Email ?? string.Empty;
        patient.ContactAddress = dto.ContactInfo?.Address ?? string.Empty;
        patient.EmergencyContactName = dto.EmergencyContact?.Name ?? string.Empty;
        patient.EmergencyContactRelationship = dto.EmergencyContact?.Relationship ?? string.Empty;
        patient.EmergencyContactPhone = dto.EmergencyContact?.Phone ?? string.Empty;
        patient.AllergiesJson = allergiesJson;
    }

    private static DateTime? TryParse(string? s)
        => DateTime.TryParse(s, out var d) ? d : null;
}
