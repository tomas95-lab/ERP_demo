import { columns } from "@/components/columns_users";
import { CreateUserForm } from "@/components/CreateUser";
import { DataTable } from "@/components/DataTable";
import { DialogComponent } from "@/components/DialogComponent";
import { Button } from "@/components/ui/button";
import { useFirestoreCollection } from "@/hooks/useFirestoreCollection";
import { toast } from "sonner";

export function Users() {
  const { data: users, loading: loadingUsers } = useFirestoreCollection("users");

  const showToast = (userName: string) => {
    toast.success("User Created", {
      description: `${userName} has been added successfully.`,
    });
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between items-center ">
        <div>
          <h1 className="text-xl font-bold">User Management</h1>
          <p className="text-sm text-muted-foreground mb-4">
            Manage system users, assign roles, and control access permissions to ensure secure and efficient collaboration.
          </p>
        </div>
        {loadingUsers ? (
                  <div>
                  <DialogComponent
                    trigger={<Button>Create User</Button>}
                    title="Create User"
                    description="Add a new user to the system."
                    button={true}
                  >
                    {(onClose) => <CreateUserForm onClose={onClose} onSuccess={showToast} />}
                  </DialogComponent>
                </div>
        ): (
          <div className="text-center text-muted-foreground">Loading Users...</div>
        )}
      </div>

      <DataTable
        data={users}
        columns={columns as any}
        filterColumn="name"
        filterPlaceholder="Search by Name..."
      />
    </div>
  );
}
