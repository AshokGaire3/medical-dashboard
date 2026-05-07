import { api } from './client';
import { API_BASE_URL, TOKEN_STORAGE_KEY } from './config';

export const reportsApi = {
 patientsJson: () => api.get<unknown[]>('/reports/patients.json'),

 downloadPatientsCsv: async (filename = 'patients.csv'): Promise<void> => {
 const token = localStorage.getItem(TOKEN_STORAGE_KEY);
 const res = await fetch(`${API_BASE_URL}/reports/patients.csv`, {
 headers: token ? { Authorization: `Bearer ${token}` } : {},
 });
 if (!res.ok) throw new Error(`Failed to download CSV (${res.status})`);
 const blob = await res.blob();
 const url = URL.createObjectURL(blob);
 const a = document.createElement('a');
 a.href = url;
 a.download = filename;
 document.body.appendChild(a);
 a.click();
 a.remove();
 URL.revokeObjectURL(url);
 },
};
