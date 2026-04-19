import { Monitor, Moon, Sun } from 'lucide-react';
import { PageHeader } from '../components/ui/PageHeader';
import { useTheme } from '../context/ThemeContext';
import { API_BASE_URL } from '../api/config';

export default function Settings() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="p-6 max-w-3xl">
      <PageHeader title="Settings" description="Preferences and configuration." />

      <section className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Appearance</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <ThemeOption
            active={theme === 'light'}
            onClick={() => setTheme('light')}
            icon={<Sun className="w-5 h-5" />}
            label="Light"
          />
          <ThemeOption
            active={theme === 'dark'}
            onClick={() => setTheme('dark')}
            icon={<Moon className="w-5 h-5" />}
            label="Dark"
          />
          <ThemeOption
            active={false}
            onClick={() =>
              setTheme(
                window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light',
              )
            }
            icon={<Monitor className="w-5 h-5" />}
            label="System"
          />
        </div>
      </section>

      <section className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 mt-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Environment</h3>
        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Info label="API base URL" value={API_BASE_URL || '(unset)'} />
          <Info label="Build mode" value={import.meta.env.MODE} />
        </dl>
      </section>
    </div>
  );
}

function ThemeOption({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-3 px-4 py-3 rounded-lg border transition-colors ${
        active
          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
          : 'border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
      }`}
    >
      {icon}
      <span className="font-medium">{label}</span>
    </button>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="p-3 rounded-lg border border-gray-200 dark:border-gray-800">
      <dt className="text-xs text-gray-500 dark:text-gray-400">{label}</dt>
      <dd className="mt-1 text-sm font-mono text-gray-900 dark:text-gray-100 break-all">{value}</dd>
    </div>
  );
}
