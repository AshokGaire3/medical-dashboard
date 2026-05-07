using MedicalDashboard.Api.Auth;
using MedicalDashboard.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace MedicalDashboard.Api.Data;

public static class DbSeeder
{
    public static async Task SeedAsync(MedicalContext context, IServiceProvider services)
    {
        await SeedUsersAsync(context, services);

        if (await context.Patients.AnyAsync())
        {
            await SeedAppointmentsAsync(context);
            return;
        }

        // Create sample patients
        var patients = new List<Patient>
        {
            new Patient
            {
                Name = "Sarah Johnson",
                Age = 45,
                Gender = "Female",
                Condition = "Hypertension",
                Status = "Stable",
                LastVisit = DateTime.Parse("2024-01-15"),
                AdmissionDate = DateTime.Parse("2023-06-15"),
                TreatmentStartDate = DateTime.Parse("2023-06-15"),
                IsCurrentPatient = true,
                TreatmentNotes = "Responding well to medication. BP controlled.",
                ContactPhone = "(555) 123-4567",
                ContactEmail = "sarah.johnson@email.com",
                ContactAddress = "123 Main St, City, State 12345",
                EmergencyContactName = "John Johnson",
                EmergencyContactRelationship = "Spouse",
                EmergencyContactPhone = "(555) 123-4568",
                AllergiesJson = "[\"Penicillin\", \"Shellfish\"]",
                Vitals = new List<Vital>
                {
                    new Vital
                    {
                        Timestamp = DateTime.Now.AddHours(-2),
                        HeartRate = 72,
                        BloodPressureSystemic = 120,
                        BloodPressureDiastolic = 80,
                        Temperature = 98.6,
                        OxygenSaturation = 98,
                        RespiratoryRate = 16
                    },
                    new Vital
                    {
                        Timestamp = DateTime.Now.AddHours(-4),
                        HeartRate = 75,
                        BloodPressureSystemic = 118,
                        BloodPressureDiastolic = 78,
                        Temperature = 98.7,
                        OxygenSaturation = 98,
                        RespiratoryRate = 15
                    }
                },
                MedicalHistory = new List<MedicalCondition>
                {
                    new MedicalCondition
                    {
                        Condition = "Hypertension",
                        DiagnosedDate = DateTime.Parse("2022-03-15"),
                        Severity = "Moderate",
                        Status = "Chronic",
                        Notes = "Well controlled with medication. Regular monitoring required."
                    },
                    new MedicalCondition
                    {
                        Condition = "High Cholesterol",
                        DiagnosedDate = DateTime.Parse("2023-01-10"),
                        Severity = "Mild",
                        Status = "Active",
                        Notes = "Responding well to dietary changes and medication."
                    }
                },
                Medications = new List<Medication>
                {
                    new Medication
                    {
                        Name = "Lisinopril",
                        Dosage = "10mg",
                        Frequency = "Once daily",
                        StartDate = DateTime.Parse("2022-03-15"),
                        PrescribedBy = "Dr. Smith",
                        Status = "Active",
                        Notes = "Take in the morning with food"
                    },
                    new Medication
                    {
                        Name = "Atorvastatin",
                        Dosage = "20mg",
                        Frequency = "Once daily",
                        StartDate = DateTime.Parse("2023-01-10"),
                        PrescribedBy = "Dr. Smith",
                        Status = "Active",
                        Notes = "Take at bedtime"
                    }
                },
                TestResults = new List<TestResult>
                {
                    new TestResult
                    {
                        TestName = "Complete Blood Count",
                        TestType = "Blood Test",
                        Date = DateTime.Parse("2024-01-15"),
                        Result = "Normal",
                        NormalRange = "WBC: 4.5-11.0, RBC: 4.2-5.4",
                        Status = "Normal",
                        OrderedBy = "Dr. Smith"
                    },
                    new TestResult
                    {
                        TestName = "Lipid Panel",
                        TestType = "Blood Test",
                        Date = DateTime.Parse("2024-01-15"),
                        Result = "Total Cholesterol: 185 mg/dL",
                        NormalRange = "<200 mg/dL",
                        Status = "Normal",
                        OrderedBy = "Dr. Smith",
                        Notes = "Significant improvement from previous test"
                    }
                }
            },
            new Patient
            {
                Name = "Michael Chen",
                Age = 38,
                Gender = "Male",
                Condition = "Diabetes Type 2",
                Status = "Monitoring",
                LastVisit = DateTime.Parse("2024-01-14"),
                AdmissionDate = DateTime.Parse("2023-08-20"),
                TreatmentStartDate = DateTime.Parse("2023-08-20"),
                IsCurrentPatient = true,
                TreatmentNotes = "Blood sugar levels improving. Continue monitoring.",
                ContactPhone = "(555) 234-5678",
                ContactEmail = "michael.chen@email.com",
                ContactAddress = "456 Oak Ave, City, State 12345",
                EmergencyContactName = "Lisa Chen",
                EmergencyContactRelationship = "Spouse",
                EmergencyContactPhone = "(555) 234-5679",
                AllergiesJson = "[]",
                Vitals = new List<Vital>
                {
                    new Vital
                    {
                        Timestamp = DateTime.Now.AddHours(-1),
                        HeartRate = 78,
                        BloodPressureSystemic = 125,
                        BloodPressureDiastolic = 82,
                        Temperature = 98.5,
                        OxygenSaturation = 99,
                        RespiratoryRate = 17
                    }
                },
                MedicalHistory = new List<MedicalCondition>
                {
                    new MedicalCondition
                    {
                        Condition = "Diabetes Type 2",
                        DiagnosedDate = DateTime.Parse("2023-08-20"),
                        Severity = "Moderate",
                        Status = "Active",
                        Notes = "Managing with medication and diet."
                    }
                },
                Medications = new List<Medication>
                {
                    new Medication
                    {
                        Name = "Metformin",
                        Dosage = "500mg",
                        Frequency = "Twice daily",
                        StartDate = DateTime.Parse("2023-08-20"),
                        PrescribedBy = "Dr. Smith",
                        Status = "Active"
                    }
                }
            },
            new Patient
            {
                Name = "Emily Rodriguez",
                Age = 52,
                Gender = "Female",
                Condition = "Asthma",
                Status = "Critical",
                LastVisit = DateTime.Parse("2024-01-13"),
                AdmissionDate = DateTime.Parse("2024-01-13"),
                TreatmentStartDate = DateTime.Parse("2024-01-13"),
                IsCurrentPatient = true,
                TreatmentNotes = "Severe asthma exacerbation. Requires immediate attention.",
                ContactPhone = "(555) 345-6789",
                ContactEmail = "emily.rodriguez@email.com",
                ContactAddress = "789 Pine St, City, State 12345",
                EmergencyContactName = "Carlos Rodriguez",
                EmergencyContactRelationship = "Husband",
                EmergencyContactPhone = "(555) 345-6790",
                AllergiesJson = "[\"Dust\", \"Pollen\"]",
                Vitals = new List<Vital>
                {
                    new Vital
                    {
                        Timestamp = DateTime.Now.AddHours(-3),
                        HeartRate = 95,
                        BloodPressureSystemic = 140,
                        BloodPressureDiastolic = 90,
                        Temperature = 99.2,
                        OxygenSaturation = 92,
                        RespiratoryRate = 24
                    }
                },
                MedicalHistory = new List<MedicalCondition>
                {
                    new MedicalCondition
                    {
                        Condition = "Asthma",
                        DiagnosedDate = DateTime.Parse("2015-05-10"),
                        Severity = "Severe",
                        Status = "Chronic",
                        Notes = "Chronic condition requiring ongoing management."
                    }
                },
                Medications = new List<Medication>
                {
                    new Medication
                    {
                        Name = "Albuterol",
                        Dosage = "90mcg",
                        Frequency = "As needed",
                        StartDate = DateTime.Parse("2024-01-13"),
                        PrescribedBy = "Dr. Smith",
                        Status = "Active",
                        Notes = "Use during asthma attacks"
                    }
                }
            },
            new Patient
            {
                Name = "David Wilson",
                Age = 61,
                Gender = "Male",
                Condition = "Heart Disease",
                Status = "Recovery",
                LastVisit = DateTime.Parse("2024-01-12"),
                AdmissionDate = DateTime.Parse("2023-11-10"),
                TreatmentStartDate = DateTime.Parse("2023-11-10"),
                IsCurrentPatient = true,
                TreatmentNotes = "Cardiac function improving. Continue medication.",
                ContactPhone = "(555) 456-7890",
                ContactEmail = "david.wilson@email.com",
                ContactAddress = "321 Elm St, City, State 12345",
                EmergencyContactName = "Mary Wilson",
                EmergencyContactRelationship = "Wife",
                EmergencyContactPhone = "(555) 456-7891",
                AllergiesJson = "[]",
                Vitals = new List<Vital>
                {
                    new Vital
                    {
                        Timestamp = DateTime.Now.AddHours(-5),
                        HeartRate = 68,
                        BloodPressureSystemic = 115,
                        BloodPressureDiastolic = 75,
                        Temperature = 98.4,
                        OxygenSaturation = 97,
                        RespiratoryRate = 14
                    }
                },
                MedicalHistory = new List<MedicalCondition>
                {
                    new MedicalCondition
                    {
                        Condition = "Heart Disease",
                        DiagnosedDate = DateTime.Parse("2023-11-10"),
                        Severity = "Severe",
                        Status = "Active",
                        Notes = "Post-cardiac event recovery."
                    }
                },
                Medications = new List<Medication>
                {
                    new Medication
                    {
                        Name = "Aspirin",
                        Dosage = "81mg",
                        Frequency = "Once daily",
                        StartDate = DateTime.Parse("2023-11-10"),
                        PrescribedBy = "Dr. Smith",
                        Status = "Active"
                    },
                    new Medication
                    {
                        Name = "Atorvastatin",
                        Dosage = "40mg",
                        Frequency = "Once daily",
                        StartDate = DateTime.Parse("2023-11-10"),
                        PrescribedBy = "Dr. Smith",
                        Status = "Active"
                    }
                }
            },
            new Patient
            {
                Name = "Jennifer Martinez",
                Age = 34,
                Gender = "Female",
                Condition = "Hypertension",
                Status = "Stable",
                LastVisit = DateTime.Parse("2024-01-11"),
                AdmissionDate = DateTime.Parse("2023-09-05"),
                TreatmentStartDate = DateTime.Parse("2023-09-05"),
                IsCurrentPatient = true,
                TreatmentNotes = "BP well controlled. Regular follow-ups scheduled.",
                ContactPhone = "(555) 567-8901",
                ContactEmail = "jennifer.martinez@email.com",
                ContactAddress = "654 Maple Dr, City, State 12345",
                EmergencyContactName = "Robert Martinez",
                EmergencyContactRelationship = "Husband",
                EmergencyContactPhone = "(555) 567-8902",
                AllergiesJson = "[]",
                Vitals = new List<Vital>
                {
                    new Vital
                    {
                        Timestamp = DateTime.Now.AddHours(-6),
                        HeartRate = 70,
                        BloodPressureSystemic = 122,
                        BloodPressureDiastolic = 79,
                        Temperature = 98.6,
                        OxygenSaturation = 98,
                        RespiratoryRate = 16
                    }
                },
                MedicalHistory = new List<MedicalCondition>
                {
                    new MedicalCondition
                    {
                        Condition = "Hypertension",
                        DiagnosedDate = DateTime.Parse("2023-09-05"),
                        Severity = "Mild",
                        Status = "Active",
                        Notes = "Well managed with lifestyle changes and medication."
                    }
                },
                Medications = new List<Medication>
                {
                    new Medication
                    {
                        Name = "Lisinopril",
                        Dosage = "5mg",
                        Frequency = "Once daily",
                        StartDate = DateTime.Parse("2023-09-05"),
                        PrescribedBy = "Dr. Smith",
                        Status = "Active"
                    }
                }
            },
            new Patient
            {
                Name = "Robert Thompson",
                Age = 55,
                Gender = "Male",
                Condition = "Diabetes Type 2",
                Status = "Monitoring",
                LastVisit = DateTime.Parse("2024-01-10"),
                AdmissionDate = DateTime.Parse("2023-07-15"),
                TreatmentStartDate = DateTime.Parse("2023-07-15"),
                IsCurrentPatient = true,
                TreatmentNotes = "Blood sugar levels stable. Continue current treatment.",
                ContactPhone = "(555) 678-9012",
                ContactEmail = "robert.thompson@email.com",
                ContactAddress = "987 Cedar Ln, City, State 12345",
                EmergencyContactName = "Susan Thompson",
                EmergencyContactRelationship = "Wife",
                EmergencyContactPhone = "(555) 678-9013",
                AllergiesJson = "[]",
                Vitals = new List<Vital>
                {
                    new Vital
                    {
                        Timestamp = DateTime.Now.AddHours(-7),
                        HeartRate = 76,
                        BloodPressureSystemic = 128,
                        BloodPressureDiastolic = 84,
                        Temperature = 98.5,
                        OxygenSaturation = 98,
                        RespiratoryRate = 16
                    }
                },
                MedicalHistory = new List<MedicalCondition>
                {
                    new MedicalCondition
                    {
                        Condition = "Diabetes Type 2",
                        DiagnosedDate = DateTime.Parse("2023-07-15"),
                        Severity = "Moderate",
                        Status = "Active",
                        Notes = "Managing with medication and diet modifications."
                    }
                },
                Medications = new List<Medication>
                {
                    new Medication
                    {
                        Name = "Metformin",
                        Dosage = "1000mg",
                        Frequency = "Twice daily",
                        StartDate = DateTime.Parse("2023-07-15"),
                        PrescribedBy = "Dr. Smith",
                        Status = "Active"
                    }
                }
            }
        };

        patients.AddRange(BuildAdditionalPatients());

        await context.Patients.AddRangeAsync(patients);
        await context.SaveChangesAsync();

        await SeedAppointmentsAsync(context);
    }

