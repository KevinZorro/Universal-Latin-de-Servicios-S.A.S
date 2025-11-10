// candidatoApi.js - API para gestionar visualización de Candidatos

const API_BASE_URL = 'http://localhost:8080/api/candidatos';

/**
 * Obtener todos los candidatos
 */
export const obtenerTodosCandidatos = async () => {
    try {
        const response = await fetch(API_BASE_URL);
        if (!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error al obtener candidatos:', error);
        throw error;
    }
};

/**
 * Obtener un candidato por cédula
 */
export const obtenerCandidatoPorCedula = async (cedula) => {
    try {
        const response = await fetch(`${API_BASE_URL}/${cedula}`);
        if (!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error(`Error al obtener candidato ${cedula}:`, error);
        throw error;
    }
};

/**
 * Formatear experiencia para mostrar
 */
export const formatearExperiencia = (experiencia) => {
    if (!experiencia || experiencia === 0) return 'Sin experiencia';
    if (experiencia === 1) return '1 año';
    return `${experiencia} años`;
};

/**
 * Obtener etiqueta de estado del proceso
 */
export const obtenerEstadoProceso = (estadoProceso) => {
    return estadoProceso ? {
        label: 'En proceso',
        color: '#17a2b8'
    } : {
        label: 'Finalizado',
        color: '#6c757d'
    };
};