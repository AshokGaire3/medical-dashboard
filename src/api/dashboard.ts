import { DashboardMetrics } from '../types';
import { apiConfig, apiFetch } from './config';

const API_URL = `${apiConfig.baseURL}/dashboard`;

export const dashboardApi = {
  // Get dashboard metrics
  getMetrics: async (): Promise<DashboardMetrics> => {
    return apiFetch<DashboardMetrics>(`${API_URL}/metrics`);
  },
};

