import { Patient } from '../types';
import { apiConfig, apiFetch } from './config';

const API_URL = `${apiConfig.baseURL}/patients`;

export const patientsApi = {
  // Get all patients
  getAll: async (): Promise<Patient[]> => {
    const data = await apiFetch<Patient[]>(API_URL);
    // Transform API response to match TypeScript interface
    return data.map(transformPatient);
  },

  // Get patient by ID
  getById: async (id: number): Promise<Patient> => {
    const data = await apiFetch<Patient>(`${API_URL}/${id}`);
    return transformPatient(data);
  },

  // Create new patient
  create: async (patient: Partial<Patient>): Promise<Patient> => {
    const data = await apiFetch<Patient>(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(patient),
    });
    return transformPatient(data);
  },

  // Update patient
  update: async (id: number, patient: Partial<Patient>): Promise<void> => {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ...patient, id }),
    });
    if (!response.ok) {
      throw new Error(`Failed to update patient: ${response.statusText}`);
    }
  },

  // Delete patient
  delete: async (id: number): Promise<void> => {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error(`Failed to delete patient: ${response.statusText}`);
    }
  },
};

// Transform API response to match TypeScript interface
function transformPatient(apiPatient: any): Patient {
  return {
    id: apiPatient.id.toString(),
    name: apiPatient.name,
    age: apiPatient.age,
    gender: apiPatient.gender as 'Male' | 'Female' | 'Other',
    condition: apiPatient.condition,
    status: apiPatient.status as Patient['status'],
    lastVisit: apiPatient.lastVisit,
    admissionDate: apiPatient.admissionDate,
    dischargeDate: apiPatient.dischargeDate,
    treatmentStartDate: apiPatient.treatmentStartDate,
    contactInfo: apiPatient.contactInfo || {
      phone: '',
      email: '',
      address: '',
    },
    vitals: apiPatient.vitals || [],
    medicalHistory: apiPatient.medicalHistory || [],
    medications: apiPatient.medications || [],
    testResults: apiPatient.testResults || [],
    allergies: apiPatient.allergies || [],
    emergencyContact: apiPatient.emergencyContact || {
      name: '',
      relationship: '',
      phone: '',
    },
    isCurrentPatient: apiPatient.isCurrentPatient,
    treatmentNotes: apiPatient.treatmentNotes,
  };
}

