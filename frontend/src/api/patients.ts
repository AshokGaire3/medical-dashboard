import { api } from './client';
import type { PagedResult, Patient, PatientsQuery } from '../types';

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
};
