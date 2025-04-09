import { useEffect, useState } from "react"
import { doc, updateDoc, collection, getDocs, query, where } from "firebase/firestore"
import { db } from "@/firebaseConfig"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function EditExpenseForm({ expense, onClose }: { expense: any, onClose: () => void }) {
  const [category, setCategory] = useState(expense.category || "")
  const [amount, setAmount] = useState(expense.amount || 0)
  const [status, setStatus] = useState(expense.status || "Pending")
  const [loading, setLoading] = useState(false)

  const [projectBudget, setProjectBudget] = useState(0)
  const [otherExpensesTotal, setOtherExpensesTotal] = useState(0)

  useEffect(() => {
    const fetchBudgetAndExpenses = async () => {
      const q = query(collection(db, "projects"), where("name", "==", expense.project))
      const snapshot = await getDocs(q)
      const project = snapshot.docs[0]?.data()
      if (!project) return

      setProjectBudget(project.budget)

      const expensesSnap = await getDocs(
        query(collection(db, "financials/expense/items"), where("project", "==", expense.project))
      )

      const total = expensesSnap.docs
        .filter(doc => doc.id !== expense.firestoreId) // Excluir este gasto actual
        .reduce((sum, doc) => sum + (doc.data().amount || 0), 0)

      setOtherExpensesTotal(total)
    }

    fetchBudgetAndExpenses()
  }, [expense.project, expense.firestoreId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const totalWithUpdate = otherExpensesTotal + amount

    if (totalWithUpdate > projectBudget) {
      toast.error("Budget exceeded", {
        description: `New total: $${totalWithUpdate.toLocaleString()} / Budget: $${projectBudget.toLocaleString()}`
      })
      setLoading(false)
      return
    }

    try {
      const ref = doc(db, "financials/expense/items", expense.firestoreId)
      await updateDoc(ref, { category, amount, status })

      toast.success("Expense updated", {
        description: `${category} - $${amount.toLocaleString()}`,
      })
      onClose()
    } catch (err) {
      toast.error("Failed to update expense")
    }

    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-4">
      <div>
        <Label>Category</Label>
        <Input value={category} className="mt-2" onChange={(e) => setCategory(e.target.value)} />
      </div>
      <div>
        <Label>Amount</Label>
        <Input type="number" className="mt-2" value={amount} onChange={(e) => setAmount(Number(e.target.value))} />
      </div>
      <div>
        <Label>Status</Label>
        <Select value={status} onValueChange={(value) => setStatus(value)}>
          <SelectTrigger className="mt-2 w-full">
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Pending">Pending</SelectItem>
            <SelectItem value="Paid">Paid</SelectItem>
            <SelectItem value="Rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Button disabled={loading} type="submit">
        {loading ? "Saving..." : "Save Changes"}
      </Button>
    </form>
  )
}
