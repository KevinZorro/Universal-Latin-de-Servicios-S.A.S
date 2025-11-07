import React from "react";

export default function ServicioCard({ servicio, canEdit, onEdit, onDelete }) {
  return (
    <div className="border rounded shadow p-4 flex flex-col justify-between">
      <div>
        <h3 className="text-xl font-semibold mb-2">{servicio.nombreServicio}</h3>
        <p className="text-gray-700 mb-2">{servicio.descripcion}</p>
        <p className={`font-semibold ${servicio.estado ? "text-green-600" : "text-red-600"}`}>
          {servicio.estado ? "Activo" : "Inactivo"}
        </p>
        <p className="text-sm text-gray-500 mt-1">Horario: {servicio.tipoHorario}</p>
      </div>

      {canEdit && (
        <div className="mt-4 flex justify-end space-x-2">
          <button
            className="bg-yellow-400 hover:bg-yellow-500 text-black px-3 py-1 rounded"
            onClick={onEdit}
          >
            Editar
          </button>
          <button
            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
            onClick={onDelete}
          >
            Borrar
          </button>
        </div>
      )}
    </div>
  );
}
