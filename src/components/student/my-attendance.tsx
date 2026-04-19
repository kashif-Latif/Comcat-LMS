'use client'

import { useEffect, useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { ClipboardCheck, CheckCircle2, XCircle, Clock, Download, AlertCircle, CalendarDays, Filter, BarChart3 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { format } from 'date-fns'

interface AttendanceRecord { id: string; studentId: string; subjectId: string; teacherId: string; date: string; status: 'PRESENT' | 'ABSENT' | 'LATE'; remarks: string | null; createdAt: string; student: { id: string; name: string; studentId: string | null }; subject: { id: string; name: string; code: string }; teacher: { id: string; name: string } }
type AttendanceStatus = 'PRESENT' | 'ABSENT' | 'LATE'

const statusConfig: Record<AttendanceStatus, { label: string; bgClass: string; textClass: string; icon: React.ElementType }> = {
  PRESENT: { label: 'Present', bgClass: 'bg-[#C9A84C]/20', textClass: 'text-[#C9A84C]', icon: CheckCircle2 },
  ABSENT: { label: 'Absent', bgClass: 'bg-red-500/20', textClass: 'text-red-400', icon: XCircle },
  LATE: { label: 'Late', bgClass: 'bg-amber-500/20', textClass: 'text-amber-400', icon: Clock },
}

function LoadingSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-5">{Array.from({ length: 5 }).map((_, i) => (<Skeleton key={i} className="h-[90px] rounded-xl bg-gray-800" />))}</div>
      <div className="flex gap-4"><Skeleton className="h-10 w-48 rounded-lg bg-gray-800" /><Skeleton className="h-10 w-48 rounded-lg bg-gray-800" /><Skeleton className="h-10 w-48 rounded-lg bg-gray-800" /></div>
      <div className="space-y-3">{Array.from({ length: 5 }).map((_, i) => (<Skeleton key={i} className="h-14 rounded-xl bg-gray-800" />))}</div>
    </div>
  )
}

