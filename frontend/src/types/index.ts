export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  condition: string;
  status: 'Stable' | 'Critical' | 'Improving' | 'Monitoring' | 'Recovery' | 'Discharged' | 'Recovered';
  lastVisit: string;
  admissionDate?: string;
  dischargeDate?: string;
  treatmentStartDate?: string;
  contactInfo: {
    phone: string;
    email: string;
    address: string;
  };
  vitals: Vital[];
  medicalHistory: MedicalCondition[];
  medications: Medication[];
  testResults: TestResult[];
  allergies: string[];
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
  };
  isCurrentPatient: boolean; // Whether patient is currently under treatment
  treatmentNotes?: string;
}

export interface Vital {
  id: string;
  patientId: string;
  timestamp: string;
  heartRate: number;
  bloodPressureSystemic: number;
  bloodPressureDiastolic: number;
  temperature: number;
  oxygenSaturation: number;
  respiratoryRate: number;
}

export interface MedicalCondition {
  id: string;
  condition: string;
  diagnosedDate: string;
  severity: 'Mild' | 'Moderate' | 'Severe';
  status: 'Active' | 'Resolved' | 'Chronic';
  notes: string;
}

export interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  startDate: string;
  endDate?: string;
  prescribedBy: string;
  status: 'Active' | 'Discontinued' | 'Completed';
  notes?: string;
}

export interface TestResult {
  id: string;
  testName: string;
  testType: 'Blood Test' | 'Imaging' | 'Biopsy' | 'Cardiac' | 'Pulmonary' | 'Other';
  date: string;
  result: string;
  normalRange?: string;
  status: 'Normal' | 'Abnormal' | 'Critical';
  orderedBy: string;
  notes?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'Doctor' | 'Nurse' | 'Admin';
  avatar?: string;
  practiceStartDate?: string; // When the doctor started practicing
}

export interface DashboardMetrics {
  totalPatients: number;
  activePatients: number;
  criticalCases: number;
  averageHeartRate: number;
  averageBloodPressure: string;
  commonConditions: { condition: string; count: number }[];
  lifetimePatients: number; // Total patients ever treated
  currentPatients: number; // Patients currently under treatment
  recoveredPatients: number; // Successfully treated patients
  dischargedPatients: number; // Patients who completed treatment
}

export interface DoctorStats {
  totalPatientsTreated: number;
  currentPatients: number;
  patientsInRecovery: number;
  patientsDischarged: number;
  patientsRecovered: number;
  averageTreatmentDuration: number; // in days
  successRate: number; // percentage of successful treatments
  yearsOfPractice: number;
}