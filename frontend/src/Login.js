import React, { useState } from "react";

function Login() {
  const [cedula, setCedula] = useState("");
  const [password, setPassword] = useState("");
  const [mensaje, setMensaje] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje("");
    try {
      const response = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cedula, password }),
      });

      if (response.ok) {
        const result = await response.text();
        setMensaje(result);
        // Aquí puedes guardar un token o redirigir si tu backend lo soporta
      } else {
        const error = await response.text();
        setMensaje(error || "Credenciales incorrectas");
      }
    } catch (err) {
      setMensaje("Error de conexión con el servidor");
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Cédula"
          value={cedula}
          onChange={(e) => setCedula(e.target.value)}
          required
        /><br/>
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        /><br/>
        <button type="submit">Iniciar sesión</button>
      </form>
      <div>{mensaje}</div>
    </div>
  );
}

export default Login;
