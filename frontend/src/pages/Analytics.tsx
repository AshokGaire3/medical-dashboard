import { useMemo, useState } from 'react';
import { Users, Heart, AlertTriangle, CheckCircle } from 'lucide-react';
import MetricCard from '../components/Dashboard/MetricCard';
import CustomLineChart from '../components/Charts/LineChart';
import CustomBarChart from '../components/Charts/BarChart';
import CustomPieChart from '../components/Charts/PieChart';
import { PageHeader } from '../components/ui/PageHeader';
import { Spinner } from '../components/ui/Spinner';
import { ErrorState } from '../components/ui/ErrorState';
import { Select } from '../components/ui/Select';
import { useDashboardMetrics, useVitalsTrend } from '../hooks/useDashboard';
import { usePatients } from '../hooks/usePatients';
import { PIE_CHART_COLORS } from '../utils/constants';

export default function Analytics() {
  const [days, setDays] = useState(7);
  const metricsQ = useDashboardMetrics();
  const trendQ = useVitalsTrend(days);
  const patientsQ = usePatients({ pageSize: 200 });

  const patients = patientsQ.data?.items ?? [];

  const statusBreakdown = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const p of patients) counts[p.status] = (counts[p.status] ?? 0) + 1;
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [patients]);

  const conditionCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const p of patients) counts[p.condition] = (counts[p.condition] ?? 0) + 1;
    return Object.entries(counts)
      .map(([condition, count]) => ({ condition, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8);
  }, [patients]);

  const ageGroups = useMemo(() => {
    const buckets = [
      { label: '0-17', min: 0, max: 17 },
      { label: '18-34', min: 18, max: 34 },
      { label: '35-54', min: 35, max: 54 },
      { label: '55-74', min: 55, max: 74 },
      { label: '75+', min: 75, max: 200 },
    ];
    return buckets.map((b) => ({
      ageGroup: b.label,
      count: patients.filter((p) => p.age >= b.min && p.age <= b.max).length,
    }));
  }, [patients]);

  if (metricsQ.isLoading || patientsQ.isLoading) {
    return (
      <div className="p-12 flex justify-center">
        <Spinner size="lg" label="Loading analytics…" />
      </div>
    );
  }

  if (metricsQ.isError) {
    return (
      <div className="p-6">
        <ErrorState
          message={(metricsQ.error as Error)?.message ?? 'Failed to load'}
          onRetry={() => metricsQ.refetch()}
        />
      </div>
    );
  }

  const metrics = metricsQ.data!;
  const successRate =
    metrics.lifetimePatients > 0
      ? Math.round((metrics.recoveredPatients / metrics.lifetimePatients) * 100)
      : 0;

  return (
    <div className="p-6 space-y-6">
      <PageHeader
        title="Analytics"
        description="Trends, demographics, and outcomes across your patient base."
        actions={
          <Select
            className="w-40"
            value={String(days)}
            onChange={(e) => setDays(Number(e.target.value))}
            options={[
              { value: '1', label: 'Last 24h' },
              { value: '7', label: 'Last 7 days' },
              { value: '14', label: 'Last 14 days' },
              { value: '30', label: 'Last 30 days' },
            ]}
          />
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <MetricCard
          title="Total patients"
          value={metrics.totalPatients}
          icon={Users}
          color="blue"
        />
        <MetricCard
          title="Critical"
          value={metrics.criticalCases}
          icon={AlertTriangle}
          color="red"
        />
        <MetricCard
          title="Success rate"
          value={`${successRate}%`}
          icon={CheckCircle}
          color="green"
        />
        <MetricCard
          title="Avg heart rate"
          value={`${metrics.averageHeartRate.toFixed(0)} bpm`}
          icon={Heart}
          color="purple"
        />
      </div>

      <CustomLineChart
        data={trendQ.data ?? []}
        dataKeys={[
          { key: 'heartRate', color: '#ef4444', name: 'Heart Rate (bpm)' },
          { key: 'systolicBP', color: '#3b82f6', name: 'Systolic BP (mmHg)' },
          { key: 'diastolicBP', color: '#6366f1', name: 'Diastolic BP (mmHg)' },
          { key: 'oxygenSat', color: '#10b981', name: 'O₂ Saturation (%)' },
        ]}
        xAxisKey="date"
        title={`Vitals trend — last ${days} day(s)`}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CustomBarChart
          data={conditionCounts}
          dataKey="count"
          xAxisKey="condition"
          color="#3b82f6"
          title="Most common conditions"
        />
        <CustomPieChart
          data={statusBreakdown}
          colors={PIE_CHART_COLORS as unknown as string[]}
          title="Patient status distribution"
        />
      </div>

      <CustomBarChart
        data={ageGroups}
        dataKey="count"
        xAxisKey="ageGroup"
        color="#8b5cf6"
        title="Age distribution"
      />
    </div>
  );
}
