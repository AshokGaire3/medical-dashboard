# Medical Dashboard - Full Stack Application

A modern medical dashboard built with React (frontend) and ASP.NET Core (backend) for healthcare professionals to manage patients and view analytics.

## Project Structure

This is a monorepo containing all components of the Medical Dashboard:

```
medical-dashboard/
├── frontend/          # React + TypeScript frontend application
├── backend/           # ASP.NET Core Web API
├── database/          # Database scripts and migrations
└── README.md          # This file
```

## Tech Stack

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
- C#

## Quick Start

### Prerequisites
- Node.js 18+ and npm
- .NET 8 SDK
- SQL Server (LocalDB, Express, or Full Edition)

### Setup

1. **Backend Setup**
   ```bash
   cd backend
   dotnet tool install --global dotnet-ef
   dotnet ef migrations add InitialCreate
   dotnet ef database update
   dotnet run
   ```
   API runs on: `http://localhost:5000` or `https://localhost:5001`

2. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   # Create .env file with: VITE_API_URL=http://localhost:5000/api
   npm run dev
   ```
   Frontend runs on: `http://localhost:5173`

## Detailed Setup

See [SETUP.md](./frontend/SETUP.md) for complete setup instructions.

## Features

- **Dashboard**: Overview with key medical metrics and charts
- **Patient Management**: Full CRUD operations for patient records
- **Analytics**: Interactive charts and data visualization
- **Vitals Tracking**: Monitor patient vital signs
- **Real-time Data**: Connected to SQL Server database

## Development

### Running Both Services

**Terminal 1 - Backend:**
```bash
cd backend
dotnet run
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

## API Endpoints

- `GET /api/patients` - Get all patients
- `GET /api/patients/{id}` - Get patient by ID
- `POST /api/patients` - Create patient
- `PUT /api/patients/{id}` - Update patient
- `DELETE /api/patients/{id}` - Delete patient
- `GET /api/vitals` - Get all vitals
- `GET /api/dashboard/metrics` - Get dashboard metrics

See backend README for complete API documentation.

## Project Organization

- **frontend/**: React application with components, pages, and API integration
- **backend/**: ASP.NET Core API with controllers, services, models, and migrations
- **database/**: Database scripts, migrations backup, and seeding scripts

## License

This is a demo project. For production use in healthcare, ensure compliance with relevant regulations (HIPAA, etc.).

