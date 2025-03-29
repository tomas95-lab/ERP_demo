import { DataTable } from "@/components/DataTable";
import {columns } from "@/components/columns_project"; // Import columns from columns.tsx
import { Button } from "@/components/ui/button";
import data from "../data/systemData.json"

const projects = data.projects

export function Projects() {
  return (
    <div>
      <h1 className="text-xl font-bold">Projects</h1>
      <p className="text-sm text-muted-foreground mb-4">
        Manage all ongoing, pending, and completed construction projects.
      </p>
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

        <div className="flex gap-4" > 
          <Button  className="mt-8">Create New Project</Button>  
          <Button  className="mt-8">Export CSV</Button>  
        </div>
      </div>
    </div>
  );
}
