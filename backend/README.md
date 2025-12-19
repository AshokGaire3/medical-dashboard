# Medical Dashboard API

ASP.NET Core 8 Web API backend for the Medical Dashboard application.

## Project Structure

```
backend/
├── Controllers/     # API controllers
├── Data/            # DbContext and database configuration
├── Models/          # Entity models
├── Services/        # Business logic services
├── Migrations/      # Entity Framework migrations
├── Properties/      # Launch settings
└── Program.cs       # Application entry point
```

## Prerequisites

- .NET 8 SDK
- SQL Server (LocalDB, Express, or Full Edition)
- Entity Framework Core tools

## Setup

1. **Install Entity Framework tools:**
   ```bash
   dotnet tool install --global dotnet-ef
   ```

2. **Configure database connection:**
   Edit `appsettings.json`:
   ```json
   {
     "ConnectionStrings": {
       "DefaultConnection": "Server=localhost;Database=MedicalDashboard;Trusted_Connection=True;TrustServerCertificate=True;"
     }
   }
   ```

3. **Create and apply migrations:**
   ```bash
   dotnet ef migrations add InitialCreate
   dotnet ef database update
   ```

4. **Run the API:**
   ```bash
   dotnet run
   ```

The API will start on:
- **HTTP**: `http://localhost:5000`
- **HTTPS**: `https://localhost:5001`
- **Swagger UI**: `https://localhost:5001/swagger`

## API Endpoints

### Patients
- `GET /api/patients` - Get all patients
- `GET /api/patients/{id}` - Get patient by ID
- `POST /api/patients` - Create patient
- `PUT /api/patients/{id}` - Update patient
- `DELETE /api/patients/{id}` - Delete patient

### Vitals
- `GET /api/vitals` - Get all vitals
- `GET /api/vitals?patientId={id}` - Get vitals for patient
- `POST /api/vitals` - Create vital record
- `PUT /api/vitals/{id}` - Update vital
- `DELETE /api/vitals/{id}` - Delete vital

### Dashboard
- `GET /api/dashboard/metrics` - Get dashboard metrics

## Tech Stack

- ASP.NET Core 8
- Entity Framework Core
- SQL Server
- C#

## Development

Run in development mode:
```bash
dotnet run
```

Build for production:
```bash
dotnet build --configuration Release
```

## Database Migrations

Create a new migration:
```bash
dotnet ef migrations add MigrationName
```

Apply migrations:
```bash
dotnet ef database update
```

Revert last migration:
```bash
dotnet ef database update PreviousMigrationName
```
