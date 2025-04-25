import { useState } from "react"
import { collection, addDoc, serverTimestamp } from "firebase/firestore"
import { db } from "@/firebaseConfig"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"
import { format } from "date-fns"
import { toast } from "sonner"

export function InvoiceForm({
  projectsData,
  onClose,
}: {
  projectsData: any[]
  onClose: () => void
}) {
  const [project, setProject] = useState("")
  const [amount, setAmount] = useState("")
  const [status, setStatus] = useState("")
  const [dueDate, setDueDate] = useState<Date | undefined>()
  const [note, setNote] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSave = async () => {
    if (!project || !amount || !status || !dueDate)
      return toast.error("Complete all fields")
    setLoading(true)
    await addDoc(collection(db, "financials/invoices/items"), {
      project,
      amount: Number(amount),
      status: status.toLowerCase(), // stored in lowercase
      dueDate: dueDate.toISOString(),
      note,
      createdAt: serverTimestamp(),
    })
    setLoading(false)
    onClose()
    toast.success("Invoice saved successfully!")
  }

  return (
    <div className="space-y-4">
      <Select onValueChange={setProject}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select a project" />
        </SelectTrigger>
        <SelectContent>
          {projectsData.map(p => (
            <SelectItem key={p.name} value={p.name}>
              {p.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label>Amount</Label>
          <Input
            type="number"
            value={amount}
            onChange={e => setAmount(e.target.value)}
          />
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

      <div>
        <Label>Due Date</Label>
        <Input
          type="date"
          value={dueDate ? format(dueDate, "yyyy-MM-dd") : ""}
          onChange={e =>
            setDueDate(e.target.value ? new Date(e.target.value) : undefined)
          }
        />
      </div>

      <Textarea
        placeholder="Note"
        value={note}
        onChange={e => setNote(e.target.value)}
      />

      <div className="flex w-full">
        <Button onClick={handleSave} className="w-full" disabled={loading}>
          {loading ? "Creating..." : "Crreate Invoice"}
        </Button>
      </div>
    </div>
  )
}
