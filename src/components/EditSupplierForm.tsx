import React from "react"
import { doc, updateDoc } from "firebase/firestore"
import { db } from "@/firebaseConfig"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function EditSupplierForm({
  supplier,
  onClose,
}: {
  supplier: any
  onClose: () => void
}) {
  type FormKeys =
    | "name"
    | "contact"
    | "email"
    | "phone"
    | "address"
    | "category"
    | "cuit"
    | "status"
    | "notes"

  const [form, setForm] = React.useState<Record<FormKeys, string>>({
    name: supplier.name || "",
    contact: supplier.contact || "",
    email: supplier.email || "",
    phone: supplier.phone || "",
    address: supplier.address || "",
    category: supplier.category || "",
    cuit: supplier.cuit || "",
    status: supplier.status || "",
    notes: supplier.notes || "",
  })

  const [loading, setLoading] = React.useState(false)

  const handleChange = (key: FormKeys, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    await updateDoc(doc(db, "suppliers", supplier.firestoreId), form)
    setLoading(false)
    onClose()
  }


  console.log(supplier)
  return (
    <form onSubmit={handleSubmit} className="grid gap-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          ["name", "Name"],
          ["contact", "Contact Person"],
          ["email", "Email"],
          ["phone", "Phone"],
          ["address", "Address"],
          ["category", "Category"],
          ["cuit", "CUIT"],
        ].map(([key, label]) => (
          <div key={key} className="flex flex-col space-y-1.5">
            <Label>{label}</Label>
            <Input
              value={form[key as FormKeys]}
              onChange={(e) => handleChange(key as FormKeys, e.target.value)}
              placeholder={label}
            />
          </div>
        ))}

        <div className="flex flex-col space-y-1.5">
          <Label>Status</Label>
          <Select
            value={form.status}
            onValueChange={(value) => handleChange("status", value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Active">Active</SelectItem>
              <SelectItem value="Inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex flex-col space-y-1.5">
        <Label>Notes</Label>
        <Textarea
          value={form.notes}
          onChange={(e) => handleChange("notes", e.target.value)}
          placeholder="Additional notes..."
        />
      </div>

      <Button type="submit" className="w-full mt-2" disabled={loading}>
        {loading ? "Saving..." : "Update Supplier"}
      </Button>
    </form>
  )
}
