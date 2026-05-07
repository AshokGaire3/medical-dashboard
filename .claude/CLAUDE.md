# Medical Dashboard — Claude Code Context

> This file tells Claude Code everything it needs to collaborate effectively on this project.
> Read it at the start of every session. Keep it updated when conventions or scope change.

---

## What This Project Is

**Medical Dashboard** is a full-stack clinical workstation application that replicates core workflows used in real hospital/clinic environments. It is built as a production-quality demo — not HIPAA-compliant, not for live PHI — but modeled faithfully after real Electronic Health Record (EHR) and Hospital Information System (HIS) concepts.

The primary users are **Doctors**, **Nurses**, and **Admins**. Each role has different permissions and workflows:

| Role    | Can do                                                             | Cannot do                         |
|---------|--------------------------------------------------------------------|-----------------------------------|
| Doctor  | Full CRUD on patients, appointments, vitals, meds, tests, conditions | (unrestricted)                  |
| Nurse   | View + create records; update vitals, meds, tests                  | Delete patients, modify appointments |
| Admin   | Same as Doctor + user management (future)                          | Clinical note authorship (future) |

---

## Hospital/Clinical Domain Context

Understanding *why* these features exist helps you make better implementation decisions.

### Patient Record (Chart)
In real hospital systems (Epic, Cerner, Meditech), a patient chart is the central object. Everything attaches to it:
- **Demographics**: name, DOB/age, gender, contact, emergency contact, allergies.
- **Encounter history**: each visit/admission is an encounter. This app models admissions via `AdmissionDate`, `DischargeDate`, `IsCurrentPatient`.
- **Allergies**: critical safety data. Real systems enforce allergy checks at medication ordering.
- **Problem list** (→ `MedicalCondition`): active chronic/acute conditions driving the care plan.
- **Treatment notes**: free-text clinical narrative (progress notes in real HIS).

### Vitals (Observation Flowsheet)
Real ICU/ward systems capture vitals every 15 min–4 hours automatically via bedside devices (Philips IntelliVue, GE CARESCAPE) feeding into the HIS via HL7 v2 or FHIR R4. This app captures them manually. Key thresholds that trigger alerts:
- HR < 50 or > 120 bpm → tachycardia/bradycardia
- SBP < 90 or > 180 mmHg → hypotension/hypertensive crisis
- SpO₂ < 90% → hypoxia
- Temp > 103°F → high fever
- RR < 8 or > 30 /min → respiratory compromise

### Medications (Medication Administration Record — MAR)
In real hospitals, medications go through CPOE (Computerized Physician Order Entry) → pharmacy verification → nursing administration. Key concepts:
- **Active vs Discontinued vs Completed** status mirrors real MAR states.
- `PrescribedBy` ties to the ordering physician.
- `Frequency` (e.g., "twice daily", "QID PRN") and `Dosage` are free-text here; real systems use structured RxNorm codes.

### Lab / Test Results
Real systems integrate with LIS (Laboratory Information Systems) via HL7 interfaces. Results include:
- LOINC-coded test names (Blood Test, Imaging, Biopsy, Cardiac, Pulmonary).
- `NormalRange` for flagging Abnormal/Critical.
- `OrderedBy` is the ordering clinician.
- Critical values (e.g., K+ > 6.5 mEq/L) require immediate callback — this app flags via `Status = Critical`.

### Appointments (Scheduling / PAS)
Patient Administration Systems (PAS) manage scheduling. Key real-world statuses:
- **Scheduled** → confirmed slot
- **Completed** → encounter happened, charges generated
- **Cancelled** → patient or provider cancellation (no-charge)
- **NoShow** → patient did not arrive (tracked for population health)

### Dashboard / Analytics (Clinical Decision Support)
In enterprise HIS (Allscripts, Epic Healthy Planet), dashboards serve:
- **Census view**: current inpatients by unit, bed occupancy.
- **Quality metrics**: readmission rates, length-of-stay, HCAHPS scores.
- **Alerts**: sepsis flags, abnormal vitals, overdue medications.
This app implements a simplified version: KPI cards, vitals trend charts, condition mix, age distribution.

