import { api } from './client';
import type { Medication, MedicationInput } from '../types';

const BASE = '/medications';

export const medicationsApi = {
 list: (patientId?: number, status?: string) =>
 api.get<Medication[]>(BASE, {
 params: {
 patientId: patientId ?? undefined,
 status: status ?? undefined,
 },
 }),
 get: (id: number) => api.get<Medication>(`${BASE}/${id}`),
 create: (body: MedicationInput) => api.post<Medication>(BASE, body),
 update: (id: number, body: MedicationInput) =>
 api.put<void>(`${BASE}/${id}`, { ...body, id }),
 remove: (id: number) => api.delete<void>(`${BASE}/${id}`),
};