    // Additional patients built via a compact helper so we can demo the full
    // breadth of the dashboard (varied ages, conditions, statuses, departments)
    // without exploding the seed file. Each patient gets at least one vital
    // reading, one condition, and one medication; some get test results.
    private static IEnumerable<Patient> BuildAdditionalPatients()
    {
        var now = DateTime.Now;

        yield return Build(
            name: "Patricia Williams", age: 68, gender: "Female",
            condition: "COPD", status: "Stable",
            phone: "(555) 789-0001", email: "patricia.williams@email.com",
            allergies: new[] { "Sulfa drugs" },
            admissionDaysAgo: 90,
            vital: (HR: 82, SBP: 132, DBP: 84, Temp: 98.4, SpO2: 94, RR: 20, HoursAgo: 3),
            condDetail: ("COPD", "Severe", "Chronic", "Long-term smoker; on home oxygen as needed."),
            med: ("Tiotropium", "18mcg", "Once daily", "Active", "Inhaler; rinse mouth after use."),
            test: ("Pulmonary Function Test", "Pulmonary", "FEV1: 55% predicted", "FEV1 > 80%", "Abnormal"));

        yield return Build(
            name: "James Anderson", age: 72, gender: "Male",
            condition: "Atrial Fibrillation", status: "Monitoring",
            phone: "(555) 789-0002", email: "james.anderson@email.com",
            allergies: Array.Empty<string>(),
            admissionDaysAgo: 45,
            vital: (HR: 88, SBP: 138, DBP: 82, Temp: 98.7, SpO2: 96, RR: 18, HoursAgo: 5),
            condDetail: ("Atrial Fibrillation", "Moderate", "Chronic", "Rate-controlled; on long-term anticoagulation."),
            med: ("Apixaban", "5mg", "Twice daily", "Active", "Anticoagulant — monitor for bleeding."),
            test: ("ECG", "Cardiac", "Atrial fibrillation, rate 88", "Normal sinus rhythm", "Abnormal"));

        yield return Build(
            name: "Linda Garcia", age: 29, gender: "Female",
            condition: "Asthma", status: "Stable",
            phone: "(555) 789-0003", email: "linda.garcia@email.com",
            allergies: new[] { "Pollen", "Cats" },
            admissionDaysAgo: 120,
            vital: (HR: 74, SBP: 118, DBP: 76, Temp: 98.6, SpO2: 98, RR: 16, HoursAgo: 8),
            condDetail: ("Asthma", "Mild", "Chronic", "Well-controlled with maintenance inhaler."),
            med: ("Fluticasone", "100mcg", "Twice daily", "Active", "Maintenance inhaler."),
            test: null);

        yield return Build(
            name: "Christopher Lee", age: 47, gender: "Male",
            condition: "Migraine", status: "Improving",
            phone: "(555) 789-0004", email: "christopher.lee@email.com",
            allergies: Array.Empty<string>(),
            admissionDaysAgo: 60,
            vital: (HR: 70, SBP: 120, DBP: 78, Temp: 98.5, SpO2: 99, RR: 15, HoursAgo: 12),
            condDetail: ("Chronic Migraine", "Moderate", "Active", "Frequency reduced from 12 to 4 days/month on prophylaxis."),
            med: ("Topiramate", "50mg", "Twice daily", "Active", "Prophylaxis; may cause cognitive side effects."),
            test: null);

        yield return Build(
            name: "Barbara Davis", age: 76, gender: "Female",
            condition: "Osteoporosis", status: "Stable",
            phone: "(555) 789-0005", email: "barbara.davis@email.com",
            allergies: new[] { "Latex" },
            admissionDaysAgo: 200,
            vital: (HR: 76, SBP: 128, DBP: 80, Temp: 98.4, SpO2: 97, RR: 16, HoursAgo: 10),
            condDetail: ("Osteoporosis", "Moderate", "Chronic", "Post-menopausal; one prior wrist fracture."),
            med: ("Alendronate", "70mg", "Once weekly", "Active", "Take on empty stomach with full glass of water; remain upright 30 min."),
            test: ("DEXA Scan", "Imaging", "T-score: -2.7 (lumbar spine)", "T-score > -1.0", "Abnormal"));

        yield return Build(
            name: "Daniel Brown", age: 33, gender: "Male",
            condition: "Generalized Anxiety Disorder", status: "Improving",
            phone: "(555) 789-0006", email: "daniel.brown@email.com",
            allergies: Array.Empty<string>(),
            admissionDaysAgo: 75,
            vital: (HR: 84, SBP: 122, DBP: 78, Temp: 98.6, SpO2: 99, RR: 17, HoursAgo: 6),
            condDetail: ("Generalized Anxiety Disorder", "Moderate", "Active", "Responding well to SSRI + CBT."),
            med: ("Sertraline", "100mg", "Once daily", "Active", "Take in the morning."),
            test: null);

        yield return Build(
            name: "Susan Miller", age: 58, gender: "Female",
            condition: "Hypothyroidism", status: "Stable",
            phone: "(555) 789-0007", email: "susan.miller@email.com",
            allergies: Array.Empty<string>(),
            admissionDaysAgo: 365,
            vital: (HR: 68, SBP: 124, DBP: 80, Temp: 98.2, SpO2: 98, RR: 15, HoursAgo: 14),
            condDetail: ("Hypothyroidism", "Mild", "Chronic", "TSH within target on current dose."),
            med: ("Levothyroxine", "75mcg", "Once daily", "Active", "Take 30 min before breakfast."),
            test: ("TSH", "Blood Test", "2.4 mIU/L", "0.4 - 4.0 mIU/L", "Normal"));

        yield return Build(
            name: "Mark Taylor", age: 64, gender: "Male",
            condition: "Chronic Kidney Disease Stage 3", status: "Critical",
            phone: "(555) 789-0008", email: "mark.taylor@email.com",
            allergies: new[] { "Iodinated contrast" },
            admissionDaysAgo: 14,
            vital: (HR: 92, SBP: 158, DBP: 96, Temp: 99.1, SpO2: 95, RR: 19, HoursAgo: 1),
            condDetail: ("Chronic Kidney Disease Stage 3b", "Severe", "Chronic", "Diabetic nephropathy. Nephrology following."),
            med: ("Losartan", "50mg", "Once daily", "Active", "Renoprotective; monitor potassium."),
            test: ("Creatinine", "Blood Test", "2.4 mg/dL", "0.7 - 1.3 mg/dL", "Critical"));

        yield return Build(
            name: "Steven Moore", age: 53, gender: "Male",
            condition: "GERD", status: "Stable",
            phone: "(555) 789-0009", email: "steven.moore@email.com",
            allergies: Array.Empty<string>(),
            admissionDaysAgo: 180,
            vital: (HR: 72, SBP: 126, DBP: 82, Temp: 98.5, SpO2: 98, RR: 16, HoursAgo: 9),
            condDetail: ("GERD", "Moderate", "Chronic", "Symptom control achieved on PPI."),
            med: ("Omeprazole", "40mg", "Once daily", "Active", "Take 30 min before breakfast."),
            test: null);

        yield return Build(
            name: "Nancy Jackson", age: 80, gender: "Female",
            condition: "Alzheimer's Disease", status: "Monitoring",
            phone: "(555) 789-0010", email: "nancy.jackson@email.com",
            allergies: Array.Empty<string>(),
            admissionDaysAgo: 270,
            vital: (HR: 74, SBP: 142, DBP: 86, Temp: 98.3, SpO2: 96, RR: 17, HoursAgo: 4),
            condDetail: ("Alzheimer's Disease (Mild)", "Moderate", "Chronic", "MMSE 22/30. Family caregiver support in place."),
            med: ("Donepezil", "10mg", "Once daily at bedtime", "Active", "May cause GI side effects."),
            test: ("MMSE", "Neurocognitive", "22/30", "27-30", "Abnormal"));

        yield return Build(
            name: "Kevin Clark", age: 49, gender: "Male",
            condition: "Type 1 Diabetes", status: "Monitoring",
            phone: "(555) 789-0011", email: "kevin.clark@email.com",
            allergies: Array.Empty<string>(),
            admissionDaysAgo: 3650,
            vital: (HR: 78, SBP: 130, DBP: 82, Temp: 98.5, SpO2: 98, RR: 16, HoursAgo: 7),
            condDetail: ("Type 1 Diabetes", "Severe", "Chronic", "On insulin pump; CGM in use. HbA1c 7.4%."),
            med: ("Insulin Aspart", "Variable units", "With meals (carb count)", "Active", "Pump-delivered."),
            test: ("Hemoglobin A1c", "Blood Test", "7.4%", "<7.0%", "Abnormal"));

        yield return Build(
            name: "Amanda Lewis", age: 55, gender: "Female",
            condition: "Breast Cancer (Remission)", status: "Recovery",
            phone: "(555) 789-0012", email: "amanda.lewis@email.com",
            allergies: new[] { "Codeine" },
            admissionDaysAgo: 730,
            vital: (HR: 70, SBP: 118, DBP: 76, Temp: 98.4, SpO2: 99, RR: 15, HoursAgo: 11),
            condDetail: ("Breast Cancer (Stage II, ER+)", "Severe", "Resolved", "5 years post-lumpectomy + radiation. No evidence of disease."),
            med: ("Anastrozole", "1mg", "Once daily", "Active", "Aromatase inhibitor; continue 5-year course."),
            test: ("Mammogram", "Imaging", "BI-RADS 2 (benign findings)", "BI-RADS 1-2", "Normal"));

        yield return Build(
            name: "Joseph Martin", age: 70, gender: "Male",
            condition: "Parkinson's Disease", status: "Monitoring",
            phone: "(555) 789-0013", email: "joseph.martin@email.com",
            allergies: Array.Empty<string>(),
            admissionDaysAgo: 1095,
            vital: (HR: 72, SBP: 124, DBP: 78, Temp: 98.4, SpO2: 97, RR: 16, HoursAgo: 13),
            condDetail: ("Parkinson's Disease", "Moderate", "Chronic", "Hoehn-Yahr stage 2. Tremor predominant."),
            med: ("Carbidopa-Levodopa", "25/100mg", "Three times daily", "Active", "Take 30 min before meals."),
            test: null);

        yield return Build(
            name: "Margaret Allen", age: 90, gender: "Female",
            condition: "Congestive Heart Failure", status: "Critical",
            phone: "(555) 789-0014", email: "margaret.allen@email.com",
            allergies: new[] { "Penicillin" },
            admissionDaysAgo: 5,
            vital: (HR: 102, SBP: 96, DBP: 60, Temp: 99.4, SpO2: 89, RR: 26, HoursAgo: 1),
            condDetail: ("CHF (NYHA Class III)", "Severe", "Active", "Recent admission for fluid overload. EF 30%."),
            med: ("Furosemide", "40mg", "Twice daily", "Active", "Daily weight; report >2 lb gain in 24h."),
            test: ("BNP", "Blood Test", "1240 pg/mL", "<100 pg/mL", "Critical"));

        yield return Build(
            name: "Emma Walker", age: 7, gender: "Female",
            condition: "Pediatric Asthma", status: "Stable",
            phone: "(555) 789-0015", email: "walker.family@email.com",
            allergies: new[] { "Dust mites" },
            admissionDaysAgo: 400,
            vital: (HR: 96, SBP: 102, DBP: 64, Temp: 98.7, SpO2: 98, RR: 22, HoursAgo: 2),
            condDetail: ("Pediatric Asthma", "Mild", "Chronic", "Triggered by viral URIs. Spacer technique reviewed with parents."),
            med: ("Fluticasone", "44mcg", "Twice daily", "Active", "Inhaler with spacer; rinse mouth after."),
            test: null);

        yield return Build(
            name: "Ryan Hall", age: 19, gender: "Male",
            condition: "Post-Concussion Syndrome", status: "Improving",
            phone: "(555) 789-0016", email: "ryan.hall@email.com",
            allergies: Array.Empty<string>(),
            admissionDaysAgo: 28,
            vital: (HR: 68, SBP: 116, DBP: 72, Temp: 98.4, SpO2: 99, RR: 14, HoursAgo: 5),
            condDetail: ("Mild TBI / Concussion", "Moderate", "Active", "Sport-related; gradual return-to-play protocol in progress."),
            med: ("Acetaminophen", "500mg", "Every 6h as needed", "Active", "Avoid NSAIDs in first 48h post-injury."),
            test: ("CT Head", "Imaging", "No acute intracranial findings", "Normal", "Normal"));

        yield return Build(
            name: "Olivia Young", age: 35, gender: "Female",
            condition: "Iron Deficiency Anemia", status: "Improving",
            phone: "(555) 789-0017", email: "olivia.young@email.com",
            allergies: Array.Empty<string>(),
            admissionDaysAgo: 60,
            vital: (HR: 86, SBP: 110, DBP: 68, Temp: 98.5, SpO2: 99, RR: 16, HoursAgo: 6),
            condDetail: ("Iron Deficiency Anemia", "Moderate", "Active", "Heavy menses; responding to oral iron."),
            med: ("Ferrous Sulfate", "325mg", "Twice daily", "Active", "Take with vitamin C; avoid dairy/calcium within 2h."),
            test: ("Hemoglobin", "Blood Test", "10.4 g/dL", "12.0 - 15.5 g/dL", "Abnormal"));

        yield return Build(
            name: "William King", age: 60, gender: "Male",
            condition: "Prostate Cancer (Surveillance)", status: "Monitoring",
            phone: "(555) 789-0018", email: "william.king@email.com",
            allergies: Array.Empty<string>(),
            admissionDaysAgo: 540,
            vital: (HR: 72, SBP: 128, DBP: 80, Temp: 98.4, SpO2: 98, RR: 15, HoursAgo: 9),
            condDetail: ("Prostate Cancer (Gleason 6)", "Mild", "Active", "Active surveillance. PSA stable over 18 months."),
            med: ("Tamsulosin", "0.4mg", "Once daily", "Active", "Take 30 min after the same meal each day."),
            test: ("PSA", "Blood Test", "4.1 ng/mL", "<4.0 ng/mL", "Abnormal"));

        yield return Build(
            name: "Sophia Wright", age: 24, gender: "Female",
            condition: "Polycystic Ovary Syndrome", status: "Stable",
            phone: "(555) 789-0019", email: "sophia.wright@email.com",
            allergies: Array.Empty<string>(),
            admissionDaysAgo: 200,
            vital: (HR: 78, SBP: 118, DBP: 76, Temp: 98.6, SpO2: 99, RR: 16, HoursAgo: 8),
            condDetail: ("PCOS", "Moderate", "Chronic", "Insulin resistance present; lifestyle counseling ongoing."),
            med: ("Metformin", "500mg", "Twice daily", "Active", "Take with meals to reduce GI upset."),
            test: null);

        yield return Build(
            name: "Henry Scott", age: 51, gender: "Male",
            condition: "Hyperlipidemia", status: "Stable",
            phone: "(555) 789-0020", email: "henry.scott@email.com",
            allergies: Array.Empty<string>(),
            admissionDaysAgo: 300,
            vital: (HR: 74, SBP: 130, DBP: 84, Temp: 98.5, SpO2: 98, RR: 16, HoursAgo: 11),
            condDetail: ("Hyperlipidemia", "Moderate", "Chronic", "LDL trending down on statin + dietary changes."),
            med: ("Rosuvastatin", "20mg", "Once daily at bedtime", "Active", "Report any new muscle pain."),
            test: ("Lipid Panel", "Blood Test", "LDL: 118 mg/dL, HDL: 48 mg/dL", "LDL <100, HDL >40", "Abnormal"));

        yield return Build(
            name: "Isabella Green", age: 4, gender: "Female",
            condition: "Otitis Media (Recurrent)", status: "Improving",
            phone: "(555) 789-0021", email: "green.family@email.com",
            allergies: new[] { "Amoxicillin" },
            admissionDaysAgo: 14,
            vital: (HR: 108, SBP: 96, DBP: 60, Temp: 100.2, SpO2: 98, RR: 24, HoursAgo: 2),
            condDetail: ("Recurrent Acute Otitis Media", "Moderate", "Active", "5th episode in 12 months; ENT referral pending."),
            med: ("Cefdinir", "14mg/kg", "Once daily x 10 days", "Active", "Penicillin allergy; cephalosporin selected."),
            test: null);

        yield return Build(
            name: "Lucas Adams", age: 67, gender: "Male",
            condition: "Stroke (Post-Acute)", status: "Recovery",
            phone: "(555) 789-0022", email: "lucas.adams@email.com",
            allergies: Array.Empty<string>(),
            admissionDaysAgo: 21,
            vital: (HR: 76, SBP: 134, DBP: 84, Temp: 98.6, SpO2: 97, RR: 17, HoursAgo: 3),
            condDetail: ("Ischemic Stroke (left MCA)", "Severe", "Active", "Mild right-sided weakness. PT/OT ongoing."),
            med: ("Clopidogrel", "75mg", "Once daily", "Active", "Antiplatelet for secondary prevention."),
            test: ("MRI Brain", "Imaging", "Subacute infarct, left MCA territory", "Normal", "Abnormal"));

        yield return Build(
            name: "Charlotte Baker", age: 44, gender: "Female",
            condition: "Rheumatoid Arthritis", status: "Stable",
            phone: "(555) 789-0023", email: "charlotte.baker@email.com",
            allergies: new[] { "NSAIDs (caused GI bleed 2019)" },
            admissionDaysAgo: 1825,
            vital: (HR: 72, SBP: 122, DBP: 78, Temp: 98.5, SpO2: 98, RR: 16, HoursAgo: 10),
            condDetail: ("Rheumatoid Arthritis", "Moderate", "Chronic", "DAS28 score in low remission. On biologic therapy."),
            med: ("Adalimumab", "40mg", "SC every 2 weeks", "Active", "Refrigerate; rotate injection sites."),
            test: ("CRP", "Blood Test", "4.2 mg/L", "<3.0 mg/L", "Abnormal"));

        yield return Build(
            name: "Mason Carter", age: 12, gender: "Male",
            condition: "ADHD", status: "Stable",
            phone: "(555) 789-0024", email: "carter.family@email.com",
            allergies: Array.Empty<string>(),
            admissionDaysAgo: 730,
            vital: (HR: 88, SBP: 108, DBP: 68, Temp: 98.6, SpO2: 99, RR: 18, HoursAgo: 8),
            condDetail: ("ADHD (Combined Type)", "Moderate", "Active", "School performance improved on current regimen."),
            med: ("Methylphenidate ER", "27mg", "Once daily", "Active", "Take in the morning. Monitor weight and BP."),
            test: null);

        yield return Build(
            name: "Ava Mitchell", age: 31, gender: "Female",
            condition: "Multiple Sclerosis", status: "Monitoring",
            phone: "(555) 789-0025", email: "ava.mitchell@email.com",
            allergies: Array.Empty<string>(),
            admissionDaysAgo: 1095,
            vital: (HR: 74, SBP: 116, DBP: 74, Temp: 98.5, SpO2: 99, RR: 16, HoursAgo: 7),
            condDetail: ("Relapsing-Remitting MS", "Moderate", "Active", "No relapses in 14 months on current DMT."),
            med: ("Ocrelizumab", "600mg", "IV every 6 months", "Active", "Pre-medicate with corticosteroids/antihistamine."),
            test: ("MRI Brain", "Imaging", "Stable T2 lesion burden", "Normal", "Abnormal"));

        yield return Build(
            name: "Ethan Roberts", age: 56, gender: "Male",
            condition: "Sleep Apnea", status: "Stable",
            phone: "(555) 789-0026", email: "ethan.roberts@email.com",
            allergies: Array.Empty<string>(),
            admissionDaysAgo: 450,
            vital: (HR: 76, SBP: 134, DBP: 86, Temp: 98.5, SpO2: 96, RR: 16, HoursAgo: 12),
            condDetail: ("Obstructive Sleep Apnea (Severe)", "Severe", "Chronic", "AHI 38 untreated; well-controlled on CPAP."),
            med: ("Nasal Saline", "1 spray", "Each nostril nightly", "Active", "Adjunct to CPAP for nasal congestion."),
            test: ("Polysomnography", "Pulmonary", "AHI: 5 on CPAP", "AHI <5", "Normal"));

        yield return Build(
            name: "Mia Phillips", age: 64, gender: "Female",
            condition: "Glaucoma", status: "Stable",
            phone: "(555) 789-0027", email: "mia.phillips@email.com",
            allergies: new[] { "Sulfa drugs" },
            admissionDaysAgo: 800,
            vital: (HR: 70, SBP: 126, DBP: 78, Temp: 98.4, SpO2: 98, RR: 15, HoursAgo: 9),
            condDetail: ("Primary Open-Angle Glaucoma", "Moderate", "Chronic", "Intraocular pressure controlled bilaterally."),
            med: ("Latanoprost", "0.005% drops", "1 drop each eye nightly", "Active", "May darken iris color over time."),
            test: null);

        yield return Build(
            name: "Noah Cooper", age: 41, gender: "Male",
            condition: "Hepatitis C (Cured)", status: "Stable",
            phone: "(555) 789-0028", email: "noah.cooper@email.com",
            allergies: Array.Empty<string>(),
            admissionDaysAgo: 1460,
            vital: (HR: 72, SBP: 122, DBP: 76, Temp: 98.5, SpO2: 99, RR: 16, HoursAgo: 13),
            condDetail: ("Hepatitis C (SVR achieved)", "Moderate", "Resolved", "Sustained virologic response 4 years post-DAA therapy."),
            med: ("Multivitamin", "1 tablet", "Once daily", "Active", "General health maintenance."),
            test: ("HCV RNA", "Blood Test", "Not detected", "Not detected", "Normal"));

        yield return Build(
            name: "Harper Reed", age: 22, gender: "Female",
            condition: "Eating Disorder (Recovery)", status: "Improving",
            phone: "(555) 789-0029", email: "harper.reed@email.com",
            allergies: Array.Empty<string>(),
            admissionDaysAgo: 180,
            vital: (HR: 64, SBP: 102, DBP: 64, Temp: 97.8, SpO2: 99, RR: 14, HoursAgo: 4),
            condDetail: ("Anorexia Nervosa (Recovering)", "Severe", "Active", "Weight restoration in progress. Multidisciplinary team."),
            med: ("Fluoxetine", "20mg", "Once daily", "Active", "May increase appetite slightly."),
            test: ("Electrolyte Panel", "Blood Test", "All within normal limits", "Normal", "Normal"));
    }

