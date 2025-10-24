import React, { useState } from "react";

function Registro() {
  const [form, setForm] = useState({
    cedula: "",
    nombre: "",
    apellido: "",
    telefono: "",
    email: "",
    password: "",
    tipoUsuario: "EMPLEADO" // o "GERENTE"
  });
  const [mensaje, setMensaje] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje("");
    try {
      const response = await fetch("http://localhost:8080/api/auth/registro", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (response.ok) {
        const result = await response.text();
        setMensaje(result);
      } else {
        const error = await response.text();
        setMensaje(error || "Error de registro");
      }
    } catch (err) {
      setMensaje("Error de conexión con el servidor");
    }
  };

  return (
    <div>
      <h2>Registro de usuario</h2>
      <form onSubmit={handleSubmit}>
        <input name="cedula" placeholder="Cédula" value={form.cedula} onChange={handleChange} required /><br/>
        <input name="nombre" placeholder="Nombre" value={form.nombre} onChange={handleChange} required /><br/>
        <input name="apellido" placeholder="Apellido" value={form.apellido} onChange={handleChange} required /><br/>
        <input name="telefono" placeholder="Teléfono" value={form.telefono} onChange={handleChange} required /><br/>
        <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} required /><br/>
        <input name="password" type="password" placeholder="Contraseña" value={form.password} onChange={handleChange} required /><br/>
        <select name="tipoUsuario" value={form.tipoUsuario} onChange={handleChange}>
          <option value="EMPLEADO">Empleado</option>
          <option value="GERENTE">Gerente</option>
        </select><br/>
        <button type="submit">Registrarse</button>
      </form>
      <div>{mensaje}</div>
    </div>
  );
}

export default Registro;
