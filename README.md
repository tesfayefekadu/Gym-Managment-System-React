# Gym Management System

A full-stack web application for managing a gym across multiple **Woredas** (branches/districts): members, membership plans, trainers, payments, and attendance, with **role-based access control (RBAC)** and **Woreda-level data isolation**.

Built with the **PERN** stack: **P**ostgreSQL, **E**xpress, **R**eact, **N**ode.js.

---

## Features

- **Authentication**: JWT login, with the role and Woreda carried in the token
- **Role-based access control**: Admin, Manager, and Staff roles with different permissions
- **Woreda isolation**: Managers and Staff only ever see and change data from their own Woreda
- **Members**: register, edit, search, and manage gym members
- **Membership plans**: create and manage plans
- **Trainers**: manage trainers (Admin and Manager only)
- **Payments**: record and track member payments
- **Attendance**: record daily check-in and check-out
- **User management**: Admin creates Managers; Managers create Staff
- **Dashboard**: overview charts (Recharts)
- **Security**: Helmet, CORS allow-list, rate-limited login, bcrypt password hashing, input validation

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, Vite, React Router 7, Tailwind CSS 4, Recharts |
| Backend | Node.js, Express 5, express-validator, Helmet, express-rate-limit |
| Database | PostgreSQL (`pg` connection pool) |
| Auth | JSON Web Tokens (`jsonwebtoken`), `bcrypt` |

---

## Roles and Permissions

| Module | Admin | Manager | Staff |
|---|---|---|---|
| **Woredas** | Full access | none | none |
| **Users** | View all; create Managers | View own Woreda; create Staff | none |
| **Members** | Full access | Full access | View, create, edit (no delete) |
| **Membership plans** | Full access | Full access | View only |
| **Trainers** | Full access | Full access | none |
| **Payments** | Full access | Full access | View and record (no edit or delete) |
| **Attendance** | Full access | Full access | View, record, edit (no delete) |

### Woreda scoping

| Role | Data visible |
|---|---|
| **Admin** | All Woredas |
| **Manager** | Own Woreda only |
| **Staff** | Own Woreda only |

- Members, plans, and trainers are tied directly to a Woreda.
- Payments and attendance belong to the Woreda of their **member**.
- Records from another Woreda return `404 Not Found` (not `403`), so IDs from other Woredas are not revealed.
- Enforcement happens on the **backend** (`authMiddleware`, `roleMiddleware`, `woredaMiddleware`, and the `getWoredaScope` helper). Hiding buttons in the UI is only for convenience.

---

## Project Structure

