import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { doc, updateDoc } from "firebase/firestore"
import { db } from "@/firebaseConfig"
import { useState } from "react"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"

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

  const handleUpdate = async () => {
    const ref = doc(db, "projects", project.firestoreId)
    onSuccess() 

    await updateDoc(ref, {
      name,
      supervisor,
      status,
      budget: Number(budget),
    })

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
      <Button onClick={handleUpdate} className="w-full">Save Changes</Button>
    </div>
  )
}
