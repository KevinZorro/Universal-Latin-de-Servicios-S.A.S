// verEvidenciasApi.js

const API_URL = process.env.REACT_APP_API_BASE + "/api" || "http://localhost:8080/api";

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

export async function obtenerOrdenPorId(idOrden) {
    const resp = await fetch(`${API_URL}/ordenes/${idOrden}`);
    if (!resp.ok) throw new Error("Error al obtener la orden");
    return resp.json(); // ⬅ aquí viene el clienteId real
}

export async function obtenerClientePorId(idCliente) {
    const resp = await fetch(`${API_URL}/clientes/${idCliente}`);
    if (!resp.ok) throw new Error("Error al obtener el cliente");
    return resp.json(); // ⬅ aquí viene el NIT
}


