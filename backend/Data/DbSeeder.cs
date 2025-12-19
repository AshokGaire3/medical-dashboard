using MedicalDashboard.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace MedicalDashboard.Api.Data;

public static class DbSeeder
{
    public static async Task SeedAsync(MedicalContext context)
    {
        // Ensure database is created
        await context.Database.EnsureCreatedAsync();

        // Check if data already exists
        if (await context.Patients.AnyAsync())
        {
            return; // Database already seeded
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

        // Add patients to context
        await context.Patients.AddRangeAsync(patients);
        await context.SaveChangesAsync();
    }
}

