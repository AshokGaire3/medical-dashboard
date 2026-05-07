import { Activity, AlertTriangle } from 'lucide-react';
import { useHealthScore } from '../../hooks/usePatients';
import type { HealthScoreBand } from '../../types';

// Maps each NEWS2 band to background/border/text colors used in the card.
const bandStyles: Record<HealthScoreBand, { bg: string; border: string; text: string; ring: string }> = {
  Low: {
    bg: 'bg-green-50 dark:bg-green-900/20',
    border: 'border-green-200 dark:border-green-800/40',
    text: 'text-green-900 dark:text-green-200',
    ring: 'ring-green-400',
  },
  LowMedium: {
    bg: 'bg-yellow-50 dark:bg-yellow-900/20',
    border: 'border-yellow-200 dark:border-yellow-800/40',
    text: 'text-yellow-900 dark:text-yellow-200',
    ring: 'ring-yellow-400',
  },
  Medium: {
    bg: 'bg-orange-50 dark:bg-orange-900/20',
    border: 'border-orange-200 dark:border-orange-800/40',
    text: 'text-orange-900 dark:text-orange-200',
    ring: 'ring-orange-400',
  },
  High: {
    bg: 'bg-red-50 dark:bg-red-900/20',
    border: 'border-red-200 dark:border-red-800/40',
    text: 'text-red-900 dark:text-red-200',
    ring: 'ring-red-400',
  },
};

// Renders a NEWS2 risk score card. Auto-fetches via React Query when patientId is set.
export function HealthScoreCard({ patientId }: { patientId: number }) {
  const { data: score, isLoading, isError, error } = useHealthScore(patientId);

  if (isLoading) {
    return (
      <div className="bg-themeWhite dark:bg-themeBlack border-2 border-themeBlack dark:border-themeWhite p-4">
        <p className="text-sm text-themeBlack/60 dark:text-themeWhite/60">Computing health score…</p>
      </div>
    );
  }

  // 404 = no vitals yet → show neutral empty state instead of an error.
  if (isError || !score) {
    const message = error instanceof Error ? error.message : 'Score unavailable';
    return (
      <div className="bg-themeWhite dark:bg-themeBlack border-2 border-themeBlack dark:border-themeWhite p-4">
        <h3 className="text-sm font-semibold text-themeBlack dark:text-themeWhite mb-1 flex items-center gap-2">
          <Activity className="w-4 h-4 text-blue-600" /> NEWS2 health score
        </h3>
        <p className="text-sm text-themeBlack/60 dark:text-themeWhite/60">{message}</p>
      </div>
    );
  }

  const styles = bandStyles[score.band];

  return (
    <div className={`${styles.bg} ${styles.border} border p-4`}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className={`text-sm font-semibold ${styles.text} flex items-center gap-2`}>
            <Activity className="w-4 h-4" /> NEWS2 health score
          </h3>
          <p className={`text-xs mt-0.5 ${styles.text} opacity-80`}>
            National Early Warning Score 2 · computed from latest vitals
          </p>
        </div>
        {/* Big score circle: total points and risk band label. */}
        <div className={`flex flex-col items-center justify-center w-20 h-20 rounded-full bg-white/70 dark:bg-black/30 ring-4 ${styles.ring}`}>
          <span className={`text-2xl font-bold ${styles.text}`}>{score.total}</span>
          <span className={`text-[10px] uppercase tracking-wide ${styles.text} opacity-80`}>
            {score.bandLabel}
          </span>
        </div>
      </div>

      {/* Per-parameter breakdown so clinicians can see which vital drove the score. */}
      <div className="mt-3 grid grid-cols-2 sm:grid-cols-5 gap-2">
        {score.components.map((c) => (
          <div
            key={c.parameter}
            className="bg-white/60 dark:bg-black/20 rounded-md px-2 py-1.5 text-center"
          >
            <p className={`text-[10px] uppercase tracking-wide ${styles.text} opacity-70`}>
              {c.parameter.replace(/([A-Z])/g, ' $1').trim()}
            </p>
            <p className={`text-xs font-semibold ${styles.text}`}>{c.value}</p>
            <p className={`text-[10px] ${styles.text} opacity-80`}>+{c.points}</p>
          </div>
        ))}
      </div>

      {/* Recommended clinical action for this band. */}
      {score.band !== 'Low' && (
        <div className={`mt-3 flex items-start gap-2 text-xs ${styles.text}`}>
          <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <span>{score.recommendation}</span>
        </div>
      )}
    </div>
  );
}
