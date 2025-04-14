import React from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "@/firebaseConfig";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CreateProjectFormProps {
  onSuccess: () => void;
  formLoading: boolean; // si quieres manejarlo desde el padre
  setFormLoading: (loading: boolean) => void;
  card: boolean;
}

export default function CreateProjectForm({
  onSuccess,
  card = true,
  setFormLoading
}: CreateProjectFormProps) {
  const [startDate, setStartDate] = React.useState<Date>();
  const [endDate, setEndDate] = React.useState<Date>();
  const [name, setName] = React.useState("");
  const [supervisor, setSupervisor] = React.useState("");
  const [status, setStatus] = React.useState("");
  const [budget, setBudget] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !supervisor || !status || !startDate || !endDate || !budget) {
      toast.error("There was an error", {
        description: "Please fill in all required fields.",
      });
      return;
    }

    // Activa el loading antes de hacer la llamada asíncrona
    setLoading(true);
    // Si deseas que el componente padre conozca el estado, haz:
    setFormLoading(true);

    try {
      await addDoc(collection(db, "projects"), {
        name,
        supervisor,
        status,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        budget: Number(budget),
        createdAt: new Date().toISOString(),
      });

      toast.success("Project created", {
        description: `${name} created by ${supervisor}`,
      });

      // Limpia los campos del formulario
      setName("");
      setSupervisor("");
      setStatus("");
      setStartDate(undefined);
      setEndDate(undefined);
      setBudget("");

      onSuccess();
    } catch (err) {
      toast.error("Error creating project", {
        description: "Something went wrong. Try again.",
      });
    } finally {
      // Desactiva el loading al final
      setLoading(false);
      setFormLoading(false);
    }
  };

  return (
    <form onSubmit={handleCreateProject} id="createProject">
      <div className="grid w-full items-center gap-4 grid-cols-2">
        <div>
          <div className="flex flex-col space-y-1.5 gap-2 mt-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Name of your project"
            />
          </div>
          <div className="flex flex-col space-y-1.5 gap-2 mt-2">
            <Label htmlFor="supervisor">Supervisor</Label>
            <Input
              id="supervisor"
              value={supervisor}
              onChange={(e) => setSupervisor(e.target.value)}
              placeholder="Supervisor of your project"
            />
          </div>
        </div>
        <div>
          <div className="flex flex-col space-y-1.5 gap-2 mt-2">
            <Label htmlFor="budget">Budget</Label>
            <Input
              id="budget"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              placeholder="Budget of your project"
            />
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
            <Input
              type="date"
              value={startDate ? format(startDate, 'yyyy-MM-dd') : ""}
              onChange={(e) => setStartDate(new Date(e.target.value))}
            />
          </div>

          <div className="flex flex-col space-y-1.5 gap-2 mt-2 w-full">
            <Label>End Date</Label>
            <Input
              type="date"
              value={endDate ? format(endDate, 'yyyy-MM-dd') : ""}
              onChange={(e) => setEndDate(new Date(e.target.value))}
            />
          </div>
        </div>
        {card && (
          <div className="col-span-2">
            <Button
              type="submit"
              disabled={loading}
              className="w-full mt-4"
            >
              {loading ? "Loading..." : "Create Project"}
            </Button>
          </div>
        )}
      </div>
    </form>
  );
}
