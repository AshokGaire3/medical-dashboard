using FluentValidation;
using MedicalDashboard.Api.Models.DTOs;

namespace MedicalDashboard.Api.Validation;

public class MedicalConditionDtoValidator : AbstractValidator<MedicalConditionDto>
{
    private static readonly string[] AllowedSeverities = { "Mild", "Moderate", "Severe" };
    private static readonly string[] AllowedStatuses = { "Active", "Resolved", "Chronic" };

    public MedicalConditionDtoValidator()
    {
        RuleFor(x => x.PatientId).GreaterThan(0).WithMessage("patientId is required.");
        RuleFor(x => x.Condition).NotEmpty().MaximumLength(200);
        RuleFor(x => x.DiagnosedDate)
            .NotEmpty().WithMessage("diagnosedDate is required.")
            .Must(BeAValidDate).WithMessage("diagnosedDate must be a valid date.");
        RuleFor(x => x.Severity)
            .Must(s => string.IsNullOrWhiteSpace(s) || AllowedSeverities.Contains(s))
            .WithMessage($"severity must be one of: {string.Join(", ", AllowedSeverities)}.");
        RuleFor(x => x.Status)
            .Must(s => string.IsNullOrWhiteSpace(s) || AllowedStatuses.Contains(s))
            .WithMessage($"status must be one of: {string.Join(", ", AllowedStatuses)}.");
    }

    private static bool BeAValidDate(string value) => DateTime.TryParse(value, out _);
}
