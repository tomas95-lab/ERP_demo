import { useState, useEffect } from "react"
import CardComponent from "@/components/CardComponent"
import { DataTable } from "@/components/DataTable"
import { columns } from "@/components/columns_financials"
import { ReusableChart } from "@/components/ReusableChart"
import { CalendarDays, CircleDollarSign, Clock, Building2 } from "lucide-react"
import { useFirestoreCollection } from "@/hooks/useFirestoreCollection"
import { Button } from "@/components/ui/button"
import ProjectView from "@/components/ProjectView"
import { format } from "date-fns"

interface Expense {
  category: string
  amount: number
  project: string
  date?: string
}

interface Project {
  name: string
  budget: number
  status: string
  startDate: string
  endDate: string
  supervisor: string
}

interface ChartConfig {
  [key: string]: {
    label: string
    color: string
  }
}

const barConfig = {
  category: {
    label: "Materials",
    color: "#2563eb",
  },
  value: {
    label: "Labor",
    color: "#60a5fa",
  },
} satisfies ChartConfig

export function Financials() {
  const [loading, setLoading] = useState(true)

  const { data: barData = [], loading: barLoading } = useFirestoreCollection("financials/expenseChart/items")
  const { data: ExpenseData = [], loading: expenseLoading } = useFirestoreCollection<Expense>("financials/expense/items")
  const { data: projects = [] } = useFirestoreCollection<Project>("projects")

  useEffect(() => {
    setLoading(barLoading || expenseLoading)
  }, [barLoading, expenseLoading])

  const totalExpenses = ExpenseData.reduce((sum, e) => sum + e.amount, 0)

  const thisMonth = ExpenseData
    .filter(e => {
      const date = new Date(e.date || "2025-03-15")
      const now = new Date()
      return (
        date.getMonth() === now.getMonth() &&
        date.getFullYear() === now.getFullYear()
      )
    })
    .reduce((sum, e) => sum + e.amount, 0)

  const enrichedProjectTotals = projects.map((p) => {
    const totalSpent = ExpenseData
      .filter(e => e.project === p.name)
      .reduce((sum, e) => sum + e.amount, 0)

    return {
      name: p.name,
      status: p.status,
      budget: p.budget,
      spent: totalSpent,
      remaining: p.budget - totalSpent,
      startDate: p.startDate,
      endDate: p.endDate,
      supervisor: p.supervisor
    }
  })

  console.table(enrichedProjectTotals)
  const topProject = enrichedProjectTotals.sort((a, b) => b.spent - a.spent)[0] || {
    name: "No data",
    spent: 0,
    budget: 0,
    remaining: 0,
  }

  console.log(topProject)

  const pendingAmount = 35200

  return (
    <div className="flex flex-col gap-2">
      <h1 className="text-xl font-bold">Expense Tracking</h1>
      <p className="text-sm text-muted-foreground mb-4">
        Monitor and manage expenses across all active and completed projects.
      </p>

      {loading ? (
        <div className="text-center text-muted-foreground">Loading Expenses...</div> 
      ) : (
        <>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4 mb-6">
            <CardComponent
              title="Total Expenses"
              description="Sum of all recorded expenses across all projects."
              action="View Details"
              full
            >
              <div className="flex flex-col items-center justify-center space-y-2">
                <CircleDollarSign size={28} className="text-green-600" />
                <span className="text-2xl font-bold">${totalExpenses.toLocaleString()}</span>
              </div>
            </CardComponent>

            <CardComponent
              title="This Month"
              description="Expenses logged during the current month."
              action="View Report"
              full
            >
              <div className="flex flex-col items-center justify-center space-y-2">
                <CalendarDays size={28} className="text-blue-600" />
                <span className="text-2xl font-bold">${thisMonth.toLocaleString()}</span>
              </div>
            </CardComponent>

            <CardComponent
              title="Top Project"
              description="Project with the highest spending so far."
              action="false"
              dialog={true}
              dialogTitle={`Top Project - ${topProject.name}`}
              dialogTrigger={<Button className="w-full h-[40px]">View Details</Button>}
              dialogChildren={(onClose) => (
                  <ProjectView project={topProject}></ProjectView>
              )}
            >
              <div className="flex items-center gap-4">
                <div className="bg-muted rounded-full p-2">
                  <Building2 size={24} color="orange">
                  </Building2>
                </div>
                <div>
                  <div className="text-lg font-bold text-foreground">{topProject.name}</div>
                  <div className="text-s text-muted-foreground">${topProject.budget?.toLocaleString()}</div>
                </div>
              </div>
            </CardComponent>


            <CardComponent
              title="Pending Expenses"
              description="Expenses awaiting approval or processing."
              action="Review Now"
              full
            >
              <div className="flex items-center gap-4">
                <div className="bg-muted rounded-full p-2">
                  <Clock size={24} className="text-yellow-500" />
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Pending Approvals</div>
                  <div className="text-lg font-bold text-foreground">${pendingAmount.toLocaleString()}</div>
                </div>
              </div>
            </CardComponent>
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <ReusableChart
              type="bar"
              data={barData}
              config={barConfig}
              title="Project Costs by Month"
              xKey="category"
              yKeys={["value"]}
            />
            <div>
              <h2 className="text-xl font-bold mb-2">Main Expenses</h2>
              <DataTable
                data={ExpenseData}
                columns={columns}
                filterPlaceholder="Filter Category..."
                filterColumn="category"
              />
            </div>
          </div>
        </>
      )}
    </div>
  )
}
