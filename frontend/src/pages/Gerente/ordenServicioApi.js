// src/api/ordenServicioApi.js
const API_BASE = process.env.REACT_APP_API_BASE + "/api/ordenes-servicio" || "http://localhost:8080/api/ordenes-servicio";

export async function obtenerOrdenesServicio() {
    const res = await fetch(API_BASE);
    if (!res.ok) throw new Error("Error al obtener las órdenes-servicio");
    return await res.json();
}

export async function obtenerOrdenServicioPorId(id) {
    const res = await fetch(`${API_BASE}/${id}`);
    if (!res.ok) throw new Error("Error al obtener la orden-servicio");
    return await res.json();
}

export async function crearOrdenServicio(dto) {
    const res = await fetch(API_BASE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dto),
    });
    if (!res.ok) throw new Error("Error al crear la orden-servicio");
    return await res.json();
}

export async function eliminarOrdenServicio(id) {
    const res = await fetch(`${API_BASE}/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Error al eliminar la orden-servicio");
}

export async function actualizarOrdenServicio(id, dto) {
    const res = await fetch(`${API_BASE}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dto),
    });

    if (!res.ok) throw new Error("Error al actualizar la orden-servicio");

    return await res.json();
}


