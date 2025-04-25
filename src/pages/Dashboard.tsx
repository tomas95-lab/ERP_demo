import { useState, useEffect } from "react";
import { DocumentData } from "firebase/firestore";
import { ColumnDef } from "@tanstack/react-table";
import CardComponent from "@/components/CardComponent";
import { DataTable } from "@/components/DataTable";
import { columns } from "@/components/columns";
import { ReusableChart } from "@/components/ReusableChart";
import { Badge } from "@/components/ui/badge";
import { Receipt, FileText, Plus } from "lucide-react";
import { useFirestoreCollection } from "@/hooks/useFirestoreCollection";
import CreateProjectForm from "@/components/createProjectForm";
import { useScreen } from "@/components/ScreenContext";
import CreateExpenseForm from "@/components/createExpenseForm";
import { InvoiceForm } from "@/components/InvoiceForm";
import { Notifications } from "@/components/Notifications";
import { updateProjectsWithPendingTasks } from "@/utils/projectUtils";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

interface ChartConfig {
  [key: string]: {
    label: string;
    color: string;
  };
}

export default function Dashboard() {
  const { setScreen } = useScreen();

  useEffect(() => {
    setScreen("Dashboard");
  }, [setScreen]);

  const barConfig: ChartConfig = {
    materials: { label: "Materials", color: "#2563eb" },
    labor: { label: "Labor", color: "#60a5fa" },
  };

  const { data: costData, loading: costLoading } = useFirestoreCollection("costs");
  const { data: barData, loading: barLoading } = useFirestoreCollection("yearChart");
  const { data: projects = [], loading: projectsLoading } = useFirestoreCollection<{
    status: string;
    firestoreId: string;
    pendingTasksCount: number;
  }>("projects");

  const [formLoading, setFormLoading] = useState(false);
  const [formKey, setFormKey] = useState(0);

  const handleProjectCreated = () => {
    setFormKey((key) => key + 1);
  };

  useEffect(() => {
    const updatePending = async () => {
      if (projects.some((p) => p.pendingTasksCount === undefined)) {
        await updateProjectsWithPendingTasks();
      }
    };
    if (!projectsLoading && projects.length > 0) {
      updatePending();
    }
  }, [projects, projectsLoading]);

  const totalProjects = projects.length;
  const completedProjects = projects.filter((p) => p.status === "Completed").length;
  // const pendingTasks = projects.reduce((sum, p) => sum + (p.pendingTasksCount || 0), 0);

  const loading = costLoading || barLoading || projectsLoading;

  return (
    <div className="flex flex-col gap-6 p-4">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold">Welcome to Your Dashboard</h1>
        <p className="text-muted-foreground">
          Manage your projects, expenses and progress from one place.
        </p>
      </div>

      {loading ? (
        <Spinner />
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-3 gap-4">
            <CardComponent title="Total Projects" description="All projects in the system." action="View All" path="/projects/all" full>
              <div className="flex items-center justify-center gap-4">
                <span className="text-4xl font-bold">{totalProjects}</span>
              </div>
            </CardComponent>

            <CardComponent title="Active Projects" description="Currently ongoing projects." action="View Active" path="/projects/all?status=active" full>
              <div className="flex flex-col items-center justify-center gap-2">
                <span className="text-4xl font-bold">
                  {projects.filter((p) => p.status === "Active").length}
                </span>
                <Badge className="bg-blue-600">In Progress</Badge>
              </div>
            </CardComponent>

            <CardComponent title="Completed Projects" description="Successfully finished projects." action="View Completed" path="/projects/all?status=completed" full>
              <div className="flex flex-col items-center justify-center gap-2">
                <span className="text-4xl font-bold text-green-600">{completedProjects}</span>
                <Badge className="bg-green-600">Completed</Badge>
              </div>
            </CardComponent>

            {/* <CardComponent title="Pending Tasks" description="Tasks awaiting completion across all projects." action="View Tasks" path="/projects/tasks" full>
              <div className="flex flex-col items-center justify-center gap-2">
                <span className="text-4xl font-bold text-yellow-600">{pendingTasks}</span>
                <Badge className="bg-yellow-600">Pending</Badge>
              </div>
            </CardComponent> */}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2">
              <ReusableChart
                type="bar"
                data={barData}
                config={barConfig}
                title="Monthly Project Costs"
                xKey="month"
                yKeys={["materials", "labor"]}
                description="Detailed visualization of monthly project expenses for materials and labor."
              />
            </div>
            <CardComponent title="Quick Actions" description="Create new items quickly" full action="false">              
              <div className="flex flex-col justify-between  p-4 space-y-4">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="w-full h-[100px] justify-start gap-3 p-4 hover:bg-blue-50">
                      <div className="bg-blue-100 p-2 rounded-lg">
                        <Plus className="h-5 w-5 text-blue-600" />
                      </div>
                      <span className="font-medium">New Project</span>
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                      <DialogTitle>Create New Project</DialogTitle>
                      <DialogDescription>Fill in the project details below</DialogDescription>
                    </DialogHeader>
                    <CreateProjectForm
                      card
                      onSuccess={() => {
                        handleProjectCreated();
                        document.getElementById("close-dialog")?.click();
                      }}
                      setFormLoading={setFormLoading}
                      formLoading={formLoading}
                      key={formKey}
                    />
                  </DialogContent>
                </Dialog>

                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="w-full h-[100px] justify-start gap-3 px-4 hover:bg-green-50">
                      <div className="bg-green-100 p-2 rounded-lg">
                        <Receipt className="h-5 w-5 text-green-600" />
                      </div>
                      <span className="font-medium">New Expense</span>
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                      <DialogTitle>Create New Expense</DialogTitle>
                      <DialogDescription>Add expense details</DialogDescription>
                    </DialogHeader>
                    <CreateExpenseForm onClose={() => document.getElementById("close-dialog")?.click()} />
                  </DialogContent>
                </Dialog>

                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="w-full h-[100px] justify-start gap-3 px-4 hover:bg-yellow-50">
                      <div className="bg-yellow-100 p-2 rounded-lg">
                        <FileText className="h-5 w-5 text-yellow-600" />
                      </div>
                      <span className="font-medium">New Invoice</span>
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                      <DialogTitle>Create New Invoice</DialogTitle>
                      <DialogDescription>Add invoice details</DialogDescription>
                    </DialogHeader>
                    <InvoiceForm
                      projectsData={projects}
                      onClose={() => document.getElementById("close-dialog")?.click()}
                    />
                  </DialogContent>
                </Dialog>
              </div>
            </CardComponent>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2">
              <div className="rounded-xl bg-white shadow p-4">
                <h2 className="text-xl font-bold mb-3">Cost Details</h2>
                <DataTable
                  data={costData}
                  columns={columns as ColumnDef<DocumentData & { firestoreId?: string }>[]
                  }
                  filterPlaceholder="Filter by provider..."
                  filterColumn="provider"
                />
              </div>
            </div>
            <div>
              <div className="rounded-xl bg-white shadow p-4">
                <h2 className="text-xl font-bold mb-3">Notifications</h2>
                <Notifications />
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
