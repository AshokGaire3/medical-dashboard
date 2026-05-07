import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { medicationsApi } from '../api';
import type { MedicationInput } from '../types';

const keys = {
  all: ['medications'] as const,
  list: (patientId?: number, status?: string) =>
    [...keys.all, 'list', patientId ?? 'all', status ?? 'all'] as const,
};

export function useMedications(patientId?: number, status?: string, enabled = true) {
  return useQuery({
    queryKey: keys.list(patientId, status),
    queryFn: () => medicationsApi.list(patientId, status),
    enabled,
  });
}

function invalidate(qc: ReturnType<typeof useQueryClient>, patientId?: number) {
  qc.invalidateQueries({ queryKey: keys.all });
  if (patientId) {
    qc.invalidateQueries({ queryKey: ['patients', 'detail', patientId] });
  }
}

export function useCreateMedication() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: MedicationInput) => medicationsApi.create(body),
    onSuccess: (_data, variables) => {
      invalidate(qc, variables.patientId);
      toast.success('Medication added.');
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

export function useUpdateMedication() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, body }: { id: number; body: MedicationInput }) =>
      medicationsApi.update(id, body),
    onSuccess: (_data, variables) => {
      invalidate(qc, variables.body.patientId);
      toast.success('Medication updated.');
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

export function useDeleteMedication() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id }: { id: number; patientId?: number }) => medicationsApi.remove(id),
    onSuccess: (_data, variables) => {
      invalidate(qc, variables.patientId);
      toast.success('Medication removed.');
    },
    onError: (err: Error) => toast.error(err.message),
  });
}
