'use client'

import { useEffect, useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Receipt, DollarSign, CheckCircle2, AlertTriangle, Clock, Download, AlertCircle, Calendar } from 'lucide-react'
import { cn } from '@/lib/utils'
import { format } from 'date-fns'

interface Fee { id: string; studentId: string; semester: string; amount: number; status: string; paidAmount: number | null; dueDate: string | null; paidDate: string | null; description: string | null; createdAt: string; student: { id: string; name: string; studentId: string | null; department: string | null } }
type FeeStatus = 'PENDING' | 'PAID' | 'PARTIAL' | 'OVERDUE'

const statusConfig: Record<FeeStatus, { label: string; bgClass: string; textClass: string; icon: React.ElementType }> = {
  PENDING: { label: 'Pending', bgClass: 'bg-yellow-500/20', textClass: 'text-yellow-400', icon: Clock },
  PAID: { label: 'Paid', bgClass: 'bg-[#C9A84C]/20', textClass: 'text-[#C9A84C]', icon: CheckCircle2 },
  PARTIAL: { label: 'Partial', bgClass: 'bg-orange-500/20', textClass: 'text-orange-400', icon: AlertTriangle },
  OVERDUE: { label: 'Overdue', bgClass: 'bg-red-500/20', textClass: 'text-red-400', icon: AlertCircle },
}

function LoadingSkeleton() {
  return (<div className="space-y-6"><div className="grid gap-4 sm:grid-cols-3">{Array.from({ length: 3 }).map((_, i) => (<Skeleton key={i} className="h-[110px] rounded-xl bg-gray-800" />))}</div><Skeleton className="h-[400px] rounded-xl bg-gray-800" /></div>)
}

