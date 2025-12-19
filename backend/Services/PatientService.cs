using MedicalDashboard.Api.Data;
using MedicalDashboard.Api.Models;
using MedicalDashboard.Api.Models.DTOs;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;

namespace MedicalDashboard.Api.Services;

public class PatientService : IPatientService
{
    private readonly MedicalContext _context;
    private readonly ILogger<PatientService> _logger;

    public PatientService(MedicalContext context, ILogger<PatientService> logger)
    {
        _context = context;
        _logger = logger;
    }

    public async Task<IEnumerable<PatientDto>> GetAllPatientsAsync()
    {
        var patients = await _context.Patients
            .Include(p => p.Vitals)
            .Include(p => p.MedicalHistory)
            .Include(p => p.Medications)
            .Include(p => p.TestResults)
            .ToListAsync();

        return patients.Select(MapToDto);
    }

    public async Task<PatientDto?> GetPatientByIdAsync(int id)
    {
        var patient = await _context.Patients
            .Include(p => p.Vitals)
            .Include(p => p.MedicalHistory)
            .Include(p => p.Medications)
            .Include(p => p.TestResults)
            .FirstOrDefaultAsync(p => p.Id == id);

        return patient != null ? MapToDto(patient) : null;
    }

    public async Task<PatientDto> CreatePatientAsync(PatientDto patientDto)
    {
        var patient = MapFromDto(patientDto);
        _context.Patients.Add(patient);
        await _context.SaveChangesAsync();
        return MapToDto(patient);
    }

    public async Task<bool> UpdatePatientAsync(int id, PatientDto patientDto)
    {
        var patient = await _context.Patients.FindAsync(id);
        if (patient == null) return false;

        UpdatePatientFromDto(patient, patientDto);
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<bool> DeletePatientAsync(int id)
    {
        var patient = await _context.Patients.FindAsync(id);
        if (patient == null) return false;

        _context.Patients.Remove(patient);
        await _context.SaveChangesAsync();
        return true;
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

