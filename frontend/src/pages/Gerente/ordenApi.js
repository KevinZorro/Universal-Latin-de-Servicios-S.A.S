// ordenApi.js
// Servicio para gestionar Órdenes y Orden-Servicio

const API_BASE_URL = process.env.REACT_APP_API_BASE + "/api" || 'http://localhost:8080/api';

/**
 * Obtener el token de autenticación
 */
const getAuthToken = () => {
    return localStorage.getItem('authToken') || '';
};

/**
 * Configuración común para las peticiones
 */
const getHeaders = () => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${getAuthToken()}`
});

/**
 * Manejo de respuestas
 */
const handleResponse = async (response) => {
    if (!response.ok) {
        const error = {
            status: response.status,
            statusText: response.statusText,
            message: `Error ${response.status}: ${response.statusText}`
        };

        try {
            const errorData = await response.json();
            error.details = errorData;
        } catch (e) {
            // No hay cuerpo JSON
        }

        throw error;
    }

    if (response.status === 204) {
        return null;
    }

    return response.json();
};

// ============================================
// ÓRDENES - API
// ============================================

/**
 * Obtener todas las órdenes
 * GET /api/ordenes
 */
export const obtenerTodasOrdenes = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/ordenes`, {
            method: 'GET',
            headers: getHeaders()
        });

        return await handleResponse(response);
    } catch (error) {
        console.error('Error al obtener órdenes:', error);
        throw error;
    }
};

/**
 * Obtener una orden por ID
 * GET /api/ordenes/{idOrden}
 */
export const obtenerOrdenPorId = async (idOrden) => {
    try {
        const response = await fetch(`${API_BASE_URL}/ordenes/${idOrden}`, {
            method: 'GET',
            headers: getHeaders()
        });

        return await handleResponse(response);
    } catch (error) {
        console.error(`Error al obtener orden ${idOrden}:`, error);
        throw error;
    }
};

/**
 * Crear una nueva orden
 * POST /api/ordenes
 * @param {Object} ordenData
 * @param {number} ordenData.clienteId - ID del cliente
 * @param {string} ordenData.fechaCreacion - Fecha de creación (ISO String)
 * @param {string} ordenData.fechaFin - Fecha de fin (ISO String)
 * @param {boolean} ordenData.estadoOrden - Estado de la orden
 */
export const crearOrden = async (ordenData) => {
    try {
        const response = await fetch(`${API_BASE_URL}/ordenes`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(ordenData)
        });

        return await handleResponse(response);
    } catch (error) {
        console.error('Error al crear orden:', error);
        throw error;
    }
};

/**
 * Eliminar una orden
 * DELETE /api/ordenes/{idOrden}
 */
export const eliminarOrden = async (idOrden) => {
    try {
        const response = await fetch(`${API_BASE_URL}/ordenes/${idOrden}`, {
            method: 'DELETE',
            headers: getHeaders()
        });

        if (!response.ok) {
            throw {
                status: response.status,
                statusText: response.statusText,
                message: `Error ${response.status}: ${response.statusText}`
            };
        }

        return;
    } catch (error) {
        console.error(`Error al eliminar orden ${idOrden}:`, error);
        throw error;
    }
};


// ============================================
// ORDEN-SERVICIO - API
// ============================================

/**
 * Obtener todos los registros de orden-servicio
 * GET /api/ordenes-servicio
 */
