import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { DialogComponent } from "@/components/DialogComponent";
import { Pencil, Trash } from "lucide-react";
import { EditOrderForm } from "./EditOrders";
import { deleteDoc, doc } from "firebase/firestore"
import { db } from "@/firebaseConfig"

export type OrdersData = {
  id: string;
  supplier: string;
  status: string;
  date: string;
  total: number;
};

const handleDelete = async (order: OrdersData) => {
  const confirm = window.confirm("Are you sure you want to delete this order?");
  if (confirm) {
    try {
      await deleteDoc(doc(db, "orders/purchaseOrders/items", String(order.id)));
    } catch (error) {
      console.error("Error deleting order:", error);
    }
  }
};



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
        <Badge className={`w-20 ${status === "Completed" ? "bg-green-800" : status === "In Progress" ? "bg-blue-800" : status == 'Cancelled' ? "bg-red-600" : "bg-yellow-400"}`}>
          {status}
        </Badge>
      );
    },
  },
  {
    accessorKey: "date",
    header: "Date",
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
    header: "Actions",
    cell: ({ row }) => {
      const order = row.original;
      return (
        <div className="flex items-center space-x-2">
          <DialogComponent
            trigger={<Pencil className="cursor-pointer" size={18} />}
            title={`Order Details - ${order.supplier}`}
            description="Review full order information"
            button={false}
          >
            {(onclose) => (
              <EditOrderForm
                order={order}
                onClose={onclose}
            />)}
          </DialogComponent>

          <Trash
          className="cursor-pointer text-red-600"
          size={18}
          onClick={() => handleDelete(order)}
          />
        </div>
      );
    },
  },
];
