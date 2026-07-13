# Smansys — School Management Admin Dashboard

A MERN-stack admin system with two roles:

- **Super Admin** — onboards schools, reviews and approves/rejects registrations, views platform-wide stats
- **School Admin** — imports teachers/students via CSV, manages fee structures, and sends bulk fee reminder emails to parents

## Tech Stack
- **Frontend:** React (Vite), React Router, React Hook Form + Zod, Tailwind CSS, Axios
- **Backend:** Node.js, Express.js, JWT auth, Multer (CSV upload), Nodemailer
- **Database:** MongoDB (Mongoose)

## Project Structure
```
smansys/
  backend/     Express API, MongoDB models, controllers, routes
  frontend/    React app (Vite)
```

## Prerequisites
- Node.js 18+
- MongoDB running locally, or a MongoDB Atlas connection string
- An SMTP-capable email account (e.g. Gmail with an App Password) for sending fee reminder emails

## 1. Backend Setup

```bash
cd backend
npm install
cp .env.example .env
```

Edit `.env` with your values:

| Variable | Description |
|---|---|
| `MONGO_URI` | MongoDB connection string |
| `PORT` | API port (default 5000) |
| `JWT_SECRET` | Any long random string |
| `JWT_EXPIRES_IN` | Token lifetime, e.g. `7d` |
| `EMAIL_HOST` / `EMAIL_PORT` | SMTP server details |
| `EMAIL_USER` / `EMAIL_PASS` | SMTP credentials (use a Gmail App Password, not your login password) |
| `EMAIL_FROM` | Sender display name/address |
| `CLIENT_URL` | Frontend URL, for CORS (default `http://localhost:5173`) |

Seed the database with sample data:
```bash
npm run seed
```

This creates:
- Super Admin: `superadmin@smansys.com` / `Password123`
- School Admin (approved school): `admin@greenwood.edu` / `Password123`
- School Admin (pending school, login blocked until approved): `admin@sunrise.edu` / `Password123`

Run the API:
```bash
npm run dev
```
API runs at `http://localhost:5000`.

## 2. Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```
App runs at `http://localhost:5173`.

## Using the App
1. Log in as `superadmin@smansys.com` — you'll see the Super Admin dashboard, can onboard new schools, and approve/reject pending ones.
2. Log in as `admin@greenwood.edu` (already approved) — you'll see the School Admin dashboard. Try importing teachers/students via CSV, adding a fee structure, and sending reminder emails.
3. Try logging in as `admin@sunrise.edu` — this will be blocked with a message, since that school is still `pending`. Approve it as Super Admin first to unblock the login.

## CSV Import Format

**Teachers CSV columns:** `name, email, phone, subject, qualification`

**Students CSV columns:** `name, rollNumber, class, section, parentName, parentEmail, parentPhone`

The importer reports per-row success/failure — a malformed row won't block the rest of the file from importing.

## Notes on Design Fidelity
The UI was built to a clean, modular admin-dashboard structure (Tailwind design tokens in `frontend/tailwind.config.js`) since the actual Figma frames weren't accessible for pixel-level extraction. Swap the color tokens (`navy`, `teal`) and spacing in `tailwind.config.js` to match the exact Figma palette, and adjust component padding/typography in `src/components/` accordingly.

## Notes for Interview Walkthrough
- **Auth flow:** JWT issued on login → stored in `localStorage` → attached via Axios interceptor → verified by `protect` middleware → role checked by `authorize` middleware on each route.
- **School approval gating:** a School Admin's login is blocked at the auth-controller level until their `School.status === "approved"` — enforced server-side, not just hidden in the UI.
- **CSV import resilience:** each row is processed independently; failures are collected and returned instead of aborting the whole import (see `schoolAdminController.js`).
- **Fee reminders:** each send attempt is logged to `FeeReminderLog` (success or failure per parent), giving an audit trail rather than a fire-and-forget email blast.