export const obtenerTodosOrdenServicio = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/ordenes-servicio`, {
            method: 'GET',
            headers: getHeaders()
        });

        return await handleResponse(response);
    } catch (error) {
        console.error('Error al obtener orden-servicios:', error);
        throw error;
    }
};

/**
 * Obtener un orden-servicio por ID
 * GET /api/ordenes-servicio/{id}
 */
export const obtenerOrdenServicioPorId = async (id) => {
    try {
        const response = await fetch(`${API_BASE_URL}/ordenes-servicio/${id}`, {
            method: 'GET',
            headers: getHeaders()
        });

        return await handleResponse(response);
    } catch (error) {
        console.error(`Error al obtener orden-servicio ${id}:`, error);
        throw error;
    }
};

/**
 * Asociar un servicio a una orden
 * POST /api/ordenes-servicio
 * @param {Object} ordenServicioData
 * @param {number} ordenServicioData.ordenId - ID de la orden
 * @param {number} ordenServicioData.servicioId - ID del servicio
 * @param {string} ordenServicioData.estado - Estado: PENDIENTE, EN_PROGRESO, COMPLETADO, CANCELADO
 */
export const asociarServicioAOrden = async (ordenServicioData) => {
    try {
        const response = await fetch(`${API_BASE_URL}/ordenes-servicio`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(ordenServicioData)
        });

        return await handleResponse(response);
    } catch (error) {
        console.error('Error al asociar servicio a orden:', error);
        throw error;
    }
};

/**
 * Eliminar una asociación orden-servicio
 * DELETE /api/ordenes-servicio/{id}
 */
export const eliminarOrdenServicio = async (id) => {
    try {
        const response = await fetch(`${API_BASE_URL}/ordenes-servicio/${id}`, {
            method: 'DELETE',
            headers: getHeaders()
        });

        if (!response.ok) {
            throw {
                status: response.status,
                statusText: response.statusText,
                message: `Error ${response.status}: ${response.statusText}`
            };
        }
        return;
    } catch (error) {
        console.error(`Error al eliminar orden-servicio ${id}:`, error);
        throw error;
    }
};

// ============================================
// FUNCIONES AUXILIARES
// ============================================

/**
 * Validar datos de orden
 */
export const validarDatosOrden = (ordenData) => {
    const errores = [];

    if (!ordenData.clienteId || ordenData.clienteId === 0) {
        errores.push('Debe seleccionar un cliente');
    }

    if (!ordenData.fechaCreacion) {
        errores.push('La fecha de creación es requerida');
    }

    if (!ordenData.fechaFin) {
        errores.push('La fecha de fin es requerida');
    }

    if (ordenData.fechaCreacion && ordenData.fechaFin) {
        const fechaInicio = new Date(ordenData.fechaCreacion);
        const fechaFin = new Date(ordenData.fechaFin);

        if (fechaFin < fechaInicio) {
            errores.push('La fecha de fin debe ser posterior a la fecha de creación');
        }
    }

    return {
        valido: errores.length === 0,
        errores
    };
};

/**
 * Validar datos de orden-servicio
 */
export const validarDatosOrdenServicio = (ordenServicioData) => {
    const errores = [];

    if (!ordenServicioData.ordenId || ordenServicioData.ordenId === 0) {
        errores.push('Debe seleccionar una orden');
    }

    if (!ordenServicioData.servicioId || ordenServicioData.servicioId === 0) {
        errores.push('Debe seleccionar un servicio');
    }

    if (!ordenServicioData.estado) {
        errores.push('Debe seleccionar un estado');
    }

    const estadosValidos = ['PENDIENTE', 'EN_PROGRESO', 'COMPLETADO', 'CANCELADO'];
    if (ordenServicioData.estado && !estadosValidos.includes(ordenServicioData.estado)) {
        errores.push('El estado seleccionado no es válido');
    }

    return {
        valido: errores.length === 0,
        errores
    };
};

/**
 * Formatear fecha para inputs
 */
export const formatearFechaParaInput = (fecha) => {
    if (!fecha) return '';
    const d = new Date(fecha);
    return d.toISOString().slice(0, 16);
};

/**
 * Obtener servicios asociados a una orden
 */
export const obtenerServiciosPorOrden = async (ordenId) => {
    try {
        const todosOrdenServicio = await obtenerTodosOrdenServicio();
        return todosOrdenServicio.filter(os => os.ordenId === ordenId);
    } catch (error) {
        console.error('Error al obtener servicios de la orden:', error);
        throw error;
    }
};

/**
 * Obtener estadísticas de estados
 */
export const obtenerEstadisticasEstados = (ordenesServicio) => {
    const estadisticas = {
        PENDIENTE: 0,
        EN_PROGRESO: 0,
        COMPLETADO: 0,
        CANCELADO: 0
    };

    ordenesServicio.forEach(os => {
        if (estadisticas.hasOwnProperty(os.estado)) {
            estadisticas[os.estado]++;
        }
    });

    return estadisticas;
};

export const ESTADOS_ORDEN_SERVICIO = [
    { value: 'PENDIENTE', label: 'Pendiente', color: '#ffc107' },
    { value: 'EN_PROGRESO', label: 'En Progreso', color: '#17a2b8' },
    { value: 'COMPLETADO', label: 'Completado', color: '#28a745' },
    { value: 'CANCELADO', label: 'Cancelado', color: '#dc3545' }
];