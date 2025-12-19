using MedicalDashboard.Api.Models;
using MedicalDashboard.Api.Models.DTOs;

namespace MedicalDashboard.Api.Services;

public interface IPatientService
{
    Task<IEnumerable<PatientDto>> GetAllPatientsAsync();
    Task<PatientDto?> GetPatientByIdAsync(int id);
    Task<PatientDto> CreatePatientAsync(PatientDto patientDto);
    Task<bool> UpdatePatientAsync(int id, PatientDto patientDto);
    Task<bool> DeletePatientAsync(int id);
}

