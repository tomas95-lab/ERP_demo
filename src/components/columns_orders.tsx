import { ColumnDef } from "@tanstack/react-table";
import { Button } from "./ui/button";
import { Badge } from "@/components/ui/badge";

export type OrdersData = {
  id: string;
  supplier: string;
  status: string;
  date: string;
  total: number;
};

export const purchaseOrders = [
    {
      supplier: "SteelCo Ltd.",
      orderId: "ORD-1042",
      status: "Completed",
      date: "2024-06-21",
      total: 24300,
    },
    {
      supplier: "WorkerUnion",
      orderId: "ORD-1043",
      status: "Pending",
      date: "2024-07-03",
      total: 14500,
    },
    {
      supplier: "MachineryPro",
      orderId: "ORD-1044",
      status: "In Progress",
      date: "2024-07-10",
      total: 38900,
    },
    {
      supplier: "TransportMax",
      orderId: "ORD-1045",
      status: "Cancelled",
      date: "2024-07-12",
      total: 6200,
    },
    {
      supplier: "CityGov",
      orderId: "ORD-1046",
      status: "Completed",
      date: "2024-07-15",
      total: 17400,
    },
  ]
  

export const columns: ColumnDef<OrdersData>[] = [
  {
    accessorKey: "supplier",
    header: "Supplier",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
        const status = row.getValue("status") as string;
        return ( 
            <Badge className={`w-20 ${status === "Completed" ? "bg-green-800" : status === "In progress" ? "bg-blue-800" : status == 'Cancelled' ? "bg-red-600": "bg-yellow-400"}`}>{status}</Badge>
            )
    }
  },
  {
    accessorKey: "date",
    header: "Date"
  },
  {
    accessorKey: "total",
    header: "Total",
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("total"));
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
      <Button className="cursor-pointer h-8 px-4" onClick={() =>alert(`Editing ${row.original.supplier}`) }>Edit</Button>
    ),
  },
];
