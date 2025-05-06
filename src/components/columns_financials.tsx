import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import type { Invoice } from "@/pages/invoices"; // Import the Invoice type
import { deleteDoc, doc } from "firebase/firestore";
import { db } from "@/firebaseConfig";
import { toast } from "sonner";
import { Trash } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export type InvoinceData = {
  project: string;
  amount: number;
  status: string;
  date: string;
  id: string;
};

export type ExpenseData = {
  category: string;
  amount: number;
  project: string;
  id: string;
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
  {
    id: "actions",
    cell: ({ row }) => {
      const record = row.original;
      return (
        <div className="flex items-center gap-2">
          <AlertDialog>
            <AlertDialogTrigger>
              <Trash className="cursor-pointer text-red-600" size={18} />
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the record and remove its data.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={async () => {
                    try {
                      await deleteDoc(doc(db, "financials/expense/items", record.id));
                      toast.success("Record deleted successfully.");
                    } catch (error) {
                      toast.error("Failed to delete record.");
                    }
                  }}
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      );
    },
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
        <Badge
          className={`w-20 ${
            status === "Paid"
              ? "bg-green-800"
              : status === "Pending"
              ? "bg-yellow-400"
              : "bg-red-800"
          }`}
        >
          {status}
        </Badge>
      );
    },
  },
  {
    accessorKey: "date",
    header: "Date",
    cell: ({ row }) => {
      const rawDate = row.getValue("date") as string;
      const date = new Date(rawDate);
      return date.toLocaleDateString("en-US");
    },
  },
];