import { Patient } from '../types';

// Format date to YYYY-MM-DD
export const formatDate = (date: string | Date): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toISOString().split('T')[0];
};

// Format date time
export const formatDateTime = (date: string | Date): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleString();
};

// Calculate age from date of birth
export const calculateAge = (birthDate: string | Date): number => {
  const today = new Date();
  const birth = typeof birthDate === 'string' ? new Date(birthDate) : birthDate;
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  
  return age;
};

// Get status color
export const getStatusColor = (status: string): string => {
  const statusColors: Record<string, string> = {
    Stable: '#10b981',
    Critical: '#ef4444',
    Improving: '#3b82f6',
    Monitoring: '#f59e0b',
    Recovery: '#3b82f6',
    Discharged: '#6b7280',
    Recovered: '#10b981',
  };
  
  return statusColors[status] || '#6b7280';
};

// Filter patients by status
export const filterPatientsByStatus = (
  patients: Patient[],
  status: string
): Patient[] => {
  if (status === 'All') return patients;
  return patients.filter(p => p.status === status);
};

// Filter patients by condition
export const filterPatientsByCondition = (
  patients: Patient[],
  condition: string
): Patient[] => {
  if (condition === 'All') return patients;
  return patients.filter(p => p.condition === condition);
};

// Search patients
export const searchPatients = (
  patients: Patient[],
  searchTerm: string
): Patient[] => {
  if (!searchTerm) return patients;
  
  const term = searchTerm.toLowerCase();
  return patients.filter(
    p =>
      p.name.toLowerCase().includes(term) ||
      p.condition.toLowerCase().includes(term) ||
      p.status.toLowerCase().includes(term)
  );
};

// Calculate percentage
export const calculatePercentage = (value: number, total: number): number => {
  if (total === 0) return 0;
  return Math.round((value / total) * 100);
};

// Group patients by condition
export const groupByCondition = (
  patients: Patient[]
): Record<string, Patient[]> => {
  return patients.reduce((acc, patient) => {
    const condition = patient.condition;
    if (!acc[condition]) {
      acc[condition] = [];
    }
    acc[condition].push(patient);
    return acc;
  }, {} as Record<string, Patient[]>);
};

// Group patients by status
export const groupByStatus = (
  patients: Patient[]
): Record<string, Patient[]> => {
  return patients.reduce((acc, patient) => {
    const status = patient.status;
    if (!acc[status]) {
      acc[status] = [];
    }
    acc[status].push(patient);
    return acc;
  }, {} as Record<string, Patient[]>);
};

