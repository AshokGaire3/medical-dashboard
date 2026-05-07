import { api } from './client';
import type { TestResult, TestResultInput } from '../types';

const BASE = '/testresults';

export const testResultsApi = {
 list: (patientId?: number, status?: string) =>
 api.get<TestResult[]>(BASE, {
 params: {
 patientId: patientId ?? undefined,
 status: status ?? undefined,
 },
 }),
 get: (id: number) => api.get<TestResult>(`${BASE}/${id}`),
 create: (body: TestResultInput) => api.post<TestResult>(BASE, body),
 update: (id: number, body: TestResultInput) =>
 api.put<void>(`${BASE}/${id}`, { ...body, id }),
 remove: (id: number) => api.delete<void>(`${BASE}/${id}`),
};