---

## Current Implementation Status

### Fully Implemented ✅
- JWT authentication (register/login/me) with BCrypt password hashing
- Role-based access control (Doctor/Nurse/Admin) on backend
- Patient CRUD with search, filtering, pagination, sorting
- Full patient profile: vitals, medications, test results, medical conditions, timeline, printable view
- Appointments CRUD + status transitions + list/calendar views
- Dashboard: KPIs, vitals trend chart, condition pie chart, age distribution, today's appointments, critical alerts
- Analytics page: demographics, condition frequencies, success rate
- Reports: CSV/JSON export
- Dark mode + toast notifications + empty/error states
- Docker Compose full-stack deployment
- FluentValidation on backend
- RFC 7807 Problem Details error format throughout
- SQLite (dev) + SQL Server (prod) dual support via auto-detection
- Comprehensive `/docs` folder (overview, architecture, API, auth, data model, frontend, conventions, roadmap)

### In Progress / Planned 🚧⏳
- Accessibility pass (aria labels, focus rings, keyboard nav)
- Frontend test coverage (Vitest + React Testing Library)
- Backend unit tests (xUnit for services)
- Pagination UI in PatientTable
- Inline vitals editing
- Appointment calendar week view (component exists, needs polish)
- Refresh tokens + HttpOnly cookie auth
- File uploads for test result attachments
- WebSocket/SSE push for real-time vitals alerts
- Audit log (who viewed/edited which record)
- Patient portal (read-only self-service)
- Basic RBAC admin UI

### Future Ideas 💭
- FHIR R4 import/export (demo-only)
- AI-powered vitals trend summaries (local LLM integration)
- Mobile-first redesign
- HL7 v2 message parsing for lab results

---

## Architecture

```
┌─────────────────────────────┐     HTTPS/JSON + Bearer JWT     ┌──────────────────────────────┐
│  React 18 + Vite (port 5173) │  ──────────────────────────▶   │  ASP.NET Core 8 (port 5000)  │
│  TypeScript, Tailwind CSS    │                                 │  10 REST controllers          │
│  TanStack Query v5           │  ◀──────────────────────────   │  EF Core + FluentValidation   │
│  React Hook Form + Zod       │      RFC 7807 JSON errors       │  JWT (HS256) + BCrypt         │
│  Recharts, Framer Motion     │                                 │  Swagger UI (/swagger)        │
└─────────────────────────────┘                                 └──────────────────────┬───────┘
                                                                                        │ EF Core
                                                                           ┌────────────▼────────────┐
                                                                           │  SQLite (dev: meddash.db)│
                                                                           │  SQL Server (prod)       │
                                                                           └─────────────────────────┘
```

### Request Flow
1. User action → React component
2. Component calls custom hook (e.g., `usePatients`)
3. Hook uses TanStack Query → API module (e.g., `api/patients.ts`)
4. API module calls `api/client.ts` → HTTP request with JWT header
5. ASP.NET Core → JWT middleware → Controller → Service → EF Core → DB
6. Response: DTO → JSON → React Query cache → component re-render

---

## File Map (Key Locations)

