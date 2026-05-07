import { useMemo, useState } from 'react';
import { Pill, Plus, Pencil, Trash2 } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { EmptyState } from '../ui/EmptyState';
import { ErrorState } from '../ui/ErrorState';
import { Spinner } from '../ui/Spinner';
import { RequireRole } from '../auth/RequireRole';
import { MedicationFormModal } from './MedicationFormModal';
import { useDeleteMedication, useMedications } from '../../hooks/useMedications';
import type { Medication, MedicationStatus } from '../../types';

const tone: Record<MedicationStatus, 'green' | 'red' | 'blue' | 'gray'> = {
  Active: 'green',
  Discontinued: 'red',
  Completed: 'blue',
};

export function MedicationsTab({ patientId }: { patientId: number }) {
  const listQ = useMedications(patientId);
  const del = useDeleteMedication();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Medication | null>(null);

  const { active, inactive } = useMemo(() => {
    const items = listQ.data ?? [];
    return {
      active: items.filter((m) => m.status === 'Active'),
      inactive: items.filter((m) => m.status !== 'Active'),
    };
  }, [listQ.data]);

  const total = (listQ.data ?? []).length;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold text-themeBlack dark:text-themeWhite flex items-center gap-2">
          <Pill className="w-5 h-5 text-green-500" />
          Medications
        </h3>
        <RequireRole
          roles={['Doctor', 'Admin']}
          fallback={
            <p className="text-xs text-themeBlack/60 dark:text-themeWhite/60 italic">
              Read-only for your role
            </p>
          }
        >
          <Button
            size="sm"
            leftIcon={<Plus className="w-4 h-4" />}
            onClick={() => {
              setEditing(null);
              setOpen(true);
            }}
          >
            Add medication
          </Button>
        </RequireRole>
      </div>

      {listQ.isLoading ? (
        <div className="py-10 flex justify-center">
          <Spinner label="Loading medications…" />
        </div>
      ) : listQ.isError ? (
        <ErrorState
          message={(listQ.error as Error)?.message ?? 'Failed to load medications'}
          onRetry={() => listQ.refetch()}
        />
      ) : total === 0 ? (
        <EmptyState title="No medications on file" />
      ) : (
        <div className="space-y-6">
          <Section
            label={`Active (${active.length})`}
            items={active}
            onEdit={(m) => {
              setEditing(m);
              setOpen(true);
            }}
            onDelete={(m) => del.mutate({ id: m.id, patientId })}
            statusTone={tone}
          />
          {inactive.length > 0 ? (
            <Section
              label={`Past (${inactive.length})`}
              items={inactive}
              onEdit={(m) => {
                setEditing(m);
                setOpen(true);
              }}
              onDelete={(m) => del.mutate({ id: m.id, patientId })}
              statusTone={tone}
            />
          ) : null}
        </div>
      )}

      <MedicationFormModal
        open={open}
        onClose={() => {
          setOpen(false);
          setEditing(null);
        }}
        patientId={patientId}
        medication={editing}
      />
    </div>
  );
}

function Section({
  label,
  items,
  onEdit,
  onDelete,
  statusTone,
}: {
  label: string;
  items: Medication[];
  onEdit: (_m: Medication) => void;
  onDelete: (_m: Medication) => void;
  statusTone: Record<MedicationStatus, 'green' | 'red' | 'blue' | 'gray'>;
}) {
  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-wide text-themeBlack/60 dark:text-themeWhite/60 mb-2">
        {label}
      </p>
      <div className="space-y-2">
        {items.map((m) => (
          <div
            key={m.id}
            className="bg-themeWhite dark:bg-themeBlack border-2 border-themeBlack dark:border-themeWhite p-4"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-semibold text-themeBlack dark:text-themeWhite">{m.name}</h4>
                  <Badge tone={statusTone[m.status]}>{m.status}</Badge>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {m.dosage} · {m.frequency}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                  Prescribed by {m.prescribedBy} · Started{' '}
                  {format(parseISO(m.startDate), 'MMM d, yyyy')}
                  {m.endDate ? ` · Ended ${format(parseISO(m.endDate), 'MMM d, yyyy')}` : ''}
                </p>
                {m.notes ? (
                  <p className="mt-2 text-sm text-themeBlack dark:text-themeWhite bg-gray-50 dark:bg-gray-800 rounded px-2 py-1">
                    {m.notes}
                  </p>
                ) : null}
              </div>
              <div className="flex items-center gap-1">
                <RequireRole roles={['Doctor', 'Admin', 'Nurse']}>
                  <button
                    type="button"
                    title="Edit"
                    onClick={() => onEdit(m)}
                    className="p-1.5 rounded-md text-themeBlack/70 dark:text-themeWhite/70 hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                </RequireRole>
                <RequireRole roles={['Doctor', 'Admin']}>
                  <button
                    type="button"
                    title="Delete"
                    onClick={() => onDelete(m)}
                    className="p-1.5 rounded-md text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </RequireRole>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
