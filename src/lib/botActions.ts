import { collection, getDocs, query, where, orderBy, limit } from "firebase/firestore";
import { db } from "@/firebaseConfig";

export const botActions = {
  Dashboard: {
    summary: {
      intent: ["dashboard summary", "show summary", "overview"],
      handler: async () => {
        const projectsSnap = await getDocs(collection(db, "projects"));
        const expensesSnap = await getDocs(collection(db, "financials/expense/items"));
        
        const activeProjects = projectsSnap.docs.filter(doc => doc.data().status === "Active").length;
        const totalExpenses = expensesSnap.docs.reduce((acc, doc) => acc + (doc.data().amount || 0), 0);

        return `Current Status:
        - Active Projects: ${activeProjects}
        - Total Expenses: $${totalExpenses.toLocaleString()}
        - Latest Updates: Check the notifications panel for recent activity`;
      }
    },
    recentActivity: {
      intent: ["recent activity", "latest updates", "what's new"],
      handler: async () => {
        const projectsSnap = await getDocs(query(
          collection(db, "projects"), 
          orderBy("createdAt", "desc"),
          limit(3)
        ));
        
        const recentProjects = projectsSnap.docs.map(doc => doc.data().name);
        return `Recent Projects:\n${recentProjects.map(name => `- ${name}`).join('\n')}`;
      }
    },
    quickStats: {
      intent: ["quick stats", "dashboard stats", "show metrics"],
      handler: async () => {
        const [projectsSnap, expensesSnap, invoicesSnap] = await Promise.all([
          getDocs(collection(db, "projects")),
          getDocs(collection(db, "financials/expense/items")),
          getDocs(collection(db, "financials/invoice/items"))
        ]);
        
        const totalProjects = projectsSnap.docs.length;
        const totalExpenses = expensesSnap.docs.reduce((acc, doc) => acc + (doc.data().amount || 0), 0);
        const totalInvoices = invoicesSnap.docs.reduce((acc, doc) => acc + (doc.data().amount || 0), 0);
        
        return `Quick Stats:\n- Total Projects: ${totalProjects}\n- Total Expenses: $${totalExpenses.toLocaleString()}\n- Total Invoices: $${totalInvoices.toLocaleString()}`;
      }
    }
  },
  Orders: {
    summary: {
      intent: ["orders summary", "purchase orders", "order status"],
      handler: async () => {
        const ordersSnap = await getDocs(collection(db, "orders/purchaseOrders/items"));
        const orders = ordersSnap.docs.map(doc => doc.data());
        
        const pending = orders.filter(o => o.status === "Pending").length;
        const completed = orders.filter(o => o.status === "Completed").length;
        const total = orders.reduce((acc, order) => acc + (order.total || 0), 0);

        return `Orders Overview:
        - Pending Orders: ${pending}
        - Completed Orders: ${completed}
        - Total Value: $${total.toLocaleString()}
        - Need to create an order? Click the "Create Order" button above`;
      }
    }
  },
  Projects: {
    status: {
      intent: ["project status", "projects overview", "active projects"],
      handler: async () => {
        const snap = await getDocs(collection(db, "projects"));
        const projects = snap.docs.map(doc => doc.data());
        
        const active = projects.filter(p => p.status === "Active").length;
        const completed = projects.filter(p => p.status === "Completed").length;

        return `Projects Status:
        - Active Projects: ${active}
        - Completed Projects: ${completed}
        - Total Projects: ${projects.length}
        - Need to create a project? Use the quick actions menu`;
      }
    },
    tasks: {
      intent: ["pending tasks", "show tasks", "task status"],
      handler: async () => {
        const projectsSnap = await getDocs(collection(db, "projects"));
        const pendingTasks = projectsSnap.docs.reduce((acc, doc) => acc + (doc.data().pendingTasksCount || 0), 0);
        
        return `Tasks Overview:\n- Pending Tasks: ${pendingTasks}\n- Use the project planner to manage tasks`;
      }
    },
    deadlines: {
      intent: ["upcoming deadlines", "project deadlines", "due dates"],
      handler: async () => {
        const snap = await getDocs(query(
          collection(db, "projects"),
          where("status", "==", "Active"),
          orderBy("endDate", "asc"),
          limit(3)
        ));
        
        const deadlines = snap.docs.map(doc => ({
          name: doc.data().name,
          date: doc.data().endDate?.toDate?.()
        }));
        
        return `Upcoming Deadlines:\n${deadlines.map(p => 
          `- ${p.name}: ${p.date ? new Date(p.date).toLocaleDateString() : 'No date set'}`
        ).join('\n')}`;
      }
    }
  },
  Financials: {
    expenses: {
      intent: ["expense summary", "show expenses", "expense stats"],
      handler: async () => {
        const snap = await getDocs(collection(db, "financials/expense/items"));
        const expenses = snap.docs.map(doc => doc.data());
        
        const total = expenses.reduce((acc, exp) => acc + (exp.amount || 0), 0);
        const categories = [...new Set(expenses.map(exp => exp.category))];
        
        return `Expense Summary:\n- Total Expenses: $${total.toLocaleString()}\n- Categories: ${categories.join(', ')}`;
      }
    },
    invoices: {
      intent: ["invoice status", "unpaid invoices", "payment status"],
      handler: async () => {
        const snap = await getDocs(collection(db, "financials/invoice/items"));
        const invoices = snap.docs.map(doc => doc.data());
        
        const unpaid = invoices.filter(inv => inv.status === "Pending").length;
        const total = invoices.reduce((acc, inv) => acc + (inv.amount || 0), 0);
        
        return `Invoice Status:\n- Unpaid Invoices: ${unpaid}\n- Total Value: $${total.toLocaleString()}`;
      }
    }
  },
  Suppliers: {
    suppliers: {
      intent: ["supplier list", "active suppliers", "show suppliers"],
      handler: async () => {
        const snap = await getDocs(collection(db, "suppliers"));
        const suppliers = snap.docs.map(doc => doc.data());
        
        const active = suppliers.filter(s => s.status === "Active").length;
        const categories = [...new Set(suppliers.map(s => s.category))];
        
        return `Supplier Overview:\n- Active Suppliers: ${active}\n- Categories: ${categories.join(', ')}`;
      }
    },
    orders: {
      intent: ["recent orders", "order history", "purchase orders"],
      handler: async () => {
        const snap = await getDocs(query(
          collection(db, "orders/purchaseOrders/items"),
          orderBy("date", "desc"),
          limit(3)
        ));
        
        const recentOrders = snap.docs.map(doc => ({
          supplier: doc.data().supplier,
          total: doc.data().total
        }));
        
        return `Recent Orders:\n${recentOrders.map(order => 
          `- ${order.supplier}: $${order.total?.toLocaleString()}`
        ).join('\n')}`;
      }
    }
  }
};
