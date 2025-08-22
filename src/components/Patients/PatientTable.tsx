import React from 'react';
import { Patient } from '../../types';
import { Eye, Phone, Mail, Clock, CheckCircle } from 'lucide-react';

interface PatientTableProps {
  patients: Patient[];
  onViewPatient: (patient: Patient) => void;
  patientType?: 'current' | 'historical' | 'all';
}

const PatientTable: React.FC<PatientTableProps> = ({ patients, onViewPatient, patientType = 'all' }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Stable':
        return 'bg-green-100 text-green-800';
      case 'Critical':
        return 'bg-red-100 text-red-800';
      case 'Recovery':
        return 'bg-blue-100 text-blue-800';
      case 'Monitoring':
        return 'bg-yellow-100 text-yellow-800';
      case 'Discharged':
        return 'bg-gray-100 text-gray-800';
      case 'Recovered':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPatientTypeIndicator = (patient: Patient) => {
    if (patient.isCurrentPatient) {
      return (
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
          <span className="text-xs text-blue-600 font-medium">Current</span>
        </div>
      );
    } else {
      return (
        <div className="flex items-center space-x-2">
          <Clock className="w-3 h-3 text-gray-400" />
          <span className="text-xs text-gray-500">Historical</span>
        </div>
      );
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800">
          {patientType === 'current' ? 'Current Patients' : 
           patientType === 'historical' ? 'Historical Patients' : 
           'All Patients'} Directory
        </h3>
        <p className="text-sm text-gray-500 mt-1">
          {patients.length} patient{patients.length !== 1 ? 's' : ''} found
        </p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Patient
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Age
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Condition
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Last Visit
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {patients.map((patient) => (
              <tr key={patient.id} className={`hover:bg-gray-50 transition-colors ${
                patient.isCurrentPatient ? 'border-l-4 border-l-blue-500' : 'border-l-4 border-l-gray-300'
              }`}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      patient.isCurrentPatient ? 'bg-blue-100' : 'bg-gray-100'
                    }`}>
                      <span className={`font-semibold text-sm ${
                        patient.isCurrentPatient ? 'text-blue-600' : 'text-gray-600'
                      }`}>
                        {patient.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{patient.name}</div>
                      <div className="text-sm text-gray-500">{patient.gender}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {patient.age}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {patient.condition}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(patient.status)}`}>
                    {patient.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {new Date(patient.lastVisit).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getPatientTypeIndicator(patient)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => onViewPatient(patient)}
                    className="text-blue-600 hover:text-blue-900 flex items-center space-x-1"
                  >
                    <Eye className="w-4 h-4" />
                    <span>View</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {patients.length === 0 && (
        <div className="text-center py-8">
          <div className="text-gray-400 mb-2">
            {patientType === 'current' ? 'No current patients found' : 
             patientType === 'historical' ? 'No historical patients found' : 
             'No patients found'}
          </div>
          <p className="text-sm text-gray-500">
            Try adjusting your search or filter criteria
          </p>
        </div>
      )}
    </div>
  );
};

export default PatientTable;