    // Compact patient builder used by BuildAdditionalPatients(). Keeps each
    // test record in the seed list to roughly one screen so the data is
    // easy to scan and edit.
    private static Patient Build(
        string name, int age, string gender, string condition, string status,
        string phone, string email, string[] allergies, int admissionDaysAgo,
        (int HR, int SBP, int DBP, double Temp, int SpO2, int RR, int HoursAgo) vital,
        (string Condition, string Severity, string Status, string Notes) condDetail,
        (string Name, string Dosage, string Frequency, string Status, string Notes) med,
        (string Name, string Type, string Result, string Range, string Status)? test)
    {
        var admission = DateTime.Today.AddDays(-admissionDaysAgo);
        var patient = new Patient
        {
            Name = name,
            Age = age,
            Gender = gender,
            Condition = condition,
            Status = status,
            LastVisit = DateTime.Today.AddDays(-(admissionDaysAgo % 14)),
            AdmissionDate = admission,
            TreatmentStartDate = admission,
            IsCurrentPatient = true,
            TreatmentNotes = condDetail.Notes,
            ContactPhone = phone,
            ContactEmail = email,
            ContactAddress = "City, State 12345",
            EmergencyContactName = "Emergency Contact",
            EmergencyContactRelationship = "Family",
            EmergencyContactPhone = phone,
            AllergiesJson = System.Text.Json.JsonSerializer.Serialize(allergies),
            Vitals = new List<Vital>
            {
                new Vital
                {
                    Timestamp = DateTime.Now.AddHours(-vital.HoursAgo),
                    HeartRate = vital.HR,
                    BloodPressureSystemic = vital.SBP,
                    BloodPressureDiastolic = vital.DBP,
                    Temperature = vital.Temp,
                    OxygenSaturation = vital.SpO2,
                    RespiratoryRate = vital.RR,
                },
            },
            MedicalHistory = new List<MedicalCondition>
            {
                new MedicalCondition
                {
                    Condition = condDetail.Condition,
                    DiagnosedDate = admission,
                    Severity = condDetail.Severity,
                    Status = condDetail.Status,
                    Notes = condDetail.Notes,
                },
            },
            Medications = new List<Medication>
            {
                new Medication
                {
                    Name = med.Name,
                    Dosage = med.Dosage,
                    Frequency = med.Frequency,
                    StartDate = admission,
                    PrescribedBy = "Dr. Smith",
                    Status = med.Status,
                    Notes = med.Notes,
                },
            },
        };

        if (test is not null)
        {
            patient.TestResults.Add(new TestResult
            {
                TestName = test.Value.Name,
                TestType = test.Value.Type,
                Date = DateTime.Today.AddDays(-7),
                Result = test.Value.Result,
                NormalRange = test.Value.Range,
                Status = test.Value.Status,
                OrderedBy = "Dr. Smith",
            });
        }

        return patient;
    }

