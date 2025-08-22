import { Patient, Vital, User, DashboardMetrics, MedicalCondition, Medication, TestResult, DoctorStats } from '../types';

// Mock Patients Data - Mix of current and historical patients
export const mockPatients: Patient[] = [
  // CURRENT PATIENTS (Under active treatment)
  {
    id: '1',
    name: 'Sarah Johnson',
    age: 45,
    gender: 'Female',
    condition: 'Hypertension',
    status: 'Stable',
    lastVisit: '2024-01-15',
    admissionDate: '2023-06-15',
    treatmentStartDate: '2023-06-15',
    isCurrentPatient: true,
    treatmentNotes: 'Responding well to medication. BP controlled.',
    contactInfo: {
      phone: '(555) 123-4567',
      email: 'sarah.johnson@email.com',
      address: '123 Main St, City, State 12345'
    },
    vitals: [],
    medicalHistory: [
      {
        id: '1',
        condition: 'Hypertension',
        diagnosedDate: '2022-03-15',
        severity: 'Moderate',
        status: 'Chronic',
        notes: 'Well controlled with medication. Regular monitoring required.'
      },
      {
        id: '2',
        condition: 'High Cholesterol',
        diagnosedDate: '2023-01-10',
        severity: 'Mild',
        status: 'Active',
        notes: 'Responding well to dietary changes and medication.'
      }
    ],
    medications: [
      {
        id: '1',
        name: 'Lisinopril',
        dosage: '10mg',
        frequency: 'Once daily',
        startDate: '2022-03-15',
        prescribedBy: 'Dr. Smith',
        status: 'Active',
        notes: 'Take in the morning with food'
      },
      {
        id: '2',
        name: 'Atorvastatin',
        dosage: '20mg',
        frequency: 'Once daily',
        startDate: '2023-01-10',
        prescribedBy: 'Dr. Smith',
        status: 'Active',
        notes: 'Take at bedtime'
      }
    ],
    testResults: [
      {
        id: '1',
        testName: 'Complete Blood Count',
        testType: 'Blood Test',
        date: '2024-01-15',
        result: 'Normal',
        normalRange: 'WBC: 4.5-11.0, RBC: 4.2-5.4',
        status: 'Normal',
        orderedBy: 'Dr. Smith'
      },
      {
        id: '2',
        testName: 'Lipid Panel',
        testType: 'Blood Test',
        date: '2024-01-15',
        result: 'Total Cholesterol: 185 mg/dL',
        normalRange: '<200 mg/dL',
        status: 'Normal',
        orderedBy: 'Dr. Smith',
        notes: 'Significant improvement from previous test'
      }
    ],
    allergies: ['Penicillin', 'Shellfish'],
    emergencyContact: {
      name: 'John Johnson',
      relationship: 'Spouse',
      phone: '(555) 123-4568'
    }
  },
  {
    id: '2',
    name: 'Michael Chen',
    age: 38,
    gender: 'Male',
    condition: 'Diabetes Type 2',
    status: 'Monitoring',
    lastVisit: '2024-01-14',
    admissionDate: '2023-08-20',
    treatmentStartDate: '2023-08-20',
    isCurrentPatient: true,
    treatmentNotes: 'HbA1c improving. Continue current regimen.',
    contactInfo: {
      phone: '(555) 234-5678',
      email: 'michael.chen@email.com',
      address: '456 Oak Ave, City, State 12345'
    },
    vitals: [],
    medicalHistory: [
      {
        id: '3',
        condition: 'Type 2 Diabetes',
        diagnosedDate: '2021-06-20',
        severity: 'Moderate',
        status: 'Chronic',
        notes: 'HbA1c levels improving with current treatment plan.'
      }
    ],
    medications: [
      {
        id: '3',
        name: 'Metformin',
        dosage: '500mg',
        frequency: 'Twice daily',
        startDate: '2021-06-20',
        prescribedBy: 'Dr. Johnson',
        status: 'Active',
        notes: 'Take with meals to reduce stomach upset'
      }
    ],
    testResults: [
      {
        id: '3',
        testName: 'HbA1c',
        testType: 'Blood Test',
        date: '2024-01-14',
        result: '7.2%',
        normalRange: '<7.0%',
        status: 'Abnormal',
        orderedBy: 'Dr. Johnson',
        notes: 'Slight improvement from previous 7.8%'
      }
    ],
    allergies: ['None known'],
    emergencyContact: {
      name: 'Lisa Chen',
      relationship: 'Wife',
      phone: '(555) 234-5679'
    }
  },
  {
    id: '3',
    name: 'Emily Rodriguez',
    age: 29,
    gender: 'Female',
    condition: 'Asthma',
    status: 'Critical',
    lastVisit: '2024-01-16',
    admissionDate: '2024-01-10',
    treatmentStartDate: '2024-01-10',
    isCurrentPatient: true,
    treatmentNotes: 'Severe exacerbation. Requires close monitoring.',
    contactInfo: {
      phone: '(555) 345-6789',
      email: 'emily.rodriguez@email.com',
      address: '789 Pine St, City, State 12345'
    },
    vitals: [],
    medicalHistory: [
      {
        id: '4',
        condition: 'Asthma',
        diagnosedDate: '2010-05-12',
        severity: 'Severe',
        status: 'Active',
        notes: 'Recent exacerbation requiring emergency treatment.'
      }
    ],
    medications: [
      {
        id: '4',
        name: 'Albuterol Inhaler',
        dosage: '90mcg',
        frequency: 'As needed',
        startDate: '2010-05-12',
        prescribedBy: 'Dr. Williams',
        status: 'Active',
        notes: 'Use for acute symptoms'
      },
      {
        id: '5',
        name: 'Fluticasone',
        dosage: '250mcg',
        frequency: 'Twice daily',
        startDate: '2023-12-01',
        prescribedBy: 'Dr. Williams',
        status: 'Active',
        notes: 'Controller medication - do not skip doses'
      }
    ],
    testResults: [
      {
        id: '4',
        testName: 'Pulmonary Function Test',
        testType: 'Pulmonary',
        date: '2024-01-16',
        result: 'FEV1: 65% predicted',
        normalRange: '>80% predicted',
        status: 'Abnormal',
        orderedBy: 'Dr. Williams',
        notes: 'Significant decline from baseline'
      }
    ],
    allergies: ['Dust mites', 'Pollen', 'Pet dander'],
    emergencyContact: {
      name: 'Maria Rodriguez',
      relationship: 'Mother',
      phone: '(555) 345-6790'
    }
  },
  {
    id: '4',
    name: 'David Wilson',
    age: 62,
    gender: 'Male',
    condition: 'Heart Disease',
    status: 'Recovery',
    lastVisit: '2024-01-13',
    admissionDate: '2023-08-15',
    treatmentStartDate: '2023-08-15',
    isCurrentPatient: true,
    treatmentNotes: 'Post-stent recovery progressing well. Cardiac function improving.',
    contactInfo: {
      phone: '(555) 456-7890',
      email: 'david.wilson@email.com',
      address: '321 Elm St, City, State 12345'
    },
    vitals: [],
    medicalHistory: [
      {
        id: '5',
        condition: 'Coronary Artery Disease',
        diagnosedDate: '2023-08-15',
        severity: 'Severe',
        status: 'Active',
        notes: 'Post-cardiac catheterization with stent placement.'
      }
    ],
    medications: [
      {
        id: '6',
        name: 'Clopidogrel',
        dosage: '75mg',
        frequency: 'Once daily',
        startDate: '2023-08-15',
        prescribedBy: 'Dr. Brown',
        status: 'Active',
        notes: 'Blood thinner - do not stop without consulting doctor'
      }
    ],
    testResults: [
      {
        id: '5',
        testName: 'Echocardiogram',
        testType: 'Cardiac',
        date: '2024-01-13',
        result: 'EF: 55%',
        normalRange: '50-70%',
        status: 'Normal',
        orderedBy: 'Dr. Brown',
        notes: 'Good improvement in cardiac function'
      }
    ],
    allergies: ['Aspirin'],
    emergencyContact: {
      name: 'Susan Wilson',
      relationship: 'Wife',
      phone: '(555) 456-7891'
    }
  },
  {
    id: '5',
    name: 'Lisa Thompson',
    age: 51,
    gender: 'Female',
    condition: 'Hypertension',
    status: 'Stable',
    lastVisit: '2024-01-12',
    admissionDate: '2022-11-08',
    treatmentStartDate: '2022-11-08',
    isCurrentPatient: true,
    treatmentNotes: 'BP well controlled. Continue current medication.',
    contactInfo: {
      phone: '(555) 567-8901',
      email: 'lisa.thompson@email.com',
      address: '654 Maple Ave, City, State 12345'
    },
    vitals: [],
    medicalHistory: [
      {
        id: '6',
        condition: 'Hypertension',
        diagnosedDate: '2020-11-08',
        severity: 'Mild',
        status: 'Chronic',
        notes: 'Well controlled with lifestyle modifications and medication.'
      }
    ],
    medications: [
      {
        id: '7',
        name: 'Amlodipine',
        dosage: '5mg',
        frequency: 'Once daily',
        startDate: '2020-11-08',
        prescribedBy: 'Dr. Davis',
        status: 'Active'
      }
    ],
    testResults: [
      {
        id: '6',
        testName: 'Basic Metabolic Panel',
        testType: 'Blood Test',
        date: '2024-01-12',
        result: 'All values within normal limits',
        status: 'Normal',
        orderedBy: 'Dr. Davis'
      }
    ],
    allergies: ['None known'],
    emergencyContact: {
      name: 'Robert Thompson',
      relationship: 'Husband',
      phone: '(555) 567-8902'
    }
  },
  {
    id: '6',
    name: 'Robert Davis',
    age: 41,
    gender: 'Male',
    condition: 'Diabetes Type 1',
    status: 'Monitoring',
    lastVisit: '2024-01-11',
    admissionDate: '2020-01-01',
    treatmentStartDate: '2020-01-01',
    isCurrentPatient: true,
    treatmentNotes: 'Excellent glycemic control. Continue current insulin regimen.',
    contactInfo: {
      phone: '(555) 678-9012',
      email: 'robert.davis@email.com',
      address: '987 Cedar St, City, State 12345'
    },
    vitals: [],
    medicalHistory: [
      {
        id: '7',
        condition: 'Type 1 Diabetes',
        diagnosedDate: '1995-03-22',
        severity: 'Severe',
        status: 'Chronic',
        notes: 'Long-standing diabetes with good glycemic control.'
      }
    ],
    medications: [
      {
        id: '8',
        name: 'Insulin Glargine',
        dosage: '24 units',
        frequency: 'Once daily',
        startDate: '2020-01-01',
        prescribedBy: 'Dr. Martinez',
        status: 'Active',
        notes: 'Long-acting insulin - inject at bedtime'
      }
    ],
    testResults: [
      {
        id: '7',
        testName: 'HbA1c',
        testType: 'Blood Test',
        date: '2024-01-11',
        result: '6.8%',
        normalRange: '<7.0%',
        status: 'Normal',
        orderedBy: 'Dr. Martinez',
        notes: 'Excellent glycemic control'
      }
    ],
    allergies: ['None known'],
    emergencyContact: {
      name: 'Jennifer Davis',
      relationship: 'Wife',
      phone: '(555) 678-9013'
    }
  },
  // DISCHARGED/RECOVERED PATIENTS (Historical - minimal info)
  {
    id: '7',
    name: 'Jennifer Adams',
    age: 35,
    gender: 'Female',
    condition: 'Appendicitis',
    status: 'Recovered',
    lastVisit: '2023-12-15',
    admissionDate: '2023-12-10',
    dischargeDate: '2023-12-15',
    treatmentStartDate: '2023-12-10',
    isCurrentPatient: false,
    treatmentNotes: 'Appendectomy successful. Full recovery.',
    contactInfo: {
      phone: '(555) 789-0123',
      email: 'jennifer.adams@email.com',
      address: '111 Oak St, City, State 12345'
    },
    vitals: [],
    medicalHistory: [],
    medications: [],
    testResults: [],
    allergies: ['None known'],
    emergencyContact: {
      name: 'Mark Adams',
      relationship: 'Husband',
      phone: '(555) 789-0124'
    }
  },
  {
    id: '8',
    name: 'Thomas Brown',
    age: 58,
    gender: 'Male',
    condition: 'Pneumonia',
    status: 'Recovered',
    lastVisit: '2023-11-20',
    admissionDate: '2023-11-15',
    dischargeDate: '2023-11-20',
    treatmentStartDate: '2023-11-15',
    isCurrentPatient: false,
    treatmentNotes: 'Antibiotic treatment successful. Lungs clear.',
    contactInfo: {
      phone: '(555) 890-1234',
      email: 'thomas.brown@email.com',
      address: '222 Pine St, City, State 12345'
    },
    vitals: [],
    medicalHistory: [],
    medications: [],
    testResults: [],
    allergies: ['None known'],
    emergencyContact: {
      name: 'Mary Brown',
      relationship: 'Wife',
      phone: '(555) 890-1235'
    }
  },
  {
    id: '9',
    name: 'Amanda Garcia',
    age: 42,
    gender: 'Female',
    condition: 'Gallstones',
    status: 'Discharged',
    lastVisit: '2023-10-25',
    admissionDate: '2023-10-20',
    dischargeDate: '2023-10-25',
    treatmentStartDate: '2023-10-20',
    isCurrentPatient: false,
    treatmentNotes: 'Cholecystectomy completed. No complications.',
    contactInfo: {
      phone: '(555) 901-2345',
      email: 'amanda.garcia@email.com',
      address: '333 Elm St, City, State 12345'
    },
    vitals: [],
    medicalHistory: [],
    medications: [],
    testResults: [],
    allergies: ['None known'],
    emergencyContact: {
      name: 'Carlos Garcia',
      relationship: 'Husband',
      phone: '(555) 901-2346'
    }
  },
  {
    id: '10',
    name: 'James Wilson',
    age: 67,
    gender: 'Male',
    condition: 'Hip Fracture',
    status: 'Discharged',
    lastVisit: '2023-09-30',
    admissionDate: '2023-09-25',
    dischargeDate: '2023-09-30',
    treatmentStartDate: '2023-09-25',
    isCurrentPatient: false,
    treatmentNotes: 'Hip replacement successful. Physical therapy recommended.',
    contactInfo: {
      phone: '(555) 012-3456',
      email: 'james.wilson@email.com',
      address: '444 Maple St, City, State 12345'
    },
    vitals: [],
    medicalHistory: [],
    medications: [],
    testResults: [],
    allergies: ['None known'],
    emergencyContact: {
      name: 'Patricia Wilson',
      relationship: 'Wife',
      phone: '(555) 012-3457'
    }
  }
];

