import { collection, getDocs } from "firebase/firestore";
import { db } from "@/firebaseConfig";

export const BotActions = {
  Dashboard: {
    summary: {
      intent: ["show dashboard", "dashboard overview", "home summary"],
      handler: async () => {
        return "Dashboard summary not implemented yet.";
      }
    }
  },
  Projects: {
    list: {
      intent: ["list projects", "show projects"],
      handler: async () => {
        const snapshot = await getDocs(collection(db, "projects"));
        const projects = snapshot.docs.map(doc => doc.data());
        return `You have ${projects.length} projects registered.`;
      }
    }
  },
  Financials: {
    expenses: {
      intent: ["list expenses", "show expense tracking", "show expenses"],
      handler: async () => {
        const snapshot = await getDocs(collection(db, "expenses"));
        const expenses = snapshot.docs.map(doc => doc.data());
        return `You have ${expenses.length} expenses recorded.`;
      }
    },
    invoices: {
      intent: ["list invoices", "show invoices", "show payments"],
      handler: async () => {
        const snapshot = await getDocs(collection(db, "invoices"));
        const invoices = snapshot.docs.map(doc => doc.data());
        return `You have ${invoices.length} invoices and payments.`;
      }
    }
  },
  Suppliers: {
    list: {
      intent: ["list suppliers", "show suppliers", "how many suppliers"],
      handler: async () => {
        const snapshot = await getDocs(collection(db, "suppliers"));
        const suppliers = snapshot.docs.map(doc => doc.data());
        return `You have ${suppliers.length} suppliers registered.`;
      }
    },
    orders: {
      intent: ["list purchase orders", "show purchase orders", "purchase orders"],
      handler: async () => {
        const snapshot = await getDocs(collection(db, "purchaseOrders"));
        const orders = snapshot.docs.map(doc => doc.data());
        return `You have ${orders.length} purchase orders.`;
      }
    }
  }
};
