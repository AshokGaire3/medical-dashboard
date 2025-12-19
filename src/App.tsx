import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Layout/Sidebar';
import Header from './components/Layout/Header';
import Dashboard from './pages/Dashboard';
import Patients from './pages/Patients';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';

function App() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const getPageTitle = (pathname: string) => {
    switch (pathname) {
      case '/': return 'Dashboard Overview';
      case '/patients': return 'Patient Management';
      case '/analytics': return 'Analytics & Reports';
      case '/settings': return 'Settings';
      default: return 'Medical Dashboard';
    }
  };

  const basePath = import.meta.env.VITE_BASE_PATH || '/';

  return (
    <Router basename={basePath}>
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar 
          isCollapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
        <div className="flex-1 flex flex-col">
          <Header 
            title={getPageTitle(window.location.pathname)} 
          />
          <main className="flex-1 overflow-auto">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/patients" element={<Patients />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;