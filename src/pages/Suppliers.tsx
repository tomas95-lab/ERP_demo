import CardComponent from "@/components/CardComponent"
import { CheckCircle, RefreshCcw, Users } from "lucide-react"
import { useEffect } from "react"
import logo from "../../public/avatars/300-18.jpg"
import delivery from "../../public/easy/5.svg"
import { useFirestoreCollection } from "@/hooks/useFirestoreCollection"
import { ReusableChart } from "@/components/ReusableChart"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { DialogComponent } from "@/components/DialogComponent"
import CreateSupplier from "@/components/createSupplierForm"
import { Spinner } from "@/components/ui/spinner"

import { format } from "date-fns"
import { useScreen } from "@/components/ScreenContext"

export function Suppliers() {
  const { setScreen } = useScreen();
   
  useEffect(() => {
  setScreen("Suppliers");
  }, []);

  const monthColors: Record<string, string> = {
    Jan: "#3b82f6",
    Feb: "#10b981",
    Mar: "#f59e0b",
    Apr: "#8b5cf6",
    May: "#ec4899",
    Jun: "#f87171",
    Jul: "#14b8a6",
    Aug: "#eab308",
    Sep: "#0ea5e9",
    Oct: "#6366f1",
    Nov: "#22c55e",
    Dec: "#f43f5e",
  };
  
  const { data: purchaseOrders = [] } = useFirestoreCollection("orders/purchaseOrders/items")
  console.log(purchaseOrders)
  const { data: suppliersData = [], loading: loadingSuppliers } = useFirestoreCollection<{ name: string; value: number; status: string }>("suppliers")

  const loading =  loadingSuppliers 

  const totalSuppliers = suppliersData.length
  const activeSuppliers = suppliersData.filter(s => s.status === "Active").length
  const onboardedSuppliers = suppliersData.filter(s => s.status !== "Active").length

  const topSupplier = suppliersData.length
    ? suppliersData.reduce((top, supplier) => supplier.value > top.value ? supplier : top, suppliersData[0])
    : { name: "N/A", value: 0 }

  const chartConfig = {} satisfies Record<string, { label: string; color?: string }>

  const ordersByMonth = purchaseOrders.reduce((acc: Record<string, number>, order: any) => {
    const month = format(new Date(order.date), "MMM")
    acc[month] = (acc[month] || 0) + 1
    return acc
  }, {})
  
  const chartOrdersData = Object.entries(ordersByMonth).map(([month, orders]) => ({
    month,
    orders,
    fill: monthColors[month] || "#ccc",
  }))
  
  return (
    <div className="flex flex-col gap-2 p-4">
      <h1 className="text-2xl font-bold">Supplier Overview</h1>
      <p className="text-muted-foreground">
        Get a quick overview of all registered suppliers, their current status, recent activity, and performance trends.
      </p>

      {loading ? (
        <Spinner />
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <CardComponent title="Total Suppliers" description="Number of suppliers currently registered in the platform." action="View All" full path="/suppliers/all/table">
              <div className="flex flex-col items-center justify-center space-y-2">
                <Users size={28} className="text-blue-600" />
                <span className="text-2xl font-bold">{totalSuppliers}</span>
              </div>
            </CardComponent>

            <CardComponent title="Active Suppliers" description="Suppliers currently fulfilling active projects or orders." path="/suppliers/all/table?filter=active" action="View Active" full>
              <div className="flex flex-col items-center justify-center space-y-2">
                <CheckCircle size={28} className="text-green-600" />
                <span className="text-2xl font-bold">{activeSuppliers}</span>
              </div>
            </CardComponent>

            <CardComponent title="Onboarding Suppliers" description="Suppliers in the process of verification or onboarding." action="View Inactive" path="/suppliers/all/table?filter=inactive" full>
              <div className="flex flex-col items-center justify-center space-y-2">
                <RefreshCcw size={28} className="text-gray-600" />
                <span className="text-2xl font-bold">{onboardedSuppliers}</span>
              </div>
            </CardComponent>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-6">
              <CardComponent title="Top Supplier" description="Best performing supplier based on recent orders." action="false" full>
              <div className="flex items-center gap-4 justify-center">
            {topSupplier.name !== "N/A" ? (
                <>
                  <img src={logo} className="w-20 h-20 rounded-full" />
                  <div>
                    <div className="font-semibold text-foreground">{topSupplier.name}</div>
                    <div className="text-sm text-muted-foreground">Avg. Delivery: 3.8 days</div>
                    <div className="text-sm text-muted-foreground">Orders this month: 12</div>
                  </div>
                </>
              ) : <h1 className="text-center text-muted-foreground">No suppliers available</h1>}
                </div>
              </CardComponent>
              

            <ReusableChart
              data={chartOrdersData}
              config={chartConfig}
              type="pie"
              dataKey="orders"
              xKey="month"
              title="Monthly Order Distribution"
              total={purchaseOrders.length}
              TotalDescriptionPie="Total Orders"
            />

            <Card>
              <CardHeader>
                <CardTitle className="text-center">
                  New Supplier Registration
                  <br />
                  <span className="font-bold">Add a new supplier to the database.</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <picture className="flex justify-center m-0 p-0">
                  <img src={delivery} />
                </picture>
              </CardContent>
              <CardFooter className="w-auto">
                <DialogComponent
                  title="Register a New Supplier"
                  button
                  description="Fill in the details below to register a new supplier."
                  full
                  height="40px"
                  trigger="Register Supplier"
                >
                  {(onClose) => (
                    <CreateSupplier onClose={onClose} />
                  )}
                </DialogComponent>
              </CardFooter>
            </Card>
          </div>
        </>
      )}
    </div>
  )
}
