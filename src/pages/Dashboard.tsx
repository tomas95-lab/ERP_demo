import CardComponent from "@/components/CardComponent";
import { ReusableChart } from "@/components/ReusableChart";
import { Badge } from "@/components/ui/badge";

import { Briefcase } from "lucide-react";
import { DataTable } from "@/components/DataTable";
import { Cost, columns } from "@/components/columns";



import { useFirestoreCollection } from "@/hooks/useFirestoreCollection";
import CreateProjectForm from "@/components/createProjectForm";


export default function Dashboard() {
  interface ChartConfig {
    [key: string]: {
      label: string;
      color: string;
    };
  }
  
  const barConfig = {
    materials: {
      label: "Materials",
      color: "#2563eb",
    },
    labor: {
      label: "Labor",
      color: "#60a5fa",
    },
  } satisfies ChartConfig;
  
  const { data: costData } = useFirestoreCollection<Cost>("costs")
  const {data: barData} = useFirestoreCollection("yearChart")

  return (
    <div className="flex flex-col gap-2">
      <h1 className="text-xl font-bold">Welcome!</h1>
      <div className="grid auto-rows-min gap-4 md:grid-cols-3">
        <CardComponent title="Create a New Project" description="" action="false" full>
          <CreateProjectForm ></CreateProjectForm>
        </CardComponent>

        <CardComponent title="Active Projects" description="" action="View All projects" full path="/projects/all">
          <div className="flex flex-col items-center justify-center space-y-2">
            <Briefcase size={32} className="text-gray-600" />
            <span className="text-4xl font-bold">66</span>
            <Badge className="bg-green-800">Currently active</Badge>
          </div>
        </CardComponent>

        <ReusableChart type="bar" data={barData} config={barConfig} title="Project Costs by Month" xKey="month" yKeys={["materials", "labor"]} />
      </div>
      <div className="flex-1 rounded-xl md:min-h-min p-4">
        <h2 className="text-xl font-bold mb-2">Main Costs</h2>
        <DataTable data={costData} columns={columns} filterPlaceholder="Filter users..." filterColumn="provider" />
      </div>
    </div>
  );
}
