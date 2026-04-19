import { useState } from 'react';
import { Calendar, Plus, Trash2, CheckCircle, XCircle, Clock } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { TextArea } from '../components/ui/TextArea';
import { Modal } from '../components/ui/Modal';
import { Badge } from '../components/ui/Badge';
import { EmptyState } from '../components/ui/EmptyState';
import { ErrorState } from '../components/ui/ErrorState';
import { Spinner } from '../components/ui/Spinner';
import { PageHeader } from '../components/ui/PageHeader';
import {
  useAppointments,
  useCreateAppointment,
  useDeleteAppointment,
  useUpdateAppointmentStatus,
} from '../hooks/useAppointments';
import { usePatients } from '../hooks/usePatients';
import type { AppointmentStatus } from '../types';

const schema = z.object({
  patientId: z.coerce.number().int().min(1, 'Select a patient'),
  scheduledAt: z.string().min(1, 'Required'),
  durationMinutes: z.coerce.number().int().min(5).max(480).default(30),
  reason: z.string().min(2, 'Reason is required'),
  notes: z.string().optional(),
});
type FormValues = z.infer<typeof schema>;

const statusTones: Record<AppointmentStatus, 'blue' | 'green' | 'yellow' | 'red' | 'gray'> = {
  Scheduled: 'blue',
  Completed: 'green',
  Cancelled: 'gray',
  NoShow: 'red',
};

export default function Appointments() {
  const [open, setOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<AppointmentStatus | ''>('');
  const listQ = useAppointments(statusFilter ? { status: statusFilter } : undefined);
  const patientsQ = usePatients({ pageSize: 200 });
  const create = useCreateAppointment();
  const setStatus = useUpdateAppointmentStatus();
  const del = useDeleteAppointment();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      patientId: 0,
      scheduledAt: '',
      durationMinutes: 30,
      reason: '',
      notes: '',
    },
  });

  const onSubmit = async (v: FormValues) => {
    await create.mutateAsync({
      patientId: v.patientId,
      scheduledAt: new Date(v.scheduledAt).toISOString(),
      durationMinutes: v.durationMinutes,
      reason: v.reason,
      notes: v.notes || null,
      status: 'Scheduled',
    });
    reset();
    setOpen(false);
  };

  const items = listQ.data ?? [];
  const patientOptions = [
    { value: '0', label: 'Select patient…' },
    ...(patientsQ.data?.items ?? []).map((p) => ({ value: String(p.id), label: p.name })),
  ];

  return (
    <div className="p-6">
      <PageHeader
        title="Appointments"
        description="Schedule visits, mark them completed, and track no-shows."
        actions={
          <>
            <Select
              className="w-44"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as AppointmentStatus | '')}
              options={[
                { value: '', label: 'All statuses' },
                { value: 'Scheduled', label: 'Scheduled' },
                { value: 'Completed', label: 'Completed' },
                { value: 'Cancelled', label: 'Cancelled' },
                { value: 'NoShow', label: 'No show' },
              ]}
            />
            <Button leftIcon={<Plus className="w-4 h-4" />} onClick={() => setOpen(true)}>
              New appointment
            </Button>
          </>
        }
      />

      {listQ.isLoading ? (
        <div className="py-12 flex justify-center">
          <Spinner size="lg" label="Loading appointments…" />
        </div>
      ) : listQ.isError ? (
        <ErrorState
          message={(listQ.error as Error)?.message ?? 'Failed to load'}
          onRetry={() => listQ.refetch()}
        />
      ) : items.length === 0 ? (
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800">
          <EmptyState
            icon={<Calendar className="w-6 h-6" />}
            title="No appointments yet"
            description="Schedule one to get started."
            action={
              <Button leftIcon={<Plus className="w-4 h-4" />} onClick={() => setOpen(true)}>
                New appointment
              </Button>
            }
          />
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-800/60">
              <tr>
                <Th>Patient</Th>
                <Th>When</Th>
                <Th>Duration</Th>
                <Th>Reason</Th>
                <Th>Status</Th>
                <Th className="text-right pr-6">Actions</Th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {items.map((a) => (
                <tr key={a.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                  <td className="px-6 py-3 text-sm text-gray-900 dark:text-gray-100">
                    {a.patientName ?? `#${a.patientId}`}
                  </td>
                  <td className="px-6 py-3 text-sm text-gray-700 dark:text-gray-300">
                    {new Date(a.scheduledAt).toLocaleString([], {
                      dateStyle: 'medium',
                      timeStyle: 'short',
                    })}
                  </td>
                  <td className="px-6 py-3 text-sm text-gray-700 dark:text-gray-300">
                    {a.durationMinutes} min
                  </td>
                  <td className="px-6 py-3 text-sm text-gray-700 dark:text-gray-300">{a.reason}</td>
                  <td className="px-6 py-3">
                    <Badge tone={statusTones[a.status]}>{a.status}</Badge>
                  </td>
                  <td className="px-6 py-3 text-right pr-6">
                    <div className="inline-flex items-center gap-1">
                      {a.status === 'Scheduled' && (
                        <>
                          <IconButton
                            title="Mark completed"
                            onClick={() =>
                              setStatus.mutate({ id: a.id, status: 'Completed' })
                            }
                          >
                            <CheckCircle className="w-4 h-4 text-green-600" />
                          </IconButton>
                          <IconButton
                            title="No show"
                            onClick={() =>
                              setStatus.mutate({ id: a.id, status: 'NoShow' })
                            }
                          >
                            <Clock className="w-4 h-4 text-yellow-600" />
                          </IconButton>
                          <IconButton
                            title="Cancel"
                            onClick={() =>
                              setStatus.mutate({ id: a.id, status: 'Cancelled' })
                            }
                          >
                            <XCircle className="w-4 h-4 text-gray-600" />
                          </IconButton>
                        </>
                      )}
                      <IconButton
                        title="Delete"
                        variant="danger"
                        onClick={() => del.mutate(a.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </IconButton>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="New appointment"
        description="Schedule a visit for a patient."
        footer={
          <>
            <Button variant="outline" onClick={() => setOpen(false)} type="button">
              Cancel
            </Button>
            <Button
              type="submit"
              form="appt-form"
              loading={isSubmitting || create.isPending}
            >
              Schedule
            </Button>
          </>
        }
      >
        <form id="appt-form" onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Select
            label="Patient"
            options={patientOptions}
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
          <TextArea label="Notes" rows={3} {...register('notes')} />
        </form>
      </Modal>
    </div>
  );
}

function Th({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <th
      className={`px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider ${className}`}
    >
      {children}
    </th>
  );
}

function IconButton({
  children,
  onClick,
  title,
  variant = 'default',
}: {
  children: React.ReactNode;
  onClick: () => void;
  title?: string;
  variant?: 'default' | 'danger';
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={`p-1.5 rounded-md transition-colors ${
        variant === 'danger'
          ? 'text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20'
          : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
      }`}
    >
      {children}
    </button>
  );
}
