import { NavLink } from 'react-router-dom';
import {
 LayoutDashboard,
 Users,
 BarChart3,
 Settings as SettingsIcon,
 Activity,
 ChevronLeft,
 ChevronRight,
 Calendar,
 FileDown,
 UserCircle,
 LogOut,
 ShieldCheck,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import type { UserRole } from '../../types';

interface SidebarProps {
 isCollapsed: boolean;
 onToggle: () => void;
}

// `role` restricts the link to specific roles; undefined means everyone authenticated.
const navigationItems: { to: string; icon: typeof LayoutDashboard; label: string; role?: UserRole }[] = [
 { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
 { to: '/patients', icon: Users, label: 'Patients' },
 { to: '/appointments', icon: Calendar, label: 'Appointments' },
 { to: '/analytics', icon: BarChart3, label: 'Analytics' },
 { to: '/reports', icon: FileDown, label: 'Reports' },
 { to: '/audit-logs', icon: ShieldCheck, label: 'Audit log', role: 'Admin' },
 { to: '/profile', icon: UserCircle, label: 'Profile' },
 { to: '/settings', icon: SettingsIcon, label: 'Settings' },
];

export default function Sidebar({ isCollapsed, onToggle }: SidebarProps) {
 const { user, logout, hasRole } = useAuth();
 // Hide role-restricted links from users who lack the role.
 const visibleItems = navigationItems.filter((item) => !item.role || hasRole(item.role));
 const initials = (user?.name ?? 'U')
 .split(' ')
 .map((n) => n[0])
 .slice(0, 2)
 .join('')
 .toUpperCase();

 return (
 <aside
 className={`bg-themeBlack text-themeWhite border-r-2 border-themeBlack transition-all duration-300 ${
 isCollapsed ? 'w-16' : 'w-64'
 } min-h-screen flex flex-col z-20`}
 >
 <div className="p-4 border-b-2 border-themeBlack">
 <div className="flex items-center justify-between">
 {!isCollapsed && (
 <div className="flex items-center space-x-3">
 <div className="p-1.5 border-2 border-themeBlack bg-accentBlue text-themeWhite">
 <Activity strokeWidth={1.5} className="w-6 h-6" />
 </div>
 <span className="text-xl font-bold tracking-tight text-themeWhite">MedDash</span>
 </div>
 )}
 <button
 onClick={onToggle}
 className="p-1.5 border-2 border-transparent hover:border-themeWhite transition-all"
 aria-label="Toggle sidebar"
 >
 {isCollapsed ? (
 <ChevronRight strokeWidth={1.5} className="w-5 h-5 text-themeWhite" />
 ) : (
 <ChevronLeft strokeWidth={1.5} className="w-5 h-5 text-themeWhite" />
 )}
 </button>
 </div>
 </div>

 <nav className="flex-1 p-4">
 <ul className="space-y-2">
 {visibleItems.map(({ to, icon: Icon, label }) => (
 <li key={to}>
 <NavLink
 to={to}
 end={to === '/'}
 className={({ isActive }) =>
 `flex items-center gap-3 px-3 py-2.5 transition-all border-2 ${
 isActive
 ? 'border-themeBlack bg-themeWhite text-themeBlack shadow-brutal-sm'
 : 'border-transparent text-themeWhite hover:border-themeWhite'
 }`
 }
 >
 <Icon strokeWidth={1.5} className="w-5 h-5 shrink-0" />
 {!isCollapsed && <span className="text-sm font-semibold tracking-wide">{label}</span>}
 </NavLink>
 </li>
 ))}
 </ul>
 </nav>

 <div className="p-4 border-t-2 border-themeBlack bg-themeBlack text-themeWhite">
 {!isCollapsed ? (
 <div className="flex items-center gap-3">
 <div className="w-10 h-10 shrink-0 border-2 border-themeBlack bg-accentGreen flex items-center justify-center">
 <span className="text-themeBlack font-bold text-sm tracking-widest">
 {initials}
 </span>
 </div>
 <div className="min-w-0 flex-1">
 <p className="text-sm font-bold text-themeWhite truncate">
 {user?.name ?? 'User'}
 </p>
 <p className="text-xs font-medium text-themeWhite/60 truncate">
 {user?.role ?? ''}
 </p>
 </div>
 <button
 onClick={logout}
 className="p-2 border-2 border-transparent hover:border-themeWhite text-themeWhite transition-all"
 aria-label="Sign out"
 title="Sign out"
 >
 <LogOut strokeWidth={1.5} className="w-5 h-5" />
 </button>
 </div>
 ) : (
 <button
 onClick={logout}
 className="w-full p-2 border-2 border-transparent hover:border-themeWhite text-themeWhite flex justify-center transition-all"
 aria-label="Sign out"
 title="Sign out"
 >
 <LogOut strokeWidth={1.5} className="w-5 h-5" />
 </button>
 )}
 </div>
 </aside>
 );
}
