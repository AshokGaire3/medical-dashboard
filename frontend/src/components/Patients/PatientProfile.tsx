import { useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import {
 X,
 Phone,
 Mail,
 MapPin,
 User,
 AlertTriangle,
 Activity,
 Pill,
 TestTube,
 Stethoscope,
 Printer,
 FileDown,
 Clock,
 Heart,
} from 'lucide-react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import { format, parseISO } from 'date-fns';
import { patientsApi } from '../../api';
import { Tabs } from '../ui/Tabs';
import { StatusBadge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { VitalsTab } from './VitalsTab';
import { MedicationsTab } from './MedicationsTab';
import { TestResultsTab } from './TestResultsTab';
import { ConditionsTab } from './ConditionsTab';
import { TimelineTab } from './TimelineTab';
import { HealthScoreCard } from './HealthScoreCard';
import { useVitals } from '../../hooks/useVitals';
import type { Patient } from '../../types';

interface PatientProfileProps {
 patient: Patient;
 onClose: () => void;
}

type TabId =
 | 'overview'
 | 'vitals'
 | 'medications'
 | 'tests'
 | 'conditions'
 | 'timeline';

export default function PatientProfile({ patient, onClose }: PatientProfileProps) {
 const [tab, setTab] = useState<TabId>('overview');
 const [downloading, setDownloading] = useState(false);

 // Fetch the server-rendered PDF and trigger a browser download.
 const downloadPdf = async () => {
 setDownloading(true);
 try {
 const blob = await patientsApi.reportPdf(patient.id);
 const url = URL.createObjectURL(blob);
 const a = document.createElement('a');
 a.href = url;
 a.download = `patient-${patient.name.replace(/[^a-z0-9]/gi, '-')}-${new Date()
 .toISOString()
 .split('T')[0]}.pdf`;
 document.body.appendChild(a);
 a.click();
 a.remove();
 URL.revokeObjectURL(url);
 } catch (err) {
 toast.error((err as Error).message || 'PDF download failed');
 } finally {
 setDownloading(false);
 }
 };

 const tabs = useMemo(
 () => [
 { id: 'overview' as const, label: 'Overview', icon: <User className="w-4 h-4" /> },
 { id: 'vitals' as const, label: 'Vitals', icon: <Activity className="w-4 h-4" /> },
 { id: 'medications' as const, label: 'Medications', icon: <Pill className="w-4 h-4" /> },
 { id: 'tests' as const, label: 'Tests', icon: <TestTube className="w-4 h-4" /> },
 { id: 'conditions' as const, label: 'Conditions', icon: <Stethoscope className="w-4 h-4" /> },
 { id: 'timeline' as const, label: 'Timeline', icon: <Clock className="w-4 h-4" /> },
 ],
 [],
 );

 return createPortal(
 <div
 role="dialog"
 aria-modal="true"
 className="fixed inset-0 z-50 flex items-center justify-center p-4"
 onClick={onClose}
 >
 <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
 <div
 className="relative bg-themeWhite dark:bg-themeBlack shadow-2xl max-w-5xl w-full max-h-[92vh] overflow-hidden flex flex-col border-2 border-themeBlack dark:border-themeWhite"
 onClick={(e) => e.stopPropagation()}
 >
 <div className="p-5 border-b border-themeBlack dark:border-themeWhite bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900">
 <div className="flex items-start justify-between">
 <div className="flex items-center gap-4">
 <div className="w-14 h-14 bg-blue-100 dark:bg-blue-900/40 rounded-full flex items-center justify-center">
 <span className="text-blue-700 dark:text-blue-300 font-bold text-lg">
 {patient.name
 .split(' ')
 .map((n) => n[0])
 .slice(0, 2)
 .join('')}
 </span>
 </div>
 <div>
 <h2 className="text-xl font-bold text-themeBlack dark:text-themeWhite">
 {patient.name}
 </h2>
 <div className="flex items-center gap-3 mt-1 flex-wrap">
 <StatusBadge status={patient.status} />
 <span className="text-sm text-gray-600 dark:text-gray-400">
 {patient.age} yrs · {patient.gender}
 </span>
 <span className="text-sm text-gray-600 dark:text-gray-400">
 {patient.condition}
 </span>
 </div>
 </div>
 </div>
 <div className="flex items-center gap-2">
 <Button
 size="sm"
 variant="outline"
 leftIcon={<FileDown className="w-4 h-4" />}
 onClick={downloadPdf}
 disabled={downloading}
 >
 {downloading ? 'Generating…' : 'PDF'}
 </Button>
 <Link to={`/patients/${patient.id}/print`} target="_blank" rel="noopener">
 <Button
 size="sm"
 variant="outline"
 leftIcon={<Printer className="w-4 h-4" />}
 >
 Print
 </Button>
 </Link>
 <button
 onClick={onClose}
 aria-label="Close"
 className="p-1.5 hover:bg-white/60 dark:hover:bg-gray-800 text-gray-500 dark:text-themeWhite/60"
 >
 <X className="w-5 h-5" />
 </button>
 </div>
 </div>
 </div>

 <div className="px-4 bg-themeWhite dark:bg-themeBlack">
 <Tabs tabs={tabs} value={tab} onChange={(id) => setTab(id as TabId)} />
 </div>

 <div className="flex-1 overflow-y-auto p-5 bg-gray-50 dark:bg-gray-950">
 {tab === 'overview' && <OverviewPanel patient={patient} />}
 {tab === 'vitals' && <VitalsTab patientId={patient.id} />}
 {tab === 'medications' && <MedicationsTab patientId={patient.id} />}
 {tab === 'tests' && <TestResultsTab patientId={patient.id} />}
 {tab === 'conditions' && <ConditionsTab patientId={patient.id} />}
 {tab === 'timeline' && <TimelineTab patientId={patient.id} />}
 </div>
 </div>
 </div>,
 document.body,
 );
}

function OverviewPanel({ patient }: { patient: Patient }) {
 const vitalsQ = useVitals(patient.id);
 const latest = (vitalsQ.data ?? [])[0];

 return (
 <div className="space-y-4">
 {/* NEWS2 risk score derived from the patient's latest vitals. */}
 <HealthScoreCard patientId={patient.id} />

 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
 <Card icon={<User className="w-4 h-4 text-blue-600" />} title="Patient information">
 <Row label="Age" value={`${patient.age} yrs`} />
 <Row label="Gender" value={patient.gender} />
 <Row
 label="Last visit"
 value={patient.lastVisit ? new Date(patient.lastVisit).toLocaleDateString() : '—'}
 />
 <Row label="Primary condition" value={patient.condition} />
 {patient.admissionDate ? (
 <Row
 label="Admitted"
 value={new Date(patient.admissionDate).toLocaleDateString()}
 />
 ) : null}
 </Card>

 <Card icon={<Phone className="w-4 h-4 text-green-600" />} title="Contact">
 <div className="space-y-2 text-sm">
 <div className="flex items-center gap-2 text-themeBlack dark:text-themeWhite">
 <Phone className="w-4 h-4 text-gray-400" />
 {patient.contactInfo?.phone || '—'}
 </div>
 <div className="flex items-center gap-2 text-themeBlack dark:text-themeWhite">
 <Mail className="w-4 h-4 text-gray-400" />
 {patient.contactInfo?.email || '—'}
 </div>
 <div className="flex items-center gap-2 text-themeBlack dark:text-themeWhite">
 <MapPin className="w-4 h-4 text-gray-400" />
 {patient.contactInfo?.address || '—'}
 </div>
 </div>
 </Card>
 </div>

 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
 <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/40 p-4">
 <h3 className="text-sm font-semibold text-red-900 dark:text-red-200 mb-2 flex items-center gap-2">
 <AlertTriangle className="w-4 h-4" /> Emergency contact
 </h3>
 <p className="text-sm text-red-900 dark:text-red-100 font-medium">
 {patient.emergencyContact?.name || '—'}
 </p>
 <p className="text-xs text-red-800 dark:text-red-300">
 {patient.emergencyContact?.relationship} · {patient.emergencyContact?.phone}
 </p>
 </div>
 <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800/40 p-4">
 <h3 className="text-sm font-semibold text-yellow-900 dark:text-yellow-200 mb-2 flex items-center gap-2">
 <AlertTriangle className="w-4 h-4" /> Allergies
 </h3>
 {patient.allergies?.length ? (
 <div className="flex flex-wrap gap-1.5">
 {patient.allergies.map((a, i) => (
 <span
 key={i}
 className="px-2 py-0.5 bg-yellow-100 dark:bg-yellow-900/40 text-yellow-900 dark:text-yellow-200 text-xs rounded-full border border-yellow-300 dark:border-yellow-700"
 >
 {a}
 </span>
 ))}
 </div>
 ) : (
 <p className="text-sm text-yellow-900 dark:text-yellow-200">None recorded</p>
 )}
 </div>
 </div>

 <Card icon={<Heart className="w-4 h-4 text-blue-600" />} title="Latest vitals">
 {latest ? (
 <div>
 <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
 <Metric label="Heart rate" value={`${latest.heartRate} bpm`} />
 <Metric
 label="Blood pressure"
 value={`${latest.bloodPressureSystemic}/${latest.bloodPressureDiastolic}`}
 />
 <Metric label="Temperature" value={`${latest.temperature}°F`} />
 <Metric label="SpO₂" value={`${latest.oxygenSaturation}%`} />
 <Metric label="Resp" value={`${latest.respiratoryRate}`} />
 </div>
 <p className="text-xs text-gray-500 dark:text-themeWhite/60 mt-3">
 Recorded {format(parseISO(latest.timestamp), 'MMM d, yyyy · h:mm a')}
 </p>
 </div>
 ) : (
 <p className="text-sm text-gray-500 dark:text-themeWhite/60">No vitals recorded yet.</p>
 )}
 </Card>

 {patient.treatmentNotes ? (
 <Card icon={<Stethoscope className="w-4 h-4 text-indigo-600" />} title="Treatment notes">
 <p className="text-sm text-themeBlack dark:text-themeWhite">{patient.treatmentNotes}</p>
 </Card>
 ) : null}
 </div>
 );
}

function Card({
 icon,
 title,
 children,
}: {
 icon: React.ReactNode;
 title: string;
 children: React.ReactNode;
}) {
 return (
 <div className="bg-themeWhite dark:bg-themeBlack border-2 border-themeBlack dark:border-themeWhite p-4">
 <h3 className="text-sm font-semibold text-themeBlack dark:text-themeWhite mb-3 flex items-center gap-2">
 {icon}
 {title}
 </h3>
 <div className="space-y-1.5">{children}</div>
 </div>
 );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
 return (
 <div className="flex items-center justify-between text-sm">
 <span className="text-gray-500 dark:text-themeWhite/60">{label}</span>
 <span className="font-medium text-themeBlack dark:text-themeWhite">{value}</span>
 </div>
 );
}

function Metric({ label, value }: { label: string; value: string }) {
 return (
 <div className="bg-gray-50 dark:bg-gray-800 p-3 text-center">
 <p className="text-xs text-gray-500 dark:text-themeWhite/60">{label}</p>
 <p className="text-base font-semibold text-themeBlack dark:text-themeWhite">{value}</p>
 </div>
 );
}
