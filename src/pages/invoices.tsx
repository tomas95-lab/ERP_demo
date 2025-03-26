import { ReusableChart } from '@/components/ReusableChart';
import CardComponent from '../components/CardComponent';
import {FileText, DollarSign, Clock, AlertTriangle} from 'lucide-react';
import { DataTable } from '@/components/DataTable';
import { invoiceColumns } from '@/components/columns_financials';

// 1. Esta interfaz es para el config del gráfico (colores y labels)
interface ChartConfig {
  [key: string]: {
    label: string;
    color: string;
  };
}

// 2. Config para los colores de las barras
const barConfig: ChartConfig = {
  paid: { label: "Paid", color: "#10b981" },
  pending: { label: "Pending", color: "#fbbf24" },
};

// 3. Datos del gráfico (no se valida con la interfaz anterior)
const barData = [
  { month: "Jan", paid: 75000, pending: 12000 },
  { month: "Feb", paid: 62000, pending: 8000 },
  { month: "Mar", paid: 88000, pending: 5000 },
  { month: "Apr", paid: 79000, pending: 7000 },
];


export const invoiceData:{project: string;
  amount: number;
  status: string;
  date: string;} [] = [
  {
    
    project: "Residential Complex A",
    status: "Paid",
    amount: 12500,
    date: "2024-03-15",
  },
  {
    
    project: "Bridge Renovation X12",
    status: "Pending",
    amount: 8700,
    date: "2024-03-20",
  },
  {
    
    project: "Shopping Center 45",
    status: "Overdue",
    amount: 15400,
    date: "2024-02-05",
  },
  {
    
    project: "Hospital Refurbishment B",
    status: "Paid",
    amount: 21000,
    date: "2024-03-01",
  },
  {
    
    project: "Warehouse Expansion Z",
    status: "Pending",
    amount: 9600,
    date: "2024-03-18",
  },
  {
    
    project: "Residential Complex A",
    status: "Paid",
    amount: 17800,
    date: "2024-02-25",
  },
  {
    
    project: "Bridge Renovation X12",
    status: "Overdue",
    amount: 12700,
    date: "2024-01-10",
  },
];

export function Invoices() {
  return (
    <>
      <h1 className="text-xl font-bold">Invoices & Payments</h1>
      <p className="text-sm text-muted-foreground mb-4">
        Monitor and manage Invoives and Payments across all active and completed projects.
      </p>    
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <CardComponent
          title="Total Invoices"
          description="Sum of all invoices issued across all projects."
          action="View All"
          full={true}
        >
          <div className="flex flex-col items-center justify-center space-y-2">
            <FileText size={28} className="text-purple-600" />
            <span className="text-2xl font-bold">112</span>
          </div>
        </CardComponent>

        <CardComponent
          title="Total Paid"
          description="Total amount received from all payments."
          action="View Payments"
          full={true}
        >
          <div className="flex flex-col items-center justify-center space-y-2">
            <DollarSign size={28} className="text-green-600" />
            <span className="text-2xl font-bold">$985,000</span>
          </div>
        </CardComponent>

        <CardComponent
          title="Pending Invoices"
          description="Invoices not yet paid or past due."
          action="Review Now"
          full={true}
        >
          <div className="flex items-center gap-4">
            <Clock size={24} className="text-yellow-500" />
            <div>
              <div className="text-sm font-medium text-muted-foreground">Pending Amount</div>
              <div className="text-lg font-bold">$45,200</div>
            </div>
          </div>
        </CardComponent>

        <CardComponent
          title="Overdue"
          description="Invoices past due date requiring attention."
          action="Take Action"
          full={true}
        >
          <div className="flex items-center gap-4">
            <AlertTriangle size={24} className="text-red-600" />
            <div>
              <div className="text-sm font-medium text-muted-foreground">Overdue Balance</div>
              <div className="text-lg font-bold">$12,700</div>
            </div>
          </div>
        </CardComponent>
      </div>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <ReusableChart
        type="bar"
        data={barData}
        config={barConfig}
        title="Invoices and Payments by Month"
        xKey="month"
        yKeys={["paid", "pending"]}
      />
        <div>
          <h2 className="text-xl font-bold mb-2">Main Invoices</h2>
          <DataTable data={invoiceData} columns={invoiceColumns} filterPlaceholder="Filter Project..." filterColumn="project"  />
        </div>
      </div>
    </>
  );
}
