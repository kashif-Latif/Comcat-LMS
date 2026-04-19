'use client'

import { useState } from 'react'
import { signOut } from 'next-auth/react'
import { useAppStore } from '@/store/use-app-store'
import type { ViewType } from '@/store/use-app-store'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from '@/components/ui/sheet'
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  BookOpen,
  Megaphone,
  Mail,
  LogOut,
  Menu,
  Shield,
  ChevronLeft,
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface NavItem {
  label: string
  view: ViewType
  icon: React.ElementType
}

const navItems: NavItem[] = [
  { label: 'Dashboard', view: 'admin-dashboard', icon: LayoutDashboard },
  { label: 'Students', view: 'admin-students', icon: Users },
  { label: 'Teachers', view: 'admin-teachers', icon: GraduationCap },
  { label: 'Subjects', view: 'admin-subjects', icon: BookOpen },
  { label: 'Announcements', view: 'admin-announcements', icon: Megaphone },
  { label: 'Messages', view: 'admin-messages', icon: Mail },
]

function SidebarNav({
  collapsed,
  onItemClick,
}: {
  collapsed: boolean
  onItemClick?: () => void
}) {
  const { currentView, setCurrentView } = useAppStore()

  return (
    <nav className="flex flex-col gap-1 px-3">
      {navItems.map((item) => {
        const isActive = currentView === item.view
        return (
          <Button
            key={item.view}
            variant={isActive ? 'secondary' : 'ghost'}
            className={cn(
              'justify-start gap-3 h-10 transition-colors',
              isActive && 'bg-[#C9A84C]/10 text-[#C9A84C] hover:bg-[#C9A84C]/15 hover:text-[#C9A84C] font-medium',
              !isActive && 'text-gray-400 hover:text-white'
            )}
            onClick={() => {
              setCurrentView(item.view)
              onItemClick?.()
            }}
          >
            <item.icon className={cn('h-4 w-4 shrink-0', isActive && 'text-[#C9A84C]')} />
            {!collapsed && <span className="truncate">{item.label}</span>}
          </Button>
        )
      })}
    </nav>
  )
}

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, logout, currentView } = useAppStore()
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleLogout = async () => {
    logout()
    await signOut({ redirect: false })
  }

  const handleMobileNav = () => {
    setMobileOpen(false)
  }

  return (
    <div className="flex h-screen overflow-hidden bg-[#0a0a0a]">
      {/* Desktop Sidebar */}
      <aside
        className={cn(
          'hidden lg:flex flex-col border-r border-[#262626] bg-[#0a0a0a] transition-all duration-300',
          sidebarCollapsed ? 'w-[68px]' : 'w-64'
        )}
      >
        {/* Sidebar Header */}
        <div className={cn(
          'flex h-16 items-center border-b border-[#262626] px-4 gap-3',
          sidebarCollapsed && 'justify-center px-2'
        )}>
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#C9A84C]">
            <Shield className="h-5 w-5 text-black" />
          </div>
          {!sidebarCollapsed && (
            <div className="flex flex-col overflow-hidden">
              <span className="text-sm font-bold text-white truncate">Admin Portal</span>
              <span className="text-[10px] text-gray-500 truncate">COMCAT University</span>
            </div>
          )}
        </div>

        {/* Navigation */}
        <ScrollArea className="flex-1 py-4">
          <SidebarNav collapsed={sidebarCollapsed} />
        </ScrollArea>

        {/* Sidebar Footer */}
        <div className="border-t border-[#262626] p-3">
          <Button
            variant="ghost"
            size="icon"
            className="w-full mb-2 text-gray-500 hover:text-white"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          >
            <ChevronLeft className={cn(
              'h-4 w-4 transition-transform duration-300',
              sidebarCollapsed && 'rotate-180'
            )} />
          </Button>
          <Separator className="mb-2 bg-[#262626]" />
          <Button
            variant="ghost"
            className={cn(
              'w-full justify-start gap-3 text-gray-400 hover:text-red-400 hover:bg-red-500/10',
              sidebarCollapsed && 'justify-center'
            )}
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4 shrink-0" />
            {!sidebarCollapsed && <span>Logout</span>}
          </Button>
        </div>
      </aside>

      {/* Mobile Sidebar */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="w-72 p-0 bg-[#0a0a0a] border-[#262626]">
          <SheetHeader className="flex h-16 items-center gap-3 border-b border-[#262626] px-4">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#C9A84C]">
              <Shield className="h-5 w-5 text-black" />
            </div>
            <SheetTitle className="flex flex-col items-start">
              <span className="text-sm font-bold text-white">Admin Portal</span>
              <span className="text-[10px] text-gray-500">COMCAT University</span>
            </SheetTitle>
          </SheetHeader>
          <ScrollArea className="flex-1 py-4">
            <SidebarNav collapsed={false} onItemClick={handleMobileNav} />
          </ScrollArea>
          <div className="border-t border-[#262626] p-3">
            <Button
              variant="ghost"
              className="w-full justify-start gap-3 text-gray-400 hover:text-red-400 hover:bg-red-500/10"
              onClick={() => {
                handleLogout()
                setMobileOpen(false)
              }}
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top Header */}
        <header className="flex h-16 items-center justify-between border-b border-[#262626] bg-[#111] px-4 lg:px-6">
          <div className="flex items-center gap-3">
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden text-gray-400 hover:text-white">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle sidebar</span>
                </Button>
              </SheetTrigger>
            </Sheet>

            <div className="flex items-center gap-2">
              {navItems.map((item) => {
                if (currentView !== item.view) return null
                return (
                  <div key={item.view} className="flex items-center gap-2">
                    <item.icon className="h-4 w-4 text-[#C9A84C]" />
                    <h1 className="text-lg font-semibold text-white">{item.label}</h1>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#C9A84C]/20">
                <span className="text-xs font-semibold text-[#C9A84C]">
                  {user?.name?.charAt(0)?.toUpperCase() || 'A'}
                </span>
              </div>
              <div className="hidden sm:flex flex-col">
                <span className="text-sm font-medium text-white leading-tight">
                  {user?.name || 'Admin'}
                </span>
                <Badge variant="destructive" className="text-[10px] px-1.5 py-0 w-fit">
                  ADMIN
                </Badge>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="text-gray-500 hover:text-red-400 lg:hidden"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6 bg-[#0a0a0a]">
          {children}
        </main>
      </div>
    </div>
  )
}
