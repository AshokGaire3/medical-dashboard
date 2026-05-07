CREATE TABLE IF NOT EXISTS "__EFMigrationsHistory" (
    "MigrationId" TEXT NOT NULL CONSTRAINT "PK___EFMigrationsHistory" PRIMARY KEY,
    "ProductVersion" TEXT NOT NULL
);

BEGIN TRANSACTION;

CREATE TABLE "AuditLogs" (
    "Id" INTEGER NOT NULL CONSTRAINT "PK_AuditLogs" PRIMARY KEY AUTOINCREMENT,
    "UserId" INTEGER NULL,
    "UserEmail" TEXT NOT NULL,
    "UserRole" TEXT NOT NULL,
    "Method" TEXT NOT NULL,
    "Path" TEXT NOT NULL,
    "Resource" TEXT NULL,
    "ResourceId" TEXT NULL,
    "StatusCode" INTEGER NOT NULL,
    "IpAddress" TEXT NULL,
    "UserAgent" TEXT NULL,
    "Timestamp" TEXT NOT NULL
);

CREATE TABLE "Users" (
    "Id" INTEGER NOT NULL CONSTRAINT "PK_Users" PRIMARY KEY AUTOINCREMENT,
    "Name" TEXT NOT NULL,
    "Email" TEXT NOT NULL,
    "PasswordHash" TEXT NOT NULL,
    "Role" TEXT NOT NULL,
    "Avatar" TEXT NULL,
    "Specialty" TEXT NULL,
    "PracticeStartDate" TEXT NULL,
    "CreatedAt" TEXT NOT NULL,
    "LastLoginAt" TEXT NULL
);

CREATE TABLE "Patients" (
    "Id" INTEGER NOT NULL CONSTRAINT "PK_Patients" PRIMARY KEY AUTOINCREMENT,
    "Name" TEXT NOT NULL,
    "Age" INTEGER NOT NULL,
    "Gender" TEXT NOT NULL,
    "Condition" TEXT NOT NULL,
    "Status" TEXT NOT NULL,
    "LastVisit" TEXT NOT NULL,
    "AdmissionDate" TEXT NULL,
    "DischargeDate" TEXT NULL,
    "TreatmentStartDate" TEXT NULL,
    "IsCurrentPatient" INTEGER NOT NULL,
    "TreatmentNotes" TEXT NULL,
    "ContactPhone" TEXT NOT NULL,
    "ContactEmail" TEXT NOT NULL,
    "ContactAddress" TEXT NOT NULL,
    "EmergencyContactName" TEXT NOT NULL,
    "EmergencyContactRelationship" TEXT NOT NULL,
    "EmergencyContactPhone" TEXT NOT NULL,
    "AllergiesJson" TEXT NOT NULL,
    "AssignedDoctorId" INTEGER NULL,
    "AssignedNurseId" INTEGER NULL,
    "CreatedAt" TEXT NOT NULL,
    "UpdatedAt" TEXT NULL,
    "DeletedAt" TEXT NULL,
    "ConcurrencyStamp" TEXT NOT NULL,
    CONSTRAINT "FK_Patients_Users_AssignedDoctorId" FOREIGN KEY ("AssignedDoctorId") REFERENCES "Users" ("Id") ON DELETE RESTRICT,
    CONSTRAINT "FK_Patients_Users_AssignedNurseId" FOREIGN KEY ("AssignedNurseId") REFERENCES "Users" ("Id") ON DELETE RESTRICT
);

CREATE TABLE "Appointments" (
    "Id" INTEGER NOT NULL CONSTRAINT "PK_Appointments" PRIMARY KEY AUTOINCREMENT,
    "PatientId" INTEGER NOT NULL,
    "ScheduledAt" TEXT NOT NULL,
    "DurationMinutes" INTEGER NOT NULL,
    "Reason" TEXT NOT NULL,
    "Status" TEXT NOT NULL,
    "Notes" TEXT NULL,
    "CreatedAt" TEXT NOT NULL,
    "UpdatedAt" TEXT NULL,
    "ConcurrencyStamp" TEXT NOT NULL,
    CONSTRAINT "FK_Appointments_Patients_PatientId" FOREIGN KEY ("PatientId") REFERENCES "Patients" ("Id") ON DELETE CASCADE
);

CREATE TABLE "MedicalConditions" (
    "Id" INTEGER NOT NULL CONSTRAINT "PK_MedicalConditions" PRIMARY KEY AUTOINCREMENT,
    "PatientId" INTEGER NOT NULL,
    "Condition" TEXT NOT NULL,
    "DiagnosedDate" TEXT NOT NULL,
    "Severity" TEXT NOT NULL,
    "Status" TEXT NOT NULL,
    "Notes" TEXT NOT NULL,
    "CreatedAt" TEXT NOT NULL,
    "UpdatedAt" TEXT NULL,
    CONSTRAINT "FK_MedicalConditions_Patients_PatientId" FOREIGN KEY ("PatientId") REFERENCES "Patients" ("Id") ON DELETE CASCADE
);

