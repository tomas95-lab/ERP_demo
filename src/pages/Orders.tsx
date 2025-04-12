import CardComponent from "@/components/CardComponent"
import { DollarSign, LineChart, RotateCcw, CheckCheck } from "lucide-react"
import { format } from "date-fns"
import { ReusableChart } from "@/components/ReusableChart"
import { columns } from "@/components/columns_orders"
import { DataTable } from "@/components/DataTable"
import { useFirestoreCollection } from "@/hooks/useFirestoreCollection"
import { DialogComponent } from "@/components/DialogComponent"
import { CreateOrderForm } from "@/components/CreateOrder"
import { useScreen } from "@/components/ScreenContext"
import { useEffect } from "react"
import { ColumnDef } from "@tanstack/react-table"
import { DocumentData } from "firebase/firestore"

export function Orders() {
  const { data: purchaseOrders = [], loading: loadingPurchase } = useFirestoreCollection("orders/purchaseOrders/items")
  const { setScreen } = useScreen();
   
  useEffect(() => {
  setScreen("Expenses");
  }, []);
  const loading = loadingPurchase 

  const monthlyTotals = purchaseOrders.reduce((acc: Record<string, number>, order: any) => {
    const month = format(new Date(order.date), "MMM")
    acc[month] = (acc[month] || 0) + (order.total || 0)
    return acc
  }, {})

  const totalOrdersChartData = Object.entries(monthlyTotals).map(([month, total]) => ({
    month,
    total,
  }))

  const returnsData = purchaseOrders
  .filter(order => order.status === "Cancelled")
  .reduce((acc: Record<string, number>, order) => {
    const month = format(new Date(order.date), "MMM")
    acc[month] = (acc[month] || 0) + 1
    return acc
  }, {})

  const returnsChartData = Object.entries(returnsData).map(([month, items]) => ({
    month,
    items,
  }))


  const fulfilledData = purchaseOrders
  .filter(order => order.status === "Completed")
  .reduce((acc: Record<string, number>, order) => {
    const month = format(new Date(order.date), "MMM")
    acc[month] = (acc[month] || 0) + 1
    return acc
  }, {})

  const fulfilledChartData = Object.entries(fulfilledData).map(([month, fulfilled]) => ({
    month,
    fulfilled,
  }))

  const orderItemsData = purchaseOrders.reduce((acc: Record<string, number>, order: any) => {
    const month = format(new Date(order.date), "MMM");
    acc[month] = (acc[month] || 0) + 1;
    return acc;
  }, {});
  
  const orderItemsChartData = Object.entries(orderItemsData).map(([month, items]) => ({
    month,
    items,
  }));
  
  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between flex-wrap items-center">
        <div>
          <h1 className="text-xl font-bold">Orders</h1>
          <p className="text-sm text-muted-foreground">
            View and manage all purchase orders issued to suppliers, including their status, delivery progress, and fulfillment details.
          </p>
        </div>
        <DialogComponent
          trigger="Create a new Order"
          button
          title="Create a new Order"
          description="Fill in the details of the new order to be created."
        >
          {(onClose) => (
            <CreateOrderForm onClose={onClose} />
          )}
        </DialogComponent>
      </div>

      {loading ? (
        <div className="text-center text-muted-foreground">Loading Orders...</div>
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <CardComponent
              title="Monthly Purchase Volume"
              description="Total amount spent on purchase orders, broken down by month."
              action="false"
              full
            >
              <div className="flex space-x-2 justify-center items-center">
                <DollarSign size={28} className="text-blue-600" />
                <span className="text-2xl font-bold">
                  {new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "USD",
                  }).format(totalOrdersChartData.reduce((acc, curr) => acc + curr.total, 0))}
                </span>
              </div>
              <ReusableChart
                mini
                data={totalOrdersChartData}
                config={{ orders: { label: "Total Spent", color: "#3b82f6" } }}
                card={false}
                dataKey="month"
                dataKeyLine="total"
                type="mini"
                color="#3b82f6"
              />
            </CardComponent>

            <CardComponent
              title="Order Items Over Time"
              description="Track the volume of items ordered across recent periods."
              action="false"
              full
            >
              <div className="flex space-x-2 justify-center items-center">
                <LineChart size={28} className="text-green-600" />
                <span className="text-2xl font-bold">{purchaseOrders.length}</span>
              </div>
              <ReusableChart
                mini
                data={orderItemsChartData}
                config={{ items: { label: "Items", color: "#10b981" } }}
                card={false}
                dataKey="month"
                dataKeyLine="items"
                type="mini"
                color="#10b981"
              />
            </CardComponent>

            <CardComponent
              title="Returns Over Time"
              description="Cancelled purchase orders grouped by month."
              action="false"
              full
            >
              <div className="flex space-x-2 justify-center items-center">
                <RotateCcw size={28} className="text-yellow-600" />
                <span className="text-2xl font-bold">{purchaseOrders.filter((order) => order.status === "Cancelled").length}</span>
              </div>
              <ReusableChart
                mini
                data={returnsChartData}
                config={{ returns: { label: "Returns", color: "#fbbf24" } }}
                card={false}
                dataKey="month"
                dataKeyLine="items"
                type="mini"
                color="#fbbf24"
              />
            </CardComponent>

            <CardComponent
              title="Fulfilled Orders Over Time"
              description="Completed purchase orders grouped by month."
              action="false"
              full
            >
              <div className="flex space-x-2 justify-center items-center">
                <CheckCheck size={28} className="text-emerald-600" />
                <span className="text-2xl font-bold">{purchaseOrders.filter((order) => order.status === "Completed").length}</span>
              </div>
              <ReusableChart
                mini
                data={fulfilledChartData}
                config={{ fulfilled: { label: "Fulfilled", color: "#34d399" } }}
                card={false}
                dataKey="month"
                dataKeyLine="fulfilled"
                type="mini"
                color="#34d399"
              />
            </CardComponent>
          </div>

          <div className="mt-6">
            <DataTable
              data={purchaseOrders}
              columns={columns as ColumnDef<DocumentData & { firestoreId?: string }>[]}
              filterPlaceholder="Filter by Supplier"
              filterColumn="supplier"
            />
          </div>
        </>
      )}
    </div>
  )
}
