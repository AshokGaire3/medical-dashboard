import React, { useState } from 'react';
import { Patient } from '../../types';
import { 
  X, Phone, Mail, MapPin, Calendar, User, Heart, 
  Pill, FileText, AlertTriangle, Clock, Activity,
  Stethoscope, TestTube, ClipboardList, UserCheck
} from 'lucide-react';
import { motion } from 'framer-motion';

interface PatientProfileProps {
  patient: Patient;
  onClose: () => void;
}

const PatientProfile: React.FC<PatientProfileProps> = ({ patient, onClose }) => {
  const [activeTab, setActiveTab] = useState('overview');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Stable':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Critical':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'Improving':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Monitoring':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'Mild':
        return 'bg-yellow-100 text-yellow-800';
      case 'Moderate':
        return 'bg-orange-100 text-orange-800';
      case 'Severe':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTestStatusColor = (status: string) => {
    switch (status) {
      case 'Normal':
        return 'bg-green-100 text-green-800';
      case 'Abnormal':
        return 'bg-yellow-100 text-yellow-800';
      case 'Critical':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getMedicationStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-800';
      case 'Discontinued':
        return 'bg-red-100 text-red-800';
      case 'Completed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: User },
    { id: 'medical-history', label: 'Medical History', icon: FileText },
    { id: 'medications', label: 'Medications', icon: Pill },
    { id: 'test-results', label: 'Test Results', icon: TestTube },
    { id: 'vitals', label: 'Vitals', icon: Activity },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white rounded-xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-bold text-xl">
                  {patient.name.split(' ').map(n => n[0]).join('')}
                </span>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{patient.name}</h2>
                <div className="flex items-center space-x-4 mt-1">
                  <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full border ${getStatusColor(patient.status)}`}>
                    {patient.status}
                  </span>
                  <span className="text-sm text-gray-600">{patient.age} years old • {patient.gender}</span>
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 bg-gray-50">
          <div className="flex space-x-8 px-6">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                    <User className="w-5 h-5 mr-2 text-blue-600" />
                    Patient Information
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Age:</span>
                      <span className="font-medium">{patient.age} years</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Gender:</span>
                      <span className="font-medium">{patient.gender}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Last Visit:</span>
                      <span className="font-medium">{new Date(patient.lastVisit).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Primary Condition:</span>
                      <span className="font-medium">{patient.condition}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                    <Phone className="w-5 h-5 mr-2 text-green-600" />
                    Contact Information
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <span className="text-sm">{patient.contactInfo.phone}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <span className="text-sm">{patient.contactInfo.email}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <span className="text-sm">{patient.contactInfo.address}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Emergency Contact & Allergies */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                  <h3 className="font-semibold text-red-900 mb-4 flex items-center">
                    <UserCheck className="w-5 h-5 mr-2 text-red-600" />
                    Emergency Contact
                  </h3>
                  <div className="space-y-2">
                    <p className="font-medium text-red-900">{patient.emergencyContact.name}</p>
                    <p className="text-sm text-red-700">{patient.emergencyContact.relationship}</p>
                    <p className="text-sm text-red-700">{patient.emergencyContact.phone}</p>
                  </div>
                </div>

                <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                  <h3 className="font-semibold text-yellow-900 mb-4 flex items-center">
                    <AlertTriangle className="w-5 h-5 mr-2 text-yellow-600" />
                    Allergies
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {patient.allergies.map((allergy, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-yellow-100 text-yellow-800 text-sm rounded-full border border-yellow-300"
                      >
                        {allergy}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Recent Vitals */}
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <h3 className="font-semibold text-blue-900 mb-4 flex items-center">
                  <Heart className="w-5 h-5 mr-2 text-blue-600" />
                  Recent Vital Signs
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <p className="text-sm text-blue-600 font-medium">Heart Rate</p>
                    <p className="text-2xl font-bold text-blue-800">72 bpm</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-blue-600 font-medium">Blood Pressure</p>
                    <p className="text-2xl font-bold text-blue-800">120/80</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-blue-600 font-medium">Temperature</p>
                    <p className="text-2xl font-bold text-blue-800">98.6°F</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-blue-600 font-medium">O2 Saturation</p>
                    <p className="text-2xl font-bold text-blue-800">98%</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'medical-history' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <Stethoscope className="w-5 h-5 mr-2 text-blue-600" />
                Medical History
              </h3>
              {patient.medicalHistory.map((condition) => (
                <div key={condition.id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-semibold text-gray-900">{condition.condition}</h4>
                      <p className="text-sm text-gray-600">
                        Diagnosed: {new Date(condition.diagnosedDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getSeverityColor(condition.severity)}`}>
                        {condition.severity}
                      </span>
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        condition.status === 'Active' ? 'bg-red-100 text-red-800' :
                        condition.status === 'Resolved' ? 'bg-green-100 text-green-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {condition.status}
                      </span>
                    </div>
                  </div>
                  <p className="text-gray-700 text-sm">{condition.notes}</p>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'medications' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <Pill className="w-5 h-5 mr-2 text-green-600" />
                Current Medications
              </h3>
              {patient.medications.map((medication) => (
                <div key={medication.id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-semibold text-gray-900">{medication.name}</h4>
                      <p className="text-sm text-gray-600">
                        {medication.dosage} • {medication.frequency}
                      </p>
                      <p className="text-xs text-gray-500">
                        Prescribed by {medication.prescribedBy} on {new Date(medication.startDate).toLocaleDateString()}
                      </p>
                    </div>
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getMedicationStatusColor(medication.status)}`}>
                      {medication.status}
                    </span>
                  </div>
                  {medication.notes && (
                    <p className="text-gray-700 text-sm bg-gray-50 p-2 rounded">{medication.notes}</p>
                  )}
                </div>
              ))}
            </div>
          )}

          {activeTab === 'test-results' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <TestTube className="w-5 h-5 mr-2 text-purple-600" />
                Test Results
              </h3>
              {patient.testResults.map((test) => (
                <div key={test.id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-semibold text-gray-900">{test.testName}</h4>
                      <p className="text-sm text-gray-600">
                        {test.testType} • {new Date(test.date).toLocaleDateString()}
                      </p>
                      <p className="text-xs text-gray-500">Ordered by {test.orderedBy}</p>
                    </div>
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getTestStatusColor(test.status)}`}>
                      {test.status}
                    </span>
                  </div>
                  <div className="space-y-2">
                    <div>
                      <span className="text-sm font-medium text-gray-700">Result: </span>
                      <span className="text-sm text-gray-900">{test.result}</span>
                    </div>
                    {test.normalRange && (
                      <div>
                        <span className="text-sm font-medium text-gray-700">Normal Range: </span>
                        <span className="text-sm text-gray-600">{test.normalRange}</span>
                      </div>
                    )}
                    {test.notes && (
                      <p className="text-sm text-gray-700 bg-gray-50 p-2 rounded">{test.notes}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'vitals' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <Activity className="w-5 h-5 mr-2 text-red-600" />
                Vital Signs History
              </h3>
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <p className="text-gray-600 text-center py-8">
                  Vital signs chart would be displayed here with historical data visualization.
                </p>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default PatientProfile;