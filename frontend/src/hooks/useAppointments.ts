import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { appointmentsApi, type AppointmentsQuery } from '../api';
import type { Appointment, AppointmentStatus } from '../types';

const keys = {
 all: ['appointments'] as const,
 list: (q: AppointmentsQuery | undefined) => [...keys.all, 'list', q ?? {}] as const,
};

export function useAppointments(params?: AppointmentsQuery) {
 return useQuery({
 queryKey: keys.list(params),
 queryFn: () => appointmentsApi.list(params),
 });
}

export function useCreateAppointment() {
 const qc = useQueryClient();
 return useMutation({
 mutationFn: (body: Partial<Appointment>) => appointmentsApi.create(body),
 onSuccess: () => {
 qc.invalidateQueries({ queryKey: keys.all });
 toast.success('Appointment scheduled.');
 },
 onError: (err: Error) => toast.error(err.message),
 });
}

export function useUpdateAppointment() {
 const qc = useQueryClient();
 return useMutation({
 mutationFn: ({ id, body }: { id: number; body: Partial<Appointment> }) =>
 appointmentsApi.update(id, body),
 onSuccess: () => {
 qc.invalidateQueries({ queryKey: keys.all });
 qc.invalidateQueries({ queryKey: ['patients'] });
 toast.success('Appointment updated.');
 },
 onError: (err: Error) => toast.error(err.message),
 });
}

export function useUpdateAppointmentStatus() {
 const qc = useQueryClient();
 return useMutation({
 mutationFn: ({ id, status }: { id: number; status: AppointmentStatus }) =>
 appointmentsApi.setStatus(id, status),
 onSuccess: () => {
 qc.invalidateQueries({ queryKey: keys.all });
 toast.success('Appointment updated.');
 },
 onError: (err: Error) => toast.error(err.message),
 });
}

export function useDeleteAppointment() {
 const qc = useQueryClient();
 return useMutation({
 mutationFn: (id: number) => appointmentsApi.remove(id),
 onSuccess: () => {
 qc.invalidateQueries({ queryKey: keys.all });
 toast.success('Appointment removed.');
 },
 onError: (err: Error) => toast.error(err.message),
 });
}
