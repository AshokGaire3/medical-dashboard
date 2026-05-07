import { useMemo, useState } from 'react';
import {
 Calendar,
 Plus,
 Trash2,
 CheckCircle,
 XCircle,
 Clock,
 Pencil,
 List,
 CalendarDays,
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Select } from '../components/ui/Select';
import { Badge } from '../components/ui/Badge';
import { EmptyState } from '../components/ui/EmptyState';
import { ErrorState } from '../components/ui/ErrorState';
import { Spinner } from '../components/ui/Spinner';
import { PageHeader } from '../components/ui/PageHeader';
import { AppointmentFormModal } from '../components/Appointments/AppointmentFormModal';
import { WeeklyCalendar } from '../components/Appointments/WeeklyCalendar';
import { RequireRole } from '../components/auth/RequireRole';
import {
 useAppointments,
 useDeleteAppointment,
 useUpdateAppointmentStatus,
} from '../hooks/useAppointments';
import { usePreference } from '../hooks/usePreference';
import { useAuth } from '../context/AuthContext';
import type { Appointment, AppointmentStatus } from '../types';

type ViewMode = 'list' | 'calendar';

const statusTones: Record<AppointmentStatus, 'blue' | 'green' | 'yellow' | 'red' | 'gray'> = {
 Scheduled: 'blue',
 Completed: 'green',
 Cancelled: 'gray',
 NoShow: 'red',
};

