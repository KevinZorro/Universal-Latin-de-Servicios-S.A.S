import React, { useState } from 'react';
import Login from "../src/pages/Login";
import CreateEmployee from "../src/pages/CreateEmployee";

// Almacena token al hacer login para mostrar CreateEmployee
function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(
    !!localStorage.getItem('token')
  );

  // Callback para Login éxito: actualiza estado
  const handleLoginSuccess = () => setIsLoggedIn(true);

  return (
    <div>
      {!isLoggedIn ? 
        <Login onLoginSuccess={handleLoginSuccess} /> 
        : 
        <CreateEmployee />
      }
    </div>
  );
}

export default App;
