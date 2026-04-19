import { useMemo } from 'react';
import {
  Users,
  Heart,
  AlertTriangle,
  CheckCircle,
  Activity as ActivityIcon,
  Calendar,
} from 'lucide-react';
import MetricCard from '../components/Dashboard/MetricCard';
import CustomLineChart from '../components/Charts/LineChart';
import CustomPieChart from '../components/Charts/PieChart';
import CustomBarChart from '../components/Charts/BarChart';
import { Spinner } from '../components/ui/Spinner';
import { ErrorState } from '../components/ui/ErrorState';
import { useDashboardAlerts, useDashboardMetrics, useVitalsTrend } from '../hooks/useDashboard';
import { usePatients } from '../hooks/usePatients';
import { PIE_CHART_COLORS } from '../utils/constants';
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
              { key: 'heartRate', color: '#ef4444', name: 'Heart Rate (bpm)' },
              { key: 'systolicBP', color: '#3b82f6', name: 'Systolic BP (mmHg)' },
              { key: 'oxygenSat', color: '#10b981', name: 'O₂ Saturation (%)' },
            ]}
            xAxisKey="date"
            title="Vitals trend — last 7 days"
          />
        </div>
        <CustomPieChart
          data={conditionDistribution}
          colors={PIE_CHART_COLORS as unknown as string[]}
          title="Conditions (current patients)"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CustomBarChart
          data={ageGroupData}
          dataKey="count"
          xAxisKey="ageGroup"
          color="#3b82f6"
          title="Patient demographics"
        />

        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
              Today's appointments
            </h3>
            <Calendar className="w-5 h-5 text-gray-400" />
          </div>
          {upcomingQ.isLoading ? (
            <Spinner size="sm" />
          ) : (upcomingQ.data?.length ?? 0) === 0 ? (
            <p className="text-sm text-gray-500 dark:text-gray-400">No upcoming appointments.</p>
          ) : (
            <ul className="divide-y divide-gray-100 dark:divide-gray-800">
              {(upcomingQ.data ?? []).slice(0, 6).map((a) => (
                <li key={a.id} className="py-3 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {a.patientName ?? `Patient #${a.patientId}`}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{a.reason}</p>
                  </div>
                  <span className="text-sm text-gray-600 dark:text-gray-300">
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

      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6">
        <div className="flex items-center gap-2 mb-4">
          <ActivityIcon className="w-5 h-5 text-red-500" />
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Critical alerts</h3>
        </div>
        {alertsQ.isLoading ? (
          <Spinner size="sm" />
        ) : alerts.length === 0 ? (
          <p className="text-sm text-gray-500 dark:text-gray-400">
            No vitals outside expected ranges right now.
          </p>
        ) : (
          <ul className="space-y-3">
            {alerts.slice(0, 6).map((a, i) => (
              <li
                key={i}
                className="flex items-start gap-3 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/40"
              >
                <AlertTriangle className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
                <div className="flex-1">
                  <div className="flex justify-between">
                    <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                      {a.patient}
                    </p>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full ${
                        a.severity === 'Critical'
                          ? 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300'
                          : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300'
                      }`}
                    >
                      {a.severity}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">
                    {a.vital}: {a.value}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
