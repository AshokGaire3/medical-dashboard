import { Bell } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface HeaderProps {
 title: string;
 subtitle?: string;
}

export default function Header({ title, subtitle }: HeaderProps) {
 const { user } = useAuth();

 return (
 <header className="bg-themeWhite dark:bg-themeBlack border-b-2 border-themeBlack dark:border-themeWhite px-6 py-4 z-10 relative">
 <div className="flex items-center justify-between gap-4">
 <div className="min-w-0">
 <h1 className="text-3xl font-bold text-themeBlack dark:text-themeWhite truncate tracking-tighter">
 {title}
 </h1>
 <p className="text-sm font-semibold text-gray-600 dark:text-themeWhite/70 mt-1 truncate tracking-wide">
 {subtitle ||
 new Date().toLocaleDateString('en-US', {
 weekday: 'long',
 year: 'numeric',
 month: 'long',
 day: 'numeric',
 }).toUpperCase()}
 </p>
 </div>

 <div className="flex items-center gap-3">

 <button
 className="relative p-2 border-2 border-transparent hover:border-themeBlack dark:hover:border-themeWhite text-themeBlack dark:text-themeWhite transition-all"
 aria-label="Notifications"
 >
 <Bell strokeWidth={1.5} className="w-6 h-6" />
 <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-accentBlue border-2 border-themeWhite dark:border-themeBlack rounded-full"></span>
 </button>
 <div className="hidden sm:flex items-center gap-3 pl-4 ml-2 border-l-2 border-themeBlack dark:border-themeWhite">
 <div className="w-10 h-10 border-2 border-themeBlack bg-accentBlue dark:border-themeWhite flex items-center justify-center">
 <span className="text-themeWhite font-bold text-sm tracking-widest">
 {(user?.name ?? 'U')
 .split(' ')
 .map((n) => n[0])
 .slice(0, 2)
 .join('')
 .toUpperCase()}
 </span>
 </div>
 <div className="text-sm leading-tight">
 <p className="font-bold text-themeBlack dark:text-themeWhite">{user?.name}</p>
 <p className="text-xs font-semibold text-gray-500 dark:text-themeWhite/60 tracking-normal">{user?.role}</p>
 </div>
 </div>
 </div>
 </div>
 </header>
 );
}
