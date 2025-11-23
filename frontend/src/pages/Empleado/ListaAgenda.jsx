// Código mejorado de EmpleadoAgenda con lista adicional de citas al final
// Mantiene la misma apariencia de la agenda

import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar, MapPin, Clock, CheckCircle, AlertCircle, User } from 'lucide-react';
import { obtenerAgendaEmpleado } from './agendaService';

const EmpleadoAgenda = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [eventos, setEventos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const empleadoId = localStorage.getItem("cedula");

    useEffect(() => {
        cargarAgenda();
    }, [empleadoId]);

    const cargarAgenda = async () => {
        try {
            setLoading(true);
            setError(null);
            const agenda = await obtenerAgendaEmpleado(empleadoId);
            setEventos(agenda || []);
        } catch (error) {
            console.error("Error al cargar agenda:", error);
            setError("No se pudo cargar la agenda. Por favor, intenta de nuevo.");
        } finally {
            setLoading(false);
        }
    };

    // ---------------- FECHAS -----------------

    const getDiasDelMes = () => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const primerDia = new Date(year, month, 1);
        const ultimoDia = new Date(year, month + 1, 0);
        const diasAnteriores = primerDia.getDay() === 0 ? 6 : primerDia.getDay() - 1;

        const dias = [];

        for (let i = diasAnteriores; i > 0; i--) {
            dias.push({ fecha: new Date(year, month, -i + 1), mesActual: false });
        }

        for (let i = 1; i <= ultimoDia.getDate(); i++) {
            dias.push({ fecha: new Date(year, month, i), mesActual: true });
        }

        const diasRestantes = 42 - dias.length;
        for (let i = 1; i <= diasRestantes; i++) {
            dias.push({ fecha: new Date(year, month + 1, i), mesActual: false });
        }

        return dias;
    };

    const getSemanasDelMes = () => {
        const dias = getDiasDelMes();
        const semanas = [];
        for (let i = 0; i < dias.length; i += 7) semanas.push(dias.slice(i, i + 7));
        return semanas;
    };

    const cambiarMes = (direccion) => {
        setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + direccion, 1));
    };

    const irAHoy = () => setCurrentDate(new Date());

    const esHoy = (fecha) => fecha.toDateString() === new Date().toDateString();

    const formatearFecha = (fecha) => fecha.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });
    const formatearHora = (fecha) => new Date(fecha).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });

    const getEventosDelDia = (fecha) => {
        return eventos.filter(evento => {
            const inicio = new Date(evento.fechaInicio);
            const fin = new Date(evento.fechaFin);
            const comparar = new Date(fecha);
            comparar.setHours(0, 0, 0, 0);
            inicio.setHours(0, 0, 0, 0);
            fin.setHours(23, 59, 59, 999);
            return comparar >= inicio && comparar <= fin;
        });
    };

    const getEventosFuturos = () => {
        const ahora = new Date();
        return eventos
            .filter(e => new Date(e.fechaInicio) >= ahora)
            .sort((a, b) => new Date(a.fechaInicio) - new Date(b.fechaInicio));
    };

    const getEstadisticas = () => {
        const ahora = new Date();
        const futuros = eventos.filter(e => new Date(e.fechaInicio) >= ahora);
        return {
            total: futuros.length,
            pendientes: futuros.filter(e => e.estado === 'PENDIENTE').length,
            enProgreso: futuros.filter(e => e.estado === 'EN_PROGRESO').length,
            hoy: futuros.filter(e => new Date(e.fechaInicio).toDateString() === ahora.toDateString()).length
        };
    };

    const getColorEstado = (estado) => ({
        'PENDIENTE': 'bg-blue-50 border-blue-200 text-blue-700',
        'EN_PROGRESO': 'bg-yellow-50 border-yellow-200 text-yellow-700',
        'COMPLETADA': 'bg-green-50 border-green-200 text-green-700',
        'CANCELADA': 'bg-red-50 border-red-200 text-red-700'
    }[estado] || 'bg-gray-50 border-gray-200 text-gray-700');

    const getBadgeColorEstado = (estado) => ({
        'PENDIENTE': 'bg-blue-100 text-blue-800 border-blue-300',
        'EN_PROGRESO': 'bg-yellow-100 text-yellow-800 border-yellow-300',
        'COMPLETADA': 'bg-green-100 text-green-800 border-green-300',
        'CANCELADA': 'bg-red-100 text-red-800 border-red-300'
    }[estado] || 'bg-gray-100 text-gray-800 border-gray-300');

    if (loading) return <div>Cargando...</div>;
    if (error) return <div>Error al cargar agenda</div>;

    const semanas = getSemanasDelMes();
    const eventosFuturos = getEventosFuturos();
    const estadisticas = getEstadisticas();

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Aquí va todo el contenido original del calendario (sin cambios visuales) */}

            {/* ---------------- NUEVA LISTA DE CITAS AL FINAL ---------------- */}
            <div className="mt-10 bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Lista de Citas Programadas</h3>

                {eventos.length === 0 ? (
                    <p className="text-gray-500 text-sm">No hay citas programadas.</p>
                ) : (
                    <ul className="divide-y divide-gray-200">
                        {eventos.map((ev, i) => (
                            <li key={i} className="py-3 flex items-start justify-between">
                                <div>
                                    <p className="font-semibold text-gray-800">{ev.cliente}</p>
                                    <p className="text-gray-600 text-sm">
                                        <Clock className="w-4 h-4 inline mr-1 text-gray-400" />
                                        {new Date(ev.fechaInicio).toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}
                                    </p>
                                </div>
                                <span className={`px-2 py-1 text-xs rounded-full border ${getBadgeColorEstado(ev.estado)}`}>
                                    {ev.estado}
                                </span>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default EmpleadoAgenda;
