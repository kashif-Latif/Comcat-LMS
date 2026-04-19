'use client'

import { useEffect } from 'react'
import dynamic from 'next/dynamic'
import { SessionProvider } from 'next-auth/react'
import { useSession } from 'next-auth/react'
import { useAppStore } from '@/store/use-app-store'

// Dynamic imports with loading fallback to avoid Turbopack compilation crash
const Navbar = dynamic(() => import('@/components/layout/navbar').then(m => ({ default: m.Navbar })), { ssr: false })
const Footer = dynamic(() => import('@/components/layout/footer').then(m => ({ default: m.Footer })), { ssr: false })
const HeroSection = dynamic(() => import('@/components/public/hero-section').then(m => ({ default: m.HeroSection })), { ssr: false })
const HomepageGrid = dynamic(() => import('@/components/public/homepage-grid').then(m => ({ default: m.HomepageGrid })), { ssr: false })
const AboutSection = dynamic(() => import('@/components/public/about-section').then(m => ({ default: m.AboutSection })), { ssr: false })
const NewsSection = dynamic(() => import('@/components/public/news-section').then(m => ({ default: m.NewsSection })), { ssr: false })
const ContactSection = dynamic(() => import('@/components/public/contact-section').then(m => ({ default: m.ContactSection })), { ssr: false })
const ProgramsSection = dynamic(() => import('@/components/public/programs-section').then(m => ({ default: m.ProgramsSection })), { ssr: false })
const HistorySection = dynamic(() => import('@/components/public/history-section').then(m => ({ default: m.HistorySection })), { ssr: false })
const AdmissionsSection = dynamic(() => import('@/components/public/admissions-section').then(m => ({ default: m.AdmissionsSection })), { ssr: false })
const LoginForm = dynamic(() => import('@/components/auth/login-form').then(m => ({ default: m.LoginForm })), { ssr: false })

// Admin components
const AdminLayout = dynamic(() => import('@/components/admin/admin-layout').then(m => ({ default: m.AdminLayout })), { ssr: false })
const AdminDashboard = dynamic(() => import('@/components/admin/admin-dashboard').then(m => ({ default: m.AdminDashboard })), { ssr: false })
const ManageStudents = dynamic(() => import('@/components/admin/manage-students').then(m => ({ default: m.ManageStudents })), { ssr: false })
const ManageTeachers = dynamic(() => import('@/components/admin/manage-teachers').then(m => ({ default: m.ManageTeachers })), { ssr: false })
const ManageSubjects = dynamic(() => import('@/components/admin/manage-subjects').then(m => ({ default: m.ManageSubjects })), { ssr: false })
const ManageAnnouncements = dynamic(() => import('@/components/admin/manage-announcements').then(m => ({ default: m.ManageAnnouncements })), { ssr: false })
const ManageMessages = dynamic(() => import('@/components/admin/manage-messages').then(m => ({ default: m.ManageMessages })), { ssr: false })

// Teacher components
const TeacherLayout = dynamic(() => import('@/components/teacher/teacher-layout').then(m => ({ default: m.TeacherLayout })), { ssr: false })
const TeacherDashboard = dynamic(() => import('@/components/teacher/teacher-dashboard').then(m => ({ default: m.TeacherDashboard })), { ssr: false })
const ViewStudents = dynamic(() => import('@/components/teacher/view-students').then(m => ({ default: m.ViewStudents })), { ssr: false })
const MarkAttendance = dynamic(() => import('@/components/teacher/mark-attendance').then(m => ({ default: m.MarkAttendance })), { ssr: false })

// Student components
const StudentLayout = dynamic(() => import('@/components/student/student-layout').then(m => ({ default: m.StudentLayout })), { ssr: false })
const StudentDashboard = dynamic(() => import('@/components/student/student-dashboard').then(m => ({ default: m.StudentDashboard })), { ssr: false })
const MySubjects = dynamic(() => import('@/components/student/my-subjects').then(m => ({ default: m.MySubjects })), { ssr: false })
const MyAttendance = dynamic(() => import('@/components/student/my-attendance').then(m => ({ default: m.MyAttendance })), { ssr: false })
const MyFees = dynamic(() => import('@/components/student/my-fees').then(m => ({ default: m.MyFees })), { ssr: false })

