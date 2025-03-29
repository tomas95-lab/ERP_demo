import { ReusableChart } from '@/components/ReusableChart';
import CardComponent from '../components/CardComponent';
import { FileText, DollarSign, Clock, AlertTriangle } from 'lucide-react';
import { DataTable } from '@/components/DataTable';
import { invoiceColumns } from '@/components/columns_financials';
import data from "../data/systemData.json";

interface ChartConfig {
  [key: string]: {
    label: string;
    color: string;
  };
}

const barConfig: ChartConfig = {
  paid: { label: "Paid", color: "#10b981" },
  pending: { label: "Pending", color: "#fbbf24" },
};

const barData = data.financials.invoiceChart;
const invoiceData = data.financials.invoices;
const totalInvoices = invoiceData.length;

const totalInvoicesPaidAmount = invoiceData.reduce((total, invoice) => {
  return invoice.status === "Paid" ? total + invoice.amount : total;
}, 0);

const totalInvoicesPendingAmount = invoiceData.reduce((total, invoice) => {
  return invoice.status === "Pending" ? total + invoice.amount : total;
}, 0);

const totalInvoicesOverdueAmount = invoiceData.reduce((total, invoice) => {
  return invoice.status === "Overdue" ? total + invoice.amount : total;
}, 0);

export const invoiceDataTable: {
  project: string;
  amount: number;
  status: string;
  date: string;
}[] = invoiceData;

export function Invoices() {
  return (
    <div>
      <h1 className="text-xl font-bold">Invoices & Payments</h1>
      <p className="text-sm text-muted-foreground mb-4">
        Monitor and manage invoices and payments across all active and completed projects.
      </p>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <CardComponent
          title="Total Invoices"
          description="Sum of all invoices issued across all projects."
          action="View All"
          full
        >
          <div className="flex items-center gap-4">
            <FileText size={28} className="text-purple-600" />
            <div>
              <div className="text-sm font-medium text-muted-foreground">Invoices Issued</div>
              <div className="text-2xl font-bold">{totalInvoices}</div>
            </div>
          </div>
        </CardComponent>

        <CardComponent
          title="Total Paid"
          description="Total amount received from all payments."
          action="View Payments"
          full
        >
          <div className="flex items-center gap-4">
            <DollarSign size={28} className="text-green-600" />
            <div>
              <div className="text-sm font-medium text-muted-foreground">Amount Paid</div>
              <div className="text-2xl font-bold">${totalInvoicesPaidAmount}</div>
            </div>
          </div>
        </CardComponent>

        <CardComponent
          title="Pending Invoices"
          description="Invoices not yet paid or past due."
          action="Review Now"
          full
        >
          <div className="flex items-center gap-4">
            <Clock size={28} className="text-yellow-500" />
            <div>
              <div className="text-sm font-medium text-muted-foreground">Pending Amount</div>
              <div className="text-2xl font-bold">${totalInvoicesPendingAmount}</div>
            </div>
          </div>
        </CardComponent>

        <CardComponent
          title="Overdue"
          description="Invoices past due date requiring attention."
          action="Take Action"
          full
        >
          <div className="flex items-center gap-4">
            <AlertTriangle size={28} className="text-red-600" />
            <div>
              <div className="text-sm font-medium text-muted-foreground">Overdue Balance</div>
              <div className="text-2xl font-bold">${totalInvoicesOverdueAmount}</div>
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
          <DataTable
            data={invoiceDataTable}
            columns={invoiceColumns}
            filterPlaceholder="Filter Project..."
            filterColumn="project"
          />
        </div>
      </div>
    </div>
  );
}
