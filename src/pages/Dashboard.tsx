import { useState, useEffect } from "react";
import { DocumentData } from "firebase/firestore";
import { ColumnDef } from "@tanstack/react-table";
import CardComponent from "@/components/CardComponent";
import { DataTable } from "@/components/DataTable";
import { columns } from "@/components/columns";
import { ReusableChart } from "@/components/ReusableChart";
import { Badge } from "@/components/ui/badge";
import { Briefcase } from "lucide-react";
import { useFirestoreCollection } from "@/hooks/useFirestoreCollection";
import CreateProjectForm from "@/components/createProjectForm";
import { useScreen } from "@/components/ScreenContext";

interface ChartConfig {
  [key: string]: {
    label: string;
    color: string;
  };
}

export default function Dashboard() {
  const { setScreen } = useScreen();

  useEffect(() => {
    setScreen("Dashboard");
  }, []);

  const barConfig: ChartConfig = {
    materials: {
      label: "Materials",
      color: "#2563eb",
    },
    labor: {
      label: "Labor",
      color: "#60a5fa",
    },
  };

  const { data: costData } = useFirestoreCollection("costs");
  const { data: barData } = useFirestoreCollection("yearChart");
  const { data: projects } = useFirestoreCollection<{ status: string }>("projects");

  const [formLoading, setFormLoading] = useState(false);
  const [formKey, setFormKey] = useState(0); // Force re-render after project creation


 const handleProjectCreated = () => {
    setFormKey((prevKey) => prevKey + 1);
  };

  return (
    <div className="flex flex-col gap-4 p-4">
      <h1 className="text-2xl font-bold">Welcome to Your Dashboard</h1>
      <div className="grid gap-4 md:grid-cols-3">
        <CardComponent
          title="Create a New Project"
          description="Start a new project by filling in the details below."
          form
          formId="createProject"
          formAction="Create Project"
          action="false"
          formLoading={formLoading}
          full
        >
          <CreateProjectForm
            card={false}
            onSuccess={handleProjectCreated}
            setFormLoading={setFormLoading}
            key={formKey}
          />
        </CardComponent>

        <CardComponent
          title="Active Projects"
          description="Overview of your currently active projects."
          action="View All Projects"
          full
          path="/projects/all"
        >
          <div className="flex flex-col items-center justify-center space-y-2">
            <Briefcase size={32} className="text-gray-600" />
            <span className="text-4xl font-bold">
              {projects.filter((project) => project.status === "Active").length}
            </span>
            <Badge className="bg-green-800">Active</Badge>
          </div>
        </CardComponent>
        <ReusableChart
            type="bar"
            data={barData}
            config={barConfig}
            title="Monthly Project Costs"
            xKey="month"
            yKeys={["materials", "labor"]}
            description="hola"
          >
            <p>No additional content provided.</p>
        </ReusableChart>
      </div>

      <div className="flex-1 rounded-xl bg-white shadow p-4 mt-4">
        <h2 className="text-xl font-bold mb-3">Cost Details</h2>
        <DataTable
          data={costData}
          columns={columns as ColumnDef<DocumentData & { firestoreId?: string }>[]} // Type assertion added
          filterPlaceholder="Filter by provider..."
          filterColumn="provider"
        />
      </div>
    </div>
  );
}
