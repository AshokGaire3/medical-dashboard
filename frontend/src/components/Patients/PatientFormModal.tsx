import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { TextArea } from '../ui/TextArea';
import { Button } from '../ui/Button';
import { PATIENT_STATUSES } from '../../utils/constants';
import type { Patient } from '../../types';
import { useCreatePatient, useUpdatePatient } from '../../hooks/usePatients';

const schema = z.object({
  name: z.string().min(2, 'Name is required'),
  age: z.coerce.number().int().min(0, '0+').max(130, '≤ 130'),
  gender: z.enum(['Male', 'Female', 'Other']),
  condition: z.string().min(1, 'Condition is required'),
  status: z.enum(PATIENT_STATUSES as unknown as [string, ...string[]]),
  isCurrentPatient: z.boolean(),
  lastVisit: z.string().min(1, 'Last visit is required'),
  admissionDate: z.string().optional().or(z.literal('')),
  dischargeDate: z.string().optional().or(z.literal('')),
  phone: z.string().optional(),
  email: z.string().email('Invalid email').optional().or(z.literal('')),
  address: z.string().optional(),
  emergencyName: z.string().optional(),
  emergencyRelationship: z.string().optional(),
  emergencyPhone: z.string().optional(),
  allergies: z.string().optional(),
  treatmentNotes: z.string().optional(),
});
type FormValues = z.infer<typeof schema>;

interface Props {
  open: boolean;
  onClose: () => void;
  patient?: Patient | null;
}

const emptyDefaults: FormValues = {
  name: '',
  age: 0,
  gender: 'Male',
  condition: '',
  status: 'Stable',
  isCurrentPatient: true,
  lastVisit: new Date().toISOString().split('T')[0],
  admissionDate: '',
  dischargeDate: '',
  phone: '',
  email: '',
  address: '',
  emergencyName: '',
  emergencyRelationship: '',
  emergencyPhone: '',
  allergies: '',
  treatmentNotes: '',
};

export function PatientFormModal({ open, onClose, patient }: Props) {
  const create = useCreatePatient();
  const update = useUpdatePatient();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: emptyDefaults,
  });

  useEffect(() => {
    if (!open) return;
    if (patient) {
      reset({
        name: patient.name,
        age: patient.age,
        gender: patient.gender,
        condition: patient.condition,
        status: patient.status,
        isCurrentPatient: patient.isCurrentPatient,
        lastVisit: patient.lastVisit?.split('T')[0] ?? '',
        admissionDate: patient.admissionDate ?? '',
        dischargeDate: patient.dischargeDate ?? '',
        phone: patient.contactInfo?.phone ?? '',
        email: patient.contactInfo?.email ?? '',
        address: patient.contactInfo?.address ?? '',
        emergencyName: patient.emergencyContact?.name ?? '',
        emergencyRelationship: patient.emergencyContact?.relationship ?? '',
        emergencyPhone: patient.emergencyContact?.phone ?? '',
        allergies: (patient.allergies ?? []).join(', '),
        treatmentNotes: patient.treatmentNotes ?? '',
      });
    } else {
      reset(emptyDefaults);
    }
  }, [open, patient, reset]);

  const onSubmit = async (v: FormValues) => {
    const payload: Partial<Patient> = {
      name: v.name,
      age: v.age,
      gender: v.gender,
      condition: v.condition,
      status: v.status as Patient['status'],
      isCurrentPatient: v.isCurrentPatient,
      lastVisit: v.lastVisit,
      admissionDate: v.admissionDate || null,
      dischargeDate: v.dischargeDate || null,
      contactInfo: {
        phone: v.phone ?? '',
        email: v.email ?? '',
        address: v.address ?? '',
      },
      emergencyContact: {
        name: v.emergencyName ?? '',
        relationship: v.emergencyRelationship ?? '',
        phone: v.emergencyPhone ?? '',
      },
      allergies: (v.allergies ?? '')
        .split(',')
        .map((x) => x.trim())
        .filter(Boolean),
      treatmentNotes: v.treatmentNotes || null,
    };

    if (patient) {
      await update.mutateAsync({ id: patient.id, body: { ...payload, id: patient.id } });
    } else {
      await create.mutateAsync(payload);
    }
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={patient ? 'Edit patient' : 'Add patient'}
      description={patient ? `Editing ${patient.name}` : 'Fill in the patient details.'}
      size="lg"
      footer={
        <>
          <Button variant="outline" onClick={onClose} type="button">
            Cancel
          </Button>
          <Button
            type="submit"
            form="patient-form"
            loading={isSubmitting || create.isPending || update.isPending}
          >
            {patient ? 'Save changes' : 'Create patient'}
          </Button>
        </>
      }
    >
      <form id="patient-form" onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input label="Full name" {...register('name')} error={errors.name?.message} />
        <Input label="Age" type="number" {...register('age')} error={errors.age?.message} />

        <Select
          label="Gender"
          options={[
            { value: 'Male', label: 'Male' },
            { value: 'Female', label: 'Female' },
            { value: 'Other', label: 'Other' },
          ]}
          {...register('gender')}
          error={errors.gender?.message}
        />
        <Select
          label="Status"
          options={PATIENT_STATUSES.map((s) => ({ value: s, label: s }))}
          {...register('status')}
          error={errors.status?.message}
        />

        <Input label="Primary condition" {...register('condition')} error={errors.condition?.message} />
        <Input label="Last visit" type="date" {...register('lastVisit')} error={errors.lastVisit?.message} />

        <Input label="Admission date" type="date" {...register('admissionDate')} />
        <Input label="Discharge date" type="date" {...register('dischargeDate')} />

        <Input label="Phone" {...register('phone')} />
        <Input label="Email" type="email" {...register('email')} error={errors.email?.message} />

        <div className="md:col-span-2">
          <Input label="Address" {...register('address')} />
        </div>

        <Input label="Emergency contact name" {...register('emergencyName')} />
        <Input label="Relationship" {...register('emergencyRelationship')} />
        <Input label="Emergency phone" {...register('emergencyPhone')} />
        <Input label="Allergies (comma separated)" {...register('allergies')} />

        <label className="md:col-span-2 flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
          <input
            type="checkbox"
            {...register('isCurrentPatient')}
            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          This patient is currently under active treatment
        </label>

        <div className="md:col-span-2">
          <TextArea label="Treatment notes" rows={3} {...register('treatmentNotes')} />
        </div>
      </form>
    </Modal>
  );
}
