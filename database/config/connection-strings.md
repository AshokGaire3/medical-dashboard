# Connection string templates

The application reads `ConnectionStrings:DefaultConnection` and picks the EF
provider automatically:

- contains `Server=` → SQL Server
- contains `Data Source=` only → SQLite

Override per-environment via `appsettings.{Environment}.json` or the env var
`ConnectionStrings__DefaultConnection`.

## SQLite (local dev — default)

```
Data Source=meddash.db
```

Zero-config. The file is created in `backend/` on first run.

## SQL Server — local Docker

```
Server=localhost,1433;Database=MedicalDashboard;User Id=sa;Password=<strong>;TrustServerCertificate=True;Encrypt=True;
```

Spin up SQL Server 2022 in Docker:

```bash
docker run -e "ACCEPT_EULA=Y" -e "MSSQL_SA_PASSWORD=<strong>" \
  -p 1433:1433 --name mssql -d mcr.microsoft.com/mssql/server:2022-latest
```

## SQL Server — Windows integrated auth

```
Server=localhost;Database=MedicalDashboard;Trusted_Connection=True;TrustServerCertificate=True;
```

## Azure SQL

```
Server=tcp:<server>.database.windows.net,1433;Database=MedicalDashboard;User ID=<user>;Password=<pwd>;Encrypt=True;TrustServerCertificate=False;Connection Timeout=30;
```

`EnableRetryOnFailure` is configured in `Program.cs` and handles the transient
failures that Azure SQL emits during failover and idle reconnects.

## Notes

- Connection strings must never be committed with real secrets. Use env vars
  or Azure Key Vault references in production.
- Minimum SQL Server version: 2017 (for the `IDENTITY` and `nvarchar(max)`
  features the migrations rely on). Tested on 2022.
- The `Encrypt=True;TrustServerCertificate=True` combo is fine for local Docker
  with self-signed certs, but flip `TrustServerCertificate` to `False` in any
  environment that exposes traffic on a network segment you don't control.
