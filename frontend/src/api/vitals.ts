import { Vital } from '../types';
import { apiConfig, apiFetch } from './config';

const API_URL = `${apiConfig.baseURL}/vitals`;

export const vitalsApi = {
  // Get all vitals (optionally filtered by patientId)
  getAll: async (patientId?: number): Promise<Vital[]> => {
    const url = patientId ? `${API_URL}?patientId=${patientId}` : API_URL;
    const data = await apiFetch<Vital[]>(url);
    return data.map(transformVital);
  },

  // Get vital by ID
  getById: async (id: number): Promise<Vital> => {
    const data = await apiFetch<Vital>(`${API_URL}/${id}`);
    return transformVital(data);
  },

  // Create new vital
  create: async (vital: Partial<Vital>): Promise<Vital> => {
    const data = await apiFetch<Vital>(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(vital),
    });
    return transformVital(data);
  },

  // Update vital
  update: async (id: number, vital: Partial<Vital>): Promise<void> => {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ...vital, id }),
    });
    if (!response.ok) {
      throw new Error(`Failed to update vital: ${response.statusText}`);
    }
  },

  // Delete vital
  delete: async (id: number): Promise<void> => {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error(`Failed to delete vital: ${response.statusText}`);
    }
  },
};

// Transform API response to match TypeScript interface
function transformVital(apiVital: any): Vital {
  return {
    id: apiVital.id.toString(),
    patientId: apiVital.patientId.toString(),
    timestamp: apiVital.timestamp,
    heartRate: apiVital.heartRate,
    bloodPressureSystemic: apiVital.bloodPressureSystemic,
    bloodPressureDiastolic: apiVital.bloodPressureDiastolic,
    temperature: apiVital.temperature,
    oxygenSaturation: apiVital.oxygenSaturation,
    respiratoryRate: apiVital.respiratoryRate,
  };
}

