import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { DialogComponent } from "./DialogComponent";
import EditSupplierForm from "./EditSupplierForm";
import { doc, deleteDoc } from "firebase/firestore"
import { db } from "@/firebaseConfig"



const handleDelete = async (firestoreId: string) => {
  if (confirm("Are you sure you want to delete this supplier?")) {
    await deleteDoc(doc(db, "suppliers", firestoreId))
    alert("Supplier deleted successfully.")
  }
}

export type SupplierData = {
  id: string;
  firestoreId: string;
  name: string;
  status: "Active" | "Pending" | "Onboarding";
  category?: string;
  email?: string;
  phone?: string;
  notes?: string;
  cuit?: string;
};

export const columns: ColumnDef<SupplierData>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as SupplierData["status"];
      const color =
        status === "Active"
          ? "bg-green-700"
          : status === "Pending"
          ? "bg-yellow-500"
          : "bg-blue-500";
      return <Badge className={`w-24 ${color}`}>{status}</Badge>;
    },
  },
  {
    accessorKey: "category",
    header: "Category",
    cell: ({ row }) => row.getValue("category") || "—",
  },
  {
    accessorKey: "email",
    header: "Contact",
    cell: ({ row }) => row.getValue("email") || row.getValue("phone") || "Not available",
  },
  {
    accessorKey: "cuit",
    header: "CUIT",
    cell: ({ row }) => row.getValue("cuit") || "—",
  },
  {
    accessorKey: "notes",
    header: "Notes",
    cell: ({ row }) => row.getValue("notes") || "—",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const supplier = row.original;
      return (
        <div className="flex items-center gap-2">
          <DialogComponent
            trigger={<Eye className="cursor-pointer" size={18} />}
            title={`View ${row.getValue("name")}`}
            description="View supplier details"
          >
            {(onClose) => (
              <div className="grid grid-cols-2 gap-4 p-4 text-sm">
                <div>
                  <p className="text-muted-foreground mb-1">Status</p>
                  <p className="font-semibold">{supplier.status || "—"}</p>
                </div>
                <div>
                  <p className="text-muted-foreground mb-1">Category</p>
                  <p className="font-semibold">{supplier.category || "—"}</p>
                </div>
                <div>
                  <p className="text-muted-foreground mb-1">Email</p>
                  <p className="font-semibold">{supplier.email || "—"}</p>
                </div>
                <div>
                  <p className="text-muted-foreground mb-1">Phone</p>
                  <p className="font-semibold">{supplier.phone || "—"}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-muted-foreground mb-1">Notes</p>
                  <p className="font-semibold whitespace-pre-wrap">{supplier.notes || "—"}</p>
                </div>
              </div>
            )}
          </DialogComponent>

          <DialogComponent
            trigger={<Pencil className="cursor-pointer" size={18} />}
            title={`Edit ${row.getValue("name")}`}
            description="Modify supplier information"
          >
            {(onClose) => <EditSupplierForm supplier={supplier} onClose={onClose} />}
          </DialogComponent>

          <Trash2
            className="cursor-pointer text-red-600"
            size={18}
            onClick={() => handleDelete(supplier.firestoreId)}
          />
        </div>
      );
    },
  },
];
