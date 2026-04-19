

<h1 align="center">COMCAT University</h1>

<p align="center">
  <strong>Official University Management Web Portal</strong><br/>
  A full-stack, role-based university management system built with Next.js, Prisma, and SQLite.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16-black?logo=next.js" alt="Next.js 16" />
  <img src="https://img.shields.io/badge/TypeScript-5-blue?logo=typescript&logoColor=white" alt="TypeScript 5" />
  <img src="https://img.shields.io/badge/Prisma-6-2D3748?logo=prisma&logoColor=white" alt="Prisma 6" />
  <img src="https://img.shields.io/badge/SQLite-3-003B57?logo=sqlite&logoColor=white" alt="SQLite" />
  <img src="https://img.shields.io/badge/NextAuth-4-1A1A1A?logo=next.js&logoColor=white" alt="NextAuth v4" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=black" alt="Tailwind CSS 4" />
  <img src="https://img.shields.io/badge/License-MIT-green.svg" alt="License" />
</p>

<p align="center">
  <a href="#-features">Features</a> •
  <a href="#-demo-credentials">Demo Credentials</a> •
  <a href="#-getting-started">Getting Started</a> •
  <a href="#-project-structure">Project Structure</a> •
  <a href="#-tech-stack">Tech Stack</a> •
  <a href="#-backend-architecture">Backend Architecture</a> •
  <a href="#-api-endpoints">API Endpoints</a> •
  <a href="#-screenshots">Screenshots</a> •
  <a href="#-license">License</a>
</p>

---

## About

**COMCAT University** is a comprehensive university management portal designed to handle all aspects of academic administration. It features role-based access for **Administrators**, **Teachers**, and **Students**, each with their own dedicated dashboard and functionality.

The system supports full CRUD operations for student and teacher management, course enrollment, attendance tracking, fee management, announcements, admissions, and a public-facing website — all in a sleek dark **Sigma theme** with gold accents.

**Designed & Developed by [Muhammad Kashif Latif](mailto:kashif.latif2004@gmail.com)**
**Visit the website = https://comcatuni.space.z.ai**

---

## Features

### 🏠 Public Website
- Responsive hero section with animated statistics
- Quick navigation grid with 6 section cards
- About page with mission, vision, and values
- 6 academic programs (BS CS, BS IT, BS DS, BS SE, BS Cyber Security, BS AI)
- University history timeline (2010–2024)
- News & announcements with category filtering
- Multi-step admissions application form with validation
- Contact form with real contact information

### 🔴 Admin Portal
- Dashboard with statistics overview and quick actions
- **Manage Students** — Full CRUD with search, filter, and department assignment
- **Manage Teachers** — Full CRUD with designation and qualification fields
- **Manage Subjects** — Full CRUD with teacher-subject assignment
- **Manage Announcements** — Create, edit, publish/unpublish announcements
- **Manage Messages** — View and mark contact messages as read

### 🔵 Teacher Portal
- Personal dashboard with profile and assigned subjects
- **View Students** — Students grouped by subject with search
- **Mark Attendance** — 3-step workflow: select date → select subject → mark students

### 🟢 Student Portal
- Dashboard with profile, enrollment stats, and progress bar
- **My Subjects** — Enrolled subjects with search and detail dialog
- **My Attendance** — Attendance history with filters and percentage calculation
- **My Fees** — Fee records with downloadable challan/receipt