```
backend/
  Controllers/          # AuthController, PatientsController, AppointmentsController,
                        # DashboardController, VitalsController, MedicationsController,
                        # TestResultsController, MedicalConditionsController,
                        # ReportsController, HealthController
  Models/               # EF entities (Patient, User, Vital, etc.)
  Models/DTOs/          # Request/response shapes (contract boundary)
  Services/             # Business logic (PatientService, etc.)
  Data/                 # MedicalContext (DbContext), DbSeeder
  Auth/                 # JwtTokenService
  Middleware/           # ExceptionHandlingMiddleware
  Validation/           # FluentValidation validators
  Program.cs            # Composition root: DI, CORS, JWT, Swagger, EF

frontend/src/
  api/                  # client.ts (HTTP base) + one module per resource
  components/
    Layout/             # Sidebar, Header
    Dashboard/          # MetricCard, charts
    Patients/           # PatientProfile, PatientFormModal, tabs (Vitals/Meds/Tests/Conditions/Timeline)
    Appointments/       # AppointmentFormModal, WeeklyCalendar
    auth/               # ProtectedRoute, RequireRole
    ui/                 # Badge, Button, Input, Select, Modal, Spinner, Tabs, etc.
  context/              # AuthContext, ThemeContext
  hooks/                # usePatients, usePatient, useAppointments, useDashboard,
                        # useVitals, useMedications, useTestResults, useMedicalConditions,
                        # useDebounce, usePreference
  pages/                # Dashboard, Patients, Appointments, Analytics, Reports,
                        # Profile, Settings, Login, Register, NotFound, PatientPrint
  types/index.ts        # All TypeScript types — must mirror backend DTOs
  utils/constants.ts    # Enums, thresholds, display maps
```

---

## Stack Details

| Layer      | Technology              | Version  | Purpose                              |
|------------|-------------------------|----------|--------------------------------------|
| Frontend   | React                   | 18.3.1   | UI framework                         |
| Frontend   | TypeScript              | 5.x      | Type safety                          |
| Frontend   | Vite                    | 7.1.3    | Build tool + dev server              |
| Frontend   | Tailwind CSS            | 3.4.1    | Utility-first styling                |
| Frontend   | TanStack Query          | 5.59.0   | Server state, caching, mutations     |
| Frontend   | React Hook Form         | 7.53.0   | Form state management                |
| Frontend   | Zod                     | 3.23.8   | Schema validation                    |
| Frontend   | Recharts                | 3.1.2    | Charts (line, pie, bar)              |
| Frontend   | Framer Motion           | 12.23.12 | Animations and transitions           |
| Frontend   | Lucide React            | 0.344.0  | Icon set                             |
| Frontend   | react-hot-toast         | 2.4.1    | Toast notifications                  |
| Frontend   | date-fns                | 3.6.0    | Date formatting and calculation      |
| Frontend   | React Router            | 7.8.1    | Client-side routing                  |
| Backend    | ASP.NET Core            | 8.0      | Web API framework                    |
| Backend    | Entity Framework Core   | 8.0.0    | ORM (code-first, migrations)         |
| Backend    | FluentValidation        | 11.3.0   | Request validation                   |
| Backend    | BCrypt.Net-Next         | 4.0.3    | Password hashing                     |
| Backend    | Swashbuckle (Swagger)   | 6.5.0    | API documentation UI                 |
| Database   | SQLite                  | —        | Dev/local (zero config)              |
| Database   | SQL Server              | 2022     | Production (Docker or Azure)         |

---

## Developer Conventions

### TypeScript / React
- No `any`. Everything typed. Use `unknown` + type guards at boundaries.
- Named exports for components and hooks. Default export only for page components.
- Custom hooks own server state (TanStack Query). Components own only ephemeral UI state.
- Use `react-hook-form` + Zod for all forms. No uncontrolled inputs with manual state.
- Tailwind utility classes only — no custom CSS files unless necessary.
- Framer Motion for animations; Recharts for all charts. Do not add competing libraries.

### C# / ASP.NET Core
- Async everywhere: method names end in `Async`, return `Task<T>`.
- Thin controllers: delegate to services, never query DB directly in controllers.
- DTOs are the only thing crossing the API boundary — never expose EF entities directly.
- FluentValidation for all POST/PUT request bodies.
- Return RFC 7807 Problem Details for errors (`ValidationProblem`, `Problem`).
- `CreatedAtAction` for 201 responses on POST.

### DTO ↔ Type Sync Rule
`backend/Models/DTOs/*.cs` and `frontend/src/types/index.ts` are **two representations of the same contract**. Change one → change the other immediately. Never let them drift.

### Commit Messages (Conventional Commits)
```
feat(scope):    new user-visible capability
fix(scope):     bug fix
refactor:       no behaviour change
test:           adding/updating tests
docs:           documentation only
chore:          tooling, deps, CI
```