// Mock Vitals Data
export const mockVitals: Vital[] = [
  // Sarah Johnson
  { id: '1', patientId: '1', timestamp: '2024-01-15T08:00:00Z', heartRate: 72, bloodPressureSystemic: 120, bloodPressureDiastolic: 80, temperature: 98.6, oxygenSaturation: 98, respiratoryRate: 16 },
  { id: '2', patientId: '1', timestamp: '2024-01-15T12:00:00Z', heartRate: 75, bloodPressureSystemic: 122, bloodPressureDiastolic: 82, temperature: 98.7, oxygenSaturation: 98, respiratoryRate: 15 },
  { id: '3', patientId: '1', timestamp: '2024-01-15T16:00:00Z', heartRate: 70, bloodPressureSystemic: 118, bloodPressureDiastolic: 78, temperature: 98.5, oxygenSaturation: 99, respiratoryRate: 17 },
  
  // Michael Chen
  { id: '4', patientId: '2', timestamp: '2024-01-14T08:00:00Z', heartRate: 68, bloodPressureSystemic: 115, bloodPressureDiastolic: 75, temperature: 98.4, oxygenSaturation: 97, respiratoryRate: 18 },
  { id: '5', patientId: '2', timestamp: '2024-01-14T12:00:00Z', heartRate: 71, bloodPressureSystemic: 118, bloodPressureDiastolic: 77, temperature: 98.6, oxygenSaturation: 97, respiratoryRate: 16 },
  { id: '6', patientId: '2', timestamp: '2024-01-14T16:00:00Z', heartRate: 69, bloodPressureSystemic: 116, bloodPressureDiastolic: 76, temperature: 98.3, oxygenSaturation: 98, respiratoryRate: 17 },
  
  // Emily Rodriguez (Critical)
  { id: '7', patientId: '3', timestamp: '2024-01-16T08:00:00Z', heartRate: 95, bloodPressureSystemic: 140, bloodPressureDiastolic: 90, temperature: 99.2, oxygenSaturation: 94, respiratoryRate: 22 },
  { id: '8', patientId: '3', timestamp: '2024-01-16T12:00:00Z', heartRate: 92, bloodPressureSystemic: 138, bloodPressureDiastolic: 88, temperature: 99.1, oxygenSaturation: 95, respiratoryRate: 21 },
  { id: '9', patientId: '3', timestamp: '2024-01-16T16:00:00Z', heartRate: 98, bloodPressureSystemic: 142, bloodPressureDiastolic: 92, temperature: 99.3, oxygenSaturation: 93, respiratoryRate: 23 },
];

