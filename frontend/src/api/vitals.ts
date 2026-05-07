import { api } from './client';
import type { Vital } from '../types';

const BASE = '/vitals';

export const vitalsApi = {
 list: (patientId?: number) =>
 api.get<Vital[]>(BASE, { params: patientId ? { patientId } : undefined }),
 get: (id: number) => api.get<Vital>(`${BASE}/${id}`),
 create: (body: Partial<Vital>) => api.post<Vital>(BASE, body),
 update: (id: number, body: Partial<Vital>) =>
 api.put<void>(`${BASE}/${id}`, { ...body, id }),
 remove: (id: number) => api.delete<void>(`${BASE}/${id}`),
};
