using MedicalDashboard.Api.Data;
using MedicalDashboard.Api.Models;
using MedicalDashboard.Api.Models.DTOs;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;

namespace MedicalDashboard.Api.Controllers;

[ApiController]
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

    // GET: api/patients
    [HttpGet]
    public async Task<ActionResult<IEnumerable<PatientDto>>> GetPatients()
    {
        try
        {
            var patients = await _context.Patients
                .Include(p => p.Vitals)
                .Include(p => p.MedicalHistory)
                .Include(p => p.Medications)
                .Include(p => p.TestResults)
                .ToListAsync();

            var patientDtos = patients.Select(p => MapToDto(p)).ToList();
            return Ok(patientDtos);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching patients");
            return StatusCode(500, "An error occurred while fetching patients");
        }
    }

    // GET: api/patients/5
    [HttpGet("{id}")]
    public async Task<ActionResult<PatientDto>> GetPatient(int id)
    {
        try
        {
            var patient = await _context.Patients
                .Include(p => p.Vitals)
                .Include(p => p.MedicalHistory)
                .Include(p => p.Medications)
                .Include(p => p.TestResults)
                .FirstOrDefaultAsync(p => p.Id == id);

            if (patient == null)
            {
                return NotFound();
            }

            return Ok(MapToDto(patient));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching patient {PatientId}", id);
            return StatusCode(500, "An error occurred while fetching patient");
        }
    }

    // POST: api/patients
    [HttpPost]
    public async Task<ActionResult<PatientDto>> CreatePatient(PatientDto patientDto)
    {
        try
        {
            var patient = MapFromDto(patientDto);
            _context.Patients.Add(patient);
            await _context.SaveChangesAsync();

            var createdDto = MapToDto(patient);
            return CreatedAtAction(nameof(GetPatient), new { id = patient.Id }, createdDto);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating patient");
            return StatusCode(500, "An error occurred while creating patient");
        }
    }

    // PUT: api/patients/5
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdatePatient(int id, PatientDto patientDto)
    {
        if (id != patientDto.Id)
        {
            return BadRequest();
        }

        try
        {
            var patient = await _context.Patients.FindAsync(id);
            if (patient == null)
            {
                return NotFound();
            }

            UpdatePatientFromDto(patient, patientDto);
            await _context.SaveChangesAsync();

            return NoContent();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating patient {PatientId}", id);
            return StatusCode(500, "An error occurred while updating patient");
        }
    }

    // DELETE: api/patients/5
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeletePatient(int id)
    {
        try
        {
            var patient = await _context.Patients.FindAsync(id);
            if (patient == null)
            {
                return NotFound();
            }

            _context.Patients.Remove(patient);
            await _context.SaveChangesAsync();

            return NoContent();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting patient {PatientId}", id);
            return StatusCode(500, "An error occurred while deleting patient");
        }
    }

    private PatientDto MapToDto(Patient patient)
    {
        var allergies = JsonSerializer.Deserialize<List<string>>(patient.AllergiesJson) ?? new List<string>();

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
                Condition = mc.Condition,
                DiagnosedDate = mc.DiagnosedDate.ToString("yyyy-MM-dd"),
                Severity = mc.Severity,
                Status = mc.Status,
                Notes = mc.Notes
            }).ToList(),
            Medications = patient.Medications.Select(m => new MedicationDto
            {
                Id = m.Id,
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

    private Patient MapFromDto(PatientDto dto)
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
            LastVisit = DateTime.Parse(dto.LastVisit),
            AdmissionDate = dto.AdmissionDate != null ? DateTime.Parse(dto.AdmissionDate) : null,
            DischargeDate = dto.DischargeDate != null ? DateTime.Parse(dto.DischargeDate) : null,
            TreatmentStartDate = dto.TreatmentStartDate != null ? DateTime.Parse(dto.TreatmentStartDate) : null,
            IsCurrentPatient = dto.IsCurrentPatient,
            TreatmentNotes = dto.TreatmentNotes,
            ContactPhone = dto.ContactInfo.Phone,
            ContactEmail = dto.ContactInfo.Email,
            ContactAddress = dto.ContactInfo.Address,
            EmergencyContactName = dto.EmergencyContact.Name,
            EmergencyContactRelationship = dto.EmergencyContact.Relationship,
            EmergencyContactPhone = dto.EmergencyContact.Phone,
            AllergiesJson = allergiesJson
        };
    }

    private void UpdatePatientFromDto(Patient patient, PatientDto dto)
    {
        var allergiesJson = JsonSerializer.Serialize(dto.Allergies ?? new List<string>());

        patient.Name = dto.Name;
        patient.Age = dto.Age;
        patient.Gender = dto.Gender;
        patient.Condition = dto.Condition;
        patient.Status = dto.Status;
        patient.LastVisit = DateTime.Parse(dto.LastVisit);
        patient.AdmissionDate = dto.AdmissionDate != null ? DateTime.Parse(dto.AdmissionDate) : null;
        patient.DischargeDate = dto.DischargeDate != null ? DateTime.Parse(dto.DischargeDate) : null;
        patient.TreatmentStartDate = dto.TreatmentStartDate != null ? DateTime.Parse(dto.TreatmentStartDate) : null;
        patient.IsCurrentPatient = dto.IsCurrentPatient;
        patient.TreatmentNotes = dto.TreatmentNotes;
        patient.ContactPhone = dto.ContactInfo.Phone;
        patient.ContactEmail = dto.ContactInfo.Email;
        patient.ContactAddress = dto.ContactInfo.Address;
        patient.EmergencyContactName = dto.EmergencyContact.Name;
        patient.EmergencyContactRelationship = dto.EmergencyContact.Relationship;
        patient.EmergencyContactPhone = dto.EmergencyContact.Phone;
        patient.AllergiesJson = allergiesJson;
    }
}

