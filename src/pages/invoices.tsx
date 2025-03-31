import { ReusableChart } from '@/components/ReusableChart';
import CardComponent from '../components/CardComponent';
import { FileText, DollarSign, Clock, AlertTriangle } from 'lucide-react';
import { DataTable } from '@/components/DataTable';
import { invoiceColumns } from '@/components/columns_financials';
import { useFirestoreCollection } from '@/hooks/useFirestoreCollection';
import { useState } from 'react';

export function Invoices() {  
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

  const { data: barData, loading: barLoading} = useFirestoreCollection("financials/invoiceChart/items");
  const { data: invoiceData, loading: dataLoading} = useFirestoreCollection("financials/invoices/items");

  type Invoice = {
    project: string;
    amount: number;
    status: "Paid" | "Pending" | "Overdue";
    date: string;
  };
  
  const typedInvoiceData = (invoiceData as unknown as Invoice[]) || [];
  
  const totalInvoices = typedInvoiceData.length;
  
  const totalInvoicesPaidAmount = typedInvoiceData.reduce((total, invoice) => {
    return invoice.status === "Paid" ? total + invoice.amount : total;
  }, 0);
  
  const totalInvoicesPendingAmount = typedInvoiceData.reduce((total, invoice) => {
    return invoice.status === "Pending" ? total + invoice.amount : total;
  }, 0);
  
  const totalInvoicesOverdueAmount = typedInvoiceData.reduce((total, invoice) => {
    return invoice.status === "Overdue" ? total + invoice.amount : total;
  }, 0);
  
  const invoiceDataTable: Invoice[] = typedInvoiceData;

  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'overdue' | 'paid'>('all');

    const statusFilterFn = (item: Invoice) => {
      if (statusFilter === 'all') return true;
      return item.status.toLowerCase() === statusFilter;
    };
  return (
    <>
    <div>
      <h1 className="text-xl font-bold">Invoices & Payments</h1>
      <p className="text-sm text-muted-foreground mb-4">
        Monitor and manage invoices and payments across all active and completed projects.
      </p>
    </div>
      {dataLoading && barLoading ? (
        <div className="text-center text-muted-foreground">Loading Invoices...</div>
      ) : (
        <div className="flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <CardComponent
            title="Total Invoices"
            description="Sum of all invoices issued across all projects."
            action="View All"
            full
            variant='default'
            active={statusFilter === 'all'}
            onActionClick={() => setStatusFilter('all')}
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
            variant='default'
            active={statusFilter === 'paid'}
            onActionClick={() => setStatusFilter('paid')}
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
            title="Filter Pending"
            description="Invoices not yet paid or past due."
            action="Review Now"
            full
            variant='default'
            active={statusFilter === 'pending'}
            onActionClick={() => setStatusFilter('pending')}
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
            variant='default'
            active={statusFilter === 'overdue'}
            onActionClick={() => setStatusFilter('overdue')}
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
              externalFilter={statusFilterFn}
            />
          </div>
        </div>
      </div>
      )}
    </>
  );
}
