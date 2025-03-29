import CardComponent from "@/components/CardComponent";
import { ReusableChart } from "@/components/ReusableChart";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Briefcase } from "lucide-react"; // Icono para "Active Projects"
import { DataTable } from "@/components/DataTable";
import { Cost, columns } from "@/components/columns"; // Import columns from columns.tsx
import data from "../data/systemData.json"

interface ChartConfig {
  [key: string]: {
    label: string;
    color: string;
  };
}

const costData: Cost[] = data.costs

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

const barData = data.yearChart

export default function Dashboard() {
  return (
    <div>
      <h1 className="text-xl font-bold">Welcome!</h1>
      <div className="grid auto-rows-min gap-4 md:grid-cols-3">
        {/* Crear un nuevo proyecto */}
        <CardComponent title="Create a New Project" description="" action="Create" full>
          <form>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="name">Name</Label>
                <Input id="name" placeholder="Name of your project" />
              </div>
            </div>
          </form>
        </CardComponent>

        {/* Proyectos activos - Mejorado */}
        <CardComponent title="Active Projects" description="" action="View All projects" full path="/projects/all">
          <div className="flex flex-col items-center justify-center space-y-2">
            <Briefcase size={32} className="text-gray-600" />
            <span className="text-4xl font-bold">66</span>
            <Badge className="bg-green-800">Currently active</Badge>
          </div>
        </CardComponent>

        {/* Gráfico de costos */}
        <ReusableChart type="bar" data={barData} config={barConfig} title="Project Costs by Month" xKey="month" yKeys={["materials", "labor"]} />
      </div>
      <div className="h-full flex-1 rounded-xl bg-muted md:min-h-min p-4">
        <h2 className="text-xl font-bold mb-2">Main Costs</h2>
        <DataTable data={costData} columns={columns} filterPlaceholder="Filter users..." filterColumn="provider" />
      </div>
    </div>

  );
}
