import CardComponent from "@/components/CardComponent";
import { CheckCircle, RefreshCcw, Users } from "lucide-react";
import React from "react";
import logo from "../../public/avatars/300-18.jpg";
import delivery from "../../public/easy/5.svg";
import { useFirestoreCollection } from "@/hooks/useFirestoreCollection";

import { ReusableChart } from "@/components/ReusableChart";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function Suppliers() {
  const { data: chartData, loading } = useFirestoreCollection<{ status: string; active: boolean; value: number; name: string }>("suppliers/chartSupplier/items");

  const totalSuppliers = chartData.length;

  const activeSuppliers = chartData.reduce((total, supplier) => {
    return supplier.active ? total + 1 : total;
  }, 0);

  const onboardedSuppliers = chartData.reduce((total, supplier) => {
    return !supplier.active ? total + 1 : total;
  }, 0);

  const topSupplier = chartData.reduce((top, supplier) => {
    return supplier.value > top.value ? supplier : top;
  }, chartData[0]);

  const chartConfig = {
    SteelCoLtd: { label: "SteelCo Ltd.", color: "#3b82f6" },
    WorkerUnion: { label: "WorkerUnion", color: "#10b981" },
    MachineryPro: { label: "MachineryPro", color: "#6366f1" },
    TransportMax: { label: "TransportMax", color: "#f59e0b" },
    CityGov: { label: "CityGov", color: "#ef4444" },
  } satisfies Record<string, { label: string; color?: string }>;

  const totalOrders = React.useMemo(() => {
    return chartData.reduce((acc: number, curr: { value: number }) => acc + curr.value, 0);
  }, [chartData]);

  return (
    <div>
      <h1 className="text-xl font-bold">All Suppliers</h1>
      <p className="text-sm text-muted-foreground mb-4">
        Manage and track all suppliers involved in your construction projects, including their status, activity, and contributions.
      </p>
      {loading ? (
        <div className="text-center text-muted-foreground">Loading Suppliers...</div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <CardComponent
              title="Total Suppliers"
              description="Current number of suppliers registered in the system."
              action="View All"
              full
            >
              <div className="flex flex-col items-center justify-center space-y-2">
                <Users size={28} className="text-blue-600" />
                <span className="text-2xl font-bold">{totalSuppliers}</span>
              </div>
            </CardComponent>
            <CardComponent
              title="Active Suppliers"
              description="Suppliers actively fulfilling orders or services."
              action="View Active"
              full
            >
              <div className="flex flex-col items-center justify-center space-y-2">
                <CheckCircle size={28} className="text-green-600" />
                <span className="text-2xl font-bold">{activeSuppliers}</span>
              </div>
            </CardComponent>
            <CardComponent
              title="Onboarding"
              description="Suppliers undergoing verification or onboarding."
              action="View All"
              full
            >
              <div className="flex flex-col items-center justify-center space-y-2">
                <RefreshCcw size={28} className="text-gray-600" />
                <span className="text-2xl font-bold">{onboardedSuppliers}</span>
              </div>
            </CardComponent>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <CardComponent
              title="Supplier Spotlight"
              description="Top-performing supplier this month."
              action="View Supplier"
              full
            >
              <div className="flex items-center gap-4">
                <img src={logo} className="w-20 h-20 rounded-full" />
                <div>
                  <div className="font-semibold text-foreground">{topSupplier.name}</div>
                  <div className="text-sm text-muted-foreground">Avg. Delivery: 3.8 days</div>
                  <div className="text-sm text-muted-foreground">Orders this month: 12</div>
                </div>
              </div>
            </CardComponent>
            <ReusableChart
              data={chartData}
              config={chartConfig}
              type="pie"
              title="Supplier Order Distribution"
              total={totalOrders}
              TotalDescriptionPie="Total Orders"
            ></ReusableChart>

            <Card>
              <CardHeader>
                <CardTitle className="text-center">
                  Add New Supplier
                  <br />
                  <span className="font-bold">Register a new supplier to the system.</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <picture className="flex justify-center m-0 p-0">
                  <img src={delivery} />
                </picture>
              </CardContent>
              <CardFooter className="w-full">
                <Button className="w-full h-[40px]">Register Supplier</Button>
              </CardFooter>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}
