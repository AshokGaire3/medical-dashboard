import React from 'react';
import { Users, UserCheck, AlertTriangle, Heart, Activity, TrendingUp, Thermometer, Droplets, Activity as ActivityIcon, Award, Clock, CheckCircle } from 'lucide-react';
import MetricCard from '../components/Dashboard/MetricCard';
import CustomLineChart from '../components/Charts/LineChart';
import CustomPieChart from '../components/Charts/PieChart';
import CustomBarChart from '../components/Charts/BarChart';
import { mockDashboardMetrics, mockPatients, mockDoctorStats } from '../data/mockData';

const Dashboard: React.FC = () => {
  // Enhanced vital trends data with more precise medical ranges
  const vitalTrendsData = [
    { 
      time: '08:00', 
      heartRate: 72, 
      systolicBP: 120, 
      diastolicBP: 80,
      temperature: 98.6, 
      oxygenSat: 98,
      respiratoryRate: 16
    },
    { 
      time: '10:00', 
      heartRate: 75, 
      systolicBP: 118, 
      diastolicBP: 78,
      temperature: 98.7, 
      oxygenSat: 98,
      respiratoryRate: 15
    },
    { 
      time: '12:00', 
      heartRate: 78, 
      systolicBP: 122, 
      diastolicBP: 82,
      temperature: 98.5, 
      oxygenSat: 99,
      respiratoryRate: 17
    },
    { 
      time: '14:00', 
      heartRate: 73, 
      systolicBP: 119, 
      diastolicBP: 79,
      temperature: 98.8, 
      oxygenSat: 98,
      respiratoryRate: 16
    },
    { 
      time: '16:00', 
      heartRate: 70, 
      systolicBP: 117, 
      diastolicBP: 77,
      temperature: 98.4, 
      oxygenSat: 99,
      respiratoryRate: 15
    },
    { 
      time: '18:00', 
      heartRate: 74, 
      systolicBP: 121, 
      diastolicBP: 81,
      temperature: 98.6, 
      oxygenSat: 98,
      respiratoryRate: 16
    },
  ];

  // Get current patients and calculate real data
  const currentPatients = mockPatients.filter(p => p.isCurrentPatient);
  
  // Calculate condition distribution from actual current patient data
  const conditionCounts: { [key: string]: number } = {};
  currentPatients.forEach(patient => {
    const condition = patient.condition;
    if (conditionCounts[condition]) {
      conditionCounts[condition]++;
    } else {
      conditionCounts[condition] = 1;
    }
  });

  const conditionDistribution = Object.entries(conditionCounts).map(([condition, count]) => ({
    name: condition,
    value: count,
    severity: getConditionSeverity(condition)
  }));

  // Calculate age group data from actual current patients
  const ageGroups: { [key: string]: number } = {};
  currentPatients.forEach(patient => {
    let ageGroup = '';
    if (patient.age < 30) ageGroup = '18-30';
    else if (patient.age < 45) ageGroup = '31-45';
    else if (patient.age < 60) ageGroup = '46-60';
    else if (patient.age < 75) ageGroup = '61-75';
    else ageGroup = '75+';
    
    if (ageGroups[ageGroup]) {
      ageGroups[ageGroup]++;
    } else {
      ageGroups[ageGroup] = 1;
    }
  });

  const ageGroupData = Object.entries(ageGroups).map(([ageGroup, count]) => ({
    ageGroup,
    count,
    avgConditions: calculateAvgConditions(ageGroup, currentPatients),
    criticalRate: calculateCriticalRate(ageGroup, currentPatients)
  }));

  // Current patient status breakdown
  const currentPatientStatusData = [
    { status: 'Stable', count: currentPatients.filter(p => p.status === 'Stable').length, color: '#10b981' },
    { status: 'Monitoring', count: currentPatients.filter(p => p.status === 'Monitoring').length, color: '#f59e0b' },
    { status: 'Critical', count: currentPatients.filter(p => p.status === 'Critical').length, color: '#ef4444' },
    { status: 'Recovery', count: currentPatients.filter(p => p.status === 'Recovery').length, color: '#3b82f6' },
  ];

  // Vital signs alerts (current patients only)
  const vitalAlerts = [
    { patient: 'Emily Rodriguez', vital: 'Blood Pressure', value: '180/110', status: 'Critical', time: '2 hours ago' },
    { patient: 'David Wilson', vital: 'Heart Rate', value: '110 bpm', status: 'High', time: '4 hours ago' },
    { patient: 'Michael Chen', vital: 'Blood Sugar', value: '280 mg/dL', status: 'High', time: '6 hours ago' },
  ];

  const pieColors = ['#10b981', '#f59e0b', '#ef4444', '#3b82f6', '#8b5cf6', '#06b6d4', '#84cc16', '#f97316'];

  // Calculate enhanced metrics
  const totalPatients = mockPatients.length;
  const currentPatientCount = currentPatients.length;
  const criticalPatients = currentPatients.filter(p => p.status === 'Critical').length;
  const monitoringPatients = currentPatients.filter(p => p.status === 'Monitoring').length;
  const stablePatients = currentPatients.filter(p => p.status === 'Stable').length;
  const recoveryPatients = currentPatients.filter(p => p.status === 'Recovery').length;

  // Helper functions
  function getConditionSeverity(condition: string): string {
    const severityMap: { [key: string]: string } = {
      'Hypertension': 'Moderate',
      'Diabetes Type 2': 'Moderate',
      'Diabetes Type 1': 'Severe',
      'Heart Disease': 'Severe',
      'Asthma': 'Severe'
    };
    return severityMap[condition] || 'Mild';
  }

  function calculateAvgConditions(ageGroup: string, patients: any[]): number {
    const groupPatients = patients.filter(p => {
      let patientAgeGroup = '';
      if (p.age < 30) patientAgeGroup = '18-30';
      else if (p.age < 45) patientAgeGroup = '31-45';
      else if (p.age < 60) patientAgeGroup = '46-60';
      else if (p.age < 75) patientAgeGroup = '61-75';
      else patientAgeGroup = '75+';
      return patientAgeGroup === ageGroup;
    });
    
    if (groupPatients.length === 0) return 0;
    const totalConditions = groupPatients.reduce((sum, p) => sum + p.medicalHistory.length, 0);
    return Math.round((totalConditions / groupPatients.length) * 10) / 10;
  }

  function calculateCriticalRate(ageGroup: string, patients: any[]): number {
    const groupPatients = patients.filter(p => {
      let patientAgeGroup = '';
      if (p.age < 30) patientAgeGroup = '18-30';
      else if (p.age < 45) patientAgeGroup = '31-45';
      else if (p.age < 60) patientAgeGroup = '46-60';
      else if (p.age < 75) patientAgeGroup = '61-75';
      else patientAgeGroup = '75+';
      return patientAgeGroup === ageGroup;
    });
    
    if (groupPatients.length === 0) return 0;
    const criticalCount = groupPatients.filter(p => p.status === 'Critical').length;
    return Math.round((criticalCount / groupPatients.length) * 100) / 100;
  }

  return (
    <div className="p-6 space-y-6">
      {/* Lifetime Achievement & Current Focus Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Lifetime Patients"
          value={mockDoctorStats.totalPatientsTreated}
          change={`${mockDoctorStats.yearsOfPractice} years of practice`}
          changeType="neutral"
          icon={Award}
          color="blue"
        />
        <MetricCard
          title="Current Patients"
          value={currentPatientCount}
          change={`${((currentPatientCount / mockDoctorStats.totalPatientsTreated) * 100).toFixed(1)}% of total`}
          changeType="positive"
          icon={Users}
          color="blue"
        />
        <MetricCard
          title="Success Rate"
          value={`${mockDoctorStats.successRate}%`}
          change={`${mockDoctorStats.patientsRecovered} patients recovered`}
          changeType="positive"
          icon={CheckCircle}
          color="green"
        />
        <MetricCard
          title="Avg Treatment Duration"
          value={`${mockDoctorStats.averageTreatmentDuration} days`}
          change="Current patients average"
          changeType="neutral"
          icon={Clock}
          color="yellow"
        />
      </div>

      {/* Current Patient Status Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Current Patient Status</h3>
          <div className="space-y-4">
            {currentPatientStatusData.map((status, index) => (
              <div key={status.status} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: status.color }}
                  ></div>
                  <span className="text-sm font-medium text-gray-900">{status.status}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-lg font-semibold text-gray-800">{status.count}</span>
                  <span className="text-xs text-gray-500">
                    ({((status.count / currentPatientCount) * 100).toFixed(1)}%)
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Treatment Progress</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Patients in Recovery</span>
              <span className="text-sm font-semibold text-blue-600">{recoveryPatients}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Stable Patients</span>
              <span className="text-sm font-semibold text-green-600">{stablePatients}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Under Monitoring</span>
              <span className="text-sm font-semibold text-yellow-600">{monitoringPatients}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Critical Cases</span>
              <span className="text-sm font-semibold text-red-600">{criticalPatients}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Charts Row 1 - Vital Signs & Conditions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CustomLineChart
          data={vitalTrendsData}
          dataKeys={[
            { key: 'heartRate', color: '#ef4444', name: 'Heart Rate (bpm)' },
            { key: 'systolicBP', color: '#3b82f6', name: 'Systolic BP (mmHg)' },
            { key: 'oxygenSat', color: '#10b981', name: 'O2 Saturation (%)' },
          ]}
          xAxisKey="time"
          title="Current Patients - Vital Signs Monitoring"
        />
        <CustomPieChart
          data={conditionDistribution}
          colors={pieColors}
          title="Current Patients - Medical Conditions by Severity"
        />
      </div>

      {/* Enhanced Charts Row 2 - Demographics & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CustomBarChart
          data={ageGroupData}
          dataKey="count"
          xAxisKey="ageGroup"
          color="#3b82f6"
          title="Current Patients - Demographics & Risk Factors"
          secondaryDataKey="avgConditions"
          secondaryColor="#f59e0b"
        />
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Treatment Activities</h3>
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
              <div>
                <p className="text-sm font-medium text-gray-900">New patient admitted</p>
                <p className="text-xs text-gray-500">Emily Rodriguez - Asthma exacerbation - 2 hours ago</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
              <div>
                <p className="text-sm font-medium text-gray-900">Critical vitals alert</p>
                <p className="text-xs text-gray-500">Emily Rodriguez - BP: 180/110 - Requires immediate attention - 3 hours ago</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
              <div>
                <p className="text-sm font-medium text-gray-900">Treatment progress</p>
                <p className="text-xs text-gray-500">David Wilson - Cardiac function improving - 5 hours ago</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
              <div>
                <p className="text-sm font-medium text-gray-900">Medication adjustment</p>
                <p className="text-xs text-gray-500">Michael Chen - Metformin dosage increased - 6 hours ago</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
              <div>
                <p className="text-sm font-medium text-gray-900">Lab results received</p>
                <p className="text-xs text-gray-500">Sarah Johnson - Lipid panel - Normal results - 8 hours ago</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Charts Row 3 - Alerts & Historical Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Current Patients - Critical Alerts</h3>
          <div className="space-y-4">
            {vitalAlerts.map((alert, index) => (
              <div key={index} className="flex items-start space-x-3 p-3 bg-red-50 rounded-lg border border-red-200">
                <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{alert.patient}</p>
                      <p className="text-xs text-gray-600">{alert.vital}: {alert.value}</p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      alert.status === 'Critical' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {alert.status}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{alert.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Lifetime Achievement Summary</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Total Patients Treated</span>
              <span className="text-lg font-semibold text-purple-600">{mockDoctorStats.totalPatientsTreated}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Successfully Recovered</span>
              <span className="text-lg font-semibold text-green-600">{mockDoctorStats.patientsRecovered}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Currently Under Care</span>
              <span className="text-lg font-semibold text-blue-600">{currentPatientCount}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Years of Practice</span>
              <span className="text-lg font-semibold text-gray-800">{mockDoctorStats.yearsOfPractice}</span>
            </div>
            <div className="pt-2 border-t border-gray-200">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700">Overall Success Rate</span>
                <span className="text-lg font-bold text-green-600">{mockDoctorStats.successRate}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Patient Count Clarification */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Patient Count Clarification</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h4 className="font-medium text-gray-700">Lifetime Patients (Total Ever Treated)</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Total Patients Treated</span>
                <span className="text-sm font-semibold text-blue-600">{mockDoctorStats.totalPatientsTreated}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Successfully Recovered</span>
                <span className="text-sm font-semibold text-green-600">{mockDoctorStats.patientsRecovered}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Discharged</span>
                <span className="text-sm font-semibold text-gray-600">{mockDoctorStats.patientsDischarged}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Years of Practice</span>
                <span className="text-sm font-semibold text-gray-800">{mockDoctorStats.yearsOfPractice}</span>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <h4 className="font-medium text-gray-700">Current Patients (Under Active Treatment)</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Currently Under Care</span>
                <span className="text-sm font-semibold text-blue-600">{currentPatientCount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Stable</span>
                <span className="text-sm font-semibold text-green-600">{stablePatients}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Monitoring</span>
                <span className="text-sm font-semibold text-yellow-600">{monitoringPatients}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Critical</span>
                <span className="text-sm font-semibold text-red-600">{criticalPatients}</span>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-600 text-center">
            <strong>Lifetime Patients</strong> = Total patients ever treated (1,250). <strong>Current Patients</strong> = Patients currently under active treatment (6). 
            The focus is on current patients while maintaining access to lifetime achievements.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;