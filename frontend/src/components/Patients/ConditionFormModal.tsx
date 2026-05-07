import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { TextArea } from '../ui/TextArea';
import { Modal } from '../ui/Modal';
import {
  useCreateMedicalCondition,
  useUpdateMedicalCondition,
} from '../../hooks/useMedicalConditions';
import type { MedicalCondition } from '../../types';

const schema = z.object({
  condition: z.string().min(1, 'Required').max(200),
  diagnosedDate: z.string().min(1, 'Required'),
  severity: z.enum(['Mild', 'Moderate', 'Severe']),
  status: z.enum(['Active', 'Resolved', 'Chronic']),
  notes: z.string().optional(),
});
type FormValues = z.infer<typeof schema>;

interface Props {
  open: boolean;
  onClose: () => void;
  patientId: number;
  condition?: MedicalCondition | null;
}

const empty: FormValues = {
  condition: '',
  diagnosedDate: new Date().toISOString().slice(0, 10),
  severity: 'Mild',
  status: 'Active',
  notes: '',
};

export function ConditionFormModal({ open, onClose, patientId, condition }: Props) {
  const isEdit = Boolean(condition);
  const create = useCreateMedicalCondition();
  const update = useUpdateMedicalCondition();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema), defaultValues: empty });

  useEffect(() => {
    if (!open) return;
    if (condition) {
      reset({
        condition: condition.condition,
        diagnosedDate: condition.diagnosedDate.slice(0, 10),
        severity: condition.severity,
        status: condition.status,
        notes: condition.notes ?? '',
      });
    } else {
      reset(empty);
    }
  }, [open, condition, reset]);

  const onSubmit = async (v: FormValues) => {
    const body = {
      patientId,
      condition: v.condition,
      diagnosedDate: v.diagnosedDate,
      severity: v.severity,
      status: v.status,
      notes: v.notes ?? '',
    };
    if (isEdit && condition) {
      await update.mutateAsync({ id: condition.id, body });
    } else {
      await create.mutateAsync(body);
    }
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEdit ? 'Edit condition' : 'Add condition'}
      footer={
        <>
          <Button variant="outline" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="submit"
            form="cond-form"
            loading={isSubmitting || create.isPending || update.isPending}
          >
            {isEdit ? 'Save' : 'Add'}
          </Button>
        </>
      }
    >
      <form id="cond-form" onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Condition"
          {...register('condition')}
          error={errors.condition?.message}
        />
        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Diagnosed date"
            type="date"
            {...register('diagnosedDate')}
            error={errors.diagnosedDate?.message}
          />
          <Select
            label="Severity"
            {...register('severity')}
            options={[
              { value: 'Mild', label: 'Mild' },
              { value: 'Moderate', label: 'Moderate' },
              { value: 'Severe', label: 'Severe' },
            ]}
          />
        </div>
        <Select
          label="Status"
          {...register('status')}
          options={[
            { value: 'Active', label: 'Active' },
            { value: 'Chronic', label: 'Chronic' },
            { value: 'Resolved', label: 'Resolved' },
          ]}
        />
        <TextArea label="Notes" rows={3} {...register('notes')} />
      </form>
    </Modal>
  );
}
