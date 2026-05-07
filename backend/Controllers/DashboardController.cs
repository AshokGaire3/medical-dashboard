using MedicalDashboard.Api.Data;
using MedicalDashboard.Api.Models.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace MedicalDashboard.Api.Controllers;

[ApiController]
[Authorize]
[Route("api/[controller]")]
public class DashboardController : ControllerBase
{
    private readonly MedicalContext _context;
    private readonly ILogger<DashboardController> _logger;

    public DashboardController(MedicalContext context, ILogger<DashboardController> logger)
    {
        _context = context;
        _logger = logger;
    }

    [HttpGet("metrics")]
    public async Task<ActionResult<DashboardMetricsDto>> GetDashboardMetrics()
    {
        var totalPatients = await _context.Patients.CountAsync();
        var activePatients = await _context.Patients.CountAsync(p => p.IsCurrentPatient);
        var criticalCases = await _context.Patients.CountAsync(p => p.Status == "Critical");

        var currentPatients = activePatients;
        var recoveredPatients = await _context.Patients.CountAsync(p => p.Status == "Recovered");
        var dischargedPatients = await _context.Patients.CountAsync(p => p.Status == "Discharged");

        var averageHeartRate = await _context.Vitals
            .Where(v => v.HeartRate > 0)
            .AverageAsync(v => (double?)v.HeartRate) ?? 0;

        var avgSystolic = await _context.Vitals
            .Where(v => v.BloodPressureSystemic > 0)
            .AverageAsync(v => (double?)v.BloodPressureSystemic) ?? 0;

        var avgDiastolic = await _context.Vitals
            .Where(v => v.BloodPressureDiastolic > 0)
            .AverageAsync(v => (double?)v.BloodPressureDiastolic) ?? 0;

        var averageBloodPressure = $"{Math.Round(avgSystolic)}/{Math.Round(avgDiastolic)}";

        var commonConditions = await _context.Patients
            .GroupBy(p => p.Condition)
            .Select(g => new ConditionCountDto { Condition = g.Key, Count = g.Count() })
            .OrderByDescending(c => c.Count)
            .Take(10)
            .ToListAsync();

        return Ok(new DashboardMetricsDto
        {
            TotalPatients = totalPatients,
            ActivePatients = activePatients,
            CriticalCases = criticalCases,
            AverageHeartRate = Math.Round(averageHeartRate, 1),
            AverageBloodPressure = averageBloodPressure,
            CommonConditions = commonConditions,
            LifetimePatients = totalPatients,
            CurrentPatients = currentPatients,
            RecoveredPatients = recoveredPatients,
            DischargedPatients = dischargedPatients,
        });
    }

    [HttpGet("vitals-trend")]
    public async Task<IActionResult> GetVitalsTrend([FromQuery] int days = 7, [FromQuery] int? patientId = null)
    {
        days = Math.Clamp(days, 1, 90);
        var since = DateTime.UtcNow.AddDays(-days);

        var query = _context.Vitals.Where(v => v.Timestamp >= since);
        if (patientId.HasValue) query = query.Where(v => v.PatientId == patientId.Value);

        var raw = await query
            .OrderBy(v => v.Timestamp)
            .Select(v => new
            {
                v.Timestamp,
                v.HeartRate,
                v.BloodPressureSystemic,
                v.BloodPressureDiastolic,
                v.Temperature,
                v.OxygenSaturation,
                v.RespiratoryRate
            })
            .ToListAsync();

        var grouped = raw
            .GroupBy(v => v.Timestamp.Date)
            .OrderBy(g => g.Key)
            .Select(g => new
            {
                date = g.Key.ToString("yyyy-MM-dd"),
                heartRate = Math.Round(g.Average(x => (double)x.HeartRate), 1),
                systolicBP = Math.Round(g.Average(x => (double)x.BloodPressureSystemic), 1),
                diastolicBP = Math.Round(g.Average(x => (double)x.BloodPressureDiastolic), 1),
                temperature = Math.Round(g.Average(x => x.Temperature), 1),
                oxygenSat = Math.Round(g.Average(x => (double)x.OxygenSaturation), 1),
                respiratoryRate = Math.Round(g.Average(x => (double)x.RespiratoryRate), 1),
            })
            .ToList();

        return Ok(grouped);
    }

    [HttpGet("alerts")]
    public async Task<IActionResult> GetAlerts()
    {
        // Correlated anti-join: keep only the vital for which no later vital
        // exists for the same patient. This is reliably translated to SQL by
        // EF Core and avoids loading every vital into memory.
        var latestPerPatient = await _context.Vitals
            .Where(v => !_context.Vitals.Any(v2 =>
                v2.PatientId == v.PatientId && v2.Timestamp > v.Timestamp))
            .ToListAsync();

        var patientMap = await _context.Patients
            .Where(p => p.IsCurrentPatient)
            .ToDictionaryAsync(p => p.Id, p => p.Name);

        var alerts = new List<object>();
        foreach (var v in latestPerPatient)
        {
            if (!patientMap.TryGetValue(v.PatientId, out var name)) continue;

            if (v.BloodPressureSystemic >= 160 || v.BloodPressureDiastolic >= 100)
                alerts.Add(new { patient = name, patientId = v.PatientId, vital = "Blood Pressure",
                    value = $"{v.BloodPressureSystemic}/{v.BloodPressureDiastolic}", severity = "Critical",
                    timestamp = v.Timestamp.ToString("yyyy-MM-ddTHH:mm:ss") });
            if (v.HeartRate >= 120 || v.HeartRate <= 45)
                alerts.Add(new { patient = name, patientId = v.PatientId, vital = "Heart Rate",
                    value = $"{v.HeartRate} bpm", severity = v.HeartRate >= 140 ? "Critical" : "High",
                    timestamp = v.Timestamp.ToString("yyyy-MM-ddTHH:mm:ss") });
            if (v.OxygenSaturation <= 92)
                alerts.Add(new { patient = name, patientId = v.PatientId, vital = "Oxygen Saturation",
                    value = $"{v.OxygenSaturation}%", severity = v.OxygenSaturation <= 88 ? "Critical" : "High",
                    timestamp = v.Timestamp.ToString("yyyy-MM-ddTHH:mm:ss") });
            if (v.Temperature >= 102.0 || v.Temperature <= 95.0)
                alerts.Add(new { patient = name, patientId = v.PatientId, vital = "Temperature",
                    value = $"{v.Temperature}°F", severity = v.Temperature >= 104 || v.Temperature <= 94 ? "Critical" : "High",
                    timestamp = v.Timestamp.ToString("yyyy-MM-ddTHH:mm:ss") });
        }

        return Ok(alerts);
    }
}
