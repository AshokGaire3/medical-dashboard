using System.Security.Claims;
using MedicalDashboard.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace MedicalDashboard.Api.Auth;

public static class ClaimsPrincipalExtensions
{
    public static int? GetUserId(this ClaimsPrincipal user)
    {
        var idStr = user.FindFirstValue(ClaimTypes.NameIdentifier);
        return int.TryParse(idStr, out var id) ? id : null;
    }

    public static string? GetRole(this ClaimsPrincipal user) =>
        user.FindFirstValue(ClaimTypes.Role);

    public static bool IsAdmin(this ClaimsPrincipal user) =>
        string.Equals(user.GetRole(), "Admin", StringComparison.OrdinalIgnoreCase);
}

public static class PatientQueryExtensions
{
    // Roster-scoped patient query: admins see everything; doctors see patients
    // assigned to them; nurses see patients assigned to them. An unauthenticated
    // or missing-id principal sees nothing.
    public static IQueryable<Patient> ScopedToCaller(
        this IQueryable<Patient> query,
        ClaimsPrincipal caller)
    {
        if (caller.IsAdmin()) return query;

        var userId = caller.GetUserId();
        if (userId is null) return query.Where(_ => false);

        var role = caller.GetRole();
        return role switch
        {
            "Doctor" => query.Where(p => p.AssignedDoctorId == userId),
            "Nurse" => query.Where(p => p.AssignedNurseId == userId),
            _ => query.Where(_ => false),
        };
    }

    // Returns true if the caller is allowed to access the given patient under
    // the same roster rules used by ScopedToCaller. Used by child-resource
    // controllers (vitals, meds, etc.) to gate per-patient operations.
    public static async Task<bool> CallerCanAccessPatientAsync(
        this DbSet<Patient> patients,
        ClaimsPrincipal caller,
        int patientId,
        CancellationToken cancellationToken = default)
    {
        if (caller.IsAdmin())
            return await patients.AnyAsync(p => p.Id == patientId, cancellationToken);

        var userId = caller.GetUserId();
        if (userId is null) return false;

        var role = caller.GetRole();
        return role switch
        {
            "Doctor" => await patients.AnyAsync(
                p => p.Id == patientId && p.AssignedDoctorId == userId, cancellationToken),
            "Nurse" => await patients.AnyAsync(
                p => p.Id == patientId && p.AssignedNurseId == userId, cancellationToken),
            _ => false,
        };
    }
}
