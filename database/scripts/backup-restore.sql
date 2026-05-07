-- =============================================================================
-- Manual backup / restore for SQL Server
-- =============================================================================
-- Production deployments should use platform-managed backups (Azure SQL
-- automated backups, or scheduled Agent jobs on a self-hosted instance).
-- These scripts cover ad-hoc operator tasks: pre-deploy snapshot, dev refresh,
-- DR rehearsal.
-- =============================================================================

-- 1. Full backup --------------------------------------------------------------
BACKUP DATABASE [MedicalDashboard]
TO DISK = N'/var/opt/mssql/backup/MedicalDashboard_full.bak'
WITH FORMAT, INIT, COMPRESSION,
     NAME = N'MedicalDashboard-Full',
     STATS = 10;
GO

-- 2. Transaction log backup (only valid under FULL recovery model) ------------
BACKUP LOG [MedicalDashboard]
TO DISK = N'/var/opt/mssql/backup/MedicalDashboard_log.trn'
WITH NOFORMAT, NOINIT, COMPRESSION, STATS = 10;
GO

-- 3. Restore (point-in-time) --------------------------------------------------
-- Step A: restore the last full backup WITH NORECOVERY so we can apply logs.
RESTORE DATABASE [MedicalDashboard]
FROM DISK = N'/var/opt/mssql/backup/MedicalDashboard_full.bak'
WITH NORECOVERY, REPLACE, STATS = 10;
GO

-- Step B: replay log up to the desired moment.
RESTORE LOG [MedicalDashboard]
FROM DISK = N'/var/opt/mssql/backup/MedicalDashboard_log.trn'
WITH RECOVERY,
     STOPAT = N'2026-05-07T14:30:00';   -- adjust to the target instant
GO

-- 4. Verify the most recent backup is readable --------------------------------
RESTORE VERIFYONLY
FROM DISK = N'/var/opt/mssql/backup/MedicalDashboard_full.bak';
GO
