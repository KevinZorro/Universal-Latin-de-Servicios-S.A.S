import React, { useState } from 'react';
import Login from "../src/pages/Login";
import CreateEmployee from "../src/pages/CreateEmployee";
import ServiciosPage from "./pages/ServiciosPage";
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from "react-router-dom";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));

  const handleLoginSuccess = () => setIsLoggedIn(true);
  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
  };

  if (!isLoggedIn) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  // Cuando está logueado, mostramos rutas con nav básico
  return (
    <Router>
      <div className="p-4 bg-gray-100 min-h-screen">
        <nav className="mb-6 flex space-x-4 text-blue-700">
          <Link to="/crear-empleado" className="hover:underline">Crear Empleado</Link>
          <Link to="/servicios" className="hover:underline">Gestión de Servicios</Link>
          <button onClick={handleLogout} className="ml-auto text-red-600 hover:underline">
            Cerrar sesión
          </button>
        </nav>

        <Routes>
          <Route path="/crear-empleado" element={<CreateEmployee />} />
          <Route path="/servicios" element={<ServiciosPage />} />
          <Route path="*" element={<Navigate to="/crear-empleado" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
