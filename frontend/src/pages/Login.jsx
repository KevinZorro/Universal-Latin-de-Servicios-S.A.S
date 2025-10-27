// src/pages/Login.jsx  (o donde tengas tu componente)
import React, { useState } from 'react';

// Si usas CRA, puedes configurar REACT_APP_API_BASE en .env
const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:8080';
const TOKEN_KEY = 'token';
const ROL_KEY = 'rol';
const NOMBRE_KEY = 'nombre';
const CEDULA_KEY = 'cedula';

export default function Login() {
  const [cedula, setCedula] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cedula, password }),
      });

      // Intentamos parsear JSON (el backend devuelve { token, rol, nombre })
      const bodyText = await res.text();
      let body = null;
      try {
        body = bodyText ? JSON.parse(bodyText) : null;
      } catch (parseErr) {
        // si no es JSON, lo guardamos como texto
        body = { message: bodyText };
      }

      if (!res.ok) {
        // Mensaje de error más claro (si el backend devolvió un mensaje en body)
        const msg = body?.error || body?.message || `Error ${res.status}`;
        throw new Error(msg);
      }

      // body debe contener el token y opcionalmente rol/nombre
      const token = body?.token || (typeof body === 'string' ? body : null);
      if (!token) {
        throw new Error('Respuesta inválida del servidor: no se recibió token');
      }

      // Guardar token y datos útiles en localStorage
      localStorage.setItem(TOKEN_KEY, token);
      if (body?.rol) localStorage.setItem(ROL_KEY, body.rol);
      if (body?.nombre) localStorage.setItem(NOMBRE_KEY, body.nombre);
      localStorage.setItem(CEDULA_KEY, cedula); // útil para mostrar usuario u otras acciones

      // Redirigir al dashboard (o donde manejes rutas)
      window.location.href = '/dashboard';
    } catch (err) {
      console.error('Login error:', err);
      setError(err.message || 'Error inesperado al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-white p-6">
      <div className="max-w-md w-full bg-white/80 backdrop-blur-md rounded-2xl shadow-lg p-8">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-indigo-500 text-white text-xl font-bold">U</div>
          <div>
            <h1 className="text-2xl font-semibold">Bienvenido</h1>
            <p className="text-sm text-gray-500">Inicia sesión con tu cédula</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Cédula</label>
            <input
              type="text"
              value={cedula}
              onChange={(e) => setCedula(e.target.value)}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>

          {error && <p className="text-red-600 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md font-semibold disabled:opacity-60"
          >
            {loading ? 'Cargando...' : 'Iniciar sesión'}
          </button>
        </form>
      </div>
    </div>
  );
}
