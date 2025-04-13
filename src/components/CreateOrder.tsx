import { useState } from "react"
import { collection, addDoc, doc, updateDoc } from "firebase/firestore"
import { db } from "@/firebaseConfig"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "@/components/ui/select"
import { useFirestoreCollection } from "@/hooks/useFirestoreCollection"

export function CreateOrderForm({ onClose }: { onClose: () => void }) {
  const { data: suppliersData = [] } = useFirestoreCollection<{ name: string; value: number; status: string, firestoreId: string }>("suppliers")

  const [form, setForm] = useState({
    supplier: "",
    date: "",
    total: "",
    status: "",
    notes: "",
  })

  const [loading, setLoading] = useState(false)

  const handleChange = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const { supplier, date, total, status } = form
    if (supplier && date && total && status) {
      setLoading(true)
      const collectionRef = collection(db, "orders/purchaseOrders/items")
      const docRef = await addDoc(collectionRef, {
        ...form,
        total: parseFloat(form.total),
        createdAt: new Date().toISOString(),
      })
      // Set the generated id as a field
      await updateDoc(doc(collectionRef, docRef.id), { id: docRef.id })
      setLoading(false)
      onClose()
    } else {
      alert("Please fill in all required fields.")
    }
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-4">
      <div>
        <Label>Supplier</Label>
        <Select value={form.supplier} onValueChange={(value) => handleChange("supplier", value)}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select A supplier" />
          </SelectTrigger>
          <SelectContent>
            {suppliersData.map((supplier) => (
              <SelectItem key={supplier.firestoreId} value={supplier.name}>
                {supplier.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label>Date</Label>
        <Input type="date" value={form.date} onChange={(e) => handleChange("date", e.target.value)} />
      </div>
      <div>
        <Label>Total</Label>
        <Input type="number" value={form.total} onChange={(e) => handleChange("total", e.target.value)} placeholder="$" />
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
        <Label>Notes</Label>
        <Textarea value={form.notes} onChange={(e) => handleChange("notes", e.target.value)} placeholder="Optional notes..." />
      </div>
      <Button type="submit" className="w-full mt-2" disabled={loading}>
        {loading ? "Saving..." : "Create Order"}
      </Button>
    </form>
  )
}
