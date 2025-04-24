import { useState, useEffect } from "react";
import { DocumentData } from "firebase/firestore";
import { ColumnDef } from "@tanstack/react-table";
import CardComponent from "@/components/CardComponent";
import { DataTable } from "@/components/DataTable";
import { columns } from "@/components/columns";
import { ReusableChart } from "@/components/ReusableChart";
import { Badge } from "@/components/ui/badge";
import { Briefcase } from "lucide-react";
import { useFirestoreCollection } from "@/hooks/useFirestoreCollection";
import CreateProjectForm from "@/components/createProjectForm";
import { useScreen } from "@/components/ScreenContext";
import { Button } from "@/components/ui/button";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { DialogComponent } from "@/components/DialogComponent";
import CreateExpenseForm from "@/components/createExpenseForm";
import { InvoiceForm } from "@/components/InvoiceForm";
import { Notifications } from "@/components/Notifications";

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
  }, []);

  const barConfig: ChartConfig = {
    materials: { label: "Materials", color: "#2563eb" },
    labor: { label: "Labor", color: "#60a5fa" },
  };

  const { data: costData } = useFirestoreCollection("costs");
  const { data: barData } = useFirestoreCollection("yearChart");
  const { data: projects } = useFirestoreCollection<{ status: string, firestoreId: string }>("projects");
  const { data: notifications } = useFirestoreCollection("notifications");
  const { data: recentActivities } = useFirestoreCollection("activities");

  const [allTasks, setAllTasks] = useState<DocumentData[]>([]);

  const fetchAllTasks = async () => {
    const db = getFirestore();
    const tasks: DocumentData[] = [];

    for (const project of projects) {
      const tasksCollection = collection(db, `projects/${project.firestoreId}/tasks`);
      const tasksSnapshot = await getDocs(tasksCollection);
      tasks.push(...tasksSnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    }

    setAllTasks(tasks);
  };

  useEffect(() => {
    if (projects.length > 0) {
      fetchAllTasks();
    }
  }, [projects]);

  const hasNotifications = notifications.length > 0;
  const [formLoading, setFormLoading] = useState(false);
  const [formKey, setFormKey] = useState(0); // Force re-render after project creation

  const handleProjectCreated = () => {
    setFormKey((prevKey) => prevKey + 1);
  };

  const totalProjects = projects.length;
  const completedProjects = projects.filter((project) => project.status === "Completed").length;
  const pendingTasks = allTasks.filter((task) => task.progress < 100).length;
  const activities = recentActivities.map((activity) => activity.description);

  return (
    <div className="flex flex-col gap-4 p-4">
      <h1 className="text-2xl font-bold">Welcome to Your Dashboard</h1>
      <p className="text-gray-500">Manage your projects, expenses and progress from one place.</p>

      {/* Summary Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <CardComponent title="Total Projects" description="All projects in the system." action="View All" full>
          <div className="flex flex-col items-center justify-center space-y-2">
            <span className="text-4xl font-bold">{totalProjects}</span>
          </div>
        </CardComponent>
        <CardComponent title="Completed Projects" description="Projects marked as completed." action="View Completed" full>
          <div className="flex flex-col items-center justify-center space-y-2">
            <span className="text-4xl font-bold text-green-600">{completedProjects}</span>
          </div>
        </CardComponent>
        <CardComponent title="Pending Tasks" description="Tasks awaiting completion." action="false" full>
          <div className="flex flex-col items-center justify-center space-y-2">
            <span className="text-4xl font-bold text-yellow-600">{pendingTasks}</span>
          </div>
        </CardComponent>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <CardComponent
          title="Create a New Project"
          description="Start a new project by filling in the details below."
          form
          formId="createProject"
          formAction="Create Project"
          action="false"
          formLoading={formLoading}
          full
        >
          <CreateProjectForm
            card={false}
            onSuccess={handleProjectCreated}
            setFormLoading={setFormLoading}
            formLoading={formLoading}
            key={formKey}
          />
        </CardComponent>

        <CardComponent
          title="Active Projects"
          description="Overview of your currently active projects."
          action="View All Projects"
          full
          path="/projects/all"
        >
          <div className="flex flex-col items-center justify-center space-y-2">
            <Briefcase size={32} className="text-gray-600" />
            <span className="text-4xl font-bold">
              {projects.filter((project) => project.status === "Active").length}
            </span>
            <Badge className="bg-green-800">Active</Badge>
          </div>
        </CardComponent>
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
    <CardComponent title="Notifications" description="Recent notifications and activities." action="false" full>
      <Notifications></Notifications>
    </CardComponent>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <CardComponent title="Create Expense" description="Log a new expense." action="Go" full path="/financials/expenses">
        <DialogComponent
            trigger="Create a new Expense"
            button
            title="Create a new Expense"
            description=""
          >
            {(onClose) => <CreateExpenseForm onClose={onClose} />}
          </DialogComponent>
        </CardComponent>
        <CardComponent title="View Invoices" description="Check all invoices." action="Go" full path="/financials/invoices">
          <DialogComponent
            title="Create a new Invoice"
            description="Add invoice details"
            trigger="Create a new Invoice"
            button
          >
            {(onClose) => <InvoiceForm projectsData={projects} onClose={onClose} />}
          </DialogComponent>
        </CardComponent>
      </div>

      <div className="flex-1 rounded-xl bg-white shadow p-4 mt-4">
        <h2 className="text-xl font-bold mb-3">Cost Details</h2>
        <DataTable
          data={costData}
          columns={columns as ColumnDef<DocumentData & { firestoreId?: string }>[]}
          filterPlaceholder="Filter by provider..."
          filterColumn="provider"
        />
      </div>
    </div>
  );
}