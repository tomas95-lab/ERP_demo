import { ColumnDef } from "@tanstack/react-table";
import { Button } from "./ui/button";

export type Cost = {
  id: string;
  type: string;
  provider: string;
  amount: number;
};

export const columns: ColumnDef<Cost>[] = [
  {
    accessorKey: "type",
    header: "Type",
  },
  {
    accessorKey: "provider",
    header: "Provider",
  },
  {
    accessorKey: "amount",
    header: "Amount",
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("amount"));
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount);
      return <div className="text-left font-medium">{formatted}</div>;
    },
  },
];