export function MyFees() {
  const [fees, setFees] = useState<Fee[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchFees() {
      try { const res = await fetch('/api/fees'); if (!res.ok) throw new Error('Failed to fetch fees'); setFees(await res.json()) } catch (err) { setError(err instanceof Error ? err.message : 'An error occurred') } finally { setLoading(false) }
    }
    fetchFees()
  }, [])

  const summary = useMemo(() => {
    const totalDue = fees.reduce((sum, f) => sum + f.amount, 0)
    const totalPaid = fees.reduce((sum, f) => sum + (f.paidAmount || 0), 0)
    const outstanding = totalDue - totalPaid
    const overdueCount = fees.filter((f) => f.status === 'OVERDUE').length
    return { totalDue, totalPaid, outstanding, overdueCount }
  }, [fees])

  const handleDownloadChallan = (fee: Fee) => {
    const config = statusConfig[fee.status as FeeStatus] || statusConfig.PENDING
    const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Fee Challan - ${fee.semester}</title>
  <style>
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 40px; color: #e5e5e5; background: #0a0a0a; }
    .header { text-align: center; border-bottom: 3px solid #C9A84C; padding-bottom: 20px; margin-bottom: 30px; }
    .header h1 { color: #C9A84C; margin: 0; font-size: 24px; }
    .header p { color: #a3a3a3; margin: 4px 0; font-size: 14px; }
    .challan-box { border: 2px solid #333; border-radius: 12px; padding: 30px; max-width: 600px; margin: 0 auto; background: #111; }
    .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 24px; }
    .info-item { margin-bottom: 12px; }
    .info-item .label { font-size: 12px; color: #737373; text-transform: uppercase; letter-spacing: 0.5px; }
    .info-item .value { font-size: 16px; font-weight: 600; color: #fff; margin-top: 2px; }
    .divider { border: none; border-top: 1px dashed #333; margin: 20px 0; }
    .amount-section { text-align: center; padding: 20px; background: #1a1a1a; border-radius: 8px; margin: 20px 0; }
    .amount-label { font-size: 14px; color: #737373; }
    .amount-value { font-size: 32px; font-weight: 800; color: #C9A84C; }
    .status-badge { display: inline-block; padding: 6px 16px; border-radius: 20px; font-size: 14px; font-weight: 600; }
    .footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #333; color: #525252; font-size: 12px; }
    @media print { body { margin: 20px; } .challan-box { border: none; } }
  </style>
</head>
<body>
  <div class="header">
    <h1>COMCAT University</h1>
    <p>Fee Challan / Receipt</p>
    <p style="color: #525252; font-size: 12px;">Generated on ${format(new Date(), 'MMMM dd, yyyy')}</p>
  </div>
  <div class="challan-box">
    <div class="info-grid">
      <div class="info-item"><div class="label">Student Name</div><div class="value">${fee.student.name}</div></div>
      <div class="info-item"><div class="label">Student ID</div><div class="value">${fee.student.studentId || 'N/A'}</div></div>
      <div class="info-item"><div class="label">Department</div><div class="value">${fee.student.department || 'N/A'}</div></div>
      <div class="info-item"><div class="label">Semester</div><div class="value">${fee.semester}</div></div>
    </div>
    <hr class="divider">
    <div class="amount-section">
      <div class="amount-label">Total Amount</div>
      <div class="amount-value">Rs. ${fee.amount.toLocaleString()}</div>
    </div>
    <div class="info-grid">
      <div class="info-item"><div class="label">Amount Paid</div><div class="value" style="color: #C9A84C;">Rs. ${(fee.paidAmount || 0).toLocaleString()}</div></div>
      <div class="info-item"><div class="label">Outstanding</div><div class="value" style="color: ${fee.amount - (fee.paidAmount || 0) > 0 ? '#ef4444' : '#C9A84C'};">Rs. ${(fee.amount - (fee.paidAmount || 0)).toLocaleString()}</div></div>
      <div class="info-item"><div class="label">Due Date</div><div class="value">${fee.dueDate ? format(new Date(fee.dueDate), 'MMM dd, yyyy') : 'N/A'}</div></div>
      <div class="info-item"><div class="label">Paid Date</div><div class="value">${fee.paidDate ? format(new Date(fee.paidDate), 'MMM dd, yyyy') : 'N/A'}</div></div>
    </div>
    ${fee.description ? `<div class="info-item"><div class="label">Description</div><div class="value" style="font-weight: 400;">${fee.description}</div></div>` : ''}
    <hr class="divider">
    <div style="text-align: center;">
      <span class="status-badge" style="background: ${fee.status === 'PAID' ? '#C9A84C20' : fee.status === 'PENDING' ? '#eab30820' : fee.status === 'OVERDUE' ? '#ef444420' : '#f9731620'}; color: ${fee.status === 'PAID' ? '#C9A84C' : fee.status === 'PENDING' ? '#eab308' : fee.status === 'OVERDUE' ? '#ef4444' : '#f97316'};">
        ${config.label}
      </span>
    </div>
  </div>
  <div class="footer">
    <p>This is a computer-generated document from COMCAT University Student Portal.</p>
    <p>For any queries, please contact the finance department.</p>
  </div>
</body>
</html>`

    const blob = new Blob([htmlContent], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a'); a.href = url; a.download = `fee-challan-${fee.semester}-${fee.id.slice(0, 8)}.html`; a.click()
    URL.revokeObjectURL(url)
  }

  if (loading) return <LoadingSkeleton />
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-500/20"><AlertCircle className="h-8 w-8 text-red-400" /></div>
        <h3 className="text-lg font-semibold text-white">Failed to load fees</h3>
        <p className="text-sm text-gray-500 mt-1">{error}</p>
        <button onClick={() => window.location.reload()} className="mt-4 px-4 py-2 text-sm font-medium text-black bg-[#C9A84C] rounded-lg hover:bg-[#B8963A] transition-colors">Try Again</button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-white">Fee Challan</h2>
        <p className="text-sm text-gray-500">View your fee details and download challans</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="border border-[#262626] bg-[#111]">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1"><p className="text-sm font-medium text-gray-500">Total Due</p><p className="text-3xl font-bold text-white">Rs. {summary.totalDue.toLocaleString()}</p><p className="text-xs text-gray-500">{fees.length} fee {fees.length === 1 ? 'entry' : 'entries'}</p></div>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/20"><Receipt className="h-6 w-6 text-amber-400" /></div>
            </div>
          </CardContent>
        </Card>
        <Card className="border border-[#262626] bg-[#111]">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1"><p className="text-sm font-medium text-gray-500">Total Paid</p><p className="text-3xl font-bold text-[#C9A84C]">Rs. {summary.totalPaid.toLocaleString()}</p><p className="text-xs text-gray-500">{fees.filter((f) => f.status === 'PAID').length} fully paid</p></div>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#C9A84C]/20"><DollarSign className="h-6 w-6 text-[#C9A84C]" /></div>
            </div>
          </CardContent>
        </Card>
        <Card className="border border-[#262626] bg-[#111]">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1"><p className="text-sm font-medium text-gray-500">Outstanding</p><p className={cn('text-3xl font-bold', summary.outstanding > 0 ? 'text-red-400' : 'text-[#C9A84C]')}>Rs. {summary.outstanding.toLocaleString()}</p><p className="text-xs text-gray-500">{summary.overdueCount > 0 ? `${summary.overdueCount} overdue` : summary.outstanding === 0 ? 'All clear!' : 'Pending payment'}</p></div>
              <div className={cn('flex h-12 w-12 items-center justify-center rounded-xl', summary.outstanding > 0 ? 'bg-red-500/20' : 'bg-[#C9A84C]/20')}><AlertTriangle className={cn('h-6 w-6', summary.outstanding > 0 ? 'text-red-400' : 'text-[#C9A84C]')} /></div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border border-[#262626] bg-[#111]">
        <CardHeader className="pb-3"><CardTitle className="text-base text-white">Fee Details</CardTitle></CardHeader>
        <CardContent>
          {fees.length === 0 ? (
            <div className="py-12 text-center"><Receipt className="h-12 w-12 text-gray-600 mx-auto mb-3" /><h3 className="text-sm font-semibold text-white">No fee records</h3><p className="text-sm text-gray-500 mt-1">Fee records will appear here once the admin adds them</p></div>
          ) : (
            <>
              {/* Desktop Table */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-[#262626] text-left">
                      <th className="pb-3 font-medium text-gray-500">Semester</th>
                      <th className="pb-3 font-medium text-gray-500">Description</th>
                      <th className="pb-3 font-medium text-gray-500 text-right">Amount</th>
                      <th className="pb-3 font-medium text-gray-500 text-right">Paid</th>
                      <th className="pb-3 font-medium text-gray-500">Status</th>
                      <th className="pb-3 font-medium text-gray-500">Due Date</th>
                      <th className="pb-3 font-medium text-gray-500 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#262626]">
                    {fees.map((fee) => {
                      const config = statusConfig[fee.status as FeeStatus] || statusConfig.PENDING; const StatusIcon = config.icon
                      return (
                        <tr key={fee.id} className="hover:bg-[#1a1a1a] transition-colors">
                          <td className="py-3 pr-4"><Badge variant="outline" className="text-xs border-gray-700 text-gray-400">{fee.semester}</Badge></td>
                          <td className="py-3 pr-4"><span className="text-white font-medium">{fee.description || 'Semester Fee'}</span></td>
                          <td className="py-3 pr-4 text-right font-semibold text-white">Rs. {fee.amount.toLocaleString()}</td>
                          <td className="py-3 pr-4 text-right font-medium text-[#C9A84C]">Rs. {(fee.paidAmount || 0).toLocaleString()}</td>
                          <td className="py-3 pr-4"><Badge className={cn('text-xs font-medium gap-1', config.bgClass, config.textClass)}><StatusIcon className="h-3 w-3" />{config.label}</Badge></td>
                          <td className="py-3 pr-4 text-gray-400">{fee.dueDate ? format(new Date(fee.dueDate), 'MMM dd, yyyy') : '—'}</td>
                          <td className="py-3 text-right"><Button variant="ghost" size="sm" onClick={() => handleDownloadChallan(fee)} className="text-[#C9A84C] hover:text-[#B8963A] hover:bg-[#C9A84C]/10"><Download className="h-4 w-4 mr-1" />Challan</Button></td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards */}
              <div className="md:hidden space-y-3 max-h-[480px] overflow-y-auto">
                {fees.map((fee) => {
                  const config = statusConfig[fee.status as FeeStatus] || statusConfig.PENDING; const StatusIcon = config.icon
                  return (
                    <div key={fee.id} className="rounded-lg border border-[#262626] p-4 space-y-3 bg-[#0a0a0a]">
                      <div className="flex items-start justify-between">
                        <div><Badge variant="outline" className="text-[10px] mb-1 border-gray-700 text-gray-400">{fee.semester}</Badge><p className="text-sm font-medium text-white">{fee.description || 'Semester Fee'}</p></div>
                        <Badge className={cn('text-xs font-medium gap-1', config.bgClass, config.textClass)}><StatusIcon className="h-3 w-3" />{config.label}</Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div><span className="text-gray-500 text-xs">Amount</span><p className="font-semibold text-white">Rs. {fee.amount.toLocaleString()}</p></div>
                        <div><span className="text-gray-500 text-xs">Paid</span><p className="font-medium text-[#C9A84C]">Rs. {(fee.paidAmount || 0).toLocaleString()}</p></div>
                        <div><span className="text-gray-500 text-xs">Due Date</span><p className="text-gray-400">{fee.dueDate ? format(new Date(fee.dueDate), 'MMM dd, yyyy') : '—'}</p></div>
                        <div><span className="text-gray-500 text-xs">Paid Date</span><p className="text-gray-400">{fee.paidDate ? format(new Date(fee.paidDate), 'MMM dd, yyyy') : '—'}</p></div>
                      </div>
                      <Button variant="outline" size="sm" className="w-full text-[#C9A84C] hover:text-[#B8963A] hover:bg-[#C9A84C]/10 border-[#C9A84C]/30" onClick={() => handleDownloadChallan(fee)}><Download className="h-4 w-4 mr-2" /> Download Challan</Button>
                    </div>
                  )
                })}
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
