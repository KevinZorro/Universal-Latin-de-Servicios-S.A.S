import React, { useState, useEffect } from 'react';
import { obtenerMisAsignaciones } from './empleadoApi';
import './EmployeeDashboard.css'; 

export default function MisAsignaciones({ cedula }) {
    const [asignaciones, setAsignaciones] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filtro, setFiltro] = useState('TODAS'); // Filtros por estado
    
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

    const handleVerDetalles = (asignacion) => {
        setSelectedAsignacion(asignacion);
        setShowModal(true);
    };

    const cerrarModal = () => {
        setShowModal(false);
        setSelectedAsignacion(null);
    };

    // Lógica de Filtrado por Estado (Normalizando mayúsculas)
    const asignacionesFiltradas = asignaciones.filter(asig => {
        if (filtro === 'TODAS') return true;
        return asig.estado && asig.estado.toUpperCase() === filtro;
    });

    return (
        <div className="mis-asignaciones-container">
            <div className="section-header">
                <div>
                    <h2>📋 Mis Asignaciones</h2>
                    <p className="subtitle">Gestiona tus órdenes de trabajo asignadas</p>
                </div>
                <button className="btn-refresh" onClick={cargarDatos} disabled={loading} title="Actualizar">
                    🔄
                </button>
            </div>

            {/* Filtros por Estado */}
            <div className="filters-row">
                <button className={`filter-pill ${filtro === 'TODAS' ? 'active' : ''}`} onClick={() => setFiltro('TODAS')}>Todas</button>
                <button className={`filter-pill ${filtro === 'PENDIENTE' ? 'active' : ''}`} onClick={() => setFiltro('PENDIENTE')}>Pendientes</button>
                <button className={`filter-pill ${filtro === 'EN_PROCESO' ? 'active' : ''}`} onClick={() => setFiltro('EN_PROCESO')}>En Proceso</button>
                <button className={`filter-pill ${filtro === 'FINALIZADO' ? 'active' : ''}`} onClick={() => setFiltro('FINALIZADO')}>Finalizadas</button>
                <button className={`filter-pill ${filtro === 'CANCELADO' ? 'active' : ''}`} onClick={() => setFiltro('CANCELADO')}>Canceladas</button>
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
                            />
                        ))
                    ) : (
                        <div className="empty-state">
                            <span className="empty-icon">📭</span>
                            <h3>No hay asignaciones</h3>
                            <p>No tienes órdenes en estado <strong>{filtro.replace('_', ' ').toLowerCase()}</strong>.</p>
                        </div>
                    )}
                </div>
            )}

            {/* MODAL DE DETALLES (Centrado forzado con estilos inline) */}
            {showModal && selectedAsignacion && (
                <div 
                    className="modal-overlay" 
                    onClick={cerrarModal}
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: 'rgba(0,0,0,0.5)',
                        display: 'flex',
                        alignItems: 'center',     /* Centrado Vertical */
                        justifyContent: 'center', /* Centrado Horizontal */
                        zIndex: 10000
                    }}
                >
                    <div 
                        className="asignacion-modal" 
                        onClick={(e) => e.stopPropagation()}
                        style={{ margin: 0, maxHeight: '90vh', overflowY: 'auto' }}
                    >
                        <div className="modal-header">
                            <h3>📋 Detalles Completos</h3>
                            <button className="close-btn-modal" onClick={cerrarModal}>✕</button>
                        </div>
                        
                        <div className="modal-content-scroll">
                            {/* Sección 1: Servicio */}
                            <div className="detail-section">
                                <h4>🛠️ Información del Servicio</h4>
                                <div className="detail-row">
                                    <strong>Nombre:</strong> 
                                    <span>{selectedAsignacion.servicioNombre}</span>
                                </div>
                                <div className="detail-row">
                                    <strong>Descripción:</strong> 
                                    <p className="desc-text">{selectedAsignacion.servicioDescripcion || "Sin descripción"}</p>
                                </div>
                                <div className="detail-row">
                                    <strong>Horario:</strong> 
                                    <span className="tag-horario">{selectedAsignacion.servicioTipoHorario || "N/A"}</span>
                                </div>
                            </div>

                            {/* Sección 2: Orden */}
                            <div className="detail-section">
                                <h4>📦 Información de la Orden</h4>
                                <div className="detail-row">
                                    <strong>Nro. Orden:</strong> 
                                    <span>#{selectedAsignacion.ordenId}</span>
                                </div>
                                <div className="detail-row">
                                    <strong>Fecha Creación:</strong> 
                                    <span>
                                        {selectedAsignacion.ordenFechaCreacion 
                                            ? new Date(selectedAsignacion.ordenFechaCreacion).toLocaleString() 
                                            : 'No disponible'}
                                    </span>
                                </div>
                                {/* Cambio solicitado: Fecha Fin en lugar de Asignación */}
                                <div className="detail-row">
                                    <strong>Fecha Límite (Fin):</strong> 
                                    <span style={{color: '#dc3545', fontWeight: 'bold'}}>
                                        {/* Nota: Asegúrate de que tu API devuelva 'ordenFechaFin'. 
                                            Si no, mostrará 'No definida' */}
                                        {selectedAsignacion.ordenFechaFin 
                                            ? new Date(selectedAsignacion.ordenFechaFin).toLocaleString() 
                                            : 'No definida'}
                                    </span>
                                </div>
                            </div>

                            {/* Sección 3: Cliente */}
                            <div className="detail-section">
                                <h4>Información del cliente</h4>
                                <div className="detail-row">
                                    <strong>Cliente:</strong> <span>{selectedAsignacion.clienteNombre}</span>
                                </div>
                                <div className="detail-row">
                                    <strong>Dirección:</strong> <span>{selectedAsignacion.clienteDireccion}</span>
                                </div>
                                <div className="detail-row">
                                    <strong>Telefono:</strong> <span>{selectedAsignacion.clienteTelefono}</span>
                                </div>
                                <div className="detail-row">
                                    <strong>Correo:</strong> <span>{selectedAsignacion.clienteEmail}</span>
                                </div>
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

function AsignacionCard({ data, onVerDetalles }) {
    return (
        <div className="asignacion-card">
            <div className="card-header-row">
                <span className="service-badge">🛠️ {data.servicioNombre}</span>
                <span className={`status-badge status-${(data.estado || 'pendiente').toLowerCase()}`}>
                    {data.estado}
                </span>
            </div>
            
            <div className="card-body">
                <h3 className="orden-title">Orden #{data.ordenId}</h3>
                
                {/* CORRECCIÓN: Mostrar la dirección usando la propiedad 'direccion' del objeto data */}
                <div className="card-detail highlight">
                    <span className="icon">📍</span>
                    <div className="detail-content">
                        <span className="label">Dirección del Cliente</span>
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

            <div className="card-footer">
                <button className="btn-action primary" onClick={onVerDetalles}>
                    Ver Detalles
                </button>
            </div>
        </div>
    );
}