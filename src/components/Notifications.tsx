import { useFirestoreCollection } from "../hooks/useFirestoreCollection";
import { DocumentData } from "firebase/firestore";
import { differenceInDays, isPast, parseISO } from "date-fns";
import { Bell, AlertCircle, CalendarClock } from "lucide-react";
import { toast } from "sonner";

interface Notification {
  type: string;
  message: string;
  icon?: React.ReactNode;
}

export const showNotification = (type: string, title: string, message: string) => {
  switch (type) {
    case 'success':
      toast.success(title, {
        description: message,
        duration: 4000,
      });
      break;
    case 'error':
      toast.error(title, {
        description: message,
        duration: 5000,
      });
      break;
    case 'warning':
      toast.warning(title, {
        description: message,
        duration: 4000,
      });
      break;
    default:
      toast.info(title, {
        description: message,
        duration: 3000,
      });
  }
};

export function Notifications() {
  const { data: projects = [] } = useFirestoreCollection<DocumentData>("projects");
  const { data: expenses = [] } = useFirestoreCollection<DocumentData>("financials/expense/items");
  const { data: invoices = [] } = useFirestoreCollection<DocumentData>("financials/invoices/items");

  const notifications: Notification[] = [];

  projects.forEach((p) => {
    if (p.endDate) {
      const endDate = parseISO(p.endDate);
      const daysLeft = differenceInDays(endDate, new Date());
      if (daysLeft >= 0 && daysLeft <= 3) {
        notifications.push({
          type: "Project Ending Soon",
          message: `Project "${p.name}" ends in ${daysLeft} day(s).`,
          icon: <CalendarClock className="text-yellow-600" size={18} />,
        });
      }
    }
  });

  expenses.forEach((e) => {
    if (e.amount && e.amount > 1000) {
      notifications.push({
        type: "High Expense",
        message: `High expense: $${e.amount} for project "${e.project}" (${e.category}).`,
        icon: <AlertCircle className="text-red-600" size={18} />,
      });
    }
  });

  invoices.forEach((i) => {
    if (i.date && isPast(parseISO(i.date))) {
      notifications.push({
        type: "Overdue Invoice",
        message: `Invoice for the "${i.project}" project is overdue.`,
        icon: <Bell className="text-orange-500" size={18} />,
      });
    }
  });

  return (
    <div className="flex flex-col gap-4 w-full max-h-[358px] overflow-y-auto bg-white rounded-xl p-4">
      {notifications.length > 0 ? (
        notifications.map((n, i) => (
          <div key={i} className="flex items-start gap-3 border-b last:border-b-0 pb-3">
            {n.icon}
            <div>
              <p className="font-medium">{n.type}</p>
              <p className="text-sm text-gray-600">{n.message}</p>
            </div>
          </div>
        ))
      ) : (
        <p className="text-muted-foreground text-sm">No new notifications</p>
      )}
    </div>
  );
}
