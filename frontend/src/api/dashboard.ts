import { api } from './client';
import type { DashboardAlert, DashboardMetrics, VitalsTrendPoint } from '../types';

export const dashboardApi = {
  metrics: () => api.get<DashboardMetrics>('/dashboard/metrics'),
  vitalsTrend: (days = 7, patientId?: number) =>
    api.get<VitalsTrendPoint[]>('/dashboard/vitals-trend', {
      params: { days, patientId },
    }),
  alerts: () => api.get<DashboardAlert[]>('/dashboard/alerts'),
};