    private static async Task SeedUsersAsync(MedicalContext context, IServiceProvider services)
    {
        var hasher = services.GetRequiredService<IPasswordHasher>();
        var defaultPassword = hasher.Hash("Password123!");

        var seedUsers = new[]
        {
            // Doctors — primary demo account first, then specialty staff.
            new User
            {
                Name = "Dr. Alex Smith",
                Email = "doctor@meddash.local",
                PasswordHash = defaultPassword,
                Role = "Doctor",
                PracticeStartDate = DateTime.Parse("2014-06-01"),
            },
            new User
            {
                Name = "Dr. Priya Patel",
                Email = "priya.patel@meddash.local",
                PasswordHash = defaultPassword,
                Role = "Doctor",
                PracticeStartDate = DateTime.Parse("2010-09-15"),
            },
            new User
            {
                Name = "Dr. Marcus Chen",
                Email = "marcus.chen@meddash.local",
                PasswordHash = defaultPassword,
                Role = "Doctor",
                PracticeStartDate = DateTime.Parse("2017-03-20"),
            },
            new User
            {
                Name = "Dr. Olivia Brennan",
                Email = "olivia.brennan@meddash.local",
                PasswordHash = defaultPassword,
                Role = "Doctor",
                PracticeStartDate = DateTime.Parse("2019-08-01"),
            },
            // Nurses — primary demo account first.
            new User
            {
                Name = "Nurse Jamie Lee",
                Email = "nurse@meddash.local",
                PasswordHash = defaultPassword,
                Role = "Nurse",
            },
            new User
            {
                Name = "Carlos Reyes, RN",
                Email = "carlos.reyes@meddash.local",
                PasswordHash = defaultPassword,
                Role = "Nurse",
            },
            new User
            {
                Name = "Maya Singh, RN",
                Email = "maya.singh@meddash.local",
                PasswordHash = defaultPassword,
                Role = "Nurse",
            },
            new User
            {
                Name = "Daniel Park, RN",
                Email = "daniel.park@meddash.local",
                PasswordHash = defaultPassword,
                Role = "Nurse",
            },
            // Single admin.
            new User
            {
                Name = "Admin",
                Email = "admin@meddash.local",
                PasswordHash = defaultPassword,
                Role = "Admin",
            },
        };

        var existingEmails = await context.Users
            .Select(u => u.Email)
            .ToListAsync();
        var existingSet = new HashSet<string>(existingEmails, StringComparer.OrdinalIgnoreCase);

        var toAdd = seedUsers.Where(u => !existingSet.Contains(u.Email)).ToList();
        if (toAdd.Count == 0) return;

        await context.Users.AddRangeAsync(toAdd);
        await context.SaveChangesAsync();
    }

