// src/services/analyticsService.js
import { obtenerTodasOrdenes } from './ordenApi';
import { getAllClientes } from './ClienteService';

const API_BASE_URL = 'http://localhost:8080/api';

const getHeaders = () => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('authToken') || ''}`
});

const handleResponse = async (response) => {
    if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
    if (response.status === 204) return null;
    return response.json();
};

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
 * Obtener todas las asignaciones de empleados
 */
export const obtenerTodasAsignaciones = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/asignaciones`, {
            method: 'GET',
            headers: getHeaders()
        });
        return await handleResponse(response);
    } catch (error) {
        console.error('Error al obtener asignaciones:', error);
        throw error;
    }
};

/**
 * Análisis por Cliente
 * Retorna órdenes agrupadas por cliente con estadísticas
 */
export const analizarPorCliente = async () => {
    try {
        const [ordenes, clientes] = await Promise.all([
            obtenerTodasOrdenes(),
            getAllClientes()
        ]);

        const clientesMap = new Map(clientes.map(c => [c.id, c]));

        const analisisPorCliente = ordenes.reduce((acc, orden) => {
            const clienteId = orden.clienteId;
            if (!acc[clienteId]) {
                const cliente = clientesMap.get(clienteId);
                acc[clienteId] = {
                    clienteId,
                    clienteNombre: cliente ? `${cliente.nombre} ${cliente.apellido}` : 'Desconocido',
                    clienteEmail: cliente?.email || '',
                    totalOrdenes: 0,
                    ordenes: []
                };
            }
            acc[clienteId].totalOrdenes++;
            acc[clienteId].ordenes.push(orden);
            return acc;
        }, {});

        return Object.values(analisisPorCliente).sort((a, b) => b.totalOrdenes - a.totalOrdenes);
    } catch (error) {
        console.error('Error en análisis por cliente:', error);
        throw error;
    }
};

/**
 * Análisis por Servicio
 * Retorna servicios más contratados con estadísticas por fechas
 */
export const analizarPorServicio = async () => {
    try {
        const ordenServicios = await obtenerTodosOrdenServicio();

        const analisisPorServicio = ordenServicios.reduce((acc, os) => {
            const servicioId = os.servicioId;
            const servicioNombre = os.servicioNombre || `Servicio ${servicioId}`;

            if (!acc[servicioId]) {
                acc[servicioId] = {
                    servicioId,
                    servicioNombre,
                    totalContrataciones: 0,
                    cantidadTotal: 0,
                    porMes: {}
                };
            }

            acc[servicioId].totalContrataciones++;
            acc[servicioId].cantidadTotal += os.cantidad || 1;

            // Agrupar por mes si existe fecha
            if (os.fechaAsignacion) {
                const fecha = new Date(os.fechaAsignacion);
                const mesAnio = `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, '0')}`;

                if (!acc[servicioId].porMes[mesAnio]) {
                    acc[servicioId].porMes[mesAnio] = {
                        cantidad: 0,
                        contrataciones: 0
                    };
                }
                acc[servicioId].porMes[mesAnio].cantidad += os.cantidad || 1;
                acc[servicioId].porMes[mesAnio].contrataciones++;
            }

            return acc;
        }, {});

        return Object.values(analisisPorServicio)
            .sort((a, b) => b.totalContrataciones - a.totalContrataciones);
    } catch (error) {
        console.error('Error en análisis por servicio:', error);
        throw error;
    }
};

/**
 * Análisis por Empleado
 * Retorna empleados con más asignaciones
 */
export const analizarPorEmpleado = async () => {
    try {
        const asignaciones = await obtenerTodasAsignaciones();

        const analisisPorEmpleado = asignaciones.reduce((acc, asignacion) => {
            const empleadoId = asignacion.empleadoId;
            const empleadoNombre = asignacion.empleadoNombre || `Empleado ${empleadoId}`;

            if (!acc[empleadoId]) {
                acc[empleadoId] = {
                    empleadoId,
                    empleadoNombre,
                    totalAsignaciones: 0,
                    asignaciones: [],
                    porEstado: {
                        activas: 0,
                        completadas: 0,
                        pendientes: 0
                    }
                };
            }

            acc[empleadoId].totalAsignaciones++;
            acc[empleadoId].asignaciones.push(asignacion);

            // Contar por estado si existe
            const estado = asignacion.estado?.toLowerCase();
            if (estado === 'activo' || estado === 'en progreso') {
                acc[empleadoId].porEstado.activas++;
            } else if (estado === 'completado' || estado === 'finalizado') {
                acc[empleadoId].porEstado.completadas++;
            } else {
                acc[empleadoId].porEstado.pendientes++;
            }

            return acc;
        }, {});

        return Object.values(analisisPorEmpleado)
            .sort((a, b) => b.totalAsignaciones - a.totalAsignaciones);
    } catch (error) {
        console.error('Error en análisis por empleado:', error);
        throw error;
    }
};