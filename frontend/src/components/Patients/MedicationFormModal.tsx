import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { TextArea } from '../ui/TextArea';
import { Modal } from '../ui/Modal';
import { useCreateMedication, useUpdateMedication } from '../../hooks/useMedications';
import type { Medication } from '../../types';

const schema = z.object({
  name: z.string().min(1, 'Required').max(120),
  dosage: z.string().min(1, 'Required').max(60),
  frequency: z.string().min(1, 'Required').max(60),
  startDate: z.string().min(1, 'Required'),
  endDate: z.string().optional().or(z.literal('')),
  prescribedBy: z.string().min(1, 'Required').max(120),
  status: z.enum(['Active', 'Discontinued', 'Completed']),
  notes: z.string().optional(),
});
type FormValues = z.infer<typeof schema>;

interface Props {
  open: boolean;
  onClose: () => void;
  patientId: number;
  medication?: Medication | null;
}

const empty: FormValues = {
  name: '',
  dosage: '',
  frequency: '',
  startDate: new Date().toISOString().slice(0, 10),
  endDate: '',
  prescribedBy: '',
  status: 'Active',
  notes: '',
};

export function MedicationFormModal({ open, onClose, patientId, medication }: Props) {
  const isEdit = Boolean(medication);
  const create = useCreateMedication();
  const update = useUpdateMedication();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema), defaultValues: empty });

  useEffect(() => {
    if (!open) return;
    if (medication) {
      reset({
        name: medication.name,
        dosage: medication.dosage,
        frequency: medication.frequency,
        startDate: medication.startDate.slice(0, 10),
        endDate: medication.endDate?.slice(0, 10) ?? '',
        prescribedBy: medication.prescribedBy,
        status: medication.status,
        notes: medication.notes ?? '',
      });
    } else {
      reset(empty);
    }
  }, [open, medication, reset]);

  const onSubmit = async (v: FormValues) => {
    const body = {
      patientId,
      name: v.name,
      dosage: v.dosage,
      frequency: v.frequency,
      startDate: v.startDate,
      endDate: v.endDate || null,
      prescribedBy: v.prescribedBy,
      status: v.status,
      notes: v.notes || null,
    };
    if (isEdit && medication) {
      await update.mutateAsync({ id: medication.id, body });
    } else {
      await create.mutateAsync(body);
    }
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEdit ? 'Edit medication' : 'Add medication'}
      footer={
        <>
          <Button variant="outline" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="submit"
            form="med-form"
            loading={isSubmitting || create.isPending || update.isPending}
          >
            {isEdit ? 'Save' : 'Add'}
          </Button>
        </>
      }
    >
      <form id="med-form" onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input label="Name" {...register('name')} error={errors.name?.message} />
        <div className="grid grid-cols-2 gap-3">
          <Input label="Dosage" {...register('dosage')} error={errors.dosage?.message} />
          <Input label="Frequency" {...register('frequency')} error={errors.frequency?.message} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Start date"
            type="date"
            {...register('startDate')}
            error={errors.startDate?.message}
          />
          <Input label="End date (optional)" type="date" {...register('endDate')} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Prescribed by"
            {...register('prescribedBy')}
            error={errors.prescribedBy?.message}
          />
          <Select
            label="Status"
            {...register('status')}
            options={[
              { value: 'Active', label: 'Active' },
              { value: 'Discontinued', label: 'Discontinued' },
              { value: 'Completed', label: 'Completed' },
            ]}
          />
        </div>
        <TextArea label="Notes" rows={3} {...register('notes')} />
      </form>
    </Modal>
  );
}
