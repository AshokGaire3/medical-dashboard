import React, { useState, useMemo, useEffect } from 'react';
import { Search, Filter, Plus, Users, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import PatientTable from '../components/Patients/PatientTable';
import PatientProfile from '../components/Patients/PatientProfile';
import { patientsApi, dashboardApi, apiConfig } from '../api';
import { Patient, DashboardMetrics } from '../types';

const Patients: React.FC = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [conditionFilter, setConditionFilter] = useState('All');
  const [patientTypeFilter, setPatientTypeFilter] = useState<'current' | 'historical' | 'all'>('current');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const [patientsData, metricsData] = await Promise.all([
          patientsApi.getAll(),
          dashboardApi.getMetrics(),
        ]);
        setPatients(patientsData);
        setMetrics(metricsData);
      } catch (err) {
        console.error('Error fetching patients data:', err);
        const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
        setError(`Failed to load patients data: ${errorMessage}`);
        setPatients([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Separate current and historical patients
  const currentPatients = patients.filter(p => p.isCurrentPatient);
  const historicalPatients = patients.filter(p => !p.isCurrentPatient);

  // Get patients based on filter
  const getFilteredPatients = () => {
    let patients: Patient[] = [];
    
    switch (patientTypeFilter) {
      case 'current':
        patients = currentPatients;
        break;
      case 'historical':
        patients = historicalPatients;
        break;
      case 'all':
        patients = mockPatients;
        break;
    }

    return patients.filter(patient => {
      const matchesSearch = patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          patient.condition.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'All' || patient.status === statusFilter;
      const matchesCondition = conditionFilter === 'All' || patient.condition === conditionFilter;
      
      return matchesSearch && matchesStatus && matchesCondition;
    });
  };

  const filteredPatients = useMemo(() => {
    return getFilteredPatients();
  }, [searchTerm, statusFilter, conditionFilter, patientTypeFilter, patients]);

  const uniqueConditions = Array.from(new Set(patients.map(p => p.condition)));
  const uniqueStatuses = Array.from(new Set(patients.map(p => p.status)));

  // Calculate statistics
  const currentPatientCount = currentPatients.length;
  const criticalPatients = currentPatients.filter(p => p.status === 'Critical').length;
  const stablePatients = currentPatients.filter(p => p.status === 'Stable').length;
  const monitoringPatients = currentPatients.filter(p => p.status === 'Monitoring').length;
  const recoveryPatients = currentPatients.filter(p => p.status === 'Recovery').length;
  const lifetimePatients = metrics?.lifetimePatients || patients.length;

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading patients data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">{error}</p>
          <p className="text-sm text-red-600 mt-2">
            Make sure the ASP.NET Core API is running on {apiConfig.baseURL.replace('/api', '')}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header with Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Current Patients</p>
              <p className="text-3xl font-bold text-blue-600">{currentPatientCount}</p>
              <p className="text-xs text-gray-500">Under active treatment</p>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Critical Cases</p>
              <p className="text-3xl font-bold text-red-600">{criticalPatients}</p>
              <p className="text-xs text-gray-500">Require immediate attention</p>
            </div>
            <div className="p-3 bg-red-50 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">In Recovery</p>
              <p className="text-3xl font-bold text-green-600">{recoveryPatients}</p>
              <p className="text-xs text-gray-500">Showing improvement</p>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Lifetime Patients</p>
              <p className="text-3xl font-bold text-purple-600">{lifetimePatients}</p>
              <p className="text-xs text-gray-500">Total ever treated</p>
            </div>
            <div className="p-3 bg-purple-50 rounded-lg">
              <Clock className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Patient Type Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="mb-3 p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
            <strong>Note:</strong> Lifetime patients ({lifetimePatients}) represents total patients ever treated. 
            Current patients ({currentPatientCount}) are under active treatment. Historical patients ({historicalPatients.length}) are from our database.
          </p>
        </div>
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
          <button
            onClick={() => setPatientTypeFilter('current')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              patientTypeFilter === 'current'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Current Patients ({currentPatientCount})
          </button>
          <button
            onClick={() => setPatientTypeFilter('historical')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              patientTypeFilter === 'historical'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Historical Patients ({historicalPatients.length})
          </button>
          <button
            onClick={() => setPatientTypeFilter('all')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              patientTypeFilter === 'all'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            All Patients ({patients.length})
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder={`Search ${patientTypeFilter} patients by name or condition...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex gap-4">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="All">All Status</option>
              {uniqueStatuses.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
            <select
              value={conditionFilter}
              onChange={(e) => setConditionFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="All">All Conditions</option>
              {uniqueConditions.map(condition => (
                <option key={condition} value={condition}>{condition}</option>
              ))}
            </select>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
              <Plus className="w-4 h-4" />
              <span>Add Patient</span>
            </button>
          </div>
        </div>
      </div>

      {/* Current Patient Status Summary */}
      {patientTypeFilter === 'current' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Current Patient Status Overview</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{stablePatients}</div>
              <div className="text-sm text-gray-600">Stable</div>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">{monitoringPatients}</div>
              <div className="text-sm text-gray-600">Monitoring</div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{recoveryPatients}</div>
              <div className="text-sm text-gray-600">Recovery</div>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <div className="text-2xl font-bold text-red-600">{criticalPatients}</div>
              <div className="text-sm text-gray-600">Critical</div>
            </div>
          </div>
        </div>
      )}

      {/* Patient Table */}
      <PatientTable 
        patients={filteredPatients}
        onViewPatient={setSelectedPatient}
        patientType={patientTypeFilter}
      />

      {/* Patient Profile Modal */}
      {selectedPatient && (
        <PatientProfile
          patient={selectedPatient}
          onClose={() => setSelectedPatient(null)}
        />
      )}
    </div>
  );
};

export default Patients;