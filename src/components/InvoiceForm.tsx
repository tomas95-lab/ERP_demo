import { useState } from 'react'
import { collection, addDoc } from 'firebase/firestore'
import { db } from "@/firebaseConfig"
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
import { format } from 'date-fns'

export function InvoiceForm({ projectsData, onClose }: { projectsData: any[], onClose: () => void }) {
  const [project, setProject] = useState('')
  const [amount, setAmount] = useState('')
  const [status, setStatus] = useState('')
  const [startDate, setStartDate] = useState<Date | undefined>()
  const [note, setNote] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSave = async () => {
    if (!project || !amount || !status || !startDate) return alert('Complete all fields')
    setLoading(true)
    await addDoc(collection(db, 'financials/invoices/items'), {
      project,
      amount: Number(amount),
      status: status.charAt(0).toUpperCase() + status.slice(1),
      date: startDate.toISOString(),
      note,
    })
    setLoading(false)
    onClose() // ✅ Esto ahora funciona bien
  }

  return (
    <div className="space-y-4">
      {/* Project */}
      <div>
        <Select onValueChange={setProject}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a project" />
          </SelectTrigger>
          <SelectContent>
            {projectsData.map((p) => (
              <SelectItem key={p.name} value={p.name}>
                {p.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Amount & Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label>Amount</Label>
          <Input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} />
        </div>
        <div>
          <Label>Status</Label>
          <Select onValueChange={setStatus}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="paid">Paid</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="overdue">Overdue</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Date */}
      <div>
        <Label>Start Date</Label>
        <Input type="date" value={startDate ? format(startDate, 'yyyy-MM-dd') : ''} onChange={(e) => setStartDate(e.target.value ? new Date(e.target.value) : undefined)} />

      </div>

      {/* Note */}
      <div>
        <Textarea placeholder="note" value={note} onChange={(e) => setNote(e.target.value)} />
      </div>

      {/* Save */}
      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={loading}>
          {loading ? 'Saving...' : 'Save'}
        </Button>
      </div>
    </div>
  )
}
