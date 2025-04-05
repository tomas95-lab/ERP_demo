import React from "react"
import { collection, addDoc, getDocs, query, where } from "firebase/firestore"
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

export default function CreateSupplierForm({ onClose }: { onClose: () => void }) {
  const [name, setName] = React.useState("")
  const [contact, setContact] = React.useState("")
  const [email, setEmail] = React.useState("")
  const [phone, setPhone] = React.useState("")
  const [address, setAddress] = React.useState("")
  const [category, setCategory] = React.useState("")
  const [cuit, setCuit] = React.useState("")
  const [status, setStatus] = React.useState("")
  const [notes, setNotes] = React.useState("")
  const [loading, setLoading] = React.useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!name || !contact || !email || !phone || !address || !category || !cuit || !status) {
      alert("Please fill in all required fields.")
      return
    }

    setLoading(true)

    // Verificamos duplicados por nombre o CUIT
    const suppliersRef = collection(db, "suppliers")
    const duplicateQuery = query(
      suppliersRef,
      where("cuit", "==", cuit)
    )
    const duplicateQueryName = query(
      suppliersRef,
      where("name", "==", name)
    )
    const snapshot = await getDocs(duplicateQuery) 
    
    if (!snapshot.empty) {
      alert("A supplier with this CUIT already exists.")
      setLoading(false)
      return
    }

    await addDoc(suppliersRef, {
      name,
      contact,
      email,
      phone,
      address,
      category,
      cuit,
      status,
      notes,
      createdAt: new Date().toISOString(),
    })

    setLoading(false)
    onClose()
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid w-full items-center gap-4">
        <div className="flex flex-col space-y-1.5 mt-2">
          <Label>Name</Label>
          <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Company Name" />
        </div>
        <div className="flex flex-col space-y-1.5 mt-2">
          <Label>Contact Person</Label>
          <Input value={contact} onChange={(e) => setContact(e.target.value)} placeholder="Contact Name" />
        </div>
        <div className="flex flex-col space-y-1.5 mt-2">
          <Label>Email</Label>
          <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
        </div>
        <div className="flex flex-col space-y-1.5 mt-2">
          <Label>Phone</Label>
          <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone Number" />
        </div>
        <div className="flex flex-col space-y-1.5 mt-2 col-span-2">
          <Label>Address</Label>
          <Input value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Supplier Address" />
        </div>
        <div className="flex flex-col space-y-1.5 mt-2">
          <Label>Category</Label>
          <Input value={category} onChange={(e) => setCategory(e.target.value)} placeholder="E.g. Concrete, Electrical" />
        </div>
        <div className="flex flex-col space-y-1.5 mt-2">
          <Label>CUIT</Label>
          <Input value={cuit} onChange={(e) => setCuit(e.target.value)} placeholder="CUIT Number" />
        </div>
        <div className="flex flex-col space-y-1.5 mt-2 col-span-2">
          <Label>Status</Label>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent className="w-full">
              <SelectItem value="Active">Active</SelectItem>
              <SelectItem value="Inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col space-y-1.5 mt-2 col-span-2">
          <Label>Notes</Label>
          <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Additional notes..." />
        </div>
        <div className="col-span-2">
          <Button type="submit" className="w-full mt-4" disabled={loading}>
            {loading ? "Saving..." : "Register Supplier"}
          </Button>
        </div>
      </div>
    </form>
  )
}
