import React, { useState, useEffect } from 'react';
// Importamos la nueva función
import { obtenerMisAsignaciones, actualizarEstadoServicio } from './empleadoApi';
import './EmployeeDashboard.css'; 

export default function MisAsignaciones({ cedula }) {
    const [asignaciones, setAsignaciones] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filtro, setFiltro] = useState('TODAS');
    
    // Estado para bloquear botones mientras se actualiza
    const [procesando, setProcesando] = useState(null);

    const [selectedAsignacion, setSelectedAsignacion] = useState(null);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        if (cedula) {
            cargarDatos();
        }
    }, [cedula]);

    const cargarDatos = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await obtenerMisAsignaciones(cedula);
            setAsignaciones(data || []);
        } catch (err) {
            console.error("Error cargando asignaciones:", err);
            setError("No se pudieron cargar tus asignaciones.");
        } finally {
            setLoading(false);
        }
    };

    // --- Lógica para cambiar estado ---
    const handleCambiarEstado = async (ordenServicioId, nuevoEstado) => {
        if (!window.confirm(`¿Deseas cambiar el estado a ${nuevoEstado}?`)) return;

        try {
            setProcesando(ordenServicioId); // Bloquear botón
            await actualizarEstadoServicio(ordenServicioId, nuevoEstado);
            
            // Actualizar la lista localmente para feedback inmediato
            await cargarDatos(); 
            alert("✅ Estado actualizado correctamente");
        } catch (err) {
            alert("❌ Error al actualizar estado: " + err.message);
        } finally {
            setProcesando(null); // Desbloquear
        }
    };

    const handleVerDetalles = (asignacion) => {
        setSelectedAsignacion(asignacion);
        setShowModal(true);
    };

    const cerrarModal = () => {
        setShowModal(false);
        setSelectedAsignacion(null);
    };

    const asignacionesFiltradas = asignaciones.filter(asig => {
        if (filtro === 'TODAS') return true;
        // Aseguramos comparación insensible a mayúsculas
        return asig.estado && asig.estado.toUpperCase() === filtro;
    });

    return (
        <div className="mis-asignaciones-container">
            <div className="section-header">
                <div>
                    <h2>📅 Mis Asignaciones</h2>
                    <p className="subtitle">Gestiona tus órdenes de trabajo asignadas</p>
                </div>
                <button className="btn-refresh" onClick={cargarDatos} disabled={loading}>🔄</button>
            </div>

            {/* Filtros por Estado */}
            <div className="filters-row">
                {['TODAS', 'PENDIENTE', 'EN_PROCESO', 'FINALIZADO', 'CANCELADO'].map(estado => (
                    <button 
                        key={estado}
                        className={`filter-pill ${filtro === estado ? 'active' : ''}`} 
                        onClick={() => setFiltro(estado)}
                    >
                        {estado.replace('_', ' ')}
                    </button>
                ))}
            </div>

            {error && <div className="alert-error">{error}</div>}

            {loading ? (
                <div className="loading-state"><div className="spinner"></div><p>Cargando agenda...</p></div>
            ) : (
                <div className="asignaciones-list">
                    {asignacionesFiltradas.length > 0 ? (
                        asignacionesFiltradas.map((item) => (
                            <AsignacionCard 
                                key={item.id} 
                                data={item} 
                                onVerDetalles={() => handleVerDetalles(item)}
                                onCambiarEstado={handleCambiarEstado}
                                procesando={procesando === item.ordenServicioId}
                            />
                        ))
                    ) : (
                        <div className="empty-state">
                            <span className="empty-icon">📭</span>
                            <h3>No hay asignaciones</h3>
                            <p>No tienes órdenes en estado <strong>{filtro}</strong>.</p>
                        </div>
                    )}
                </div>
            )}

            {/* MODAL DE DETALLES */}
            {showModal && selectedAsignacion && (
                <div className="modal-overlay-centered" onClick={cerrarModal} 
                     style={{
                        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                        backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 9999,
                        display: 'flex', justifyContent: 'center', alignItems: 'center'
                     }}>
                    <div className="asignacion-modal" onClick={(e) => e.stopPropagation()}
                         style={{ margin: 0, maxHeight: '90vh', overflowY: 'auto' }}>
                        
                        <div className="modal-header">
                            <h3>📋 Detalles Completos</h3>
                            <button className="close-btn-modal" onClick={cerrarModal}>✕</button>
                        </div>
                        
                        <div className="modal-content-scroll">
                            <div className="detail-section">
                                <h4>🛠️ Información del Servicio</h4>
                                <div className="detail-row"><strong>Nombre:</strong> {selectedAsignacion.servicioNombre}</div>
                                <div className="detail-row"><strong>Descripción:</strong> <p className="desc-text">{selectedAsignacion.servicioDescripcion}</p></div>
                                <div className="detail-row"><strong>Horario:</strong> <span className="tag-horario">{selectedAsignacion.servicioTipoHorario}</span></div>
                            </div>

                            <div className="detail-section">
                                <h4>📦 Información de la Orden</h4>
                                <div className="detail-row"><strong>Nro. Orden:</strong> <span>#{selectedAsignacion.ordenId}</span></div>
                                <div className="detail-row"><strong>Fecha Creación:</strong> <span>{new Date(selectedAsignacion.ordenFechaCreacion).toLocaleString()}</span></div>
                                <div className="detail-row">
                                    <strong>Fecha Fin (Límite):</strong> 
                                    <span style={{ color: '#dc3545', fontWeight: 'bold' }}>
                                        {selectedAsignacion.ordenFechaFin ? new Date(selectedAsignacion.ordenFechaFin).toLocaleString() : 'No definida'}
                                    </span>
                                </div>
                            </div>

                            <div className="detail-section">
                                <h4>📍 Ubicación y Cliente</h4>
                                <div className="detail-row"><strong>Cliente:</strong> <span>{selectedAsignacion.clienteNombre}</span></div>
                                <div className="detail-row"><strong>Dirección:</strong> <span>{selectedAsignacion.clienteDireccion}</span></div>
                                <div className="detail-row"><strong>Teléfono:</strong> <span>{selectedAsignacion.clienteTelefono}</span></div>
                                <div className="detail-row"><strong>Email:</strong> <span>{selectedAsignacion.clienteEmail}</span></div>
                            </div>
                        </div>

                        <div className="modal-footer">
                            <button className="btn-action primary" onClick={cerrarModal}>Cerrar</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

function AsignacionCard({ data, onVerDetalles, onCambiarEstado, procesando }) {
    const estadoUpper = data.estado ? data.estado.toUpperCase() : 'PENDIENTE';

    return (
        <div className="asignacion-card">
            <div className="card-header-row">
                <span className="service-badge">🛠️ {data.servicioNombre}</span>
                <span className={`status-badge status-${estadoUpper.toLowerCase()}`}>
                    {data.estado}
                </span>
            </div>
            
            <div className="card-body">
                <h3 className="orden-title">Orden #{data.ordenId}</h3>
                
                <div className="card-detail highlight">
                    <span className="icon">📍</span>
                    <div className="detail-content">
                        <span className="label">Dirección del Cliente</span>
                        {/* Usamos clienteDireccion como en tu código original */}
                        <span className="value address-value">{data.clienteDireccion}</span>
                    </div>
                </div>

                <div className="card-detail">
                    <span className="icon">🏢</span>
                    <div className="detail-content">
                        <span className="label">Cliente</span>
                        <span className="value">{data.clienteNombre}</span>
                    </div>
                </div>
            </div>

            <div className="card-footer" style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                {/* Botones de Acción Dinámicos */}
                {estadoUpper === 'PENDIENTE' && (
                    <button 
                        className="btn-action start"
                        style={{ backgroundColor: '#3498db', color: 'white', flex: 1 }}
                        onClick={() => onCambiarEstado(data.ordenServicioId, 'EN_PROCESO')}
                        disabled={procesando}
                    >
                        {procesando ? '⏳...' : '▶ Iniciar'}
                    </button>
                )}

                {estadoUpper === 'EN_PROCESO' && (
                    <button 
                        className="btn-action complete"
                        style={{ backgroundColor: '#27ae60', color: 'white', flex: 1 }}
                        onClick={() => onCambiarEstado(data.ordenServicioId, 'FINALIZADO')}
                        disabled={procesando}
                    >
                        {procesando ? '⏳...' : '✅ Finalizar'}
                    </button>
                )}

                <button className="btn-action primary" onClick={onVerDetalles} style={{ flex: 1 }}>
                    Ver Detalles
                </button>
            </div>
        </div>
    );
}