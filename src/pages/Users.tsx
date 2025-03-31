import { columns } from "@/components/columns_users";
import { DataTable } from "@/components/DataTable";
import { Button } from "@/components/ui/button";
import { useFirestoreCollection } from "@/hooks/useFirestoreCollection";

export function Users() {
  const {data: users, loading: loadingUsers} = useFirestoreCollection("users")
  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between items-center ">
        <div>
        <h1 className="text-xl font-bold">User Management</h1>
        <p className="text-sm text-muted-foreground mb-4">Manage system users, assign roles, and control access permissions to ensure secure and efficient collaboration.</p>
        </div>
        <div>
          <Button>Add a New User</Button>
        </div>
      </div>
      <DataTable data={users} columns={columns} filterColumn="name" filterPlaceholder="Search by Name..."></DataTable>
    </div>
  );
}
