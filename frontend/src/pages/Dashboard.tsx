import { useMemo, useState } from 'react';
import {
  Users,
  Heart,
  AlertTriangle,
  CheckCircle,
  Activity as ActivityIcon,
  Calendar,
  ArrowRight,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import PatientProfile from '../components/Patients/PatientProfile';
import MetricCard from '../components/Dashboard/MetricCard';
import CustomLineChart from '../components/Charts/LineChart';
import CustomPieChart from '../components/Charts/PieChart';
import CustomBarChart from '../components/Charts/BarChart';
import { Spinner } from '../components/ui/Spinner';
import { ErrorState } from '../components/ui/ErrorState';
import { useDashboardAlerts, useDashboardMetrics, useVitalsTrend } from '../hooks/useDashboard';
import { usePatient, usePatients } from '../hooks/usePatients';

import { useAppointments } from '../hooks/useAppointments';

export default function Dashboard() {
  const metricsQ = useDashboardMetrics();
  const trendQ = useVitalsTrend(7);
  const alertsQ = useDashboardAlerts();
  const patientsQ = usePatients({ isCurrent: true, pageSize: 100 });
  const today = useMemo(() => new Date(), []);
  const tomorrow = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d;
  }, []);
  const upcomingQ = useAppointments({
    from: today.toISOString(),
    to: tomorrow.toISOString(),
    status: 'Scheduled',
  });
  const [selectedPatientId, setSelectedPatientId] = useState<number | null>(null);

  if (metricsQ.isLoading || patientsQ.isLoading) {
    return (
      <div className="p-12 flex items-center justify-center">
        <Spinner size="lg" label="Loading dashboard…" />
      </div>
    );
  }

  if (metricsQ.isError) {
    return (
      <div className="p-6">
        <ErrorState
          message={(metricsQ.error as Error)?.message ?? 'Failed to load metrics'}
          onRetry={() => metricsQ.refetch()}
        />
      </div>
    );
  }

  const metrics = metricsQ.data!;
  const patients = patientsQ.data?.items ?? [];
  const trend = trendQ.data ?? [];
  const alerts = alertsQ.data ?? [];

  const conditionCounts: Record<string, number> = {};
  for (const p of patients) {
    conditionCounts[p.condition] = (conditionCounts[p.condition] ?? 0) + 1;
  }
  const conditionDistribution = Object.entries(conditionCounts).map(([name, value]) => ({
    name,
    value,
  }));

  const ageBuckets = [
    { ageGroup: '0-17', min: 0, max: 17 },
    { ageGroup: '18-34', min: 18, max: 34 },
    { ageGroup: '35-54', min: 35, max: 54 },
    { ageGroup: '55-74', min: 55, max: 74 },
    { ageGroup: '75+', min: 75, max: 200 },
  ];
  const ageGroupData = ageBuckets.map((b) => ({
    ageGroup: b.ageGroup,
    count: patients.filter((p) => p.age >= b.min && p.age <= b.max).length,
  }));

  const successRate =
    metrics.lifetimePatients > 0
      ? Math.round((metrics.recoveredPatients / metrics.lifetimePatients) * 100)
      : 0;

  return (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Current Patients"
          value={metrics.currentPatients}
          change={`${metrics.totalPatients} lifetime`}
          icon={Users}
          color="blue"
        />
        <MetricCard
          title="Critical Cases"
          value={metrics.criticalCases}
          change="Require immediate attention"
          changeType={metrics.criticalCases > 0 ? 'negative' : 'positive'}
          icon={AlertTriangle}
          color="red"
        />
        <MetricCard
          title="Success Rate"
          value={`${successRate}%`}
          change={`${metrics.recoveredPatients} recovered`}
          changeType="positive"
          icon={CheckCircle}
          color="green"
        />
        <MetricCard
          title="Avg Heart Rate"
          value={`${metrics.averageHeartRate.toFixed(0)} bpm`}
          change={`BP avg ${metrics.averageBloodPressure}`}
          icon={Heart}
          color="purple"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <CustomLineChart
            data={trend}
            dataKeys={[
              { key: 'heartRate', color: '#0a0a0a', name: 'Heart Rate (bpm)' },
              { key: 'systolicBP', color: '#2563eb', name: 'Systolic BP (mmHg)' },
              { key: 'oxygenSat', color: '#16a34a', name: 'O₂ Saturation (%)' },
            ]}
            xAxisKey="date"
            title="Vitals trend — last 7 days"
          />
        </div>
        <CustomPieChart
          data={conditionDistribution}
          colors={['#2563eb', '#16a34a', '#0a0a0a', '#6b7280']}
          title="Conditions (current patients)"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CustomBarChart
          data={ageGroupData}
          dataKey="count"
          xAxisKey="ageGroup"
          color="#2563eb"
          title="Patient demographics"
        />

        <div className="bg-themeWhite dark:bg-themeBlack border-2 border-themeBlack dark:border-themeWhite p-6 shadow-brutal dark:shadow-brutal-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-black text-themeBlack dark:text-themeWhite uppercase tracking-tight">
              Today's appointments
            </h3>
            <Link
              to="/appointments"
              className="inline-flex items-center gap-1 text-sm font-bold text-accentBlue hover:underline uppercase tracking-wide"
            >
              <Calendar strokeWidth={2} className="w-4 h-4" />
              View calendar
            </Link>
          </div>
          {upcomingQ.isLoading ? (
            <Spinner size="sm" />
          ) : (upcomingQ.data?.length ?? 0) === 0 ? (
            <p className="text-sm text-themeBlack/60 dark:text-themeWhite/60">No upcoming appointments.</p>
          ) : (
            <ul className="divide-y divide-gray-100 dark:divide-gray-800">
              {(upcomingQ.data ?? []).slice(0, 6).map((a) => (
                <li key={a.id} className="py-4 flex items-center justify-between">
                  <div>
                    <p className="text-base font-bold text-themeBlack dark:text-themeWhite uppercase">
                      {a.patientName ?? `Patient #${a.patientId}`}
                    </p>
                    <p className="text-sm font-semibold text-themeBlack/60 dark:text-themeWhite/60 tracking-wider uppercase mt-1">{a.reason}</p>
                  </div>
                  <span className="text-sm font-black text-themeBlack dark:text-themeWhite tracking-widest">
                    {new Date(a.scheduledAt).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="bg-themeWhite dark:bg-themeBlack border-2 border-themeBlack dark:border-themeWhite p-6 shadow-brutal dark:shadow-brutal-sm">
        <div className="flex items-center gap-3 mb-6 border-b-2 border-themeBlack dark:border-themeWhite pb-4">
          <div className="bg-themeBlack dark:bg-themeWhite text-themeWhite dark:text-themeBlack p-2 border-2 border-themeBlack dark:border-themeWhite">
            <ActivityIcon strokeWidth={2} className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-black text-themeBlack dark:text-themeWhite uppercase tracking-tight">Critical alerts</h3>
        </div>
        {alertsQ.isLoading ? (
          <Spinner size="sm" />
        ) : alerts.length === 0 ? (
          <p className="text-sm text-themeBlack/60 dark:text-themeWhite/60">
            No vitals outside expected ranges right now.
          </p>
        ) : (
          <ul className="space-y-3">
            {alerts.slice(0, 6).map((a, i) => (
              <li key={i}>
                <button
                  type="button"
                  onClick={() => setSelectedPatientId(a.patientId)}
                  className="w-full text-left flex items-start gap-4 p-4 border-2 border-themeBlack dark:border-themeWhite hover:bg-themeBlack hover:text-themeWhite dark:hover:bg-themeWhite dark:hover:text-themeBlack transition-all group"
                >
                  <AlertTriangle strokeWidth={2} className="w-6 h-6 text-themeBlack dark:text-themeWhite group-hover:text-themeWhite dark:group-hover:text-themeBlack mt-0.5 shrink-0" />
                  <div className="flex-1">
                    <div className="flex justify-between items-center">
                      <p className="text-base font-black uppercase tracking-tight">
                        {a.patient}
                      </p>
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-xs px-3 py-1 font-bold uppercase tracking-widest border-2 border-current ${
                            a.severity === 'Critical'
                              ? 'text-themeBlack dark:text-themeWhite'
                              : 'text-themeBlack/70 dark:text-themeWhite/70'
                          }`}
                        >
                          {a.severity}
                        </span>
                        <ArrowRight strokeWidth={2} className="w-4 h-4 text-inherit" />
                      </div>
                    </div>
                    <p className="text-sm font-semibold uppercase tracking-wider mt-2 opacity-80">
                      {a.vital}: {a.value}
                    </p>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {selectedPatientId ? (
        <SelectedPatientModal
          id={selectedPatientId}
          onClose={() => setSelectedPatientId(null)}
        />
      ) : null}
    </div>
  );
}

function SelectedPatientModal({ id, onClose }: { id: number; onClose: () => void }) {
  const q = usePatient(id);
  if (q.isLoading || !q.data) return null;
  return <PatientProfile patient={q.data} onClose={onClose} />;
}