function LoadingScreen() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="text-center">
        <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-gray-700 border-t-[#C9A84C]" />
        <p className="text-sm text-gray-500">Loading...</p>
      </div>
    </div>
  )
}

function AdminContent() {
  const { currentView } = useAppStore()

  switch (currentView) {
    case 'admin-dashboard':
      return <AdminDashboard />
    case 'admin-students':
      return <ManageStudents />
    case 'admin-teachers':
      return <ManageTeachers />
    case 'admin-subjects':
      return <ManageSubjects />
    case 'admin-announcements':
      return <ManageAnnouncements />
    case 'admin-messages':
      return <ManageMessages />
    default:
      return <AdminDashboard />
  }
}

function TeacherContent() {
  const { currentView } = useAppStore()

  switch (currentView) {
    case 'teacher-dashboard':
      return <TeacherDashboard />
    case 'teacher-students':
      return <ViewStudents />
    case 'teacher-attendance':
      return <MarkAttendance />
    default:
      return <TeacherDashboard />
  }
}

function StudentContent() {
  const { currentView } = useAppStore()

  switch (currentView) {
    case 'student-dashboard':
      return <StudentDashboard />
    case 'student-subjects':
      return <MySubjects />
    case 'student-attendance':
      return <MyAttendance />
    case 'student-fees':
      return <MyFees />
    default:
      return <StudentDashboard />
  }
}

function AppContent() {
  const { currentView, user, setUser } = useAppStore()
  const { data: session, status } = useSession()

  useEffect(() => {
    if (status === 'authenticated' && session?.user) {
      const userData = {
        id: (session.user as Record<string, unknown>).id as string || '',
        email: session.user.email || '',
        name: session.user.name || '',
        role: (session.user as Record<string, unknown>).role as string || 'STUDENT',
      }
      if (!user || user.id !== userData.id) {
        setUser(userData)
      }
    }
  }, [session, status, user, setUser])

  const isAdminView = currentView.startsWith('admin-')
  const isTeacherView = currentView.startsWith('teacher-')
  const isStudentView = currentView.startsWith('student-')

  const renderContent = () => {
    switch (currentView) {
      case 'home':
        return (
          <>
            <HeroSection />
            <HomepageGrid />
          </>
        )
      case 'about':
        return <AboutSection />
      case 'news':
        return <NewsSection />
      case 'contact':
        return <ContactSection />
      case 'programs':
        return <ProgramsSection />
      case 'history':
        return <HistorySection />
      case 'admissions':
        return <AdmissionsSection />
      case 'login':
        return <LoginForm />

      case 'admin-dashboard':
      case 'admin-students':
      case 'admin-teachers':
      case 'admin-subjects':
      case 'admin-announcements':
      case 'admin-messages':
        return (
          <AdminLayout>
            <AdminContent />
          </AdminLayout>
        )

      case 'teacher-dashboard':
      case 'teacher-students':
      case 'teacher-attendance':
        return (
          <TeacherLayout>
            <TeacherContent />
          </TeacherLayout>
        )

      case 'student-dashboard':
      case 'student-subjects':
      case 'student-attendance':
      case 'student-fees':
        return (
          <StudentLayout>
            <StudentContent />
          </StudentLayout>
        )

      default:
        return (
          <>
            <HeroSection />
            <HomepageGrid />
          </>
        )
    }
  }

  const isPublicView = ['home', 'about', 'news', 'contact', 'programs', 'history', 'admissions', 'login'].includes(currentView)

  if (isAdminView || isTeacherView || isStudentView) {
    return renderContent()
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">{renderContent()}</main>
      {isPublicView && <Footer />}
    </div>
  )
}

export default function Home() {
  return (
    <SessionProvider>
      <AppContent />
    </SessionProvider>
  )
}
