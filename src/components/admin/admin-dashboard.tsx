'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Users,
  GraduationCap,
  BookOpen,
  Megaphone,
  Mail,
  TrendingUp,
  Calendar,
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface DashboardData {
  totalStudents: number
  totalTeachers: number
  totalSubjects: number
  totalAnnouncements: number
  unreadMessages: number
  recentAnnouncements: Array<{
    id: string
    title: string
    category: string
    createdAt: string
    author: { name: string }
  }>
  departmentStats: Array<{
    department: string
    _count: { department: number }
  }>
}

interface StatCardProps {
  title: string
  value: number | string
  icon: React.ElementType
  description?: string
  colorClass: string
  bgClass: string
}

function StatCard({ title, value, icon: Icon, description, colorClass, bgClass }: StatCardProps) {
  return (
    <Card className="relative overflow-hidden border border-[#262626] bg-[#111]">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <p className="text-3xl font-bold text-white">{value}</p>
            {description && (
              <p className="text-xs text-gray-500">{description}</p>
            )}
          </div>
          <div className={cn('flex h-12 w-12 items-center justify-center rounded-xl', bgClass)}>
            <Icon className={cn('h-6 w-6', colorClass)} />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function LoadingSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-[120px] rounded-xl bg-gray-800" />
        ))}
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <Skeleton className="h-[360px] rounded-xl bg-gray-800" />
        <Skeleton className="h-[360px] rounded-xl bg-gray-800" />
      </div>
    </div>
  )
}

const categoryColors: Record<string, string> = {
  GENERAL: 'bg-gray-700 text-gray-300',
  ACADEMIC: 'bg-[#C9A84C]/20 text-[#C9A84C]',
  EVENT: 'bg-amber-500/20 text-amber-400',
  URGENT: 'bg-red-500/20 text-red-400',
}

const departmentColors = [
  'bg-[#C9A84C]',
  'bg-teal-500',
  'bg-cyan-500',
  'bg-amber-500',
  'bg-orange-500',
  'bg-rose-500',
  'bg-violet-500',
]

export function AdminDashboard() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchDashboard() {
      try {
        const res = await fetch('/api/dashboard')
        if (!res.ok) throw new Error('Failed to fetch dashboard data')
        const json = await res.json()
        setData(json)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }
    fetchDashboard()
  }, [])

  if (loading) return <LoadingSkeleton />

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-500/20">
          <TrendingUp className="h-8 w-8 text-red-400" />
        </div>
        <h3 className="text-lg font-semibold text-white">Failed to load dashboard</h3>
        <p className="text-sm text-gray-500 mt-1">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 text-sm font-medium text-black bg-[#C9A84C] rounded-lg hover:bg-[#B8963A] transition-colors"
        >
          Try Again
        </button>
      </div>
    )
  }

  if (!data) return null

  const maxDeptCount = Math.max(
    ...data.departmentStats.map((d) => d._count.department),
    1
  )

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        <StatCard
          title="Total Students"
          value={data.totalStudents}
          icon={Users}
          description="Enrolled students"
          colorClass="text-[#C9A84C]"
          bgClass="bg-[#C9A84C]/20"
        />
        <StatCard
          title="Total Teachers"
          value={data.totalTeachers}
          icon={GraduationCap}
          description="Faculty members"
          colorClass="text-teal-400"
          bgClass="bg-teal-500/20"
        />
        <StatCard
          title="Total Subjects"
          value={data.totalSubjects}
          icon={BookOpen}
          description="Active courses"
          colorClass="text-amber-400"
          bgClass="bg-amber-500/20"
        />
        <StatCard
          title="Announcements"
          value={data.totalAnnouncements}
          icon={Megaphone}
          description="Published posts"
          colorClass="text-orange-400"
          bgClass="bg-orange-500/20"
        />
        <StatCard
          title="Unread Messages"
          value={data.unreadMessages}
          icon={Mail}
          description="Contact messages"
          colorClass="text-rose-400"
          bgClass="bg-rose-500/20"
        />
      </div>

      {/* Recent Announcements & Department Stats */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Announcements */}
        <Card className="border border-[#262626] bg-[#111]">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base text-white">
              <Megaphone className="h-4 w-4 text-[#C9A84C]" />
              Recent Announcements
            </CardTitle>
          </CardHeader>
          <CardContent>
            {data.recentAnnouncements.length === 0 ? (
              <p className="text-sm text-gray-500 py-8 text-center">No announcements yet</p>
            ) : (
              <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
                {data.recentAnnouncements.map((announcement) => (
                  <div
                    key={announcement.id}
                    className="flex items-start gap-3 rounded-lg border border-[#262626] p-3 hover:bg-[#1a1a1a] transition-colors"
                  >
                    <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#C9A84C]/20">
                      <Megaphone className="h-4 w-4 text-[#C9A84C]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white truncate">
                        {announcement.title}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge
                          variant="secondary"
                          className={cn('text-[10px] px-1.5 py-0', categoryColors[announcement.category] || categoryColors.GENERAL)}
                        >
                          {announcement.category}
                        </Badge>
                        <span className="text-xs text-gray-500">
                          by {announcement.author?.name || 'Unknown'}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-gray-500 shrink-0">
                      <Calendar className="h-3 w-3" />
                      {new Date(announcement.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Department Stats */}
        <Card className="border border-[#262626] bg-[#111]">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base text-white">
              <TrendingUp className="h-4 w-4 text-[#C9A84C]" />
              Students by Department
            </CardTitle>
          </CardHeader>
          <CardContent>
            {data.departmentStats.length === 0 ? (
              <p className="text-sm text-gray-500 py-8 text-center">No department data</p>
            ) : (
              <div className="space-y-4 max-h-[300px] overflow-y-auto pr-1">
                {data.departmentStats.map((dept, index) => {
                  const percentage = (dept._count.department / maxDeptCount) * 100
                  return (
                    <div key={dept.department} className="space-y-1.5">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium text-gray-300 truncate">
                          {dept.department || 'Unknown'}
                        </span>
                        <span className="text-gray-500 font-semibold shrink-0 ml-2">
                          {dept._count.department}
                        </span>
                      </div>
                      <div className="h-3 w-full rounded-full bg-gray-800 overflow-hidden">
                        <div
                          className={cn('h-full rounded-full transition-all duration-700', departmentColors[index % departmentColors.length])}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  )
                })}
                <div className="pt-2 border-t border-[#262626] mt-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-semibold text-white">Total</span>
                    <span className="font-bold text-[#C9A84C]">
                      {data.departmentStats.reduce((sum, d) => sum + d._count.department, 0)}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
