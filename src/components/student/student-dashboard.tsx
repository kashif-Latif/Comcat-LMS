'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Skeleton } from '@/components/ui/skeleton'
import { User, BookOpen, ClipboardCheck, Receipt, Mail, Phone, Calendar, Building2, GraduationCap, Hash, TrendingUp, Megaphone, AlertCircle, RefreshCcw } from 'lucide-react'
import { cn } from '@/lib/utils'
import { format } from 'date-fns'

interface StudentInfo { id: string; name: string; email: string; department: string | null; semester: number | null; studentId: string | null; enrollmentYear: number | null; phone: string | null; dateOfBirth: string | null }
interface AttendanceStats { totalClasses: number; presentClasses: number; absentClasses: number; lateClasses: number; attendancePercentage: number }
interface DashboardData { student: StudentInfo; enrollments: Array<{ id: string; code: string; name: string; credits: number }>; attendanceStats: AttendanceStats; fees: Array<{ id: string; status: string; amount: number }> }
interface Announcement { id: string; title: string; content: string; category: string; createdAt: string; author: { name: string } }

const categoryColors: Record<string, string> = {
  GENERAL: 'bg-gray-700 text-gray-300',
  ACADEMIC: 'bg-[#C9A84C]/20 text-[#C9A84C]',
  EVENT: 'bg-amber-500/20 text-amber-400',
  URGENT: 'bg-red-500/20 text-red-400',
  EXAM: 'bg-orange-500/20 text-orange-400',
  HOLIDAY: 'bg-teal-500/20 text-teal-400',
}

function LoadingSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"><Skeleton className="h-[220px] rounded-xl bg-gray-800" /><Skeleton className="h-[220px] rounded-xl bg-gray-800" /><Skeleton className="h-[220px] rounded-xl bg-gray-800" /></div>
      <div className="grid gap-4 sm:grid-cols-3">{Array.from({ length: 3 }).map((_, i) => (<Skeleton key={i} className="h-[100px] rounded-xl bg-gray-800" />))}</div>
      <div className="grid gap-6 lg:grid-cols-2"><Skeleton className="h-[320px] rounded-xl bg-gray-800" /><Skeleton className="h-[320px] rounded-xl bg-gray-800" /></div>
    </div>
  )
}

