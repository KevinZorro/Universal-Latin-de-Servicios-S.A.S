// src/Gerente/asignacionApi.js
const API_BASE = "http://localhost:8080/api";

export async function obtenerAsignaciones() {
    const res = await fetch(`${API_BASE}/asignaciones`);
    return res.json();
}

export async function crearAsignacion(data) {
    const res = await fetch(`${API_BASE}/asignaciones`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    });
    return res.json();
}

export async function eliminarAsignacion(id) {
    const res = await fetch(`${API_BASE}/asignaciones/${id}`, {
        method: "DELETE",
    });
    return res.ok;
}

export async function obtenerOrdenesServicio() {
    const res = await fetch(`${API_BASE}/ordenes-servicio`);
    return res.json();
}

export async function obtenerEmpleados() {
    const res = await fetch(`${API_BASE}/empleados`); // Ajusta el endpoint según tu backend
    return res.json();
}
