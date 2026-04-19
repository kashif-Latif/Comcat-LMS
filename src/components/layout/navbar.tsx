'use client'

import { useState } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { useAppStore } from '@/store/use-app-store'
import type { ViewType } from '@/store/use-app-store'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from '@/components/ui/sheet'
import {
  GraduationCap,
  Menu,
  LogOut,
  LogIn,
  LayoutDashboard,
  User,
} from 'lucide-react'

const navLinks: { label: string; view: ViewType }[] = [
  { label: 'Home', view: 'home' },
  { label: 'About', view: 'about' },
  { label: 'Programs', view: 'programs' },
  { label: 'Admissions', view: 'admissions' },
  { label: 'News', view: 'news' },
  { label: 'Contact', view: 'contact' },
]

function getRoleBadgeVariant(
  role: string
): 'default' | 'secondary' | 'destructive' | 'outline' {
  switch (role) {
    case 'ADMIN':
      return 'destructive'
    case 'TEACHER':
      return 'secondary'
    case 'STUDENT':
      return 'default'
    default:
      return 'outline'
  }
}

function getDashboardView(role: string): ViewType {
  switch (role) {
    case 'ADMIN':
      return 'admin-dashboard'
    case 'TEACHER':
      return 'teacher-dashboard'
    case 'STUDENT':
      return 'student-dashboard'
    default:
      return 'home'
  }
}

export function Navbar() {
  const { data: session } = useSession()
  const { currentView, setCurrentView, user, logout } = useAppStore()
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleNav = (view: ViewType) => {
    setCurrentView(view)
    setMobileOpen(false)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleLogout = async () => {
    logout()
    await signOut({ redirect: false })
  }

  const handleDashboard = () => {
    if (session?.user) {
      const role = (session.user as Record<string, unknown>).role as string
      setCurrentView(getDashboardView(role))
    }
    setMobileOpen(false)
  }

  const role = session?.user
    ? (session.user as Record<string, unknown>).role as string
    : null
  const userName = session?.user?.name || user?.name

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-800 bg-[#0a0a0a]/95 backdrop-blur supports-[backdrop-filter]:bg-[#0a0a0a]/80">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <button
          onClick={() => handleNav('home')}
          className="flex items-center gap-2 transition-opacity hover:opacity-80"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#C9A84C]">
            <GraduationCap className="h-5 w-5 text-black" />
          </div>
          <span className="hidden text-lg font-bold text-white sm:block">
            COMCAT University
          </span>
          <span className="text-lg font-bold text-white sm:hidden">
            CU
          </span>
        </button>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <Button
              key={link.view}
              variant="ghost"
              size="sm"
              onClick={() => handleNav(link.view)}
              className={`text-sm font-medium transition-colors ${
                currentView === link.view
                  ? 'text-[#C9A84C] bg-[#C9A84C]/10'
                  : 'text-[#a3a3a3] hover:text-white hover:bg-white/5'
              }`}
            >
              {link.label}
            </Button>
          ))}
        </nav>

        {/* Desktop Auth */}
        <div className="hidden items-center gap-3 md:flex">
          {session?.user ? (
            <>
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-[#C9A84C]/50 bg-[#111] ring-1 ring-[#C9A84C]/20">
                  <User className="h-4 w-4 text-[#C9A84C]" />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-white">
                    {userName}
                  </span>
                  <Badge
                    variant={getRoleBadgeVariant(role || '')}
                    className="text-[10px] px-1.5 py-0"
                  >
                    {role}
                  </Badge>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleDashboard}
                className="gap-1.5 border-gray-700 text-[#e5e5e5] hover:bg-[#111] hover:text-white"
              >
                <LayoutDashboard className="h-4 w-4" />
                Dashboard
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="gap-1.5 text-[#a3a3a3] hover:text-white"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </>
          ) : (
            <Button
              size="sm"
              onClick={() => handleNav('login')}
              className="bg-[#C9A84C] text-black hover:bg-[#B8963A] gap-1.5 transition-all hover:shadow-[0_0_20px_rgba(201,168,76,0.3)]"
            >
              <LogIn className="h-4 w-4" />
              Login
            </Button>
          )}
        </div>

        {/* Mobile Menu */}
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden text-white hover:bg-white/5">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-72 bg-[#0a0a0a] border-gray-800">
            <SheetHeader>
              <SheetTitle className="flex items-center gap-2 text-left text-white">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#C9A84C]">
                  <GraduationCap className="h-4 w-4 text-black" />
                </div>
                <span>COMCAT University</span>
              </SheetTitle>
            </SheetHeader>

            <div className="flex flex-col gap-1 px-4 pt-2">
              {navLinks.map((link) => (
                <SheetClose asChild key={link.view}>
                  <Button
                    variant="ghost"
                    className={`justify-start transition-colors ${
                      currentView === link.view
                        ? 'text-[#C9A84C] bg-[#C9A84C]/10'
                        : 'text-[#a3a3a3] hover:text-white hover:bg-white/5'
                    }`}
                    onClick={() => handleNav(link.view)}
                  >
                    {link.label}
                  </Button>
                </SheetClose>
              ))}
            </div>

            <div className="mt-auto border-t border-gray-800 px-4 pt-4">
              {session?.user ? (
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2 pb-2">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-[#C9A84C]/50 bg-[#111] ring-1 ring-[#C9A84C]/20">
                      <User className="h-4 w-4 text-[#C9A84C]" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-white">{userName}</span>
                      <Badge
                        variant={getRoleBadgeVariant(role || '')}
                        className="w-fit text-[10px] px-1.5 py-0"
                      >
                        {role}
                      </Badge>
                    </div>
                  </div>
                  <SheetClose asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start gap-2 border-gray-700 text-[#e5e5e5] hover:bg-[#111] hover:text-white"
                      onClick={handleDashboard}
                    >
                      <LayoutDashboard className="h-4 w-4" />
                      Dashboard
                    </Button>
                  </SheetClose>
                  <Button
                    variant="ghost"
                    className="w-full justify-start gap-2 text-[#a3a3a3] hover:text-white hover:bg-white/5"
                    onClick={handleLogout}
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </Button>
                </div>
              ) : (
                <SheetClose asChild>
                  <Button
                    className="w-full bg-[#C9A84C] text-black hover:bg-[#B8963A] gap-2"
                    onClick={() => handleNav('login')}
                  >
                    <LogIn className="h-4 w-4" />
                    Login
                  </Button>
                </SheetClose>
              )}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}
