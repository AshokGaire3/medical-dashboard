// Application constants
export const API_ENDPOINTS = {
  PATIENTS: '/api/patients',
  VITALS: '/api/vitals',
  DASHBOARD: '/api/dashboard',
} as const;

export const PATIENT_STATUSES = [
  'Stable',
  'Critical',
  'Improving',
  'Monitoring',
  'Recovery',
  'Discharged',
  'Recovered',
] as const;

export const GENDERS = ['Male', 'Female', 'Other'] as const;

export const CHART_COLORS = {
  PRIMARY: '#2563eb',
  SUCCESS: '#059669',
  DANGER: '#dc2626',
  WARNING: '#d97706',
  INFO: '#7c3aed',
  PINK: '#ec4899',
  BLUE: '#3b82f6',
} as const;

export const PIE_CHART_COLORS = [
  '#2563eb',
  '#059669',
  '#dc2626',
  '#d97706',
  '#7c3aed',
  '#ec4899',
  '#3b82f6',
  '#84cc16',
] as const;

