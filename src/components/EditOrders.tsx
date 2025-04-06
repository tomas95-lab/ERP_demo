import React from "react"
import { doc, updateDoc } from "firebase/firestore"
import { db } from "@/firebaseConfig"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

type Order = {
  id: string
  supplier: string
  status: string
  date: string
  total: number
}

export function EditOrderForm({ order, onClose }: { order: Order; onClose: () => void }) {
  const [form, setForm] = React.useState(order)
  const [loading, setLoading] = React.useState(false)

  const handleChange = (key: keyof Order, value: string | number) => {
    setForm(prev => ({ ...prev, [key]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    await updateDoc(doc(db, "orders/purchaseOrders/items", order.id), form)
    setLoading(false)
    onClose()
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-4">
      <div>
        <Label>Supplier</Label>
        <Input value={form.supplier} onChange={(e) => handleChange("supplier", e.target.value)} />
      </div>
      <div>
        <Label>Status</Label>
        <Select value={form.status} onValueChange={(value) => handleChange("status", value)}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Pending">Pending</SelectItem>
            <SelectItem value="In Progress">In Progress</SelectItem>
            <SelectItem value="Completed">Completed</SelectItem>
            <SelectItem value="Cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label>Date</Label>
        <Input type="date" value={form.date} onChange={(e) => handleChange("date", e.target.value)} />
      </div>
      <div>
        <Label>Total</Label>
        <Input type="number" value={form.total} onChange={(e) => handleChange("total", parseFloat(e.target.value))} />
      </div>
      <Button type="submit" disabled={loading}>
        {loading ? "Saving..." : "Update Order"}
      </Button>
    </form>
  )
}
