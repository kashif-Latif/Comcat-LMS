'use client'

import { useEffect, useState, useCallback, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Separator } from '@/components/ui/separator'
import { ClipboardCheck, CheckCircle2, XCircle, Clock, CalendarDays, BookOpen, RefreshCcw, Save, AlertCircle, Users } from 'lucide-react'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

interface AssignedSubject { id: string; name: string; code: string; credits: number; department: string | null; enrollmentCount: number }
interface StudentInfo { id: string; name: string; studentId: string | null; department: string | null }
interface EnrollmentRecord { id: string; studentId: string; subjectId: string; student: StudentInfo }
interface AttendanceRecord { id: string; studentId: string; subjectId: string; teacherId: string; date: string; status: 'PRESENT' | 'ABSENT' | 'LATE'; remarks: string | null; student: { id: string; name: string; studentId: string | null; department: string | null } }
interface StudentAttendanceEntry { studentId: string; studentName: string; studentIdDisplay: string | null; department: string | null; status: 'PRESENT' | 'ABSENT' | 'LATE'; remarks: string }
type AttendanceStatus = 'PRESENT' | 'ABSENT' | 'LATE'

const statusConfig: Record<AttendanceStatus, { label: string; icon: React.ElementType; activeClass: string; hoverClass: string }> = {
  PRESENT: { label: 'Present', icon: CheckCircle2, activeClass: 'bg-[#C9A84C]/20 text-[#C9A84C] border-[#C9A84C]/40', hoverClass: 'hover:bg-[#C9A84C]/10 hover:text-[#C9A84C] hover:border-[#C9A84C]/30' },
  ABSENT: { label: 'Absent', icon: XCircle, activeClass: 'bg-red-500/20 text-red-400 border-red-500/40', hoverClass: 'hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/30' },
  LATE: { label: 'Late', icon: Clock, activeClass: 'bg-amber-500/20 text-amber-400 border-amber-500/40', hoverClass: 'hover:bg-amber-500/10 hover:text-amber-400 hover:border-amber-500/30' },
}

function StepIndicator({ step, currentStep }: { step: number; currentStep: number }) {
  return (
    <div className={cn('flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold transition-colors',
      step < currentStep && 'bg-[#C9A84C] text-black',
      step === currentStep && 'bg-[#C9A84C]/20 text-[#C9A84C] border-2 border-[#C9A84C]',
      step > currentStep && 'bg-gray-800 text-gray-500')}>
      {step < currentStep ? <CheckCircle2 className="h-4 w-4" /> : step}
    </div>
  )
}

function LoadingSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">{Array.from({ length: 3 }).map((_, i) => (<Skeleton key={i} className="h-8 w-8 rounded-full bg-gray-800" />))}</div>
      <Skeleton className="h-12 rounded-xl bg-gray-800" /><Skeleton className="h-12 rounded-xl bg-gray-800" />
      <div className="space-y-3">{Array.from({ length: 4 }).map((_, i) => (<Skeleton key={i} className="h-14 rounded-xl bg-gray-800" />))}</div>
    </div>
  )
}

