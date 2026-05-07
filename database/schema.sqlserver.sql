-- =============================================================================
-- Medical Dashboard --- SQL Server schema (idempotent)
-- =============================================================================
-- Hand-translated from the EF Core migrations in backend/Migrations/. The
-- C# code is the source of truth; this file is a reviewer-friendly snapshot.
--
-- Regenerate this file when the schema changes:
--   1. Update backend/Models/*.cs and run dotnet ef migrations add <Name>
--   2. Update this file by hand to reflect the new operations.
--
-- The auto-generated dotnet ef migrations script output is SQLite-flavored
-- (TEXT instead of nvarchar, etc.) because migrations are authored against
-- the SQLite dev provider. This file is maintained manually so production
-- SQL Server gets proper nvarchar(max) / datetime2 / uniqueidentifier types.
-- =============================================================================

IF DB_ID(N'MedicalDashboard') IS NULL
BEGIN
    CREATE DATABASE [MedicalDashboard];
END;
GO

USE [MedicalDashboard];
GO

-- --- EF migration history (created automatically by EF; included for
--     completeness if seeding from this script standalone) -------------------
IF OBJECT_ID(N'[__EFMigrationsHistory]') IS NULL
BEGIN
    CREATE TABLE [__EFMigrationsHistory] (
        [MigrationId]    nvarchar(150) NOT NULL,
        [ProductVersion] nvarchar(32)  NOT NULL,
        CONSTRAINT [PK___EFMigrationsHistory] PRIMARY KEY ([MigrationId])
    );
END;
GO

-- --- Users -------------------------------------------------------------------
IF OBJECT_ID(N'[Users]') IS NULL
BEGIN
    CREATE TABLE [Users] (
        [Id]                  int IDENTITY(1,1) NOT NULL,
        [Name]                nvarchar(200) NOT NULL,
        [Email]               nvarchar(256) NOT NULL,
        [PasswordHash]        nvarchar(256) NOT NULL,
        [Role]                nvarchar(32)  NOT NULL,
        [Avatar]              nvarchar(512) NULL,
        [PracticeStartDate]   datetime2 NULL,
        [CreatedAt]           datetime2 NOT NULL,
        [LastLoginAt]         datetime2 NULL,
        CONSTRAINT [PK_Users] PRIMARY KEY ([Id])
    );
    CREATE UNIQUE INDEX [IX_Users_Email] ON [Users] ([Email]);
END;
GO

-- --- Patients ----------------------------------------------------------------
IF OBJECT_ID(N'[Patients]') IS NULL
BEGIN
    CREATE TABLE [Patients] (
        [Id]                            int IDENTITY(1,1) NOT NULL,
        [Name]                          nvarchar(200) NOT NULL,
        [Age]                           int NOT NULL,
        [Gender]                        nvarchar(16)  NOT NULL,
        [Condition]                     nvarchar(256) NOT NULL,
        [Status]                        nvarchar(32)  NOT NULL,
        [LastVisit]                     datetime2 NOT NULL,
        [AdmissionDate]                 datetime2 NULL,
        [DischargeDate]                 datetime2 NULL,
        [TreatmentStartDate]            datetime2 NULL,
        [IsCurrentPatient]              bit NOT NULL,
        [TreatmentNotes]                nvarchar(max) NULL,
        [ContactPhone]                  nvarchar(32)  NOT NULL,
        [ContactEmail]                  nvarchar(256) NOT NULL,
        [ContactAddress]                nvarchar(512) NOT NULL,
        [EmergencyContactName]          nvarchar(200) NOT NULL,
        [EmergencyContactRelationship]  nvarchar(64)  NOT NULL,
        [EmergencyContactPhone]         nvarchar(32)  NOT NULL,
        [AllergiesJson]                 nvarchar(max) NOT NULL,
        [AssignedDoctorId]              int NULL,                    -- care-team assignment
        [AssignedNurseId]               int NULL,
        [CreatedAt]                     datetime2 NOT NULL,
        [UpdatedAt]                     datetime2 NULL,
        [DeletedAt]                     datetime2 NULL,              -- soft-delete; NULL = active
        [ConcurrencyStamp]              uniqueidentifier NOT NULL,    -- optimistic concurrency token
        CONSTRAINT [PK_Patients] PRIMARY KEY ([Id]),
        CONSTRAINT [FK_Patients_Users_AssignedDoctorId]
            FOREIGN KEY ([AssignedDoctorId]) REFERENCES [Users] ([Id]) ON DELETE NO ACTION,
        CONSTRAINT [FK_Patients_Users_AssignedNurseId]
            FOREIGN KEY ([AssignedNurseId])  REFERENCES [Users] ([Id]) ON DELETE NO ACTION
    );
    CREATE INDEX [IX_Patients_Status]              ON [Patients] ([Status]);
    CREATE INDEX [IX_Patients_IsCurrentPatient]    ON [Patients] ([IsCurrentPatient]);
    CREATE INDEX [IX_Patients_Name]                ON [Patients] ([Name]);
    CREATE INDEX [IX_Patients_DeletedAt]           ON [Patients] ([DeletedAt]);
    CREATE INDEX [IX_Patients_AssignedDoctorId]    ON [Patients] ([AssignedDoctorId]);
    CREATE INDEX [IX_Patients_AssignedNurseId]     ON [Patients] ([AssignedNurseId]);
END;
GO

-- --- Vitals ------------------------------------------------------------------
IF OBJECT_ID(N'[Vitals]') IS NULL
BEGIN
    CREATE TABLE [Vitals] (
        [Id]                       int IDENTITY(1,1) NOT NULL,
        [PatientId]                int NOT NULL,
        [Timestamp]                datetime2 NOT NULL,
        [HeartRate]                int NOT NULL,
        [BloodPressureSystemic]    int NOT NULL,
        [BloodPressureDiastolic]   int NOT NULL,
        [Temperature]              float NOT NULL,
        [OxygenSaturation]         int NOT NULL,
        [RespiratoryRate]          int NOT NULL,
        [CreatedAt]                datetime2 NOT NULL,
        [UpdatedAt]                datetime2 NULL,
        CONSTRAINT [PK_Vitals] PRIMARY KEY ([Id]),
        CONSTRAINT [FK_Vitals_Patients_PatientId]
            FOREIGN KEY ([PatientId]) REFERENCES [Patients] ([Id]) ON DELETE CASCADE
    );
    -- Composite index supports "latest vitals per patient" without sorting.
    CREATE INDEX [IX_Vitals_PatientId_Timestamp] ON [Vitals] ([PatientId], [Timestamp]);
    CREATE INDEX [IX_Vitals_Timestamp]           ON [Vitals] ([Timestamp]);
END;
GO

-- --- MedicalConditions -------------------------------------------------------
IF OBJECT_ID(N'[MedicalConditions]') IS NULL
BEGIN
    CREATE TABLE [MedicalConditions] (
        [Id]              int IDENTITY(1,1) NOT NULL,
        [PatientId]       int NOT NULL,
        [Condition]       nvarchar(256) NOT NULL,
        [DiagnosedDate]   datetime2 NOT NULL,
        [Severity]        nvarchar(32)  NOT NULL,
        [Status]          nvarchar(32)  NOT NULL,
        [Notes]           nvarchar(max) NOT NULL,
        [CreatedAt]       datetime2 NOT NULL,
        [UpdatedAt]       datetime2 NULL,
        CONSTRAINT [PK_MedicalConditions] PRIMARY KEY ([Id]),
        CONSTRAINT [FK_MedicalConditions_Patients_PatientId]
            FOREIGN KEY ([PatientId]) REFERENCES [Patients] ([Id]) ON DELETE CASCADE
    );
    CREATE INDEX [IX_MedicalConditions_PatientId] ON [MedicalConditions] ([PatientId]);
END;
GO

-- --- Medications -------------------------------------------------------------
IF OBJECT_ID(N'[Medications]') IS NULL
BEGIN
    CREATE TABLE [Medications] (
        [Id]              int IDENTITY(1,1) NOT NULL,
        [PatientId]       int NOT NULL,
        [Name]            nvarchar(256) NOT NULL,
        [Dosage]          nvarchar(64)  NOT NULL,
        [Frequency]       nvarchar(64)  NOT NULL,
        [StartDate]       datetime2 NOT NULL,
        [EndDate]         datetime2 NULL,
        [PrescribedBy]    nvarchar(200) NOT NULL,
        [Status]          nvarchar(32)  NOT NULL,
        [Notes]           nvarchar(max) NULL,
        [CreatedAt]       datetime2 NOT NULL,
        [UpdatedAt]       datetime2 NULL,
        CONSTRAINT [PK_Medications] PRIMARY KEY ([Id]),
        CONSTRAINT [FK_Medications_Patients_PatientId]
            FOREIGN KEY ([PatientId]) REFERENCES [Patients] ([Id]) ON DELETE CASCADE
    );
    CREATE INDEX [IX_Medications_PatientId_Status] ON [Medications] ([PatientId], [Status]);
    CREATE INDEX [IX_Medications_Status]           ON [Medications] ([Status]);
END;
GO

-- --- TestResults -------------------------------------------------------------
IF OBJECT_ID(N'[TestResults]') IS NULL
BEGIN
    CREATE TABLE [TestResults] (
        [Id]              int IDENTITY(1,1) NOT NULL,
        [PatientId]       int NOT NULL,
        [TestName]        nvarchar(256) NOT NULL,
        [TestType]        nvarchar(64)  NOT NULL,
        [Date]            datetime2 NOT NULL,
        [Result]          nvarchar(max) NOT NULL,
        [NormalRange]     nvarchar(256) NULL,
        [Status]          nvarchar(32)  NOT NULL,
        [OrderedBy]       nvarchar(200) NOT NULL,
        [Notes]           nvarchar(max) NULL,
        [CreatedAt]       datetime2 NOT NULL,
        [UpdatedAt]       datetime2 NULL,
        CONSTRAINT [PK_TestResults] PRIMARY KEY ([Id]),
        CONSTRAINT [FK_TestResults_Patients_PatientId]
            FOREIGN KEY ([PatientId]) REFERENCES [Patients] ([Id]) ON DELETE CASCADE
    );
    CREATE INDEX [IX_TestResults_PatientId_Date] ON [TestResults] ([PatientId], [Date]);
    CREATE INDEX [IX_TestResults_Date]           ON [TestResults] ([Date]);
END;
GO

-- --- Appointments ------------------------------------------------------------
IF OBJECT_ID(N'[Appointments]') IS NULL
BEGIN
    CREATE TABLE [Appointments] (
        [Id]                int IDENTITY(1,1) NOT NULL,
        [PatientId]         int NOT NULL,
        [ScheduledAt]       datetime2 NOT NULL,
        [DurationMinutes]   int NOT NULL,
        [Reason]            nvarchar(256) NOT NULL,
        [Status]            nvarchar(32)  NOT NULL,
        [Notes]             nvarchar(max) NULL,
        [CreatedAt]         datetime2 NOT NULL,
        [UpdatedAt]         datetime2 NULL,
        [ConcurrencyStamp]  uniqueidentifier NOT NULL,
        CONSTRAINT [PK_Appointments] PRIMARY KEY ([Id]),
        CONSTRAINT [FK_Appointments_Patients_PatientId]
            FOREIGN KEY ([PatientId]) REFERENCES [Patients] ([Id]) ON DELETE CASCADE
    );
    CREATE INDEX [IX_Appointments_PatientId_ScheduledAt]
        ON [Appointments] ([PatientId], [ScheduledAt]);
    CREATE INDEX [IX_Appointments_ScheduledAt] ON [Appointments] ([ScheduledAt]);
    CREATE INDEX [IX_Appointments_Status]      ON [Appointments] ([Status]);
END;
GO

-- --- AuditLogs ---------------------------------------------------------------
IF OBJECT_ID(N'[AuditLogs]') IS NULL
BEGIN
    CREATE TABLE [AuditLogs] (
        [Id]            int IDENTITY(1,1) NOT NULL,
        [UserId]        int NULL,                   -- soft FK; null preserves trail if user deleted
        [UserEmail]     nvarchar(256) NOT NULL,
        [UserRole]      nvarchar(32)  NOT NULL,
        [Method]        nvarchar(16)  NOT NULL,
        [Path]          nvarchar(512) NOT NULL,
        [Resource]      nvarchar(64)  NULL,
        [ResourceId]    nvarchar(64)  NULL,
        [StatusCode]    int NOT NULL,
        [IpAddress]     nvarchar(64)  NULL,
        [UserAgent]     nvarchar(512) NULL,
        [Timestamp]     datetime2 NOT NULL,
        CONSTRAINT [PK_AuditLogs] PRIMARY KEY ([Id])
    );
    CREATE INDEX [IX_AuditLogs_Timestamp] ON [AuditLogs] ([Timestamp]);
    CREATE INDEX [IX_AuditLogs_UserId]    ON [AuditLogs] ([UserId]);
    CREATE INDEX [IX_AuditLogs_Resource]  ON [AuditLogs] ([Resource]);
END;
GO
