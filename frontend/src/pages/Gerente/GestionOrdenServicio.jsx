import React, { useState, useEffect } from 'react';
import * as ordenServicioApi from './ordenServicioApi';
import * as ordenApi from './ordenApi';
import { obtenerTodosServicios } from './servicioApi';
import './GestionOrdenServicio.css';

const GestionOrdenServicio = () => {
    const [ordenServicios, setOrdenServicios] = useState([]);
    const [ordenes, setOrdenes] = useState([]);
    const [servicios, setServicios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [mostrarFormulario, setMostrarFormulario] = useState(false);
    const [enviando, setEnviando] = useState(false);
    const [erroresValidacion, setErroresValidacion] = useState([]);
    const [busqueda, setBusqueda] = useState('');

    const [formData, setFormData] = useState({
        ordenId: 0,
        servicioId: 0,
        estado: 'PENDIENTE'
    });

    useEffect(() => {
        cargarDatos();
    }, []);

    const cargarDatos = async () => {
        try {
            setLoading(true);
            setError(null);

            // Cargar todas las relaciones orden-servicio
            const osData = await ordenServicioApi.obtenerTodasOrdenServicios();
            setOrdenServicios(osData || []);

            // Cargar órdenes disponibles
            const ordenesData = await ordenApi.obtenerTodasOrdenes();
            setOrdenes(ordenesData || []);

            // Cargar servicios disponibles
            const serviciosData = await obtenerTodosServicios();
            setServicios(serviciosData || []);
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
            [name]: name === 'ordenId' || name === 'servicioId' ? parseInt(value) : value
        }));
    };

    const handleCrear = async (e) => {
        e.preventDefault();

        const validacion = ordenServicioApi.validarDatosOrdenServicio(formData);
        if (!validacion.valido) {
            setErroresValidacion(validacion.errores);
            return;
        }

        try {
            setEnviando(true);
            setErroresValidacion([]);

            await ordenServicioApi.crearOrdenServicio(formData);

            alert('✅ Servicio asignado a la orden exitosamente');

            resetFormulario();
            await cargarDatos();
            setMostrarFormulario(false);
        } catch (err) {
            const mensajeError = err.message || 'Error al asignar el servicio';
            setErroresValidacion([mensajeError]);
            console.error('Error al crear:', err);
        } finally {
            setEnviando(false);
        }
    };

    const handleEliminar = async (id) => {
        const confirmar = window.confirm(
            '¿Estás seguro de eliminar esta asignación?\n\nEsta acción no se puede deshacer.'
        );

        if (!confirmar) return;

        try {
            setLoading(true);
            await ordenServicioApi.eliminarOrdenServicio(id);
            alert('✅ Asignación eliminada exitosamente');
            await cargarDatos();
        } catch (err) {
            alert('❌ Error al eliminar: ' + err.message);
            console.error('Error al eliminar:', err);
        } finally {
            setLoading(false);
        }
    };

    const resetFormulario = () => {
        setFormData({
            ordenId: 0,
            servicioId: 0,
            estado: 'PENDIENTE'
        });
        setErroresValidacion([]);
    };

    const cancelarFormulario = () => {
        resetFormulario();
        setMostrarFormulario(false);
    };

    const obtenerNombreOrden = (ordenId) => {
        const orden = ordenes.find(o => o.idOrden === ordenId);
        return orden ? `Orden #${orden.idOrden}` : `Orden #${ordenId}`;
    };

    const obtenerNombreServicio = (servicioId) => {
        const servicio = servicios.find(s => s.id === servicioId);
        return servicio ? servicio.nombreServicio : `Servicio #${servicioId}`;
    };

    const obtenerColorEstado = (estado) => {
        const colores = {
            PENDIENTE: '#ffc107',
            EN_PROGRESO: '#17a2b8',
            COMPLETADO: '#28a745',
            CANCELADO: '#dc3545'
        };
        return colores[estado] || '#6c757d';
    };

    const ordenServiciosFiltradas = ordenServicios.filter(os => {
        if (busqueda) {
            const busquedaLower = busqueda.toLowerCase();
            const nombreServicio = obtenerNombreServicio(os.servicioId).toLowerCase();
            const nombreOrden = obtenerNombreOrden(os.ordenId).toLowerCase();
            return (
                nombreServicio.includes(busquedaLower) ||
                nombreOrden.includes(busquedaLower) ||
                os.estado.toLowerCase().includes(busquedaLower)
            );
        }
        return true;
    });

    // Vista del formulario de creación
    if (mostrarFormulario) {
        return (
            <div className="gestion-container">
                <div className="breadcrumb">
                    <span className="breadcrumb-link" onClick={cancelarFormulario}>
                        ← Volver a Asignaciones
                    </span>
                </div>

                <div className="form-header">
                    <h1>Asignar Servicio a Orden</h1>
                    <p className="form-subtitle">
                        Seleccione una orden y un servicio para crear la asignación
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

                <form onSubmit={handleCrear}>
                    <div className="form-section">
                        <div className="section-header">
                            <span className="section-icon">🔗</span>
                            <div>
                                <h3>Información de la Asignación</h3>
                                <p>Seleccione la orden, el servicio y el estado inicial</p>
                            </div>
                        </div>

                        <div className="form-grid">
                            <div className="form-group">
                                <label htmlFor="ordenId">Orden*</label>
                                <select
                                    id="ordenId"
                                    name="ordenId"
                                    value={formData.ordenId}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value={0}>Seleccione una orden</option>
                                    {ordenes
                                        .filter(o => o.estadoOrden)
                                        .map(orden => (
                                            <option key={orden.idOrden} value={orden.idOrden}>
                                                Orden #{orden.idOrden} - Cliente #{orden.clienteId}
                                            </option>
                                        ))
                                    }
                                </select>
                            </div>

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
                                    {servicios
                                        .filter(s => s.estado)
                                        .map(servicio => (
                                            <option key={servicio.id} value={servicio.id}>
                                                {servicio.nombreServicio} - ${servicio.precio}
                                            </option>
                                        ))
                                    }
                                </select>
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
                                    {ordenServicioApi.ESTADOS.map(estado => (
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
                            {enviando ? 'Asignando...' : 'Asignar Servicio'}
                        </button>
                    </div>
                </form>
            </div>
        );
    }

    // Vista del listado
    return (
        <div className="gestion-container">
            <div className="catalog-header">
                <div>
                    <h1>Gestión de Servicios en Órdenes</h1>
                    <div className="breadcrumb">
                        <span>Orden-Servicio</span> › <span>Asignaciones</span>
                    </div>
                </div>
            </div>

            {error && (
                <div className="info-box info-box-error">
                    <div className="info-icon">⚠️</div>
                    <div>{error}</div>
                </div>
            )}

            <div className="search-bar">
                <input
                    type="text"
                    placeholder="Buscar por orden, servicio o estado..."
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                />
            </div>

            {loading && <div className="loading">Cargando asignaciones...</div>}

            {!loading && ordenServiciosFiltradas.length === 0 && (
                <div className="empty-state">
                    <p>No hay servicios asignados a órdenes</p>
                    {busqueda && <p>Intenta con otros términos de búsqueda</p>}
                </div>
            )}

            {!loading && ordenServiciosFiltradas.length > 0 && (
                <div className="services-list">
                    {ordenServiciosFiltradas.map(os => (
                        <div key={os.id} className="service-card">
                            <div className="service-info">
                                <div className="service-header">
                                    <h3>🔧 {obtenerNombreServicio(os.servicioId)}</h3>
                                    <span className="service-code">
                                        {obtenerNombreOrden(os.ordenId)}
                                    </span>
                                </div>
                                <div className="service-details">
                                    <span
                                        className="service-status"
                                        style={{
                                            backgroundColor: obtenerColorEstado(os.estado),
                                            color: 'white'
                                        }}
                                    >
                                        {os.estado}
                                    </span>
                                </div>
                            </div>
                            <div className="service-actions">
                                <button
                                    className="btn-icon btn-delete"
                                    onClick={() => handleEliminar(os.id)}
                                    title="Eliminar asignación"
                                >
                                    🗑️
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <div className="floating-actions">
                <button
                    className="btn btn-add-service"
                    onClick={() => {
                        resetFormulario();
                        setMostrarFormulario(true);
                    }}
                >
                    + Asignar Servicio a Orden
                </button>
            </div>
        </div>
    );
};

export default GestionOrdenServicio;