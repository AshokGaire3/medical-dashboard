import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { patientsApi } from '../api';
import type { Patient, PatientsQuery } from '../types';

const keys = {
  all: ['patients'] as const,
  list: (q: PatientsQuery | undefined) => [...keys.all, 'list', q ?? {}] as const,
  detail: (id: number) => [...keys.all, 'detail', id] as const,
  healthScore: (id: number) => [...keys.all, 'health-score', id] as const,
};

export function usePatients(params?: PatientsQuery) {
  return useQuery({
    queryKey: keys.list(params),
    queryFn: () => patientsApi.list(params),
    placeholderData: (prev) => prev,
  });
}

export function usePatient(id: number | undefined) {
  return useQuery({
    queryKey: id ? keys.detail(id) : ['patients', 'detail', 'null'],
    queryFn: () => patientsApi.get(id!),
    enabled: Boolean(id),
  });
}

export function useCreatePatient() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: Partial<Patient>) => patientsApi.create(body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: keys.all });
      toast.success('Patient created.');
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

export function useUpdatePatient() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, body }: { id: number; body: Partial<Patient> }) =>
      patientsApi.update(id, body),
    onSuccess: (_void, vars) => {
      qc.invalidateQueries({ queryKey: keys.all });
      qc.invalidateQueries({ queryKey: keys.detail(vars.id) });
      toast.success('Patient updated.');
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

// Loads NEWS2 health score for one patient; disabled until id is known.
export function useHealthScore(id: number | undefined) {
  return useQuery({
    queryKey: id ? keys.healthScore(id) : ['patients', 'health-score', 'null'],
    queryFn: () => patientsApi.healthScore(id!),
    enabled: Boolean(id),
    retry: false,
  });
}

export function useDeletePatient() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => patientsApi.remove(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: keys.all });
      toast.success('Patient deleted.');
    },
    onError: (err: Error) => toast.error(err.message),
  });
}
