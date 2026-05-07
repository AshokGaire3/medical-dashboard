import { api } from './client';
import type { MedicalCondition, MedicalConditionInput } from '../types';

const BASE = '/medicalconditions';

export const medicalConditionsApi = {
 list: (patientId?: number, status?: string) =>
 api.get<MedicalCondition[]>(BASE, {
 params: {
 patientId: patientId ?? undefined,
 status: status ?? undefined,
 },
 }),
 get: (id: number) => api.get<MedicalCondition>(`${BASE}/${id}`),
 create: (body: MedicalConditionInput) => api.post<MedicalCondition>(BASE, body),
 update: (id: number, body: MedicalConditionInput) =>
 api.put<void>(`${BASE}/${id}`, { ...body, id }),
 remove: (id: number) => api.delete<void>(`${BASE}/${id}`),
};