```
.
├── server/                     # Express API
│   ├── config/                 # Database connection (db.js)
│   ├── controllers/            # Request/response logic
│   ├── middleware/             # auth, role, woreda, validation, error handling
│   ├── routes/                 # API route definitions
│   ├── services/               # Database access (users, woredas)
│   ├── utils/                  # woredaScope helper
│   ├── validators/             # express-validator rules
│   └── index.js                # App entry point
│
└── sr/                         # React frontend (Vite)
    └── src/
        ├── components/         # UI components, grouped by module
        ├── hooks/              # Data hooks (useTrainers, ...)
        ├── pages/              # Dashboard, Members, Trainers, Payments, ...
        ├── routes/             # AppRoutes + ProtectedRoute (role guards)
        └── services/           # API calls
```

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) 18 or newer
- [PostgreSQL](https://www.postgresql.org/) 13 or newer
- npm

### 1. Clone the repository

```bash
git clone https://github.com/tesfayefekadu/Gym-Managment-System-React.git
cd Gym-Managment-System-React
```

### 2. Set up the database

Create a database and run your schema:

```bash
psql -U postgres -c "CREATE DATABASE gym_management;"
```

The application expects these tables:

`woredas`, `users`, `members`, `membership_plans`, `trainers`, `payments`, `attendance`

Then run the migration that adds Woreda support to trainers and the performance indexes:

```bash
psql -U postgres -d gym_management -f database/001_trainer_woreda_and_indexes.sql
```

> If you already have trainers, assign each one a Woreda (see the commented `UPDATE` in that file). Managers cannot see trainers that have no Woreda.

You also need at least one **Admin** user in the `users` table. Public registration is disabled, so the first Admin must be inserted directly (store a **bcrypt** hash in `password_hash`).

### 3. Run the backend

```bash
cd server
npm install
```

Create `server/.env`:

```env
PORT=5000
FRONTEND_URL=http://localhost:5173

DB_USER=postgres
DB_HOST=localhost
DB_NAME=gym_management
DB_PASSWORD=your_database_password
DB_PORT=5432

JWT_SECRET=use_a_long_random_string_here
JWT_EXPIRES_IN=1d
```

Start the server:

```bash
npm run dev      # development (nodemon)
npm start        # production
```

Check it is running: open `http://localhost:5000/api/health`. It should report that the API and PostgreSQL are connected.

### 4. Run the frontend

```bash
cd sr
npm install
```

Create `sr/.env`:

```env
VITE_API_URL=http://localhost:5000
```

Start the dev server:

```bash
npm run dev
```

Open `http://localhost:5173` and log in.

---

## Environment Variables

### Backend (`server/.env`)

| Variable | Description | Example |
|---|---|---|
| `PORT` | API port | `5000` |
| `FRONTEND_URL` | Allowed CORS origin (the React app) | `http://localhost:5173` |
| `DB_USER` | PostgreSQL user | `postgres` |
| `DB_HOST` | PostgreSQL host | `localhost` |
| `DB_NAME` | Database name | `gym_management` |
| `DB_PASSWORD` | PostgreSQL password | n/a |
| `DB_PORT` | PostgreSQL port | `5432` |
| `JWT_SECRET` | Secret used to sign tokens (keep private) | long random string |
| `JWT_EXPIRES_IN` | Token lifetime | `1d` |

### Frontend (`sr/.env`)

| Variable | Description | Example |
|---|---|---|
| `VITE_API_URL` | Base URL of the API (without `/api`) | `http://localhost:5000` |

> Never commit `.env` files. Anything prefixed `VITE_` is bundled into the browser build and is public.

---

## API Overview

All endpoints except login require an `Authorization: Bearer <token>` header.

| Resource | Base path | Endpoints |
|---|---|---|
| Auth | `/api/auth` | `POST /login` |
| Users | `/api/users` | `GET /`, `GET /:id`, `POST /` |
| Woredas | `/api/woredas` | `GET /`, `GET /:id`, `POST /`, `PUT /:id` |
| Members | `/api/members` | `GET /`, `GET /:id`, `POST /`, `PUT /:id`, `DELETE /:id` |
| Membership plans | `/api/membership-plans` | `GET /`, `GET /:id`, `POST /`, `PUT /:id`, `DELETE /:id` |
| Trainers | `/api/trainers` | `GET /`, `GET /:id`, `POST /`, `PUT /:id`, `DELETE /:id` |
| Payments | `/api/payments` | `GET /`, `GET /:id`, `POST /`, `PUT /:id`, `DELETE /:id` |
| Attendance | `/api/attendance` | `GET /`, `GET /:id`, `POST /`, `PUT /:id`, `DELETE /:id` |
| Health | `/api/health` | `GET /` (public) |

Typical error responses: `400` invalid input, `401` not logged in, `403` role not allowed, `404` not found (including records from another Woreda), `409` duplicate.

---

## Frontend Routes

| Path | Access |
|---|---|
| `/login` | Public |
| `/dashboard`, `/members`, `/attendance`, `/payments`, `/membership-plans` | Admin, Manager, Staff |
| `/trainers`, `/users` | Admin, Manager |
| `/woredas` | Admin |

---

## Security Notes

- Passwords are hashed with bcrypt; plain-text passwords are never stored or logged.
- Login is rate-limited (20 requests per 15 minutes per IP).
- Public registration is **disabled**. Users are created through the protected `/api/users` endpoint.
- Always use a long, random `JWT_SECRET` and HTTPS in production.
- `server/resetManagerPassword.js` is a **development-only** helper with a hardcoded password. Delete it before deploying.

---

## Roadmap

- [ ] Automated tests (API with Jest/Vitest + Supertest, UI with React Testing Library)
- [ ] Refresh tokens and httpOnly cookie storage
- [ ] Member self-service portal
- [ ] Payment receipts and reports (PDF/Excel export)
- [ ] Docker Compose for local development
- [ ] CI pipeline (lint and tests on every pull request)

---

## Author

**Tesfaye Fekadu**: [github.com/tesfayefekadu](https://github.com/tesfayefekadu)