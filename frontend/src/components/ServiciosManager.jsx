import React, { useEffect, useState } from "react";
import ServicioCard from "./ServicioCard";
import ServicioModal from "./ServicioModal";

const API_URL = process.env.REACT_APP_API_BASE || "http://localhost:8080";
const TOKEN_KEY = "token";

export default function ServiciosManager() {
  const [servicios, setServicios] = useState([]);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedServicio, setSelectedServicio] = useState(null);
  const [userRole, setUserRole] = useState(null); // guardaremos el rol para condicionar UI
  const token = localStorage.getItem(TOKEN_KEY);

  useEffect(() => {
    // Aquí podrías obtener el rol desde el token decodificándolo,
    // o desde un endpoint de usuario. Por simplicidad:
    if (token) {
      // ejemplo básico si rol está en token decoded, sino setea a "EMPLEADO"
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setUserRole(payload.rol || payload.role || "EMPLEADO");
      } catch {
        setUserRole("EMPLEADO");
      }
    }
  }, [token]);

  useEffect(() => {
    fetchServicios();
  }, []);

  async function fetchServicios() {
    try {
      const res = await fetch(`${API_URL}/api/servicios`);
      if (!res.ok) throw new Error("Error al obtener servicios");
      const data = await res.json();
      setServicios(data);
    } catch (error) {
      console.error(error);
    }
  }

  function handleSearchChange(e) {
    setSearch(e.target.value);
  }

  function openCreateModal() {
    setSelectedServicio(null);
    setModalOpen(true);
  }

  function openEditModal(servicio) {
    setSelectedServicio(servicio);
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
    setSelectedServicio(null);
  }

  async function handleDelete(id) {
    if (!window.confirm("¿Eliminar servicio?")) return;
    try {
      const res = await fetch(`${API_URL}/api/servicios/eliminar/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Error al borrar servicio");
      fetchServicios();
    } catch (e) {
      alert(e.message);
    }
  }

  // Filtrar servicios por búsqueda (nombre o descripción)
  const filteredServicios = servicios.filter((s) =>
    s.nombreServicio.toLowerCase().includes(search.toLowerCase()) ||
    s.descripcion.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <input
          type="text"
          placeholder="Buscar servicios..."
          value={search}
          onChange={handleSearchChange}
          className="border border-gray-300 rounded p-2 w-64"
        />
        {userRole === "GERENTE" && (
          <button
            onClick={openCreateModal}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Crear Servicio
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {filteredServicios.map((servicio) => (
          <ServicioCard
            key={servicio.id}
            servicio={servicio}
            canEdit={userRole === "GERENTE"}
            onEdit={() => openEditModal(servicio)}
            onDelete={() => handleDelete(servicio.id)}
          />
        ))}
      </div>

      {modalOpen && (
        <ServicioModal
          servicio={selectedServicio}
          onClose={closeModal}
          onSaved={fetchServicios}
          token={token}
        />
      )}
    </div>
  );
}
