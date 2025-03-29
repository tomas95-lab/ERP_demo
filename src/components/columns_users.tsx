import { ColumnDef } from "@tanstack/react-table";
import { Button } from "./ui/button";
import { Badge } from "@/components/ui/badge";

export type UsersData = {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  createdAt: string
};

export const users = [
    {
      id: "u001",
      name: "Tomas Ruiz",
      email: "tomas.ruiz@example.com",
      role: "Administrator",
      status: "Active",
      createdAt: "2024-12-15",
    },
    {
      id: "u002",
      name: "Lucía Fernández",
      email: "lucia.fernandez@example.com",
      role: "Project Manager",
      status: "Active",
      createdAt: "2025-01-03",
    },
    {
      id: "u003",
      name: "Mateo García",
      email: "mateo.garcia@example.com",
      role: "Supervisor",
      status: "Inactive",
      createdAt: "2024-11-22",
    },
    {
      id: "u004",
      name: "Valentina López",
      email: "valentina.lopez@example.com",
      role: "Accountant",
      status: "Active",
      createdAt: "2025-02-10",
    },
    {
      id: "u005",
      name: "Juan Pérez",
      email: "juan.perez@example.com",
      role: "Viewer",
      status: "Pending",
      createdAt: "2025-03-01",
    },
  ]
   
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
            const status = row.getValue("status") as string;
            return (
                <Badge
                    className={`w-20 ${
                        status === "Active"
                            ? "bg-green-800"
                            : status === "Pending"
                            ? "bg-yellow-400"
                            : status == "Inactive"
                            ? "bg-red-600"
                            : ""
                    }`}
                >
                    {status}
                </Badge>
            );
        },
    },
    {
        accessorKey: "createdAt",
        header: "Created At",
    },
    {
        id: "actions",
        cell: ({ row }) => (
            <Button
                className="cursor-pointer h-8 px-4"
                onClick={() => alert(`Editing ${row.original.name}`)}
            >
                Edit
            </Button>
        ),
    },
];

