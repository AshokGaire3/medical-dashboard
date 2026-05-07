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
import { RequireRole } from '../components/auth/RequireRole';
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

type TypeFilter = 'all' | 'current' | 'recovered' | 'historical';

export default function Patients() {
 const [search, setSearch] = useState('');
 const [statusFilter, setStatusFilter] = useState<PatientStatus | ''>('');
 const [typeFilter, setTypeFilter] = useState<TypeFilter>('all');
 const [page, setPage] = useState(1);
 const [pageSize] = useState(10);
 const [selected, setSelected] = useState<Patient | null>(null);
 const [editing, setEditing] = useState<Patient | null>(null);
 const [creating, setCreating] = useState(false);
 const [confirmDelete, setConfirmDelete] = useState<Patient | null>(null);

 const debouncedSearch = useDebounce(search, 300);

 // Derive isCurrent and forced-status from the active tab
 const isCurrent =
 typeFilter === 'current' ? true
 : typeFilter === 'historical' ? false
 : undefined; // 'all' and 'recovered' don't filter by isCurrent

 const forcedStatus: PatientStatus | undefined =
 typeFilter === 'recovered' ? 'Recovered' : undefined;

 const query = usePatients({
 search: debouncedSearch || undefined,
 status: forcedStatus ?? (statusFilter || undefined),
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

  <div className="bg-themeWhite border-2 border-themeBlack p-4 shadow-brutal">
    <div className="flex gap-2 w-full border-b-2 border-themeBlack pb-2">
      {([
        { key: 'all', label: 'All' },
        { key: 'current', label: 'Current' },
        { key: 'recovered', label: '✓ Recovered' },
        { key: 'historical',label: 'Historical' },
      ] as { key: TypeFilter; label: string }[]).map(({ key, label }) => (
        <button
          key={key}
          onClick={() => {
            setTypeFilter(key);
            setStatusFilter('');
            setPage(1);
          }}
          className={`py-2 px-6 text-sm font-semibold capitalize transition-all border-2 ${
            typeFilter === key
              ? 'bg-themeBlack text-themeWhite border-themeBlack'
              : 'bg-themeWhite text-themeBlack border-transparent hover:border-themeBlack'
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  </div>

 <div className="bg-themeWhite dark:bg-themeBlack border-2 border-themeBlack dark:border-themeWhite p-4 shadow-brutal dark:shadow-brutal-sm">
 <div className="flex flex-col md:flex-row gap-4 md:items-end">
 <div className="flex-1">
 <Input
 leftIcon={<Search strokeWidth={2} className="w-4 h-4" />}
 placeholder="Search by name or condition…"
 value={search}
 onChange={(e) => {
 setSearch(e.target.value);
 setPage(1);
 }}
 />
 </div>
 <div className="w-full md:w-64">
 <Select
 value={typeFilter === 'recovered' ? 'Recovered' : statusFilter}
 onChange={(e) => {
 setStatusFilter(e.target.value as PatientStatus | '');
 setPage(1);
 }}
 disabled={typeFilter === 'recovered'}
 options={[
 { value: '', label: 'ALL STATUSES' },
 ...PATIENT_STATUSES.map((s) => ({ value: s, label: s.toUpperCase() })),
 ]}
 />
 </div>
 <Button leftIcon={<Plus strokeWidth={2} className="w-4 h-4" />} onClick={() => setCreating(true)}>
 Add patient
 </Button>
 </div>
 </div>

  <div className="bg-themeWhite border-2 border-themeBlack shadow-brutal overflow-hidden">
  <div className="px-6 py-4 border-b-2 border-themeBlack flex justify-between items-center bg-gray-50">
  <div>
  <h3 className="text-xl font-bold text-themeBlack tracking-tight capitalize">
  {typeFilter} patients
  </h3>
  <p className="text-sm font-medium text-gray-500 mt-1">
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
  <thead className="bg-gray-100 text-themeBlack border-b-2 border-themeBlack">
  <tr>
  <Th>Patient</Th>
  <Th>Age</Th>
  <Th>Condition</Th>
  <Th>Status</Th>
  <Th>Last visit</Th>
  <Th className="text-right pr-6">Actions</Th>
  </tr>
  </thead>
  <tbody className="divide-y-2 divide-themeBlack">
  {patients.map((p) => (
  <tr key={p.id} className="hover:bg-gray-50 transition-colors group">
 <td className="px-6 py-4">
 <div className="flex items-center gap-4">
 <div
  className={`w-10 h-10 border-2 border-themeBlack flex items-center justify-center font-bold ${
  p.isCurrentPatient
  ? 'bg-accentBlue text-themeWhite'
  : 'bg-gray-200 text-themeBlack'
  }`}
 >
 <span
 className="text-sm"
 >
 {p.name
 .split(' ')
 .map((n) => n[0])
 .slice(0, 2)
 .join('')}
 </span>
 </div>
 <div>
 <p className="text-base font-bold tracking-tight">
 {p.name}
 </p>
  <p className="text-xs font-medium text-gray-500 mt-1">{p.gender}</p>
 </div>
 </div>
 </td>
  <td className="px-6 py-4 text-sm font-medium">{p.age}</td>
 <td className="px-6 py-4 text-sm font-bold">
 {p.condition}
 </td>
 <td className="px-6 py-4">
 <StatusBadge status={p.status} />
 </td>
 <td className="px-6 py-4 text-sm font-bold">
 {p.lastVisit ? new Date(p.lastVisit).toLocaleDateString() : '—'}
 </td>
 <td className="px-6 py-4 text-right pr-6">
 <div className="inline-flex items-center gap-2">
 <IconButton onClick={() => setSelected(p)} title="View">
 <Eye strokeWidth={2} className="w-4 h-4" />
 </IconButton>
 <IconButton onClick={() => setEditing(p)} title="Edit">
 <Pencil strokeWidth={2} className="w-4 h-4" />
 </IconButton>
 <RequireRole roles={['Doctor', 'Admin']}>
 <IconButton
 onClick={() => setConfirmDelete(p)}
 title="Delete"
 variant="danger"
 >
 <Trash2 strokeWidth={2} className="w-4 h-4" />
 </IconButton>
 </RequireRole>
 </div>
 </td>
 </tr>
 ))}
 </tbody>
 </table>
 </div>
 )}

 {totalPages > 1 && (
 <div className="px-6 py-3 flex items-center justify-between border-t border-themeBlack dark:border-themeWhite">
 <p className="text-xs text-gray-500 dark:text-themeWhite/60">
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
  className={`px-6 py-4 text-left text-xs font-bold uppercase tracking-wide ${className}`}
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
 icon: React.ComponentType<{ className?: string, strokeWidth?: number | string }>;
 color: 'blue' | 'red' | 'green' | 'purple';
 label: string;
 value: number;
 hint?: string;
}) {
  const tones: Record<string, string> = {
  blue: 'bg-accentBlue text-themeWhite border-2 border-themeBlack',
  green: 'bg-accentGreen text-themeWhite border-2 border-themeBlack',
  red: 'bg-red-500 text-themeWhite border-2 border-themeBlack',
  purple: 'bg-purple-500 text-themeWhite border-2 border-themeBlack',
  };
 return (
  <div className="bg-themeWhite border-2 border-themeBlack p-6 hover:-translate-y-1 hover:shadow-brutal transition-all group">
 <div className="flex items-center justify-between">
  <div>
  <p className="text-sm font-semibold tracking-wide text-gray-600 mb-1 uppercase">{label}</p>
  <p className="text-3xl font-bold text-themeBlack tracking-tight">{value}</p>
  {hint ? <p className="text-sm mt-2 text-gray-500 font-medium">{hint}</p> : null}
  </div>
 <div className={`p-3 shrink-0 transition-transform group-hover:scale-110 ${tones[color]}`}>
 <Icon strokeWidth={1.5} className="w-8 h-8" />
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
 className="bg-themeWhite dark:bg-themeBlack shadow-xl w-full max-w-sm p-6 border-2 border-themeBlack dark:border-themeWhite"
 onClick={(e) => e.stopPropagation()}
 >
 <h3 className="text-lg font-semibold text-themeBlack dark:text-themeWhite">{title}</h3>
 {description ? (
 <p className="text-sm text-gray-500 dark:text-themeWhite/60 mt-2">{description}</p>
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