### 🎨 Design & UX
- **Sigma Dark Theme** — Black (#0a0a0a), Dark Grey (#111), Gold (#C9A84C)
- Fully responsive (mobile-first)
- Framer Motion scroll-triggered animations
- shadcn/ui component library
- Accessible and keyboard-navigable

---

## Demo Credentials

| Role | Name | Email | Password |
|------|------|-------|----------|
| 🔴 Admin | Muhammad Kashif Latif | `admin@comcat.edu.pk` | `admin123` |
| 🔵 Teacher | Prof. Qasim Ali | `prof.qasim@comcat.edu.pk` | `teacher123` |
| 🟢 Student | Ahmed Khan | `ahmed.khan@student.comcat.edu.pk` | `student123` |

### All Teacher Accounts (10)

| # | Name | Email | Department |
|---|------|-------|------------|
| 1 | Prof. Qasim Ali | `prof.qasim@comcat.edu.pk` | Computer Science |
| 2 | Dr. Sarah Ahmed | `dr.sarah@comcat.edu.pk` | Information Technology |
| 3 | Prof. Bilal Hassan | `prof.bilal@comcat.edu.pk` | Data Science |
| 4 | Dr. Aiman Fatima | `dr.aiman@comcat.edu.pk` | Software Engineering |
| 5 | Prof. Kamran Raza | `prof.kamran@comcat.edu.pk` | Computer Science |
| 6 | Dr. Nida Hussain | `dr.nida@comcat.edu.pk` | Cyber Security |
| 7 | Prof. Imran Ashraf | `prof.imran@comcat.edu.pk` | Mathematics |
| 8 | Dr. Sobia Kiran | `dr.sobia@comcat.edu.pk` | Information Technology |
| 9 | Prof. Talha Mahmood | `prof.talha@comcat.edu.pk` | Computer Science |
| 10 | Dr. Zunaira Noor | `dr.zunaira@comcat.edu.pk` | Data Science |

> All teacher accounts share the same password: `teacher123`

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) 18+ (LTS recommended)
- [npm](https://www.npmjs.com/) (comes with Node.js) or [Bun](https://bun.sh/)
- [Git](https://git-scm.com/)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/your-username/comcat-university.git
cd comcat-university

# 2. Install dependencies
npm install
# or: bun install

# 3. Create environment file
cp .env.example .env
# Edit .env and set your NEXTAUTH_SECRET
```

### Environment Variables

Create a `.env` file in the project root:

```env
DATABASE_URL=file:./db/custom.db
NEXTAUTH_SECRET=your-secret-key-here
```

> Generate a secure secret: `openssl rand -base64 32`

### Database Setup

```bash
# Generate Prisma client
npx prisma generate

# Create database tables
npx prisma db push

# Seed with demo data (admin, teachers, students, subjects, etc.)
npx prisma db seed
```

### Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server on port 3000 |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npx prisma generate` | Generate Prisma Client |
| `npx prisma db push` | Push schema to database |
| `npx prisma db seed` | Seed database with demo data |
| `npx prisma studio` | Open Prisma Studio (visual DB browser) |

---

## Project Structure

```
comcat-university/
├── prisma/
│   ├── schema.prisma              # Database schema (9 models)
│   └── seed.ts                    # Database seeding script
│
├── db/
│   └── custom.db                  # SQLite database file
│
├── public/
│   ├── logo.svg                   # COMCAT University logo
│   ├── hero-campus.jpg            # Hero background image
│   └── robots.txt                 # SEO robots configuration
│
├── src/
│   ├── app/
│   │   ├── page.tsx               # Main SPA entry (single route)
│   │   ├── layout.tsx             # Root layout with metadata
│   │   ├── globals.css            # Sigma dark theme styles
│   │   └── api/
│   │       ├── auth/[...nextauth]/route.ts   # NextAuth handler
│   │       ├── admissions/route.ts
│   │       ├── announcements/route.ts
│   │       ├── attendance/route.ts
│   │       ├── contact/route.ts
│   │       ├── dashboard/route.ts
│   │       ├── enrollments/route.ts
│   │       ├── fees/route.ts
│   │       ├── students/route.ts
│   │       ├── subject-teachers/route.ts
│   │       ├── subjects/route.ts
│   │       └── teachers/route.ts
│   │
│   ├── components/
│   │   ├── public/                # Public website sections
│   │   │   ├── hero-section.tsx
│   │   │   ├── homepage-grid.tsx
│   │   │   ├── about-section.tsx
│   │   │   ├── programs-section.tsx
│   │   │   ├── history-section.tsx
│   │   │   ├── news-section.tsx
│   │   │   ├── admissions-section.tsx
│   │   │   └── contact-section.tsx
│   │   ├── admin/                 # Admin portal components
│   │   │   ├── admin-layout.tsx
│   │   │   ├── admin-dashboard.tsx
│   │   │   ├── manage-students.tsx
│   │   │   ├── manage-teachers.tsx
│   │   │   ├── manage-subjects.tsx
│   │   │   ├── manage-announcements.tsx
│   │   │   └── manage-messages.tsx
│   │   ├── teacher/               # Teacher portal components
│   │   │   ├── teacher-layout.tsx
│   │   │   ├── teacher-dashboard.tsx
│   │   │   ├── view-students.tsx
│   │   │   └── mark-attendance.tsx
│   │   ├── student/               # Student portal components
│   │   │   ├── student-layout.tsx
│   │   │   ├── student-dashboard.tsx
│   │   │   ├── my-subjects.tsx
│   │   │   ├── my-attendance.tsx
│   │   │   └── my-fees.tsx
│   │   ├── auth/
│   │   │   └── login-form.tsx     # Login form with demo credentials
│   │   ├── layout/
│   │   │   ├── navbar.tsx         # Navigation bar
│   │   │   └── footer.tsx         # Site footer
│   │   └── ui/                    # shadcn/ui components
│   │
│   ├── lib/
│   │   ├── auth.ts                # NextAuth configuration
│   │   ├── db.ts                  # Prisma database client
│   │   └── utils.ts               # Utility functions (cn, etc.)
│   │
│   ├── store/
│   │   └── use-app-store.ts       # Zustand state management
│   │
│   └── types/
│       └── next-auth.d.ts         # NextAuth TypeScript extensions
│
├── download/
│   ├── README.md
│   └── LOCAL-SETUP-GUIDE.md       # Detailed setup guide
│
├── .env                           # Environment variables (not committed)
├── .gitignore
├── package.json
├── tailwind.config.ts
├── tsconfig.json
├── eslint.config.mjs
├── postcss.config.mjs
├── components.json                # shadcn/ui configuration
└── README.md                      # This file
```

---

## Backend Architecture

### Database Layer — SQLite via Prisma ORM

- **Engine:** SQLite (zero-config, file-based)
- **Location:** `db/custom.db`
- **ORM:** Prisma Client 6.x
- **Schema:** 9 models defined in `prisma/schema.prisma`

**Data Models:**

```
User (ADMIN / TEACHER / STUDENT)
├── studentId, department, semester          → for STUDENT
├── teacherId, designation, qualification    → for TEACHER
├── enrollments         → Enrollment[]
├── attendanceStudent   → AttendanceRecord[]
├── attendanceTeacher   → AttendanceRecord[]
├── fees                → Fee[]
├── teacherSubjects     → SubjectTeacher[]
└── announcements       → Announcement[]

Subject ─────────────── Enrollment ────────── AttendanceRecord
├── code (unique)       studentId + subjectId    studentId + subjectId + date
├── name                (unique pair)            (unique triple)
├── credits, semester
├── department
└── teachers → SubjectTeacher[]

Fee                         Announcement              ContactMessage
├── studentId (FK)          ├── title                ├── name
├── semester, amount        ├── content              ├── email
├── status (PAID/PENDING)   ├── category             ├── subject
└── paidAmount, dueDate     └── authorId (FK)        └── message

Admission (standalone application form)
├── firstName, lastName, email, phone, cnic
├── program, previousDegree, previousGPA
└── status (PENDING/UNDER_REVIEW/ACCEPTED/REJECTED)
```

### Authentication — NextAuth.js v4

```
┌──────────┐     ┌──────────────────┐     ┌──────────┐
│  Browser  │────▶│  /api/auth/...   │────▶│  SQLite   │
│ (Client)  │     │  CredentialsProv │     │  users    │
└──────────┘     └──────────────────┘     └──────────┘
      │                   │
      │  1. POST email    │
      │     + password    │
      │  ◀────────────────│
      │  2. Validate with │
      │     bcrypt.compare │
      │  ◀────────────────│
      │  3. Return JWT    │
      │     (id, role)    │
      │                   │
      │  4. Cookie stored │
      │     in browser    │
      └───────────────────┘
```

- **Strategy:** JWT (stateless, no server-side session store)
- **Provider:** Credentials (email + password)
- **Password Hashing:** bcryptjs (12 salt rounds)
- **JWT Payload:** `{ id, role, email, name, iat, exp }`
- **Session Callback:** Extracts `id` and `role` from JWT into `session.user`
- **Config:** `src/lib/auth.ts` | **Route:** `src/app/api/auth/[...nextauth]/route.ts`

### State Management — Zustand

- **Store:** `src/store/use-app-store.ts`
- SPA-style view switching via `currentView` state
- Auth state synced from NextAuth session via `useEffect`
- Views: `home`, `login`, `about`, `news`, `contact`, `programs`, `history`, `admissions`, `admin-*`, `teacher-*`, `student-*`

### Seed Data Summary

| Data Type | Count |
|-----------|-------|
| Admin | 1 |
| Teachers | 10 |
| Students | 35 |
| Subjects | 12 |
| Enrollments | 76+ |
| Attendance Records | 1,140+ |
| Fee Records | 73 |
| Announcements | 7 |
| Contact Messages | 5 |

---

## API Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET/POST | `/api/auth/[...nextauth]` | Authentication (login, session, logout) | Public |
| GET/POST | `/api/admissions` | Admission applications | Public |
| GET/POST | `/api/contact` | Contact messages | Public |
| GET | `/api/dashboard` | Dashboard statistics | Admin |
| GET/POST | `/api/students` | Student CRUD | Admin |
| GET/POST | `/api/teachers` | Teacher CRUD | Admin |
| GET/POST | `/api/subjects` | Subject CRUD | Admin |
| GET/POST | `/api/subject-teachers` | Teacher-subject assignments | Admin |
| GET/POST/PUT/DELETE | `/api/announcements` | Announcements | Admin |
| GET/PUT | `/api/attendance` | Attendance records | Teacher/Student |
| GET/POST | `/api/enrollments` | Course enrollments | Admin |
| GET/POST/PUT | `/api/fees` | Fee records | Admin/Student |

---

## Tech Stack

| Technology | Version | Purpose |
|-----------|---------|---------|
| **Next.js** | 16 | React framework with App Router |
| **React** | 19 | UI library |
| **TypeScript** | 5 | Type-safe development |
| **Tailwind CSS** | 4 | Utility-first CSS framework |
| **shadcn/ui** | — | Accessible UI component library |
| **Prisma ORM** | 6 | Type-safe database ORM |
| **SQLite** | — | Lightweight file-based database |
| **NextAuth.js** | 4 | Authentication (JWT strategy) |
| **Zustand** | 5 | Client-side state management |
| **Framer Motion** | 12 | Animations and transitions |
| **React Hook Form** | 7 | Form state management |
| **Zod** | 4 | Schema validation |
| **Recharts** | 2 | Charts and data visualization |
| **Lucide React** | — | Icon library |
| **bcryptjs** | 3 | Password hashing |
| **date-fns** | 4 | Date utility functions |

---

## Screenshots

> Placeholder — add screenshots after deploying

| Public Homepage | Admin Dashboard | Teacher Portal | Student Portal |
|:---:|:---:|:---:|:---:|
| *[Screenshot]* | *[Screenshot]* | *[Screenshot]* | *[Screenshot]* |

---

## Troubleshooting

<details>
<summary><strong>Database not found or corrupted</strong></summary>

```bash
rm -f db/custom.db
npx prisma db push
npx prisma db seed
```
</details>

<details>
<summary><strong>Login fails with "Invalid email or password"</strong></summary>

```bash
# Re-seed the database
npx prisma db seed

# Verify NEXTAUTH_SECRET is set
echo $NEXTAUTH_SECRET

# Clear Next.js cache
rm -rf .next
npm run dev
```
</details>

<details>
<summary><strong>Port 3000 already in use</strong></summary>

```bash
lsof -t -i:3000 | xargs kill -9
npm run dev
```
</details>

<details>
<summary><strong>Module not found errors</strong></summary>

```bash
rm -rf node_modules package-lock.json
npm install
```
</details>

<details>
<summary><strong>TypeScript errors with session.user.role</strong></summary>

Make sure `src/types/next-auth.d.ts` exists. It extends NextAuth types to include `role` and `id` fields. Restart your IDE after confirming the file exists.
</details>

---

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

## Contact

**Muhammad Kashif Latif** — Project Founder & Developer

- 📧 [kashif.latif2004@gmail.com](mailto:kashif.latif2004@gmail.com)
- 📍 345# Hamdard Chowk, near Arfa Tower, Lahore, Pakistan
- 📞 +92 314 4253900

---

<p align="center">
  Built with ❤️ by <strong>Muhammad Kashif Latif</strong><br/>
  <em>COMCAT University — Shaping the Future of Technology Leaders</em>
</p>
