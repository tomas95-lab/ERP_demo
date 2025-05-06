import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { DialogComponent } from "./DialogComponent";
import { EditProjectForm } from "./EditProjectForm";
import { Eye, LayoutDashboard, Pencil, Trash } from "lucide-react";
import ProjectView from "./ProjectView";
import { Link } from "react-router-dom";
import { deleteDoc, doc } from "firebase/firestore"
import { toast } from "sonner";
import { db } from "@/firebaseConfig"

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
export type ProjectData = {
  id: string;
  name: string;
  status: string;
  startDate: string;
  endDate: string;
  supervisor: string;
  budget: number;
  firestoreId: string;
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
            {() => <ProjectView project={project} />}
          </DialogComponent>
          <Link to={`/projects/all/planner?id=${project.firestoreId}`}>
            <LayoutDashboard size={18} className="cursor-pointer"></LayoutDashboard>
          </Link>
          
          <AlertDialog>
            <AlertDialogTrigger>
              <Trash className="cursor-pointer text-red-600" size={18} />
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the supplier and remove its data.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={async () => {
                    await deleteDoc(doc(db, "orders/purchaseOrders/items", String(project.id)))
                    toast.success("Order deleted");
                  }}
                >
                  Continue
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      );
    },
  },
];
