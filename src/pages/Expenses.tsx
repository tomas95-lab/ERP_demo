import { DataTable } from "@/components/DataTable"
import { useFirestoreCollection } from "@/hooks/useFirestoreCollection"
import {columns} from "../components/columns_total_expenses"
import { DialogComponent } from "@/components/DialogComponent"
import CreateProjectForm from "@/components/createProjectForm"
import { useSearchParams } from "react-router-dom"
import { useState } from "react"
import CreateExpenseForm from "@/components/createExpenseForm"
import { filterFns } from "@tanstack/react-table"

interface Expense {
    category: string
    amount: number
    project: string
    date?: string
    status: string
}

export default function Expenses(){
    const { data: ExpenseData = [], loading: expenseLoading } = useFirestoreCollection<Expense>("financials/expense/items")
    const [loading, setFormLoading] = useState(false)
    const [searchParams, setSearchParams] = useSearchParams();
   
    const [statusFilter, setStatusFilter] = useState(searchParams.get("status"))
    
    const statusFilterFn = (item: Expense) => {
        if (statusFilter !== "pending") return true
        return item.status.toLowerCase() === statusFilter
    }

    const returnSomething = (item: Expense)=>{
        console.log(item)
    }
    if (ExpenseData.length > 0) {
        returnSomething(ExpenseData[0])
    }
    const sortedExpenses = [...ExpenseData].sort((a, b) =>
        a.project.localeCompare(b.project)
      )

    return (
        <div className="flex flex-col gap-2">
            <div className="flex justify-between">
                <div className="space-y-2">
                    <h1 className="text-xl font-bold"> {statusFilter == "pending" ? "Pending" : "All"} expenses</h1>
                    <p className="text-sm text-muted-foreground mb-4">
                    Monitor and manage expenses across all active and completed projects.
                    </p>
                </div>
                <div className="flex gap-4 items-center sm:mt-0 mt-2">
                    <DialogComponent
                        trigger="Create a new Expense"
                        button
                        title="Create a new Expense"
                        description=""
                    >
                        {(onClose) => (
                          <CreateExpenseForm onClose={onClose}></CreateExpenseForm>      
                        )}
                    </DialogComponent>
                </div>
            </div>
            {expenseLoading ? (
            <div className="text-center text-muted-foreground">Loading Expenses...</div> 
            ) : (
            <>
                <DataTable columns={columns} filterColumn="project" data={sortedExpenses} externalFilter={statusFilterFn}></DataTable>
            </>
            )}
      </div>    
      )
}