    private static async Task SeedAppointmentsAsync(MedicalContext context)
    {
        if (await context.Appointments.AnyAsync()) return;

        var currentPatients = await context.Patients
            .Where(p => p.IsCurrentPatient)
            .Take(20)
            .ToListAsync();

        if (currentPatients.Count == 0) return;

        var now = DateTime.UtcNow;
        var appointments = new List<Appointment>();
        var rand = new Random(42);
        var reasons = new[]
        {
            "Routine follow-up", "Medication review", "Lab results review",
            "Annual checkup", "Blood pressure check", "Consultation",
            "Pre-op evaluation", "Specialist referral", "Vaccination",
            "Symptom evaluation", "Imaging review",
        };

        // Realistic mix per patient: 1 upcoming + 1-2 historical + occasional
        // Cancelled / NoShow so the calendar and analytics views have variety.
        foreach (var patient in currentPatients)
        {
            // Upcoming
            appointments.Add(new Appointment
            {
                PatientId = patient.Id,
                ScheduledAt = now.AddDays(rand.Next(1, 21)).AddHours(rand.Next(8, 17)),
                DurationMinutes = rand.Next(15, 60),
                Reason = reasons[rand.Next(reasons.Length)],
                Status = "Scheduled",
            });

            // Recent completed
            appointments.Add(new Appointment
            {
                PatientId = patient.Id,
                ScheduledAt = now.AddDays(-rand.Next(1, 30)).AddHours(rand.Next(8, 17)),
                DurationMinutes = 30,
                Reason = reasons[rand.Next(reasons.Length)],
                Status = "Completed",
                Notes = "Vitals normal; continue current plan.",
            });

            // Older completed (every other patient)
            if (rand.Next(2) == 0)
            {
                appointments.Add(new Appointment
                {
                    PatientId = patient.Id,
                    ScheduledAt = now.AddDays(-rand.Next(60, 180)).AddHours(rand.Next(8, 17)),
                    DurationMinutes = 30,
                    Reason = reasons[rand.Next(reasons.Length)],
                    Status = "Completed",
                    Notes = "Initial consultation; care plan established.",
                });
            }

            // ~1 in 6 patients had a recent cancellation
            if (rand.Next(6) == 0)
            {
                appointments.Add(new Appointment
                {
                    PatientId = patient.Id,
                    ScheduledAt = now.AddDays(-rand.Next(7, 45)).AddHours(rand.Next(8, 17)),
                    DurationMinutes = 30,
                    Reason = reasons[rand.Next(reasons.Length)],
                    Status = "Cancelled",
                    Notes = "Patient called to reschedule.",
                });
            }

            // ~1 in 8 patients had a no-show
            if (rand.Next(8) == 0)
            {
                appointments.Add(new Appointment
                {
                    PatientId = patient.Id,
                    ScheduledAt = now.AddDays(-rand.Next(7, 45)).AddHours(rand.Next(8, 17)),
                    DurationMinutes = 30,
                    Reason = reasons[rand.Next(reasons.Length)],
                    Status = "NoShow",
                });
            }
        }

        await context.Appointments.AddRangeAsync(appointments);
        await context.SaveChangesAsync();
    }
}

