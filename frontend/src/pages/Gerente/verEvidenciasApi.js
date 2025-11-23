// verEvidenciasApi.js

const API_URL = "http://localhost:8080/api";

export async function obtenerOrdenesServicio() {
    const resp = await fetch(`${API_URL}/ordenes-servicio`);
    if (!resp.ok) throw new Error("Error al obtener órdenes de servicio");
    return resp.json();
}

export async function obtenerEvidenciasPorOrden(ordenServicioId) {
    const resp = await fetch(`${API_URL}/evidencias/por-orden/${ordenServicioId}`);
    if (!resp.ok) throw new Error("Error al obtener evidencias");
    return resp.json();
}
