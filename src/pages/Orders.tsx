import CardComponent from "@/components/CardComponent";
import { Package, LineChart, RotateCcw, CheckCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ReusableChart } from "@/components/ReusableChart";
import { columns } from "@/components/columns_orders";
import { DataTable } from "@/components/DataTable";
import { useFirestoreCollection } from "@/hooks/useFirestoreCollection";



export function Orders() {
  const { data: purchaseOrders, loading: purchaseOrdersLoading } = useFirestoreCollection("orders/purchaseOrders/items");
  const { data: totalOrdersData, loading: totalOrdersLoading } = useFirestoreCollection("orders/totalOrders/items");
  const { data: itemsOverTimeData, loading: itemsOverTimeDataLoading } = useFirestoreCollection("orders/itemsOverTime/items");
  const { data: returnsData, loading: returnsDataLoading } = useFirestoreCollection("orders/returns/items");
  const { data: fulfilledData, loading: fulfilledDataLoading } = useFirestoreCollection("orders/fulfilled/items");

  const totalOrdersConfig = {
    orders: { label: "Orders", color: "#3b82f6" },
  };
  
  const itemsOverTimeConfig = {
    items: { label: "Items", color: "#10b981" },
  };
  
  
  const returnsConfig = {
    returns: { label: "Returns", color: "#fbbf24" },
  };
  
  const fulfilledConfig = {
    fulfilled: { label: "Fulfilled", color: "#34d399" },
  };

  return (
    <div className="flex flex-col gap-2">
    <div className="flex justify-between flex-wrap items-center">
        <div>
          <h1 className="text-xl font-bold">Orders</h1>
          <p className="text-sm text-muted-foreground mb-4">
            View and manage all purchase orders issued to suppliers, including their status, delivery progress, and fulfillment details.
          </p>
        </div>
        <Button>Create Order</Button>
    </div>
    {totalOrdersLoading && itemsOverTimeDataLoading && purchaseOrdersLoading && returnsDataLoading && fulfilledDataLoading ? (
              <div className="text-center text-muted-foreground">Loading Orders...</div>

    ):(
      <div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <CardComponent
        title="Total Orders"
        description="Total number of purchase orders issued to suppliers."
        action="View All"
        full
        >
        <div className="flex space-x-2 justify-center items-center">
          <Package size={28} className="text-blue-600" />
          <span className="text-2xl font-bold">{totalOrdersData.length}</span>
        </div>
        <ReusableChart mini data={totalOrdersData} config={totalOrdersConfig} card={false} dataKey="month" dataKeyLine="orders" type="mini" color="#3b82f6" />
      </CardComponent>

      <CardComponent
        title="Order Items Over Time"
        description="Track the volume of items ordered across recent periods."
        action="View Items"
        full
      >
        <div className="flex space-x-2 justify-center items-center">
          <LineChart size={28} className="text-green-600" />
          <span className="text-2xl font-bold">{itemsOverTimeData.length}</span>
        </div>
          <ReusableChart mini data={itemsOverTimeData} config={itemsOverTimeConfig} card={false} dataKey="month" dataKeyLine="items" type="mini" color="#10b981" />
        </CardComponent>

        <CardComponent
          title="Returns Orders"
          description="Number of purchase orders that were returned or canceled."
          action="See Returns"
          full
        >
          <div className="flex space-x-2 justify-center items-center">
            <RotateCcw size={28} className="text-yellow-600" />
            <span className="text-2xl font-bold">{returnsData.length}</span>
          </div>
          <ReusableChart mini data={returnsData} config={returnsConfig} card={false} dataKey="month" dataKeyLine="returns" type="mini" color="#fbbf24" />
        </CardComponent>

        <CardComponent
          title="Fulfilled Orders Over Time"
          description="Orders successfully completed and delivered to site."
          action="Track Orders"
          full
        >
          <div className="flex space-x-2 justify-center items-center">
            <CheckCheck size={28} className="text-emerald-600" />
            <span className="text-2xl font-bold">{fulfilledData.length}</span>
          </div>
          <ReusableChart mini data={fulfilledData} config={fulfilledConfig} card={false} dataKey="month" type="mini" dataKeyLine="fulfilled" color="#34d399" />
        </CardComponent>
      </div>
      <DataTable data={purchaseOrders} columns={columns} filterPlaceholder="Filter by Supplier" filterColumn="supplier" ></DataTable>
    </div>
    )}
    </div>

  );
}
