import React, { useState, useEffect } from "react";

const API_URL = process.env.REACT_APP_API_BASE || "http://localhost:8080";

export default function ServicioModal({ servicio, onClose, onSaved, token }) {
  const isEdit = !!servicio;

  const [nombreServicio, setNombreServicio] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [estado, setEstado] = useState(true);
  const [tipoHorario, setTipoHorario] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (servicio) {
      setNombreServicio(servicio.nombreServicio);
      setDescripcion(servicio.descripcion);
      setEstado(servicio.estado);
      setTipoHorario(servicio.tipoHorario);
    }
  }, [servicio]);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const method = isEdit ? "PUT" : "POST";
      const url = isEdit
        ? `${API_URL}/api/servicios/actualizar/${servicio.id}`
        : `${API_URL}/api/servicios/crear`;
        console.log('Servicio recibido en modal:', servicio);
      const payload = { nombreServicio, descripcion, estado, tipoHorario };

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || "Error al guardar el servicio");
      }

      onSaved();
      onClose();
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow-lg w-full max-w-lg">
        <h2 className="text-2xl font-bold mb-4">{isEdit ? "Editar Servicio" : "Crear Servicio"}</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-semibold mb-1">Nombre</label>
            <input
              type="text"
              value={nombreServicio}
              onChange={(e) => setNombreServicio(e.target.value)}
              required
              className="w-full border border-gray-300 rounded px-3 py-2"
              disabled={loading}
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">Descripción</label>
            <textarea
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              required
              className="w-full border border-gray-300 rounded px-3 py-2"
              disabled={loading}
              rows={3}
            />
          </div>

          <div className="flex items-center space-x-3">
            <label className="font-semibold">Estado</label>
            <select
              value={estado ? "activo" : "inactivo"}
              onChange={(e) => setEstado(e.target.value === "activo")}
              disabled={loading}
              className="border border-gray-300 rounded px-3 py-1"
            >
              <option value="activo">Activo</option>
              <option value="inactivo">Inactivo</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold mb-1">Tipo de Horario</label>
            <input
              type="text"
              value={tipoHorario}
              onChange={(e) => setTipoHorario(e.target.value)}
              required
              className="w-full border border-gray-300 rounded px-3 py-2"
              disabled={loading}
            />
          </div>

          {error && <p className="text-red-600">{error}</p>}

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 rounded border border-gray-300 hover:bg-gray-100"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 text-white rounded px-4 py-2 hover:bg-blue-700"
            >
              {loading ? "Guardando..." : isEdit ? "Actualizar" : "Crear"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
