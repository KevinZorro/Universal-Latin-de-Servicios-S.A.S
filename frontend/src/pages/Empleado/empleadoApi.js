const API_BASE = process.env.REACT_APP_API_BASE + "/api" || 'http://localhost:8080/api';

const getHeaders = () => {
    const token = localStorage.getItem('token');
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };
};

const getMultipartHeaders = () => {
    const token = localStorage.getItem('token');
    return {
        'Authorization': `Bearer ${token}`
    };
};

export const crearEvidencia = async (formData) => {
    try {
        const response = await fetch(`${API_BASE}/evidencias`, {
            method: 'POST',
            headers: getMultipartHeaders(), // Usamos los headers especiales
            body: formData
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText || 'Error al subir la evidencia');
        }

        return await response.json();
    } catch (error) {
        console.error("Error en crearEvidencia:", error);
        throw error;
    }
};

// ✅ NUEVA FUNCIÓN: Actualizar estado (PATCH)
export const actualizarEstadoServicio = async (ordenServicioId, nuevoEstado) => {
    try {
        const response = await fetch(`${API_BASE}/ordenes-servicio/${ordenServicioId}/estado?nuevoEstado=${nuevoEstado}`, {
            method: 'PATCH',
            headers: getHeaders()
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText || 'Error al actualizar estado');
        }
        return await response.json();
    } catch (error) {
        console.error("Error actualizando estado:", error);
        throw error;
    }
};

export const obtenerMisAsignaciones = async (cedula) => {
    try {
        if (!cedula) throw new Error("Cédula no proporcionada");

        const response = await fetch(`${API_BASE}/asignaciones/empleado/${cedula}`, {
            method: 'GET',
            headers: getHeaders()
        });

        if (!response.ok) {
            throw new Error(`Error ${response.status}: No se pudieron obtener las asignaciones`);
        }

        const data = await response.json();

        // Aplanar respuesta
        let listaAsignaciones = [
            ...(data.pendientes || []),
            ...(data.enProceso || []),
            ...(data.finalizados || []),
            ...(data.cancelados || [])
        ];

        if (listaAsignaciones.length === 0) return [];

        // Cargar catálogos auxiliares
        const [serviciosRes, ordenesRes, clientesRes] = await Promise.all([
            fetch(`${API_BASE}/servicios`, { headers: getHeaders() }),
            fetch(`${API_BASE}/ordenes`, { headers: getHeaders() }),
            fetch(`${API_BASE}/clientes`, { headers: getHeaders() })
        ]);

        const servicios = serviciosRes.ok ? await serviciosRes.json() : [];
        const ordenes = ordenesRes.ok ? await ordenesRes.json() : [];
        
        const clientesData = clientesRes.ok ? await clientesRes.json() : {};
        const clientes = clientesData._embedded ? clientesData._embedded.clienteList : (Array.isArray(clientesData) ? clientesData : []);

        return listaAsignaciones.map(asig => {
            const servicio = servicios.find(s => s.id === asig.servicioId);
            const orden = ordenes.find(o => o.idOrden === asig.ordenId);
            
            let cliente = null;
            if (orden) {
                cliente = clientes.find(c => c.id === orden.clienteId);
            }

            return {
                // --- Datos Base ---
                id: asig.id,
                // ✅ CLAVE: El ID que devuelve este endpoint ES el ID de OrdenServicio
                ordenServicioId: asig.id, 
                estado: asig.estado,
                fechaAsignacion: asig.fechaAsignacion || asig.fecha,

                // --- Datos Servicio ---
                servicioNombre: servicio ? servicio.nombreServicio : `Servicio #${asig.servicioId}`,
                servicioDescripcion: servicio ? servicio.descripcion : "Sin descripción",
                servicioTipoHorario: servicio ? servicio.tipoHorario : "N/A",
                
                // --- Datos Orden ---
                ordenId: asig.ordenId,
                ordenFechaCreacion: orden ? orden.fechaCreacion : null,
                ordenFechaFin: orden ? orden.fechaFin : null,
                
                // --- Datos Cliente (Preservando tus campos originales) ---
                clienteNombre: cliente ? (cliente.nombre || `${cliente.nombres} ${cliente.apellidos}`) : "Cliente Desconocido",
                clienteDireccion: cliente ? cliente.direccion : "Sin dirección registrada",
                clienteTelefono: cliente ? cliente.telefono : "Sin teléfono",
                clienteEmail: cliente ? cliente.email : "Sin email"
            };
        });

    } catch (error) {
        console.error("Error en obtenerMisAsignaciones:", error);
        throw error;
    }
};