import { useState, useEffect, useMemo } from "react"
import CardComponent from "@/components/CardComponent"
import { DataTable } from "@/components/DataTable"
import { columns } from "@/components/columns_financials"
import { ReusableChart } from "@/components/ReusableChart"
import {
  CalendarDays,
  CircleDollarSign,
  Clock,
  Building2,
  TrendingDown,
  TrendingUp,
} from "lucide-react"
import { useFirestoreCollection } from "@/hooks/useFirestoreCollection"
import { Button } from "@/components/ui/button"
import { DialogComponent } from "@/components/DialogComponent"
import CreateExpenseForm from "@/components/createExpenseForm"
import { useScreen } from "@/components/ScreenContext"
import { Spinner } from "@/components/ui/spinner"

export interface Expense {
  category: string
  amount: number
  project: string
  date?: string
  status: string
  id?: string
  firestoreId?: string
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
  category: { label: "Materials", color: "#2563eb" },
  value: { label: "Labor", color: "#60a5fa" },
} satisfies ChartConfig

const money = (n: number) =>
  Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n)

export function Financials() {
  const [loading, setLoading] = useState(true)
  const { setScreen } = useScreen()

  useEffect(() => {
    setScreen("Financials")
  }, [])

  const {
    data: ExpenseData = [],
    loading: expenseLoading,
  } = useFirestoreCollection<Expense>("financials/expense/items")
  const { data: projects = [] } =
    useFirestoreCollection<Project>("projects")

  const totalExpenses = useMemo(
    () => ExpenseData.reduce((sum, e) => sum + e.amount, 0),
    [ExpenseData]
  )

  if(projects.length !==0){
    projects.map((project)=>console.log(project.budget))
  } else {
    console.log("Projects are available")
  }

  const totalBudget = useMemo(
    () => projects.reduce((sum, p) => sum + p.budget, 0),
    [projects]
  )

  console.log(totalBudget, totalExpenses)
  const costVariance = totalBudget - totalExpenses
  const cpi = totalExpenses ? totalBudget / totalExpenses : 0
  const varianceColour = costVariance >= 0 ? "text-green-600" : "text-red-600"

  const chartData = useMemo(() => {
    return ExpenseData.reduce((acc, item) => {
      const key = item.category?.toLowerCase() || "other"
      acc[key] = (acc[key] || 0) + item.amount
      return acc
    }, {} as Record<string, number>)
  }, [ExpenseData])

  const formattedChartData = Object.entries(chartData).map(
    ([category, value]) => ({
      category,
      value,
    })
  )

  useEffect(() => {
    setLoading(expenseLoading)
  }, [expenseLoading])

  const thisMonth = useMemo(() => {
    return ExpenseData.filter(e => {
      const date = new Date(e.date || "2025-03-15")
      const now = new Date()
      return (
        date.getMonth() === now.getMonth() &&
        date.getFullYear() === now.getFullYear()
      )
    }).reduce((sum, e) => sum + e.amount, 0)
  }, [ExpenseData])

  const pendingAmount = useMemo(() => {
    return ExpenseData.filter(
      e => e.status.toLowerCase() === "pending"
    ).reduce((sum, e) => sum + e.amount, 0)
  }, [ExpenseData])

  const now = new Date()
  const month = now.getMonth()
  const year = now.getFullYear()
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]
  const currentMonth = monthNames[month]

  const thisMonthExpenses = useMemo(() => {
    return ExpenseData.filter(e => {
      if (!e.date) return false
      const date = new Date(e.date)
      return date.getMonth() === month && date.getFullYear() === year
    })
  }, [ExpenseData, month, year])

  const totalSpentThisMonth = thisMonthExpenses.reduce(
    (sum, e) => sum + e.amount,
    0
  )

  const projectSpendingMap: Record<string, number> = {}
  thisMonthExpenses.forEach(exp => {
    projectSpendingMap[exp.project] =
      (projectSpendingMap[exp.project] || 0) + exp.amount
  })
  const topProjectThisMonth =
    Object.entries(projectSpendingMap)
      .sort((a, b) => b[1] - a[1])
      .map(([name]) => ({ name }))[0] || { name: "—" }

  const latestThisMonth = thisMonthExpenses
    .sort(
      (a, b) =>
        new Date(b.date ?? "").getTime() - new Date(a.date ?? "").getTime()
    )
    .slice(0, 5)

  return (
    <div className="flex flex-col gap-2 p-4">
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold">Expense Tracking</h1>
          <p className="text-muted-foreground">
            Monitor and manage expenses across all active and completed
            projects.
          </p>
        </div>
        <div>
          <DialogComponent
            trigger="Create a new Expense"
            button
            title="Create a new Expense"
            description=""
          >
            {onClose => <CreateExpenseForm onClose={onClose} />}
          </DialogComponent>
        </div>
      </div>

      {loading ? (
        <Spinner />
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
            <CardComponent
              title="Total Budget"
              description="Sum of all project budgets."
              action="false"
              full
            >
              <div className="flex flex-col items-center space-y-2">
                <CircleDollarSign size={28} className="text-emerald-600" />
                <span className="text-2xl font-bold">
                  {money(totalBudget)}
                </span>
              </div>
            </CardComponent>

            <CardComponent
              title="Cost Variance"
              description="Budget minus actual cost."
              action="false"
              full
            >
              <div className="flex flex-col items-center space-y-2">
                {costVariance >= 0 ? (
                  <TrendingUp size={28} className="text-green-600" />
                ) : (
                  <TrendingDown size={28} className="text-red-600" />
                )}
                <span className={`text-2xl font-bold ${varianceColour}`}>
                  {money(costVariance)}
                </span>
              </div>
            </CardComponent>

            <CardComponent
              title="CPI"
              description="Cost Performance Index (budget / actual)."
              action="false"
              full
            >
              <div className="flex flex-col items-center space-y-2">
                <Building2 size={28} className="text-blue-600" />
                <span className="text-2xl font-bold">
                  {cpi.toFixed(2)}
                </span>
              </div>
            </CardComponent>

            <CardComponent
              title="Total Expenses"
              description="Sum of all recorded expenses across all projects."
              action="View All"
              full
              path="/financials/expenses/all/table"
            >
              <div className="flex flex-col items-center space-y-2">
                <CircleDollarSign size={28} className="text-green-600" />
                <span className="text-2xl font-bold">
                  {money(totalExpenses)}
                </span>
              </div>
            </CardComponent>
            
            <CardComponent
              title="This Month"
              description="Expenses logged during the current month."
              action="false"
              full
              dialog
              dialogTrigger={
                <Button className="w-full h-[40px] cursor-pointer">
                  View Report
                </Button>
              }
              dialogDescription={`Expenses logged in ${currentMonth}`}
              dialogTitle="This month"
              dialogChildren={() => (
                <div className="space-y-4 text-sm p-1">
                  <div>
                    <h3 className="text-sm text-muted-foreground">
                      Top Project
                    </h3>
                    <p className="text-base font-semibold">
                      {topProjectThisMonth.name}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm text-muted-foreground">
                      Total Spent
                    </h3>
                    <p className="text-base font-semibold">
                      {money(totalSpentThisMonth)}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm text-muted-foreground">
                      Latest Expenses
                    </h3>
                    <ul className="space-y-2">
                      {latestThisMonth.map((exp, index) => (
                        <li
                          key={index}
                          className="flex justify-between border-b pb-1"
                        >
                          <div>
                            <span className="font-medium capitalize">
                              {exp.category}
                            </span>
                            <span className="ml-1 text-muted-foreground">
                              ({exp.project})
                            </span>
                          </div>
                          <span className="font-semibold">
                            {money(exp.amount)}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            >
              <div className="flex flex-col items-center space-y-2">
                <CalendarDays size={28} className="text-blue-600" />
                <span className="text-2xl font-bold">{money(thisMonth)}</span>
              </div>
            </CardComponent>

            <CardComponent
              title="Pending Expenses"
              description="Expenses awaiting approval or processing."
              action="Review Now"
              full
              path="/financials/expenses/all/table?status=pending"
            >
              <div className="flex items-center gap-4">
                <div className="bg-muted rounded-full p-2">
                  <Clock size={24} className="text-yellow-500" />
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground">
                    Pending Approvals
                  </div>
                  <div className="text-lg font-bold text-foreground">
                    {money(pendingAmount)}
                  </div>
                </div>
              </div>
            </CardComponent>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <ReusableChart
              type="bar"
              data={formattedChartData}
              config={barConfig}
              title="Costs by Category"
              xKey="category"
              yKeys={["value"]}
              description="Bar chart depicting costs per category."
            />

            <div>
              <h2 className="text-xl font-bold mb-2">Main Expenses</h2>
              <DataTable
                data={[...ExpenseData]
                  .sort((a, b) => b.amount - a.amount)
                  .slice(0, 5)}
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
