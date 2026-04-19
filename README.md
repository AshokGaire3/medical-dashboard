# Medical Dashboard

A modern, opinionated full-stack medical dashboard built with **React 18 + TypeScript** on the frontend and **ASP.NET Core 8** on the backend. It ships with JWT auth, role-based authorization, appointments, patient CRUD with search/pagination, realtime-ish dashboards, dark mode, and exportable reports.

## Highlights

- **Auth**: JWT login/register, protected routes, seeded demo accounts
- **Patients**: search, filter, paginate, CRUD via modals with validation
- **Appointments**: schedule, complete, cancel, filter by status
- **Dashboard**: metrics, vitals trends, critical alerts, today’s schedule
- **Analytics**: demographics, condition breakdowns, status distribution
- **Reports**: CSV / JSON export
- **DX**: TanStack Query, toast notifications, typed API client, RFC 7807 error handling, Swagger + JWT
- **DB flexibility**: SQLite by default, SQL Server via connection string
- **Theme**: light / dark / system
- **Docs**: everything lives in [`docs/`](./docs/README.md), including an [AGENTS.md](./docs/AGENTS.md) for AI assistants

## Quick start (zero-config, SQLite)

Requires Node 20+ and .NET 8 SDK.

```bash
# Backend (http://localhost:5000)
cd backend
dotnet restore
dotnet run

# Frontend (http://localhost:5173)
cd ../frontend
cp .env.example .env
npm install
npm run dev
```

Open <http://localhost:5173> and log in with a seeded account:

| Email | Password | Role |
| --- | --- | --- |
| `doctor@meddash.local` | `Password123!` | Doctor |
| `nurse@meddash.local` | `Password123!` | Nurse |
| `admin@meddash.local` | `Password123!` | Admin |

## Docker

```bash
docker compose up --build
```

This brings up SQL Server, the API (http://localhost:5000), and the web app (http://localhost:5173).

## Project layout

```
.
├── backend/          # ASP.NET Core 8 Web API (C#)
├── frontend/         # React 18 + Vite + Tailwind + TanStack Query
├── database/         # Seed scripts
├── docs/             # Architecture, API, setup, conventions, AGENTS.md
├── .github/          # CI workflow
└── docker-compose.yml
```

## Scripts cheat sheet

Backend:
- `dotnet run` — start API (auto-creates DB + seeds on first run)
- `dotnet build -c Release` — compile

Frontend:
- `npm run dev` — Vite dev server
- `npm run lint` — ESLint
- `npm run typecheck` — `tsc --noEmit`
- `npm run build` — production build

## Documentation

Start with [`docs/README.md`](./docs/README.md). For AI agents working in this repo, start with [`docs/AGENTS.md`](./docs/AGENTS.md).

## License

MIT.
