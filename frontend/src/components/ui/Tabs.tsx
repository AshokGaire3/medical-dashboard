import type { ReactNode } from 'react';

export interface TabDef<ID extends string = string> {
 id: ID;
 label: string;
 icon?: ReactNode;
 badge?: ReactNode;
}

interface TabsProps<ID extends string = string> {
 tabs: TabDef<ID>[];
 value: ID;
 onChange: (_id: ID) => void;
 className?: string;
}

export function Tabs<ID extends string>({ tabs, value, onChange, className = '' }: TabsProps<ID>) {
 return (
 <div
 role="tablist"
 aria-orientation="horizontal"
 className={`flex gap-1 overflow-x-auto border-b border-themeBlack dark:border-themeWhite ${className}`}
 >
 {tabs.map((t) => {
 const active = t.id === value;
 return (
 <button
 key={t.id}
 role="tab"
 type="button"
 aria-selected={active}
 tabIndex={active ? 0 : -1}
 onClick={() => onChange(t.id)}
 className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
 active
 ? 'border-blue-500 text-accentBlue'
 : 'border-transparent text-gray-500 dark:text-themeWhite/60 hover:text-gray-800 dark:hover:text-gray-200'
 }`}
 >
 {t.icon}
 <span>{t.label}</span>
 {t.badge}
 </button>
 );
 })}
 </div>
 );
}
