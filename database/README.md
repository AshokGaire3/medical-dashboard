# Database

This folder contains database-related files and scripts for the Medical Dashboard project.

## Structure

```
database/
├── scripts/      # SQL scripts for manual database operations
├── migrations/   # Entity Framework migrations (backup/reference)
└── seed/         # Database seeding scripts
```

## Database Setup

The database is managed through Entity Framework Core migrations in the backend project.

### Initial Setup

1. Navigate to the backend folder:
   ```bash
   cd backend
   ```

2. Install Entity Framework tools (if not already installed):
   ```bash
   dotnet tool install --global dotnet-ef
   ```

3. Create and apply migrations:
   ```bash
   dotnet ef migrations add InitialCreate
   dotnet ef database update
   ```

## Connection String

The connection string is configured in `backend/appsettings.json`:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Database=MedicalDashboard;Trusted_Connection=True;TrustServerCertificate=True;"
  }
}
```

## Database Information

- **Database Name**: MedicalDashboard
- **Server**: Local SQL Server (LocalDB/Express/Full Edition)
- **ORM**: Entity Framework Core

