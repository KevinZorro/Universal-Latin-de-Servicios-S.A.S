const API_URL = "http://localhost:8080/api";

function getHeaders() {
    const token = localStorage.getItem('token');
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };
}

export async function obtenerAgendaEmpleado(empleadoId) {
    try {

        const response = await fetch(
            `${API_URL}/asignaciones/agenda/empleado/${empleadoId}`,
            {
                method: "GET",
                headers: getHeaders()
            }
        );

        console.log("Respuesta agenda:", response);

        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }

        return await response.json();

    } catch (error) {
        console.error('Error al obtener agenda del empleado:', error);
        throw error;
    }
}

// ======================================================
// FILTRAR EVENTOS POR RANGO
// ======================================================
export function filtrarEventosPorRango(eventos, fechaInicio, fechaFin) {
    return eventos.filter(evento => {
        const fechaEvento = new Date(evento.fechaInicio);
        return fechaEvento >= fechaInicio && fechaEvento <= fechaFin;
    });
}

// ======================================================
// AGRUPAR EVENTOS POR DÍA
// ======================================================
export function agruparEventosPorDia(eventos) {
    return eventos.reduce((acc, evento) => {
        const fecha = new Date(evento.fechaInicio).toDateString();
        if (!acc[fecha]) acc[fecha] = [];
        acc[fecha].push(evento);
        return acc;
    }, {});
}

// ======================================================
// EVENTOS DE UN DÍA
// ======================================================
export function obtenerEventosDelDia(eventos, fecha) {
    return eventos.filter(evento =>
        new Date(evento.fechaInicio).toDateString() === fecha.toDateString()
    );
}

// ======================================================
// ORDENAR EVENTOS
// ======================================================
export function ordenarEventosPorFecha(eventos, ascendente = true) {
    return [...eventos].sort((a, b) =>
        ascendente
            ? new Date(a.fechaInicio) - new Date(b.fechaInicio)
            : new Date(b.fechaInicio) - new Date(a.fechaInicio)
    );
}

// ======================================================
// FILTRAR POR ESTADO
// ======================================================
export function filtrarPorEstado(eventos, estado) {
    return eventos.filter(evento => evento.estado === estado);
}

// ======================================================
// PRÓXIMOS EVENTOS
// ======================================================
export function obtenerProximosEventos(eventos, limite = 5) {
    const ahora = new Date();
    return eventos
        .filter(evento => new Date(evento.fechaInicio) >= ahora)
        .sort((a, b) => new Date(a.fechaInicio) - new Date(b.fechaInicio))
        .slice(0, limite);
}

// ======================================================
// ESTADÍSTICAS
// ======================================================
export function calcularEstadisticas(eventos) {
    const total = eventos.length;
    const completadas = eventos.filter(e => e.estado === 'FINALIZADO').length;
    const pendientes = eventos.filter(e => e.estado === 'PENDIENTE').length;
    const enProgreso = eventos.filter(e => e.estado === 'EN_PROGRESO').length;
    const canceladas = eventos.filter(e => e.estado === 'CANCELADA').length;

    return {
        total,
        completadas,
        pendientes,
        enProgreso,
        canceladas,
        porcentajeCompletadas: total > 0 ? (completadas / total * 100).toFixed(1) : 0
    };
}

// ======================================================
// FUNCIONES DE CALENDARIO
// ======================================================
export function obtenerDiasDelMes(year, month) {
    const primerDia = new Date(year, month, 1);
    const ultimoDia = new Date(year, month + 1, 0);
    const diasAntes = primerDia.getDay() === 0 ? 6 : primerDia.getDay() - 1;

    const dias = [];

    for (let i = diasAntes; i > 0; i--) {
        dias.push({ fecha: new Date(year, month, -i + 1), mesActual: false });
    }

    for (let i = 1; i <= ultimoDia.getDate(); i++) {
        dias.push({ fecha: new Date(year, month, i), mesActual: true });
    }

    const diasRest = 42 - dias.length;
    for (let i = 1; i <= diasRest; i++) {
        dias.push({ fecha: new Date(year, month + 1, i), mesActual: false });
    }

    return dias;
}

export function esHoy(fecha) {
    return fecha.toDateString() === new Date().toDateString();
}

export function formatearFecha(fecha, opciones = {}) {
    const fechaObj = typeof fecha === 'string' ? new Date(fecha) : fecha;
    return fechaObj.toLocaleDateString('es-ES', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        ...opciones
    });
}

export function formatearHora(fecha) {
    const fechaObj = typeof fecha === 'string' ? new Date(fecha) : fecha;
    return fechaObj.toLocaleTimeString('es-ES', {
        hour: '2-digit',
        minute: '2-digit'
    });
}

export function obtenerColorEstado(estado) {
    const colores = {
        PENDIENTE: 'bg-blue-100 text-blue-700 border-l-4 border-blue-500',
        EN_PROGRESO: 'bg-yellow-100 text-yellow-700 border-l-4 border-yellow-500',
        FINALIZADO: 'bg-green-100 text-green-700 border-l-4 border-green-500',
        CANCELADA: 'bg-red-100 text-red-700 border-l-4 border-red-500'
    };
    return colores[estado] || 'bg-gray-100 text-gray-700 border-l-4 border-gray-500';
}

export function calcularDuracion(inicio, fin) {
    const fechaInicio = new Date(inicio);
    const fechaFin = new Date(fin);
    const diff = fechaFin - fechaInicio;

    return {
        horas: Math.floor(diff / (1000 * 60 * 60)),
        minutos: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    };
}

export function obtenerRangoSemana(fecha) {
    const dia = fecha.getDay();
    const diff = fecha.getDate() - dia + (dia === 0 ? -6 : 1);

    const inicio = new Date(fecha);
    inicio.setDate(diff);
    inicio.setHours(0, 0, 0, 0);

    const fin = new Date(inicio);
    fin.setDate(inicio.getDate() + 6);
    fin.setHours(23, 59, 59, 999);

    return { fechaInicio: inicio, fechaFin: fin };
}

export function verificarConflictoEventos(eventoNuevo, eventos) {
    const inicioNuevo = new Date(eventoNuevo.fechaInicio);
    const finNuevo = new Date(eventoNuevo.fechaFin);

    return eventos.some(evento => {
        const inicio = new Date(evento.fechaInicio);
        const fin = new Date(evento.fechaFin);
        return inicioNuevo < fin && finNuevo > inicio;
    });
}
