import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { medicalConditionsApi } from '../api';
import type { MedicalConditionInput } from '../types';

const keys = {
 all: ['medicalConditions'] as const,
 list: (patientId?: number, status?: string) =>
 [...keys.all, 'list', patientId ?? 'all', status ?? 'all'] as const,
};

export function useMedicalConditions(patientId?: number, status?: string, enabled = true) {
 return useQuery({
 queryKey: keys.list(patientId, status),
 queryFn: () => medicalConditionsApi.list(patientId, status),
 enabled,
 });
}

function invalidate(qc: ReturnType<typeof useQueryClient>, patientId?: number) {
 qc.invalidateQueries({ queryKey: keys.all });
 if (patientId) {
 qc.invalidateQueries({ queryKey: ['patients', 'detail', patientId] });
 }
}

export function useCreateMedicalCondition() {
 const qc = useQueryClient();
 return useMutation({
 mutationFn: (body: MedicalConditionInput) => medicalConditionsApi.create(body),
 onSuccess: (_data, variables) => {
 invalidate(qc, variables.patientId);
 toast.success('Condition added.');
 },
 onError: (err: Error) => toast.error(err.message),
 });
}

export function useUpdateMedicalCondition() {
 const qc = useQueryClient();
 return useMutation({
 mutationFn: ({ id, body }: { id: number; body: MedicalConditionInput }) =>
 medicalConditionsApi.update(id, body),
 onSuccess: (_data, variables) => {
 invalidate(qc, variables.body.patientId);
 toast.success('Condition updated.');
 },
 onError: (err: Error) => toast.error(err.message),
 });
}

export function useDeleteMedicalCondition() {
 const qc = useQueryClient();
 return useMutation({
 mutationFn: ({ id }: { id: number; patientId?: number }) => medicalConditionsApi.remove(id),
 onSuccess: (_data, variables) => {
 invalidate(qc, variables.patientId);
 toast.success('Condition removed.');
 },
 onError: (err: Error) => toast.error(err.message),
 });
}
