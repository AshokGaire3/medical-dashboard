import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { TextArea } from '../ui/TextArea';
import { Modal } from '../ui/Modal';
import { useCreateTestResult, useUpdateTestResult } from '../../hooks/useTestResults';
import type { TestResult } from '../../types';

const TEST_TYPES = ['Blood Test', 'Imaging', 'Biopsy', 'Cardiac', 'Pulmonary', 'Other'] as const;
const STATUSES = ['Normal', 'Abnormal', 'Critical', 'Pending'] as const;

const schema = z.object({
  testName: z.string().min(1, 'Required').max(120),
  testType: z.enum(TEST_TYPES),
  date: z.string().min(1, 'Required'),
  result: z.string().min(1, 'Required').max(500),
  normalRange: z.string().optional().or(z.literal('')),
  status: z.enum(STATUSES),
  orderedBy: z.string().min(1, 'Required').max(120),
  notes: z.string().optional(),
});
type FormValues = z.infer<typeof schema>;

interface Props {
  open: boolean;
  onClose: () => void;
  patientId: number;
  test?: TestResult | null;
}

const empty: FormValues = {
  testName: '',
  testType: 'Blood Test',
  date: new Date().toISOString().slice(0, 10),
  result: '',
  normalRange: '',
  status: 'Normal',
  orderedBy: '',
  notes: '',
};

export function TestResultFormModal({ open, onClose, patientId, test }: Props) {
  const isEdit = Boolean(test);
  const create = useCreateTestResult();
  const update = useUpdateTestResult();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema), defaultValues: empty });

  useEffect(() => {
    if (!open) return;
    if (test) {
      reset({
        testName: test.testName,
        testType: (TEST_TYPES as readonly string[]).includes(test.testType)
          ? (test.testType as FormValues['testType'])
          : 'Other',
        date: test.date.slice(0, 10),
        result: test.result,
        normalRange: test.normalRange ?? '',
        status: (STATUSES as readonly string[]).includes(test.status)
          ? (test.status as FormValues['status'])
          : 'Normal',
        orderedBy: test.orderedBy,
        notes: test.notes ?? '',
      });
    } else {
      reset(empty);
    }
  }, [open, test, reset]);

  const onSubmit = async (v: FormValues) => {
    const body = {
      patientId,
      testName: v.testName,
      testType: v.testType,
      date: v.date,
      result: v.result,
      normalRange: v.normalRange || null,
      status: v.status,
      orderedBy: v.orderedBy,
      notes: v.notes || null,
    };
    if (isEdit && test) {
      await update.mutateAsync({ id: test.id, body });
    } else {
      await create.mutateAsync(body);
    }
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEdit ? 'Edit test result' : 'Record test result'}
      footer={
        <>
          <Button variant="outline" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="submit"
            form="test-form"
            loading={isSubmitting || create.isPending || update.isPending}
          >
            {isEdit ? 'Save' : 'Record'}
          </Button>
        </>
      }
    >
      <form id="test-form" onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input label="Test name" {...register('testName')} error={errors.testName?.message} />
        <div className="grid grid-cols-2 gap-3">
          <Select
            label="Type"
            {...register('testType')}
            options={TEST_TYPES.map((t) => ({ value: t, label: t }))}
          />
          <Input
            label="Date"
            type="date"
            {...register('date')}
            error={errors.date?.message}
          />
        </div>
        <Input label="Result" {...register('result')} error={errors.result?.message} />
        <div className="grid grid-cols-2 gap-3">
          <Input label="Normal range" {...register('normalRange')} />
          <Select
            label="Status"
            {...register('status')}
            options={STATUSES.map((s) => ({ value: s, label: s }))}
          />
        </div>
        <Input
          label="Ordered by"
          {...register('orderedBy')}
          error={errors.orderedBy?.message}
        />
        <TextArea label="Notes" rows={3} {...register('notes')} />
      </form>
    </Modal>
  );
}