export function MarkAttendance() {
  const [subjects, setSubjects] = useState<AssignedSubject[]>([])
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>('')
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0])
  const [students, setStudents] = useState<EnrollmentRecord[]>([])
  const [attendanceEntries, setAttendanceEntries] = useState<StudentAttendanceEntry[]>([])
  const [loadingSubjects, setLoadingSubjects] = useState(true)
  const [loadingStudents, setLoadingStudents] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [existingLoaded, setExistingLoaded] = useState<string>('')

  const currentStep = !selectedSubjectId ? 1 : !selectedDate ? 2 : 3

  useEffect(() => {
    async function fetchSubjects() {
      try { const res = await fetch('/api/dashboard'); if (!res.ok) throw new Error('Failed to fetch subjects'); setSubjects((await res.json()).assignedSubjects || []) } catch { toast.error('Failed to load subjects') } finally { setLoadingSubjects(false) }
    }
    fetchSubjects()
  }, [])

  const fetchStudents = useCallback(async (subjectId: string) => {
    setLoadingStudents(true)
    try {
      const res = await fetch(`/api/enrollments?subjectId=${subjectId}`); if (!res.ok) throw new Error('Failed to fetch students')
      const data: EnrollmentRecord[] = await res.json(); setStudents(data)
      setAttendanceEntries(data.map((e) => ({ studentId: e.studentId, studentName: e.student.name, studentIdDisplay: e.student.studentId, department: e.student.department, status: 'PRESENT' as AttendanceStatus, remarks: '' })))
    } catch { toast.error('Failed to load students'); setStudents([]); setAttendanceEntries([]) } finally { setLoadingStudents(false) }
  }, [])

  const fetchExistingAttendance = useCallback(async (subjectId: string, date: string) => {
    const cacheKey = `${subjectId}-${date}`; if (existingLoaded === cacheKey) return
    try {
      const res = await fetch(`/api/attendance?subjectId=${subjectId}&date=${date}`); if (!res.ok) return
      const existing: AttendanceRecord[] = await res.json()
      if (existing.length > 0) {
        setAttendanceEntries((prev) => prev.map((entry) => { const record = existing.find((r) => r.studentId === entry.studentId); return record ? { ...entry, status: record.status, remarks: record.remarks || '' } : entry }))
        toast.info('Loaded existing attendance records for this date')
      }
      setExistingLoaded(cacheKey)
    } catch { /* silently fail */ }
  }, [existingLoaded])

  const handleSubjectChange = (subjectId: string) => { setSelectedSubjectId(subjectId); setExistingLoaded(''); if (subjectId) { fetchStudents(subjectId) } else { setStudents([]); setAttendanceEntries([]) } }
  const handleDateChange = (date: string) => { setSelectedDate(date); setExistingLoaded(''); if (selectedSubjectId && date) { setAttendanceEntries((prev) => prev.map((entry) => ({ ...entry, status: 'PRESENT' as AttendanceStatus, remarks: '' }))); fetchExistingAttendance(selectedSubjectId, date) } }
  const updateStatus = (studentId: string, status: AttendanceStatus) => { setAttendanceEntries((prev) => prev.map((entry) => (entry.studentId === studentId ? { ...entry, status } : entry))) }
  const updateRemarks = (studentId: string, remarks: string) => { setAttendanceEntries((prev) => prev.map((entry) => (entry.studentId === studentId ? { ...entry, remarks } : entry))) }
  const markAllPresent = () => { setAttendanceEntries((prev) => prev.map((entry) => ({ ...entry, status: 'PRESENT' as AttendanceStatus }))); toast.success('All students marked as present') }

  const handleSubmit = async () => {
    if (!selectedSubjectId || !selectedDate || attendanceEntries.length === 0) { toast.error('Please complete all fields'); return }
    setSubmitting(true)
    try {
      const records = attendanceEntries.map((entry) => ({ studentId: entry.studentId, status: entry.status, remarks: entry.remarks }))
      const res = await fetch('/api/attendance', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ subjectId: selectedSubjectId, date: selectedDate, records }) })
      if (!res.ok) { const errData = await res.json().catch(() => ({ error: 'Submission failed' })); throw new Error(errData.error || 'Failed to submit attendance') }
      toast.success('Attendance submitted successfully!'); setExistingLoaded('')
    } catch (err) { toast.error(err instanceof Error ? err.message : 'Failed to submit attendance') } finally { setSubmitting(false) }
  }

  const statusCounts = useMemo(() => {
    const counts = { PRESENT: 0, ABSENT: 0, LATE: 0 }
    attendanceEntries.forEach((e) => { counts[e.status]++ })
    return counts
  }, [attendanceEntries])

  if (loadingSubjects) return <LoadingSkeleton />
  if (subjects.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-800"><ClipboardCheck className="h-8 w-8 text-gray-500" /></div>
        <h3 className="text-lg font-semibold text-white">No Subjects Assigned</h3>
        <p className="text-sm text-gray-500 mt-1">Contact the admin to get subjects assigned before marking attendance.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-white">Mark Attendance</h2>
        <p className="text-sm text-gray-500">Select a subject and date, then mark each student&apos;s attendance</p>
      </div>

      {/* Step Indicators */}
      <div className="flex items-center gap-3 flex-wrap">
        <StepIndicator step={1} currentStep={currentStep} />
        <span className={cn('text-sm font-medium', currentStep >= 1 ? 'text-white' : 'text-gray-500')}>Select Subject</span>
        <div className="h-px w-8 bg-[#333]" />
        <StepIndicator step={2} currentStep={currentStep} />
        <span className={cn('text-sm font-medium', currentStep >= 2 ? 'text-white' : 'text-gray-500')}>Select Date</span>
        <div className="h-px w-8 bg-[#333]" />
        <StepIndicator step={3} currentStep={currentStep} />
        <span className={cn('text-sm font-medium', currentStep >= 3 ? 'text-white' : 'text-gray-500')}>Mark Attendance</span>
      </div>

      {/* Step 1 & 2 */}
      <div className="grid gap-4 sm:grid-cols-2">
        <Card className={cn('transition-colors border border-[#262626] bg-[#111]', currentStep === 1 && 'ring-2 ring-[#C9A84C]')}>
          <CardHeader className="pb-2"><CardTitle className="flex items-center gap-2 text-sm text-white"><BookOpen className="h-4 w-4 text-[#C9A84C]" /> Subject</CardTitle></CardHeader>
          <CardContent>
            <Select value={selectedSubjectId} onValueChange={handleSubjectChange}>
              <SelectTrigger className={`w-full bg-[#1a1a1a] border-gray-700 text-white`}><SelectValue placeholder="Choose a subject..." /></SelectTrigger>
              <SelectContent className="bg-[#111] border-gray-700">{subjects.map((s) => (<SelectItem key={s.id} value={s.id}><div className="flex items-center gap-2"><span>{s.name}</span><span className="text-gray-500 text-xs">({s.code})</span></div></SelectItem>))}</SelectContent>
            </Select>
          </CardContent>
        </Card>
        <Card className={cn('transition-colors border border-[#262626] bg-[#111]', currentStep === 2 && !selectedSubjectId && 'ring-2 ring-[#C9A84C]')}>
          <CardHeader className="pb-2"><CardTitle className="flex items-center gap-2 text-sm text-white"><CalendarDays className="h-4 w-4 text-[#C9A84C]" /> Date</CardTitle></CardHeader>
          <CardContent>
            <Input type="date" value={selectedDate} onChange={(e) => handleDateChange(e.target.value)} max={new Date().toISOString().split('T')[0]} className="bg-[#1a1a1a] border-gray-700 text-white" />
          </CardContent>
        </Card>
      </div>

      {/* Step 3 */}
      {selectedSubjectId && (
        <Card className="border border-[#262626] bg-[#111]">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <CardTitle className="flex items-center gap-2 text-base text-white"><ClipboardCheck className="h-4 w-4 text-[#C9A84C]" /> Student Attendance</CardTitle>
              <div className="flex items-center gap-2">
                <Badge className="bg-[#C9A84C]/20 text-[#C9A84C] hover:bg-[#C9A84C]/20 text-xs"><CheckCircle2 className="h-3 w-3 mr-1" />{statusCounts.PRESENT} Present</Badge>
                <Badge className="bg-red-500/20 text-red-400 hover:bg-red-500/20 text-xs"><XCircle className="h-3 w-3 mr-1" />{statusCounts.ABSENT} Absent</Badge>
                <Badge className="bg-amber-500/20 text-amber-400 hover:bg-amber-500/20 text-xs"><Clock className="h-3 w-3 mr-1" />{statusCounts.LATE} Late</Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {loadingStudents ? (
              <div className="space-y-3">{Array.from({ length: 3 }).map((_, i) => (<Skeleton key={i} className="h-14 rounded-xl bg-gray-800" />))}</div>
            ) : students.length === 0 ? (
              <div className="py-8 text-center"><Users className="h-10 w-10 text-gray-600 mx-auto mb-2" /><p className="text-sm text-gray-500">No students enrolled in this subject</p></div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs text-gray-500">{attendanceEntries.length} student{attendanceEntries.length !== 1 ? 's' : ''} total</p>
                  <Button variant="outline" size="sm" onClick={markAllPresent} className="text-[#C9A84C] hover:text-[#B8963A] hover:bg-[#C9A84C]/10 border-[#C9A84C]/30">
                    <CheckCircle2 className="h-3.5 w-3.5 mr-1.5" /> Mark All Present
                  </Button>
                </div>
                <Separator className="bg-[#262626]" />
                <div className="space-y-2 max-h-[480px] overflow-y-auto">
                  {attendanceEntries.map((entry, index) => {
                    const statuses: AttendanceStatus[] = ['PRESENT', 'ABSENT', 'LATE']
                    return (
                      <div key={entry.studentId} className="flex items-start gap-3 rounded-lg border border-[#262626] p-3 hover:bg-[#1a1a1a] transition-colors">
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-800 text-xs font-semibold text-gray-400 mt-0.5">{index + 1}</span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-medium text-white truncate">{entry.studentName}</p>
                            {entry.studentIdDisplay && <Badge variant="outline" className="text-[10px] shrink-0 border-gray-700 text-gray-400">{entry.studentIdDisplay}</Badge>}
                          </div>
                          <p className="text-xs text-gray-500 mt-0.5">{entry.department || '—'}</p>
                          <Input placeholder="Add remarks (optional)" value={entry.remarks} onChange={(e) => updateRemarks(entry.studentId, e.target.value)} className="mt-2 h-8 text-xs bg-[#0a0a0a] border-[#262626] text-white placeholder:text-gray-600" />
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                          {statuses.map((status) => {
                            const config = statusConfig[status]; const isActive = entry.status === status
                            return (
                              <button key={status} onClick={() => updateStatus(entry.studentId, status)}
                                className={cn('flex items-center gap-1 rounded-md border px-2.5 py-1.5 text-xs font-medium transition-colors',
                                  isActive ? config.activeClass : `bg-[#1a1a1a] text-gray-500 border-[#333] ${config.hoverClass}`)}
                                title={config.label}>
                                <config.icon className="h-3 w-3" />
                                <span className="hidden sm:inline">{config.label}</span>
                              </button>
                            )
                          })}
                        </div>
                      </div>
                    )
                  })}
                </div>
                <Separator className="bg-[#262626]" />
                <div className="flex items-center justify-between pt-2">
                  <p className="text-xs text-gray-500"><AlertCircle className="h-3 w-3 inline mr-1" /> You can re-submit to update records for the same date.</p>
                  <Button onClick={handleSubmit} disabled={submitting || attendanceEntries.length === 0} className="bg-[#C9A84C] hover:bg-[#B8963A] text-black">
                    {submitting ? <><RefreshCcw className="h-4 w-4 mr-2 animate-spin" /> Saving...</> : <><Save className="h-4 w-4 mr-2" /> Submit Attendance</>}
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
