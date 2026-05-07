import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { vitalsApi } from '../api';
import type { Vital, VitalInput } from '../types';

const keys = {
 all: ['vitals'] as const,
 list: (patientId?: number) => [...keys.all, 'list', patientId ?? 'all'] as const,
};

export function useVitals(patientId?: number, enabled = true) {
 return useQuery({
 queryKey: keys.list(patientId),
 queryFn: () => vitalsApi.list(patientId),
 enabled,
 });
}

function invalidate(qc: ReturnType<typeof useQueryClient>, patientId?: number) {
 qc.invalidateQueries({ queryKey: keys.all });
 if (patientId) {
 qc.invalidateQueries({ queryKey: ['patients', 'detail', patientId] });
 qc.invalidateQueries({ queryKey: ['dashboard'] });
 }
}

export function useCreateVital() {
 const qc = useQueryClient();
 return useMutation({
 mutationFn: (body: VitalInput) => vitalsApi.create(body as Partial<Vital>),
 onSuccess: (_data, variables) => {
 invalidate(qc, variables.patientId);
 toast.success('Vitals recorded.');
 },
 onError: (err: Error) => toast.error(err.message),
 });
}

export function useUpdateVital() {
 const qc = useQueryClient();
 return useMutation({
 mutationFn: ({ id, body }: { id: number; body: VitalInput }) =>
 vitalsApi.update(id, body as Partial<Vital>),
 onSuccess: (_data, variables) => {
 invalidate(qc, variables.body.patientId);
 toast.success('Vitals updated.');
 },
 onError: (err: Error) => toast.error(err.message),
 });
}

export function useDeleteVital() {
 const qc = useQueryClient();
 return useMutation({
 mutationFn: ({ id }: { id: number; patientId?: number }) => vitalsApi.remove(id),
 onSuccess: (_data, variables) => {
 invalidate(qc, variables.patientId);
 toast.success('Vital entry deleted.');
 },
 onError: (err: Error) => toast.error(err.message),
 });
}
