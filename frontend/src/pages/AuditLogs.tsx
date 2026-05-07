import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ShieldCheck, RefreshCw } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { PageHeader } from '../components/ui/PageHeader';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Spinner } from '../components/ui/Spinner';
import { Badge } from '../components/ui/Badge';
import { auditLogsApi } from '../api';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

// Admin-only audit log viewer. Lists every mutating API request with filters.
export default function AuditLogs() {
  const { hasRole } = useAuth();
  const isAdmin = hasRole('Admin');
  const [resource, setResource] = useState('');
  const [page, setPage] = useState(1);

  // Hooks must run unconditionally; we gate the network call with `enabled` instead
  // so we can early-return below for non-admins without breaking hook order.
  const logsQ = useQuery({
    queryKey: ['audit-logs', { resource, page }],
    queryFn: () =>
      auditLogsApi.list({
        resource: resource || undefined,
        page,
        pageSize: 50,
      }),
    placeholderData: (prev) => prev,
    enabled: isAdmin,
  });

  // Block non-Admin users at the page level (also enforced server-side).
  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  const logs = logsQ.data?.items ?? [];
  const total = logsQ.data?.total ?? 0;
  const pageSize = logsQ.data?.pageSize ?? 50;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return (
    <div className="p-6">
      <PageHeader
        title="Audit log"
        description="Every create / update / delete API call performed by an authenticated user."
      />

      <div className="bg-themeWhite dark:bg-themeBlack border-2 border-themeBlack dark:border-themeWhite p-4 mb-4">
        <div className="flex flex-wrap items-end gap-3">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-xs font-medium text-themeBlack/60 dark:text-themeWhite/60 mb-1">
              Filter by resource
            </label>
            <Input
              placeholder="e.g. patients, vitals, medications"
              value={resource}
              onChange={(e) => {
                setResource(e.target.value);
                setPage(1);
              }}
            />
          </div>
          <Button
            variant="outline"
            leftIcon={<RefreshCw className="w-4 h-4" />}
            onClick={() => logsQ.refetch()}
          >
            Refresh
          </Button>
        </div>
      </div>

      <div className="bg-themeWhite dark:bg-themeBlack border-2 border-themeBlack dark:border-themeWhite overflow-hidden">
        {logsQ.isLoading ? (
          <div className="p-8 text-center"><Spinner /></div>
        ) : logs.length === 0 ? (
          <div className="p-8 text-center text-sm text-themeBlack/60 dark:text-themeWhite/60">
            <ShieldCheck className="w-8 h-8 mx-auto mb-2 opacity-40" />
            No audit log entries match the current filter.
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-gray-800/50 text-xs uppercase text-themeBlack/60 dark:text-themeWhite/60">
              <tr>
                <Th>When</Th>
                <Th>User</Th>
                <Th>Method</Th>
                <Th>Path</Th>
                <Th>Status</Th>
                <Th>IP</Th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
              {logs.map((log) => (
                <tr key={log.id}>
                  <Td>{format(parseISO(log.timestamp), 'MMM d, yyyy · HH:mm:ss')}</Td>
                  <Td>
                    <div className="font-medium text-themeBlack dark:text-themeWhite">{log.userEmail || '—'}</div>
                    <div className="text-xs text-gray-500">{log.userRole}</div>
                  </Td>
                  <Td><MethodBadge method={log.method} /></Td>
                  <Td className="font-mono text-xs">{log.path}</Td>
                  <Td><StatusBadge status={log.statusCode} /></Td>
                  <Td className="text-xs text-gray-500">{log.ipAddress ?? '—'}</Td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4 text-sm text-gray-600 dark:text-gray-400">
          <span>
            Page {page} of {totalPages} · {total} total entries
          </span>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

// Color-coded HTTP method tag.
function MethodBadge({ method }: { method: string }) {
  const tone =
    method === 'POST' ? 'green'
    : method === 'DELETE' ? 'red'
    : method === 'PUT' || method === 'PATCH' ? 'yellow'
    : 'gray';
  return <Badge tone={tone as 'green' | 'red' | 'yellow' | 'gray'}>{method}</Badge>;
}

// Green for 2xx, yellow for 3xx, red for 4xx/5xx.
function StatusBadge({ status }: { status: number }) {
  const tone =
    status >= 200 && status < 300 ? 'green'
    : status >= 300 && status < 400 ? 'blue'
    : status >= 400 && status < 500 ? 'yellow'
    : 'red';
  return <Badge tone={tone as 'green' | 'red' | 'yellow' | 'blue'}>{status}</Badge>;
}

function Th({ children }: { children: React.ReactNode }) {
  return <th className="text-left px-4 py-2 font-medium">{children}</th>;
}

function Td({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <td className={`px-4 py-2 align-top ${className}`}>{children}</td>;
}
