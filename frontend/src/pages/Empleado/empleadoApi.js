const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:8080/api';

// Headers con Token
const getHeaders = () => {
    const token = localStorage.getItem('token');
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };
};

export const obtenerMisAsignaciones = async (cedula) => {
    try {
        if (!cedula) throw new Error("Cédula no proporcionada");

        // 1. Obtener las asignaciones del empleado
        const response = await fetch(`${API_BASE}/asignaciones/empleado/${cedula}`, {
            method: 'GET',
            headers: getHeaders()
        });

        if (!response.ok) {
            throw new Error(`Error ${response.status}: No se pudieron obtener las asignaciones`);
        }

        const data = await response.json();

        // Aplanar la respuesta agrupada (pendientes, enProceso, etc.)
        let listaAsignaciones = [
            ...(data.pendientes || []),
            ...(data.enProceso || []),
            ...(data.finalizados || []),
            ...(data.cancelados || [])
        ];

        if (listaAsignaciones.length === 0) return [];

        // 2. CARGAR CATÁLOGOS PARA CRUZAR DATOS
        // Obtenemos todos los servicios, órdenes y clientes para buscar por ID
        const [serviciosRes, ordenesRes, clientesRes] = await Promise.all([
            fetch(`${API_BASE}/servicios`, { headers: getHeaders() }),
            fetch(`${API_BASE}/ordenes`, { headers: getHeaders() }),
            fetch(`${API_BASE}/clientes`, { headers: getHeaders() })
        ]);

        const servicios = serviciosRes.ok ? await serviciosRes.json() : [];
        const ordenes = ordenesRes.ok ? await ordenesRes.json() : [];
        
        // Manejo seguro de clientes (por si viene paginado)
        const clientesData = clientesRes.ok ? await clientesRes.json() : {};
        const clientes = clientesData._embedded ? clientesData._embedded.clienteList : (Array.isArray(clientesData) ? clientesData : []);

        // 3. CRUZAR INFORMACIÓN (Mapeo completo)
        return listaAsignaciones.map(asig => {
            // Buscar los objetos completos usando los IDs de la asignación
            const servicio = servicios.find(s => s.id === asig.servicioId);
            const orden = ordenes.find(o => o.idOrden === asig.ordenId);
            
            let cliente = null;
            if (orden) {
                cliente = clientes.find(c => c.id === orden.clienteId);
            }

            return {
                // Datos originales de la asignación
                id: asig.id,
                estado: asig.estado,
                fechaAsignacion: asig.fechaAsignacion || asig.fecha, // Usar la fecha que viene del backend

                // Datos enriquecidos del Servicio (ServicioDto)
                servicioNombre: servicio ? servicio.nombreServicio : `Servicio #${asig.servicioId}`,
                servicioDescripcion: servicio ? servicio.descripcion : "Sin descripción disponible",
                servicioTipoHorario: servicio ? servicio.tipoHorario : "No especificado",
                
                // Datos enriquecidos de la Orden
                ordenId: asig.ordenId,
                ordenFechaCreacion: orden ? orden.fechaCreacion : null, // Fecha creación orden
                ordenFechaFin: orden ? orden.fechaFin : null, // Fecha creación orden
                
                // Datos enriquecidos del Cliente
                clienteNombre: cliente ? (cliente.nombre || `${cliente.nombres} ${cliente.apellidos}`) : "Cliente Desconocido",
                clienteDireccion: cliente ? cliente.direccion : "Sin dirección registrada",
                clienteTelefono: cliente ? cliente.telefono : "Sin teléfono registrado",
                clienteEmail: cliente ? cliente.email : "Sin email registrado"
            };
        });

    } catch (error) {
        console.error("Error en obtenerMisAsignaciones:", error);
        throw error;
    }
};