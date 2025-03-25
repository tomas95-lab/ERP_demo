import CardComponent from "@/components/CardComponent";
import { ReusableChart } from "@/components/ReusableChart";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Briefcase } from "lucide-react"; // Icono para "Active Projects"
import { DataTable } from "@/components/DataTable";
import { Cost, columns } from "@/components/columns"; // Import columns from columns.tsx

interface ChartConfig {
  [key: string]: {
    label: string;
    color: string;
  };
}

const costData: Cost[] = [
  { id: "1", type: "Materials", provider: "SteelCo Ltd.", amount: 12500 },
  { id: "2", type: "Labor", provider: "WorkerUnion", amount: 21000 },
  { id: "3", type: "Equipment", provider: "MachineryPro", amount: 9500 },
  { id: "4", type: "Logistics", provider: "TransportMax", amount: 4300 },
  { id: "5", type: "Permits", provider: "CityGov", amount: 1800 },
];

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

const barData = [
  { month: "January", labor: 50000, materials: 30000 },
  { month: "February", labor: 65000, materials: 42000 },
  { month: "March", labor: 72000, materials: 38000 },
  { month: "April", labor: 48000, materials: 35000 },
  { month: "May", labor: 58000, materials: 39000 },
  { month: "June", labor: 60000, materials: 41000 },
  { month: "July", labor: 75000, materials: 45000 },
  { month: "August", labor: 80000, materials: 46000 },
  { month: "September", labor: 78000, materials: 47000 },
  { month: "October", labor: 69000, materials: 44000 },
  { month: "November", labor: 72000, materials: 43000 },
  { month: "December", labor: 76000, materials: 49000 },
];

export default function Dashboard() {
  return (
    <>
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
    </>

  );
}
