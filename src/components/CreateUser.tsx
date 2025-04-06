import { useState } from "react"
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
import { db } from "@/firebaseConfig"
import { collection, addDoc, query, where, getDocs } from "firebase/firestore"
import { toast } from "sonner"

export function CreateUserForm({
  onClose,
  onSuccess,
}: {
  onClose: () => void
  onSuccess: (name: string) => void
}) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    role: "",
    status: "Active",
  })

  const [error, setError] = useState("")

  const handleChange = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!form.name || !form.email || !form.role) {
      setError("Please fill in all required fields.")
      return
    }

    const q = query(collection(db, "users"), where("email", "==", form.email))
    const snapshot = await getDocs(q)

    if (!snapshot.empty) {
      setError("A user with this email already exists.")
      return
    }

    try {
      await addDoc(collection(db, "users"), {
        ...form,
        createdAt: new Date().toISOString(),
      })
      onSuccess(form.name)
      onClose()
    } catch (err) {
      console.error("Error creating user:", err)
      setError("Something went wrong. Try again.")
    }
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-4 p-2">
      <div>
        <Label>Name</Label>
        <Input
          value={form.name}
          onChange={(e) => handleChange("name", e.target.value)}
          placeholder="John Doe"
        />
      </div>

      <div>
        <Label>Email</Label>
        <Input
          type="email"
          value={form.email}
          onChange={(e) => handleChange("email", e.target.value)}
          placeholder="john@example.com"
        />
      </div>

      <div>
        <Label>Role</Label>
        <Input
          value={form.role}
          onChange={(e) => handleChange("role", e.target.value)}
          placeholder="e.g. Supervisor"
        />
      </div>

      <div>
        <Label>Status</Label>
        <Select
          value={form.status}
          onValueChange={(value) => handleChange("status", value)}
        >
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

      {error && <p className="text-sm text-red-600 -mt-2">{error}</p>}

      <Button type="submit" className="w-full mt-2">
        Create User
      </Button>
    </form>
  )
}
