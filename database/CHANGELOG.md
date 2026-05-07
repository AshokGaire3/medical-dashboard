# Schema Changelog

A human-readable log of every schema change. One entry per migration. Add a
new entry whenever you run `dotnet ef migrations add` — the entry is what
your future self (or a reviewer) reads instead of diffing the migration
`.cs` files line by line.

Format: `## YYYY-MM-DD — MigrationName` followed by a short list of changes
and the *why*.

---

## 2026-05-07 — AddPostgreSQLSupport

Added PostgreSQL as a second production database provider for hosting on Render.

**Changes**

- Added `Npgsql.EntityFrameworkCore.PostgreSQL` NuGet package.
- Added `MedicalDashboardContextFactory` (design-time factory) so `dotnet ef` commands
  can run without a running app when targeting PostgreSQL.
- Updated `Program.cs` provider auto-detection: connection strings containing `Host=`
  now route to the Npgsql provider; `Data Source=` → SQLite; `Server=` → SQL Server.
- `render.yaml` updated: removed SQLite disk, added a Render managed PostgreSQL database
  and wired `DATABASE_URL` into the service environment.
- `backend/Dockerfile` unchanged — the image works for both providers.

**Why**

Render's free tier doesn't support persistent disks on the free web service plan, making
SQLite unreliable in production. The managed PostgreSQL database is free, persistent, and
better suited for a deployed demo.

---

## 2026-05-07 — InitialCreate

First migration. Captures the schema after the database hardening pass that
moved the project off `EnsureCreated()` and onto real EF Core migrations.

**Tables created**

- `Patients`, `Vitals`, `MedicalConditions`, `Medications`, `TestResults`,
  `Appointments`, `Users`, `AuditLogs`

**Hardening features baked in**

- `Patients.DeletedAt` (nullable) — soft-delete column with a global query
  filter that hides soft-deleted rows from every read. Cascading filters on
  child tables (Vitals/MedicalConditions/Medications/TestResults/Appointments)
  hide their rows when the parent patient is soft-deleted.
- `Patients.ConcurrencyStamp` and `Appointments.ConcurrencyStamp` (Guid) —
  optimistic concurrency tokens, rotated on every update by
  `MedicalContext.SaveChangesAsync`.
- `Patients.AssignedDoctorId` and `Patients.AssignedNurseId` — care-team
  assignment FKs (nullable, `ON DELETE NO ACTION`). Used to scope which
  clinicians can see which patients; admins see everyone.
- Composite indexes matching real query patterns:
  `Vitals(PatientId, Timestamp)`, `Appointments(PatientId, ScheduledAt)`,
  `Medications(PatientId, Status)`, `TestResults(PatientId, Date)`.
- Single-column indexes:
  `Patients(Status)`, `Patients(IsCurrentPatient)`, `Patients(Name)`,
  `Patients(DeletedAt)`, `Patients(AssignedDoctorId)`, `Patients(AssignedNurseId)`,
  `Users(Email)` (unique),
  `AuditLogs(Timestamp)`, `AuditLogs(UserId)`, `AuditLogs(Resource)`.
- All Patient → child relationships are `ON DELETE CASCADE`. Hard-deleting a
  patient (which the API does not do) would clean up children automatically.

**Why this is one migration, not many**

The project was previously using `EnsureCreated()`, which produced a database
without an EF migration history. Switching to `MigrateAsync()` required a
fresh starting point, so all of the above is captured as a single
`InitialCreate`. Future schema changes will get their own migrations.
