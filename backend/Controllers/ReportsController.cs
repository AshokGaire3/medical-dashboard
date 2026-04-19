using System.Text;
using MedicalDashboard.Api.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace MedicalDashboard.Api.Controllers;

[ApiController]
[Authorize]
[Route("api/[controller]")]
public class ReportsController : ControllerBase
{
    private readonly MedicalContext _context;

    public ReportsController(MedicalContext context) => _context = context;

    [HttpGet("patients.csv")]
    public async Task<IActionResult> PatientsCsv()
    {
        var patients = await _context.Patients
            .OrderBy(p => p.Name)
            .Select(p => new
            {
                p.Id,
                p.Name,
                p.Age,
                p.Gender,
                p.Condition,
                p.Status,
                p.IsCurrentPatient,
                p.LastVisit,
                p.AdmissionDate,
                p.DischargeDate,
                p.ContactEmail,
                p.ContactPhone
            })
            .ToListAsync();

        var sb = new StringBuilder();
        sb.AppendLine("Id,Name,Age,Gender,Condition,Status,IsCurrentPatient,LastVisit,AdmissionDate,DischargeDate,Email,Phone");
        foreach (var p in patients)
        {
            sb.Append(p.Id).Append(',')
              .Append(Csv(p.Name)).Append(',')
              .Append(p.Age).Append(',')
              .Append(Csv(p.Gender)).Append(',')
              .Append(Csv(p.Condition)).Append(',')
              .Append(Csv(p.Status)).Append(',')
              .Append(p.IsCurrentPatient).Append(',')
              .Append(p.LastVisit.ToString("yyyy-MM-dd")).Append(',')
              .Append(p.AdmissionDate?.ToString("yyyy-MM-dd") ?? "").Append(',')
              .Append(p.DischargeDate?.ToString("yyyy-MM-dd") ?? "").Append(',')
              .Append(Csv(p.ContactEmail)).Append(',')
              .Append(Csv(p.ContactPhone)).AppendLine();
        }

        return File(Encoding.UTF8.GetBytes(sb.ToString()), "text/csv", "patients.csv");
    }

    [HttpGet("patients.json")]
    public async Task<IActionResult> PatientsJson()
    {
        var patients = await _context.Patients
            .Include(p => p.Vitals)
            .Include(p => p.MedicalHistory)
            .Include(p => p.Medications)
            .Include(p => p.TestResults)
            .ToListAsync();
        return Ok(patients);
    }

    private static string Csv(string? value)
    {
        if (string.IsNullOrEmpty(value)) return "";
        var needsQuotes = value.Contains(',') || value.Contains('"') || value.Contains('\n');
        var escaped = value.Replace("\"", "\"\"");
        return needsQuotes ? $"\"{escaped}\"" : escaped;
    }
}
