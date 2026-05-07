using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;

namespace MedicalDashboard.Api.Hubs;

// SignalR hub for real-time vitals updates.
// Clients connect with a JWT (sent as access_token query param) and join a per-patient
// group via SubscribeToPatient(id). The server pushes "VitalRecorded" events to that group
// whenever a new vital row is saved.
[Authorize]
public class VitalsHub : Hub
{
    // Group naming convention: one group per patient id.
    private static string GroupForPatient(int patientId) => $"patient-{patientId}";

    // Called by client when it wants to receive vitals events for a specific patient.
    public Task SubscribeToPatient(int patientId)
        => Groups.AddToGroupAsync(Context.ConnectionId, GroupForPatient(patientId));

    public Task UnsubscribeFromPatient(int patientId)
        => Groups.RemoveFromGroupAsync(Context.ConnectionId, GroupForPatient(patientId));
}