// Mock User Data
export const mockUser: User = {
  id: '1',
  name: 'Dr. Amanda Smith',
  email: 'amanda.smith@hospital.com',
  role: 'Doctor'
};

// Mock Dashboard Metrics
export const mockDashboardMetrics: DashboardMetrics = {
  totalPatients: 1250, // Total patients ever treated (lifetime total)
  activePatients: mockPatients.filter(p => p.status !== 'Stable').length,
  criticalCases: mockPatients.filter(p => p.status === 'Critical').length,
  averageHeartRate: 75,
  averageBloodPressure: '120/80',
  commonConditions: [
    { condition: 'Hypertension', count: 2 },
    { condition: 'Diabetes', count: 2 },
    { condition: 'Heart Disease', count: 1 },
    { condition: 'Asthma', count: 1 }
  ],
  lifetimePatients: 1250, // Total patients ever treated (same as totalPatients)
  currentPatients: mockPatients.filter(p => p.isCurrentPatient).length,
  recoveredPatients: mockPatients.filter(p => p.status === 'Recovered').length,
  dischargedPatients: mockPatients.filter(p => p.status === 'Discharged').length
};

// Mock Doctor Stats
export const mockDoctorStats: DoctorStats = {
  totalPatientsTreated: 1250, // Total patients ever treated (lifetime total)
  currentPatients: mockPatients.filter(p => p.isCurrentPatient).length,
  patientsInRecovery: mockPatients.filter(p => p.status === 'Recovery').length,
  patientsDischarged: mockPatients.filter(p => p.status === 'Discharged').length,
  patientsRecovered: mockPatients.filter(p => p.status === 'Recovered').length,
  averageTreatmentDuration: 45, // days
  successRate: 94.2, // percentage
  yearsOfPractice: 8
};