CREATE TABLE "Medications" (
    "Id" INTEGER NOT NULL CONSTRAINT "PK_Medications" PRIMARY KEY AUTOINCREMENT,
    "PatientId" INTEGER NOT NULL,
    "Name" TEXT NOT NULL,
    "Dosage" TEXT NOT NULL,
    "Frequency" TEXT NOT NULL,
    "StartDate" TEXT NOT NULL,
    "EndDate" TEXT NULL,
    "PrescribedBy" TEXT NOT NULL,
    "Status" TEXT NOT NULL,
    "Notes" TEXT NULL,
    "CreatedAt" TEXT NOT NULL,
    "UpdatedAt" TEXT NULL,
    CONSTRAINT "FK_Medications_Patients_PatientId" FOREIGN KEY ("PatientId") REFERENCES "Patients" ("Id") ON DELETE CASCADE
);

CREATE TABLE "TestResults" (
    "Id" INTEGER NOT NULL CONSTRAINT "PK_TestResults" PRIMARY KEY AUTOINCREMENT,
    "PatientId" INTEGER NOT NULL,
    "TestName" TEXT NOT NULL,
    "TestType" TEXT NOT NULL,
    "Date" TEXT NOT NULL,
    "Result" TEXT NOT NULL,
    "NormalRange" TEXT NULL,
    "Status" TEXT NOT NULL,
    "OrderedBy" TEXT NOT NULL,
    "Notes" TEXT NULL,
    "CreatedAt" TEXT NOT NULL,
    "UpdatedAt" TEXT NULL,
    CONSTRAINT "FK_TestResults_Patients_PatientId" FOREIGN KEY ("PatientId") REFERENCES "Patients" ("Id") ON DELETE CASCADE
);

CREATE TABLE "Vitals" (
    "Id" INTEGER NOT NULL CONSTRAINT "PK_Vitals" PRIMARY KEY AUTOINCREMENT,
    "PatientId" INTEGER NOT NULL,
    "Timestamp" TEXT NOT NULL,
    "HeartRate" INTEGER NOT NULL,
    "BloodPressureSystemic" INTEGER NOT NULL,
    "BloodPressureDiastolic" INTEGER NOT NULL,
    "Temperature" REAL NOT NULL,
    "OxygenSaturation" INTEGER NOT NULL,
    "RespiratoryRate" INTEGER NOT NULL,
    "CreatedAt" TEXT NOT NULL,
    "UpdatedAt" TEXT NULL,
    CONSTRAINT "FK_Vitals_Patients_PatientId" FOREIGN KEY ("PatientId") REFERENCES "Patients" ("Id") ON DELETE CASCADE
);

CREATE INDEX "IX_Appointments_PatientId_ScheduledAt" ON "Appointments" ("PatientId", "ScheduledAt");

CREATE INDEX "IX_Appointments_ScheduledAt" ON "Appointments" ("ScheduledAt");

CREATE INDEX "IX_Appointments_Status" ON "Appointments" ("Status");

CREATE INDEX "IX_AuditLogs_Resource" ON "AuditLogs" ("Resource");

CREATE INDEX "IX_AuditLogs_Timestamp" ON "AuditLogs" ("Timestamp");

CREATE INDEX "IX_AuditLogs_UserId" ON "AuditLogs" ("UserId");

CREATE INDEX "IX_MedicalConditions_PatientId" ON "MedicalConditions" ("PatientId");

CREATE INDEX "IX_Medications_PatientId_Status" ON "Medications" ("PatientId", "Status");

CREATE INDEX "IX_Medications_Status" ON "Medications" ("Status");

CREATE INDEX "IX_Patients_AssignedDoctorId" ON "Patients" ("AssignedDoctorId");

CREATE INDEX "IX_Patients_AssignedNurseId" ON "Patients" ("AssignedNurseId");

CREATE INDEX "IX_Patients_DeletedAt" ON "Patients" ("DeletedAt");

CREATE INDEX "IX_Patients_IsCurrentPatient" ON "Patients" ("IsCurrentPatient");

CREATE INDEX "IX_Patients_Name" ON "Patients" ("Name");

CREATE INDEX "IX_Patients_Status" ON "Patients" ("Status");

CREATE INDEX "IX_TestResults_Date" ON "TestResults" ("Date");

CREATE INDEX "IX_TestResults_PatientId_Date" ON "TestResults" ("PatientId", "Date");

CREATE UNIQUE INDEX "IX_Users_Email" ON "Users" ("Email");

CREATE INDEX "IX_Vitals_PatientId_Timestamp" ON "Vitals" ("PatientId", "Timestamp");

CREATE INDEX "IX_Vitals_Timestamp" ON "Vitals" ("Timestamp");

INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
VALUES ('20260507171147_InitialCreate', '8.0.0');

COMMIT;