export function StudentDashboard() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchData() {
      try {
        const [dashRes, annRes] = await Promise.all([fetch('/api/dashboard'), fetch('/api/announcements')])
        if (!dashRes.ok) throw new Error('Failed to fetch dashboard data')
        setData(await dashRes.json())
        if (annRes.ok) setAnnouncements((await annRes.json()).slice(0, 5))
      } catch (err) { setError(err instanceof Error ? err.message : 'An error occurred') } finally { setLoading(false) }
    }
    fetchData()
  }, [])

  if (loading) return <LoadingSkeleton />
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-500/20"><AlertCircle className="h-8 w-8 text-red-400" /></div>
        <h3 className="text-lg font-semibold text-white">Failed to load dashboard</h3>
        <p className="text-sm text-gray-500 mt-1">{error}</p>
        <button onClick={() => window.location.reload()} className="mt-4 px-4 py-2 text-sm font-medium text-black bg-[#C9A84C] rounded-lg hover:bg-[#B8963A] transition-colors">Try Again</button>
      </div>
    )
  }
  if (!data) return null

  const { student, enrollments, attendanceStats, fees } = data
  const pendingFees = fees.filter((f) => f.status === 'PENDING' || f.status === 'OVERDUE').length
  const totalFees = fees.length
  const paidFees = fees.filter((f) => f.status === 'PAID').length

  const attendanceColor = attendanceStats.attendancePercentage >= 75 ? 'text-[#C9A84C]' : attendanceStats.attendancePercentage >= 50 ? 'text-amber-400' : 'text-red-400'
  const attendanceBarColor = attendanceStats.attendancePercentage >= 75 ? '[&>div]:bg-[#C9A84C]' : attendanceStats.attendancePercentage >= 50 ? '[&>div]:bg-amber-500' : '[&>div]:bg-red-500'

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {/* Profile Card */}
        <Card className="sm:col-span-2 lg:col-span-1 lg:row-span-2 border border-[#262626] bg-[#111]">
          <CardHeader className="pb-3"><CardTitle className="flex items-center gap-2 text-base text-white"><User className="h-4 w-4 text-[#C9A84C]" /> Student Profile</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-[#C9A84C]/20"><span className="text-2xl font-bold text-[#C9A84C]">{student.name?.charAt(0)?.toUpperCase() || 'S'}</span></div>
              <div className="min-w-0">
                <h3 className="text-lg font-semibold text-white truncate">{student.name}</h3>
                <Badge className="bg-[#C9A84C]/15 text-[#C9A84C] hover:bg-[#C9A84C]/15 mt-1">Semester {student.semester || '—'}</Badge>
              </div>
            </div>
            <div className="space-y-3 pt-2">
              {[
                { icon: Hash, label: 'Student ID', value: student.studentId || '—' },
                { icon: Mail, label: 'Email', value: student.email },
                { icon: Building2, label: 'Department', value: student.department || '—' },
                { icon: GraduationCap, label: 'Enrollment Year', value: student.enrollmentYear?.toString() || '—' },
                { icon: Phone, label: 'Phone', value: student.phone || '—' },
                { icon: Calendar, label: 'Date of Birth', value: student.dateOfBirth ? format(new Date(student.dateOfBirth), 'MMM dd, yyyy') : '—' },
              ].map((item) => (
                <div key={item.label} className="flex items-start gap-3">
                  <item.icon className="h-4 w-4 text-gray-500 mt-0.5 shrink-0" />
                  <div className="min-w-0"><p className="text-xs text-gray-500">{item.label}</p><p className="text-sm font-medium text-white truncate">{item.value}</p></div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <Card className="border border-[#262626] bg-[#111]">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1"><p className="text-sm font-medium text-gray-500">Subjects Enrolled</p><p className="text-3xl font-bold text-white">{enrollments.length}</p><p className="text-xs text-gray-500">{enrollments.reduce((sum, s) => sum + s.credits, 0)} total credits</p></div>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-500/20"><BookOpen className="h-6 w-6 text-teal-400" /></div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-[#262626] bg-[#111]">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1"><p className="text-sm font-medium text-gray-500">Attendance Rate</p><p className={cn('text-3xl font-bold', attendanceColor)}>{attendanceStats.attendancePercentage}%</p><p className="text-xs text-gray-500">{attendanceStats.presentClasses} of {attendanceStats.totalClasses} classes</p></div>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#C9A84C]/20"><ClipboardCheck className="h-6 w-6 text-[#C9A84C]" /></div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-[#262626] bg-[#111]">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1"><p className="text-sm font-medium text-gray-500">Fee Status</p><p className="text-3xl font-bold text-white">{paidFees}/{totalFees}</p><p className="text-xs text-gray-500">{pendingFees > 0 ? `${pendingFees} pending` : 'All fees cleared'}</p></div>
              <div className={cn('flex h-12 w-12 items-center justify-center rounded-xl', pendingFees > 0 ? 'bg-amber-500/20' : 'bg-[#C9A84C]/20')}><Receipt className={cn('h-6 w-6', pendingFees > 0 ? 'text-amber-400' : 'text-[#C9A84C]')} /></div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Attendance Progress & Announcements */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border border-[#262626] bg-[#111]">
          <CardHeader className="pb-3"><CardTitle className="flex items-center gap-2 text-base text-white"><TrendingUp className="h-4 w-4 text-[#C9A84C]" /> Attendance Overview</CardTitle></CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-gray-300">Overall Attendance</span>
                <span className={cn('font-bold text-lg', attendanceColor)}>{attendanceStats.attendancePercentage}%</span>
              </div>
              <Progress value={attendanceStats.attendancePercentage} className={cn('h-3', attendanceBarColor)} />
              <p className="text-xs text-gray-500">
                {attendanceStats.attendancePercentage >= 75 ? 'Good attendance! Keep it up.' : attendanceStats.attendancePercentage >= 50 ? 'Attendance needs improvement.' : 'Low attendance. Please attend more classes.'}
              </p>
            </div>
            <div className="grid grid-cols-3 gap-4 pt-2">
              <div className="text-center rounded-lg bg-[#C9A84C]/10 p-3"><p className="text-2xl font-bold text-[#C9A84C]">{attendanceStats.presentClasses}</p><p className="text-xs text-gray-500 mt-1">Present</p></div>
              <div className="text-center rounded-lg bg-red-500/10 p-3"><p className="text-2xl font-bold text-red-400">{attendanceStats.absentClasses}</p><p className="text-xs text-gray-500 mt-1">Absent</p></div>
              <div className="text-center rounded-lg bg-amber-500/10 p-3"><p className="text-2xl font-bold text-amber-400">{attendanceStats.lateClasses}</p><p className="text-xs text-gray-500 mt-1">Late</p></div>
            </div>
            <div className="pt-2 border-t border-[#262626]">
              <p className="text-sm text-gray-400">Total classes recorded: <span className="font-semibold text-white">{attendanceStats.totalClasses}</span></p>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-[#262626] bg-[#111]">
          <CardHeader className="pb-3"><CardTitle className="flex items-center gap-2 text-base text-white"><Megaphone className="h-4 w-4 text-[#C9A84C]" /> Recent Announcements</CardTitle></CardHeader>
          <CardContent>
            {announcements.length === 0 ? (
              <div className="py-8 text-center"><Megaphone className="h-10 w-10 text-gray-600 mx-auto mb-2" /><p className="text-sm text-gray-500">No announcements yet</p></div>
            ) : (
              <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
                {announcements.map((announcement) => (
                  <div key={announcement.id} className="flex items-start gap-3 rounded-lg border border-[#262626] p-3 hover:bg-[#1a1a1a] transition-colors">
                    <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#C9A84C]/20"><Megaphone className="h-4 w-4 text-[#C9A84C]" /></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white truncate">{announcement.title}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="secondary" className={cn('text-[10px] px-1.5 py-0', categoryColors[announcement.category] || categoryColors.GENERAL)}>{announcement.category}</Badge>
                        <span className="text-xs text-gray-500">by {announcement.author?.name || 'Unknown'}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-gray-500 shrink-0"><Calendar className="h-3 w-3" />{format(new Date(announcement.createdAt), 'MMM dd')}</div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
