'use client'

import { useEffect, useState, useCallback } from 'react'
import { toast } from 'sonner'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Search, Mail, MailOpen, ChevronDown, ChevronUp, Eye, Inbox } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ContactMessage {
  id: string; name: string; email: string; subject: string; message: string; isRead: boolean; createdAt: string
}

export function ManageMessages() {
  const [messages, setMessages] = useState<ContactMessage[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [filterStatus, setFilterStatus] = useState<'all' | 'unread' | 'read'>('all')

  const fetchMessages = useCallback(async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/contact')
      if (!res.ok) throw new Error('Failed to fetch messages')
      setMessages(await res.json())
    } catch { toast.error('Failed to load messages') } finally { setLoading(false) }
  }, [])
  useEffect(() => { fetchMessages() }, [fetchMessages])

  const filteredMessages = messages.filter((m) => {
    const ms = m.name.toLowerCase().includes(search.toLowerCase()) || m.email.toLowerCase().includes(search.toLowerCase()) || m.subject.toLowerCase().includes(search.toLowerCase()) || m.message.toLowerCase().includes(search.toLowerCase())
    const mf = filterStatus === 'all' || (filterStatus === 'unread' && !m.isRead) || (filterStatus === 'read' && m.isRead)
    return ms && mf
  })

  const markAsRead = async (message: ContactMessage) => {
    if (message.isRead) return
    try {
      const res = await fetch('/api/contact', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: message.id, isRead: true }) })
      if (!res.ok) throw new Error('Failed to mark as read')
      setMessages((prev) => prev.map((m) => (m.id === message.id ? { ...m, isRead: true } : m)))
      toast.success('Marked as read')
    } catch { toast.error('Failed to update message') }
  }

  const toggleExpand = (id: string, message: ContactMessage) => {
    if (expandedId === id) { setExpandedId(null) } else { setExpandedId(id); markAsRead(message) }
  }

  const unreadCount = messages.filter((m) => !m.isRead).length
  const readCount = messages.filter((m) => m.isRead).length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Messages</h2>
          <div className="flex items-center gap-3 mt-1">
            <p className="text-sm text-gray-500">{messages.length} messages total</p>
            {unreadCount > 0 && (
              <Badge className="bg-[#C9A84C]/20 text-[#C9A84C] text-xs gap-1"><Inbox className="h-3 w-3" />{unreadCount} unread</Badge>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className={cn('gap-1.5 border-gray-700 text-gray-300', filterStatus === 'all' && 'bg-[#C9A84C]/15 text-[#C9A84C] border-[#C9A84C]/30')} onClick={() => setFilterStatus('all')}>All ({messages.length})</Button>
          <Button variant="outline" size="sm" className={cn('gap-1.5 border-gray-700 text-gray-300', filterStatus === 'unread' && 'bg-[#C9A84C]/15 text-[#C9A84C] border-[#C9A84C]/30')} onClick={() => setFilterStatus('unread')}>Unread ({unreadCount})</Button>
          <Button variant="outline" size="sm" className={cn('gap-1.5 border-gray-700 text-gray-300', filterStatus === 'read' && 'bg-gray-800 text-white border-gray-600')} onClick={() => setFilterStatus('read')}>Read ({readCount})</Button>
        </div>
      </div>

      {/* Search */}
      <Card className="border border-[#262626] bg-[#111]">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
            <Input placeholder="Search messages by name, email, subject..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 bg-[#1a1a1a] border-gray-700 text-white placeholder:text-gray-600" />
          </div>
        </CardContent>
      </Card>

      {/* Messages List */}
      <div className="space-y-3">
        {loading ? (
          <div className="space-y-3">{Array.from({ length: 5 }).map((_, i) => (<Skeleton key={i} className="h-20 w-full rounded-xl bg-gray-800" />))}</div>
        ) : filteredMessages.length === 0 ? (
          <Card className="border border-[#262626] bg-[#111]">
            <CardContent className="flex flex-col items-center justify-center py-16 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gray-800 mb-4"><Mail className="h-7 w-7 text-gray-500" /></div>
              <p className="text-sm font-medium text-white">No messages found</p>
              <p className="text-xs text-gray-500 mt-1">{search || filterStatus !== 'all' ? 'Try adjusting your filters' : 'No contact messages received yet'}</p>
            </CardContent>
          </Card>
        ) : (
          filteredMessages.map((message) => {
            const isExpanded = expandedId === message.id
            return (
              <Card key={message.id} className={cn('transition-all duration-200 cursor-pointer hover:border-[#333]', !message.isRead && 'border-l-4 border-l-[#C9A84C] bg-[#C9A84C]/5', 'border border-[#262626] bg-[#111]', isExpanded && 'border-[#333]')} onClick={() => toggleExpand(message.id, message)}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className={cn('flex h-10 w-10 shrink-0 items-center justify-center rounded-full', message.isRead ? 'bg-gray-800' : 'bg-[#C9A84C]/20')}>
                      {message.isRead ? <MailOpen className="h-4 w-4 text-gray-500" /> : <Mail className="h-4 w-4 text-[#C9A84C]" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 min-w-0">
                          <span className={cn('text-sm truncate', message.isRead ? 'font-medium text-gray-300' : 'font-bold text-white')}>{message.name}</span>
                          {!message.isRead && <span className="flex h-2 w-2 shrink-0 rounded-full bg-[#C9A84C]" />}
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <span className="text-xs text-gray-500">{new Date(message.createdAt).toLocaleDateString()}</span>
                          {isExpanded ? <ChevronUp className="h-4 w-4 text-gray-500" /> : <ChevronDown className="h-4 w-4 text-gray-500" />}
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5 truncate">{message.email}</p>
                      <p className={cn('text-sm mt-1 truncate', message.isRead ? 'text-gray-400' : 'text-gray-200 font-medium')}>{message.subject}</p>
                      {!isExpanded && <p className="text-xs text-gray-600 mt-1 truncate">{message.message}</p>}
                      {isExpanded && (
                        <div className="mt-3 rounded-lg bg-[#1a1a1a] border border-[#262626] p-4" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="text-sm font-semibold text-white">{message.subject}</h4>
                          </div>
                          <p className="text-sm text-gray-300 whitespace-pre-wrap leading-relaxed">{message.message}</p>
                          <div className="flex items-center gap-2 mt-4">
                            {!message.isRead && (
                              <Button size="sm" variant="outline" className="gap-1.5 text-xs text-[#C9A84C] border-[#C9A84C]/30 hover:bg-[#C9A84C]/10" onClick={(e) => { e.stopPropagation(); markAsRead(message) }}>
                                <Eye className="h-3 w-3" /> Mark as Read
                              </Button>
                            )}
                            <a href={`mailto:${message.email}`} className="inline-flex items-center gap-1.5 rounded-md border border-[#262626] px-3 py-1.5 text-xs font-medium text-gray-300 hover:bg-[#1a1a1a] transition-colors" onClick={(e) => e.stopPropagation()}>Reply</a>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })
        )}
      </div>
    </div>
  )
}
