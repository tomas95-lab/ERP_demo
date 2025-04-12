import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { DialogComponent } from "./DialogComponent"
import { Pencil } from "lucide-react"
import { EditUserForm } from "./EditUserForm"

export type UsersData = {
  id: string
  name: string
  email: string
  role: string
  status: string
  createdAt: string,
  firestoreId: string 
}

export const columns: ColumnDef<UsersData>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "role",
    header: "Role",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string
      const color =
        status === "Active"
          ? "bg-green-800"
          : status === "Pending"
          ? "bg-yellow-400"
          : "bg-red-600"

      return <Badge className={`w-20 ${color}`}>{status}</Badge>
    },
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const user = row.original
      return (
        <DialogComponent
          trigger={<Pencil className="cursor-pointer" size={18} />}
          title={`Edit ${user.name}`}
          description="Edit the user"
          button={false}
        >
          {(onClose) => (
            <EditUserForm user={user} onClose={onClose} />
          )}
        </DialogComponent>
      )
    },
  },
]
