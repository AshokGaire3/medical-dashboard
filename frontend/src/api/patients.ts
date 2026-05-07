import { api } from './client';
import type { HealthScore, PagedResult, Patient, PatientsQuery } from '../types';

const BASE = '/patients';

export const patientsApi = {
  list: (params?: PatientsQuery) =>
    api.get<PagedResult<Patient>>(BASE, {
      params: params as Record<string, string | number | boolean | undefined>,
    }),
  get: (id: number) => api.get<Patient>(`${BASE}/${id}`),
  create: (body: Partial<Patient>) => api.post<Patient>(BASE, body),
  update: (id: number, body: Partial<Patient>) =>
    api.put<void>(`${BASE}/${id}`, { ...body, id }),
  remove: (id: number) => api.delete<void>(`${BASE}/${id}`),
  healthScore: (id: number) => api.get<HealthScore>(`${BASE}/${id}/health-score`),

  // Downloads the server-generated PDF chart as a Blob.
  reportPdf: (id: number) =>
    api.get<Blob>(`${BASE}/${id}/report.pdf`, { responseType: 'blob' }),
};
