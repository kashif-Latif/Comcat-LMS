'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { BookOpen, Users, GraduationCap, Hash, Building2, Calendar, Star, AlertCircle, Eye, Search } from 'lucide-react'
import { cn } from '@/lib/utils'

interface TeacherInfo { id: string; name: string; teacherId: string | null }
interface Subject { id: string; code: string; name: string; description: string | null; credits: number; semester: number | null; department: string | null; teachers: Array<{ teacher: TeacherInfo }>; _count: { enrollments: number } }

function LoadingSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{Array.from({ length: 4 }).map((_, i) => (<Skeleton key={i} className="h-[120px] rounded-xl bg-gray-800" />))}</div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{Array.from({ length: 6 }).map((_, i) => (<Skeleton key={i} className="h-[180px] rounded-xl bg-gray-800" />))}</div>
    </div>
  )
}

export function MySubjects() {
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null)

  useEffect(() => {
    async function fetchSubjects() {
      try { const res = await fetch('/api/subjects'); if (!res.ok) throw new Error('Failed to fetch subjects'); setSubjects(await res.json()) } catch (err) { setError(err instanceof Error ? err.message : 'An error occurred') } finally { setLoading(false) }
    }
    fetchSubjects()
  }, [])

  const totalCredits = subjects.reduce((sum, s) => sum + s.credits, 0)
  const filteredSubjects = subjects.filter((s) => s.name.toLowerCase().includes(search.toLowerCase()) || s.code.toLowerCase().includes(search.toLowerCase()) || s.department?.toLowerCase().includes(search.toLowerCase()))

  if (loading) return <LoadingSkeleton />
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-500/20"><AlertCircle className="h-8 w-8 text-red-400" /></div>
        <h3 className="text-lg font-semibold text-white">Failed to load subjects</h3>
        <p className="text-sm text-gray-500 mt-1">{error}</p>
        <button onClick={() => window.location.reload()} className="mt-4 px-4 py-2 text-sm font-medium text-black bg-[#C9A84C] rounded-lg hover:bg-[#B8963A] transition-colors">Try Again</button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border border-[#262626] bg-[#111]"><CardContent className="p-6"><div className="flex items-center justify-between"><div className="space-y-1"><p className="text-sm font-medium text-gray-500">Enrolled Subjects</p><p className="text-3xl font-bold text-white">{subjects.length}</p></div><div className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-500/20"><BookOpen className="h-6 w-6 text-teal-400" /></div></div></CardContent></Card>
        <Card className="border border-[#262626] bg-[#111]"><CardContent className="p-6"><div className="flex items-center justify-between"><div className="space-y-1"><p className="text-sm font-medium text-gray-500">Total Credits</p><p className="text-3xl font-bold text-white">{totalCredits}</p></div><div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#C9A84C]/20"><Star className="h-6 w-6 text-[#C9A84C]" /></div></div></CardContent></Card>
        <Card className="border border-[#262626] bg-[#111]"><CardContent className="p-6"><div className="flex items-center justify-between"><div className="space-y-1"><p className="text-sm font-medium text-gray-500">Departments</p><p className="text-3xl font-bold text-white">{new Set(subjects.map((s) => s.department).filter(Boolean) as string[]).size}</p></div><div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/20"><Building2 className="h-6 w-6 text-amber-400" /></div></div></CardContent></Card>
        <Card className="border border-[#262626] bg-[#111]"><CardContent className="p-6"><div className="flex items-center justify-between"><div className="space-y-1"><p className="text-sm font-medium text-gray-500">Teachers</p><p className="text-3xl font-bold text-white">{new Set(subjects.flatMap((s) => s.teachers.map((t) => t.teacher.id))).size}</p></div><div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-500/20"><GraduationCap className="h-6 w-6 text-orange-400" /></div></div></CardContent></Card>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
          <input type="text" placeholder="Search by name, code, or department..." value={search} onChange={(e) => setSearch(e.target.value)} className="flex h-10 w-full rounded-lg border border-[#333] bg-[#1a1a1a] pl-10 pr-4 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#C9A84C] focus:border-transparent" />
        </div>
      </div>

      {filteredSubjects.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16">
          <BookOpen className="h-12 w-12 text-gray-600 mb-3" />
          <h3 className="text-lg font-semibold text-white">{search ? 'No matching subjects' : 'No Subjects Enrolled'}</h3>
          <p className="text-sm text-gray-500 mt-1">{search ? 'Try adjusting your search terms' : 'Contact the admin to get enrolled in subjects'}</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredSubjects.map((subject) => (
            <Card key={subject.id} className="hover:border-[#333] transition-all cursor-pointer group border border-[#262626] bg-[#111]" onClick={() => setSelectedSubject(subject)}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="min-w-0"><Badge variant="outline" className="text-[10px] mb-2 shrink-0 border-gray-700 text-gray-400">{subject.code}</Badge><CardTitle className="text-base leading-tight truncate text-white">{subject.name}</CardTitle></div>
                  <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity text-gray-500 hover:text-white" onClick={(e) => { e.stopPropagation(); setSelectedSubject(subject) }}><Eye className="h-4 w-4" /></Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex flex-wrap gap-2">
                  <Badge className="bg-teal-500/15 text-teal-400 hover:bg-teal-500/15 text-xs"><Star className="h-3 w-3 mr-1" />{subject.credits} credits</Badge>
                  {subject.department && <Badge className="bg-gray-700 text-gray-300 hover:bg-gray-700 text-xs"><Building2 className="h-3 w-3 mr-1" />{subject.department}</Badge>}
                </div>
                {subject.teachers.length > 0 && <div className="flex items-center gap-1.5 text-xs text-gray-500"><GraduationCap className="h-3.5 w-3.5" /><span className="truncate">{subject.teachers.map((t) => t.teacher.name).join(', ')}</span></div>}
                <div className="flex items-center justify-between pt-2 border-t border-[#262626] text-xs text-gray-500">
                  <div className="flex items-center gap-1"><Users className="h-3 w-3" /><span>{subject._count.enrollments} enrolled</span></div>
                  {subject.semester && <div className="flex items-center gap-1"><Calendar className="h-3 w-3" /><span>Sem {subject.semester}</span></div>}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={!!selectedSubject} onOpenChange={(open) => !open && setSelectedSubject(null)}>
        <DialogContent className="max-w-lg bg-[#111] border-[#262626]">
          <DialogHeader><DialogTitle className="flex items-center gap-2 text-white"><BookOpen className="h-5 w-5 text-[#C9A84C]" />{selectedSubject?.name}</DialogTitle></DialogHeader>
          {selectedSubject && (
            <div className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1"><div className="flex items-center gap-1.5"><Hash className="h-3.5 w-3.5 text-gray-500" /><span className="text-xs text-gray-500">Course Code</span></div><Badge variant="outline" className="border-gray-700 text-gray-300">{selectedSubject.code}</Badge></div>
                <div className="space-y-1"><div className="flex items-center gap-1.5"><Star className="h-3.5 w-3.5 text-gray-500" /><span className="text-xs text-gray-500">Credits</span></div><p className="text-sm font-semibold text-white">{selectedSubject.credits}</p></div>
                <div className="space-y-1"><div className="flex items-center gap-1.5"><Building2 className="h-3.5 w-3.5 text-gray-500" /><span className="text-xs text-gray-500">Department</span></div><p className="text-sm font-medium text-gray-200">{selectedSubject.department || '—'}</p></div>
                <div className="space-y-1"><div className="flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5 text-gray-500" /><span className="text-xs text-gray-500">Semester</span></div><p className="text-sm font-medium text-gray-200">{selectedSubject.semester || '—'}</p></div>
              </div>
              {selectedSubject.description && (
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-gray-300">Description</h4>
                  <p className="text-sm text-gray-400 bg-[#0a0a0a] rounded-lg p-3 border border-[#262626]">{selectedSubject.description}</p>
                </div>
              )}
              {selectedSubject.teachers.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-gray-300">Instructor(s)</h4>
                  <div className="space-y-2">{selectedSubject.teachers.map((t) => (
                    <div key={t.teacher.id} className="flex items-center gap-3 rounded-lg border border-[#262626] p-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#C9A84C]/20"><span className="text-xs font-semibold text-[#C9A84C]">{t.teacher.name.charAt(0)}</span></div>
                      <div className="min-w-0"><p className="text-sm font-medium text-white truncate">{t.teacher.name}</p>{t.teacher.teacherId && <p className="text-xs text-gray-500">ID: {t.teacher.teacherId}</p>}</div>
                    </div>
                  ))}</div>
                </div>
              )}
              <div className="flex items-center justify-between pt-2 border-t border-[#262626]">
                <span className="text-sm text-gray-500">Total students enrolled</span>
                <Badge className="bg-[#C9A84C]/15 text-[#C9A84C] hover:bg-[#C9A84C]/15"><Users className="h-3 w-3 mr-1" />{selectedSubject._count.enrollments}</Badge>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
