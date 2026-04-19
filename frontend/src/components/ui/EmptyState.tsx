import type { ReactNode } from 'react';
import { Inbox } from 'lucide-react';

interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: ReactNode;
  action?: ReactNode;
}

export function EmptyState({ title, description, icon, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-12 px-6 text-gray-500 dark:text-gray-400">
      <div className="p-3 rounded-full bg-gray-100 dark:bg-gray-800 mb-4">
        {icon ?? <Inbox className="w-6 h-6" />}
      </div>
      <p className="text-base font-semibold text-gray-700 dark:text-gray-200">{title}</p>
      {description ? <p className="mt-1 text-sm max-w-sm">{description}</p> : null}
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  );
}
