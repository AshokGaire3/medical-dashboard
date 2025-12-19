# Medical Dashboard - Full Stack Setup Guide

This guide will help you set up both the React frontend and ASP.NET Core backend.

## Project Structure

```
Medical Dashboard/        # React frontend (Vite + TypeScript)
MedicalDashboard.Api/     # ASP.NET Core backend (C# + SQL Server)
```

## Prerequisites

### Frontend
- Node.js 18+ and npm
- Already installed ✓

### Backend
- [.NET 8 SDK](https://dotnet.microsoft.com/download)
- SQL Server (LocalDB, Express, or Full Edition)

## Quick Start

### 1. Backend Setup (ASP.NET Core API)

```bash
# Navigate to backend directory
cd path/to/MedicalDashboard.Api

# Install Entity Framework tools
dotnet tool install --global dotnet-ef

# Create database migrations
dotnet ef migrations add InitialCreate

# Apply migrations to create database
dotnet ef database update

# Run the API
dotnet run
```

The API will start on:
- **HTTPS**: `https://localhost:5001`
- **HTTP**: `http://localhost:5000`
- **Swagger UI**: `https://localhost:5001/swagger`

### 2. Frontend Setup (React)

```bash
# Navigate to frontend directory
cd path/to/"Medical Dashboard"

# Install dependencies (if not already installed)
npm install

# Create .env file for API configuration
cp .env.example .env

# Edit .env and ensure API URL matches your backend
# VITE_API_URL=https://localhost:5001/api

# Run the frontend
npm run dev
```

The frontend will start on `http://localhost:5173`

## Configuration

### Backend Database Connection

Edit `MedicalDashboard.Api/appsettings.json`:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Database=MedicalDashboard;Trusted_Connection=True;TrustServerCertificate=True;"
  }
}
```

**For SQL Server Express:**
```
Server=localhost\\SQLEXPRESS;Database=MedicalDashboard;Trusted_Connection=True;TrustServerCertificate=True;
```

**For SQL Server LocalDB:**
```
Server=(localdb)\\mssqllocaldb;Database=MedicalDashboard;Trusted_Connection=True;TrustServerCertificate=True;
```

### Frontend API URL

Edit `.env` file in the React project:

```
VITE_API_URL=https://localhost:5001/api
```

## Running Both Applications

### Terminal 1 - Backend
```bash
cd path/to/MedicalDashboard.Api
dotnet run
```

### Terminal 2 - Frontend
```bash
cd path/to/"Medical Dashboard"
npm run dev
```

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

## Troubleshooting

### Backend Issues

**Database connection fails:**
- Ensure SQL Server is running
- Verify connection string in `appsettings.json`
- Check SQL Server authentication mode

**Migrations fail:**
- Ensure Entity Framework tools are installed: `dotnet tool install --global dotnet-ef`
- Delete `Migrations` folder and recreate if needed

**Port already in use:**
- Change ports in `launchSettings.json` or kill the process using the port

### Frontend Issues

**API connection fails:**
- Verify backend is running on `https://localhost:5001`
- Check `.env` file has correct `VITE_API_URL`
- Check browser console for CORS errors
- Ensure CORS is configured in backend `Program.cs`

**Build errors:**
- Run `npm install` to ensure all dependencies are installed
- Clear `node_modules` and reinstall if needed

## Development Workflow

1. Start backend API first (`dotnet run`)
2. Start frontend (`npm run dev`)
3. Frontend will automatically connect to API
4. Use Swagger UI (`https://localhost:5001/swagger`) to test API endpoints
5. Check browser console for any API errors

## Next Steps

1. **Seed Initial Data**: Create a database seeder to populate initial patient data
2. **Authentication**: Add user authentication and authorization
3. **Error Handling**: Enhance error handling and validation
4. **Testing**: Add unit tests and integration tests
5. **Deployment**: Configure for production deployment

## Tech Stack Summary

### Frontend
- React 18 + TypeScript
- Vite (build tool)
- Tailwind CSS
- Recharts (data visualization)
- React Router

### Backend
- ASP.NET Core 8 Web API
- Entity Framework Core
- SQL Server
- C# with OOP principles

