using FluentValidation;
using MedicalDashboard.Api.Models.DTOs;

namespace MedicalDashboard.Api.Validation;

public class VitalDtoValidator : AbstractValidator<VitalDto>
{
    public VitalDtoValidator()
    {
        RuleFor(x => x.PatientId).GreaterThan(0).WithMessage("patientId is required.");
        RuleFor(x => x.Timestamp)
            .NotEmpty().WithMessage("timestamp is required.")
            .Must(BeAValidDate).WithMessage("timestamp must be a valid date.");
        RuleFor(x => x.HeartRate).InclusiveBetween(20, 260)
            .WithMessage("heartRate must be between 20 and 260 bpm.");
        RuleFor(x => x.BloodPressureSystemic).InclusiveBetween(50, 260)
            .WithMessage("systolic must be between 50 and 260.");
        RuleFor(x => x.BloodPressureDiastolic).InclusiveBetween(30, 180)
            .WithMessage("diastolic must be between 30 and 180.");
        RuleFor(x => x.Temperature).InclusiveBetween(85.0, 115.0)
            .WithMessage("temperature must be within a plausible range (°F).");
        RuleFor(x => x.OxygenSaturation).InclusiveBetween(50, 100)
            .WithMessage("oxygenSaturation must be between 50 and 100.");
        RuleFor(x => x.RespiratoryRate).InclusiveBetween(4, 60)
            .WithMessage("respiratoryRate must be between 4 and 60.");
    }

    private static bool BeAValidDate(string value) => DateTime.TryParse(value, out _);
}
