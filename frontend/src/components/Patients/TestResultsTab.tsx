import { useState } from 'react';
import { TestTube, Plus, Pencil, Trash2 } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { EmptyState } from '../ui/EmptyState';
import { ErrorState } from '../ui/ErrorState';
import { Spinner } from '../ui/Spinner';
import { RequireRole } from '../auth/RequireRole';
import { TestResultFormModal } from './TestResultFormModal';
import { useDeleteTestResult, useTestResults } from '../../hooks/useTestResults';
import type { TestResult } from '../../types';

const tone: Record<string, 'green' | 'yellow' | 'red' | 'gray'> = {
  Normal: 'green',
  Abnormal: 'yellow',
  Critical: 'red',
  Pending: 'gray',
};

export function TestResultsTab({ patientId }: { patientId: number }) {
  const listQ = useTestResults(patientId);
  const del = useDeleteTestResult();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<TestResult | null>(null);

  const items = listQ.data ?? [];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold text-themeBlack dark:text-themeWhite flex items-center gap-2">
          <TestTube className="w-5 h-5 text-purple-500" />
          Test results
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
            Record result
          </Button>
        </RequireRole>
      </div>

      {listQ.isLoading ? (
        <div className="py-10 flex justify-center">
          <Spinner label="Loading test results…" />
        </div>
      ) : listQ.isError ? (
        <ErrorState
          message={(listQ.error as Error)?.message ?? 'Failed to load test results'}
          onRetry={() => listQ.refetch()}
        />
      ) : items.length === 0 ? (
        <EmptyState title="No test results yet" />
      ) : (
        <div className="space-y-2">
          {items.map((t) => (
            <div
              key={t.id}
              className="bg-themeWhite dark:bg-themeBlack border-2 border-themeBlack dark:border-themeWhite p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold text-themeBlack dark:text-themeWhite">
                      {t.testName}
                    </h4>
                    <Badge tone={tone[t.status] ?? 'gray'}>{t.status}</Badge>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {t.testType} · {format(parseISO(t.date), 'MMM d, yyyy')} · Ordered by{' '}
                    {t.orderedBy}
                  </p>
                  <p className="mt-2 text-sm text-gray-800 dark:text-gray-200">
                    <span className="font-medium">Result:</span> {t.result}
                    {t.normalRange ? (
                      <span className="text-themeBlack/60 dark:text-themeWhite/60 ml-2">
                        (normal: {t.normalRange})
                      </span>
                    ) : null}
                  </p>
                  {t.notes ? (
                    <p className="mt-1 text-sm text-themeBlack dark:text-themeWhite bg-gray-50 dark:bg-gray-800 rounded px-2 py-1">
                      {t.notes}
                    </p>
                  ) : null}
                </div>
                <RequireRole roles={['Doctor', 'Admin']}>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      title="Edit"
                      onClick={() => {
                        setEditing(t);
                        setOpen(true);
                      }}
                      className="p-1.5 rounded-md text-themeBlack/70 dark:text-themeWhite/70 hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      title="Delete"
                      onClick={() => del.mutate({ id: t.id, patientId })}
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

      <TestResultFormModal
        open={open}
        onClose={() => {
          setOpen(false);
          setEditing(null);
        }}
        patientId={patientId}
        test={editing}
      />
    </div>
  );
}
