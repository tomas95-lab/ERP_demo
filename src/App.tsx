import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./pages/Layout";
import Dashboard from "./pages/Dashboard";
import {Projects} from "./pages/Projects";
import {Financials} from "./pages/Financials";
import {Suppliers} from "./pages/Suppliers";
import { GeneralSettings } from "./pages/GeneralSettings";
import { Users } from "./pages/Users";
import Login from "./pages/Login";
import { Orders } from "./pages/Orders";
import { Invoices } from "./pages/invoices";
import { TotalSupplier } from "./pages/TotalSupplier";
import Expenses from "./pages/Expenses";
import ProjectPlannerView from "./pages/ProjectPlannerView";
import ModuleOverview from "./pages/ModuleOverview";

function App() {
  return (
    <Router>
      <Routes>
        {/* Layout general del Dashboard */}
        <Route path="/" element={<Login />}></Route>

        <Route path="/" element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          
          {/* Rutas intermedias */}
          <Route path="/projects" element={<ModuleOverview />} />
          <Route path="/financials" element={<ModuleOverview />} />
          <Route path="/suppliers" element={<ModuleOverview />} />
          <Route path="/settings" element={<ModuleOverview />} />
          
          {/* Rutas existentes */}
          <Route path="/projects/all" element={<Projects />} />
          <Route path="/projects/all/planner" element={<ProjectPlannerView />} />
          <Route path="/financials/expenses" element={<Financials />} />
          <Route path="/financials/expenses/all/table" element={<Expenses />} />
          <Route path="/financials/invoices" element={<Invoices />} />
          <Route path="/suppliers/all" element={<Suppliers />} />
          <Route path="/suppliers/all/table" element={<TotalSupplier />} />
          <Route path="/suppliers/orders" element={<Orders />} />
          <Route path="/settings/general" element={<GeneralSettings />} />
          <Route path="/settings/users" element={<Users />} />
        </Route>

      </Routes>
    </Router>
  );
}

export default App;
