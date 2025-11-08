import React, { useState, useEffect } from 'react';
import {
    obtenerOrdenPorId,
    obtenerServiciosPorOrden,
    asociarServicioAOrden,
    eliminarOrdenServicio,
    validarDatosOrdenServicio,
    ESTADOS_ORDEN_SERVICIO,
    obtenerEstadisticasEstados
} from './ordenApi';
import { obtenerTodosServicios } from './servicioApi';
import './GestionOrdenes.css';

const GestionServiciosOrden = ({ ordenId, onVolver }) => {
    const [orden, setOrden] = useState(null);
    const [serviciosOrden, setServiciosOrden] = useState([]);
    const [serviciosDisponibles, setServiciosDisponibles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [mostrarFormulario, setMostrarFormulario] = useState(false);
    const [enviando, setEnviando] = useState(false);
    const [erroresValidacion, setErroresValidacion] = useState([]);

    const [formData, setFormData] = useState({
        ordenId: ordenId,
        servicioId: 0,
        estado: 'PENDIENTE'
    });

    useEffect(() => {
        cargarDatos();
    }, [ordenId]);

    const cargarDatos = async () => {
        try {
            setLoading(true);
            setError(null);

            // Cargar orden
            const ordenData = await obtenerOrdenPorId(ordenId);
            setOrden(ordenData);

            // Cargar servicios asociados a la orden
            const serviciosAsociados = await obtenerServiciosPorOrden(ordenId);
            setServiciosOrden(serviciosAsociados);

            // Cargar todos los servicios disponibles
            const todosServicios = await obtenerTodosServicios();
            setServiciosDisponibles(todosServicios.filter(s => s.estado === true));

        } catch (err) {
            setError('Error al cargar los datos: ' + err.message);
            console.error('Error:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'servicioId' ? parseInt(value) : value
        }));
    };

    const handleAsociarServicio = async (e) => {
        e.preventDefault();

        const validacion = validarDatosOrdenServicio(formData);
        if (!validacion.valido) {
            setErroresValidacion(validacion.errores);
            return;
        }

        try {
            setEnviando(true);
            setErroresValidacion([]);

            await asociarServicioAOrden(formData);

            alert('✅ Servicio asociado exitosamente');

            resetFormulario();
            await cargarDatos();
            setMostrarFormulario(false);
        } catch (err) {
            const mensajeError = err.details?.message || err.message || 'Error al asociar el servicio';
            setErroresValidacion([mensajeError]);
            console.error('Error al asociar:', err);
        } finally {
            setEnviando(false);
        }
    };

    const handleEliminarServicio = async (id) => {
        const confirmar = window.confirm(
            '¿Estás seguro de eliminar este servicio de la orden?\n\nEsta acción no se puede deshacer.'
        );

        if (!confirmar) return;

        try {
            setLoading(true);
            await eliminarOrdenServicio(id);
            alert('✅ Servicio eliminado de la orden');
            await cargarDatos();
        } catch (err) {
            alert('❌ Error al eliminar el servicio: ' + err.message);
            console.error('Error al eliminar:', err);
        } finally {
            setLoading(false);
        }
    };

    const resetFormulario = () => {
        setFormData({
            ordenId: ordenId,
            servicioId: 0,
            estado: 'PENDIENTE'
        });
        setErroresValidacion([]);
    };

    const cancelarFormulario = () => {
        resetFormulario();
        setMostrarFormulario(false);
    };

    const obtenerNombreServicio = (servicioId) => {
        const servicio = serviciosDisponibles.find(s => s.id === servicioId);
        return servicio ? servicio.nombreServicio : `Servicio ${servicioId}`;
    };

    const obtenerColorEstado = (estado) => {
        const estadoObj = ESTADOS_ORDEN_SERVICIO.find(e => e.value === estado);
        return estadoObj ? estadoObj.color : '#6c757d';
    };

    const obtenerLabelEstado = (estado) => {
        const estadoObj = ESTADOS_ORDEN_SERVICIO.find(e => e.value === estado);
        return estadoObj ? estadoObj.label : estado;
    };

    const formatearFecha = (fecha) => {
        if (!fecha) return 'N/A';
        return new Date(fecha).toLocaleString('es-ES', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const estadisticas = obtenerEstadisticasEstados(serviciosOrden);

    if (loading && !orden) {
        return (
            <div className="gestion-ordenes-container">
                <div className="loading">Cargando información de la orden...</div>
            </div>
        );
    }

    if (mostrarFormulario) {
        return (
            <div className="gestion-ordenes-container">
                <div className="breadcrumb">
                    <span className="breadcrumb-link" onClick={cancelarFormulario}>
                        ← Volver a Orden #{ordenId}
                    </span>
                </div>

                <div className="form-header">
                    <h1>Asociar Servicio a Orden</h1>
                    <p className="form-subtitle">
                        Seleccione el servicio que desea agregar a la orden #{ordenId}
                    </p>
                </div>

                {erroresValidacion.length > 0 && (
                    <div className="info-box info-box-error">
                        <div className="info-icon">⚠️</div>
                        <div>
                            {erroresValidacion.map((error, idx) => (
                                <div key={idx}>{error}</div>
                            ))}
                        </div>
                    </div>
                )}

                <form onSubmit={handleAsociarServicio}>
                    <div className="form-section">
                        <div className="section-header">
                            <span className="section-icon">🔗</span>
                            <div>
                                <h3>Información del Servicio</h3>
                                <p>Seleccione el servicio y su estado inicial</p>
                            </div>
                        </div>

                        <div className="form-grid">
                            <div className="form-group">
                                <label htmlFor="servicioId">Servicio*</label>
                                <select
                                    id="servicioId"
                                    name="servicioId"
                                    value={formData.servicioId}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value={0}>Seleccione un servicio</option>
                                    {serviciosDisponibles.map(servicio => (
                                        <option key={servicio.id} value={servicio.id}>
                                            {servicio.nombreServicio}
                                        </option>
                                    ))}
                                </select>
                                <small>Solo se muestran servicios activos</small>
                            </div>

                            <div className="form-group">
                                <label htmlFor="estado">Estado Inicial*</label>
                                <select
                                    id="estado"
                                    name="estado"
                                    value={formData.estado}
                                    onChange={handleChange}
                                    required
                                >
                                    {ESTADOS_ORDEN_SERVICIO.map(estado => (
                                        <option key={estado.value} value={estado.value}>
                                            {estado.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="form-actions-bottom">
                        <button
                            type="button"
                            className="btn btn-cancel"
                            onClick={cancelarFormulario}
                            disabled={enviando}
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="btn btn-save"
                            disabled={enviando}
                        >
                            {enviando ? 'Asociando...' : 'Asociar Servicio'}
                        </button>
                    </div>
                </form>
            </div>
        );
    }

    return (
        <div className="gestion-ordenes-container">
            <div className="breadcrumb">
                <span className="breadcrumb-link" onClick={onVolver}>
                    ← Volver a Órdenes
                </span>
            </div>

            <div className="orden-detalle-header">
                <div>
                    <h1>Orden #{orden?.idOrden}</h1>
                    <div className="orden-info-grid">
                        <div className="info-item">
                            <span className="info-label">Cliente:</span>
                            <span className="info-value">ID {orden?.clienteId}</span>
                        </div>
                        <div className="info-item">
                            <span className="info-label">Creación:</span>
                            <span className="info-value">{formatearFecha(orden?.fechaCreacion)}</span>
                        </div>
                        <div className="info-item">
                            <span className="info-label">Finalización:</span>
                            <span className="info-value">{formatearFecha(orden?.fechaFin)}</span>
                        </div>
                        <div className="info-item">
                            <span className="info-label">Estado:</span>
                            <span className={`badge ${orden?.estadoOrden ? 'badge-activo' : 'badge-inactivo'}`}>
                                {orden?.estadoOrden ? 'Activa' : 'Inactiva'}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {error && (
                <div className="info-box info-box-error">
                    <div className="info-icon">⚠️</div>
                    <div>{error}</div>
                </div>
            )}

            {/* Estadísticas */}
            <div className="estadisticas-container">
                <h3>Resumen de Servicios</h3>
                <div className="estadisticas-grid">
                    {ESTADOS_ORDEN_SERVICIO.map(estado => (
                        <div key={estado.value} className="estadistica-card">
                            <div className="estadistica-numero" style={{ color: estado.color }}>
                                {estadisticas[estado.value]}
                            </div>
                            <div className="estadistica-label">{estado.label}</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Lista de Servicios */}
            <div className="servicios-orden-section">
                <div className="section-title">
                    <h2>Servicios Asociados ({serviciosOrden.length})</h2>
                    <button
                        className="btn btn-add-small"
                        onClick={() => {
                            resetFormulario();
                            setMostrarFormulario(true);
                        }}
                    >
                        + Agregar Servicio
                    </button>
                </div>

                {loading && <div className="loading">Cargando servicios...</div>}

                {!loading && serviciosOrden.length === 0 && (
                    <div className="empty-state">
                        <p>📋 No hay servicios asociados a esta orden</p>
                        <p>Haz clic en "Agregar Servicio" para comenzar</p>
                    </div>
                )}

                {!loading && serviciosOrden.length > 0 && (
                    <div className="services-list">
                        {serviciosOrden.map(os => (
                            <div key={os.id} className="service-card">
                                <div className="service-info">
                                    <div className="service-header">
                                        <h3>{obtenerNombreServicio(os.servicioId)}</h3>
                                        <span
                                            className="service-code"
                                            style={{
                                                backgroundColor: obtenerColorEstado(os.estado) + '20',
                                                color: obtenerColorEstado(os.estado)
                                            }}
                                        >
                                            {obtenerLabelEstado(os.estado)}
                                        </span>
                                    </div>
                                    <div className="service-details">
                                        <span className="service-meta">
                                            ID: {os.id}
                                        </span>
                                        <span className="service-meta">
                                            Servicio ID: {os.servicioId}
                                        </span>
                                    </div>
                                </div>
                                <div className="service-actions">
                                    <button
                                        className="btn-icon btn-delete"
                                        onClick={() => handleEliminarServicio(os.id)}
                                        title="Eliminar servicio de la orden"
                                    >
                                        🗑️
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default GestionServiciosOrden;