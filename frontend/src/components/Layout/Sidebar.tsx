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
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

const navigationItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/patients', icon: Users, label: 'Patients' },
  { to: '/appointments', icon: Calendar, label: 'Appointments' },
  { to: '/analytics', icon: BarChart3, label: 'Analytics' },
  { to: '/reports', icon: FileDown, label: 'Reports' },
  { to: '/profile', icon: UserCircle, label: 'Profile' },
  { to: '/settings', icon: SettingsIcon, label: 'Settings' },
];

export default function Sidebar({ isCollapsed, onToggle }: SidebarProps) {
  const { user, logout } = useAuth();
  const initials = (user?.name ?? 'U')
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <aside
      className={`bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 transition-all duration-300 ${
        isCollapsed ? 'w-16' : 'w-64'
      } min-h-screen flex flex-col`}
    >
      <div className="p-4 border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <div className="flex items-center space-x-2">
              <div className="p-1.5 rounded-lg bg-blue-600 text-white">
                <Activity className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold text-gray-900 dark:text-gray-100">MedDash</span>
            </div>
          )}
          <button
            onClick={onToggle}
            className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="Toggle sidebar"
          >
            {isCollapsed ? (
              <ChevronRight className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            ) : (
              <ChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            )}
          </button>
        </div>
      </div>

      <nav className="flex-1 p-3">
        <ul className="space-y-1">
          {navigationItems.map(({ to, icon: Icon, label }) => (
            <li key={to}>
              <NavLink
                to={to}
                end={to === '/'}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                      : 'text-gray-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800'
                  }`
                }
              >
                <Icon className="w-5 h-5 shrink-0" />
                {!isCollapsed && <span className="text-sm font-medium truncate">{label}</span>}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="p-3 border-t border-gray-200 dark:border-gray-800">
        {!isCollapsed ? (
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 shrink-0 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center">
              <span className="text-blue-700 dark:text-blue-300 font-semibold text-sm">
                {initials}
              </span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                {user?.name ?? 'User'}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                {user?.role ?? ''}
              </p>
            </div>
            <button
              onClick={logout}
              className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400"
              aria-label="Sign out"
              title="Sign out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <button
            onClick={logout}
            className="w-full p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400 flex justify-center"
            aria-label="Sign out"
            title="Sign out"
          >
            <LogOut className="w-5 h-5" />
          </button>
        )}
      </div>
    </aside>
  );
}