### Adding a Feature (Vertical Slice)
1. Read `docs/api.md` + `docs/frontend.md` for the right layer.
2. Update `types/index.ts` (frontend) + corresponding DTO (backend) first.
3. Add/update backend: controller endpoint → service method → EF query.
4. Run `dotnet build` to confirm.
5. Add frontend: API module function → custom hook → component/page.
6. Run `npm run typecheck && npm run lint`.
7. Update `docs/api.md` and `docs/data-model.md` if shape changed.
8. Update this CLAUDE.md if scope or conventions changed.

---

## Authentication & Security Notes

- JWT (HS256), token stored in `localStorage` — XSS risk acknowledged (demo trade-off).
- BCrypt rounds = 12 for password hashing.
- Protected routes: all `/api/*` except `/api/auth/*` and `/api/health` require valid Bearer token.
- Role enforcement:
  - DELETE patient → Doctor or Admin only
  - PUT/DELETE appointment → Doctor or Admin only
  - (Planned) audit log writes → Doctor/Admin only
- Never hard-code JWT secret. Use env var `Jwt__Key` (min 32 chars). Dev fallback exists but logs a warning.
- Seeded demo accounts (dev only — all use password `Password123!`):
  - **Doctors**: `doctor@meddash.local` (Dr. Alex Smith), `priya.patel@meddash.local`, `marcus.chen@meddash.local`, `olivia.brennan@meddash.local`
  - **Nurses**: `nurse@meddash.local` (Jamie Lee), `carlos.reyes@meddash.local`, `maya.singh@meddash.local`, `daniel.park@meddash.local`
  - **Admin**: `admin@meddash.local`

---

## Known Gotchas

| Issue | Detail |
|-------|--------|
| API base URL trailing slash | `apiConfig.baseURL` must NOT end with `/`. Use `"/patients"` not `"//patients"`. |
| DB auto-detection | Backend picks SQLite if connection string contains `Data Source=`, SQL Server if it contains `Server=`. Never hard-code the provider. |
| `lucide-react` in Vite | Excluded from `optimizeDeps` intentionally — do not remove that config line. |
| Framer Motion + Recharts | Both installed. Reuse them; don't add a competing animation or chart library. |
| Session expiry | `api/client.ts` emits `auth:expired` event → `AuthContext` catches it, clears state, shows toast, redirects to login. |
| Cascade deletes | Deleting a Patient cascades to all vitals, appointments, medications, conditions, and test results. |
| Time zones | Server uses local time everywhere. No UTC normalization yet. Known limitation. |
| Not HIPAA-compliant | Do not add features that imply compliance (real integrations, DICOM viewer, actual patient photo PII). |

---

## Quick Start

```bash
# Backend  →  http://localhost:5000  (Swagger at /swagger)
cd backend && dotnet restore && dotnet run

# Frontend  →  http://localhost:5173
cd frontend && npm install && npm run dev

# Full stack via Docker
docker compose up --build

# Type check + lint (frontend)
cd frontend && npm run typecheck && npm run lint

# Add a DB migration
cd backend && dotnet ef migrations add <MigrationName> && dotnet ef database update
```

---

## What We Are Building Next

The following features are the active work direction (as of May 2025):

1. **Accessibility pass** — focus rings, aria-labels, keyboard navigation across all interactive elements.
2. **Frontend test suite** — Vitest + React Testing Library for critical flows (auth, patient CRUD, appointments).
3. **Backend unit tests** — xUnit tests for service layer (PatientService, etc.).
4. **Pagination UI** — wire up `PagedResult<T>` pagination in the PatientTable component.
5. **Appointment calendar polish** — WeeklyCalendar component exists, needs week navigation and event detail popover.
6. **Real-time vitals alerts** — WebSocket or SSE endpoint pushing critical threshold alerts to connected clients.
7. **Audit log** — record who viewed/modified which patient record; surface in Admin UI.

When starting any new feature: read the relevant section in `docs/`, plan the smallest vertical slice from DB to UI, sync types on both sides first.
