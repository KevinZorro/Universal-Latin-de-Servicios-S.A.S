import React, { useState, useEffect } from 'react';
import * as ordenApi from './ordenApi';
import { obtenerTodosServicios } from './servicioApi';
import './ModalDetalleOrden.css';

const ModalDetalleOrden = ({ idOrden, onCerrar }) => {
    const [orden, setOrden] = useState(null);
    const [serviciosOrden, setServiciosOrden] = useState([]);
    const [todosServicios, setTodosServicios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [mostrarAgregarServicio, setMostrarAgregarServicio] = useState(false);

    useEffect(() => {
        if (idOrden) {
            cargarDetallesOrden();
        }
    }, [idOrden]);

    const cargarDetallesOrden = async () => {
        try {
            setLoading(true);
            setError(null);

            // Cargar información de la orden
            const ordenData = await ordenApi.obtenerOrdenPorId(idOrden);
            setOrden(ordenData);
        } catch (err) {
            setError('Error al cargar los detalles: ' + err.message);
            console.error('Error:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleEliminarServicio = async (ordenServicioId) => {
        const confirmar = window.confirm('¿Está seguro de eliminar este servicio de la orden?');
        if (!confirmar) return;

        try {
            await ordenApi.eliminarOrdenServicio(ordenServicioId);
            alert('✅ Servicio eliminado de la orden');
            await cargarDetallesOrden();
        } catch (err) {
            alert('❌ Error al eliminar servicio: ' + err.message);
            console.error('Error:', err);
        }
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

    // Cerrar modal al hacer clic fuera
    const handleClickFondo = (e) => {
        if (e.target.className === 'modal-overlay') {
            onCerrar();
        }
    };

    if (!idOrden) return null;

    return (
        <div className="modal-overlay" onClick={handleClickFondo}>
            <div className="modal-content">
                {/* Header del Modal */}
                <div className="modal-header">
                    <h2>📋 Detalles de la Orden #{idOrden}</h2>
                    <button className="btn-close" onClick={onCerrar}>✕</button>
                </div>

                {/* Contenido del Modal */}
                <div className="modal-body">
                    {loading && (
                        <div className="loading-modal">⏳ Cargando detalles...</div>
                    )}

                    {error && (
                        <div className="alert-modal alert-error">
                            ⚠️ {error}
                        </div>
                    )}

                    {!loading && orden && (
                        <>
                            {/* Información General */}
                            <div className="seccion-modal">
                                <h3>Información General</h3>
                                <div className="info-grid">
                                    <div className="info-item">
                                        <span className="info-label">ID Orden:</span>
                                        <span className="info-value">#{orden.idOrden}</span>
                                    </div>
                                    <div className="info-item">
                                        <span className="info-label">Cliente:</span>
                                        <span className="info-value">Cliente #{orden.clienteId}</span>
                                    </div>
                                    <div className="info-item">
                                        <span className="info-label">Fecha Creación:</span>
                                        <span className="info-value">{formatearFecha(orden.fechaCreacion)}</span>
                                    </div>
                                    <div className="info-item">
                                        <span className="info-label">Fecha Finalización:</span>
                                        <span className="info-value">{formatearFecha(orden.fechaFin)}</span>
                                    </div>
                                    <div className="info-item">
                                        <span className="info-label">Estado:</span>
                                        <span className={`badge-modal ${orden.estadoOrden ? 'badge-activo' : 'badge-inactivo'}`}>
                                            {orden.estadoOrden ? '✅ Activa' : '❌ Inactiva'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </div>

                {/* Footer del Modal */}
                <div className="modal-footer">
                    <button className="btn btn-cerrar" onClick={onCerrar}>
                        Cerrar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ModalDetalleOrden;