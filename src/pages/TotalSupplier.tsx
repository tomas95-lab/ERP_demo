import { useState, useMemo, useEffect } from "react";
import { useFirestoreCollection } from "@/hooks/useFirestoreCollection";
import { useSearchParams } from "react-router-dom";
import { DataTable } from "@/components/DataTable";
import { columns, SupplierData } from "@/components/columns_supplierTotal";
import { Button } from "@/components/ui/button";
import { useScreen } from "@/components/ScreenContext";
import { ColumnDef } from "@tanstack/react-table";

export function TotalSupplier() {
  const { setScreen } = useScreen();

  useEffect(() => {
    setScreen("Suppliers");
  }, [setScreen]);

  const [searchParams] = useSearchParams();
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");

  const urlFilter = useMemo(() => {
    return searchParams.get("filter")?.toLowerCase() || "";
  }, [searchParams]);

  const { data: suppliersData = [], loading: loadingSuppliers } = useFirestoreCollection<SupplierData>("suppliers");

  const filteredData = useMemo(() => {
    if (loadingSuppliers) return [];
    return suppliersData.filter((supplier) => {
      const matchesStatus = statusFilter === "all" || supplier.status?.toLowerCase() === statusFilter;
      const matchesURL = !urlFilter || supplier.status?.toLowerCase() === urlFilter;
      return matchesStatus && matchesURL;
    });
  }, [suppliersData, statusFilter, urlFilter, loadingSuppliers]);

  return (
    <div className="flex flex-col gap-2">
      <h1 className="text-xl font-bold">
        {urlFilter ? `${urlFilter.charAt(0).toUpperCase() + urlFilter.slice(1)} Suppliers` : "All Suppliers"}
      </h1>
      <p className="text-sm text-muted-foreground mb-4">
        Get a detailed view of your suppliers, filter them by status, and analyze their latest activity and contribution to ongoing projects.
      </p>

      {!urlFilter && (
        <div className="flex gap-2 mb-2">
          <Button variant={statusFilter === "all" ? "default" : "outline"} onClick={() => setStatusFilter("all")}>
            All
          </Button>
          <Button variant={statusFilter === "active" ? "default" : "outline"} onClick={() => setStatusFilter("active")}>
            Active
          </Button>
          <Button variant={statusFilter === "inactive" ? "default" : "outline"} onClick={() => setStatusFilter("inactive")}>
            Inactive
          </Button>
        </div>
      )}

      {loadingSuppliers ? (
        <div className="text-center text-muted-foreground">Loading suppliers...</div>
      ) : (
        <DataTable
          columns={columns as ColumnDef<SupplierData>[]}
          data={filteredData}
          filterPlaceholder="Search by name..."
          filterColumn="name"
        />
      )}
    </div>
  );
}
