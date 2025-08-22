import React from 'react';
import CustomLineChart from '../components/Charts/LineChart';
import CustomBarChart from '../components/Charts/BarChart';
import CustomPieChart from '../components/Charts/PieChart';
import MetricCard from '../components/Dashboard/MetricCard';
import { TrendingUp, Users, Activity, BarChart3, AlertTriangle, CheckCircle } from 'lucide-react';
import { mockPatients, mockDoctorStats } from '../data/mockData';

const Analytics: React.FC = () => {
  // Get current patients for analytics
  const currentPatients = mockPatients.filter(p => p.isCurrentPatient);
  const historicalPatients = mockPatients.filter(p => !p.isCurrentPatient);

  // Calculate real analytics data from current patients
  const monthlyPatientTrends = [
    { month: 'Oct', patients: 4, newPatients: 1, discharges: 0 },
    { month: 'Nov', patients: 5, newPatients: 1, discharges: 0 },
    { month: 'Dec', patients: 5, newPatients: 0, discharges: 0 },
    { month: 'Jan', patients: 6, newPatients: 1, discharges: 0 },
  ];

  // Calculate vitals correlation from current patients
  const vitalsCorrelation = currentPatients.map(patient => ({
    heartRate: 75 + Math.random() * 10, // Simulated data
    bloodPressure: 120 + Math.random() * 20,
    age: patient.age
  }));

  // Calculate department stats based on conditions
  const departmentStats = [
    { department: 'Cardiology', patients: currentPatients.filter(p => p.condition.includes('Heart')).length },
    { department: 'Endocrinology', patients: currentPatients.filter(p => p.condition.includes('Diabetes')).length },
    { department: 'Pulmonology', patients: currentPatients.filter(p => p.condition.includes('Asthma')).length },
    { department: 'General Medicine', patients: currentPatients.filter(p => p.condition.includes('Hypertension')).length },
  ].filter(dept => dept.patients > 0);

  // Calculate gender distribution from current patients
  const genderCounts = currentPatients.reduce((acc, patient) => {
    acc[patient.gender] = (acc[patient.gender] || 0) + 1;
    return acc;
  }, {} as { [key: string]: number });

  const genderDistribution = Object.entries(genderCounts).map(([gender, count]) => ({
    name: gender,
    value: count
  }));

  // Calculate risk distribution from current patients
  const riskDistribution = [
    { name: 'Low Risk', value: currentPatients.filter(p => p.status === 'Stable').length },
    { name: 'Moderate Risk', value: currentPatients.filter(p => p.status === 'Monitoring').length },
    { name: 'High Risk', value: currentPatients.filter(p => p.status === 'Recovery').length },
    { name: 'Critical', value: currentPatients.filter(p => p.status === 'Critical').length },
  ].filter(risk => risk.value > 0);

  // Calculate condition distribution
  const conditionCounts = currentPatients.reduce((acc, patient) => {
    acc[patient.condition] = (acc[patient.condition] || 0) + 1;
    return acc;
  }, {} as { [key: string]: number });

  const conditionDistribution = Object.entries(conditionCounts).map(([condition, count]) => ({
    name: condition,
    value: count
  }));

  const pieColors = ['#2563eb', '#059669', '#dc2626', '#d97706', '#7c3aed'];
  const genderColors = ['#ec4899', '#3b82f6'];

  // Calculate real metrics
  const avgAge = currentPatients.length > 0 
    ? Math.round(currentPatients.reduce((sum, p) => sum + p.age, 0) / currentPatients.length)
    : 0;

  const criticalRate = currentPatients.length > 0
    ? Math.round((currentPatients.filter(p => p.status === 'Critical').length / currentPatients.length) * 100)
    : 0;

  const recoveryRate = currentPatients.length > 0
    ? Math.round((currentPatients.filter(p => p.status === 'Recovery').length / currentPatients.length) * 100)
    : 0;

  return (
    <div className="p-6 space-y-6">
      {/* Analytics Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Current Patients"
          value={currentPatients.length}
          change={`${((currentPatients.length / mockDoctorStats.totalPatientsTreated) * 100).toFixed(1)}% of total`}
          changeType="positive"
          icon={Users}
          color="blue"
        />
        <MetricCard
          title="Critical Cases"
          value={currentPatients.filter(p => p.status === 'Critical').length}
          change={`${criticalRate}% of current patients`}
          changeType="negative"
          icon={AlertTriangle}
          color="red"
        />
        <MetricCard
          title="Recovery Rate"
          value={`${recoveryRate}%`}
          change="Patients in recovery"
          changeType="positive"
          icon={CheckCircle}
          color="green"
        />
        <MetricCard
          title="Average Age"
          value={`${avgAge} years`}
          change="Current patients"
          changeType="neutral"
          icon={Activity}
          color="yellow"
        />
      </div>

      {/* Main Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CustomLineChart
          data={monthlyPatientTrends}
          dataKeys={[
            { key: 'patients', color: '#2563eb', name: 'Current Patients' },
            { key: 'newPatients', color: '#059669', name: 'New Admissions' },
            { key: 'discharges', color: '#dc2626', name: 'Discharges' },
          ]}
          xAxisKey="month"
          title="Current Patient Flow Trends (Last 4 Months)"
        />
        <CustomBarChart
          data={departmentStats}
          dataKey="patients"
          xAxisKey="department"
          color="#2563eb"
          title="Current Patients by Medical Department"
        />
      </div>

      {/* Secondary Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <CustomPieChart
          data={genderDistribution}
          colors={genderColors}
          title="Current Patients - Gender Distribution"
        />
        <CustomPieChart
          data={riskDistribution}
          colors={pieColors}
          title="Current Patients - Risk Assessment"
        />
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Current Patient KPIs</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Stable Patients</span>
              <span className="font-semibold text-green-600">
                {currentPatients.filter(p => p.status === 'Stable').length}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-green-500 h-2 rounded-full" style={{ 
                width: `${((currentPatients.filter(p => p.status === 'Stable').length / currentPatients.length) * 100)}%` 
              }}></div>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Under Monitoring</span>
              <span className="font-semibold text-blue-600">
                {currentPatients.filter(p => p.status === 'Monitoring').length}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-blue-500 h-2 rounded-full" style={{ 
                width: `${((currentPatients.filter(p => p.status === 'Monitoring').length / currentPatients.length) * 100)}%` 
              }}></div>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">In Recovery</span>
              <span className="font-semibold text-green-600">
                {currentPatients.filter(p => p.status === 'Recovery').length}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-green-500 h-2 rounded-full" style={{ 
                width: `${((currentPatients.filter(p => p.status === 'Recovery').length / currentPatients.length) * 100)}%` 
              }}></div>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Critical Cases</span>
              <span className="font-semibold text-red-600">
                {currentPatients.filter(p => p.status === 'Critical').length}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-red-500 h-2 rounded-full" style={{ 
                width: `${((currentPatients.filter(p => p.status === 'Critical').length / currentPatients.length) * 100)}%` 
              }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Correlation Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CustomLineChart
          data={vitalsCorrelation}
          dataKeys={[
            { key: 'heartRate', color: '#dc2626', name: 'Heart Rate (bpm)' },
            { key: 'bloodPressure', color: '#2563eb', name: 'Systolic BP (mmHg)' },
          ]}
          xAxisKey="age"
          title="Current Patients - Age vs. Vitals Correlation"
        />
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Current Patient Insights</h3>
          <div className="space-y-4">
            <div className="border-l-4 border-red-500 pl-4 py-2">
              <p className="font-medium text-gray-900">Critical Patient Alert</p>
              <p className="text-sm text-gray-600">
                {currentPatients.filter(p => p.status === 'Critical').length} patient(s) requiring immediate attention
              </p>
            </div>
            <div className="border-l-4 border-yellow-500 pl-4 py-2">
              <p className="font-medium text-gray-900">Monitoring Required</p>
              <p className="text-sm text-gray-600">
                {currentPatients.filter(p => p.status === 'Monitoring').length} patient(s) under close observation
              </p>
            </div>
            <div className="border-l-4 border-green-500 pl-4 py-2">
              <p className="font-medium text-gray-900">Recovery Progress</p>
              <p className="text-sm text-gray-600">
                {currentPatients.filter(p => p.status === 'Recovery').length} patient(s) showing positive recovery signs
              </p>
            </div>
            <div className="border-l-4 border-blue-500 pl-4 py-2">
              <p className="font-medium text-gray-900">Stable Patients</p>
              <p className="text-sm text-gray-600">
                {currentPatients.filter(p => p.status === 'Stable').length} patient(s) maintaining stable condition
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Condition Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CustomPieChart
          data={conditionDistribution}
          colors={pieColors}
          title="Current Patients - Medical Conditions"
        />
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Treatment Summary</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Total Current Patients</span>
              <span className="font-semibold text-blue-600">{currentPatients.length}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Average Age</span>
              <span className="font-semibold text-gray-800">{avgAge} years</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Most Common Condition</span>
              <span className="font-semibold text-gray-800">
                {Object.entries(conditionCounts).sort(([,a], [,b]) => b - a)[0]?.[0] || 'N/A'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Success Rate</span>
              <span className="font-semibold text-green-600">{mockDoctorStats.successRate}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;