import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Gerente/Dashboard';
import AgregarEmpleado from './pages/Gerente/CreateEmployee';
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
        <Route path="/dashboard"
          element={<PrivateRoute requiredRole="GERENTE">
            <Dashboard />
          </PrivateRoute>
          }
        />

        <Route path="/agregar-empleado" element={<AgregarEmpleado />} />


        {/* Redirigir cualquier ruta no reconocida al login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;