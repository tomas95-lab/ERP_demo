import { DataTable } from "@/components/DataTable";
import { DialogComponent } from "@/components/DialogComponent";
import {columns } from "@/components/columns_project"; // Import columns from columns.tsx
import CreateProjectForm from "@/components/createProjectForm";
import { Button } from "@/components/ui/button";

import { useFirestoreCollection } from "@/hooks/useFirestoreCollection";


export function Projects() {
  const {data: projects} = useFirestoreCollection<{ status: string }>("projects")

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-start justify-between mb-4 flex-wrap gap-y-2">
        <div>
          <h1 className="text-xl font-bold">Projects</h1>
          <p className="text-sm text-muted-foreground mb-4">
            Manage all ongoing, pending, and completed construction projects.
          </p>
        </div>
        <div className="flex gap-4 items-center sm:mt-0 mt-2">
          <DialogComponent
            trigger={<Button>create a new Project</Button>}
            title="create a new Project"
            description="Modify project details"
          >
            {(onClose) => (
              <CreateProjectForm onSuccess={onClose}></CreateProjectForm>
            )}
          </DialogComponent>
          <Button>Export CSV</Button>
        </div>
      </div>

      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
        <div className="p-4 border rounded-lg text-center">
          <p className="text-muted-foreground text-sm">Total</p>
          <p className="font-bold text-lg">{projects.length}</p>
        </div>
        <div className="p-4 border rounded-lg text-center">
          <p className="text-muted-foreground text-sm">Active</p>
          <p className="font-bold text-lg text-green-800">
            {projects.filter(p => p.status === "Active").length}
          </p>
        </div>
        <div className="p-4 border rounded-lg text-center">
          <p className="text-muted-foreground text-sm">Pending</p>
          <p className="font-bold text-lg text-yellow-400">
            {projects.filter(p => p.status === "Pending").length}
          </p>
        </div>
        <div className="p-4 border rounded-lg text-center">
          <p className="text-muted-foreground text-sm">Completed</p>
          <p className="font-bold text-lg text-gray-400">
            {projects.filter(p => p.status === "Completed").length}
          </p>
        </div>
      </div>
      <div className="flex flex-col gap-4 items-end">
        <DataTable data={projects} columns={columns} filterPlaceholder="Filter Status..." filterColumn="status" />
      </div>
    </div>
  );
}
