import { useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Sidebar from './components/Layout/Sidebar';
import Header from './components/Layout/Header';
import Dashboard from './pages/Dashboard';
import Patients from './pages/Patients';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';
import Appointments from './pages/Appointments';
import Reports from './pages/Reports';
import Profile from './pages/Profile';
import LoginPage from './pages/Login';
import RegisterPage from './pages/Register';
import NotFound from './pages/NotFound';
import PatientPrint from './pages/PatientPrint';
import AuditLogs from './pages/AuditLogs';
import { ProtectedRoute } from './components/auth/ProtectedRoute';

const PAGE_TITLES: Record<string, { title: string; description: string }> = {
  '/': { title: 'Dashboard', description: 'At-a-glance overview of today’s activity.' },
  '/patients': { title: 'Patients', description: 'Manage current and historical patients.' },
  '/appointments': { title: 'Appointments', description: 'Schedule and track patient visits.' },
  '/analytics': { title: 'Analytics', description: 'Trends, insights, and visualizations.' },
  '/reports': { title: 'Reports', description: 'Export patient and clinical data.' },
  '/profile': { title: 'Profile', description: 'Your account and preferences.' },
  '/settings': { title: 'Settings', description: 'Configure the application.' },
  '/audit-logs': { title: 'Audit log', description: 'Review who changed what, and when.' },
};

function Shell() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const location = useLocation();
  const meta = PAGE_TITLES[location.pathname] ?? {
    title: 'Medical Dashboard',
    description: '',
  };

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-950">
      <Sidebar
        isCollapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      />
      <div className="flex-1 flex flex-col min-w-0">
        <Header title={meta.title} subtitle={meta.description} />
        <main className="flex-1 overflow-auto">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/patients" element={<Patients />} />
            <Route path="/appointments" element={<Appointments />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/settings" element={<Settings />} />
            {/* Page-level role check happens inside AuditLogs (Admin only). */}
            <Route path="/audit-logs" element={<AuditLogs />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route
        path="/patients/:id/print"
        element={
          <ProtectedRoute>
            <PatientPrint />
          </ProtectedRoute>
        }
      />
      <Route
        path="/*"
        element={
          <ProtectedRoute>
            <Shell />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}
