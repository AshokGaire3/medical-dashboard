import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { TextArea } from '../ui/TextArea';
import { Modal } from '../ui/Modal';
import { useCreateAppointment, useUpdateAppointment } from '../../hooks/useAppointments';
import { usePatients } from '../../hooks/usePatients';
import type { Appointment, AppointmentStatus } from '../../types';

const schema = z.object({
 patientId: z.coerce.number().int().min(1, 'Select a patient'),
 scheduledAt: z.string().min(1, 'Required'),
 durationMinutes: z.coerce.number().int().min(5).max(480),
 reason: z.string().min(2, 'Reason is required'),
 status: z.enum(['Scheduled', 'Completed', 'Cancelled', 'NoShow']),
 notes: z.string().optional(),
});
type FormValues = z.infer<typeof schema>;

interface Props {
 open: boolean;
 onClose: () => void;
 appointment?: Appointment | null;
 defaultPatientId?: number;
 defaultDate?: Date;
}

function toLocalInput(iso?: string): string {
 if (!iso) return '';
 const d = new Date(iso);
 if (Number.isNaN(d.getTime())) return '';
 const pad = (n: number) => n.toString().padStart(2, '0');
 return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export function AppointmentFormModal({
 open,
 onClose,
 appointment,
 defaultPatientId,
 defaultDate,
}: Props) {
 const isEdit = Boolean(appointment);
 const create = useCreateAppointment();
 const update = useUpdateAppointment();
 const patientsQ = usePatients({ pageSize: 200 });

 const {
 register,
 handleSubmit,
 reset,
 formState: { errors, isSubmitting },
 } = useForm<FormValues>({
 resolver: zodResolver(schema),
 defaultValues: {
 patientId: defaultPatientId ?? 0,
 scheduledAt: defaultDate ? toLocalInput(defaultDate.toISOString()) : '',
 durationMinutes: 30,
 reason: '',
 status: 'Scheduled',
 notes: '',
 },
 });

 useEffect(() => {
 if (!open) return;
 if (appointment) {
 reset({
 patientId: appointment.patientId,
 scheduledAt: toLocalInput(appointment.scheduledAt),
 durationMinutes: appointment.durationMinutes,
 reason: appointment.reason,
 status: appointment.status,
 notes: appointment.notes ?? '',
 });
 } else {
 reset({
 patientId: defaultPatientId ?? 0,
 scheduledAt: defaultDate ? toLocalInput(defaultDate.toISOString()) : '',
 durationMinutes: 30,
 reason: '',
 status: 'Scheduled',
 notes: '',
 });
 }
 }, [open, appointment, defaultPatientId, defaultDate, reset]);

 const onSubmit = async (v: FormValues) => {
 const body = {
 patientId: v.patientId,
 scheduledAt: new Date(v.scheduledAt).toISOString(),
 durationMinutes: v.durationMinutes,
 reason: v.reason,
 status: v.status as AppointmentStatus,
 notes: v.notes || null,
 };
 if (isEdit && appointment) {
 await update.mutateAsync({ id: appointment.id, body });
 } else {
 await create.mutateAsync(body);
 }
 onClose();
 };

 const patientOptions = [
 { value: '0', label: 'Select patient…' },
 ...(patientsQ.data?.items ?? []).map((p) => ({ value: String(p.id), label: p.name })),
 ];

 return (
 <Modal
 open={open}
 onClose={onClose}
 title={isEdit ? 'Reschedule appointment' : 'New appointment'}
 description={isEdit ? 'Update this appointment.' : 'Schedule a visit for a patient.'}
 footer={
 <>
 <Button variant="outline" onClick={onClose} type="button">
 Cancel
 </Button>
 <Button
 type="submit"
 form="appt-form"
 loading={isSubmitting || create.isPending || update.isPending}
 >
 {isEdit ? 'Save changes' : 'Schedule'}
 </Button>
 </>
 }
 >
 <form id="appt-form" onSubmit={handleSubmit(onSubmit)} className="space-y-4">
 <Select
 label="Patient"
 options={patientOptions}
 disabled={isEdit}
 {...register('patientId')}
 error={errors.patientId?.message}
 />
 <div className="grid grid-cols-2 gap-3">
 <Input
 label="Date & time"
 type="datetime-local"
 {...register('scheduledAt')}
 error={errors.scheduledAt?.message}
 />
 <Input
 label="Duration (min)"
 type="number"
 min={5}
 max={480}
 {...register('durationMinutes')}
 error={errors.durationMinutes?.message}
 />
 </div>
 <Input label="Reason" {...register('reason')} error={errors.reason?.message} />
 {isEdit ? (
 <Select
 label="Status"
 {...register('status')}
 options={[
 { value: 'Scheduled', label: 'Scheduled' },
 { value: 'Completed', label: 'Completed' },
 { value: 'Cancelled', label: 'Cancelled' },
 { value: 'NoShow', label: 'No show' },
 ]}
 />
 ) : null}
 <TextArea label="Notes" rows={3} {...register('notes')} />
 </form>
 </Modal>
 );
}
