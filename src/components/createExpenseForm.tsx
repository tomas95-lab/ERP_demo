import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { useFirestoreCollection } from "@/hooks/useFirestoreCollection"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "@/components/ui/select"
import { Label } from "./ui/label"
import { Input } from "./ui/input"
import { db } from "@/firebaseConfig"
import { addDoc, collection } from "firebase/firestore"
import { toast } from "sonner"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"

export default function CreateExpenseForm({ onClose }: { onClose: () => void }) {
  const { data: DataProjects } = useFirestoreCollection<{ status: string, name: string, id: string, budget: number }>("projects")
  const { data: Expenses } = useFirestoreCollection<{ project: string, amount: number }>("financials/expense/items")

  const [category, setCategory] = useState("")
  const [amount, setAmount] = useState<number | undefined>(undefined)
  const [project, setProject] = useState("")
  const [status, setStatus] = useState("Pending")
  const [date, setDate] = useState<Date>()
  const [loading, setLoading] = useState(false)

  const selectedProject = useMemo(() => {
    return DataProjects.find(p => p.name === project)
  }, [project, DataProjects])

  const totalSpent = useMemo(() => {
    return Expenses
      .filter(e => e.project === project)
      .reduce((acc, curr) => acc + (curr.amount || 0), 0)
  }, [project, Expenses])

  const remainingBudget = selectedProject ? selectedProject.budget - totalSpent : undefined

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!category || !amount || !project || !status || !date) {
      toast.error("Please complete all fields.")
      return
    }

    if (remainingBudget !== undefined && amount > remainingBudget) {
      toast.error("Amount exceeds the remaining budget for this project.", {
        description: `Remaining: $${remainingBudget.toLocaleString()}`
      })
      return
    }

    setLoading(true)

    await addDoc(collection(db, "financials/expense/items"), {
      category,
      amount,
      project,
      status,
      date: date.toISOString(),
      createdAt: new Date().toISOString(),
    })

    toast.success("Expense recorded", {
      description: `${category} - $${amount.toLocaleString()}`
    })

    setLoading(false)
    onClose()
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-4">
      <div>
        <Label>Category</Label>
        <Input
          className="mt-2 block w-full"
          placeholder="Category..."
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />
      </div>

      <div className="w-full">
        <Label>Project</Label>
        <Select value={project} onValueChange={(value) => setProject(value)}>
          <SelectTrigger className="w-full mt-2">
            <SelectValue placeholder="Select a Project" />
          </SelectTrigger>
          <SelectContent>
            {DataProjects.map((project) => (
              <SelectItem key={project.id} value={project.name}>
                {project.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <Label>Amount</Label>
        <Input
          type="number"
          className="mt-2 block w-full"
          placeholder="$"
          value={amount || ""}
          onChange={(e) => setAmount(Number(e.target.value))}
        />
        {selectedProject && (
          <p className="text-xs text-muted-foreground mt-1">
            Remaining budget: ${remainingBudget?.toLocaleString()}
          </p>
        )}
      </div>

      <div>
        <Label>Status</Label>
        <Select value={status} onValueChange={(value) => setStatus(value)}>
          <SelectTrigger className="w-full mt-2">
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Pending">Pending</SelectItem>
            <SelectItem value="Paid">Paid</SelectItem>
            <SelectItem value="Rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label>Date</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal mt-2",
                !date && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? format(date, "PPP") : <span>Pick a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      <Button disabled={loading} type="submit" className="w-full mt-2">
        {loading ? "Submitting..." : "Create Expense"}
      </Button>
    </form>
  )
}
