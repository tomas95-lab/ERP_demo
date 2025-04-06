import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { UsersData } from "./columns_users"
import { db } from "@/firebaseConfig"
import { doc, updateDoc } from "firebase/firestore"

export function EditUserForm({ user, onClose }: { user: UsersData; onClose: () => void }) {
  const [form, setForm] = useState({
    name: user.name,
    email: user.email,
    role: user.role,
    status: user.status,
  })

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await updateDoc(doc(db, "users", user.firestoreId), form)
      onClose()
    } catch (error) {
      console.error("Error updating user:", error)
      alert("No se pudo actualizar el usuario. Verifica si está creado en Firestore.")
    }
  }
  
  return (
    <form onSubmit={handleSubmit} className="grid gap-4 p-2">
      <div>
        <Label>Name</Label>
        <Input value={form.name} onChange={(e) => handleChange("name", e.target.value)} />
      </div>

      <div>
        <Label>Email</Label>
        <Input value={form.email} onChange={(e) => handleChange("email", e.target.value)} />
      </div>

      <div>
        <Label>Role</Label>
        <Input value={form.role} onChange={(e) => handleChange("role", e.target.value)} />
      </div>

      <div>
        <Label>Status</Label>
        <Select value={form.status} onValueChange={(value) => handleChange("status", value)}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Active">Active</SelectItem>
            <SelectItem value="Inactive">Inactive</SelectItem>
            <SelectItem value="Pending">Pending</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button type="submit" className="w-full mt-2">
        Save Changes
      </Button>
    </form>
  )
}
