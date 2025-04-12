import { ColumnDef } from "@tanstack/react-table";
import { DialogComponent } from "./DialogComponent";
import { Pencil } from "lucide-react";
import EditExpenseForm from "./EditExpense";
import { Badge } from "@/components/ui/badge";

export type ExpenseData = {
  category: string;
  amount: number;
  date: string;
  project: string;
  status: string;
};

export const columns: ColumnDef<ExpenseData>[] = [
  {
    accessorKey: "category",
    header: "Category",
  },
  {
    accessorKey: "amount",
    header: "Amount",
    cell: ({ row }) => {
      const amount = row.getValue("amount") as number;
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount);
      return <div className="text-left font-medium">{formatted}</div>;
    },
  },
  {
    accessorKey: "project",
    header: "Project",
  },
  {
    accessorKey: "date",
    header: "Date",
    cell: ({ row }) => {
      const rawDate = row.getValue("date") as string;
      const date = new Date(rawDate);
      return date.toLocaleDateString("es-US");
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = (row.getValue("status") as string).toLowerCase();
      const color =
        status === "paid"
          ? "bg-green-800"
          : status === "pending"
          ? "bg-yellow-400 text-black"
          : status === "rejected"
          ? "bg-red-800"
          : "bg-gray-300";
      const label = status.charAt(0).toUpperCase() + status.slice(1);
      return <Badge className={`w-20 ${color}`}>{label}</Badge>;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const expense = row.original;
      return (
        <DialogComponent
          trigger={<Pencil className="cursor-pointer" size={18} />}
          title={`Edit expense: ${expense.project} - ${expense.category}`}
          description=""
          button={false}
        >
          {(onClose) => <EditExpenseForm expense={expense} onClose={onClose} />}
        </DialogComponent>
      );
    },
  },
];
