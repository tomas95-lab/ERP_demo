import { useState, useEffect, useMemo, useCallback } from "react";
import { ReusableChart } from "@/components/ReusableChart";
import CardComponent from "../components/CardComponent";
import { FileText, DollarSign, Clock, AlertTriangle } from "lucide-react";
import { DataTable } from "@/components/DataTable";
import { invoiceColumns } from "@/components/columns_financials";
import { useFirestoreCollection } from "@/hooks/useFirestoreCollection";
import { format } from "date-fns";
import { useScreen } from "@/components/ScreenContext";
import { InvoiceForm } from "@/components/InvoiceForm";
import { DialogComponent } from "@/components/DialogComponent";

export type Invoice = {
  project: string;
  amount: number;
  status: "Paid" | "Pending" | "Overdue";
  date: string;
};

export function Invoices() {
  
  interface ChartConfig {
    [key: string]: { label: string; color: string };
  }

  const { setScreen } = useScreen();

  useEffect(() => {
    setScreen("Invoices");
  }, [setScreen]);

  
  const barConfig: ChartConfig = {
    paid: { label: "Paid", color: "#10b981" },
    pending: { label: "Pending", color: "#fbbf24" },
    overdue: { label: "Overdue", color: "#e7000b" },
  };

  
  const { data: invoiceData, loading: dataLoading } = useFirestoreCollection("financials/invoices/items");
  const { data: projectsData = [] } = useFirestoreCollection<{ status: string; name: string }>(
    "projects"
  );

  
  // Cast the data once and memoize it to prevent unnecessary re-computations
  const typedInvoiceData = useMemo(() => {
    return (invoiceData as unknown as Invoice[]) || [];
  }, [invoiceData]);

  
  // Calculate totals with memoization to prevent recalculations on every render
  const { 
    totalInvoices, 
    totalInvoicesPaidAmount, 
    totalInvoicesPendingAmount, 
    totalInvoicesOverdueAmount 
  } = useMemo(() => {
    const totalInvoices = typedInvoiceData.length;
    const totalInvoicesPaidAmount = typedInvoiceData.reduce(
      (total, invoice) => (invoice.status === "Paid" ? total + invoice.amount : total),
      0
    );
    const totalInvoicesPendingAmount = typedInvoiceData.reduce(
      (total, invoice) => (invoice.status === "Pending" ? total + invoice.amount : total),
      0
    );
    const totalInvoicesOverdueAmount = typedInvoiceData.reduce(
      (total, invoice) => (invoice.status === "Overdue" ? total + invoice.amount : total),
      0
    );
    
    return {
      totalInvoices,
      totalInvoicesPaidAmount,
      totalInvoicesPendingAmount,
      totalInvoicesOverdueAmount
    };
  }, [typedInvoiceData]);

  
  const [statusFilter, setStatusFilter] = useState<"all" | "pending" | "overdue" | "paid">("all");

  
  // Create a memoized filter function to prevent recreation on each render
  const statusFilterFn = useCallback((item: Invoice) => {
    if (statusFilter === "all") return true;
    return item.status.toLowerCase() === statusFilter;
  }, [statusFilter]);

  
  // Memoize the chart data to prevent recalculation on every render
  const chartData = useMemo(() => {
    function groupInvoicesByMonthAndStatus(invoices: Invoice[]) {
      const result: Record<string, { [status: string]: number }> = {};
  
      invoices.forEach((invoice) => {
        const date = new Date(invoice.date);
        const monthKey = format(date, "MMM yyyy"); 
        const statusKey = invoice.status.toLowerCase();
  
        if (!result[monthKey]) result[monthKey] = {};
        if (!result[monthKey][statusKey]) result[monthKey][statusKey] = 0;
  
        result[monthKey][statusKey] += invoice.amount;
      });
  
      return Object.entries(result).map(([month, values]) => ({
        month,
        paid: values.paid || 0,
        pending: values.pending || 0,
        overdue: values.overdue || 0,
      }));
    }

    return groupInvoicesByMonthAndStatus(typedInvoiceData);
  }, [typedInvoiceData]);

  // Handle filter change with debounce to prevent rapid state changes
  const handleFilterChange = useCallback((newFilter: "all" | "pending" | "overdue" | "paid") => {
    setStatusFilter(newFilter);
  }, []);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold">Invoices & Payments</h1>
          <p className="text-sm text-muted-foreground mb-4">
            Monitor and manage invoices and payments across all active and completed projects.
          </p>
        </div>
        <DialogComponent
          title="Create a new Invoice"
          description="Add invoice details"
          trigger="Create a new Invoice"
          button
        >
          {(onClose) => <InvoiceForm projectsData={projectsData} onClose={onClose} />}
        </DialogComponent>
      </div>

      {(dataLoading) ? (
        <div className="text-center text-muted-foreground">Loading Invoices...</div>
      ) : (
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <CardComponent
              title="Total Invoices"
              description="Sum of all invoices issued across all projects."
              action="View All"
              full
              variant="default"
              active={statusFilter === "all"}
              onActionClick={() => handleFilterChange("all")}
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
              action="Filter Paid"
              full
              variant="green"
              active={statusFilter === "paid"}
              onActionClick={() => handleFilterChange("paid")}
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
              action="Filter Pending"
              full
              variant="yellow"
              active={statusFilter === "pending"}
              onActionClick={() => handleFilterChange("pending")}
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
              action="Filter Overdue"
              full
              variant="red"
              active={statusFilter === "overdue"}
              onActionClick={() => handleFilterChange("overdue")}
            >
              <div className="flex items-center gap-4">
                <AlertTriangle size={28} className="text-red-800" />
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
              data={chartData}
              config={barConfig}
              title="Invoices and Payments by Month"
              xKey="month"
              yKeys={["paid", "pending", "overdue"]}
            />
            <div>
              <h2 className="text-xl font-bold mb-2">Main Invoices</h2>
              <DataTable<Invoice>
                data={typedInvoiceData}
                columns={invoiceColumns}
                filterPlaceholder="Filter Project..."
                filterColumn="project"
                externalFilter={statusFilterFn}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}