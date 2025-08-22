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
  },
  // Additional Current Patients
  {
    id: '11',
    name: 'Maria Garcia',
    age: 34,
    gender: 'Female',
    condition: 'Pregnancy - High Risk',
    status: 'Monitoring',
    lastVisit: '2024-01-17',
    admissionDate: '2024-01-10',
    treatmentStartDate: '2024-01-10',
    isCurrentPatient: true,
    treatmentNotes: 'High-risk pregnancy due to gestational diabetes. Weekly monitoring required.',
    contactInfo: {
      phone: '(555) 123-7890',
      email: 'maria.garcia@email.com',
      address: '555 Birch St, City, State 12345'
    },
    vitals: [],
    medicalHistory: [
      {
        id: '8',
        condition: 'Gestational Diabetes',
        diagnosedDate: '2024-01-10',
        severity: 'Moderate',
        status: 'Active',
        notes: 'Developed during pregnancy. Blood sugar monitoring required.'
      }
    ],
    medications: [
      {
        id: '9',
        name: 'Insulin NPH',
        dosage: '12 units',
        frequency: 'Twice daily',
        startDate: '2024-01-10',
        prescribedBy: 'Dr. Smith',
        status: 'Active',
        notes: 'Pregnancy-safe insulin. Monitor blood sugar levels.'
      }
    ],
    testResults: [
      {
        id: '8',
        testName: 'Glucose Tolerance Test',
        testType: 'Blood Test',
        date: '2024-01-17',
        result: 'Fasting: 95 mg/dL, 2hr: 165 mg/dL',
        normalRange: 'Fasting: <95 mg/dL, 2hr: <140 mg/dL',
        status: 'Abnormal',
        orderedBy: 'Dr. Smith',
        notes: 'Gestational diabetes confirmed. Dietary modifications recommended.'
      }
    ],
    allergies: ['None known'],
    emergencyContact: {
      name: 'Carlos Garcia',
      relationship: 'Husband',
      phone: '(555) 123-7891'
    }
  },
  {
    id: '12',
    name: 'John Anderson',
    age: 52,
    gender: 'Male',
    condition: 'Prostate Cancer',
    status: 'Recovery',
    lastVisit: '2024-01-16',
    admissionDate: '2023-11-15',
    treatmentStartDate: '2023-11-15',
    isCurrentPatient: true,
    treatmentNotes: 'Post-prostatectomy recovery. PSA levels decreasing. Good prognosis.',
    contactInfo: {
      phone: '(555) 234-8901',
      email: 'john.anderson@email.com',
      address: '666 Willow St, City, State 12345'
    },
    vitals: [],
    medicalHistory: [
      {
        id: '9',
        condition: 'Prostate Cancer',
        diagnosedDate: '2023-10-20',
        severity: 'Moderate',
        status: 'Active',
        notes: 'Stage 2 prostate cancer. Radical prostatectomy performed.'
      }
    ],
    medications: [
      {
        id: '10',
        name: 'Tamsulosin',
        dosage: '0.4mg',
        frequency: 'Once daily',
        startDate: '2023-11-15',
        prescribedBy: 'Dr. Johnson',
        status: 'Active',
        notes: 'For urinary symptoms post-surgery'
      }
    ],
    testResults: [
      {
        id: '9',
        testName: 'PSA Test',
        testType: 'Blood Test',
        date: '2024-01-16',
        result: '0.8 ng/mL',
        normalRange: '<4.0 ng/mL',
        status: 'Normal',
        orderedBy: 'Dr. Johnson',
        notes: 'Significant decrease from pre-surgery levels. Excellent response to treatment.'
      }
    ],
    allergies: ['None known'],
    emergencyContact: {
      name: 'Linda Anderson',
      relationship: 'Wife',
      phone: '(555) 234-8902'
    }
  },
  {
    id: '13',
    name: 'Sophie Chen',
    age: 28,
    gender: 'Female',
    condition: 'Depression & Anxiety',
    status: 'Stable',
    lastVisit: '2024-01-15',
    admissionDate: '2023-06-01',
    treatmentStartDate: '2023-06-01',
    isCurrentPatient: true,
    treatmentNotes: 'Responding well to combination therapy. Mood significantly improved.',
    contactInfo: {
      phone: '(555) 345-9012',
      email: 'sophie.chen@email.com',
      address: '777 Spruce St, City, State 12345'
    },
    vitals: [],
    medicalHistory: [
      {
        id: '10',
        condition: 'Major Depressive Disorder',
        diagnosedDate: '2023-06-01',
        severity: 'Moderate',
        status: 'Active',
        notes: 'Depression with anxiety symptoms. Responding well to treatment.'
      }
    ],
    medications: [
      {
        id: '11',
        name: 'Sertraline',
        dosage: '100mg',
        frequency: 'Once daily',
        startDate: '2023-06-01',
        prescribedBy: 'Dr. Williams',
        status: 'Active',
        notes: 'SSRI for depression. Take in the morning.'
      },
      {
        id: '12',
        name: 'Buspirone',
        dosage: '15mg',
        frequency: 'Twice daily',
        startDate: '2023-07-15',
        prescribedBy: 'Dr. Williams',
        status: 'Active',
        notes: 'For anxiety symptoms. Take with food.'
      }
    ],
    testResults: [
      {
        id: '10',
        testName: 'PHQ-9 Depression Screening',
        testType: 'Other',
        date: '2024-01-15',
        result: 'Score: 8 (Mild depression)',
        normalRange: '0-4 (Minimal depression)',
        status: 'Normal',
        orderedBy: 'Dr. Williams',
        notes: 'Significant improvement from baseline score of 18. Treatment effective.'
      }
    ],
    allergies: ['None known'],
    emergencyContact: {
      name: 'David Chen',
      relationship: 'Brother',
      phone: '(555) 345-9013'
    }
  },
  {
    id: '14',
    name: 'Robert Martinez',
    age: 71,
    gender: 'Male',
    condition: 'Chronic Kidney Disease',
    status: 'Critical',
    lastVisit: '2024-01-18',
    admissionDate: '2024-01-15',
    treatmentStartDate: '2024-01-15',
    isCurrentPatient: true,
    treatmentNotes: 'Stage 4 CKD. Dialysis may be required soon. Monitoring kidney function closely.',
    contactInfo: {
      phone: '(555) 456-0123',
      email: 'robert.martinez@email.com',
      address: '888 Oak St, City, State 12345'
    },
    vitals: [],
    medicalHistory: [
      {
        id: '11',
        condition: 'Chronic Kidney Disease',
        diagnosedDate: '2022-03-10',
        severity: 'Severe',
        status: 'Active',
        notes: 'Stage 4 CKD. Progressive decline in kidney function.'
      },
      {
        id: '12',
        condition: 'Hypertension',
        diagnosedDate: '2018-05-15',
        severity: 'Moderate',
        status: 'Chronic',
        notes: 'Contributing factor to kidney disease.'
      }
    ],
    medications: [
      {
        id: '13',
        name: 'Furosemide',
        dosage: '40mg',
        frequency: 'Twice daily',
        startDate: '2022-03-10',
        prescribedBy: 'Dr. Brown',
        status: 'Active',
        notes: 'Diuretic for fluid management'
      },
      {
        id: '14',
        name: 'Amlodipine',
        dosage: '10mg',
        frequency: 'Once daily',
        startDate: '2018-05-15',
        prescribedBy: 'Dr. Brown',
        status: 'Active',
        notes: 'Blood pressure control'
      }
    ],
    testResults: [
      {
        id: '11',
        testName: 'Creatinine Clearance',
        testType: 'Blood Test',
        date: '2024-01-18',
        result: 'GFR: 18 mL/min/1.73m²',
        normalRange: '>90 mL/min/1.73m²',
        status: 'Critical',
        orderedBy: 'Dr. Brown',
        notes: 'Severe kidney dysfunction. Consider dialysis evaluation.'
      }
    ],
    allergies: ['None known'],
    emergencyContact: {
      name: 'Elena Martinez',
      relationship: 'Wife',
      phone: '(555) 456-0124'
    }
  },
  {
    id: '15',
    name: 'Jennifer Taylor',
    age: 39,
    gender: 'Female',
    condition: 'Multiple Sclerosis',
    status: 'Monitoring',
    lastVisit: '2024-01-14',
    admissionDate: '2021-08-20',
    treatmentStartDate: '2021-08-20',
    isCurrentPatient: true,
    treatmentNotes: 'Relapsing-remitting MS. Currently stable on disease-modifying therapy.',
    contactInfo: {
      phone: '(555) 567-1234',
      email: 'jennifer.taylor@email.com',
      address: '999 Pine St, City, State 12345'
    },
    vitals: [],
    medicalHistory: [
      {
        id: '13',
        condition: 'Multiple Sclerosis',
        diagnosedDate: '2021-08-20',
        severity: 'Moderate',
        status: 'Active',
        notes: 'Relapsing-remitting MS. Responding well to treatment.'
      }
    ],
    medications: [
      {
        id: '15',
        name: 'Ocrelizumab',
        dosage: '600mg',
        frequency: 'Every 6 months',
        startDate: '2021-08-20',
        prescribedBy: 'Dr. Davis',
        status: 'Active',
        notes: 'Disease-modifying therapy. IV infusion.'
      }
    ],
    testResults: [
      {
        id: '12',
        testName: 'MRI Brain',
        testType: 'Imaging',
        date: '2024-01-14',
        result: 'No new lesions detected',
        status: 'Normal',
        orderedBy: 'Dr. Davis',
        notes: 'Stable disease. No new MS lesions compared to previous scan.'
      }
    ],
    allergies: ['None known'],
    emergencyContact: {
      name: 'Michael Taylor',
      relationship: 'Husband',
      phone: '(555) 567-1235'
    }
  },
  // Additional Historical Patients
  {
    id: '16',
    name: 'William Johnson',
    age: 58,
    gender: 'Male',
    condition: 'Colon Cancer',
    status: 'Recovered',
    lastVisit: '2023-08-20',
    admissionDate: '2023-05-10',
    dischargeDate: '2023-08-20',
    treatmentStartDate: '2023-05-10',
    isCurrentPatient: false,
    treatmentNotes: 'Stage 1 colon cancer. Colectomy successful. No chemotherapy required.',
    contactInfo: {
      phone: '(555) 678-2345',
      email: 'william.johnson@email.com',
      address: '111 Cedar St, City, State 12345'
    },
    vitals: [],
    medicalHistory: [],
    medications: [],
    testResults: [],
    allergies: ['None known'],
    emergencyContact: {
      name: 'Margaret Johnson',
      relationship: 'Wife',
      phone: '(555) 678-2346'
    }
  },
  {
    id: '17',
    name: 'Patricia Lee',
    age: 45,
    gender: 'Female',
    condition: 'Breast Cancer',
    status: 'Recovered',
    lastVisit: '2023-07-15',
    admissionDate: '2023-02-01',
    dischargeDate: '2023-07-15',
    treatmentStartDate: '2023-02-01',
    isCurrentPatient: false,
    treatmentNotes: 'Stage 2 breast cancer. Lumpectomy, radiation, and chemotherapy completed successfully.',
    contactInfo: {
      phone: '(555) 789-3456',
      email: 'patricia.lee@email.com',
      address: '222 Maple St, City, State 12345'
    },
    vitals: [],
    medicalHistory: [],
    medications: [],
    testResults: [],
    allergies: ['None known'],
    emergencyContact: {
      name: 'Thomas Lee',
      relationship: 'Husband',
      phone: '(555) 789-3457'
    }
  },
  {
    id: '18',
    name: 'Richard Brown',
    age: 63,
    gender: 'Male',
    condition: 'Stroke',
    status: 'Discharged',
    lastVisit: '2023-10-10',
    admissionDate: '2023-09-15',
    dischargeDate: '2023-10-10',
    treatmentStartDate: '2023-09-15',
    isCurrentPatient: false,
    treatmentNotes: 'Ischemic stroke. Rehabilitation completed. Good recovery with minimal deficits.',
    contactInfo: {
      phone: '(555) 890-4567',
      email: 'richard.brown@email.com',
      address: '333 Elm St, City, State 12345'
    },
    vitals: [],
    medicalHistory: [],
    medications: [],
    testResults: [],
    allergies: ['None known'],
    emergencyContact: {
      name: 'Susan Brown',
      relationship: 'Wife',
      phone: '(555) 890-4568'
    }
  },
  {
    id: '19',
    name: 'Nancy Davis',
    age: 49,
    gender: 'Female',
    condition: 'Ovarian Cancer',
    status: 'Recovered',
    lastVisit: '2023-06-25',
    admissionDate: '2023-01-20',
    dischargeDate: '2023-06-25',
    treatmentStartDate: '2023-01-20',
    isCurrentPatient: false,
    treatmentNotes: 'Stage 1 ovarian cancer. Hysterectomy and chemotherapy completed. No recurrence.',
    contactInfo: {
      phone: '(555) 901-5678',
      email: 'nancy.davis@email.com',
      address: '444 Birch St, City, State 12345'
    },
    vitals: [],
    medicalHistory: [],
    medications: [],
    testResults: [],
    allergies: ['None known'],
    emergencyContact: {
      name: 'James Davis',
      relationship: 'Husband',
      phone: '(555) 901-5679'
    }
  },
  {
    id: '20',
    name: 'George Wilson',
    age: 72,
    gender: 'Male',
    condition: 'Lung Cancer',
    status: 'Discharged',
    lastVisit: '2023-11-30',
    admissionDate: '2023-08-10',
    dischargeDate: '2023-11-30',
    treatmentStartDate: '2023-08-10',
    isCurrentPatient: false,
    treatmentNotes: 'Stage 3 lung cancer. Lobectomy and chemotherapy completed. Follow-up monitoring required.',
    contactInfo: {
      phone: '(555) 012-6789',
      email: 'george.wilson@email.com',
      address: '555 Willow St, City, State 12345'
    },
    vitals: [],
    medicalHistory: [],
    medications: [],
    testResults: [],
    allergies: ['None known'],
    emergencyContact: {
      name: 'Helen Wilson',
      relationship: 'Wife',
      phone: '(555) 012-6790'
    }
  },
  // Additional Current Patients - Batch 2
  {
    id: '21',
    name: 'Alex Thompson',
    age: 25,
    gender: 'Male',
    condition: 'Type 1 Diabetes',
    status: 'Monitoring',
    lastVisit: '2024-01-19',
    admissionDate: '2020-03-15',
    treatmentStartDate: '2020-03-15',
    isCurrentPatient: true,
    treatmentNotes: 'Well-controlled diabetes with insulin pump. HbA1c in target range.',
    contactInfo: {
      phone: '(555) 123-8901',
      email: 'alex.thompson@email.com',
      address: '666 Spruce St, City, State 12345'
    },
    vitals: [],
    medicalHistory: [
      {
        id: '14',
        condition: 'Type 1 Diabetes',
        diagnosedDate: '2020-03-15',
        severity: 'Severe',
        status: 'Chronic',
        notes: 'Autoimmune diabetes. Using insulin pump for better control.'
      }
    ],
    medications: [
      {
        id: '16',
        name: 'Insulin Pump Therapy',
        dosage: 'Variable',
        frequency: 'Continuous',
        startDate: '2020-03-15',
        prescribedBy: 'Dr. Martinez',
        status: 'Active',
        notes: 'Automated insulin delivery system'
      }
    ],
    testResults: [
      {
        id: '13',
        testName: 'HbA1c',
        testType: 'Blood Test',
        date: '2024-01-19',
        result: '6.2%',
        normalRange: '<7.0%',
        status: 'Normal',
        orderedBy: 'Dr. Martinez',
        notes: 'Excellent glycemic control with pump therapy'
      }
    ],
    allergies: ['None known'],
    emergencyContact: {
      name: 'Rachel Thompson',
      relationship: 'Sister',
      phone: '(555) 123-8902'
    }
  },
  {
    id: '22',
    name: 'Isabella Rodriguez',
    age: 19,
    gender: 'Female',
    condition: 'Anorexia Nervosa',
    status: 'Critical',
    lastVisit: '2024-01-20',
    admissionDate: '2024-01-18',
    treatmentStartDate: '2024-01-18',
    isCurrentPatient: true,
    treatmentNotes: 'Severe malnutrition. Requires intensive psychiatric and nutritional support.',
    contactInfo: {
      phone: '(555) 234-9012',
      email: 'isabella.rodriguez@email.com',
      address: '777 Cedar St, City, State 12345'
    },
    vitals: [],
    medicalHistory: [
      {
        id: '15',
        condition: 'Anorexia Nervosa',
        diagnosedDate: '2024-01-18',
        severity: 'Severe',
        status: 'Active',
        notes: 'Eating disorder with severe weight loss and malnutrition.'
      }
    ],
    medications: [
      {
        id: '17',
        name: 'Multivitamin',
        dosage: '1 tablet',
        frequency: 'Once daily',
        startDate: '2024-01-18',
        prescribedBy: 'Dr. Williams',
        status: 'Active',
        notes: 'Nutritional supplementation'
      }
    ],
    testResults: [
      {
        id: '14',
        testName: 'Complete Blood Count',
        testType: 'Blood Test',
        date: '2024-01-20',
        result: 'Hemoglobin: 8.2 g/dL',
        normalRange: '12.0-15.5 g/dL',
        status: 'Critical',
        orderedBy: 'Dr. Williams',
        notes: 'Severe anemia due to malnutrition'
      }
    ],
    allergies: ['None known'],
    emergencyContact: {
      name: 'Maria Rodriguez',
      relationship: 'Mother',
      phone: '(555) 234-9013'
    }
  },
  {
    id: '23',
    name: 'Marcus Johnson',
    age: 44,
    gender: 'Male',
    condition: 'HIV/AIDS',
    status: 'Stable',
    lastVisit: '2024-01-18',
    admissionDate: '2018-09-10',
    treatmentStartDate: '2018-09-10',
    isCurrentPatient: true,
    treatmentNotes: 'Well-controlled HIV with undetectable viral load. CD4 count stable.',
    contactInfo: {
      phone: '(555) 345-0123',
      email: 'marcus.johnson@email.com',
      address: '888 Birch St, City, State 12345'
    },
    vitals: [],
    medicalHistory: [
      {
        id: '16',
        condition: 'HIV/AIDS',
        diagnosedDate: '2018-09-10',
        severity: 'Moderate',
        status: 'Chronic',
        notes: 'HIV positive. Responding well to antiretroviral therapy.'
      }
    ],
    medications: [
      {
        id: '18',
        name: 'Biktarvy',
        dosage: '1 tablet',
        frequency: 'Once daily',
        startDate: '2018-09-10',
        prescribedBy: 'Dr. Brown',
        status: 'Active',
        notes: 'Combination antiretroviral therapy'
      }
    ],
    testResults: [
      {
        id: '15',
        testName: 'HIV Viral Load',
        testType: 'Blood Test',
        date: '2024-01-18',
        result: '<20 copies/mL',
        normalRange: '<20 copies/mL',
        status: 'Normal',
        orderedBy: 'Dr. Brown',
        notes: 'Undetectable viral load. Excellent response to treatment'
      }
    ],
    allergies: ['None known'],
    emergencyContact: {
      name: 'Kevin Johnson',
      relationship: 'Partner',
      phone: '(555) 345-0124'
    }
  },
  {
    id: '24',
    name: 'Emma Wilson',
    age: 31,
    gender: 'Female',
    condition: 'Rheumatoid Arthritis',
    status: 'Monitoring',
    lastVisit: '2024-01-17',
    admissionDate: '2021-12-05',
    treatmentStartDate: '2021-12-05',
    isCurrentPatient: true,
    treatmentNotes: 'Moderate RA with joint inflammation. Biologic therapy showing good response.',
    contactInfo: {
      phone: '(555) 456-1234',
      email: 'emma.wilson@email.com',
      address: '999 Maple St, City, State 12345'
    },
    vitals: [],
    medicalHistory: [
      {
        id: '17',
        condition: 'Rheumatoid Arthritis',
        diagnosedDate: '2021-12-05',
        severity: 'Moderate',
        status: 'Active',
        notes: 'Autoimmune arthritis affecting multiple joints.'
      }
    ],
    medications: [
      {
        id: '19',
        name: 'Methotrexate',
        dosage: '15mg',
        frequency: 'Once weekly',
        startDate: '2021-12-05',
        prescribedBy: 'Dr. Davis',
        status: 'Active',
        notes: 'Disease-modifying antirheumatic drug'
      },
      {
        id: '20',
        name: 'Adalimumab',
        dosage: '40mg',
        frequency: 'Every 2 weeks',
        startDate: '2022-03-15',
        prescribedBy: 'Dr. Davis',
        status: 'Active',
        notes: 'Biologic therapy injection'
      }
    ],
    testResults: [
      {
        id: '16',
        testName: 'Rheumatoid Factor',
        testType: 'Blood Test',
        date: '2024-01-17',
        result: '45 IU/mL',
        normalRange: '<14 IU/mL',
        status: 'Abnormal',
        orderedBy: 'Dr. Davis',
        notes: 'Elevated but improved from baseline of 120 IU/mL'
      }
    ],
    allergies: ['None known'],
    emergencyContact: {
      name: 'Daniel Wilson',
      relationship: 'Husband',
      phone: '(555) 456-1235'
    }
  },
  {
    id: '25',
    name: 'Carlos Mendez',
    age: 56,
    gender: 'Male',
    condition: 'Liver Cirrhosis',
    status: 'Critical',
    lastVisit: '2024-01-19',
    admissionDate: '2023-05-20',
    treatmentStartDate: '2023-05-20',
    isCurrentPatient: true,
    treatmentNotes: 'Decompensated cirrhosis with ascites. Monitoring for liver transplant candidacy.',
    contactInfo: {
      phone: '(555) 567-2345',
      email: 'carlos.mendez@email.com',
      address: '111 Pine St, City, State 12345'
    },
    vitals: [],
    medicalHistory: [
      {
        id: '18',
        condition: 'Liver Cirrhosis',
        diagnosedDate: '2023-05-20',
        severity: 'Severe',
        status: 'Active',
        notes: 'End-stage liver disease. Alcoholic cirrhosis.'
      }
    ],
    medications: [
      {
        id: '21',
        name: 'Spironolactone',
        dosage: '100mg',
        frequency: 'Once daily',
        startDate: '2023-05-20',
        prescribedBy: 'Dr. Johnson',
        status: 'Active',
        notes: 'Diuretic for ascites management'
      },
      {
        id: '22',
        name: 'Lactulose',
        dosage: '30ml',
        frequency: 'Twice daily',
        startDate: '2023-05-20',
        prescribedBy: 'Dr. Johnson',
        status: 'Active',
        notes: 'For hepatic encephalopathy prevention'
      }
    ],
    testResults: [
      {
        id: '17',
        testName: 'Liver Function Panel',
        testType: 'Blood Test',
        date: '2024-01-19',
        result: 'Bilirubin: 4.2 mg/dL, Albumin: 2.1 g/dL',
        normalRange: 'Bilirubin: <1.2 mg/dL, Albumin: 3.4-5.4 g/dL',
        status: 'Critical',
        orderedBy: 'Dr. Johnson',
        notes: 'Severe liver dysfunction. MELD score: 25'
      }
    ],
    allergies: ['None known'],
    emergencyContact: {
      name: 'Ana Mendez',
      relationship: 'Wife',
      phone: '(555) 567-2346'
    }
  },
  // Additional Historical Patients - Batch 2
  {
    id: '26',
    name: 'Dorothy Smith',
    age: 78,
    gender: 'Female',
    condition: 'Hip Replacement',
    status: 'Discharged',
    lastVisit: '2023-12-15',
    admissionDate: '2023-11-20',
    dischargeDate: '2023-12-15',
    treatmentStartDate: '2023-11-20',
    isCurrentPatient: false,
    treatmentNotes: 'Total hip replacement successful. Physical therapy completed. Good mobility restored.',
    contactInfo: {
      phone: '(555) 678-3456',
      email: 'dorothy.smith@email.com',
      address: '222 Willow St, City, State 12345'
    },
    vitals: [],
    medicalHistory: [],
    medications: [],
    testResults: [],
    allergies: ['None known'],
    emergencyContact: {
      name: 'Robert Smith',
      relationship: 'Son',
      phone: '(555) 678-3457'
    }
  },
  {
    id: '27',
    name: 'Frank Miller',
    age: 65,
    gender: 'Male',
    condition: 'Heart Attack',
    status: 'Recovered',
    lastVisit: '2023-09-30',
    admissionDate: '2023-08-15',
    dischargeDate: '2023-09-30',
    treatmentStartDate: '2023-08-15',
    isCurrentPatient: false,
    treatmentNotes: 'STEMI treated with angioplasty and stent. Cardiac rehabilitation completed.',
    contactInfo: {
      phone: '(555) 789-4567',
      email: 'frank.miller@email.com',
      address: '333 Elm St, City, State 12345'
    },
    vitals: [],
    medicalHistory: [],
    medications: [],
    testResults: [],
    allergies: ['None known'],
    emergencyContact: {
      name: 'Betty Miller',
      relationship: 'Wife',
      phone: '(555) 789-4568'
    }
  },
  {
    id: '28',
    name: 'Grace Taylor',
    age: 42,
    gender: 'Female',
    condition: 'Thyroid Cancer',
    status: 'Recovered',
    lastVisit: '2023-07-20',
    admissionDate: '2023-04-10',
    dischargeDate: '2023-07-20',
    treatmentStartDate: '2023-04-10',
    isCurrentPatient: false,
    treatmentNotes: 'Papillary thyroid cancer. Total thyroidectomy and radioactive iodine treatment completed.',
    contactInfo: {
      phone: '(555) 890-5678',
      email: 'grace.taylor@email.com',
      address: '444 Cedar St, City, State 12345'
    },
    vitals: [],
    medicalHistory: [],
    medications: [],
    testResults: [],
    allergies: ['None known'],
    emergencyContact: {
      name: 'Paul Taylor',
      relationship: 'Husband',
      phone: '(555) 890-5679'
    }
  },
  {
    id: '29',
    name: 'Henry Davis',
    age: 59,
    gender: 'Male',
    condition: 'Pancreatitis',
    status: 'Discharged',
    lastVisit: '2023-06-10',
    admissionDate: '2023-05-25',
    dischargeDate: '2023-06-10',
    treatmentStartDate: '2023-05-25',
    isCurrentPatient: false,
    treatmentNotes: 'Acute pancreatitis due to gallstones. Cholecystectomy performed. Recovery complete.',
    contactInfo: {
      phone: '(555) 901-6789',
      email: 'henry.davis@email.com',
      address: '555 Spruce St, City, State 12345'
    },
    vitals: [],
    medicalHistory: [],
    medications: [],
    testResults: [],
    allergies: ['None known'],
    emergencyContact: {
      name: 'Martha Davis',
      relationship: 'Wife',
      phone: '(555) 901-6790'
    }
  },
  {
    id: '30',
    name: 'Irene White',
    age: 51,
    gender: 'Female',
    condition: 'Uterine Fibroids',
    status: 'Recovered',
    lastVisit: '2023-05-15',
    admissionDate: '2023-03-01',
    dischargeDate: '2023-05-15',
    treatmentStartDate: '2023-03-01',
    isCurrentPatient: false,
    treatmentNotes: 'Large fibroids causing heavy bleeding. Hysterectomy performed. Recovery uneventful.',
    contactInfo: {
      phone: '(555) 012-7890',
      email: 'irene.white@email.com',
      address: '666 Birch St, City, State 12345'
    },
    vitals: [],
    medicalHistory: [],
    medications: [],
    testResults: [],
    allergies: ['None known'],
    emergencyContact: {
      name: 'John White',
      relationship: 'Husband',
      phone: '(555) 012-7891'
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