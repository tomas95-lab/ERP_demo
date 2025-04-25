import { columns } from "@/components/columns_users";
import { CreateUserForm } from "@/components/CreateUser";
import { DataTable } from "@/components/DataTable";
import { DialogComponent } from "@/components/DialogComponent";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
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

    <div>
      <div className="flex flex-col gap-2 p-4">
        <div className="flex justify-between items-center">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold">Users</h1>
            <p className="text-sm text-muted-foreground">Manage your users here.</p>
          </div>
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
        </div>
        {loadingUsers ? (
          <Spinner />
        ) : (
          <DataTable
            data={users}
            columns={columns as any}
            filterColumn="name"
            filterPlaceholder="Search by Name..."
          />
        )}
      </div>
    </div>
  );
}
