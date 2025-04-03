import React from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "@/firebaseConfig";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
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
export default function CreateSupplier({ onSuccess }: { onSuccess: () => void }) {
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
      onSuccess() 

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
    return(
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
                  <SelectItem value="Pending">Pending</SelectItem>
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
    )
  
}