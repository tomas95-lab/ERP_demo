import { ColumnDef } from "@tanstack/react-table";

export type ExpenseData = {
  category: string;
  amount: number;
  project: string;
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
];
