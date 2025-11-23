import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar, MapPin, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { obtenerAgendaEmpleado } from './agendaService';
import ListaAgenda from './ListaAgenda';

const EmpleadoAgenda = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [eventos, setEventos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [vistaActual, setVistaActual] = useState('mes'); // 'mes', 'semana', 'dia'
    const empleadoId = localStorage.getItem("cedula");

    useEffect(() => {
        async function cargar() {
            try {
                setLoading(true);
                const agenda = await obtenerAgendaEmpleado(empleadoId);
                console.log("Agenda:", agenda);
                setEventos(agenda);
            } catch (error) {
                console.error("Error al cargar agenda:", error);
            } finally {
                setLoading(false);
            }
        }

        cargar();
    }, [empleadoId]);

    const getDiasDelMes = () => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const primerDia = new Date(year, month, 1);
        const ultimoDia = new Date(year, month + 1, 0);
        const diasAnteriores = primerDia.getDay() === 0 ? 6 : primerDia.getDay() - 1;

        const dias = [];

        for (let i = diasAnteriores; i > 0; i--) {
            const dia = new Date(year, month, -i + 1);
            dias.push({ fecha: dia, mesActual: false });
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

    const getEventosDelDia = (fecha) => {
        return eventos.filter(evento => {
            const fechaEvento = new Date(evento.fechaInicio);
            return fechaEvento.toDateString() === fecha.toDateString();
        });
    };

    const eventoAbarcaDia = (evento, fecha) => {
        const fechaInicio = new Date(evento.fechaInicio);
        const fechaFin = new Date(evento.fechaFin);

        fechaInicio.setHours(0, 0, 0, 0);
        fechaFin.setHours(23, 59, 59, 999);
        const fechaComparar = new Date(fecha);
        fechaComparar.setHours(12, 0, 0, 0);

        return fechaComparar >= fechaInicio && fechaComparar <= fechaFin;
    };

    const esInicioDeTarea = (evento, fecha) => {
        const fechaInicio = new Date(evento.fechaInicio);
        return fechaInicio.toDateString() === fecha.toDateString();
    };


    const cambiarMes = (direccion) => {
        const nuevaFecha = new Date(currentDate);
        nuevaFecha.setMonth(currentDate.getMonth() + direccion);
        setCurrentDate(nuevaFecha);
    };

    const formatearFecha = (fecha) => {
        return new Date(fecha).toLocaleDateString('es-ES', {
            month: 'long',
            year: 'numeric'
        });
    };

    const formatearHora = (fecha) => {
        return new Date(fecha).toLocaleTimeString('es-ES', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getColorEstado = (estado) => {
        const colores = {
            'PENDIENTE': 'bg-blue-100 text-blue-700 border-l-4 border-blue-500',
            'EN_PROGRESO': 'bg-yellow-100 text-yellow-700 border-l-4 border-yellow-500',
            'COMPLETADA': 'bg-green-100 text-green-700 border-l-4 border-green-500',
            'CANCELADA': 'bg-red-100 text-red-700 border-l-4 border-red-500'
        };
        return colores[estado] || 'bg-gray-100 text-gray-700 border-l-4 border-gray-500';
    };

    const esHoy = (fecha) => {
        const hoy = new Date();
        return fecha.toDateString() === hoy.toDateString();
    };

    const dias = getDiasDelMes();

    const getSemanasDelMes = () => {
        const dias = getDiasDelMes();
        const semanas = [];

        for (let i = 0; i < dias.length; i += 7) {
            semanas.push(dias.slice(i, 7 + i));
        }

        return semanas;
    };
    const semanas = getSemanasDelMes();


    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Cargando agenda...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center">
                            <div className="bg-blue-600 text-white p-2 rounded-lg mr-3">
                                <Calendar className="w-6 h-6" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">Mi Agenda</h1>
                                <p className="text-sm text-gray-500">Servicios programados</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                {/* Calendar Header */}
                <div className="bg-white rounded-lg shadow-sm mb-6">
                    <div className="p-4 flex items-center justify-between border-b">
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={() => cambiarMes(-1)}
                                className="p-2 hover:bg-gray-100 rounded-lg transition"
                            >
                                <ChevronLeft className="w-5 h-5" />
                            </button>
                            <h2 className="text-xl font-semibold text-gray-900 capitalize">
                                {formatearFecha(currentDate)}
                            </h2>
                            <button
                                onClick={() => cambiarMes(1)}
                                className="p-2 hover:bg-gray-100 rounded-lg transition"
                            >
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="flex space-x-2">
                            <button
                                onClick={() => setCurrentDate(new Date())}
                                className="px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition"
                            >
                                Hoy
                            </button>
                        </div>
                    </div>

                    {/* Calendar Grid */}
                    <div className="p-4">
                        {/* Días de la semana */}
                        <div className="grid grid-cols-7 gap-2 mb-2">
                            {['LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁB', 'DOM'].map(dia => (
                                <div key={dia} className="text-center text-sm font-semibold text-gray-600 py-2">
                                    {dia}
                                </div>
                            ))}
                        </div>

                        {semanas.map((semana, semanaIndex) => (
                            <div key={semanaIndex} className="relative mb-2">

                                {/* Grid de la semana */}
                                <div className="grid grid-cols-7 gap-2">
                                    {semana.map((dia, i) => (
                                        <div
                                            key={i}
                                            className={`min-h-24 border rounded-lg p-2 bg-white`}
                                        >
                                            <div className="text-sm font-medium mb-1">
                                                {dia.fecha.getDate()}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Eventos de esta semana */}
                                {eventos
                                    .filter(ev => semana.some(d => eventoAbarcaDia(ev, d.fecha)))
                                    .map((evento, idx) => {

                                        const inicio = new Date(evento.fechaInicio);
                                        const fin = new Date(evento.fechaFin);

                                        const diaInicio = semana.findIndex(d =>
                                            d.fecha.toDateString() === inicio.toDateString()
                                        );
                                        const diaFin = semana.findIndex(d =>
                                            d.fecha.toDateString() === fin.toDateString()
                                        );

                                        const colInicio = diaInicio === -1 ? 0 : diaInicio;
                                        const colFin = diaFin === -1 ? 6 : diaFin;

                                        const span = colFin - colInicio + 1;

                                        const fechaDiaInicio = semana[colInicio]?.fecha;

                                        return (
                                            <div
                                                key={idx}
                                                className={`absolute top-[${idx * 28}px] left-[calc(${colInicio}*14.28%)] w-[calc(${span}*14.28%)] p-1 text-xs rounded ${getColorEstado(evento.estado)}`}
                                            >
                                                <strong>{evento.cliente}</strong> —
                                                {esInicioDeTarea(evento, fechaDiaInicio)
                                                    ? formatearHora(evento.fechaInicio)
                                                    : "Continúa"}
                                            </div>
                                        );
                                    })}
                            </div>
                        ))}

                    </div>
                </div>

                {/* Leyenda */}
                <div className="mt-6 bg-white rounded-lg shadow-sm p-4">
                    <h4 className="text-sm font-semibold text-gray-900 mb-3">Estados</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        <div className="flex items-center space-x-2">
                            <div className="w-4 h-4 bg-blue-500 rounded"></div>
                            <span className="text-sm text-gray-700">Pendiente</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <div className="w-4 h-4 bg-yellow-500 rounded"></div>
                            <span className="text-sm text-gray-700">En Progreso</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <div className="w-4 h-4 bg-green-500 rounded"></div>
                            <span className="text-sm text-gray-700">Completada</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <div className="w-4 h-4 bg-red-500 rounded"></div>
                            <span className="text-sm text-gray-700">Cancelada</span>
                        </div>
                    </div>
                </div>

                <ListaAgenda />
            </div>
        </div>
    );
};

export default EmpleadoAgenda;