import { useEffect, useRef, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { HubConnection, HubConnectionBuilder, HubConnectionState, LogLevel } from '@microsoft/signalr';
import { API_BASE_URL, TOKEN_STORAGE_KEY } from '../api/config';
import type { HealthScore, Vital } from '../types';

// Shape pushed by the backend's VitalRecorded event.
export interface VitalRecordedEvent {
  vital: Vital;
  score: HealthScore;
}

// Derive the SignalR hub URL from the REST API base URL.
// REST base looks like http://localhost:5000/api, so we strip /api and append /hubs/vitals.
function hubUrl(): string {
  const base = API_BASE_URL.replace(/\/api$/, '');
  return `${base}/hubs/vitals`;
}

// Subscribes to real-time vitals for a single patient.
// - Returns the latest event (or null) and the connection state.
// - Calls the optional `onEvent` callback for side effects (toasts, sound, etc.).
// - Automatically invalidates React Query caches for vitals + health score so the UI re-fetches.
export function useVitalsStream(
  patientId: number | undefined,
  onEvent?: (_e: VitalRecordedEvent) => void,
) {
  const [latest, setLatest] = useState<VitalRecordedEvent | null>(null);
  const [state, setState] = useState<HubConnectionState>(HubConnectionState.Disconnected);
  const qc = useQueryClient();
  // Hold the live connection in a ref so re-renders don't reconnect.
  const connRef = useRef<HubConnection | null>(null);

  useEffect(() => {
    if (!patientId) return;

    const token = localStorage.getItem(TOKEN_STORAGE_KEY);
    if (!token) return;

    // Build a connection that auto-reconnects with backoff and authenticates via JWT.
    const connection = new HubConnectionBuilder()
      .withUrl(hubUrl(), { accessTokenFactory: () => token })
      .withAutomaticReconnect()
      .configureLogging(LogLevel.Warning)
      .build();

    connRef.current = connection;

    // Server pushes "VitalRecorded" when a new vital is saved.
    connection.on('VitalRecorded', (event: VitalRecordedEvent) => {
      setLatest(event);
      onEvent?.(event);
      // Invalidate cached vital lists and the health score so consumers refetch.
      qc.invalidateQueries({ queryKey: ['vitals', patientId] });
      qc.invalidateQueries({ queryKey: ['patients', 'health-score', patientId] });
    });

    connection.onreconnecting(() => setState(HubConnectionState.Reconnecting));
    connection.onreconnected(() => {
      setState(HubConnectionState.Connected);
      // After a reconnect, re-join the patient group.
      connection.invoke('SubscribeToPatient', patientId).catch(() => {});
    });
    connection.onclose(() => setState(HubConnectionState.Disconnected));

    setState(HubConnectionState.Connecting);
    connection
      .start()
      .then(() => {
        setState(HubConnectionState.Connected);
        return connection.invoke('SubscribeToPatient', patientId);
      })
      .catch(() => {
        // Fail soft: real-time is a progressive enhancement, not a hard requirement.
      });

    // Cleanup: leave the group and tear down the socket on unmount or patient change.
    return () => {
      connection.invoke('UnsubscribeFromPatient', patientId).catch(() => {});
      connection.stop().catch(() => {});
      connRef.current = null;
    };
  }, [patientId, onEvent, qc]);

  return { latest, state };
}
