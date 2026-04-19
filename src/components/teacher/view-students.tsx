'use client'

import { useEffect, useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'
import { Users, Search, BookOpen, GraduationCap, Building, IdCard, RefreshCcw, UserCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface AssignedSubject { id: string; name: string; code: string; description: string | null; credits: number; semester: number | null; department: string | null; enrollmentCount: number }
interface StudentInfo { id: string; name: string; studentId: string | null; department: string | null; semester: number | null }
interface EnrollmentRecord { id: string; studentId: string; subjectId: string; createdAt: string; student: StudentInfo; subject: { id: string; name: string; code: string; credits: number } }
interface DashboardData { teacher: { id: string; name: string; email: string; department: string | null }; assignedSubjects: AssignedSubject[]; totalStudents: number }

function LoadingSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-10 w-full rounded-lg bg-gray-800" />
      <div className="space-y-3">{Array.from({ length: 4 }).map((_, i) => (<Skeleton key={i} className="h-14 rounded-xl bg-gray-800" />))}</div>
    </div>
  )
}

export function ViewStudents() {
  const [subjects, setSubjects] = useState<AssignedSubject[]>([])
  const [enrollmentsMap, setEnrollmentsMap] = useState<Record<string, EnrollmentRecord[]>>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<string>('')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedStudent, setSelectedStudent] = useState<StudentInfo | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [loadingStudents, setLoadingStudents] = useState(false)

  useEffect(() => {
    async function fetchDashboard() {
      try {
        const res = await fetch('/api/dashboard')
        if (!res.ok) throw new Error('Failed to fetch dashboard data')
        const json: DashboardData = await res.json()
        setSubjects(json.assignedSubjects)
        if (json.assignedSubjects.length > 0) setActiveTab(json.assignedSubjects[0].id)
      } catch (err) { setError(err instanceof Error ? err.message : 'An error occurred') } finally { setLoading(false) }
    }
    fetchDashboard()
  }, [])

  async function fetchEnrollments(subjectId: string) {
    if (enrollmentsMap[subjectId]) return
    setLoadingStudents(true)
    try {
      const res = await fetch(`/api/enrollments?subjectId=${subjectId}`)
      if (!res.ok) throw new Error('Failed to fetch students')
      const data: EnrollmentRecord[] = await res.json()
      setEnrollmentsMap((prev) => ({ ...prev, [subjectId]: data }))
    } catch (err) { console.error('Error fetching enrollments:', err) } finally { setLoadingStudents(false) }
  }

  useEffect(() => { if (activeTab) fetchEnrollments(activeTab) }, [activeTab])

  const handleStudentClick = (student: StudentInfo) => { setSelectedStudent(student); setDialogOpen(true) }

  const filteredEnrollments = useMemo(() => {
    const enrollments = enrollmentsMap[activeTab] || []
    if (!searchQuery.trim()) return enrollments
    const q = searchQuery.toLowerCase()
    return enrollments.filter((e) => e.student.name.toLowerCase().includes(q) || e.student.studentId?.toLowerCase().includes(q) || e.student.department?.toLowerCase().includes(q))
  }, [enrollmentsMap, activeTab, searchQuery])

  if (loading) return <LoadingSkeleton />
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-500/20"><RefreshCcw className="h-8 w-8 text-red-400" /></div>
        <h3 className="text-lg font-semibold text-white">Failed to load students</h3>
        <p className="text-sm text-gray-500 mt-1">{error}</p>
        <button onClick={() => window.location.reload()} className="mt-4 px-4 py-2 text-sm font-medium text-black bg-[#C9A84C] rounded-lg hover:bg-[#B8963A] transition-colors">Try Again</button>
      </div>
    )
  }

  if (subjects.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-800"><Users className="h-8 w-8 text-gray-500" /></div>
        <h3 className="text-lg font-semibold text-white">No Subjects Assigned</h3>
        <p className="text-sm text-gray-500 mt-1">Contact the admin to get subjects assigned.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-white">My Students</h2>
        <p className="text-sm text-gray-500">View students enrolled in your assigned subjects</p>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
        <Input placeholder="Search students by name, ID, or department..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-9 bg-[#1a1a1a] border-gray-700 text-white placeholder:text-gray-600" />
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full justify-start h-auto flex-wrap gap-1 bg-transparent p-0 border-b border-[#262626] rounded-none">
          {subjects.map((subject) => {
            const count = enrollmentsMap[subject.id]?.length ?? subject.enrollmentCount
            return (
              <TabsTrigger key={subject.id} value={subject.id}
                className={cn('rounded-none border-b-2 border-transparent px-4 py-2.5 text-sm font-medium transition-colors text-gray-400',
                  'data-[state=active]:border-[#C9A84C] data-[state=active]:text-[#C9A84C] data-[state=active]:shadow-none data-[state=active]:bg-[#C9A84C]/5',
                  'hover:text-gray-300 hover:bg-[#1a1a1a]')}>
                <div className="flex items-center gap-2"><BookOpen className="h-3.5 w-3.5" /><span>{subject.code}</span><Badge variant="secondary" className="text-[10px] px-1.5 py-0 ml-1 bg-gray-800 text-gray-400">{count}</Badge></div>
              </TabsTrigger>
            )
          })}
        </TabsList>

        {subjects.map((subject) => (
          <TabsContent key={subject.id} value={subject.id} className="mt-4">
            {loadingStudents && !enrollmentsMap[subject.id] ? (
              <div className="space-y-3">{Array.from({ length: 3 }).map((_, i) => (<Skeleton key={i} className="h-14 rounded-xl bg-gray-800" />))}</div>
            ) : (
              <Card className="border border-[#262626] bg-[#111]">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center justify-between text-base text-white">
                    <div className="flex items-center gap-2"><BookOpen className="h-4 w-4 text-[#C9A84C]" /><span>{subject.name}</span></div>
                    <Badge variant="outline" className="text-xs border-gray-700 text-gray-400">{filteredEnrollments.length} student{filteredEnrollments.length !== 1 ? 's' : ''}</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {filteredEnrollments.length === 0 ? (
                    <div className="py-8 text-center">
                      <Users className="h-10 w-10 text-gray-600 mx-auto mb-2" />
                      <p className="text-sm text-gray-500">{searchQuery ? 'No students match your search' : 'No students enrolled in this subject'}</p>
                    </div>
                  ) : (
                    <div className="space-y-2 max-h-[480px] overflow-y-auto">
                      {filteredEnrollments.map((enrollment) => (
                        <div key={enrollment.id} className="flex items-center gap-4 rounded-lg border border-[#262626] p-3 hover:bg-[#1a1a1a] transition-colors cursor-pointer" onClick={() => handleStudentClick(enrollment.student)}>
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#C9A84C]/20">
                            <span className="text-sm font-semibold text-[#C9A84C]">{enrollment.student.name?.charAt(0)?.toUpperCase()}</span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-white truncate">{enrollment.student.name}</p>
                            <div className="flex items-center gap-2 mt-0.5 text-xs text-gray-500">
                              {enrollment.student.studentId && <span className="flex items-center gap-1"><IdCard className="h-3 w-3" />{enrollment.student.studentId}</span>}
                              {enrollment.student.department && <span className="flex items-center gap-1"><Building className="h-3 w-3" />{enrollment.student.department}</span>}
                              {enrollment.student.semester && <Badge variant="secondary" className="text-[10px] px-1.5 py-0 bg-gray-800 text-gray-400">Sem {enrollment.student.semester}</Badge>}
                            </div>
                          </div>
                          <Button variant="ghost" size="sm" className="shrink-0 text-[#C9A84C] hover:text-[#B8963A] hover:bg-[#C9A84C]/10">View</Button>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </TabsContent>
        ))}
      </Tabs>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md bg-[#111] border-[#262626]">
          <DialogHeader><DialogTitle className="flex items-center gap-2 text-white"><UserCircle className="h-5 w-5 text-[#C9A84C]" /> Student Details</DialogTitle></DialogHeader>
          {selectedStudent && (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-[#C9A84C]/20 border-2 border-[#C9A84C]/30"><span className="text-xl font-bold text-[#C9A84C]">{selectedStudent.name?.charAt(0)?.toUpperCase()}</span></div>
                <div><h3 className="text-lg font-semibold text-white">{selectedStudent.name}</h3><p className="text-sm text-gray-500">Enrolled Student</p></div>
              </div>
              <Separator className="bg-[#262626]" />
              <div className="space-y-3">
                <div className="flex items-center gap-3 rounded-lg bg-[#0a0a0a] p-3"><IdCard className="h-4 w-4 text-[#C9A84C]" /><div><p className="text-[10px] uppercase tracking-wider text-gray-500 font-medium">Student ID</p><p className="text-sm font-medium text-gray-200">{selectedStudent.studentId || '—'}</p></div></div>
                <div className="flex items-center gap-3 rounded-lg bg-[#0a0a0a] p-3"><Building className="h-4 w-4 text-teal-400" /><div><p className="text-[10px] uppercase tracking-wider text-gray-500 font-medium">Department</p><p className="text-sm font-medium text-gray-200">{selectedStudent.department || '—'}</p></div></div>
                <div className="flex items-center gap-3 rounded-lg bg-[#0a0a0a] p-3"><GraduationCap className="h-4 w-4 text-amber-400" /><div><p className="text-[10px] uppercase tracking-wider text-gray-500 font-medium">Semester</p><p className="text-sm font-medium text-gray-200">{selectedStudent.semester ? `Semester ${selectedStudent.semester}` : '—'}</p></div></div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
