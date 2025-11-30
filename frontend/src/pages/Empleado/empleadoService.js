const API_URL = process.env.REACT_APP_API_BASE + "/api"|| "http://localhost:8080/api";
function getHeaders() {
    const token = localStorage.getItem('token');
    return { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` };
}

export async function obtenerEmpleadoPorCedula(cedula) {
    const resp = await fetch(`${API_URL}/empleados/${cedula}`, { headers: getHeaders() });
    if (!resp.ok) throw new Error("Error al obtener empleado");
    return resp.json();
}

export async function actualizarPerfilEmpleado(cedula, datos) {
    const resp = await fetch(`${API_URL}/empleados/perfil/${cedula}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(datos)
    });
    if (!resp.ok) throw new Error("Error al actualizar perfil");
    return resp.json();
}
