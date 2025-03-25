import { ColumnDef } from "@tanstack/react-table";
import { Button } from "./ui/button";
import { Badge } from "@/components/ui/badge";

export type ProjectData = {
  id: string;
  name: string;
  status: string;
  startDate: string;
  endDate: string;
  supervisor: string;
  budget: number;
};



export const columns: ColumnDef<ProjectData>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
        const status = row.getValue("status") as string;
        return ( 
            <Badge className={`w-20 ${status === "Active" ? "bg-green-800" : status === "Pending" ? "bg-yellow-400" : "bg-gray-400"}`}>{status}</Badge>
            )
    }
  },
  {
    accessorKey: "startDate",
    header: "Start Date"
  },
  {
    accessorKey: "endDate",
    header: "End Date"
  },
  {
    accessorKey: "supervisor",
    header: "Supervisor"
  },
  {
    accessorKey: "budget",
    header: "Budget",
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("budget"));
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount);
      return <div className="text-left font-medium">{formatted}</div>;
    },
  },
  
  {
    id: "actions",
    cell: ({ row }) => (
      <Button className="cursor-pointer h-8 px-4" onClick={() =>alert(`Editing ${row.original.name}`) }>Edit</Button>
    ),
  },
];
