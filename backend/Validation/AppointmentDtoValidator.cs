using FluentValidation;
using MedicalDashboard.Api.Models.DTOs;

namespace MedicalDashboard.Api.Validation;

public class AppointmentDtoValidator : AbstractValidator<AppointmentDto>
{
    private static readonly string[] AllowedStatuses = { "Scheduled", "Completed", "Cancelled", "NoShow" };

    public AppointmentDtoValidator()
    {
        RuleFor(x => x.PatientId).GreaterThan(0).WithMessage("patientId is required.");
        RuleFor(x => x.ScheduledAt)
            .NotEmpty().WithMessage("scheduledAt is required.")
            .Must(BeAValidFutureOrRecent)
            .WithMessage("scheduledAt must be a valid date/time (not more than 1 day in the past).");
        RuleFor(x => x.DurationMinutes)
            .InclusiveBetween(5, 480)
            .WithMessage("durationMinutes must be between 5 and 480.");
        RuleFor(x => x.Reason).MaximumLength(500);
        RuleFor(x => x.Status)
            .Must(s => string.IsNullOrWhiteSpace(s) || AllowedStatuses.Contains(s))
            .WithMessage($"status must be one of: {string.Join(", ", AllowedStatuses)}.");
    }

    private static bool BeAValidFutureOrRecent(string value)
    {
        if (!DateTime.TryParse(value, out var dt)) return false;
        return dt > DateTime.UtcNow.AddDays(-1);
    }
}
