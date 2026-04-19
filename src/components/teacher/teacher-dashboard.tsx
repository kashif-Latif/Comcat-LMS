'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Users, BookOpen, GraduationCap, Mail, Building, Award, IdCard, Briefcase, RefreshCcw } from 'lucide-react'
import { cn } from '@/lib/utils'

interface TeacherInfo { id: string; name: string; email: string; department: string | null; designation: string | null; qualification: string | null; teacherId: string | null }
interface AssignedSubject { id: string; name: string; code: string; description: string | null; credits: number; semester: number | null; department: string | null; enrollmentCount: number }
interface DashboardData { teacher: TeacherInfo; assignedSubjects: AssignedSubject[]; totalStudents: number }

function ProfileSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Skeleton className="h-16 w-16 rounded-full bg-gray-800" />
        <div className="space-y-2 flex-1"><Skeleton className="h-5 w-48 bg-gray-800" /><Skeleton className="h-4 w-32 bg-gray-800" /><Skeleton className="h-4 w-40 bg-gray-800" /></div>
      </div>
      <div className="grid grid-cols-2 gap-3"><Skeleton className="h-10 rounded-lg bg-gray-800" /><Skeleton className="h-10 rounded-lg bg-gray-800" /></div>
    </div>
  )
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1"><Skeleton className="h-[280px] rounded-xl bg-gray-800" /></div>
        <div className="lg:col-span-2"><div className="space-y-6"><div className="grid gap-4 sm:grid-cols-2"><Skeleton className="h-[120px] rounded-xl bg-gray-800" /><Skeleton className="h-[120px] rounded-xl bg-gray-800" /></div><Skeleton className="h-[260px] rounded-xl bg-gray-800" /></div></div>
      </div>
    </div>
  )
}

function InfoItem({ icon: Icon, label, value, colorClass }: { icon: React.ElementType; label: string; value: string; colorClass?: string }) {
  return (
    <div className="flex items-center gap-2.5 rounded-lg bg-[#0a0a0a] px-3 py-2">
      <Icon className={cn('h-4 w-4 shrink-0', colorClass || 'text-gray-500')} />
      <div className="min-w-0">
        <p className="text-[10px] uppercase tracking-wider text-gray-500 font-medium">{label}</p>
        <p className="text-sm font-medium text-gray-200 truncate">{value || '—'}</p>
      </div>
    </div>
  )
}

function StatCard({ title, value, icon: Icon, subtitle, colorClass, bgClass }: { title: string; value: number | string; icon: React.ElementType; subtitle?: string; colorClass: string; bgClass: string }) {
  return (
    <Card className="relative overflow-hidden border border-[#262626] bg-[#111]">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <p className="text-3xl font-bold text-white">{value}</p>
            {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
          </div>
          <div className={cn('flex h-12 w-12 items-center justify-center rounded-xl', bgClass)}><Icon className={cn('h-6 w-6', colorClass)} /></div>
        </div>
      </CardContent>
    </Card>
  )
}

export function TeacherDashboard() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchDashboard() {
      try {
        const res = await fetch('/api/dashboard')
        if (!res.ok) throw new Error('Failed to fetch dashboard data')
        setData(await res.json())
      } catch (err) { setError(err instanceof Error ? err.message : 'An error occurred') } finally { setLoading(false) }
    }
    fetchDashboard()
  }, [])

  if (loading) return <DashboardSkeleton />
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-500/20"><RefreshCcw className="h-8 w-8 text-red-400" /></div>
        <h3 className="text-lg font-semibold text-white">Failed to load dashboard</h3>
        <p className="text-sm text-gray-500 mt-1">{error}</p>
        <button onClick={() => window.location.reload()} className="mt-4 px-4 py-2 text-sm font-medium text-black bg-[#C9A84C] rounded-lg hover:bg-[#B8963A] transition-colors">Try Again</button>
      </div>
    )
  }
  if (!data) return null

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-1 border border-[#262626] bg-[#111]">
          <CardHeader className="pb-4"><CardTitle className="flex items-center gap-2 text-base text-white"><GraduationCap className="h-4 w-4 text-[#C9A84C]" /> My Profile</CardTitle></CardHeader>
          <CardContent>
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#C9A84C]/20 border-2 border-[#C9A84C]/30"><span className="text-lg font-bold text-[#C9A84C]">{data.teacher.name?.charAt(0)?.toUpperCase() || 'T'}</span></div>
              <div className="min-w-0">
                <h3 className="text-base font-semibold text-white truncate">{data.teacher.name}</h3>
                <p className="text-sm text-gray-500 truncate">{data.teacher.email}</p>
                {data.teacher.designation && <Badge className="mt-1 text-[10px] bg-[#C9A84C]/15 text-[#C9A84C] hover:bg-[#C9A84C]/15">{data.teacher.designation}</Badge>}
              </div>
            </div>
            <div className="space-y-2">
              <InfoItem icon={IdCard} label="Teacher ID" value={data.teacher.teacherId || '—'} colorClass="text-[#C9A84C]" />
              <InfoItem icon={Building} label="Department" value={data.teacher.department || '—'} colorClass="text-teal-400" />
              <InfoItem icon={Briefcase} label="Designation" value={data.teacher.designation || '—'} colorClass="text-amber-400" />
              <InfoItem icon={Award} label="Qualification" value={data.teacher.qualification || '—'} colorClass="text-violet-400" />
            </div>
          </CardContent>
        </Card>

        <div className="lg:col-span-2 space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <StatCard title="My Subjects" value={data.assignedSubjects.length} icon={BookOpen} subtitle="Assigned courses" colorClass="text-[#C9A84C]" bgClass="bg-[#C9A84C]/20" />
            <StatCard title="Total Students" value={data.totalStudents} icon={Users} subtitle="Across all subjects" colorClass="text-teal-400" bgClass="bg-teal-500/20" />
          </div>

          <Card className="border border-[#262626] bg-[#111]">
            <CardHeader className="pb-3"><CardTitle className="flex items-center gap-2 text-base text-white"><BookOpen className="h-4 w-4 text-[#C9A84C]" /> Assigned Subjects</CardTitle></CardHeader>
            <CardContent>
              {data.assignedSubjects.length === 0 ? (
                <p className="text-sm text-gray-500 py-8 text-center">No subjects assigned yet</p>
              ) : (
                <div className="space-y-3 max-h-[280px] overflow-y-auto pr-1">
                  {data.assignedSubjects.map((subject) => (
                    <div key={subject.id} className="flex items-center gap-4 rounded-lg border border-[#262626] p-4 hover:bg-[#1a1a1a] transition-colors">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#C9A84C]/20"><BookOpen className="h-5 w-5 text-[#C9A84C]" /></div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-semibold text-white truncate">{subject.name}</p>
                          <Badge variant="outline" className="text-[10px] shrink-0 border-gray-700 text-gray-400">{subject.code}</Badge>
                        </div>
                        <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                          {subject.credits > 0 && <span>{subject.credits} credits</span>}
                          {subject.department && <span>• {subject.department}</span>}
                          {subject.semester && <span>• Sem {subject.semester}</span>}
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <Users className="h-3.5 w-3.5 text-gray-500" />
                        <span className="text-sm font-semibold text-gray-300">{subject.enrollmentCount}</span>
                        <span className="text-xs text-gray-500">students</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
