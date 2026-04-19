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
import { Switch } from '@/components/ui/switch'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from '@/components/ui/dialog'
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import { Plus, Search, Edit2, Trash2, Megaphone, Loader2, Eye, EyeOff, Calendar } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Announcement {
  id: string; title: string; content: string; category: string; isPublished: boolean
  createdAt: string; updatedAt: string; authorId: string; author: { id: string; name: string } | null
}

interface AnnouncementFormData { title: string; content: string; category: string; isPublished: boolean }

const emptyForm: AnnouncementFormData = { title: '', content: '', category: 'GENERAL', isPublished: true }
const categories = ['GENERAL', 'ACADEMIC', 'EVENT', 'URGENT']
const categoryColors: Record<string, string> = {
  GENERAL: 'bg-gray-700 text-gray-300',
  ACADEMIC: 'bg-[#C9A84C]/20 text-[#C9A84C]',
  EVENT: 'bg-amber-500/20 text-amber-400',
  URGENT: 'bg-red-500/20 text-red-400',
}

export function ManageAnnouncements() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filterCategory, setFilterCategory] = useState('all')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null)
  const [form, setForm] = useState<AnnouncementFormData>(emptyForm)
  const [submitting, setSubmitting] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [deletingAnnouncement, setDeletingAnnouncement] = useState<Announcement | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [viewDialogOpen, setViewDialogOpen] = useState(false)
  const [viewingAnnouncement, setViewingAnnouncement] = useState<Announcement | null>(null)

  const fetchAnnouncements = useCallback(async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/announcements?all=true')
      if (!res.ok) throw new Error('Failed to fetch announcements')
      setAnnouncements(await res.json())
    } catch { toast.error('Failed to load announcements') } finally { setLoading(false) }
  }, [])
  useEffect(() => { fetchAnnouncements() }, [fetchAnnouncements])

  const filteredAnnouncements = announcements.filter((a) => {
    const ms = a.title.toLowerCase().includes(search.toLowerCase()) || a.content.toLowerCase().includes(search.toLowerCase())
    const mc = filterCategory === 'all' || a.category === filterCategory
    return ms && mc
  })

  const openCreateDialog = () => { setEditingAnnouncement(null); setForm(emptyForm); setDialogOpen(true) }
  const openEditDialog = (a: Announcement) => {
    setEditingAnnouncement(a)
    setForm({ title: a.title, content: a.content, category: a.category, isPublished: a.isPublished })
    setDialogOpen(true)
  }

  const handleSubmit = async () => {
    if (!form.title || !form.content) { toast.error('Title and content are required'); return }
    try {
      setSubmitting(true)
      if (editingAnnouncement) {
        const res = await fetch('/api/announcements', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: editingAnnouncement.id, ...form }) })
        if (!res.ok) { const err = await res.json(); throw new Error(err.error || 'Failed to update') }
        toast.success('Announcement updated successfully')
      } else {
        const res = await fetch('/api/announcements', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
        if (!res.ok) { const err = await res.json(); throw new Error(err.error || 'Failed to create') }
        toast.success('Announcement created successfully')
      }
      setDialogOpen(false); fetchAnnouncements()
    } catch (err) { toast.error(err instanceof Error ? err.message : 'An error occurred') } finally { setSubmitting(false) }
  }

  const handleDelete = async () => {
    if (!deletingAnnouncement) return
    try {
      setDeleting(true)
      const res = await fetch(`/api/announcements?id=${deletingAnnouncement.id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Failed to delete')
      toast.success('Announcement deleted successfully')
      setDeleteOpen(false); setDeletingAnnouncement(null); fetchAnnouncements()
    } catch { toast.error('Failed to delete announcement') } finally { setDeleting(false) }
  }

  const togglePublish = async (a: Announcement) => {
    try {
      const res = await fetch('/api/announcements', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: a.id, isPublished: !a.isPublished }) })
      if (!res.ok) throw new Error('Failed to toggle')
      toast.success(a.isPublished ? 'Announcement unpublished' : 'Announcement published')
      fetchAnnouncements()
    } catch { toast.error('Failed to update') }
  }

  const inputCls = "bg-[#1a1a1a] border-gray-700 text-white placeholder:text-gray-600"
  const dialogBg = "bg-[#111] border-[#262626]"

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Manage Announcements</h2>
          <p className="text-sm text-gray-500 mt-1">{announcements.length} announcements total</p>
        </div>
        <Button onClick={openCreateDialog} className="bg-[#C9A84C] hover:bg-[#B8963A] text-black gap-2"><Plus className="h-4 w-4" /> Add Announcement</Button>
      </div>

      <Card className="border border-[#262626] bg-[#111]">
        <CardContent className="p-4">
          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
              <Input placeholder="Search announcements..." value={search} onChange={(e) => setSearch(e.target.value)} className={`pl-9 ${inputCls}`} />
            </div>
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className={`w-full sm:w-[180px] ${inputCls}`}><SelectValue placeholder="Filter category" /></SelectTrigger>
              <SelectContent className="bg-[#111] border-gray-700">
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((cat) => (<SelectItem key={cat} value={cat}>{cat}</SelectItem>))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card className="border border-[#262626] bg-[#111]">
        <CardContent className="p-0">
          {loading ? (
            <div className="space-y-3 p-6">{Array.from({ length: 5 }).map((_, i) => (<Skeleton key={i} className="h-14 w-full bg-gray-800" />))}</div>
          ) : filteredAnnouncements.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gray-800 mb-4"><Megaphone className="h-7 w-7 text-gray-500" /></div>
              <p className="text-sm font-medium text-white">No announcements found</p>
              <p className="text-xs text-gray-500 mt-1">{search || filterCategory !== 'all' ? 'Try adjusting your filters' : 'Create your first announcement'}</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-[#1a1a1a] hover:bg-[#1a1a1a]">
                    <TableHead className="font-semibold text-gray-300">Title</TableHead>
                    <TableHead className="font-semibold text-gray-300 hidden md:table-cell">Category</TableHead>
                    <TableHead className="font-semibold text-gray-300 hidden lg:table-cell">Author</TableHead>
                    <TableHead className="font-semibold text-gray-300 hidden sm:table-cell">Status</TableHead>
                    <TableHead className="font-semibold text-gray-300 hidden lg:table-cell">Date</TableHead>
                    <TableHead className="font-semibold text-gray-300 text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAnnouncements.map((a) => (
                    <TableRow key={a.id} className="hover:bg-[#1a1a1a] border-b border-[#262626]">
                      <TableCell>
                        <button className="text-sm font-medium text-white hover:text-[#C9A84C] text-left line-clamp-1 max-w-[200px]" onClick={() => { setViewingAnnouncement(a); setViewDialogOpen(true) }}>{a.title}</button>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <Badge variant="secondary" className={cn('text-[10px] px-1.5 py-0', categoryColors[a.category] || categoryColors.GENERAL)}>{a.category}</Badge>
                      </TableCell>
                      <TableCell className="hidden lg:table-cell text-gray-400 text-sm">{a.author?.name || 'Unknown'}</TableCell>
                      <TableCell className="hidden sm:table-cell">
                        <div className="flex items-center gap-2">
                          <Switch checked={a.isPublished} onCheckedChange={() => togglePublish(a)} className="data-[state=checked]:bg-[#C9A84C]" />
                          <span className={cn('text-xs font-medium', a.isPublished ? 'text-[#C9A84C]' : 'text-gray-500')}>{a.isPublished ? 'Published' : 'Draft'}</span>
                        </div>
                      </TableCell>
                      <TableCell className="hidden lg:table-cell text-gray-500 text-sm">
                        <div className="flex items-center gap-1"><Calendar className="h-3 w-3" />{new Date(a.createdAt).toLocaleDateString()}</div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500 hover:text-gray-300" onClick={() => { setViewingAnnouncement(a); setViewDialogOpen(true) }}>{a.isPublished ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}</Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500 hover:text-[#C9A84C]" onClick={() => openEditDialog(a)}><Edit2 className="h-3.5 w-3.5" /></Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500 hover:text-red-400" onClick={() => { setDeletingAnnouncement(a); setDeleteOpen(true) }}><Trash2 className="h-3.5 w-3.5" /></Button>
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
          <DialogHeader><DialogTitle className="text-white">{editingAnnouncement ? 'Edit Announcement' : 'Create Announcement'}</DialogTitle></DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="atitle" className="text-gray-300">Title *</Label>
              <Input id="atitle" placeholder="Announcement title" value={form.title} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))} className={inputCls} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="acontent" className="text-gray-300">Content *</Label>
              <Textarea id="acontent" placeholder="Write your announcement content..." value={form.content} onChange={(e) => setForm((p) => ({ ...p, content: e.target.value }))} rows={6} className={inputCls} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-gray-300">Category</Label>
                <Select value={form.category} onValueChange={(v) => setForm((p) => ({ ...p, category: v }))}>
                  <SelectTrigger className={inputCls}><SelectValue /></SelectTrigger>
                  <SelectContent className="bg-[#111] border-gray-700">{categories.map((cat) => (<SelectItem key={cat} value={cat}>{cat}</SelectItem>))}</SelectContent>
                </Select>
              </div>
              <div className="flex items-end gap-3 pb-0.5">
                <Switch checked={form.isPublished} onCheckedChange={(v) => setForm((p) => ({ ...p, isPublished: v }))} className="data-[state=checked]:bg-[#C9A84C]" id="apublished" />
                <Label htmlFor="apublished" className="text-sm text-gray-300 cursor-pointer">{form.isPublished ? 'Published' : 'Save as Draft'}</Label>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)} className="border-gray-700 text-gray-300 hover:bg-gray-800">Cancel</Button>
            <Button onClick={handleSubmit} disabled={submitting} className="bg-[#C9A84C] hover:bg-[#B8963A] text-black">
              {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}{editingAnnouncement ? 'Update' : 'Create'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className={`max-w-lg ${dialogBg}`}>
          <DialogHeader>
            <div className="flex items-center gap-2">
              {viewingAnnouncement && <Badge variant="secondary" className={cn('text-[10px] px-1.5 py-0', categoryColors[viewingAnnouncement.category] || categoryColors.GENERAL)}>{viewingAnnouncement.category}</Badge>}
              {viewingAnnouncement && <Badge variant="secondary" className={cn('text-[10px] px-1.5 py-0', viewingAnnouncement.isPublished ? 'bg-[#C9A84C]/20 text-[#C9A84C]' : 'bg-gray-700 text-gray-400')}>{viewingAnnouncement.isPublished ? 'Published' : 'Draft'}</Badge>}
            </div>
            <DialogTitle className="text-lg text-white">{viewingAnnouncement?.title}</DialogTitle>
          </DialogHeader>
          {viewingAnnouncement && (
            <div className="space-y-4 py-2">
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <span>By {viewingAnnouncement.author?.name || 'Unknown'}</span>
                <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{new Date(viewingAnnouncement.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="text-gray-300 whitespace-pre-wrap leading-relaxed">{viewingAnnouncement.content}</div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => { setViewDialogOpen(false); if (viewingAnnouncement) openEditDialog(viewingAnnouncement) }} className="border-gray-700 text-gray-300 hover:bg-gray-800"><Edit2 className="mr-2 h-3.5 w-3.5" /> Edit</Button>
            <Button variant="outline" onClick={() => setViewDialogOpen(false)} className="border-gray-700 text-gray-300 hover:bg-gray-800">Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent className="bg-[#111] border-[#262626]">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">Delete Announcement</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-400">Are you sure you want to delete <strong className="text-white">&ldquo;{deletingAnnouncement?.title}&rdquo;</strong>? This action cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-gray-700 text-gray-300 hover:bg-gray-800">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={deleting} className="bg-red-600 hover:bg-red-700 focus:ring-red-600 text-white">{deleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
