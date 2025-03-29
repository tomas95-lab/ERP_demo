import { DataTable } from "@/components/DataTable";
import {columns } from "@/components/columns_project"; // Import columns from columns.tsx
import { Button } from "@/components/ui/button";

export const ProjectData = [
  {
    id: "PRJ001",
    name: "Residential Complex A",
    status: "Active",
    startDate: "2024-01-10",
    endDate: "2024-09-30",
    supervisor: "Carlos Méndez",
    budget: 450000,
  },
  {
    id: "PRJ002",
    name: "Bridge Renovation X12",
    status: "Pending",
    startDate: "2024-07-01",
    endDate: "2025-02-15",
    supervisor: "Laura Chen",
    budget: 320000,
  },
  {
    id: "PRJ003",
    name: "Warehouse Expansion Z",
    status: "Completed",
    startDate: "2023-03-20",
    endDate: "2023-12-01",
    supervisor: "Miguel Fernández",
    budget: 210000,
  },
  {
    id: "PRJ004",
    name: "Shopping Center 45",
    status: "Active",
    startDate: "2024-05-05",
    endDate: "2025-01-20",
    supervisor: "Ana Torres",
    budget: 690000,
  },
  {
    id: "PRJ005",
    name: "Hospital Refurbishment B",
    status: "Pending",
    startDate: "2024-10-10",
    endDate: "2025-06-30",
    supervisor: "Daniel Rojo",
    budget: 540000,
  },
]

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
          <p className="font-bold text-lg">{ProjectData.length}</p>
        </div>
        <div className="p-4 border rounded-lg text-center">
          <p className="text-muted-foreground text-sm">Active</p>
          <p className="font-bold text-lg text-green-800">
            {ProjectData.filter(p => p.status === "Active").length}
          </p>
        </div>
        <div className="p-4 border rounded-lg text-center">
          <p className="text-muted-foreground text-sm">Pending</p>
          <p className="font-bold text-lg text-yellow-400">
            {ProjectData.filter(p => p.status === "Pending").length}
          </p>
        </div>
        <div className="p-4 border rounded-lg text-center">
          <p className="text-muted-foreground text-sm">Completed</p>
          <p className="font-bold text-lg text-gray-400">
            {ProjectData.filter(p => p.status === "Completed").length}
          </p>
        </div>
      </div>
      <div className="flex flex-col gap-4 items-end">
        <DataTable data={ProjectData} columns={columns} filterPlaceholder="Filter Status..." filterColumn="status" />

        <div className="flex gap-4" > 
          <Button  className="mt-8">Create New Project</Button>  
          <Button  className="mt-8">Export CSV</Button>  
        </div>
      </div>
    </div>
  );
}
