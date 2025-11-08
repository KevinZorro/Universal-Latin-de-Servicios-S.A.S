import React, { useState, useEffect } from 'react';
import {
    obtenerTodasOrdenes,
    crearOrden,
    eliminarOrden,
    validarDatosOrden,
    formatearFechaParaInput
} from './ordenApi';
import './GestionOrdenes.css';
import './GestionServicios.css'
import ClienteService from './ClienteService';

const GestionOrdenes = ({ onOrdenSeleccionada }) => {
    const [ordenes, setOrdenes] = useState([]);
    const [clientes, setClientes] = useState([]); // Debe cargarse desde clienteApi
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [mostrarFormulario, setMostrarFormulario] = useState(false);
    const [enviando, setEnviando] = useState(false);
    const [erroresValidacion, setErroresValidacion] = useState([]);
    const [busqueda, setBusqueda] = useState('');

    const [formData, setFormData] = useState({
        clienteId: 0,
        fechaCreacion: new Date().toISOString().slice(0, 16),
        fechaFin: '',
        estadoOrden: true
    });

    useEffect(() => {
        cargarOrdenes();
        cargarClientes();
    }, []);

    const cargarOrdenes = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await obtenerTodasOrdenes();
            setOrdenes(data || []);
        } catch (err) {
            setError('Error al cargar las órdenes: ' + err.message);
            console.error('Error:', err);
        } finally {
            setLoading(false);
        }
    };

    const cargarClientes = async () => {
        try {
            setError(null);
            const data = await ClienteService.getAllClientes();

            // Si el backend devuelve el formato HAL (_embedded)
            const listaClientes = data._embedded ? data._embedded.clienteList || [] : data;

            // Mapea a un formato más simple
            setClientes(listaClientes.map(c => ({
                id: c.id,
                nombre: `${c.nombres || ''} ${c.apellidos || ''}`.trim() || c.nombre || `Cliente #${c.id}`
            })));
        } catch (err) {
            setError('Error al cargar los clientes: ' + err.message);
            console.error('Error:', err);
        }
    };


    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : (name === 'clienteId' ? parseInt(value) : value)
        }));
    };

    const handleCrear = async (e) => {
        e.preventDefault();

        const validacion = validarDatosOrden(formData);
        if (!validacion.valido) {
            setErroresValidacion(validacion.errores);
            return;
        }

        try {
            setEnviando(true);
            setErroresValidacion([]);

            await crearOrden(formData);

            alert('✅ Orden creada exitosamente');

            resetFormulario();
            await cargarOrdenes();
            setMostrarFormulario(false);
        } catch (err) {
            const mensajeError = err.details?.message || err.message || 'Error al crear la orden';
            setErroresValidacion([mensajeError]);
            console.error('Error al crear:', err);
        } finally {
            setEnviando(false);
        }
    };

    const handleEliminar = async (idOrden) => {
        const confirmar = window.confirm(
            `¿Estás seguro de eliminar esta orden?\n\nEsta acción no se puede deshacer.`
        );

        if (!confirmar) return;

        try {
            setLoading(true);
            await eliminarOrden(idOrden);
            alert('✅ Orden eliminada exitosamente');
            await cargarOrdenes();
        } catch (err) {
            alert('❌ Error al eliminar la orden: ' + err.message);
            console.error('Error al eliminar:', err);
        } finally {
            setLoading(false);
        }
    };

    const resetFormulario = () => {
        setFormData({
            clienteId: 0,
            fechaCreacion: new Date().toISOString().slice(0, 16),
            fechaFin: '',
            estadoOrden: true
        });
        setErroresValidacion([]);
    };

    const cancelarFormulario = () => {
        resetFormulario();
        setMostrarFormulario(false);
    };

    const ordenesFiltradas = ordenes.filter(orden => {
        if (busqueda) {
            const busquedaLower = busqueda.toLowerCase();
            return (
                orden.idOrden.toString().includes(busquedaLower) ||
                (orden.clienteId && orden.clienteId.toString().includes(busquedaLower))
            );
        }
        return true;
    });

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

    if (mostrarFormulario) {
        return (
            <div className="gestion-ordenes-container">
                <div className="breadcrumb">
                    <span className="breadcrumb-link" onClick={cancelarFormulario}>
                        ← Volver a Órdenes
                    </span>
                </div>

                <div className="form-header">
                    <h1>Crear Nueva Orden</h1>
                    <p className="form-subtitle">
                        Complete la información para crear una orden de servicio
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

                <div className="info-box info-box-blue">
                    <div className="info-icon">ℹ️</div>
                    <div>
                        <strong>Información</strong>
                        <p>Después de crear la orden, podrá asignar servicios desde el detalle de la orden.</p>
                    </div>
                </div>

                <form onSubmit={handleCrear}>
                    <div className="form-section">
                        <div className="section-header">
                            <span className="section-icon">📋</span>
                            <div>
                                <h3>Información de la Orden</h3>
                                <p>Datos básicos de la orden de servicio</p>
                            </div>
                        </div>

                        <div className="form-grid">
                            <div className="form-group">
                                <label htmlFor="clienteId">Cliente*</label>
                                <select
                                    id="clienteId"
                                    name="clienteId"
                                    value={formData.clienteId}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value={0}>Seleccione un cliente</option>
                                    {clientes.map(cliente => (
                                        <option key={cliente.id} value={cliente.id}>
                                            {cliente.nombre}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-group">
                                <label htmlFor="fechaCreacion">Fecha de Creación*</label>
                                <input
                                    type="datetime-local"
                                    id="fechaCreacion"
                                    name="fechaCreacion"
                                    value={formData.fechaCreacion}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="fechaFin">Fecha de Finalización*</label>
                                <input
                                    type="datetime-local"
                                    id="fechaFin"
                                    name="fechaFin"
                                    value={formData.fechaFin}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label className="toggle-label">
                                    <span>Estado de la Orden</span>
                                    <div className="toggle-switch">
                                        <input
                                            type="checkbox"
                                            name="estadoOrden"
                                            checked={formData.estadoOrden}
                                            onChange={handleChange}
                                            id="estadoOrden"
                                        />
                                        <label htmlFor="estadoOrden" className="toggle-slider"></label>
                                    </div>
                                    <span className={`toggle-status ${formData.estadoOrden ? 'active' : 'inactive'}`}>
                                        {formData.estadoOrden ? 'Activa' : 'Inactiva'}
                                    </span>
                                </label>
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
                            {enviando ? 'Creando...' : 'Crear Orden'}
                        </button>
                    </div>
                </form>
            </div>
        );
    }

    return (
        <div className="gestion-ordenes-container">
            <div className="catalog-header">
                <div>
                    <h1>Gestión de Órdenes</h1>
                    <div className="breadcrumb">
                        <span>Órdenes</span> › <span>Lista de Órdenes</span>
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
                    placeholder="Buscar orden por ID..."
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                />
            </div>

            {loading && <div className="loading">Cargando órdenes...</div>}

            {!loading && ordenesFiltradas.length === 0 && (
                <div className="empty-state">
                    <p>No hay órdenes que mostrar</p>
                    {busqueda && <p>Intenta con otros términos de búsqueda</p>}
                </div>
            )}

            {!loading && ordenesFiltradas.length > 0 && (
                <div className="services-list">
                    {ordenesFiltradas.map(orden => (
                        <div key={orden.idOrden} className="service-card">
                            <div className="service-info">
                                <div className="service-header">
                                    <h3>Orden #{orden.idOrden}</h3>
                                    <span className="service-code">Cliente: {orden.clienteId}</span>
                                </div>
                                <div className="service-details">
                                    <span className="service-meta">
                                        📅 Creación: {formatearFecha(orden.fechaCreacion)}
                                    </span>
                                    <span className="service-meta">
                                        🏁 Fin: {formatearFecha(orden.fechaFin)}
                                    </span>
                                    <span className={`service-status ${orden.estadoOrden ? 'active' : 'inactive'}`}>
                                        {orden.estadoOrden ? 'Activa' : 'Inactiva'}
                                    </span>
                                </div>
                            </div>
                            <div className="service-actions">
                                <button
                                    className="btn-icon btn-view"
                                    onClick={() => onOrdenSeleccionada && onOrdenSeleccionada(orden.idOrden)}
                                    title="Ver detalles y servicios"
                                >
                                    👁️
                                </button>
                                <button
                                    className="btn-icon btn-delete"
                                    onClick={() => handleEliminar(orden.idOrden)}
                                    title="Eliminar orden"
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
                    + Crear Nueva Orden
                </button>
            </div>
        </div>
    );
};

export default GestionOrdenes;