# Database

Schema, migrations, seed data, and operational scripts for the Medical Dashboard.

## At a glance

| Concern              | Location                                                    |
|----------------------|-------------------------------------------------------------|
| Schema definition    | `backend/Models/*.cs` + `backend/Data/MedicalContext.cs`    |
| Migrations           | `backend/Migrations/` (canonical) — applied on app startup  |
| Seed data            | `backend/Data/DbSeeder.cs`                                  |
| Schema dump (T-SQL)  | `database/schema.sqlserver.sql` + `database/schema.sqlite.sql` |
| ER diagram           | `database/erd.md` (Mermaid)                                 |
| Schema changelog     | `database/CHANGELOG.md`                                     |
| SQL Server scripts   | `database/scripts/` (backup, index health, slow queries)    |
| Connection strings   | `database/config/` (templates) + `appsettings*.json`        |

The schema is **code-first via EF Core**. Do not write CREATE TABLE statements
by hand — change the C# models, generate a migration, commit it.

## Provider auto-detection

`backend/Program.cs` picks the EF provider from the connection string:

| Connection string contains | Provider used |
|----------------------------|---------------|
| `Server=`                  | SQL Server    |
| `Data Source=` only        | SQLite        |

Dev defaults to SQLite (`backend/meddash.db`) so the project runs out of the box.

## Working with migrations

All EF commands run from `backend/`.

```bash
# Add a migration after editing the C# model
dotnet ef migrations add <MeaningfulName>

# Apply migrations manually (the app does this automatically on startup
# via Program.cs → ctx.Database.MigrateAsync())
dotnet ef database update

# Roll back to a specific migration (target = "0" wipes everything)
dotnet ef database update <PreviousMigrationName>

# Drop the dev database entirely (SQLite: deletes meddash.db; SQL Server: drops)
dotnet ef database drop -f
```

When the application starts, it runs `MigrateAsync()` and then re-seeds via
`DbSeeder` if the tables are empty. There is no `EnsureCreated` fallback —
schema changes ship as committed migration files.

## Hardening highlights

- **Soft-delete on Patient** — `DeletedAt` column + global query filter; clinical records are never physically removed.
- **Optimistic concurrency** — `ConcurrencyStamp` on Patient and Appointment, rotated automatically by `MedicalContext.SaveChangesAsync`.
- **Composite indexes** — `(PatientId, Timestamp)` on Vitals, `(PatientId, ScheduledAt)` on Appointments, etc., to match real query patterns.
- **NoTracking by default** — read endpoints don't pay change-tracker cost. Mutating paths use `FindAsync` (auto-tracked) or explicit `.AsTracking()`.
- **SQL Server retry-on-failure** — 5 retries with exponential backoff, transparent to callers.
- **Audit log** — `AuditLog` table populated by middleware for every authenticated mutation.

## SQL Server in production

See [`config/connection-strings.md`](config/connection-strings.md) for connection
string templates and `scripts/` for backup, index health, and slow-query
diagnostics scripts. Production runs SQL Server (Docker or Azure SQL) with
automated backups configured at the platform level.

## Regenerating the schema dumps

`schema.sqlite.sql` and `schema.sqlserver.sql` are auto-generated from the
EF migrations. Regenerate them whenever a new migration lands:

```bash
# From backend/, with no DB needed --- EF generates SQL purely from migration files.
dotnet ef migrations script -o ../database/schema.sqlite.sql

# Generate the SQL Server flavor by activating the SqlServer provider via env var.
# The connection string can be a placeholder; EF doesn't connect.
ConnectionStrings__DefaultConnection="Server=placeholder;Database=MedicalDashboard;User Id=sa;Password=p;TrustServerCertificate=True;" \
  dotnet ef migrations script --idempotent -o ../database/schema.sqlserver.sql
```

The SQL Server script is `--idempotent` (safe to re-run; it checks the
migration history table before applying each step). The SQLite script is not
idempotent because the SQLite provider doesn't support that flag.

## Folder structure

```
database/
├── README.md                   ← this file
├── CHANGELOG.md                ← per-migration human-readable log
├── erd.md                      ← Mermaid entity-relationship diagram
├── schema.sqlite.sql           ← auto-generated SQLite DDL
├── schema.sqlserver.sql        ← auto-generated SQL Server DDL (idempotent)
├── config/                     ← connection-string templates and DBA notes
│   └── connection-strings.md
└── scripts/                    ← operational T-SQL
    ├── backup-restore.sql
    ├── index-health.sql
    └── slow-queries.sql
```

There is no `migrations/` mirror here — migrations live in `backend/Migrations/`
where EF Core can find them. There is no `seed/` mirror — seed data lives in
`backend/Data/DbSeeder.cs` so it benefits from compile-time checking.
