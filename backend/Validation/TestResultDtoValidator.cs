using FluentValidation;
using MedicalDashboard.Api.Models.DTOs;

namespace MedicalDashboard.Api.Validation;

public class TestResultDtoValidator : AbstractValidator<TestResultDto>
{
    private static readonly string[] AllowedStatuses = { "Normal", "Abnormal", "Critical", "Pending" };

    public TestResultDtoValidator()
    {
        RuleFor(x => x.PatientId).GreaterThan(0).WithMessage("patientId is required.");
        RuleFor(x => x.TestName).NotEmpty().MaximumLength(120);
        RuleFor(x => x.TestType).NotEmpty().MaximumLength(60);
        RuleFor(x => x.Date)
            .NotEmpty().WithMessage("date is required.")
            .Must(BeAValidDate).WithMessage("date must be a valid date.");
        RuleFor(x => x.Result).NotEmpty().MaximumLength(500);
        RuleFor(x => x.Status)
            .Must(s => string.IsNullOrWhiteSpace(s) || AllowedStatuses.Contains(s))
            .WithMessage($"status must be one of: {string.Join(", ", AllowedStatuses)}.");
        RuleFor(x => x.OrderedBy).NotEmpty().MaximumLength(120);
    }

    private static bool BeAValidDate(string value) => DateTime.TryParse(value, out _);
}
