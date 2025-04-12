import { DataTable } from "@/components/DataTable";
import { DialogComponent } from "@/components/DialogComponent";
import { columns } from "@/components/columns_project"; // Importa las columnas desde columns.tsx
import CreateProjectForm from "@/components/createProjectForm";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useFirestoreCollection } from "@/hooks/useFirestoreCollection";
import { useScreen } from "@/components/ScreenContext";

export function Projects() {
  const { data: projects, loading: loadingProjects } = useFirestoreCollection<{ status: string }>("projects");
  const [formLoading, setFormLoading] = useState(false);
  const { setScreen } = useScreen();

  useEffect(() => {
    setScreen("Projects");
  }, [setScreen]);

  const handleExportCSV = () => {
    if (!projects || projects.length === 0) return;

    // Usamos la primera fila para obtener los headers (asumimos que todos tienen la misma estructura)
    const header = Object.keys(projects[0]);
    // Función para reemplazar valores nulos por cadena vacía
    const replacer = (_key: string, value: any) => (value === null ? "" : value);
    // Creamos el contenido CSV
    const csvContent = [
      header.join(","), // Fila de headers
      ...projects.map((row) =>
        header.map((fieldName) => JSON.stringify(row[fieldName], replacer)).join(",")
      ),
    ].join("\r\n");

    // Creamos el Blob y el URL para la descarga
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
            trigger="Create a new Project"
            button
            title="Create a new Project"
            description=""
          >
            {(onClose) => (
              <CreateProjectForm onSuccess={onClose} setFormLoading={setFormLoading} />
            )}
          </DialogComponent>
          {/* Se implementa el botón con la función handleExportCSV */}
          <Button onClick={handleExportCSV}>Export CSV</Button>
        </div>
      </div>
      {loadingProjects ? (
        <div className="text-center text-muted-foreground">Loading Projects...</div>
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
              data={projects}
              columns={columns}
              filterPlaceholder="Filter Status..."
              filterColumn="status"
            />
          </div>
        </>
      )}
    </div>
  );
}
