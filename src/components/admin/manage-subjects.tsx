'use client'

import { useEffect, useState, useCallback } from 'react'
import { toast } from 'sonner'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Skeleton } from '@/components/ui/skeleton'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  BookOpen,
  GraduationCap,
  Loader2,
  Users,
  X,
} from 'lucide-react'

interface SubjectTeacher {
  id: string
  teacherId: string
  teacher: { id: string; name: string; teacherId: string | null }
}

interface Subject {
  id: string
  code: string
  name: string
  description: string | null
  credits: number
  semester: number | null
  department: string | null
  teachers: SubjectTeacher[]
  _count: { enrollments: number }
}

interface TeacherItem {
  id: string
  name: string
  teacherId: string | null
}

interface SubjectFormData {
  code: string
  name: string
  description: string
  credits: string
  semester: string
  department: string
  teacherIds: string[]
}

const emptyForm: SubjectFormData = {
  code: '',
  name: '',
  description: '',
  credits: '3',
  semester: '',
  department: '',
  teacherIds: [],
}

const departments = [
  'Computer Science',
  'Electrical Engineering',
  'Mechanical Engineering',
  'Civil Engineering',
  'Business Administration',
  'Mathematics',
  'Physics',
  'Chemistry',
]

export function ManageSubjects() {
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [teachers, setTeachers] = useState<TeacherItem[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null)
  const [form, setForm] = useState<SubjectFormData>(emptyForm)
  const [submitting, setSubmitting] = useState(false)

  const [deleteOpen, setDeleteOpen] = useState(false)
  const [deletingSubject, setDeletingSubject] = useState<Subject | null>(null)
  const [deleting, setDeleting] = useState(false)

  const [assignDialogOpen, setAssignDialogOpen] = useState(false)
  const [assigningSubject, setAssigningSubject] = useState<Subject | null>(null)

  const [enrolledDialogOpen, setEnrolledDialogOpen] = useState(false)
  const [enrolledSubject, setEnrolledSubject] = useState<Subject | null>(null)
  const [enrolledStudents, setEnrolledStudents] = useState<Array<{ id: string; name: string; email: string; studentId: string | null }>>([])
  const [loadingEnrolled, setLoadingEnrolled] = useState(false)

  const fetchSubjects = useCallback(async () => {
    try {
      setLoading(true)
      const [subjectsRes, teachersRes] = await Promise.all([
        fetch('/api/subjects'),
        fetch('/api/teachers'),
      ])
      if (!subjectsRes.ok) throw new Error('Failed to fetch subjects')
      if (!teachersRes.ok) throw new Error('Failed to fetch teachers')
      const subjectsData = await subjectsRes.json()
      const teachersData = await teachersRes.json()
      setSubjects(subjectsData)
      setTeachers(teachersData)
    } catch {
      toast.error('Failed to load data')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchSubjects() }, [fetchSubjects])

  const filteredSubjects = subjects.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.code.toLowerCase().includes(search.toLowerCase()) ||
      s.department?.toLowerCase().includes(search.toLowerCase())
  )

  const openCreateDialog = () => {
    setEditingSubject(null)
    setForm(emptyForm)
    setDialogOpen(true)
  }

  const openEditDialog = (subject: Subject) => {
    setEditingSubject(subject)
    setForm({
      code: subject.code,
      name: subject.name,
      description: subject.description || '',
      credits: subject.credits.toString(),
      semester: subject.semester?.toString() || '',
      department: subject.department || '',
      teacherIds: subject.teachers.map((t) => t.teacherId),
    })
    setDialogOpen(true)
  }

  const handleSubmit = async () => {
    if (!form.code || !form.name) {
      toast.error('Code and name are required')
      return
    }
    try {
      setSubmitting(true)
      if (editingSubject) {
        const res = await fetch('/api/subjects', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: editingSubject.id, code: form.code, name: form.name,
            description: form.description || null, credits: parseInt(form.credits) || 3,
            semester: form.semester ? parseInt(form.semester) : null, department: form.department || null,
          }),
        })
        if (!res.ok) { const err = await res.json(); throw new Error(err.error || 'Failed to update subject') }
        toast.success('Subject updated successfully')
      } else {
        const res = await fetch('/api/subjects', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            code: form.code, name: form.name, description: form.description || null,
            credits: parseInt(form.credits) || 3, semester: form.semester ? parseInt(form.semester) : null,
            department: form.department || null, teacherIds: form.teacherIds,
          }),
        })
        if (!res.ok) { const err = await res.json(); throw new Error(err.error || 'Failed to create subject') }
        toast.success('Subject created successfully')
      }
      setDialogOpen(false)
      fetchSubjects()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'An error occurred')
    } finally { setSubmitting(false) }
  }

  const handleDelete = async () => {
    if (!deletingSubject) return
    try {
      setDeleting(true)
      const res = await fetch(`/api/subjects?id=${deletingSubject.id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Failed to delete subject')
      toast.success('Subject deleted successfully')
      setDeleteOpen(false); setDeletingSubject(null); fetchSubjects()
    } catch { toast.error('Failed to delete subject') } finally { setDeleting(false) }
  }

  const handleAssignTeacher = async (teacherId: string) => {
    if (!assigningSubject) return
    try {
      const res = await fetch('/api/subject-teachers', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subjectId: assigningSubject.id, teacherId }),
      })
      if (!res.ok) {
        const err = await res.json()
        if (res.status === 409 || (err.error && err.error.includes('unique'))) {
          toast.error('This teacher is already assigned to this subject')
        } else { throw new Error(err.error || 'Failed to assign teacher') }
        return
      }
      toast.success('Teacher assigned successfully'); fetchSubjects()
      const updated = await (await fetch('/api/subjects')).json()
      const refreshed = updated.find((s: Subject) => s.id === assigningSubject.id)
      if (refreshed) setAssigningSubject(refreshed)
    } catch (err) { toast.error(err instanceof Error ? err.message : 'Failed to assign teacher') }
  }

  const handleRemoveTeacher = async (assignmentId: string) => {
    try {
      const res = await fetch(`/api/subject-teachers?id=${assignmentId}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Failed to remove teacher')
      toast.success('Teacher removed successfully'); fetchSubjects()
      if (assigningSubject) {
        const updated = await (await fetch('/api/subjects')).json()
        const refreshed = updated.find((s: Subject) => s.id === assigningSubject.id)
        if (refreshed) setAssigningSubject(refreshed)
      }
    } catch { toast.error('Failed to remove teacher') }
  }

  const handleViewEnrolled = async (subject: Subject) => {
    setEnrolledSubject(subject); setEnrolledDialogOpen(true); setLoadingEnrolled(true)
    try {
      const res = await fetch('/api/enrollments')
      if (!res.ok) throw new Error('Failed to fetch enrollments')
      const enrollments = await res.json()
      const subjectEnrollments = enrollments.filter((e: { subjectId: string }) => e.subjectId === subject.id)
      const studentIds = [...new Set(subjectEnrollments.map((e: { studentId: string }) => e.studentId))]
      if (studentIds.length > 0) {
        const studentsRes = await fetch('/api/students')
        if (studentsRes.ok) {
          const allStudents = await studentsRes.json()
          setEnrolledStudents(allStudents.filter((s: { id: string }) => studentIds.includes(s.id)))
        } else { setEnrolledStudents([]) }
      } else { setEnrolledStudents([]) }
    } catch { toast.error('Failed to load enrolled students'); setEnrolledStudents([]) }
    finally { setLoadingEnrolled(false) }
  }

  const updateForm = (field: keyof SubjectFormData, value: string | string[]) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const toggleTeacherSelection = (teacherId: string) => {
    setForm((prev) => ({
      ...prev,
      teacherIds: prev.teacherIds.includes(teacherId)
        ? prev.teacherIds.filter((id) => id !== teacherId)
        : [...prev.teacherIds, teacherId],
    }))
  }

  const inputClasses = "bg-[#1a1a1a] border-gray-700 text-white placeholder:text-gray-600"
  const selectClasses = "bg-[#1a1a1a] border-gray-700 text-white"
  const dialogBg = "bg-[#111] border-[#262626]"

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Manage Subjects</h2>
          <p className="text-sm text-gray-500 mt-1">{subjects.length} subjects total</p>
        </div>
        <Button onClick={openCreateDialog} className="bg-[#C9A84C] hover:bg-[#B8963A] text-black gap-2">
          <Plus className="h-4 w-4" /> Add Subject
        </Button>
      </div>

      {/* Filters */}
      <Card className="border border-[#262626] bg-[#111]">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
            <Input placeholder="Search by name, code, or department..." value={search} onChange={(e) => setSearch(e.target.value)} className={`pl-9 ${inputClasses}`} />
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card className="border border-[#262626] bg-[#111]">
        <CardContent className="p-0">
          {loading ? (
            <div className="space-y-3 p-6">
              {Array.from({ length: 5 }).map((_, i) => (<Skeleton key={i} className="h-12 w-full bg-gray-800" />))}
            </div>
          ) : filteredSubjects.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gray-800 mb-4">
                <BookOpen className="h-7 w-7 text-gray-500" />
              </div>
              <p className="text-sm font-medium text-white">No subjects found</p>
              <p className="text-xs text-gray-500 mt-1">{search ? 'Try adjusting your search' : 'Add your first subject'}</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-[#1a1a1a] hover:bg-[#1a1a1a]">
                    <TableHead className="font-semibold text-gray-300">Code</TableHead>
                    <TableHead className="font-semibold text-gray-300">Name</TableHead>
                    <TableHead className="font-semibold text-gray-300 hidden md:table-cell">Credits</TableHead>
                    <TableHead className="font-semibold text-gray-300 hidden lg:table-cell">Department</TableHead>
                    <TableHead className="font-semibold text-gray-300 hidden lg:table-cell">Teachers</TableHead>
                    <TableHead className="font-semibold text-gray-300 hidden lg:table-cell">Enrolled</TableHead>
                    <TableHead className="font-semibold text-gray-300 text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSubjects.map((subject) => (
                    <TableRow key={subject.id} className="hover:bg-[#1a1a1a] border-b border-[#262626]">
                      <TableCell>
                        <Badge variant="outline" className="font-mono text-xs border-gray-700 text-gray-300">{subject.code}</Badge>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium text-white">{subject.name}</p>
                          {subject.semester && <p className="text-xs text-gray-500">Semester {subject.semester}</p>}
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell text-gray-400">{subject.credits}</TableCell>
                      <TableCell className="hidden lg:table-cell">
                        {subject.department ? (
                          <Badge variant="secondary" className="bg-[#C9A84C]/15 text-[#C9A84C] text-xs">{subject.department}</Badge>
                        ) : <span className="text-gray-600">-</span>}
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        <div className="flex flex-wrap gap-1">
                          {subject.teachers.length > 0 ? (
                            subject.teachers.map((t) => (
                              <Badge key={t.id} variant="secondary" className="bg-teal-500/15 text-teal-400 text-[10px]">{t.teacher.name}</Badge>
                            ))
                          ) : <span className="text-gray-600 text-xs">None</span>}
                        </div>
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        <Button variant="ghost" size="sm" className="gap-1 text-xs text-gray-400 hover:text-[#C9A84C]" onClick={() => handleViewEnrolled(subject)}>
                          <Users className="h-3 w-3" /> {subject._count.enrollments}
                        </Button>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500 hover:text-[#C9A84C]" onClick={() => { setAssigningSubject(subject); setAssignDialogOpen(true) }} title="Manage teachers"><GraduationCap className="h-3.5 w-3.5" /></Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500 hover:text-[#C9A84C]" onClick={() => openEditDialog(subject)}><Edit2 className="h-3.5 w-3.5" /></Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500 hover:text-red-400" onClick={() => { setDeletingSubject(subject); setDeleteOpen(true) }}><Trash2 className="h-3.5 w-3.5" /></Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className={`max-w-lg max-h-[90vh] overflow-y-auto ${dialogBg}`}>
          <DialogHeader>
            <DialogTitle className="text-white">{editingSubject ? 'Edit Subject' : 'Add New Subject'}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="code" className="text-gray-300">Subject Code *</Label>
                <Input id="code" placeholder="CS101" value={form.code} onChange={(e) => updateForm('code', e.target.value)} className={inputClasses} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="credits" className="text-gray-300">Credits</Label>
                <Input id="credits" type="number" min="1" max="6" value={form.credits} onChange={(e) => updateForm('credits', e.target.value)} className={inputClasses} />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="sname" className="text-gray-300">Subject Name *</Label>
              <Input id="sname" placeholder="Introduction to Computer Science" value={form.name} onChange={(e) => updateForm('name', e.target.value)} className={inputClasses} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description" className="text-gray-300">Description</Label>
              <Textarea id="description" placeholder="Subject description..." value={form.description} onChange={(e) => updateForm('description', e.target.value)} rows={3} className={inputClasses} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-gray-300">Department</Label>
                <Select value={form.department} onValueChange={(v) => updateForm('department', v)}>
                  <SelectTrigger className={selectClasses}><SelectValue placeholder="Select department" /></SelectTrigger>
                  <SelectContent className="bg-[#111] border-gray-700">
                    <SelectItem value="none">None</SelectItem>
                    {departments.map((dept) => (<SelectItem key={dept} value={dept}>{dept}</SelectItem>))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-gray-300">Semester</Label>
                <Select value={form.semester} onValueChange={(v) => updateForm('semester', v)}>
                  <SelectTrigger className={selectClasses}><SelectValue placeholder="Select semester" /></SelectTrigger>
                  <SelectContent className="bg-[#111] border-gray-700">
                    <SelectItem value="none">None</SelectItem>
                    {Array.from({ length: 8 }, (_, i) => i + 1).map((sem) => (<SelectItem key={sem} value={sem.toString()}>Semester {sem}</SelectItem>))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            {!editingSubject && (
              <div className="space-y-2">
                <Label className="text-gray-300">Assign Teachers</Label>
                <div className="max-h-40 overflow-y-auto rounded-lg border border-[#262626] bg-[#0a0a0a] p-3 space-y-2">
                  {teachers.length === 0 ? (
                    <p className="text-xs text-gray-500">No teachers available</p>
                  ) : (
                    teachers.map((teacher) => (
                      <label key={teacher.id} className="flex items-center gap-2 cursor-pointer hover:bg-[#1a1a1a] rounded p-1">
                        <Checkbox checked={form.teacherIds.includes(teacher.id)} onCheckedChange={() => toggleTeacherSelection(teacher.id)} />
                        <span className="text-sm text-gray-300">{teacher.name}</span>
                        {teacher.teacherId && <span className="text-xs text-gray-600">({teacher.teacherId})</span>}
                      </label>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)} className="border-gray-700 text-gray-300 hover:bg-gray-800">Cancel</Button>
            <Button onClick={handleSubmit} disabled={submitting} className="bg-[#C9A84C] hover:bg-[#B8963A] text-black">
              {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {editingSubject ? 'Update Subject' : 'Create Subject'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Teacher Assignment Dialog */}
      <Dialog open={assignDialogOpen} onOpenChange={setAssignDialogOpen}>
        <DialogContent className={`max-w-md ${dialogBg}`}>
          <DialogHeader><DialogTitle className="text-white">Manage Teachers - {assigningSubject?.code}</DialogTitle></DialogHeader>
          {assigningSubject && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-300">Currently Assigned</Label>
                {assigningSubject.teachers.length === 0 ? (
                  <p className="text-xs text-gray-500">No teachers assigned</p>
                ) : (
                  <div className="space-y-2">
                    {assigningSubject.teachers.map((t) => (
                      <div key={t.id} className="flex items-center justify-between rounded-lg border border-[#262626] p-2">
                        <div>
                          <p className="text-sm font-medium text-white">{t.teacher.name}</p>
                          {t.teacher.teacherId && <p className="text-xs text-gray-500">{t.teacher.teacherId}</p>}
                        </div>
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-gray-500 hover:text-red-400" onClick={() => handleRemoveTeacher(t.id)}><X className="h-3.5 w-3.5" /></Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-300">Assign New Teacher</Label>
                <Select onValueChange={handleAssignTeacher}>
                  <SelectTrigger className={selectClasses}><SelectValue placeholder="Select a teacher to assign" /></SelectTrigger>
                  <SelectContent className="bg-[#111] border-gray-700">
                    {teachers.filter((t) => !assigningSubject.teachers.some((at) => at.teacherId === t.id)).map((teacher) => (
                      <SelectItem key={teacher.id} value={teacher.id}>{teacher.name} {teacher.teacherId ? `(${teacher.teacherId})` : ''}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Enrolled Students Dialog */}
      <Dialog open={enrolledDialogOpen} onOpenChange={setEnrolledDialogOpen}>
        <DialogContent className={`max-w-md ${dialogBg}`}>
          <DialogHeader><DialogTitle className="text-white">Enrolled Students - {enrolledSubject?.code} {enrolledSubject?.name}</DialogTitle></DialogHeader>
          <div className="py-4 max-h-96 overflow-y-auto">
            {loadingEnrolled ? (
              <div className="space-y-2">{Array.from({ length: 3 }).map((_, i) => (<Skeleton key={i} className="h-12 w-full bg-gray-800" />))}</div>
            ) : enrolledStudents.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-8">No students enrolled in this subject</p>
            ) : (
              <div className="space-y-2">
                {enrolledStudents.map((student) => (
                  <div key={student.id} className="flex items-center gap-3 rounded-lg border border-[#262626] p-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#C9A84C]/20">
                      <span className="text-xs font-semibold text-[#C9A84C]">{student.name.charAt(0)}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white truncate">{student.name}</p>
                      <p className="text-xs text-gray-500 truncate">{student.email}</p>
                    </div>
                    {student.studentId && <Badge variant="outline" className="text-[10px] font-mono border-gray-700 text-gray-300">{student.studentId}</Badge>}
                  </div>
                ))}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent className="bg-[#111] border-[#262626]">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">Delete Subject</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-400">
              Are you sure you want to delete <strong className="text-white">{deletingSubject?.code} - {deletingSubject?.name}</strong>?
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-gray-700 text-gray-300 hover:bg-gray-800">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={deleting} className="bg-red-600 hover:bg-red-700 focus:ring-red-600 text-white">
              {deleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
