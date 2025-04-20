import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import type { Invoice } from "@/pages/invoices"; // Import the Invoice type

export type InvoinceData ={
    project: string;
    amount: number;
    status: string;
    date: string;
};

export type ExpenseData = {
  category: string;
  amount: number;
  project: string;
};

export const columns: ColumnDef<ExpenseData>[] = [
  {
    accessorKey: "category",
    header: "Category",
    cell: ({ row }) => {
      const value = row.getValue("category") as string;
      return <span className="capitalize">{value}</span>;
    },
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
];


export const invoiceColumns: ColumnDef<Invoice>[] = [
    {
        accessorKey: "project",
        header: "Project",
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
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
            const status = row.getValue("status") as string;
            return ( 
                <Badge className={`w-20 ${status === "Paid" ? "bg-green-800" : status === "Pending" ? "bg-yellow-400" : "bg-red-800"}`}>{status}</Badge>
                )
        }
    },
    {
        accessorKey: "date",
        header: "Date",
        cell:({row})=> {
          const rawDate = row.getValue("date") as string;
          const date = new Date(rawDate);
          return date.toLocaleDateString("en-US");
        },
    },
]