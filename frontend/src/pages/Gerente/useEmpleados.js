// src/hooks/useEmpleados.js
import { useState, useEffect, useCallback } from 'react';

const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:8080';

/**
 * Custom hook para gestionar la obtención y estado de empleados
 * @param {boolean} autoFetch - Si debe cargar automáticamente al montar (default: true)
 * @returns {Object} Estado y funciones para manejar empleados
 */
export function useEmpleados(autoFetch = true) {
    const [empleados, setEmpleados] = useState([]);
    const [loading, setLoading] = useState(autoFetch);
    const [error, setError] = useState('');

    /**
     * Función para obtener empleados del backend
     */
    const fetchEmpleados = useCallback(async () => {
        setLoading(true);
        setError('');

        try {
            const token = localStorage.getItem('token');

            if (!token) {
                throw new Error('No se encontró token de autenticación');
            }

            console.log('Obteniendo empleados de:', `${API_BASE}/api/empleados`);

            const response = await fetch(`${API_BASE}/api/empleados`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            console.log('Status de respuesta:', response.status);

            if (!response.ok) {
                let errorMessage = 'Error al obtener empleados';

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

            const data = await response.json();
            console.log('Empleados obtenidos:', data);
            setEmpleados(data);

            return data; // Retornar los datos por si se necesitan

        } catch (err) {
            console.error('Error al cargar empleados:', err);
            setError(err.message || 'Error inesperado al cargar empleados');
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    /**
     * Obtener un empleado por ID
     */
    const getEmpleadoById = useCallback((id) => {
        return empleados.find(emp => emp.id === id);
    }, [empleados]);

    /**
     * Obtener un empleado por cédula
     */
    const getEmpleadoByCedula = useCallback((cedula) => {
        return empleados.find(emp => emp.cedula === cedula);
    }, [empleados]);

    /**
     * Filtrar empleados activos
     */
    const getEmpleadosActivos = useCallback(() => {
        return empleados.filter(emp => emp.activo);
    }, [empleados]);

    /**
     * Filtrar empleados inactivos
     */
    const getEmpleadosInactivos = useCallback(() => {
        return empleados.filter(emp => !emp.activo);
    }, [empleados]);

    /**
     * Filtrar empleados por rol
     */
    const getEmpleadosByRol = useCallback((rol) => {
        return empleados.filter(emp => emp.rol === rol);
    }, [empleados]);

    /**
     * Buscar empleados por término
     */
    const searchEmpleados = useCallback((searchTerm) => {
        if (!searchTerm) return empleados;

        const searchLower = searchTerm.toLowerCase();
        return empleados.filter(emp =>
            emp.nombre?.toLowerCase().includes(searchLower) ||
            emp.apellido?.toLowerCase().includes(searchLower) ||
            emp.cedula?.toString().includes(searchLower) ||
            emp.email?.toLowerCase().includes(searchLower) ||
            emp.telefono?.includes(searchTerm)
        );
    }, [empleados]);

    /**
     * Obtener estadísticas de empleados
     */
    const getEstadisticas = useCallback(() => {
        return {
            total: empleados.length,
            activos: empleados.filter(e => e.activo).length,
            inactivos: empleados.filter(e => !e.activo).length,
            porRol: {
                gerentes: empleados.filter(e => e.rol === 'GERENTE').length,
                empleados: empleados.filter(e => e.rol === 'EMPLEADO').length,
                admins: empleados.filter(e => e.rol === 'ADMIN').length,
            }
        };
    }, [empleados]);

    // Cargar empleados automáticamente si autoFetch es true
    useEffect(() => {
        if (autoFetch) {
            fetchEmpleados();
        }
    }, [autoFetch, fetchEmpleados]);

    return {
        // Estado
        empleados,
        loading,
        error,

        // Funciones principales
        fetchEmpleados,
        refetch: fetchEmpleados, // Alias para refrescar

        // Funciones de búsqueda/filtrado
        getEmpleadoById,
        getEmpleadoByCedula,
        getEmpleadosActivos,
        getEmpleadosInactivos,
        getEmpleadosByRol,
        searchEmpleados,

        // Estadísticas
        getEstadisticas,
    };
}