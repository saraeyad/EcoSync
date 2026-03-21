# EcoSync

**EcoSync** is an industrial IoT and sustainability dashboard. It helps teams monitor facilities in real time, track energy and carbon metrics, and stay on top of compliance—all in one place.

---
live URL :https://eco-sync-git-main-sara-ismails-projects.vercel.app/
## Purpose

Companies with multiple sites (factories, plants, energy assets) need a single view of:

- **Where** their facilities are and how they’re performing
- **How** energy and carbon metrics behave over time
- **Whether** they meet environmental and compliance targets
- **When** something needs attention (alerts and anomalies)

EcoSync provides that view: a web app where you can see a **global map** of facilities, drill into **live energy and efficiency data**, check **compliance status**, and react to **alerts**—with a modern, responsive UI and a backend (Supabase) ready for real data.

---

## Features

- **Command Center** — KPIs, world map, facility grid, live energy chart, and alerts in one dashboard
- **Factories** — List and manage facilities; add new sites; export data (CSV/JSON)
- **Analytics** — Charts and trends for energy, carbon, and efficiency
- **Global Map** — Geographic view of all facilities with status (online / warning / offline)
- **Energy Flow** — Per-facility and global energy streams over time
- **Compliance** — Track standards and pass/fail status
- **Forecasting** — Trend and target views
- **Alerts** — Notifications and quick access from the sidebar
- **Settings & Profile** — User profile, facility management, and data export

---

## Tech Stack

- **React 19** + **TypeScript** + **Vite**
- **Tailwind CSS** + **Framer Motion**
- **Zustand** (state) + **React Router**
- **Supabase** (backend: factories, alerts, compliance)
- **Recharts** (charts) + **React Three Fiber** (3D / visuals)
- **React Hook Form** + **Zod** (forms and validation)

---

## Project Structure (high level)

- `src/views/` — Feature-based pages (auth, home, dashboard, settings, profile, error)
- `src/components/` — Shared UI and 3D components
- `src/hooks/` — Store and feature hooks (auth, UI, factories, alerts, etc.)
- `src/services/` — API / Supabase logic (factories, alerts, compliance)
- `src/config/` — Theme and app config
- `src/constants/` — Navigation, profile, and other constants
- `src/router/` — Routes and protected route logic

---