export default function Appointments() {
 const [view, setView] = usePreference<ViewMode>('appointments.view', 'list');
 const [statusFilter, setStatusFilter] = useState<AppointmentStatus | ''>('');
 const [formOpen, setFormOpen] = useState(false);
 const [editing, setEditing] = useState<Appointment | null>(null);
 const [slotDate, setSlotDate] = useState<Date | undefined>(undefined);
 const [anchorDate, setAnchorDate] = useState(new Date());

 const { hasRole } = useAuth();
 const canEdit = hasRole(['Doctor', 'Admin']);

 const listQ = useAppointments(statusFilter ? { status: statusFilter } : undefined);
 const setStatus = useUpdateAppointmentStatus();
 const del = useDeleteAppointment();

 const items = useMemo(() => listQ.data ?? [], [listQ.data]);

 const openCreate = (date?: Date) => {
 setEditing(null);
 setSlotDate(date);
 setFormOpen(true);
 };
 const openEdit = (a: Appointment) => {
 setEditing(a);
 setSlotDate(undefined);
 setFormOpen(true);
 };
 const closeForm = () => {
 setFormOpen(false);
 setEditing(null);
 setSlotDate(undefined);
 };

 return (
 <div className="p-6">
 <PageHeader
 title="Appointments"
 description="Schedule visits, reschedule existing ones, and track no-shows."
 actions={
 <>
 <div className="flex bg-gray-100 dark:bg-gray-800 p-0.5 mr-2">
 <button
 type="button"
 onClick={() => setView('list')}
 className={`px-3 py-1.5 text-sm rounded-md flex items-center gap-1.5 ${
 view === 'list'
 ? 'bg-themeBlack dark:bg-themeWhite text-themeWhite dark:text-themeBlack'
 : 'text-themeBlack dark:text-themeWhite hover:text-gray-600 dark:hover:text-themeWhite/70'
 }`}
 >
 <List strokeWidth={2} className="w-4 h-4" />
 List
 </button>
 <button
 type="button"
 onClick={() => setView('calendar')}
 className={`px-3 py-1.5 text-sm font-bold tracking-normal rounded-md flex items-center gap-2 ${
 view === 'calendar'
 ? 'bg-themeBlack dark:bg-themeWhite text-themeWhite dark:text-themeBlack'
 : 'text-gray-600 dark:text-themeWhite/70'
 }`}
 >
 <CalendarDays className="w-4 h-4" />
 Calendar
 </button>
 </div>
 {view === 'list' ? (
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
 ) : null}
 <Button leftIcon={<Plus className="w-4 h-4" />} onClick={() => openCreate()}>
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
 ) : view === 'calendar' ? (
 <WeeklyCalendar
 anchorDate={anchorDate}
 onAnchorChange={setAnchorDate}
 appointments={items}
 onSelectAppointment={(a) => (canEdit ? openEdit(a) : undefined)}
 onSelectSlot={(d) => openCreate(d)}
 />
 ) : items.length === 0 ? (
 <div className="bg-themeWhite dark:bg-themeBlack border-2 border-themeBlack dark:border-themeWhite">
 <EmptyState
 icon={<Calendar className="w-6 h-6" />}
 title="No appointments yet"
 description="Schedule one to get started."
 action={
 <Button leftIcon={<Plus className="w-4 h-4" />} onClick={() => openCreate()}>
 New appointment
 </Button>
 }
 />
 </div>
 ) : (
 <div className="bg-themeWhite dark:bg-themeBlack border-2 border-themeBlack shadow-brutal dark:shadow-brutal-sm dark:border-themeWhite overflow-hidden">
 <table className="w-full">
 <thead className="bg-themeBlack dark:bg-themeWhite text-themeWhite dark:text-themeBlack">
 <tr>
 <Th>Patient</Th>
 <Th>When</Th>
 <Th>Duration</Th>
 <Th>Reason</Th>
 <Th>Status</Th>
 <Th className="text-right pr-6">Actions</Th>
 </tr>
 </thead>
 <tbody className="divide-y-2 divide-themeBlack dark:divide-themeWhite">
 {items.map((a) => (
 <tr key={a.id} className="hover:bg-themeBlack hover:text-themeWhite dark:hover:bg-themeWhite dark:hover:text-themeBlack transition-colors group">
 <td className="px-6 py-4 text-base font-bold tracking-tight">
 {a.patientName ?? `#${a.patientId}`}
 </td>
 <td className="px-6 py-4 text-sm font-bold">
 {new Date(a.scheduledAt).toLocaleString([], {
 dateStyle: 'medium',
 timeStyle: 'short',
 })}
 </td>
 <td className="px-6 py-4 text-sm font-bold">
 {a.durationMinutes} min
 </td>
 <td className="px-6 py-4 text-sm font-bold">
 {a.reason}
 </td>
 <td className="px-6 py-3">
 <Badge tone={statusTones[a.status]}>{a.status}</Badge>
 </td>
 <td className="px-6 py-3 text-right pr-6">
 <div className="inline-flex items-center gap-2">
 {a.status === 'Scheduled' && (
 <>
 <IconButton
 title="Mark completed"
 onClick={() => setStatus.mutate({ id: a.id, status: 'Completed' })}
 >
 <CheckCircle strokeWidth={2} className="w-5 h-5" />
 </IconButton>
 <IconButton
 title="No show"
 onClick={() => setStatus.mutate({ id: a.id, status: 'NoShow' })}
 >
 <Clock strokeWidth={2} className="w-5 h-5" />
 </IconButton>
 <IconButton
 title="Cancel"
 onClick={() => setStatus.mutate({ id: a.id, status: 'Cancelled' })}
 >
 <XCircle strokeWidth={2} className="w-5 h-5" />
 </IconButton>
 </>
 )}
 <RequireRole roles={['Doctor', 'Admin', 'Nurse']}>
 <IconButton title="Reschedule / edit" onClick={() => openEdit(a)}>
 <Pencil strokeWidth={2} className="w-5 h-5" />
 </IconButton>
 </RequireRole>
 <RequireRole roles={['Doctor', 'Admin']}>
 <IconButton
 title="Delete"
 variant="danger"
 onClick={() => del.mutate(a.id)}
 >
 <Trash2 strokeWidth={2} className="w-5 h-5" />
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

 <AppointmentFormModal
 open={formOpen}
 onClose={closeForm}
 appointment={editing}
 defaultDate={slotDate}
 />
 </div>
 );
}

function Th({ children, className = '' }: { children: React.ReactNode; className?: string }) {
 return (
 <th
 className={`px-6 py-4 text-left text-xs font-bold tracking-normal ${className}`}
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
 className={`p-1.5 transition-colors group-hover:text-themeWhite dark:group-hover:text-themeBlack ${
 variant === 'danger'
 ? 'text-themeBlack dark:text-themeWhite hover:text-red-500 dark:hover:text-red-400'
 : 'text-themeBlack dark:text-themeWhite hover:opacity-70'
 }`}
 >
 {children}
 </button>
 );
}
