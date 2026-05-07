using FluentValidation;
using MedicalDashboard.Api.Models.DTOs;

namespace MedicalDashboard.Api.Validation;

public class PatientDtoValidator : AbstractValidator<PatientDto>
{
    private static readonly string[] AllowedGenders = { "Male", "Female", "Other", "Unknown" };
    private static readonly string[] AllowedStatuses = { "Stable", "Monitoring", "Critical", "Recovery" };

    public PatientDtoValidator()
    {
        RuleFor(x => x.Name).NotEmpty().MaximumLength(200);
        RuleFor(x => x.Age).InclusiveBetween(0, 130);
        RuleFor(x => x.Gender)
            .Must(g => string.IsNullOrWhiteSpace(g) || AllowedGenders.Contains(g))
            .WithMessage($"gender must be one of: {string.Join(", ", AllowedGenders)}.");
        RuleFor(x => x.Status)
            .Must(s => string.IsNullOrWhiteSpace(s) || AllowedStatuses.Contains(s))
            .WithMessage($"status must be one of: {string.Join(", ", AllowedStatuses)}.");
        RuleFor(x => x.ContactInfo.Email)
            .EmailAddress()
            .When(x => x.ContactInfo != null && !string.IsNullOrWhiteSpace(x.ContactInfo.Email));
    }
}
