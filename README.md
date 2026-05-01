<p align="center">
  <img src="public/logo.svg" alt="COMCAT University Logo" width="120" height="120" />
</p>

<h1 align="center">COMCAT University — Official Web Portal</h1>

<p align="center">
  A modern, full-stack university management portal built with Next.js 16, Supabase, and Tailwind CSS.<br/>
  Developed by <strong>Muhammad Kashif Latif</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16-black?logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/TypeScript-5-blue?logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-4-38B2AC?logo=tailwind-css" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?logo=supabase" alt="Supabase" />
  <img src="https://img.shields.io/badge/shadcn/ui-Components-black" alt="shadcn/ui" />
</p>

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Demo Credentials](#demo-credentials)
- [API Routes](#api-routes)
- [Database Schema](#database-schema)
- [Deployment](#deployment)
- [License](#license)

---

## Overview

COMCAT University Portal is a comprehensive web-based management system designed for universities. It provides three distinct role-based interfaces — **Admin**, **Teacher**, and **Student** — alongside a fully featured public-facing website with an AI-powered chatbot.

The application is a single-page architecture built on Next.js 16 with the App Router, using Supabase (PostgreSQL) as the backend database via its REST API (PostgREST). Authentication is handled by NextAuth.js v4.

---

## Features

### Public Website
- Hero section with campus imagery
- Programs & departments showcase
- University history timeline
- News & announcements feed
- Online admission inquiry form
- Contact form with email support
- AI-powered chatbot (GPT-based)

### Admin Portal
- Dashboard with statistics (students, teachers, subjects, announcements, unread messages)
- Student management (create, view, edit, delete)
- Teacher management (create, view, edit, delete)
- Subject management (CRUD with teacher assignment)
- Announcement management (create, edit, delete)
- Admission inquiry review and status management
- Contact message inbox

### Teacher Portal
- Personal dashboard with assigned subjects and student counts
- View enrolled students per subject
- Mark daily attendance (present / absent)

### Student Portal
- Personal dashboard with GPA, enrolled subjects, and attendance overview
- View enrolled subjects with teacher details and credit hours
- View attendance history with percentage breakdown
- View fee records and payment status

### Cross-Platform
- Fully responsive design (mobile-first)
- Dark "Sigma" theme with gold accents
- State management via Zustand
- Toast notifications via Sonner

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | Next.js 16 (App Router) |
| **Language** | TypeScript 5 |
| **Styling** | Tailwind CSS 4 + shadcn/ui |
| **Database** | Supabase (PostgreSQL) via REST API |
| **Authentication** | NextAuth.js v4 |
| **State Management** | Zustand |
| **Server State** | TanStack Query |
| **Icons** | Lucide React |
| **Forms** | React Hook Form + Zod |
| **Animations** | Framer Motion |
| **AI Chatbot** | z-ai-web-dev-sdk (GPT) |

---

## Project Structure

```
comcat-university/
├── public/                      # Static assets
│   ├── logo.svg
│   ├── hero-campus.jpg
│   └── robots.txt
├── prisma/                      # Legacy Prisma schema (migrated to Supabase)
│   ├── schema.prisma
│   └── seed.ts
├── src/
│   ├── app/
│   │   ├── api/                 # API routes (14 endpoints)
│   │   │   ├── auth/[...nextauth]/route.ts
│   │   │   ├── dashboard/route.ts
│   │   │   ├── students/route.ts
│   │   │   ├── teachers/route.ts
│   │   │   ├── subjects/route.ts
│   │   │   ├── enrollments/route.ts
│   │   │   ├── attendance/route.ts
│   │   │   ├── fees/route.ts
│   │   │   ├── admissions/route.ts
│   │   │   ├── announcements/route.ts
│   │   │   ├── contact/route.ts
│   │   │   ├── subject-teachers/route.ts
│   │   │   ├── ai-chat/route.ts
│   │   │   └── route.ts
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx             # Single-page app entry
│   ├── components/
│   │   ├── admin/               # Admin portal components (7)
│   │   ├── teacher/             # Teacher portal components (4)
│   │   ├── student/             # Student portal components (5)
│   │   ├── public/              # Public website sections (8)
│   │   ├── auth/                # Login form
│   │   ├── layout/              # Navbar, Footer
│   │   ├── ui/                  # shadcn/ui components (50+)
│   │   └── ai-chat-widget.tsx   # Floating AI chatbot
│   ├── hooks/                   # Custom React hooks
│   ├── lib/                     # Utilities (supabase, auth, utils)
│   ├── store/                   # Zustand stores
│   └── types/                   # TypeScript type definitions
├── .env.local.example
├── package.json
├── tsconfig.json
├── next.config.ts
├── tailwind.config.ts
└── README.md
```

---

## Getting Started

### Prerequisites

- **Node.js** >= 18
- **npm**, **yarn**, or **bun**
- A **Supabase** project (or any PostgreSQL database with a REST API layer)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/kashif-Latif/comcat-university.git
   cd comcat-university
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**

   Create a `.env.local` file in the project root (see [Environment Variables](#environment-variables) below).

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open in browser**
   Navigate to `http://localhost:3000`

### Build for Production

```bash
npm run build
npm start
```

---

## Environment Variables

Create a `.env.local` file in the root of the project:

```env
# ─── Supabase ───────────────────────────────────────────
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# ─── NextAuth ───────────────────────────────────────────
NEXTAUTH_SECRET=your-nextauth-secret
NEXTAUTH_URL=http://localhost:3000

# ─── Nodemailer (Contact Form) ──────────────────────────
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
CONTACT_EMAIL=your-email@gmail.com

# ─── AI Chat (z-ai-web-dev-sdk) ────────────────────────
AI_API_KEY=your-ai-api-key
```

> **Note:** Replace placeholder values with your actual credentials. Never commit `.env.local` to version control.

---

## Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| **Admin** | admin@comcat.edu.pk | Admin@123456 |
| **Teacher** | prof.qasim@comcat.edu.pk | Teacher@123456 |
| **Student** | hassan.ali@student.comcat.edu.pk | Student@123456 |

---

## API Routes

All routes are prefixed with `/api/` and use standard HTTP methods.

| Endpoint | Methods | Description |
|----------|---------|-------------|
| `/api/auth/[...nextauth]` | POST, GET | NextAuth authentication |
| `/api/dashboard` | GET | Dashboard statistics |
| `/api/students` | GET, POST, PATCH, DELETE | Student CRUD |
| `/api/teachers` | GET, POST, PATCH, DELETE | Teacher CRUD |
| `/api/subjects` | GET, POST, PATCH, DELETE | Subject CRUD |
| `/api/enrollments` | GET, POST, DELETE | Student-subject enrollments |
| `/api/attendance` | GET, POST | Attendance records |
| `/api/fees` | GET, POST, PATCH | Fee management |
| `/api/admissions` | GET, POST, PATCH | Admission inquiries |
| `/api/announcements` | GET, POST, PATCH, DELETE | Announcements CRUD |
| `/api/contact` | GET, POST | Contact form messages |
| `/api/subject-teachers` | GET | Subject-teacher mappings |
| `/api/ai-chat` | POST | AI chatbot endpoint |

---

## Database Schema

The application uses Supabase (PostgreSQL). Key tables include:

| Table | Description |
|-------|-------------|
| `users` | All users with roles (ADMIN, TEACHER, STUDENT) |
| `teachers` | Teacher profiles linked to users |
| `subjects` | Course/subject catalog with credit hours |
| `enrollments` | Student-subject enrollment mappings |
| `attendance_records` | Daily attendance (present/absent) |
| `fees` | Student fee records and payment status |
| `admissions` | Admission inquiry submissions |
| `announcements` | University announcements |
| `contact_messages` | Contact form submissions |

---

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import the repository in [Vercel](https://vercel.com)
3. Add all environment variables in the Vercel dashboard
4. Deploy

### Docker (Alternative)

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

### Any Node.js Host

The project builds to a standalone server in `.next/standalone/`. Ensure all environment variables are set on the host.

---

## Contributing

Contributions are welcome. Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -m 'Add your feature'`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Open a Pull Request

---

## License

This project is proprietary software developed for COMCAT University. All rights reserved.

&copy; 2025 COMCAT University. Developed by Muhammad Kashif Latif.
