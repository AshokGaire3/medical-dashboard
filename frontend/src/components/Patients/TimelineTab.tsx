import { useMemo } from 'react';
import { Activity, Calendar, Pill, Stethoscope, TestTube } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { EmptyState } from '../ui/EmptyState';
import { Badge } from '../ui/Badge';
import { Spinner } from '../ui/Spinner';
import { useVitals } from '../../hooks/useVitals';
import { useMedications } from '../../hooks/useMedications';
import { useTestResults } from '../../hooks/useTestResults';
import { useMedicalConditions } from '../../hooks/useMedicalConditions';
import { useAppointments } from '../../hooks/useAppointments';

type TimelineKind = 'vital' | 'medication' | 'test' | 'condition' | 'appointment';

interface TimelineItem {
  id: string;
  kind: TimelineKind;
  date: Date;
  title: string;
  description?: string;
  badge?: string;
}

const iconFor: Record<TimelineKind, JSX.Element> = {
  vital: <Activity className="w-4 h-4 text-red-500" />,
  medication: <Pill className="w-4 h-4 text-green-500" />,
  test: <TestTube className="w-4 h-4 text-purple-500" />,
  condition: <Stethoscope className="w-4 h-4 text-blue-500" />,
  appointment: <Calendar className="w-4 h-4 text-amber-500" />,
};

export function TimelineTab({ patientId }: { patientId: number }) {
  const vitalsQ = useVitals(patientId);
  const medsQ = useMedications(patientId);
  const testsQ = useTestResults(patientId);
  const condsQ = useMedicalConditions(patientId);
  const apptsQ = useAppointments({ patientId });

  const isLoading =
    vitalsQ.isLoading || medsQ.isLoading || testsQ.isLoading || condsQ.isLoading || apptsQ.isLoading;

  const items = useMemo<TimelineItem[]>(() => {
    const out: TimelineItem[] = [];

    (vitalsQ.data ?? []).forEach((v) => {
      out.push({
        id: `v-${v.id}`,
        kind: 'vital',
        date: parseISO(v.timestamp),
        title: 'Vitals recorded',
        description: `HR ${v.heartRate} · BP ${v.bloodPressureSystemic}/${v.bloodPressureDiastolic} · SpO₂ ${v.oxygenSaturation}%`,
      });
    });

    (medsQ.data ?? []).forEach((m) => {
      out.push({
        id: `m-${m.id}`,
        kind: 'medication',
        date: parseISO(m.startDate),
        title: `Started ${m.name}`,
        description: `${m.dosage} · ${m.frequency} · prescribed by ${m.prescribedBy}`,
        badge: m.status,
      });
      if (m.endDate) {
        out.push({
          id: `m-${m.id}-end`,
          kind: 'medication',
          date: parseISO(m.endDate),
          title: `Ended ${m.name}`,
          badge: m.status,
        });
      }
    });

    (testsQ.data ?? []).forEach((t) => {
      out.push({
        id: `t-${t.id}`,
        kind: 'test',
        date: parseISO(t.date),
        title: t.testName,
        description: `${t.testType} — ${t.result}`,
        badge: t.status,
      });
    });

    (condsQ.data ?? []).forEach((c) => {
      out.push({
        id: `c-${c.id}`,
        kind: 'condition',
        date: parseISO(c.diagnosedDate),
        title: `Diagnosed ${c.condition}`,
        description: c.notes,
        badge: `${c.severity} · ${c.status}`,
      });
    });

    (apptsQ.data ?? []).forEach((a) => {
      out.push({
        id: `a-${a.id}`,
        kind: 'appointment',
        date: parseISO(a.scheduledAt),
        title: `Appointment · ${a.reason}`,
        description: `${a.durationMinutes} min`,
        badge: a.status,
      });
    });

    return out.sort((a, b) => b.date.getTime() - a.date.getTime());
  }, [vitalsQ.data, medsQ.data, testsQ.data, condsQ.data, apptsQ.data]);

  if (isLoading) {
    return (
      <div className="py-10 flex justify-center">
        <Spinner label="Building timeline…" />
      </div>
    );
  }
  if (items.length === 0) {
    return <EmptyState title="No activity yet" description="New entries will appear here." />;
  }

  return (
    <div className="space-y-2">
      {items.map((it) => (
        <div
          key={it.id}
          className="flex gap-3 bg-themeWhite dark:bg-themeBlack border-2 border-themeBlack dark:border-themeWhite p-3"
        >
          <div className="shrink-0 w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
            {iconFor[it.kind]}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <p className="text-sm font-semibold text-themeBlack dark:text-themeWhite">
                {it.title}
              </p>
              {it.badge ? <Badge tone="gray">{it.badge}</Badge> : null}
            </div>
            {it.description ? (
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-0.5">{it.description}</p>
            ) : null}
            <p className="text-xs text-gray-500 dark:text-gray-500 mt-0.5">
              {format(it.date, 'MMM d, yyyy · h:mm a')}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
