import type { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon: LucideIcon;
  color?: 'blue' | 'green' | 'red' | 'yellow' | 'purple';
}

const colorClasses: Record<string, string> = {
  blue: 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-300',
  green: 'bg-green-50 text-green-600 dark:bg-green-900/30 dark:text-green-300',
  red: 'bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-300',
  yellow: 'bg-yellow-50 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-300',
  purple: 'bg-purple-50 text-purple-600 dark:bg-purple-900/30 dark:text-purple-300',
};

const changeClasses: Record<string, string> = {
  positive: 'text-green-600 dark:text-green-400',
  negative: 'text-red-600 dark:text-red-400',
  neutral: 'text-gray-500 dark:text-gray-400',
};

export default function MetricCard({
  title,
  value,
  change,
  changeType = 'neutral',
  icon: Icon,
  color = 'blue',
}: MetricCardProps) {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1 truncate">
            {title}
          </p>
          <p className="text-3xl font-bold text-gray-900 dark:text-gray-100 truncate">{value}</p>
          {change ? (
            <p className={`text-sm mt-2 ${changeClasses[changeType]} truncate`}>{change}</p>
          ) : null}
        </div>
        <div className={`p-3 rounded-lg shrink-0 ${colorClasses[color]}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
}
