// ordenServicioApi.js - API para gestionar Orden-Servicio

const API_BASE_URL = 'http://localhost:8080/api/ordenes-servicio';

// Estados disponibles para Orden-Servicio
export const ESTADOS = [
    { value: 'PENDIENTE', label: 'Pendiente' },
    { value: 'EN_PROGRESO', label: 'En Progreso' },
    { value: 'COMPLETADO', label: 'Completado' },
    { value: 'CANCELADO', label: 'Cancelado' }
];

/**
 * Obtener todas las relaciones Orden-Servicio
 */
export const obtenerTodasOrdenServicios = async () => {
    try {
        const response = await fetch(API_BASE_URL);
        if (!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error al obtener orden-servicios:', error);
        throw error;
    }
};

/**
 * Obtener una relación Orden-Servicio por ID
 */
export const obtenerOrdenServicioPorId = async (id) => {
    try {
        const response = await fetch(`${API_BASE_URL}/${id}`);
        if (!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error(`Error al obtener orden-servicio ${id}:`, error);
        throw error;
    }
};

/**
 * Crear una nueva relación Orden-Servicio
 */
export const crearOrdenServicio = async (data) => {
    try {
        const response = await fetch(API_BASE_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Error ${response.status}: ${errorText || response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error al crear orden-servicio:', error);
        throw error;
    }
};

/**
 * Eliminar una relación Orden-Servicio
 */
export const eliminarOrdenServicio = async (id) => {
    try {
        const response = await fetch(`${API_BASE_URL}/${id}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        return true;
    } catch (error) {
        console.error(`Error al eliminar orden-servicio ${id}:`, error);
        throw error;
    }
};

/**
 * Validar datos antes de crear una relación Orden-Servicio
 */
export const validarDatosOrdenServicio = (data) => {
    const errores = [];

    if (!data.ordenId || data.ordenId === 0) {
        errores.push('Debe seleccionar una orden');
    }

    if (!data.servicioId || data.servicioId === 0) {
        errores.push('Debe seleccionar un servicio');
    }

    if (!data.estado || data.estado.trim() === '') {
        errores.push('Debe seleccionar un estado');
    }

    return {
        valido: errores.length === 0,
        errores
    };
};