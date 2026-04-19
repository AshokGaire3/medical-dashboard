import { api } from './client';
import type { Appointment, AppointmentStatus } from '../types';

const BASE = '/appointments';

export interface AppointmentsQuery {
  patientId?: number;
  status?: AppointmentStatus;
  from?: string;
  to?: string;
}

export const appointmentsApi = {
  list: (params?: AppointmentsQuery) =>
    api.get<Appointment[]>(BASE, {
      params: params as Record<string, string | number | boolean | undefined>,
    }),
  get: (id: number) => api.get<Appointment>(`${BASE}/${id}`),
  create: (body: Partial<Appointment>) => api.post<Appointment>(BASE, body),
  update: (id: number, body: Partial<Appointment>) =>
    api.put<void>(`${BASE}/${id}`, { ...body, id }),
  setStatus: (id: number, status: AppointmentStatus) =>
    api.patch<void>(`${BASE}/${id}/status`, { status }),
  remove: (id: number) => api.delete<void>(`${BASE}/${id}`),
};
