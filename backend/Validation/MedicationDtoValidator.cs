using FluentValidation;
using MedicalDashboard.Api.Models.DTOs;

namespace MedicalDashboard.Api.Validation;

public class MedicationDtoValidator : AbstractValidator<MedicationDto>
{
    private static readonly string[] AllowedStatuses = { "Active", "Discontinued", "Completed" };

    public MedicationDtoValidator()
    {
        RuleFor(x => x.PatientId).GreaterThan(0).WithMessage("patientId is required.");
        RuleFor(x => x.Name).NotEmpty().MaximumLength(120);
        RuleFor(x => x.Dosage).NotEmpty().MaximumLength(60);
        RuleFor(x => x.Frequency).NotEmpty().MaximumLength(60);
        RuleFor(x => x.StartDate)
            .NotEmpty().WithMessage("startDate is required.")
            .Must(BeAValidDate).WithMessage("startDate must be a valid date.");
        RuleFor(x => x.EndDate)
            .Must(BeAValidOptionalDate).WithMessage("endDate must be a valid date.");
        RuleFor(x => x.PrescribedBy).NotEmpty().MaximumLength(120);
        RuleFor(x => x.Status)
            .Must(s => string.IsNullOrWhiteSpace(s) || AllowedStatuses.Contains(s))
            .WithMessage($"status must be one of: {string.Join(", ", AllowedStatuses)}.");
    }

    private static bool BeAValidDate(string value) => DateTime.TryParse(value, out _);
    private static bool BeAValidOptionalDate(string? value) =>
        string.IsNullOrWhiteSpace(value) || DateTime.TryParse(value, out _);
}
