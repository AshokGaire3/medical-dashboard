using MedicalDashboard.Api.Data;
using MedicalDashboard.Api.Models.DTOs;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace MedicalDashboard.Api.Controllers;

[ApiController]
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

    // GET: api/dashboard/metrics
    [HttpGet("metrics")]
    public async Task<ActionResult<DashboardMetricsDto>> GetDashboardMetrics()
    {
        try
        {
            var totalPatients = await _context.Patients.CountAsync();
            var activePatients = await _context.Patients.CountAsync(p => p.IsCurrentPatient);
            var criticalCases = await _context.Patients.CountAsync(p => p.Status == "Critical");
            
            var lifetimePatients = totalPatients;
            var currentPatients = await _context.Patients.CountAsync(p => p.IsCurrentPatient);
            var recoveredPatients = await _context.Patients.CountAsync(p => p.Status == "Recovered");
            var dischargedPatients = await _context.Patients.CountAsync(p => p.Status == "Discharged");

            // Calculate average heart rate from all vitals
            var averageHeartRate = await _context.Vitals
                .Where(v => v.HeartRate > 0)
                .AverageAsync(v => (double?)v.HeartRate) ?? 0;

            // Calculate average blood pressure
            var avgSystolic = await _context.Vitals
                .Where(v => v.BloodPressureSystemic > 0)
                .AverageAsync(v => (double?)v.BloodPressureSystemic) ?? 0;

            var avgDiastolic = await _context.Vitals
                .Where(v => v.BloodPressureDiastolic > 0)
                .AverageAsync(v => (double?)v.BloodPressureDiastolic) ?? 0;

            var averageBloodPressure = $"{Math.Round(avgSystolic)}/{Math.Round(avgDiastolic)}";

            // Get common conditions
            var commonConditions = await _context.Patients
                .GroupBy(p => p.Condition)
                .Select(g => new ConditionCountDto
                {
                    Condition = g.Key,
                    Count = g.Count()
                })
                .OrderByDescending(c => c.Count)
                .Take(10)
                .ToListAsync();

            var metrics = new DashboardMetricsDto
            {
                TotalPatients = totalPatients,
                ActivePatients = activePatients,
                CriticalCases = criticalCases,
                AverageHeartRate = Math.Round(averageHeartRate, 1),
                AverageBloodPressure = averageBloodPressure,
                CommonConditions = commonConditions,
                LifetimePatients = lifetimePatients,
                CurrentPatients = currentPatients,
                RecoveredPatients = recoveredPatients,
                DischargedPatients = dischargedPatients
            };

            return Ok(metrics);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching dashboard metrics");
            return StatusCode(500, "An error occurred while fetching dashboard metrics");
        }
    }
}

