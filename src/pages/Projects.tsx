import { DataTable } from "@/components/DataTable";
import { DialogComponent } from "@/components/DialogComponent";
import { columns } from "@/components/columns_project";
import CreateProjectForm from "@/components/createProjectForm";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useEffect, useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";

// Define or import the ProjectData type
interface ProjectData {
  id: string;
  name: string;
  status: "Active" | "Pending" | "Completed";
  [key: string]: any; // Adjust fields as per your actual data structure
}
import { useFirestoreCollection } from "@/hooks/useFirestoreCollection";
import { useScreen } from "@/components/ScreenContext";

export function Projects() {
  const { data: projects, loading: loadingProjects } = useFirestoreCollection<ProjectData>("projects");
  const { setScreen } = useScreen();
  const [formLoading, setFormLoading] = useState(false);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    setScreen("Projects");
  }, [setScreen]);

  // Filter projects based on URL status parameter
  const statusFilter = searchParams.get("status");
  const filteredProjects = useMemo(() => {
    if (!statusFilter || !projects) return projects;

    const statusMap: Record<string, string> = {
      'active': 'Active',
      'pending': 'Pending',
      'completed': 'Completed'
    };

    const normalizedStatus = statusMap[statusFilter.toLowerCase()];
    return projects.filter(project => project.status === normalizedStatus);
  }, [projects, searchParams]);

  const handleExportCSV = () => {
    if (!projects || projects.length === 0) return;

    const header = Object.keys(projects[0]) as (keyof ProjectData)[];
    const replacer = (_key: string, value: any) => (value === null ? "" : value);
    const csvContent = [
      header.join(","),
      ...projects.map((row) =>
        header.map((fieldName) => JSON.stringify(row[fieldName], replacer)).join(",")
      ),
    ].join("\r\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "projects.csv");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex flex-col gap-2 p-4">
      <div className="flex items-start justify-between mb-4 flex-wrap gap-y-2">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold">{statusFilter ? statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1) : ""} Projects</h1>
          <p className="text-muted-foreground">
            Manage all ongoing, pending, and completed construction projects.
          </p>
        </div>
        <div className="flex gap-4 items-center sm:mt-0 mt-2">
          <DialogComponent
            trigger="Create a new Project"
            button
            title="Create a new Project"
            description=""
          >
            {(onClose) => (
              <CreateProjectForm onSuccess={onClose} formLoading={formLoading} setFormLoading={setFormLoading} card></CreateProjectForm>
            )}
          </DialogComponent>
          <Button onClick={handleExportCSV}>Export CSV</Button>
        </div>
      </div>
      {loadingProjects ? (
        <Spinner />
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
            <div className="p-4 border rounded-lg text-center">
              <p className="text-muted-foreground text-sm">Total</p>
              <p className="font-bold text-lg">{projects.length}</p>
            </div>
            <div className="p-4 border rounded-lg text-center">
              <p className="text-muted-foreground text-sm">Active</p>
              <p className="font-bold text-lg text-green-800">
                {projects.filter((p) => p.status === "Active").length}
              </p>
            </div>
            <div className="p-4 border rounded-lg text-center">
              <p className="text-muted-foreground text-sm">Pending</p>
              <p className="font-bold text-lg text-yellow-400">
                {projects.filter((p) => p.status === "Pending").length}
              </p>
            </div>
            <div className="p-4 border rounded-lg text-center">
              <p className="text-muted-foreground text-sm">Completed</p>
              <p className="font-bold text-lg text-gray-400">
                {projects.filter((p) => p.status === "Completed").length}
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-4 items-end">
            <DataTable
              data={filteredProjects}
              columns={columns as any}
              filterPlaceholder="Filter Status..."
              filterColumn="status"
            />
          </div>
        </>
      )}
    </div>
  );
}
