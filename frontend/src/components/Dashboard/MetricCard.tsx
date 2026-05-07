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
  blue: 'bg-accentBlue text-themeWhite border-2 border-themeBlack dark:border-themeWhite',
  green: 'bg-accentGreen text-themeWhite border-2 border-themeBlack dark:border-themeWhite',
  red: 'bg-themeBlack text-themeWhite dark:bg-themeWhite dark:text-themeBlack border-2 border-themeBlack dark:border-themeWhite',
  yellow: 'bg-themeBlack text-themeWhite dark:bg-themeWhite dark:text-themeBlack border-2 border-themeBlack dark:border-themeWhite',
  purple: 'bg-themeBlack text-themeWhite dark:bg-themeWhite dark:text-themeBlack border-2 border-themeBlack dark:border-themeWhite',
};

const changeClasses: Record<string, string> = {
  positive: 'text-accentGreen font-bold',
  negative: 'text-themeBlack dark:text-themeWhite font-bold',
  neutral: 'text-themeBlack/60 dark:text-themeWhite/60 font-semibold',
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
    <div className="bg-themeWhite dark:bg-themeBlack border-2 border-themeBlack dark:border-themeWhite p-6 hover:-translate-y-1 hover:shadow-brutal dark:hover:shadow-brutal-sm transition-all group">
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-black tracking-widest text-themeBlack/70 dark:text-themeWhite/70 mb-2 uppercase truncate">
            {title}
          </p>
          <p className="text-4xl font-black text-themeBlack dark:text-themeWhite truncate tracking-tighter">{value}</p>
          {change ? (
            <p className={`text-sm mt-3 ${changeClasses[changeType]} truncate uppercase tracking-wider`}>{change}</p>
          ) : null}
        </div>
        <div className={`p-3 shrink-0 transition-transform group-hover:scale-110 ${colorClasses[color]}`}>
          <Icon strokeWidth={1.5} className="w-8 h-8" />
        </div>
      </div>
    </div>
  );
}
