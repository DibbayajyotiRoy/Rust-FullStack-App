# 🧑‍💼 Employee Management System

<p align="center">
  <b>A production-ready full-stack Employee Management System</b><br/>
  Built with a <b>Rust server-side backend</b> and a modern React frontend.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Backend-Rust-orange?style=flat-square" alt="Backend: Rust" />
  <img src="https://img.shields.io/badge/Framework-Axum-blue?style=flat-square" alt="Framework: Axum" />
  <img src="https://img.shields.io/badge/Database-PostgreSQL-336791?style=flat-square" alt="Database: PostgreSQL" />
  <img src="https://img.shields.io/badge/Frontend-React-61DAFB?style=flat-square" alt="Frontend: React" />
  <img src="https://img.shields.io/badge/Runtime-Docker-black?style=flat-square" alt="Runtime: Docker" />
</p>

---

## 📌 Overview

This project is a **full-stack Employee Management System (EMS)** designed with **scalability, maintainability, and production-readiness** in mind.

- **Backend**: Rust (Axum) – server-side rendered API & static frontend serving
- **Frontend**: React + Tailwind + shadcn/ui
- **Database**: PostgreSQL
- **Deployment**: Docker & Docker Compose

The backend serves both:
- REST APIs under `/api/*`
- The compiled frontend SPA from the same origin

👉 **No CORS. No proxy hacks. Clean architecture.**

---

## 🏗 Architecture

```mermaid
graph TD
    A[Frontend: React + Tailwind + shadcn/ui] -->|same-origin| B(Rust Backend: Axum • SQLx • Tokio);
    B --> C[PostgreSQL DB];
    subgraph Rust Backend
        B1[/api/* → REST endpoints]
        B2[/* → React SPA]
    end
    B -.-> B1
    B -.-> B2
```

### ⚙️ Backend (Rust – Server Side)

**Tech Stack**
- **Rust**
- **Axum** – HTTP server & routing
- **SQLx** – async PostgreSQL driver
- **Tokio** – async runtime
- **UUID** – primary keys
- **Docker** – containerized runtime

**Key Backend Features**
- Modular architecture (models, services, handlers, routes)
- Runtime-safe SQL (Docker-compatible, no compile-time DB dependency)
- Shared application state via `AppState`
- SPA fallback routing (client-side routing works on refresh)
- Clean REST API design

**Example API Routes**
```rust
GET    /api/users
POST   /api/users
GET    /api/users/{id}
PUT    /api/users/{id}
DELETE /api/users/{id}
```

### 🎨 Frontend

**Tech Stack**
- **React**
- **TypeScript**
- **Tailwind CSS**
- **shadcn/ui**
- **Sonner** (toasts & notifications)

**UI Architecture**
```yaml
components/
  ├─ atoms/
  ├─ molecules/
  ├─ organisms/
  └─ ui/ (design system)

pages/
  └─ UserPage.tsx

state/
  └─ user.store.ts (state + side effects)

services/
  └─ user.service.ts (API calls only)

api/
  ├─ endpoints.ts
  └─ http.ts
```

**UI Features**
- Sidebar-based admin layout
- Responsive (desktop / tablet / mobile)
- Search & filtering
- Add / Edit / Delete employees
- Accessible components
- Clean spacing & layout discipline

---

## 🐳 Running with Docker

**Prerequisites**
- Docker
- Docker Compose

**Start the full stack**
```bash
docker compose up --build
```

**Services started:**
1. Rust API + frontend server
2. PostgreSQL database

**Backend runs on:**
http://localhost:8000

---

## 🗄 Database

- **PostgreSQL**
- Managed via SQL migrations
- UUID primary keys
- Timestamped records

**Example table:**
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY,
  username TEXT,
  email TEXT,
  password_hash TEXT,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

---

## 🔒 Design Principles

- **Server-side first** (no frontend proxy hacks)
- **Same-origin architecture**
- **Strict separation of concerns**
  - No business logic in UI
  - No SQL in handlers
  - No API calls in components

This codebase is designed to scale beyond CRUD into:
- Roles & permissions
- Audit logs
- Organization hierarchies
- HR workflows

---

## 🚀 Future Enhancements

- [ ] Authentication & RBAC
- [ ] Pagination & filtering at DB level
- [ ] Activity audit logs
- [ ] WebSockets for live updates
- [ ] Admin role management
- [ ] CI/CD pipeline

---

## 📄 License

**MIT License**
Use freely for learning, internal tools, or production systems.

---

## ✨ Author

Built with an emphasis on correct architecture, not shortcuts.
**Rust on the server. Clean UI on the client. No compromises.**

<p align="center">
  <sub>“Good systems are boring. Boring means predictable. Predictable means scalable.”</sub>
</p>