export function MyAttendance() {
  const [records, setRecords] = useState<AttendanceRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [subjectFilter, setSubjectFilter] = useState<string>('all')
  const [dateFrom, setDateFrom] = useState<string>('')
  const [dateTo, setDateTo] = useState<string>('')

  useEffect(() => {
    async function fetchAttendance() {
      try { const res = await fetch('/api/attendance'); if (!res.ok) throw new Error('Failed to fetch attendance'); setRecords(await res.json()) } catch (err) { setError(err instanceof Error ? err.message : 'An error occurred') } finally { setLoading(false) }
    }
    fetchAttendance()
  }, [])

  const subjects = useMemo(() => {
    const map = new Map<string, { id: string; name: string; code: string }>()
    records.forEach((r) => { if (!map.has(r.subjectId)) map.set(r.subjectId, r.subject) })
    return Array.from(map.values())
  }, [records])

  const filteredRecords = useMemo(() => {
    let filtered = [...records]
    if (subjectFilter !== 'all') filtered = filtered.filter((r) => r.subjectId === subjectFilter)
    if (dateFrom) { const from = new Date(dateFrom); from.setHours(0, 0, 0, 0); filtered = filtered.filter((r) => new Date(r.date) >= from) }
    if (dateTo) { const to = new Date(dateTo); to.setHours(23, 59, 59, 999); filtered = filtered.filter((r) => new Date(r.date) <= to) }
    return filtered
  }, [records, subjectFilter, dateFrom, dateTo])

  const stats = useMemo(() => {
    const total = filteredRecords.length
    const present = filteredRecords.filter((r) => r.status === 'PRESENT').length
    const absent = filteredRecords.filter((r) => r.status === 'ABSENT').length
    const late = filteredRecords.filter((r) => r.status === 'LATE').length
    const percentage = total > 0 ? Math.round((present / total) * 100) : 0
    return { total, present, absent, late, percentage }
  }, [filteredRecords])

  const handleExport = () => {
    const lines: string[] = ['═══════════════════════════════════════════════════', '           ATTENDANCE REPORT', '═══════════════════════════════════════════════════', `Generated: ${format(new Date(), 'MMMM dd, yyyy HH:mm')}`, `Period: ${dateFrom || 'All time'} - ${dateTo || 'Present'}`, `Subject: ${subjectFilter === 'all' ? 'All Subjects' : subjects.find((s) => s.id === subjectFilter)?.name || subjectFilter}`, '', '── SUMMARY ──────────────────────────────────────', `Total Classes: ${stats.total}`, `Present: ${stats.present}`, `Absent: ${stats.absent}`, `Late: ${stats.late}`, `Attendance: ${stats.percentage}%`, '', '── DETAILED RECORDS ─────────────────────────────']
    filteredRecords.forEach((r, i) => { const sl = statusConfig[r.status]?.label || r.status; lines.push(`${i + 1}. ${format(new Date(r.date), 'MMM dd, yyyy')} | ${r.subject.code} - ${r.subject.name} | ${sl}${r.remarks ? ` | Remarks: ${r.remarks}` : ''}`) })
    lines.push(''); lines.push('═══════════════════════════════════════════════════')
    const blob = new Blob([lines.join('\n')], { type: 'text/plain' }); const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = `attendance-report-${format(new Date(), 'yyyy-MM-dd')}.txt`; a.click(); URL.revokeObjectURL(url)
  }

  const clearFilters = () => { setSubjectFilter('all'); setDateFrom(''); setDateTo('') }
  const hasFilters = subjectFilter !== 'all' || dateFrom || dateTo

  if (loading) return <LoadingSkeleton />
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-500/20"><AlertCircle className="h-8 w-8 text-red-400" /></div>
        <h3 className="text-lg font-semibold text-white">Failed to load attendance</h3>
        <p className="text-sm text-gray-500 mt-1">{error}</p>
        <button onClick={() => window.location.reload()} className="mt-4 px-4 py-2 text-sm font-medium text-black bg-[#C9A84C] rounded-lg hover:bg-[#B8963A] transition-colors">Try Again</button>
      </div>
    )
  }

  const inputCls = "bg-[#1a1a1a] border-gray-700 text-white placeholder:text-gray-600"

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div><h2 className="text-lg font-semibold text-white">My Attendance</h2><p className="text-sm text-gray-500">View and track your attendance records</p></div>
        <Button variant="outline" size="sm" onClick={handleExport} disabled={filteredRecords.length === 0} className="text-[#C9A84C] hover:text-[#B8963A] hover:bg-[#C9A84C]/10 border-[#C9A84C]/30"><Download className="h-4 w-4 mr-2" /> Export Report</Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-5">
        <Card className="border border-[#262626] bg-[#111]"><CardContent className="p-4"><div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-800"><BarChart3 className="h-5 w-5 text-gray-400" /></div><div><p className="text-xs text-gray-500">Total</p><p className="text-xl font-bold text-white">{stats.total}</p></div></div></CardContent></Card>
        <Card className="border border-[#262626] bg-[#111]"><CardContent className="p-4"><div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#C9A84C]/20"><CheckCircle2 className="h-5 w-5 text-[#C9A84C]" /></div><div><p className="text-xs text-gray-500">Present</p><p className="text-xl font-bold text-[#C9A84C]">{stats.present}</p></div></div></CardContent></Card>
        <Card className="border border-[#262626] bg-[#111]"><CardContent className="p-4"><div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-500/20"><XCircle className="h-5 w-5 text-red-400" /></div><div><p className="text-xs text-gray-500">Absent</p><p className="text-xl font-bold text-red-400">{stats.absent}</p></div></div></CardContent></Card>
        <Card className="border border-[#262626] bg-[#111]"><CardContent className="p-4"><div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/20"><Clock className="h-5 w-5 text-amber-400" /></div><div><p className="text-xs text-gray-500">Late</p><p className="text-xl font-bold text-amber-400">{stats.late}</p></div></div></CardContent></Card>
        <Card className="border border-[#262626] bg-[#111]"><CardContent className="p-4"><div className="flex items-center gap-3"><div className={cn('flex h-10 w-10 items-center justify-center rounded-lg', stats.percentage >= 75 ? 'bg-[#C9A84C]/20' : stats.percentage >= 50 ? 'bg-amber-500/20' : 'bg-red-500/20')}><ClipboardCheck className={cn('h-5 w-5', stats.percentage >= 75 ? 'text-[#C9A84C]' : stats.percentage >= 50 ? 'text-amber-400' : 'text-red-400')} /></div><div><p className="text-xs text-gray-500">Percentage</p><p className={cn('text-xl font-bold', stats.percentage >= 75 ? 'text-[#C9A84C]' : stats.percentage >= 50 ? 'text-amber-400' : 'text-red-400')}>{stats.percentage}%</p></div></div></CardContent></Card>
      </div>

      <Card className="border border-[#262626] bg-[#111]">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <div className="flex items-center gap-2 text-sm font-medium text-gray-300"><Filter className="h-4 w-4" /> Filters</div>
            <div className="flex flex-col sm:flex-row gap-3 flex-1 w-full sm:w-auto">
              <Select value={subjectFilter} onValueChange={setSubjectFilter}>
                <SelectTrigger className={`w-full sm:w-[200px] ${inputCls}`}><SelectValue placeholder="All Subjects" /></SelectTrigger>
                <SelectContent className="bg-[#111] border-gray-700"><SelectItem value="all">All Subjects</SelectItem>{subjects.map((s) => (<SelectItem key={s.id} value={s.id}>{s.code} - {s.name}</SelectItem>))}</SelectContent>
              </Select>
              <div className="flex items-center gap-2">
                <CalendarDays className="h-4 w-4 text-gray-500 shrink-0" />
                <Input type="date" placeholder="From" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} className={`w-full sm:w-[150px] h-9 text-sm ${inputCls}`} />
                <span className="text-gray-500 text-sm">to</span>
                <Input type="date" placeholder="To" value={dateTo} onChange={(e) => setDateTo(e.target.value)} className={`w-full sm:w-[150px] h-9 text-sm ${inputCls}`} />
              </div>
              {hasFilters && <Button variant="ghost" size="sm" onClick={clearFilters} className="text-gray-500 hover:text-white">Clear</Button>}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border border-[#262626] bg-[#111]">
        <CardHeader className="pb-3"><CardTitle className="text-base text-white">Records <span className="text-gray-500 font-normal text-sm">({filteredRecords.length} of {records.length})</span></CardTitle></CardHeader>
        <CardContent>
          {filteredRecords.length === 0 ? (
            <div className="py-12 text-center">
              <ClipboardCheck className="h-12 w-12 text-gray-600 mx-auto mb-3" />
              <h3 className="text-sm font-semibold text-white">{hasFilters ? 'No records match your filters' : 'No attendance records yet'}</h3>
              <p className="text-sm text-gray-500 mt-1">{hasFilters ? 'Try adjusting your filter criteria' : 'Attendance will appear here once teachers start marking it'}</p>
            </div>
          ) : (
            <div className="space-y-2 max-h-[480px] overflow-y-auto">
              {filteredRecords.map((record) => {
                const config = statusConfig[record.status]; const StatusIcon = config.icon
                return (
                  <div key={record.id} className="flex items-center gap-4 rounded-lg border border-[#262626] p-3 hover:bg-[#1a1a1a] transition-colors">
                    <div className="flex items-center gap-2 shrink-0 min-w-[120px]"><CalendarDays className="h-4 w-4 text-gray-500" /><span className="text-sm text-gray-300">{format(new Date(record.date), 'MMM dd, yyyy')}</span></div>
                    <div className="flex items-center gap-2 min-w-0 flex-1"><Badge variant="outline" className="text-[10px] shrink-0 border-gray-700 text-gray-400">{record.subject.code}</Badge><span className="text-sm font-medium text-white truncate">{record.subject.name}</span></div>
                    <Badge className={cn('shrink-0 text-xs font-medium gap-1', config.bgClass, config.textClass)}><StatusIcon className="h-3 w-3" />{config.label}</Badge>
                    <span className="text-xs text-gray-500 hidden md:block shrink-0">by {record.teacher.name}</span>
                    {record.remarks && <span className="text-xs text-gray-500 hidden lg:block shrink-0 max-w-[150px] truncate">{record.remarks}</span>}
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
