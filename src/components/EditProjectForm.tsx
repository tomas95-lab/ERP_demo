import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { doc, updateDoc } from "firebase/firestore"
import { db } from "@/firebaseConfig"
import { useState } from "react"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { toast } from "sonner"

export function EditProjectForm({
  project,
  onSuccess,
}: {
  project: any
  onSuccess: () => void
}) {
  const [name, setName] = useState(project.name)
  const [supervisor, setSupervisor] = useState(project.supervisor)
  const [status, setStatus] = useState(project.status)
  const [budget, setBudget] = useState(project.budget)
  const [loading, setLoading] = useState(false)

  const handleUpdate = async () => {
    try {
      const ref = doc(db, "projects", project.firestoreId)
      setLoading(true)
      await updateDoc(ref, {
        name,
        supervisor,
        status,
        budget: Number(budget),
      })
      toast.success(`The project "${name}" was edited successfully`)
      onSuccess()
    } catch (error) {
      toast.error("Error Editing The project", {
        description: String(error),
      });
    }

    setLoading(false)
  }

  return (
    <div className="space-y-4">
      <div>
        <Label>Name</Label>
        <Input value={name} onChange={(e) => setName(e.target.value)} />
      </div>
      <div>
        <Label>Supervisor</Label>
        <Input value={supervisor} onChange={(e) => setSupervisor(e.target.value)} />
      </div>
      <div>
        <Label>Budget</Label>
        <Input type="number" value={budget} onChange={(e) => setBudget(e.target.value)} />
      </div>
      <div className="w-full">
        <Label>Status</Label>
        <Select  value={status} onValueChange={setStatus}>
          <SelectTrigger className="w-full"><SelectValue placeholder="Select status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="Active">Active</SelectItem>
            <SelectItem value="Pending">Pending</SelectItem>
            <SelectItem value="Completed">Completed</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Button onClick={handleUpdate} disabled = {loading} className="w-full">{loading ? "Saving..." : "Save Changes"}</Button>
    </div>
  )
}
