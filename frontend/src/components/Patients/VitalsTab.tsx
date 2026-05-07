import { useCallback, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { Activity, Plus, Pencil, Trash2, Radio } from 'lucide-react';
import { HubConnectionState } from '@microsoft/signalr';
import { useVitalsStream, type VitalRecordedEvent } from '../../hooks/useVitalsStream';
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { format, parseISO, subDays } from 'date-fns';
import { Button } from '../ui/Button';
import { EmptyState } from '../ui/EmptyState';
import { ErrorState } from '../ui/ErrorState';
import { Spinner } from '../ui/Spinner';
import { RequireRole } from '../auth/RequireRole';
import { VitalFormModal } from './VitalFormModal';
import { useDeleteVital, useVitals } from '../../hooks/useVitals';
import type { Vital } from '../../types';

export function VitalsTab({ patientId }: { patientId: number }) {
  const listQ = useVitals(patientId);
  const del = useDeleteVital();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Vital | null>(null);

  // Show a toast when a real-time vital arrives, escalated for high-risk NEWS2 bands.
  const onLiveEvent = useCallback((e: VitalRecordedEvent) => {
    if (e.score.band === 'High') {
      toast.error(`Critical vitals — NEWS2 score ${e.score.total}`, { duration: 6000 });
    } else if (e.score.band === 'Medium') {
      toast(`New vitals — score ${e.score.total} (${e.score.bandLabel})`, { icon: '⚠️' });
    } else {
      toast.success('New vitals recorded');
    }
  }, []);

  // Live updates for this patient's vitals (broadcast over SignalR).
  const { state: streamState } = useVitalsStream(patientId, onLiveEvent);

  const items = useMemo(() => listQ.data ?? [], [listQ.data]);

  const chartData = useMemo(() => {
    const cutoff = subDays(new Date(), 30);
    return items
      .map((v) => ({ ...v, ts: parseISO(v.timestamp) }))
      .filter((v) => v.ts >= cutoff)
      .sort((a, b) => a.ts.getTime() - b.ts.getTime())
      .map((v) => ({
        date: format(v.ts, 'MM/dd HH:mm'),
        heartRate: v.heartRate,
        systolic: v.bloodPressureSystemic,
        diastolic: v.bloodPressureDiastolic,
        oxygen: v.oxygenSaturation,
      }));
  }, [items]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold text-themeBlack dark:text-themeWhite flex items-center gap-2">
          <Activity className="w-5 h-5 text-red-500" />
          Vital signs history
          <LiveIndicator state={streamState} />
        </h3>
        <Button
          size="sm"
          leftIcon={<Plus className="w-4 h-4" />}
          onClick={() => {
            setEditing(null);
            setModalOpen(true);
          }}
        >
          Record vitals
        </Button>
      </div>

      {listQ.isLoading ? (
        <div className="py-10 flex justify-center">
          <Spinner label="Loading vitals…" />
        </div>
      ) : listQ.isError ? (
        <ErrorState
          message={(listQ.error as Error)?.message ?? 'Failed to load vitals'}
          onRetry={() => listQ.refetch()}
        />
      ) : items.length === 0 ? (
        <EmptyState
          title="No vitals recorded yet"
          description="Record a new reading to start tracking trends."
          action={
            <Button
              size="sm"
              leftIcon={<Plus className="w-4 h-4" />}
              onClick={() => setModalOpen(true)}
            >
              Record vitals
            </Button>
          }
        />
      ) : (
        <>
          {chartData.length > 1 ? (
            <div className="bg-themeWhite dark:bg-themeBlack border-2 border-themeBlack dark:border-themeWhite p-3">
              <p className="text-xs font-medium text-themeBlack/60 dark:text-themeWhite/60 mb-2">
                Last 30 days
              </p>
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="date" stroke="#9ca3af" fontSize={11} />
                  <YAxis stroke="#9ca3af" fontSize={11} />
                  <Tooltip
                    contentStyle={{
                      background: 'rgb(17 24 39)',
                      border: 'none',
                      color: '#f3f4f6',
                      borderRadius: 8,
                    }}
                  />
                  <Legend />
                  <Line type="monotone" dataKey="heartRate" stroke="#ef4444" name="HR" dot={false} />
                  <Line
                    type="monotone"
                    dataKey="systolic"
                    stroke="#3b82f6"
                    name="Systolic"
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="diastolic"
                    stroke="#8b5cf6"
                    name="Diastolic"
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="oxygen"
                    stroke="#10b981"
                    name="SpO₂"
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : null}

          <div className="bg-themeWhite dark:bg-themeBlack border-2 border-themeBlack dark:border-themeWhite overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 dark:bg-gray-800/60">
                <tr>
                  <Th>Timestamp</Th>
                  <Th>HR</Th>
                  <Th>BP</Th>
                  <Th>Temp</Th>
                  <Th>SpO₂</Th>
                  <Th>Resp</Th>
                  <Th className="text-right pr-4">Actions</Th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {items.map((v) => (
                  <tr key={v.id}>
                    <Td>
                      {format(parseISO(v.timestamp), 'MMM d, yyyy HH:mm')}
                    </Td>
                    <Td>{v.heartRate}</Td>
                    <Td>
                      {v.bloodPressureSystemic}/{v.bloodPressureDiastolic}
                    </Td>
                    <Td>{v.temperature}°F</Td>
                    <Td>{v.oxygenSaturation}%</Td>
                    <Td>{v.respiratoryRate}</Td>
                    <Td className="text-right pr-4">
                      <div className="inline-flex items-center gap-1">
                        <button
                          type="button"
                          title="Edit"
                          onClick={() => {
                            setEditing(v);
                            setModalOpen(true);
                          }}
                          className="p-1.5 rounded-md text-themeBlack/70 dark:text-themeWhite/70 hover:bg-gray-100 dark:hover:bg-gray-800"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <RequireRole roles={['Doctor', 'Admin']}>
                          <button
                            type="button"
                            title="Delete"
                            onClick={() =>
                              del.mutate({ id: v.id, patientId: v.patientId })
                            }
                            className="p-1.5 rounded-md text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </RequireRole>
                      </div>
                    </Td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      <VitalFormModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditing(null);
        }}
        patientId={patientId}
        vital={editing}
      />
    </div>
  );
}

function Th({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <th
      className={`px-4 py-2 text-left text-[11px] font-medium text-themeBlack/60 dark:text-themeWhite/60 uppercase tracking-wider ${className}`}
    >
      {children}
    </th>
  );
}
function Td({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <td className={`px-4 py-2 text-gray-800 dark:text-gray-200 ${className}`}>{children}</td>;
}

// Tiny status pill: green pulsing dot when SignalR is connected, gray otherwise.
function LiveIndicator({ state }: { state: HubConnectionState }) {
  const connected = state === HubConnectionState.Connected;
  return (
    <span
      title={`Real-time stream: ${state}`}
      className={`inline-flex items-center gap-1 text-[10px] font-medium uppercase tracking-wide px-1.5 py-0.5 rounded-full ${
        connected
          ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300'
          : 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400'
      }`}
    >
      <Radio className={`w-3 h-3 ${connected ? 'animate-pulse' : ''}`} />
      {connected ? 'Live' : 'Offline'}
    </span>
  );
}
