// src/services/apiService.js

const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:8080';

/**
 * Función helper para manejar las respuestas del API
 */
const handleResponse = async (response) => {
    if (!response.ok) {
        let errorMessage = 'Error en la petición';

        try {
            const fullErrorText = await response.text();
            console.log('Respuesta del servidor:', fullErrorText);

            try {
                const errorData = JSON.parse(fullErrorText);
                errorMessage = errorData.message || errorData.error || fullErrorText;
            } catch {
                errorMessage = fullErrorText || `Error ${response.status}: ${response.statusText}`;
            }
        } catch {
            errorMessage = `Error ${response.status}: ${response.statusText}`;
        }

        throw new Error(errorMessage);
    }

    return await response.json();
};

/**
 * Obtener el token del localStorage
 */
const getToken = () => {
    const token = localStorage.getItem('token');
    if (!token) {
        throw new Error('No se encontró token de autenticación');
    }
    return token;
};

/**
 * Headers por defecto para las peticiones
 */
const getHeaders = (includeContentType = true) => {
    const headers = {
        'Authorization': `Bearer ${getToken()}`,
    };

    if (includeContentType) {
        headers['Content-Type'] = 'application/json';
    }

    return headers;
};

// ============================================
// SERVICIOS DE EMPLEADOS
// ============================================

export const empleadosService = {
    /**
     * Obtener todos los empleados
     */
    getAll: async () => {
        console.log('Obteniendo empleados de:', `${API_BASE}/api/empleados`);
        const response = await fetch(`${API_BASE}/api/empleados`, {
            method: 'GET',
            headers: getHeaders(),
        });
        return await handleResponse(response);
    },

    /**
     * Obtener empleado por ID
     */
    getById: async (id) => {
        const response = await fetch(`${API_BASE}/api/empleados/${id}`, {
            method: 'GET',
            headers: getHeaders(),
        });
        return await handleResponse(response);
    },

    /**
     * Crear nuevo empleado
     */
    create: async (empleadoData) => {
        const response = await fetch(`${API_BASE}/api/empleados`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(empleadoData),
        });
        return await handleResponse(response);
    },

    /**
     * Actualizar empleado por cédula
     */
    update: async (cedula, empleadoData) => {
        const response = await fetch(`${API_BASE}/api/empleados/${cedula}`, {
            method: 'PUT',
            headers: getHeaders(),
            body: JSON.stringify(empleadoData),
        });
        return await handleResponse(response);
    },

    /**
     * Eliminar empleado
     */
    delete: async (id) => {
        const response = await fetch(`${API_BASE}/api/empleados/${id}`, {
            method: 'DELETE',
            headers: getHeaders(),
        });

        if (response.status === 204) {
            return { success: true };
        }

        return await handleResponse(response);
    },

    /**
     * Buscar empleado por cédula
     */
    getByCedula: async (cedula) => {
        const response = await fetch(`${API_BASE}/api/empleados/buscar?cedula=${cedula}`, {
            method: 'GET',
            headers: getHeaders(),
        });
        return await handleResponse(response);
    },
};

// ============================================
// SERVICIOS DE CARGOS (TIPOS DE EMPLEADO)
// ============================================

export const cargosService = {
    /**
     * Obtener todos los tipos de empleado
     */
    getAll: async () => {
        console.log('Obteniendo tipos de empleado de:', `${API_BASE}/api/tipos-empleado`);
        const response = await fetch(`${API_BASE}/api/tipos-empleado`, {
            method: 'GET',
            headers: getHeaders(),
        });
        return await handleResponse(response);
    },

    /**
     * Obtener tipo de empleado por ID
     */
    getById: async (id) => {
        const response = await fetch(`${API_BASE}/api/tipos-empleado/${id}`, {
            method: 'GET',
            headers: getHeaders(),
        });
        return await handleResponse(response);
    },

    /**
     * Crear nuevo tipo de empleado
     */
    create: async (cargoData) => {
        const response = await fetch(`${API_BASE}/api/tipos-empleado`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(cargoData),
        });
        return await handleResponse(response);
    },

    /**
     * Actualizar tipo de empleado
     */
    update: async (id, cargoData) => {
        const response = await fetch(`${API_BASE}/api/tipos-empleado/${id}`, {
            method: 'PUT',
            headers: getHeaders(),
            body: JSON.stringify(cargoData),
        });
        return await handleResponse(response);
    },

    /**
     * Eliminar tipo de empleado
     */
    delete: async (id) => {
        const response = await fetch(`${API_BASE}/api/tipos-empleado/${id}`, {
            method: 'DELETE',
            headers: getHeaders(),
        });

        if (response.status === 204) {
            return { success: true };
        }

        return await handleResponse(response);
    },

    /**
     * Buscar tipo de empleado por nombre
     */
    getByNombre: async (nombre) => {
        const response = await fetch(`${API_BASE}/api/tipos-empleado/buscar?nombre=${encodeURIComponent(nombre)}`, {
            method: 'GET',
            headers: getHeaders(),
        });
        return await handleResponse(response);
    },
};

// ============================================
// SERVICIO DE AUTENTICACIÓN
// ============================================

export const authService = {
    /**
     * Login
     */
    login: async (credentials) => {
        const response = await fetch(`${API_BASE}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(credentials),
        });
        return await handleResponse(response);
    },

    /**
     * Logout (limpiar token)
     */
    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        localStorage.removeItem('rol');
        localStorage.removeItem('cedula');
        localStorage.removeItem('usuario_id');
    },

    /**
     * Verificar si hay sesión activa
     */
    isAuthenticated: () => {
        return !!localStorage.getItem('token');
    },

    /**
     * Obtener información del usuario actual
     */
    getCurrentUser: () => {
        return {
            token: localStorage.getItem('token'),
            username: localStorage.getItem('username'),
            rol: localStorage.getItem('rol'),
            cedula: localStorage.getItem('cedula'),
            usuario_id: localStorage.getItem('usuario_id'),
        };
    },
};

// Exportar también como default
export default {
    empleados: empleadosService,
    cargos: cargosService,
    auth: authService,
};