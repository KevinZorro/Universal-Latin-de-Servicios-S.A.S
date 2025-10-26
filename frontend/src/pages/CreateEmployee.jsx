// src/pages/CreateEmployee.jsx
import React, { useState } from "react";

/**
 * CreateEmployee.jsx
 * - Formulario para que el GERENTE cree empleados.
 * - Endpoint: POST http://localhost:8080/api/empleados/crear
 * - Payload enviado: { cedula, nombre, apellido, telefono, email, passwordHash, rol }
 *
 * Nota:
 * - Asumo que el token JWT está guardado en localStorage bajo la clave "token".
 *   Si usas otra clave, cambia TOKEN_KEY.
 * - Si tu backend espera la contraseña sin hashear, cámbia passwordHash por password
 *   en el payload (línea marcada en submit()).
 */

const API_URL = process.env.REACT_APP_API_BASE || "http://localhost:8080";
const TOKEN_KEY = "token";

export default function CreateEmployee() {
  const [cedula, setCedula] = useState("");
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [telefono, setTelefono] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  async function submit(e) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    setError(null);

    try {
      const token = localStorage.getItem(TOKEN_KEY);
      if (!token) throw new Error("No se encontró token. Inicia sesión como gerente.");

      const payload = {
        cedula,
        nombre,
        apellido,
        telefono,
        email,
        // En tu backend dijiste que espera "passwordHash".
        // Aquí enviamos el valor del input en la propiedad passwordHash.
        // Si tu backend espera "password" (y lo hashea ahí), reemplaza la clave.
        passwordHash: password,
        rol: "EMPLEADO"
      };

      const res = await fetch(`${API_URL}/api/empleados/crear`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const text = await res.text();
        // intenta parsear JSON si viene
        let body;
        try { body = JSON.parse(text); } catch (e) { body = text; }
        throw new Error(body?.message || body || `Error ${res.status}`);
      }

      const body = await res.json().catch(() => null);
      setMessage("Empleado creado correctamente.");
      // opcional: mostrar respuesta completa
      console.log("Creado:", body);
      // limpiar formulario
      setCedula("");
      setNombre("");
      setApellido("");
      setTelefono("");
      setEmail("");
      setPassword("");
    } catch (err) {
      console.error(err);
      setError(String(err.message || err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto mt-8 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-semibold mb-4">Crear nuevo empleado</h2>

      {message && <div className="mb-4 p-3 bg-green-50 text-green-700 rounded">{message}</div>}
      {error && <div className="mb-4 p-3 bg-red-50 text-red-700 rounded">{error}</div>}

      <form onSubmit={submit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium">Cédula</label>
          <input required value={cedula} onChange={e => setCedula(e.target.value)}
                 className="mt-1 w-full px-3 py-2 border rounded" />
        </div>

        <div>
          <label className="block text-sm font-medium">Nombre</label>
          <input required value={nombre} onChange={e => setNombre(e.target.value)}
                 className="mt-1 w-full px-3 py-2 border rounded" />
        </div>

        <div>
          <label className="block text-sm font-medium">Apellido</label>
          <input required value={apellido} onChange={e => setApellido(e.target.value)}
                 className="mt-1 w-full px-3 py-2 border rounded" />
        </div>

        <div>
          <label className="block text-sm font-medium">Teléfono</label>
          <input required value={telefono} onChange={e => setTelefono(e.target.value)}
                 className="mt-1 w-full px-3 py-2 border rounded" />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium">Email</label>
          <input required type="email" value={email} onChange={e => setEmail(e.target.value)}
                 className="mt-1 w-full px-3 py-2 border rounded" />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium">Contraseña temporal</label>
          <input required type="password" value={password} onChange={e => setPassword(e.target.value)}
                 className="mt-1 w-full px-3 py-2 border rounded" />
          <p className="text-xs text-gray-500 mt-1">Si tu backend espera password en claro para hashear en servidor, cámbia la propiedad `passwordHash` por `password` en el payload.</p>
        </div>

        <div className="md:col-span-2 flex justify-end mt-2">
          <button type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded disabled:opacity-50"
                  disabled={loading}>
            {loading ? "Creando..." : "Crear empleado"}
          </button>
        </div>
      </form>
    </div>
  );
}
