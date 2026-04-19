// Types mirror the backend DTOs in backend/Models/DTOs/*.cs.
// Keep this file in sync when either side changes.

export type Gender = 'Male' | 'Female' | 'Other';

export type PatientStatus =
  | 'Stable'
  | 'Critical'
  | 'Improving'
  | 'Monitoring'
  | 'Recovery'
  | 'Discharged'
  | 'Recovered';

export type ConditionSeverity = 'Mild' | 'Moderate' | 'Severe';
export type ConditionStatus = 'Active' | 'Resolved' | 'Chronic';

export type MedicationStatus = 'Active' | 'Discontinued' | 'Completed';

export type TestType =
  | 'Blood Test'
  | 'Imaging'
  | 'Biopsy'
  | 'Cardiac'
  | 'Pulmonary'
  | 'Other';
export type TestStatus = 'Normal' | 'Abnormal' | 'Critical';

export type AppointmentStatus = 'Scheduled' | 'Completed' | 'Cancelled' | 'NoShow';

export type UserRole = 'Doctor' | 'Nurse' | 'Admin';

export interface ContactInfo {
  phone: string;
  email: string;
  address: string;
}

export interface EmergencyContact {
  name: string;
  relationship: string;
  phone: string;
}

export interface Patient {
  id: number;
  name: string;
  age: number;
  gender: Gender;
  condition: string;
  status: PatientStatus;
  lastVisit: string;
  admissionDate?: string | null;
  dischargeDate?: string | null;
  treatmentStartDate?: string | null;
  contactInfo: ContactInfo;
  vitals: Vital[];
  medicalHistory: MedicalCondition[];
  medications: Medication[];
  testResults: TestResult[];
  allergies: string[];
  emergencyContact: EmergencyContact;
  isCurrentPatient: boolean;
  treatmentNotes?: string | null;
}

export interface Vital {
  id: number;
  patientId: number;
  timestamp: string;
  heartRate: number;
  bloodPressureSystemic: number;
  bloodPressureDiastolic: number;
  temperature: number;
  oxygenSaturation: number;
  respiratoryRate: number;
}

export interface MedicalCondition {
  id: number;
  condition: string;
  diagnosedDate: string;
  severity: ConditionSeverity;
  status: ConditionStatus;
  notes: string;
}

export interface Medication {
  id: number;
  name: string;
  dosage: string;
  frequency: string;
  startDate: string;
  endDate?: string | null;
  prescribedBy: string;
  status: MedicationStatus;
  notes?: string | null;
}

export interface TestResult {
  id: number;
  testName: string;
  testType: TestType;
  date: string;
  result: string;
  normalRange?: string | null;
  status: TestStatus;
  orderedBy: string;
  notes?: string | null;
}

export interface Appointment {
  id: number;
  patientId: number;
  patientName?: string | null;
  scheduledAt: string;
  durationMinutes: number;
  reason: string;
  status: AppointmentStatus;
  notes?: string | null;
}

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string | null;
  practiceStartDate?: string | null;
}

export interface AuthResponse {
  token: string;
  expiresAt: string;
  user: AuthUser;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
  role?: UserRole;
}

export interface DashboardMetrics {
  totalPatients: number;
  activePatients: number;
  criticalCases: number;
  averageHeartRate: number;
  averageBloodPressure: string;
  commonConditions: { condition: string; count: number }[];
  lifetimePatients: number;
  currentPatients: number;
  recoveredPatients: number;
  dischargedPatients: number;
}

export interface VitalsTrendPoint {
  date: string;
  heartRate: number;
  systolicBP: number;
  diastolicBP: number;
  temperature: number;
  oxygenSat: number;
  respiratoryRate: number;
}

export interface DashboardAlert {
  patient: string;
  patientId: number;
  vital: string;
  value: string;
  severity: 'High' | 'Critical';
  timestamp: string;
}

export interface PagedResult<T> {
  items: T[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export interface PatientsQuery {
  search?: string;
  status?: PatientStatus | '';
  isCurrent?: boolean;
  page?: number;
  pageSize?: number;
  sortBy?: 'name' | 'lastVisit' | 'age';
  sortDir?: 'asc' | 'desc';
}

// Kept for backwards compatibility with existing components that read them:
export interface DoctorStats {
  totalPatientsTreated: number;
  currentPatients: number;
  patientsInRecovery: number;
  patientsDischarged: number;
  patientsRecovered: number;
  averageTreatmentDuration: number;
  successRate: number;
  yearsOfPractice: number;
}

export interface User extends AuthUser {}
