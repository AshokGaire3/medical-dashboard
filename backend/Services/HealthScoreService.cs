using MedicalDashboard.Api.Models;
using MedicalDashboard.Api.Models.DTOs;

namespace MedicalDashboard.Api.Services;

public interface IHealthScoreService
{
    HealthScoreDto Score(Vital vital);
}

// NEWS2 (National Early Warning Score 2) — Royal College of Physicians, UK.
// Aggregate score ranges 0-20. Risk bands per RCP guidance:
//   0       → Low (routine monitoring)
//   1-4     → Low-Medium
//   5-6     → Medium (urgent review)
//   >=7     → High (emergency response)
// Single-parameter score of 3 also escalates to Medium regardless of total.
public class HealthScoreService : IHealthScoreService
{
    public HealthScoreDto Score(Vital v)
    {
        var components = new List<HealthScoreComponentDto>
        {
            ScoreRespiratoryRate(v.RespiratoryRate),
            ScoreOxygenSaturation(v.OxygenSaturation),
            ScoreSystolicBp(v.BloodPressureSystemic),
            ScoreHeartRate(v.HeartRate),
            ScoreTemperature(v.Temperature),
        };

        var total = components.Sum(c => c.Points);
        var anyRedFlag = components.Any(c => c.Points >= 3);
        var band = ClassifyBand(total, anyRedFlag);

        return new HealthScoreDto
        {
            Total = total,
            Band = band,
            BandLabel = BandLabel(band),
            Recommendation = Recommendation(band),
            ComputedAt = DateTime.UtcNow.ToString("yyyy-MM-ddTHH:mm:ssZ"),
            VitalId = v.Id,
            VitalTimestamp = v.Timestamp.ToString("yyyy-MM-ddTHH:mm:ss"),
            Components = components,
        };
    }

    private static HealthScoreComponentDto ScoreRespiratoryRate(int rr)
    {
        var p = rr switch
        {
            <= 8 => 3,
            >= 9 and <= 11 => 1,
            >= 12 and <= 20 => 0,
            >= 21 and <= 24 => 2,
            _ => 3,
        };
        return new HealthScoreComponentDto
        {
            Parameter = "RespiratoryRate",
            Value = $"{rr} /min",
            Points = p,
        };
    }

    private static HealthScoreComponentDto ScoreOxygenSaturation(int spo2)
    {
        var p = spo2 switch
        {
            <= 91 => 3,
            >= 92 and <= 93 => 2,
            >= 94 and <= 95 => 1,
            _ => 0,
        };
        return new HealthScoreComponentDto
        {
            Parameter = "OxygenSaturation",
            Value = $"{spo2}%",
            Points = p,
        };
    }

    private static HealthScoreComponentDto ScoreSystolicBp(int sbp)
    {
        var p = sbp switch
        {
            <= 90 => 3,
            >= 91 and <= 100 => 2,
            >= 101 and <= 110 => 1,
            >= 111 and <= 219 => 0,
            _ => 3,
        };
        return new HealthScoreComponentDto
        {
            Parameter = "SystolicBp",
            Value = $"{sbp} mmHg",
            Points = p,
        };
    }

    private static HealthScoreComponentDto ScoreHeartRate(int hr)
    {
        var p = hr switch
        {
            <= 40 => 3,
            >= 41 and <= 50 => 1,
            >= 51 and <= 90 => 0,
            >= 91 and <= 110 => 1,
            >= 111 and <= 130 => 2,
            _ => 3,
        };
        return new HealthScoreComponentDto
        {
            Parameter = "HeartRate",
            Value = $"{hr} bpm",
            Points = p,
        };
    }

    private static HealthScoreComponentDto ScoreTemperature(double tempF)
    {
        // App stores Fahrenheit; NEWS2 thresholds are in Celsius. Convert.
        var c = (tempF - 32.0) * 5.0 / 9.0;
        var p = c switch
        {
            <= 35.0 => 3,
            > 35.0 and <= 36.0 => 1,
            > 36.0 and <= 38.0 => 0,
            > 38.0 and <= 39.0 => 1,
            _ => 2,
        };
        return new HealthScoreComponentDto
        {
            Parameter = "Temperature",
            Value = $"{tempF:0.0}°F",
            Points = p,
        };
    }

    private static string ClassifyBand(int total, bool anyRedFlag)
    {
        if (total >= 7) return "High";
        if (total >= 5 || anyRedFlag) return "Medium";
        if (total >= 1) return "LowMedium";
        return "Low";
    }

    private static string BandLabel(string band) => band switch
    {
        "High" => "High risk",
        "Medium" => "Medium risk",
        "LowMedium" => "Low-medium risk",
        _ => "Low risk",
    };

    private static string Recommendation(string band) => band switch
    {
        "High" => "Emergency assessment by a clinical team with critical care competencies. Continuous monitoring.",
        "Medium" => "Urgent review by a clinician within 1 hour. Increase monitoring frequency to at least hourly.",
        "LowMedium" => "Ward-based response. Monitoring at minimum every 4-6 hours.",
        _ => "Routine monitoring. Reassess at standard interval.",
    };
}
