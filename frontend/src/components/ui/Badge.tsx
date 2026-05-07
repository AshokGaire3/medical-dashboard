import type { ReactNode } from 'react';

type Tone = 'gray' | 'green' | 'red' | 'yellow' | 'blue' | 'purple';

const tones: Record<Tone, string> = {
 gray: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
 green: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300',
 red: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300',
 yellow: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300',
 blue: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
 purple: 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300',
};

export function Badge({ tone = 'gray', children }: { tone?: Tone; children: ReactNode }) {
 return (
 <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${tones[tone]}`}>
 {children}
 </span>
 );
}

const patientStatusTone: Record<string, Tone> = {
 Stable: 'green',
 Critical: 'red',
 Improving: 'blue',
 Monitoring: 'yellow',
 Recovery: 'blue',
 Discharged: 'gray',
 Recovered: 'green',
};

export function StatusBadge({ status }: { status: string }) {
 return <Badge tone={patientStatusTone[status] ?? 'gray'}>{status}</Badge>;
}
