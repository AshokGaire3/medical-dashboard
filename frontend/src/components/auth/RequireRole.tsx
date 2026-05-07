import type { ReactNode } from 'react';
import { useAuth } from '../../context/AuthContext';
import type { UserRole } from '../../types';

interface RequireRoleProps {
  roles: UserRole | UserRole[];
  children: ReactNode;
  /**
   * Optional fallback content to render when the current user does not
   * match the required role(s). Defaults to rendering nothing.
   */
  fallback?: ReactNode;
}

/**
 * Inline role guard: renders `children` when the current user has one of
 * the required roles; otherwise renders `fallback` (or nothing).
 *
 * For route-level guards, wrap the relevant <Route> element in this
 * component and pass a <Navigate /> fallback.
 */
export function RequireRole({ roles, children, fallback = null }: RequireRoleProps) {
  const { hasRole } = useAuth();
  return <>{hasRole(roles) ? children : fallback}</>;
}
