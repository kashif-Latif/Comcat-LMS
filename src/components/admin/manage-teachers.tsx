'use client'

import { useEffect, useState, useCallback } from 'react'
import { toast } from 'sonner'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { Skeleton } from '@/components/ui/skeleton'
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
  GraduationCap,
  Loader2,
} from 'lucide-react'

interface Teacher {
  id: string
  email: string
  name: string
  role: string
  phone: string | null
  department: string | null
  teacherId: string | null
  designation: string | null
  qualification: string | null
  createdAt: string
  _count: { teacherSubjects: number }
}

interface TeacherFormData {
  name: string
  email: string
  password: string
  teacherId: string
  department: string
  designation: string
  qualification: string
  phone: string
}

const emptyForm: TeacherFormData = {
  name: '',
  email: '',
  password: '',
  teacherId: '',
  department: '',
  designation: '',
  qualification: '',
  phone: '',
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

const designations = [
  'Professor',
  'Associate Professor',
  'Assistant Professor',
  'Lecturer',
  'Senior Lecturer',
  'Lab Instructor',
]

export function ManageTeachers() {
  const [teachers, setTeachers] = useState<Teacher[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filterDept, setFilterDept] = useState('all')

  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null)
  const [form, setForm] = useState<TeacherFormData>(emptyForm)
  const [submitting, setSubmitting] = useState(false)

  const [deleteOpen, setDeleteOpen] = useState(false)
  const [deletingTeacher, setDeletingTeacher] = useState<Teacher | null>(null)
  const [deleting, setDeleting] = useState(false)

  const fetchTeachers = useCallback(async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/teachers')
      if (!res.ok) throw new Error('Failed to fetch teachers')
      const data = await res.json()
      setTeachers(data)
    } catch {
      toast.error('Failed to load teachers')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchTeachers()
  }, [fetchTeachers])

  const filteredTeachers = teachers.filter((t) => {
    const matchesSearch =
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.email.toLowerCase().includes(search.toLowerCase()) ||
      t.teacherId?.toLowerCase().includes(search.toLowerCase())
    const matchesDept = filterDept === 'all' || t.department === filterDept
    return matchesSearch && matchesDept
  })

  const openCreateDialog = () => {
    setEditingTeacher(null)
    setForm(emptyForm)
    setDialogOpen(true)
  }

  const openEditDialog = (teacher: Teacher) => {
    setEditingTeacher(teacher)
    setForm({
      name: teacher.name,
      email: teacher.email,
      password: '',
      teacherId: teacher.teacherId || '',
      department: teacher.department || '',
      designation: teacher.designation || '',
      qualification: teacher.qualification || '',
      phone: teacher.phone || '',
    })
    setDialogOpen(true)
  }

  const handleSubmit = async () => {
    if (!form.name || !form.email) {
      toast.error('Name and email are required')
      return
    }
    if (!editingTeacher && !form.password) {
      toast.error('Password is required for new teachers')
      return
    }

    try {
      setSubmitting(true)

      if (editingTeacher) {
        const payload: Record<string, unknown> = {
          id: editingTeacher.id,
          name: form.name,
          email: form.email,
          teacherId: form.teacherId || null,
          department: form.department || null,
          designation: form.designation || null,
          qualification: form.qualification || null,
          phone: form.phone || null,
        }
        if (form.password) payload.password = form.password

        const res = await fetch('/api/teachers', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
        if (!res.ok) {
          const err = await res.json()
          throw new Error(err.error || 'Failed to update teacher')
        }
        toast.success('Teacher updated successfully')
      } else {
        const res = await fetch('/api/teachers', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        })
        if (!res.ok) {
          const err = await res.json()
          throw new Error(err.error || 'Failed to create teacher')
        }
        toast.success('Teacher created successfully')
      }

      setDialogOpen(false)
      fetchTeachers()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!deletingTeacher) return
    try {
      setDeleting(true)
      const res = await fetch(`/api/teachers?id=${deletingTeacher.id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Failed to delete teacher')
      toast.success('Teacher deleted successfully')
      setDeleteOpen(false)
      setDeletingTeacher(null)
      fetchTeachers()
    } catch {
      toast.error('Failed to delete teacher')
    } finally {
      setDeleting(false)
    }
  }

  const updateForm = (field: keyof TeacherFormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Manage Teachers</h2>
          <p className="text-sm text-gray-500 mt-1">{teachers.length} teachers total</p>
        </div>
        <Button onClick={openCreateDialog} className="bg-[#C9A84C] hover:bg-[#B8963A] text-black gap-2">
          <Plus className="h-4 w-4" />
          Add Teacher
        </Button>
      </div>

      {/* Filters */}
      <Card className="border border-[#262626] bg-[#111]">
        <CardContent className="p-4">
          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
              <Input
                placeholder="Search by name, email, teacher ID..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 bg-[#1a1a1a] border-gray-700 text-white placeholder:text-gray-600"
              />
            </div>
            <Select value={filterDept} onValueChange={setFilterDept}>
              <SelectTrigger className="w-full sm:w-[200px] bg-[#1a1a1a] border-gray-700 text-white">
                <SelectValue placeholder="Filter department" />
              </SelectTrigger>
              <SelectContent className="bg-[#111] border-gray-700">
                <SelectItem value="all">All Departments</SelectItem>
                {departments.map((dept) => (
                  <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card className="border border-[#262626] bg-[#111]">
        <CardContent className="p-0">
          {loading ? (
            <div className="space-y-3 p-6">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full bg-gray-800" />
              ))}
            </div>
          ) : filteredTeachers.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gray-800 mb-4">
                <GraduationCap className="h-7 w-7 text-gray-500" />
              </div>
              <p className="text-sm font-medium text-white">No teachers found</p>
              <p className="text-xs text-gray-500 mt-1">
                {search || filterDept !== 'all' ? 'Try adjusting your filters' : 'Add your first teacher'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-[#1a1a1a] hover:bg-[#1a1a1a]">
                    <TableHead className="font-semibold text-gray-300">Teacher ID</TableHead>
                    <TableHead className="font-semibold text-gray-300">Name</TableHead>
                    <TableHead className="font-semibold text-gray-300">Email</TableHead>
                    <TableHead className="font-semibold text-gray-300 hidden md:table-cell">Department</TableHead>
                    <TableHead className="font-semibold text-gray-300 hidden lg:table-cell">Designation</TableHead>
                    <TableHead className="font-semibold text-gray-300 hidden lg:table-cell">Subjects</TableHead>
                    <TableHead className="font-semibold text-gray-300 text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTeachers.map((teacher) => (
                    <TableRow key={teacher.id} className="hover:bg-[#1a1a1a] border-b border-[#262626]">
                      <TableCell>
                        <Badge variant="outline" className="font-mono text-xs border-gray-700 text-gray-300">
                          {teacher.teacherId || teacher.id.slice(0, 8)}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-medium text-white">{teacher.name}</TableCell>
                      <TableCell className="text-gray-400 text-sm">{teacher.email}</TableCell>
                      <TableCell className="hidden md:table-cell">
                        {teacher.department ? (
                          <Badge variant="secondary" className="bg-teal-500/15 text-teal-400 text-xs">
                            {teacher.department}
                          </Badge>
                        ) : (
                          <span className="text-gray-600">-</span>
                        )}
                      </TableCell>
                      <TableCell className="hidden lg:table-cell text-gray-400">
                        {teacher.designation || '-'}
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        <Badge variant="secondary" className="bg-amber-500/15 text-amber-400 text-xs">
                          {teacher._count?.teacherSubjects || 0} subjects
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-gray-500 hover:text-[#C9A84C]"
                            onClick={() => openEditDialog(teacher)}
                          >
                            <Edit2 className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-gray-500 hover:text-red-400"
                            onClick={() => {
                              setDeletingTeacher(teacher)
                              setDeleteOpen(true)
                            }}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
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
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto bg-[#111] border-[#262626]">
          <DialogHeader>
            <DialogTitle className="text-white">{editingTeacher ? 'Edit Teacher' : 'Add New Teacher'}</DialogTitle>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="tname" className="text-gray-300">Full Name *</Label>
                <Input id="tname" placeholder="Dr. Jane Doe" value={form.name} onChange={(e) => updateForm('name', e.target.value)} className="bg-[#1a1a1a] border-gray-700 text-white placeholder:text-gray-600" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="teacherId" className="text-gray-300">Teacher ID</Label>
                <Input id="teacherId" placeholder="TCH-001" value={form.teacherId} onChange={(e) => updateForm('teacherId', e.target.value)} className="bg-[#1a1a1a] border-gray-700 text-white placeholder:text-gray-600" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="temail" className="text-gray-300">Email *</Label>
              <Input id="temail" type="email" placeholder="jane.doe@university.edu" value={form.email} onChange={(e) => updateForm('email', e.target.value)} className="bg-[#1a1a1a] border-gray-700 text-white placeholder:text-gray-600" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tpassword" className="text-gray-300">Password {editingTeacher ? '(leave blank to keep current)' : '*'}</Label>
              <Input id="tpassword" type="password" placeholder="Enter password" value={form.password} onChange={(e) => updateForm('password', e.target.value)} className="bg-[#1a1a1a] border-gray-700 text-white placeholder:text-gray-600" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-gray-300">Department</Label>
                <Select value={form.department} onValueChange={(v) => updateForm('department', v)}>
                  <SelectTrigger className="bg-[#1a1a1a] border-gray-700 text-white">
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#111] border-gray-700">
                    <SelectItem value="none">None</SelectItem>
                    {departments.map((dept) => (
                      <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-gray-300">Designation</Label>
                <Select value={form.designation} onValueChange={(v) => updateForm('designation', v)}>
                  <SelectTrigger className="bg-[#1a1a1a] border-gray-700 text-white">
                    <SelectValue placeholder="Select designation" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#111] border-gray-700">
                    <SelectItem value="none">None</SelectItem>
                    {designations.map((d) => (
                      <SelectItem key={d} value={d}>{d}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="qualification" className="text-gray-300">Qualification</Label>
                <Input id="qualification" placeholder="Ph.D. Computer Science" value={form.qualification} onChange={(e) => updateForm('qualification', e.target.value)} className="bg-[#1a1a1a] border-gray-700 text-white placeholder:text-gray-600" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tphone" className="text-gray-300">Phone</Label>
                <Input id="tphone" placeholder="+1 234 567 890" value={form.phone} onChange={(e) => updateForm('phone', e.target.value)} className="bg-[#1a1a1a] border-gray-700 text-white placeholder:text-gray-600" />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)} className="border-gray-700 text-gray-300 hover:bg-gray-800">Cancel</Button>
            <Button onClick={handleSubmit} disabled={submitting} className="bg-[#C9A84C] hover:bg-[#B8963A] text-black">
              {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {editingTeacher ? 'Update Teacher' : 'Create Teacher'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent className="bg-[#111] border-[#262626]">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">Delete Teacher</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-400">
              Are you sure you want to delete <strong className="text-white">{deletingTeacher?.name}</strong>? This action
              cannot be undone. All related data including subject assignments and attendance records
              will be permanently removed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-gray-700 text-gray-300 hover:bg-gray-800">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={deleting} className="bg-red-600 hover:bg-red-700 focus:ring-red-600 text-white">
              {deleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
