import { useState } from 'react';
import { Stethoscope, Plus, Pencil, Trash2 } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { EmptyState } from '../ui/EmptyState';
import { ErrorState } from '../ui/ErrorState';
import { Spinner } from '../ui/Spinner';
import { RequireRole } from '../auth/RequireRole';
import { ConditionFormModal } from './ConditionFormModal';
import {
  useDeleteMedicalCondition,
  useMedicalConditions,
} from '../../hooks/useMedicalConditions';
import type { ConditionSeverity, ConditionStatus, MedicalCondition } from '../../types';

const severityTone: Record<ConditionSeverity, 'yellow' | 'red' | 'gray'> = {
  Mild: 'yellow',
  Moderate: 'yellow',
  Severe: 'red',
};
const statusTone: Record<ConditionStatus, 'green' | 'red' | 'yellow' | 'gray'> = {
  Active: 'red',
  Resolved: 'green',
  Chronic: 'yellow',
};

export function ConditionsTab({ patientId }: { patientId: number }) {
  const listQ = useMedicalConditions(patientId);
  const del = useDeleteMedicalCondition();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<MedicalCondition | null>(null);

  const items = listQ.data ?? [];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold text-themeBlack dark:text-themeWhite flex items-center gap-2">
          <Stethoscope className="w-5 h-5 text-blue-500" />
          Medical history
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
            Add condition
          </Button>
        </RequireRole>
      </div>

      {listQ.isLoading ? (
        <div className="py-10 flex justify-center">
          <Spinner label="Loading conditions…" />
        </div>
      ) : listQ.isError ? (
        <ErrorState
          message={(listQ.error as Error)?.message ?? 'Failed to load conditions'}
          onRetry={() => listQ.refetch()}
        />
      ) : items.length === 0 ? (
        <EmptyState title="No medical history recorded" />
      ) : (
        <div className="space-y-2">
          {items.map((c) => (
            <div
              key={c.id}
              className="bg-themeWhite dark:bg-themeBlack border-2 border-themeBlack dark:border-themeWhite p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="font-semibold text-themeBlack dark:text-themeWhite">
                      {c.condition}
                    </h4>
                    <Badge tone={severityTone[c.severity]}>{c.severity}</Badge>
                    <Badge tone={statusTone[c.status]}>{c.status}</Badge>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Diagnosed {format(parseISO(c.diagnosedDate), 'MMM d, yyyy')}
                  </p>
                  {c.notes ? (
                    <p className="mt-2 text-sm text-themeBlack dark:text-themeWhite bg-gray-50 dark:bg-gray-800 rounded px-2 py-1">
                      {c.notes}
                    </p>
                  ) : null}
                </div>
                <RequireRole roles={['Doctor', 'Admin']}>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      title="Edit"
                      onClick={() => {
                        setEditing(c);
                        setOpen(true);
                      }}
                      className="p-1.5 rounded-md text-themeBlack/70 dark:text-themeWhite/70 hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      title="Delete"
                      onClick={() => del.mutate({ id: c.id, patientId })}
                      className="p-1.5 rounded-md text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </RequireRole>
              </div>
            </div>
          ))}
        </div>
      )}

      <ConditionFormModal
        open={open}
        onClose={() => {
          setOpen(false);
          setEditing(null);
        }}
        patientId={patientId}
        condition={editing}
      />
    </div>
  );
}
