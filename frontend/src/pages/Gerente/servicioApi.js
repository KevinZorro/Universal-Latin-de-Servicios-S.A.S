// servicioApi.js
// Servicio para interactuar con los endpoints de Servicio

// Configuración base de la API
const API_BASE_URL = 'http://localhost:8080/api/servicios';

/**
 * Obtener el token de autenticación desde localStorage
 * Ajusta esto según tu implementación de autenticación
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
 * Manejo de errores común
 */
const handleResponse = async (response) => {
    if (!response.ok) {
        const error = {
            status: response.status,
            statusText: response.statusText,
            message: `Error ${response.status}: ${response.statusText}`
        };

        // Intentar obtener más detalles del error si existen
        try {
            const errorData = await response.json();
            error.details = errorData;
        } catch (e) {
            // Si no hay cuerpo JSON, continuar sin detalles
        }

        throw error;
    }

    // Si es 204 No Content, no hay cuerpo que parsear
    if (response.status === 204) {
        return null;
    }

    return response.json();
};

// ============================================
// FUNCIONES DEL API
// ============================================

/**
 * Obtener todos los servicios
 * GET /api/servicios
 */
export const obtenerTodosServicios = async () => {
    try {
        const response = await fetch(API_BASE_URL, {
            method: 'GET',
            headers: getHeaders()
        });

        return await handleResponse(response);
    } catch (error) {
        console.error('Error al obtener servicios:', error);
        throw error;
    }
};

/**
 * Obtener un servicio por ID
 * GET /api/servicios/{id}
 * @param {number} id - ID del servicio
 */
export const obtenerServicioPorId = async (id) => {
    try {
        const response = await fetch(`${API_BASE_URL}/${id}`, {
            method: 'GET',
            headers: getHeaders()
        });

        return await handleResponse(response);
    } catch (error) {
        console.error(`Error al obtener servicio con ID ${id}:`, error);
        throw error;
    }
};

/**
 * Crear un nuevo servicio
 * POST /api/servicios/crear
 * @param {Object} servicioData - Datos del servicio
 * @param {string} servicioData.nombreServicio - Nombre del servicio
 * @param {string} servicioData.descripcion - Descripción del servicio
 * @param {boolean} servicioData.estado - Estado del servicio
 * @param {string} servicioData.tipoHorario - Tipo de horario
 */
export const crearServicio = async (servicioData) => {
    try {
        const response = await fetch(`${API_BASE_URL}/crear`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(servicioData)
        });

        return await handleResponse(response);
    } catch (error) {
        console.error('Error al crear servicio:', error);
        throw error;
    }
};

/**
 * Actualizar un servicio existente
 * PUT /api/servicios/actualizar/{id}
 * @param {number} id - ID del servicio a actualizar
 * @param {Object} servicioData - Datos actualizados del servicio
 * @param {string} servicioData.nombreServicio - Nombre del servicio
 * @param {string} servicioData.descripcion - Descripción del servicio
 * @param {boolean} servicioData.estado - Estado del servicio
 * @param {string} servicioData.tipoHorario - Tipo de horario
 */
export const actualizarServicio = async (id, servicioData) => {
    try {
        const response = await fetch(`${API_BASE_URL}/actualizar/${id}`, {
            method: 'PUT',
            headers: getHeaders(),
            body: JSON.stringify(servicioData)
        });

        return await handleResponse(response);
    } catch (error) {
        console.error(`Error al actualizar servicio con ID ${id}:`, error);
        throw error;
    }
};

/**
 * Eliminar un servicio
 * DELETE /api/servicios/eliminar/{id}
 * @param {number} id - ID del servicio a eliminar
 */
export const eliminarServicio = async (id) => {
    try {
        const response = await fetch(`${API_BASE_URL}/eliminar/${id}`, {
            method: 'DELETE',
            headers: getHeaders()
        });

        return await handleResponse(response);
    } catch (error) {
        console.error(`Error al eliminar servicio con ID ${id}:`, error);
        throw error;
    }
};

// ============================================
// FUNCIONES AUXILIARES OPCIONALES
// ============================================

/**
 * Validar datos de servicio antes de enviar
 * @param {Object} servicioData - Datos a validar
 */
export const validarDatosServicio = (servicioData) => {
    const errores = [];

    if (!servicioData.nombreServicio || servicioData.nombreServicio.trim() === '') {
        errores.push('El nombre del servicio es requerido');
    }

    if (!servicioData.descripcion || servicioData.descripcion.trim() === '') {
        errores.push('La descripción es requerida');
    }

    if (typeof servicioData.estado !== 'boolean') {
        errores.push('El estado debe ser un valor booleano');
    }

    if (!servicioData.tipoHorario || servicioData.tipoHorario.trim() === '') {
        errores.push('El tipo de horario es requerido');
    }

    return {
        valido: errores.length === 0,
        errores
    };
};

/**
 * Filtrar servicios activos
 * @param {Array} servicios - Lista de servicios
 */
export const filtrarServiciosActivos = (servicios) => {
    return servicios.filter(servicio => servicio.estado === true);
};

/**
 * Filtrar servicios por tipo de horario
 * @param {Array} servicios - Lista de servicios
 * @param {string} tipoHorario - Tipo de horario a filtrar
 */
export const filtrarPorTipoHorario = (servicios, tipoHorario) => {
    return servicios.filter(servicio => servicio.tipoHorario === tipoHorario);
};

// Exportar también la URL base por si se necesita
export const API_URL = API_BASE_URL;