import { Link } from 'react-router-dom';
import { Activity } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gray-50 dark:bg-gray-950">
      <div className="text-center">
        <div className="inline-flex p-3 bg-accentBlue text-white mb-4">
          <Activity className="w-6 h-6" />
        </div>
        <p className="text-5xl font-bold text-themeBlack dark:text-themeWhite">404</p>
        <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
          That page doesn't exist.
        </p>
        <Link
          to="/"
          className="inline-block mt-6 text-blue-600 hover:underline font-medium"
        >
          ← Back to dashboard
        </Link>
      </div>
    </div>
  );
}
