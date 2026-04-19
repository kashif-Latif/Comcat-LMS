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
  Users,
  Loader2,
} from 'lucide-react'

interface Student {
  id: string
  email: string
  name: string
  role: string
  phone: string | null
  department: string | null
  semester: number | null
  enrollmentYear: number | null
  studentId: string | null
  dateOfBirth: string | null
  createdAt: string
}

interface StudentFormData {
  name: string
  email: string
  password: string
  studentId: string
  department: string
  semester: string
  enrollmentYear: string
  phone: string
  dateOfBirth: string
}

const emptyForm: StudentFormData = {
  name: '',
  email: '',
  password: '',
  studentId: '',
  department: '',
  semester: '',
  enrollmentYear: '',
  phone: '',
  dateOfBirth: '',
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

export function ManageStudents() {
  const [students, setStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filterDept, setFilterDept] = useState('all')

  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingStudent, setEditingStudent] = useState<Student | null>(null)
  const [form, setForm] = useState<StudentFormData>(emptyForm)
  const [submitting, setSubmitting] = useState(false)

  const [deleteOpen, setDeleteOpen] = useState(false)
  const [deletingStudent, setDeletingStudent] = useState<Student | null>(null)
  const [deleting, setDeleting] = useState(false)

  const fetchStudents = useCallback(async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/students')
      if (!res.ok) throw new Error('Failed to fetch students')
      const data = await res.json()
      setStudents(data)
    } catch {
      toast.error('Failed to load students')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchStudents()
  }, [fetchStudents])

  const filteredStudents = students.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.email.toLowerCase().includes(search.toLowerCase()) ||
      s.studentId?.toLowerCase().includes(search.toLowerCase()) ||
      s.phone?.includes(search)
    const matchesDept = filterDept === 'all' || s.department === filterDept
    return matchesSearch && matchesDept
  })

  const openCreateDialog = () => {
    setEditingStudent(null)
    setForm(emptyForm)
    setDialogOpen(true)
  }

  const openEditDialog = (student: Student) => {
    setEditingStudent(student)
    setForm({
      name: student.name,
      email: student.email,
      password: '',
      studentId: student.studentId || '',
      department: student.department || '',
      semester: student.semester?.toString() || '',
      enrollmentYear: student.enrollmentYear?.toString() || '',
      phone: student.phone || '',
      dateOfBirth: student.dateOfBirth ? student.dateOfBirth.split('T')[0] : '',
    })
    setDialogOpen(true)
  }

  const handleSubmit = async () => {
    if (!form.name || !form.email) {
      toast.error('Name and email are required')
      return
    }
    if (!editingStudent && !form.password) {
      toast.error('Password is required for new students')
      return
    }

    try {
      setSubmitting(true)

      if (editingStudent) {
        const payload: Record<string, unknown> = {
          id: editingStudent.id,
          name: form.name,
          email: form.email,
          studentId: form.studentId || null,
          department: form.department || null,
          semester: form.semester ? parseInt(form.semester) : null,
          enrollmentYear: form.enrollmentYear ? parseInt(form.enrollmentYear) : null,
          phone: form.phone || null,
          dateOfBirth: form.dateOfBirth || null,
        }
        if (form.password) payload.password = form.password

        const res = await fetch('/api/students', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
        if (!res.ok) {
          const err = await res.json()
          throw new Error(err.error || 'Failed to update student')
        }
        toast.success('Student updated successfully')
      } else {
        const res = await fetch('/api/students', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...form,
            semester: form.semester ? parseInt(form.semester) : null,
            enrollmentYear: form.enrollmentYear ? parseInt(form.enrollmentYear) : null,
          }),
        })
        if (!res.ok) {
          const err = await res.json()
          throw new Error(err.error || 'Failed to create student')
        }
        toast.success('Student created successfully')
      }

      setDialogOpen(false)
      fetchStudents()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!deletingStudent) return
    try {
      setDeleting(true)
      const res = await fetch(`/api/students?id=${deletingStudent.id}`, {
        method: 'DELETE',
      })
      if (!res.ok) throw new Error('Failed to delete student')
      toast.success('Student deleted successfully')
      setDeleteOpen(false)
      setDeletingStudent(null)
      fetchStudents()
    } catch {
      toast.error('Failed to delete student')
    } finally {
      setDeleting(false)
    }
  }

  const updateForm = (field: keyof StudentFormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Manage Students</h2>
          <p className="text-sm text-gray-500 mt-1">{students.length} students total</p>
        </div>
        <Button onClick={openCreateDialog} className="bg-[#C9A84C] hover:bg-[#B8963A] text-black gap-2">
          <Plus className="h-4 w-4" />
          Add Student
        </Button>
      </div>

      {/* Filters */}
      <Card className="border border-[#262626] bg-[#111]">
        <CardContent className="p-4">
          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
              <Input
                placeholder="Search by name, email, student ID, phone..."
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
                  <SelectItem key={dept} value={dept}>
                    {dept}
                  </SelectItem>
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
          ) : filteredStudents.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gray-800 mb-4">
                <Users className="h-7 w-7 text-gray-500" />
              </div>
              <p className="text-sm font-medium text-white">No students found</p>
              <p className="text-xs text-gray-500 mt-1">
                {search || filterDept !== 'all'
                  ? 'Try adjusting your filters'
                  : 'Add your first student to get started'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-[#1a1a1a] hover:bg-[#1a1a1a]">
                    <TableHead className="font-semibold text-gray-300">Student ID</TableHead>
                    <TableHead className="font-semibold text-gray-300">Name</TableHead>
                    <TableHead className="font-semibold text-gray-300">Email</TableHead>
                    <TableHead className="font-semibold text-gray-300 hidden md:table-cell">Department</TableHead>
                    <TableHead className="font-semibold text-gray-300 hidden lg:table-cell">Semester</TableHead>
                    <TableHead className="font-semibold text-gray-300 hidden lg:table-cell">Phone</TableHead>
                    <TableHead className="font-semibold text-gray-300 text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStudents.map((student) => (
                    <TableRow key={student.id} className="hover:bg-[#1a1a1a] border-b border-[#262626]">
                      <TableCell>
                        <Badge variant="outline" className="font-mono text-xs border-gray-700 text-gray-300">
                          {student.studentId || student.id.slice(0, 8)}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-medium text-white">
                        {student.name}
                      </TableCell>
                      <TableCell className="text-gray-400 text-sm">{student.email}</TableCell>
                      <TableCell className="hidden md:table-cell">
                        {student.department ? (
                          <Badge variant="secondary" className="bg-[#C9A84C]/15 text-[#C9A84C] text-xs">
                            {student.department}
                          </Badge>
                        ) : (
                          <span className="text-gray-600">-</span>
                        )}
                      </TableCell>
                      <TableCell className="hidden lg:table-cell text-gray-400">
                        {student.semester || '-'}
                      </TableCell>
                      <TableCell className="hidden lg:table-cell text-gray-400">
                        {student.phone || '-'}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-gray-500 hover:text-[#C9A84C]"
                            onClick={() => openEditDialog(student)}
                          >
                            <Edit2 className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-gray-500 hover:text-red-400"
                            onClick={() => {
                              setDeletingStudent(student)
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
            <DialogTitle className="text-white">
              {editingStudent ? 'Edit Student' : 'Add New Student'}
            </DialogTitle>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-gray-300">Full Name *</Label>
                <Input
                  id="name"
                  placeholder="John Smith"
                  value={form.name}
                  onChange={(e) => updateForm('name', e.target.value)}
                  className="bg-[#1a1a1a] border-gray-700 text-white placeholder:text-gray-600"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="studentId" className="text-gray-300">Student ID</Label>
                <Input
                  id="studentId"
                  placeholder="STU-001"
                  value={form.studentId}
                  onChange={(e) => updateForm('studentId', e.target.value)}
                  className="bg-[#1a1a1a] border-gray-700 text-white placeholder:text-gray-600"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-300">Email *</Label>
              <Input
                id="email"
                type="email"
                placeholder="john.smith@university.edu"
                value={form.email}
                onChange={(e) => updateForm('email', e.target.value)}
                className="bg-[#1a1a1a] border-gray-700 text-white placeholder:text-gray-600"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-300">
                Password {editingStudent ? '(leave blank to keep current)' : '*'}
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter password"
                value={form.password}
                onChange={(e) => updateForm('password', e.target.value)}
                className="bg-[#1a1a1a] border-gray-700 text-white placeholder:text-gray-600"
              />
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
                      <SelectItem key={dept} value={dept}>
                        {dept}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-gray-300">Semester</Label>
                <Select value={form.semester} onValueChange={(v) => updateForm('semester', v)}>
                  <SelectTrigger className="bg-[#1a1a1a] border-gray-700 text-white">
                    <SelectValue placeholder="Select semester" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#111] border-gray-700">
                    <SelectItem value="none">None</SelectItem>
                    {Array.from({ length: 8 }, (_, i) => i + 1).map((sem) => (
                      <SelectItem key={sem} value={sem.toString()}>
                        Semester {sem}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="enrollmentYear" className="text-gray-300">Enrollment Year</Label>
                <Input
                  id="enrollmentYear"
                  type="number"
                  placeholder="2024"
                  value={form.enrollmentYear}
                  onChange={(e) => updateForm('enrollmentYear', e.target.value)}
                  className="bg-[#1a1a1a] border-gray-700 text-white placeholder:text-gray-600"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dateOfBirth" className="text-gray-300">Date of Birth</Label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  value={form.dateOfBirth}
                  onChange={(e) => updateForm('dateOfBirth', e.target.value)}
                  className="bg-[#1a1a1a] border-gray-700 text-white placeholder:text-gray-600"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="text-gray-300">Phone</Label>
              <Input
                id="phone"
                placeholder="+1 234 567 890"
                value={form.phone}
                onChange={(e) => updateForm('phone', e.target.value)}
                className="bg-[#1a1a1a] border-gray-700 text-white placeholder:text-gray-600"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)} className="border-gray-700 text-gray-300 hover:bg-gray-800">
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={submitting}
              className="bg-[#C9A84C] hover:bg-[#B8963A] text-black"
            >
              {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {editingStudent ? 'Update Student' : 'Create Student'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent className="bg-[#111] border-[#262626]">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">Delete Student</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-400">
              Are you sure you want to delete <strong className="text-white">{deletingStudent?.name}</strong>? This action
              cannot be undone. All related data including enrollments, attendance, and fees will be
              permanently removed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-gray-700 text-gray-300 hover:bg-gray-800">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleting}
              className="bg-red-600 hover:bg-red-700 focus:ring-red-600 text-white"
            >
              {deleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
