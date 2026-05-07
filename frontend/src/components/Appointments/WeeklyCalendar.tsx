import { ChevronLeft, ChevronRight } from 'lucide-react';
import {
 addDays,
 addWeeks,
 format,
 isSameDay,
 parseISO,
 startOfWeek,
} from 'date-fns';
import { Button } from '../ui/Button';
import type { Appointment, AppointmentStatus } from '../../types';

interface WeeklyCalendarProps {
 anchorDate: Date;
 onAnchorChange: (_d: Date) => void;
 appointments: Appointment[];
 onSelectAppointment?: (_a: Appointment) => void;
 onSelectSlot?: (_d: Date) => void;
}

const HOUR_START = 7;
const HOUR_END = 19;
const HOURS = Array.from({ length: HOUR_END - HOUR_START + 1 }, (_, i) => HOUR_START + i);

const statusTone: Record<AppointmentStatus, string> = {
 Scheduled: 'bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-900/40 dark:text-blue-200 dark:border-blue-700',
 Completed: 'bg-green-100 text-green-800 border-green-300 dark:bg-green-900/40 dark:text-green-200 dark:border-green-700',
 Cancelled: 'bg-gray-100 text-gray-700 border-gray-300 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600',
 NoShow: 'bg-red-100 text-red-800 border-red-300 dark:bg-red-900/40 dark:text-red-200 dark:border-red-700',
};

export function WeeklyCalendar({
 anchorDate,
 onAnchorChange,
 appointments,
 onSelectAppointment,
 onSelectSlot,
}: WeeklyCalendarProps) {
 const weekStart = startOfWeek(anchorDate, { weekStartsOn: 1 });
 const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

 return (
 <div className="bg-themeWhite dark:bg-themeBlack border-2 border-themeBlack shadow-brutal dark:shadow-brutal-sm dark:border-themeWhite overflow-hidden">
 <div className="flex items-center justify-between px-4 py-3 border-b border-themeBlack dark:border-themeWhite">
 <div>
 <h3 className="text-sm font-semibold text-themeBlack dark:text-themeWhite">
 {format(weekStart, 'MMMM d')} – {format(addDays(weekStart, 6), 'MMMM d, yyyy')}
 </h3>
 <p className="text-xs text-gray-500 dark:text-themeWhite/60">
 {appointments.length} appointment{appointments.length === 1 ? '' : 's'}
 </p>
 </div>
 <div className="flex gap-1">
 <Button
 size="sm"
 variant="outline"
 onClick={() => onAnchorChange(addWeeks(anchorDate, -1))}
 >
 <ChevronLeft className="w-4 h-4" />
 </Button>
 <Button size="sm" variant="outline" onClick={() => onAnchorChange(new Date())}>
 Today
 </Button>
 <Button
 size="sm"
 variant="outline"
 onClick={() => onAnchorChange(addWeeks(anchorDate, 1))}
 >
 <ChevronRight className="w-4 h-4" />
 </Button>
 </div>
 </div>

 <div className="overflow-x-auto">
 <div className="min-w-[900px]">
 <div className="grid grid-cols-[60px_repeat(7,1fr)] border-b border-themeBlack dark:border-themeWhite bg-gray-50 dark:bg-gray-800/60">
 <div />
 {days.map((d) => (
 <div
 key={d.toISOString()}
 className={`px-2 py-2 text-center border-l border-themeBlack dark:border-themeWhite ${
 isSameDay(d, new Date())
 ? 'bg-blue-50 dark:bg-blue-900/20'
 : ''
 }`}
 >
 <p className="text-[11px] tracking-wide text-gray-500 dark:text-themeWhite/60">
 {format(d, 'EEE')}
 </p>
 <p
 className={`text-sm font-semibold ${
 isSameDay(d, new Date())
 ? 'text-blue-700 dark:text-blue-300'
 : 'text-themeBlack dark:text-themeWhite'
 }`}
 >
 {format(d, 'd')}
 </p>
 </div>
 ))}
 </div>

 {HOURS.map((hour) => (
 <div
 key={hour}
 className="grid grid-cols-[60px_repeat(7,1fr)] border-b border-gray-100 dark:border-gray-800/70"
 >
 <div className="px-2 py-2 text-[11px] text-gray-500 dark:text-themeWhite/60 text-right">
 {format(new Date().setHours(hour, 0, 0, 0), 'h a')}
 </div>
 {days.map((d) => {
 const slotStart = new Date(d);
 slotStart.setHours(hour, 0, 0, 0);
 const slotEnd = new Date(slotStart);
 slotEnd.setHours(hour + 1);
 const slotAppts = appointments.filter((a) => {
 const at = parseISO(a.scheduledAt);
 return at >= slotStart && at < slotEnd;
 });
 return (
 <button
 key={d.toISOString() + hour}
 type="button"
 onClick={() => onSelectSlot?.(slotStart)}
 className="relative min-h-[56px] border-l border-gray-100 dark:border-gray-800/70 text-left hover:bg-gray-50 dark:hover:bg-gray-800/40 px-1 py-1"
 >
 {slotAppts.map((a) => (
 <span
 key={a.id}
 onClick={(e) => {
 e.stopPropagation();
 onSelectAppointment?.(a);
 }}
 className={`block text-[11px] px-2 py-1 mb-1 rounded border truncate cursor-pointer ${statusTone[a.status]}`}
 title={`${a.patientName ?? '#' + a.patientId} – ${a.reason}`}
 >
 {format(parseISO(a.scheduledAt), 'h:mm')}{' '}
 {a.patientName ?? `#${a.patientId}`}
 </span>
 ))}
 </button>
 );
 })}
 </div>
 ))}
 </div>
 </div>
 </div>
 );
}
