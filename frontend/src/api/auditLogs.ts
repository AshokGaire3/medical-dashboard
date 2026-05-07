import { api } from './client';
import type { PagedResult } from '../types';

export interface AuditLog {
  id: number;
  userId: number | null;
  userEmail: string;
  userRole: string;
  method: string;
  path: string;
  resource: string | null;
  resourceId: string | null;
  statusCode: number;
  ipAddress: string | null;
  userAgent: string | null;
  timestamp: string;
}

export interface AuditLogsQuery {
  resource?: string;
  userId?: number;
  page?: number;
  pageSize?: number;
}

// Admin-only audit trail. Returns most-recent first, paginated.
export const auditLogsApi = {
  list: (params?: AuditLogsQuery) =>
    api.get<PagedResult<AuditLog>>('/audit-logs', {
      params: params as Record<string, string | number | boolean | undefined>,
    }),
};
