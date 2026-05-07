import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Modal } from '../ui/Modal';
import { useCreateVital, useUpdateVital } from '../../hooks/useVitals';
import type { Vital } from '../../types';

const schema = z.object({
 timestamp: z.string().min(1, 'Required'),
 heartRate: z.coerce.number().int().min(20).max(260),
 bloodPressureSystemic: z.coerce.number().int().min(50).max(260),
 bloodPressureDiastolic: z.coerce.number().int().min(30).max(180),
 temperature: z.coerce.number().min(85).max(115),
 oxygenSaturation: z.coerce.number().int().min(50).max(100),
 respiratoryRate: z.coerce.number().int().min(4).max(60),
});
type FormValues = z.infer<typeof schema>;

function toLocalInput(iso?: string): string {
 if (!iso) return '';
 const d = new Date(iso);
 if (Number.isNaN(d.getTime())) return '';
 const pad = (n: number) => n.toString().padStart(2, '0');
 return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

interface Props {
 open: boolean;
 onClose: () => void;
 patientId: number;
 vital?: Vital | null;
}

export function VitalFormModal({ open, onClose, patientId, vital }: Props) {
 const isEdit = Boolean(vital);
 const create = useCreateVital();
 const update = useUpdateVital();

 const {
 register,
 handleSubmit,
 reset,
 formState: { errors, isSubmitting },
 } = useForm<FormValues>({
 resolver: zodResolver(schema),
 defaultValues: {
 timestamp: toLocalInput(new Date().toISOString()),
 heartRate: 72,
 bloodPressureSystemic: 120,
 bloodPressureDiastolic: 80,
 temperature: 98.6,
 oxygenSaturation: 98,
 respiratoryRate: 16,
 },
 });

 useEffect(() => {
 if (!open) return;
 if (vital) {
 reset({
 timestamp: toLocalInput(vital.timestamp),
 heartRate: vital.heartRate,
 bloodPressureSystemic: vital.bloodPressureSystemic,
 bloodPressureDiastolic: vital.bloodPressureDiastolic,
 temperature: vital.temperature,
 oxygenSaturation: vital.oxygenSaturation,
 respiratoryRate: vital.respiratoryRate,
 });
 } else {
 reset({
 timestamp: toLocalInput(new Date().toISOString()),
 heartRate: 72,
 bloodPressureSystemic: 120,
 bloodPressureDiastolic: 80,
 temperature: 98.6,
 oxygenSaturation: 98,
 respiratoryRate: 16,
 });
 }
 }, [open, vital, reset]);

 const onSubmit = async (v: FormValues) => {
 const body = {
 patientId,
 timestamp: new Date(v.timestamp).toISOString(),
 heartRate: v.heartRate,
 bloodPressureSystemic: v.bloodPressureSystemic,
 bloodPressureDiastolic: v.bloodPressureDiastolic,
 temperature: v.temperature,
 oxygenSaturation: v.oxygenSaturation,
 respiratoryRate: v.respiratoryRate,
 };
 if (isEdit && vital) {
 await update.mutateAsync({ id: vital.id, body });
 } else {
 await create.mutateAsync(body);
 }
 onClose();
 };

 return (
 <Modal
 open={open}
 onClose={onClose}
 title={isEdit ? 'Edit vitals' : 'Record vitals'}
 description={isEdit ? 'Update this reading.' : 'Enter a new vitals reading for this patient.'}
 footer={
 <>
 <Button variant="outline" type="button" onClick={onClose}>
 Cancel
 </Button>
 <Button
 type="submit"
 form="vital-form"
 loading={isSubmitting || create.isPending || update.isPending}
 >
 {isEdit ? 'Save' : 'Record'}
 </Button>
 </>
 }
 >
 <form id="vital-form" onSubmit={handleSubmit(onSubmit)} className="space-y-4">
 <Input
 label="Timestamp"
 type="datetime-local"
 {...register('timestamp')}
 error={errors.timestamp?.message}
 />
 <div className="grid grid-cols-2 gap-3">
 <Input
 label="Heart rate (bpm)"
 type="number"
 {...register('heartRate')}
 error={errors.heartRate?.message}
 />
 <Input
 label="Respiratory rate"
 type="number"
 {...register('respiratoryRate')}
 error={errors.respiratoryRate?.message}
 />
 </div>
 <div className="grid grid-cols-2 gap-3">
 <Input
 label="BP systolic"
 type="number"
 {...register('bloodPressureSystemic')}
 error={errors.bloodPressureSystemic?.message}
 />
 <Input
 label="BP diastolic"
 type="number"
 {...register('bloodPressureDiastolic')}
 error={errors.bloodPressureDiastolic?.message}
 />
 </div>
 <div className="grid grid-cols-2 gap-3">
 <Input
 label="Temperature (°F)"
 type="number"
 step="0.1"
 {...register('temperature')}
 error={errors.temperature?.message}
 />
 <Input
 label="Oxygen saturation (%)"
 type="number"
 {...register('oxygenSaturation')}
 error={errors.oxygenSaturation?.message}
 />
 </div>
 </form>
 </Modal>
 );
}
