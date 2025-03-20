import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Layout from "./pages/Layout"; // Contenedor con Sidebar y Header


function App() {    
  return (
    <Router>
      <Routes>
        {/* Página de login */}
        
        <Route path="/" element={<Login />} />

        {/* Rutas protegidas con Dashboard */}
        <Route path="/dashboard" element={<Layout></Layout>} />
      </Routes>
    </Router>
  );
}

export default App;
