import { useQuery } from '@tanstack/react-query';
import { dashboardApi } from '../api';

export function useDashboardMetrics() {
  return useQuery({
    queryKey: ['dashboard', 'metrics'],
    queryFn: () => dashboardApi.metrics(),
    refetchInterval: 60_000,
  });
}

export function useVitalsTrend(days = 7, patientId?: number) {
  return useQuery({
    queryKey: ['dashboard', 'vitals-trend', days, patientId ?? null],
    queryFn: () => dashboardApi.vitalsTrend(days, patientId),
  });
}

export function useDashboardAlerts() {
  return useQuery({
    queryKey: ['dashboard', 'alerts'],
    queryFn: () => dashboardApi.alerts(),
    refetchInterval: 30_000,
  });
}
