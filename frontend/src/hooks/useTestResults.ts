import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { testResultsApi } from '../api';
import type { TestResultInput } from '../types';

const keys = {
 all: ['testResults'] as const,
 list: (patientId?: number, status?: string) =>
 [...keys.all, 'list', patientId ?? 'all', status ?? 'all'] as const,
};

export function useTestResults(patientId?: number, status?: string, enabled = true) {
 return useQuery({
 queryKey: keys.list(patientId, status),
 queryFn: () => testResultsApi.list(patientId, status),
 enabled,
 });
}

function invalidate(qc: ReturnType<typeof useQueryClient>, patientId?: number) {
 qc.invalidateQueries({ queryKey: keys.all });
 if (patientId) {
 qc.invalidateQueries({ queryKey: ['patients', 'detail', patientId] });
 }
}

export function useCreateTestResult() {
 const qc = useQueryClient();
 return useMutation({
 mutationFn: (body: TestResultInput) => testResultsApi.create(body),
 onSuccess: (_data, variables) => {
 invalidate(qc, variables.patientId);
 toast.success('Test result saved.');
 },
 onError: (err: Error) => toast.error(err.message),
 });
}

export function useUpdateTestResult() {
 const qc = useQueryClient();
 return useMutation({
 mutationFn: ({ id, body }: { id: number; body: TestResultInput }) =>
 testResultsApi.update(id, body),
 onSuccess: (_data, variables) => {
 invalidate(qc, variables.body.patientId);
 toast.success('Test result updated.');
 },
 onError: (err: Error) => toast.error(err.message),
 });
}

export function useDeleteTestResult() {
 const qc = useQueryClient();
 return useMutation({
 mutationFn: ({ id }: { id: number; patientId?: number }) => testResultsApi.remove(id),
 onSuccess: (_data, variables) => {
 invalidate(qc, variables.patientId);
 toast.success('Test result removed.');
 },
 onError: (err: Error) => toast.error(err.message),
 });
}
