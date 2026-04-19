import { LogOut, Mail, Shield, User } from 'lucide-react';
import { PageHeader } from '../components/ui/PageHeader';
import { Button } from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';

export default function Profile() {
  const { user, logout } = useAuth();
  if (!user) return null;

  return (
    <div className="p-6 max-w-3xl">
      <PageHeader title="Profile" description="Your account details." />

      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center">
            <span className="text-blue-700 dark:text-blue-300 text-xl font-semibold">
              {user.name
                .split(' ')
                .map((n) => n[0])
                .slice(0, 2)
                .join('')
                .toUpperCase()}
            </span>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">{user.name}</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">{user.email}</p>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <InfoRow icon={<User className="w-4 h-4" />} label="Name" value={user.name} />
          <InfoRow icon={<Mail className="w-4 h-4" />} label="Email" value={user.email} />
          <InfoRow icon={<Shield className="w-4 h-4" />} label="Role" value={user.role} />
        </div>

        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-800">
          <Button variant="danger" leftIcon={<LogOut className="w-4 h-4" />} onClick={logout}>
            Sign out
          </Button>
        </div>
      </div>
    </div>
  );
}

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="p-4 rounded-lg border border-gray-200 dark:border-gray-800">
      <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
        {icon}
        {label}
      </div>
      <p className="mt-1 text-sm font-medium text-gray-900 dark:text-gray-100 break-all">{value}</p>
    </div>
  );
}
