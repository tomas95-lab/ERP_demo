import CardComponent from "@/components/CardComponent";
import { DataTable } from "@/components/DataTable";
import {columns}  from "@/components/columns_financials";
import { ReusableChart } from "@/components/ReusableChart";
import { CalendarDays, CircleDollarSign, Clock, Building2 } from "lucide-react";
import data from "../data/systemData.json"

interface ChartConfig {
  [key: string]: {
    label: string;
    color: string;
  };
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
} satisfies ChartConfig;

const barData = data.financials.expenseChart


const ExpenseData: { category: string; amount: number; project: string; }[] = data.financials.expense


export function Financials() {

  const expenses = data.financials.expense;

  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);

  const thisMonth = expenses
    .filter(e => {
      const date = new Date(e.date || "2025-03-15"); 
      const now = new Date();
      return (
        date.getMonth() === now.getMonth() &&
        date.getFullYear() === now.getFullYear()
      );
    })
    .reduce((sum, e) => sum + e.amount, 0);

  const projectTotals: { [key: string]: number } = {};
  expenses.forEach((e) => {
    projectTotals[e.project] = (projectTotals[e.project] || 0) + e.amount;
  });
  const topProject = Object.entries(projectTotals).sort((a, b) => b[1] - a[1])[0];

  const pendingAmount = 35200;

  return (
    <div>
      <h1 className="text-xl font-bold">Expense Tracking</h1>
      <p className="text-sm text-muted-foreground mb-4">
        Monitor and manage expenses across all active and completed projects.
      </p>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4 mb-6">
        {/* Total Expenses */}
        <CardComponent
          title="Total Expenses"
          description="Sum of all recorded expenses across all projects."
          action="View Details"
          full={true}
        >
          <div className="flex flex-col items-center justify-center space-y-2">
            <CircleDollarSign size={28} className="text-green-600" />
            <span className="text-2xl font-bold">  ${totalExpenses.toLocaleString()}
            </span>
          </div>
        </CardComponent>

        {/* This Month */}
        <CardComponent
          title="This Month"
          description="Expenses logged during the current month."
          action="View Report"
          full={true}
        >
          <div className="flex flex-col items-center justify-center space-y-2">
            <CalendarDays size={28} className="text-blue-600" />
            <span className="text-2xl font-bold">  ${thisMonth.toLocaleString()}
            </span>
          </div>
        </CardComponent>

        {/* Top Project */}
        <CardComponent
          title="Top Project"
          description="Project with the highest spending so far."
          action="Open Project"
          full={true}
        >
          <div className="flex items-center gap-4">
            <div className="bg-muted rounded-full p-2">
              <Building2 size={24} className="text-orange-600" />
            </div>
            <div>
              <div className="text-sm font-medium text-muted-foreground">  {topProject[0]}
              </div>
              <div className="text-lg font-bold text-foreground">{topProject[1].toLocaleString()}</div>
            </div>
          </div>
        </CardComponent>

        {/* Pending Expenses */}
        <CardComponent
          title="Pending Expenses"
          description="Expenses awaiting approval or processing."
          action="Review Now"
          full={true}
        >
          <div className="flex items-center gap-4">
            <div className="bg-muted rounded-full p-2">
              <Clock size={24} className="text-yellow-500" />
            </div>
            <div>
              <div className="text-sm font-medium text-muted-foreground">Pending Approvals</div>
              <div className="text-lg font-bold text-foreground">  ${pendingAmount.toLocaleString()}
              </div>
            </div>
          </div>
        </CardComponent>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <ReusableChart type="bar" data={barData} config={barConfig} title="Project Costs by Month" xKey="category" yKeys={["value"]} />
        <div>
          <h2 className="text-xl font-bold mb-2">Main Expenses</h2>
          <DataTable data={ExpenseData} columns={columns} filterPlaceholder="Filter Category..." filterColumn="category"  />
        </div>
      </div>
    </div>
  );
}
