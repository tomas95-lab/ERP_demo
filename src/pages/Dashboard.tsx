import CardComponent from "@/components/CardComponent";
import { ReusableChart } from "@/components/ReusableChart";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Briefcase } from "lucide-react";
import { DataTable } from "@/components/DataTable";
import { Cost, columns } from "@/components/columns";

import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { collection, addDoc } from "firebase/firestore";
import { db } from "@/firebaseConfig";
import { useFirestoreCollection } from "@/hooks/useFirestoreCollection";


export default function Dashboard() {
  interface ChartConfig {
    [key: string]: {
      label: string;
      color: string;
    };
  }
  
  const barConfig = {
    materials: {
      label: "Materials",
      color: "#2563eb",
    },
    labor: {
      label: "Labor",
      color: "#60a5fa",
    },
  } satisfies ChartConfig;
  
  const { data: costData } = useFirestoreCollection<Cost>("costs")
  const {data: barData} = useFirestoreCollection("yearChart")
  const [startDate, setStartDate] = React.useState<Date>();
  const [endDate, setEndDate] = React.useState<Date>();
  const [name, setName] = React.useState("");
  const [supervisor, setSupervisor] = React.useState("");
  const [status, setStatus] = React.useState("");
  const [budget, setBudget] = React.useState("");

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !supervisor || !status || !startDate || !endDate || !budget) {
      alert("Please fill in all fields");
      return;
    }

    await addDoc(collection(db, "projects"), {
      name,
      supervisor,
      status,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      budget: Number(budget),
      createdAt: new Date().toISOString(),
    });

    alert("Project created!");
    setName("");
    setSupervisor("");
    setStatus("");
    setStartDate(undefined);
    setEndDate(undefined);
    setBudget("");
  };

  return (
    <div>
      <h1 className="text-xl font-bold">Welcome!</h1>
      <div className="grid auto-rows-min gap-4 md:grid-cols-3">
        <CardComponent title="Create a New Project" description="" action="false" full>
          <form onSubmit={handleCreateProject}>
            <div className="grid w-full items-center gap-4 grid-cols-2">
              <div>
                <div className="flex flex-col space-y-1.5 gap-2 mt-2">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Name of your project" />
                </div>
                <div className="flex flex-col space-y-1.5 gap-2 mt-2">
                  <Label htmlFor="supervisor">Supervisor</Label>
                  <Input id="supervisor" value={supervisor} onChange={(e) => setSupervisor(e.target.value)} placeholder="Supervisor of your project" />
                </div>
              </div>
              <div>
                <div className="flex flex-col space-y-1.5 gap-2 mt-2">
                    <Label htmlFor="budget">Budget</Label>
                    <Input id="budget" value={budget} onChange={(e) => setBudget(e.target.value)} placeholder="Budget of your project" />
                </div>
                <div className="flex flex-col space-y-1.5 gap-2 mt-2">
                  <Label htmlFor="status">Status</Label>
                  <Select value={status} onValueChange={(value) => setStatus(value)}>
                    <SelectTrigger className="w-[100%]">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="On Hold">On Hold</SelectItem>
                      <SelectItem value="Completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex gap-4 col-span-2">
                <div className="flex flex-col space-y-1.5 gap-2 mt-2 w-full">
                  <Label>Start Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !startDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon />
                        {startDate ? format(startDate, "PPP") : <span>Pick a start date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={startDate}
                        onSelect={setStartDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="flex flex-col space-y-1.5 gap-2 mt-2 w-full">
                  <Label>End Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !endDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon />
                        {endDate ? format(endDate, "PPP") : <span>Pick an end date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={endDate}
                        onSelect={setEndDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
              <div className="col-span-2">
                <Button type="submit" className="w-full mt-4">Create Project</Button>
              </div>
            </div>
          </form>
        </CardComponent>

        <CardComponent title="Active Projects" description="" action="View All projects" full path="/projects/all">
          <div className="flex flex-col items-center justify-center space-y-2">
            <Briefcase size={32} className="text-gray-600" />
            <span className="text-4xl font-bold">66</span>
            <Badge className="bg-green-800">Currently active</Badge>
          </div>
        </CardComponent>

        <ReusableChart type="bar" data={barData} config={barConfig} title="Project Costs by Month" xKey="month" yKeys={["materials", "labor"]} />
      </div>
      <div className="h-full flex-1 rounded-xl bg-muted md:min-h-min p-4">
        <h2 className="text-xl font-bold mb-2">Main Costs</h2>
        <DataTable data={costData} columns={columns} filterPlaceholder="Filter users..." filterColumn="provider" />
      </div>
    </div>
  );
}
