import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Gerente/Dashboard';
import AgregarEmpleado from './pages/Gerente/CreateEmployee';
import EmployeeDashboard from './pages/Empleado/EmployeeDashboard';
import EmpleadoAgenda from './pages/Empleado/EmpleadoAgenda';

const TOKEN_KEY = 'token';
const ROL_KEY = 'rol';

// Componente para proteger rutas privadas (solo si hay token)
const PrivateRoute = ({ children, requiredRole }) => {
  const token = localStorage.getItem(TOKEN_KEY);
  const rol = localStorage.getItem(ROL_KEY);

  // Si no hay token, enviar al login
  if (!token) {
    console.log('🚫 Acceso denegado: no hay token');
    return <Navigate to="/login" replace />;
  }

  // Si se requiere un rol específico, validar
  if (requiredRole && rol !== requiredRole) {
    console.log(`🚫 Rol no autorizado: se requiere ${requiredRole}, pero tienes ${rol}`);
    return <Navigate to="/login" replace />;
  }

  // Si todo bien, mostrar el componente hijo
  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Página de login */}
        <Route path="/login" element={<Login />} />

        {/* Ruta protegida del gerente */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute requiredRole="GERENTE">
              <Dashboard />
            </PrivateRoute>
          }
        />

        <Route
          path="/agregar-empleado"
          element={
            <PrivateRoute requiredRole="GERENTE">
              <AgregarEmpleado />
            </PrivateRoute>
          }
        />

        {/* Rutas protegidas del empleado */}
        <Route
          path="/employee-dashboard"
          element={
            <PrivateRoute requiredRole="EMPLEADO">
              <EmployeeDashboard />
            </PrivateRoute>
          }
        />

        <Route
          path="/empleado-agenda"
          element={
            <PrivateRoute requiredRole="EMPLEADO">
              <EmpleadoAgenda />
            </PrivateRoute>
          }
        />

        {/* Redirigir cualquier ruta no reconocida al login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;