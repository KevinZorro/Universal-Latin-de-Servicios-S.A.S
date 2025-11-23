// src/hooks/useAnalytics.js
import { useState, useEffect } from 'react';
import { analizarPorCliente, analizarPorServicio, analizarPorEmpleado } from './analyticsService';

export const useAnalytics = () => {
    const [datosClientes, setDatosClientes] = useState([]);
    const [datosServicios, setDatosServicios] = useState([]);
    const [datosEmpleados, setDatosEmpleados] = useState([]);
    const [loading, setLoading] = useState({
        clientes: false,
        servicios: false,
        empleados: false
    });
    const [error, setError] = useState(null);

    const cargarAnalisisClientes = async () => {
        setLoading(prev => ({ ...prev, clientes: true }));
        setError(null);
        try {
            const datos = await analizarPorCliente();
            setDatosClientes(datos);
        } catch (err) {
            setError('Error al cargar análisis de clientes');
            console.error(err);
        } finally {
            setLoading(prev => ({ ...prev, clientes: false }));
        }
    };

    const cargarAnalisisServicios = async () => {
        setLoading(prev => ({ ...prev, servicios: true }));
        setError(null);
        try {
            const datos = await analizarPorServicio();
            setDatosServicios(datos);
        } catch (err) {
            setError('Error al cargar análisis de servicios');
            console.error(err);
        } finally {
            setLoading(prev => ({ ...prev, servicios: false }));
        }
    };

    const cargarAnalisisEmpleados = async () => {
        setLoading(prev => ({ ...prev, empleados: true }));
        setError(null);
        try {
            const datos = await analizarPorEmpleado();
            setDatosEmpleados(datos);
        } catch (err) {
            setError('Error al cargar análisis de empleados');
            console.error(err);
        } finally {
            setLoading(prev => ({ ...prev, empleados: false }));
        }
    };

    const cargarTodo = async () => {
        await Promise.all([
            cargarAnalisisClientes(),
            cargarAnalisisServicios(),
            cargarAnalisisEmpleados()
        ]);
    };

    return {
        datosClientes,
        datosServicios,
        datosEmpleados,
        loading,
        error,
        cargarAnalisisClientes,
        cargarAnalisisServicios,
        cargarAnalisisEmpleados,
        cargarTodo
    };
};