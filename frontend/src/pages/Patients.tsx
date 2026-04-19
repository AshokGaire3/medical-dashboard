import { useMemo, useState } from 'react';
import {
  Search,
  Plus,
  Users,
  AlertTriangle,
  CheckCircle,
  Clock,
  Pencil,
  Trash2,
  Eye,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import PatientProfile from '../components/Patients/PatientProfile';
import { PatientFormModal } from '../components/Patients/PatientFormModal';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { StatusBadge } from '../components/ui/Badge';
import { EmptyState } from '../components/ui/EmptyState';
import { ErrorState } from '../components/ui/ErrorState';
import { Spinner } from '../components/ui/Spinner';
import { useDeletePatient, usePatients } from '../hooks/usePatients';
import { useDashboardMetrics } from '../hooks/useDashboard';
import { useDebounce } from '../hooks/useDebounce';
import { PATIENT_STATUSES } from '../utils/constants';
import type { Patient, PatientStatus } from '../types';

type TypeFilter = 'current' | 'historical' | 'all';

export default function Patients() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<PatientStatus | ''>('');
  const [typeFilter, setTypeFilter] = useState<TypeFilter>('current');
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [selected, setSelected] = useState<Patient | null>(null);
  const [editing, setEditing] = useState<Patient | null>(null);
  const [creating, setCreating] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<Patient | null>(null);

  const debouncedSearch = useDebounce(search, 300);
  const isCurrent = typeFilter === 'all' ? undefined : typeFilter === 'current';

  const query = usePatients({
    search: debouncedSearch || undefined,
    status: statusFilter || undefined,
    isCurrent,
    page,
    pageSize,
    sortBy: 'name',
    sortDir: 'asc',
  });

  const metricsQ = useDashboardMetrics();
  const del = useDeletePatient();

  const patients = query.data?.items ?? [];
  const total = query.data?.total ?? 0;
  const totalPages = query.data?.totalPages ?? 1;

  const metrics = metricsQ.data;

  const counts = useMemo(
    () => ({
      current: metrics?.currentPatients ?? 0,
      critical: metrics?.criticalCases ?? 0,
      recovered: metrics?.recoveredPatients ?? 0,
      lifetime: metrics?.lifetimePatients ?? 0,
    }),
    [metrics],
  );

  return (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard icon={Users} color="blue" label="Current" value={counts.current} hint="Active" />
        <StatCard
          icon={AlertTriangle}
          color="red"
          label="Critical"
          value={counts.critical}
          hint="Need attention"
        />
        <StatCard
          icon={CheckCircle}
          color="green"
          label="Recovered"
          value={counts.recovered}
          hint="Lifetime"
        />
        <StatCard icon={Clock} color="purple" label="Lifetime" value={counts.lifetime} hint="Total" />
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-4">
        <div className="flex gap-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg w-full">
          {(['current', 'historical', 'all'] as TypeFilter[]).map((t) => (
            <button
              key={t}
              onClick={() => {
                setTypeFilter(t);
                setPage(1);
              }}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium capitalize transition-colors ${
                typeFilter === t
                  ? 'bg-white dark:bg-gray-900 text-blue-600 shadow-sm'
                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-4">
        <div className="flex flex-col md:flex-row gap-3 md:items-end">
          <div className="flex-1">
            <Input
              leftIcon={<Search className="w-4 h-4" />}
              placeholder="Search by name or condition…"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
            />
          </div>
          <div className="w-full md:w-56">
            <Select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value as PatientStatus | '');
                setPage(1);
              }}
              options={[
                { value: '', label: 'All statuses' },
                ...PATIENT_STATUSES.map((s) => ({ value: s, label: s })),
              ]}
            />
          </div>
          <Button leftIcon={<Plus className="w-4 h-4" />} onClick={() => setCreating(true)}>
            Add patient
          </Button>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 capitalize">
              {typeFilter} patients
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {total} patient{total !== 1 ? 's' : ''}
            </p>
          </div>
        </div>

        {query.isLoading ? (
          <div className="py-12 flex justify-center">
            <Spinner size="lg" label="Loading patients…" />
          </div>
        ) : query.isError ? (
          <ErrorState
            message={(query.error as Error)?.message ?? 'Could not load patients'}
            onRetry={() => query.refetch()}
          />
        ) : patients.length === 0 ? (
          <EmptyState
            title="No patients found"
            description="Try adjusting your search or filters, or add a new patient."
            action={
              <Button onClick={() => setCreating(true)} leftIcon={<Plus className="w-4 h-4" />}>
                Add patient
              </Button>
            }
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-800/60">
                <tr>
                  <Th>Patient</Th>
                  <Th>Age</Th>
                  <Th>Condition</Th>
                  <Th>Status</Th>
                  <Th>Last visit</Th>
                  <Th className="text-right pr-6">Actions</Th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {patients.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                    <td className="px-6 py-3">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-9 h-9 rounded-full flex items-center justify-center ${
                            p.isCurrentPatient
                              ? 'bg-blue-100 dark:bg-blue-900/40'
                              : 'bg-gray-100 dark:bg-gray-800'
                          }`}
                        >
                          <span
                            className={`text-sm font-semibold ${
                              p.isCurrentPatient
                                ? 'text-blue-700 dark:text-blue-300'
                                : 'text-gray-600 dark:text-gray-300'
                            }`}
                          >
                            {p.name
                              .split(' ')
                              .map((n) => n[0])
                              .slice(0, 2)
                              .join('')}
                          </span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                            {p.name}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">{p.gender}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-3 text-sm text-gray-700 dark:text-gray-300">{p.age}</td>
                    <td className="px-6 py-3 text-sm text-gray-700 dark:text-gray-300">
                      {p.condition}
                    </td>
                    <td className="px-6 py-3">
                      <StatusBadge status={p.status} />
                    </td>
                    <td className="px-6 py-3 text-sm text-gray-700 dark:text-gray-300">
                      {p.lastVisit ? new Date(p.lastVisit).toLocaleDateString() : '—'}
                    </td>
                    <td className="px-6 py-3 text-right pr-6">
                      <div className="inline-flex items-center gap-1">
                        <IconButton onClick={() => setSelected(p)} title="View">
                          <Eye className="w-4 h-4" />
                        </IconButton>
                        <IconButton onClick={() => setEditing(p)} title="Edit">
                          <Pencil className="w-4 h-4" />
                        </IconButton>
                        <IconButton
                          onClick={() => setConfirmDelete(p)}
                          title="Delete"
                          variant="danger"
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

        {totalPages > 1 && (
          <div className="px-6 py-3 flex items-center justify-between border-t border-gray-200 dark:border-gray-800">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Page {page} of {totalPages} · {total} total
            </p>
            <div className="flex gap-1">
              <Button
                size="sm"
                variant="outline"
                disabled={page <= 1}
                onClick={() => setPage((x) => Math.max(1, x - 1))}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button
                size="sm"
                variant="outline"
                disabled={page >= totalPages}
                onClick={() => setPage((x) => Math.min(totalPages, x + 1))}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </div>

      {selected && <PatientProfile patient={selected} onClose={() => setSelected(null)} />}
      <PatientFormModal open={creating} onClose={() => setCreating(false)} />
      <PatientFormModal open={Boolean(editing)} onClose={() => setEditing(null)} patient={editing} />

      {confirmDelete && (
        <ConfirmDialog
          title={`Delete ${confirmDelete.name}?`}
          description="This cannot be undone. All associated vitals and appointments will also be removed."
          confirmText="Delete"
          loading={del.isPending}
          onCancel={() => setConfirmDelete(null)}
          onConfirm={async () => {
            await del.mutateAsync(confirmDelete.id);
            setConfirmDelete(null);
          }}
        />
      )}
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

function StatCard({
  icon: Icon,
  color,
  label,
  value,
  hint,
}: {
  icon: React.ComponentType<{ className?: string }>;
  color: 'blue' | 'red' | 'green' | 'purple';
  label: string;
  value: number;
  hint?: string;
}) {
  const tones: Record<string, string> = {
    blue: 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-300',
    red: 'bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-300',
    green: 'bg-green-50 text-green-600 dark:bg-green-900/30 dark:text-green-300',
    purple: 'bg-purple-50 text-purple-600 dark:bg-purple-900/30 dark:text-purple-300',
  };
  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{label}</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">{value}</p>
          {hint ? <p className="text-xs text-gray-500 dark:text-gray-400">{hint}</p> : null}
        </div>
        <div className={`p-3 rounded-lg ${tones[color]}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
}

function ConfirmDialog({
  title,
  description,
  confirmText = 'Confirm',
  loading,
  onConfirm,
  onCancel,
}: {
  title: string;
  description?: string;
  confirmText?: string;
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={onCancel}
    >
      <div
        className="bg-white dark:bg-gray-900 rounded-xl shadow-xl w-full max-w-sm p-6 border border-gray-200 dark:border-gray-800"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{title}</h3>
        {description ? (
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">{description}</p>
        ) : null}
        <div className="mt-6 flex justify-end gap-2">
          <Button variant="outline" onClick={onCancel} disabled={loading}>
            Cancel
          </Button>
          <Button variant="danger" onClick={onConfirm} loading={loading}>
            {confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
}
