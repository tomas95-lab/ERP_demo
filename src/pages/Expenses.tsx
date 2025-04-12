import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { DataTable } from "@/components/DataTable";
import { columns } from "@/components/columns_total_expenses";
import { useFirestoreCollection } from "@/hooks/useFirestoreCollection";
import { DialogComponent } from "@/components/DialogComponent";
import CreateExpenseForm from "@/components/createExpenseForm";
import { useScreen } from "@/components/ScreenContext";
import type { ExpenseData } from "@/components/columns_total_expenses";

export default function Expenses() {
  const { data: expenseData = [], loading: expenseLoading } = useFirestoreCollection<ExpenseData>(
    "financials/expense/items"
  );
  const [searchParams] = useSearchParams();
  const { setScreen } = useScreen();

  useEffect(() => {
    setScreen("Expenses");
  }, [setScreen]);

  const [statusFilter] = useState(searchParams.get("status"));

  const statusFilterFn = (item: ExpenseData) => {
    if (statusFilter !== "pending") return true;
    return item.status.toLowerCase() === "pending";
  };

  const sortedExpenses = [...expenseData].sort((a, b) =>
    a.project.localeCompare(b.project)
  );

  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between">
        <div className="space-y-2">
          <h1 className="text-xl font-bold">
            {statusFilter === "pending" ? "Pending" : "All"} expenses
          </h1>
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
            {(onClose) => <CreateExpenseForm onClose={onClose} />}
          </DialogComponent>
        </div>
      </div>

      {expenseLoading ? (
        <div className="text-center text-muted-foreground">Loading Expenses...</div>
      ) : (
        <DataTable<ExpenseData>
          columns={columns}
          filterColumn="project"
          data={sortedExpenses}
          externalFilter={statusFilterFn}
        />
      )}
    </div>
  );
}
