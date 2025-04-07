import { format } from "date-fns"

export default function ProjectView({ project }: { project: any }) {
    return (
        <div className="grid grid-cols-2 gap-4 p-4 text-sm">
        <div>
          <p className="text-muted-foreground mb-1">Status</p>
          <p className="font-semibold">{project.status || "—"}</p>
        </div>
        <div>
          <p className="text-muted-foreground mb-1">Start Date</p>
          <p className="font-semibold">  {project.endDate ? format(new Date(project.endDate), "MMM dd, yyyy") : "—"}
          </p>
        </div>
        <div>
          <p className="text-muted-foreground mb-1">End Date</p>
          <p className="font-semibold">  {project.startDate ? format(new Date(project.startDate), "MMM dd, yyyy") : "—"}
          </p>
        </div>
        <div>
          <p className="text-muted-foreground mb-1">Supervisor</p>
          <p className="font-semibold">{project.supervisor || "—"}</p>
        </div>
        <div className="col-span-2">
          <p className="text-muted-foreground mb-1">Budget</p>
          <p className="font-semibold">
            {project.budget
              ? new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: "USD",
                }).format(project.budget)
              : "—"}
          </p>
        </div>
      </div>
    )
}