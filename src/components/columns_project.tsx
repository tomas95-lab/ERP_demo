import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { DialogComponent } from "./DialogComponent";
import { EditProjectForm } from "./EditProjectForm";
import { Eye, Pencil } from "lucide-react";
import ProjectView from "./ProjectView";

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
        <Badge
          className={`w-20 ${
            status === "Active"
              ? "bg-green-800"
              : status === "Pending"
              ? "bg-yellow-400"
              : "bg-gray-400"
          }`}
        >
          {status}
        </Badge>
      );
    },
  },
  {
    accessorKey: "startDate",
    header: "Start Date",
    cell: ({ row }) => {
      const rawDate = row.getValue("startDate") as string;
      const date = new Date(rawDate);
      return date.toLocaleDateString("en-US");
    },
  },
  {
    accessorKey: "endDate",
    header: "End Date",
    cell: ({ row }) => {
      const rawDate = row.getValue("endDate") as string;
      const date = new Date(rawDate);
      return date.toLocaleDateString("es-US");
    },
  },
  {
    accessorKey: "supervisor",
    header: "Supervisor",
  },
  {
    accessorKey: "budget",
    header: "Budget",
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("budget") as string);
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount);
      return <div className="text-left font-medium">{formatted}</div>;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const project = row.original;
      return (
        <div className="flex items-center gap-2">
          <DialogComponent
            trigger={<Pencil className="cursor-pointer" size={18} />}
            title={`Edit ${project.name}`}
            description="Modify project details"
            button={false}
          >
            {(onClose) => (
              <EditProjectForm project={project} onSuccess={onClose} />
            )}
          </DialogComponent>
          <DialogComponent
            trigger={<Eye className="cursor-pointer" size={18} />}
            title={`View ${project.name}`}
            description="View project details"
            button={false}
          >
            {(onClose) => <ProjectView project={project} />}
          </DialogComponent>
        </div>
      );
    },
  },
];
