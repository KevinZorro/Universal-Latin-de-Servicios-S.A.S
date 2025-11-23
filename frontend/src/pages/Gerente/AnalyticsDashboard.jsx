// src/pages/AnalyticsDashboard.jsx
import React, { useState, useEffect } from 'react';
import { useAnalytics } from './useAnalytics';
import './AnalyticsDashboard.css';

export default function AnalyticsDashboard() {
    const {
        datosClientes,
        datosServicios,
        datosEmpleados,
        loading,
        error,
        cargarTodo
    } = useAnalytics();

    const [filtroActivo, setFiltroActivo] = useState('clientes');
    const [busqueda, setBusqueda] = useState('');
    const [fechaInicio, setFechaInicio] = useState('');
    const [fechaFin, setFechaFin] = useState('');

    useEffect(() => {
        cargarTodo();
    }, []);

    const filtrarDatos = () => {
        let datos = [];

        switch (filtroActivo) {
            case 'clientes':
                datos = datosClientes;
                break;
            case 'servicios':
                datos = datosServicios;
                break;
            case 'empleados':
                datos = datosEmpleados;
                break;
            default:
                datos = [];
        }

        // Filtrar por búsqueda
        if (busqueda) {
            datos = datos.filter(item => {
                const texto = JSON.stringify(item).toLowerCase();
                return texto.includes(busqueda.toLowerCase());
            });
        }

        return datos;
    };

    const datosFiltrados = filtrarDatos();

    return (
        <div className="analytics-container">
            <div className="analytics-header">
                <h1 className="analytics-title">📊 Análisis y Reportes</h1>
                <p className="analytics-subtitle">
                    Visualiza estadísticas detalladas por cliente, servicio y empleado
                </p>
            </div>

            {/* Pestañas de filtros */}
            <div className="analytics-tabs">
                <button
                    className={`tab-button ${filtroActivo === 'clientes' ? 'active' : ''}`}
                    onClick={() => setFiltroActivo('clientes')}
                >
                    <span className="tab-icon">👤</span>
                    Por Cliente
                </button>
                <button
                    className={`tab-button ${filtroActivo === 'servicios' ? 'active' : ''}`}
                    onClick={() => setFiltroActivo('servicios')}
                >
                    <span className="tab-icon">🔧</span>
                    Por Servicio
                </button>
                <button
                    className={`tab-button ${filtroActivo === 'empleados' ? 'active' : ''}`}
                    onClick={() => setFiltroActivo('empleados')}
                >
                    <span className="tab-icon">👥</span>
                    Por Empleado
                </button>
            </div>

            {/* Barra de búsqueda */}
            <div className="analytics-search-bar">
                <input
                    type="text"
                    placeholder="Buscar..."
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                    className="search-input"
                />
                <button
                    onClick={cargarTodo}
                    className="refresh-button"
                    disabled={loading.clientes || loading.servicios || loading.empleados}
                >
                    🔄 Actualizar
                </button>
            </div>

            {/* Mostrar errores */}
            {error && (
                <div className="analytics-error">
                    <span>⚠️</span> {error}
                </div>
            )}

            {/* Contenido según filtro activo */}
            <div className="analytics-content">
                {filtroActivo === 'clientes' && (
                    <ClientesAnalytics
                        datos={datosFiltrados}
                        loading={loading.clientes}
                    />
                )}
                {filtroActivo === 'servicios' && (
                    <ServiciosAnalytics
                        datos={datosFiltrados}
                        loading={loading.servicios}
                    />
                )}
                {filtroActivo === 'empleados' && (
                    <EmpleadosAnalytics
                        datos={datosFiltrados}
                        loading={loading.empleados}
                    />
                )}
            </div>
        </div>
    );
}

// Componente para análisis de clientes
function ClientesAnalytics({ datos, loading }) {
    if (loading) {
        return <div className="analytics-loading">Cargando análisis de clientes...</div>;
    }

    if (!datos || datos.length === 0) {
        return <div className="analytics-empty">No hay datos de clientes disponibles</div>;
    }

    return (
        <div className="analytics-section">
            <div className="analytics-summary">
                <div className="summary-card">
                    <h3>Total Clientes</h3>
                    <p className="summary-number">{datos.length}</p>
                </div>
                <div className="summary-card">
                    <h3>Total Órdenes</h3>
                    <p className="summary-number">
                        {datos.reduce((sum, c) => sum + c.totalOrdenes, 0)}
                    </p>
                </div>
                <div className="summary-card">
                    <h3>Promedio Órdenes</h3>
                    <p className="summary-number">
                        {(datos.reduce((sum, c) => sum + c.totalOrdenes, 0) / datos.length).toFixed(1)}
                    </p>
                </div>
            </div>

            <div className="analytics-table-container">
                <table className="analytics-table">
                    <thead>
                        <tr>
                            <th>Cliente</th>
                            <th>Email</th>
                            <th>Total Órdenes</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {datos.map((cliente) => (
                            <tr key={cliente.clienteId}>
                                <td>
                                    <div className="table-cell-main">{cliente.clienteNombre}</div>
                                </td>
                                <td>{cliente.clienteEmail}</td>
                                <td>
                                    <span className="badge badge-primary">
                                        {cliente.totalOrdenes}
                                    </span>
                                </td>
                                <td>
                                    <button className="btn-detail">Ver Detalle</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

// Componente para análisis de servicios
function ServiciosAnalytics({ datos, loading }) {
    const [mostrarDetalle, setMostrarDetalle] = useState(null);

    if (loading) {
        return <div className="analytics-loading">Cargando análisis de servicios...</div>;
    }

    if (!datos || datos.length === 0) {
        return <div className="analytics-empty">No hay datos de servicios disponibles</div>;
    }

    return (
        <div className="analytics-section">
            <div className="analytics-summary">
                <div className="summary-card">
                    <h3>Total Servicios</h3>
                    <p className="summary-number">{datos.length}</p>
                </div>
                <div className="summary-card">
                    <h3>Total Contrataciones</h3>
                    <p className="summary-number">
                        {datos.reduce((sum, s) => sum + s.totalContrataciones, 0)}
                    </p>
                </div>
                <div className="summary-card">
                    <h3>Más Contratado</h3>
                    <p className="summary-text">
                        {datos[0]?.servicioNombre || 'N/A'}
                    </p>
                </div>
            </div>

            <div className="analytics-table-container">
                <table className="analytics-table">
                    <thead>
                        <tr>
                            <th>Servicio</th>
                            <th>Contrataciones</th>
                            <th>Cantidad Total</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {datos.map((servicio) => (
                            <React.Fragment key={servicio.servicioId}>
                                <tr>
                                    <td>
                                        <div className="table-cell-main">{servicio.servicioNombre}</div>
                                    </td>
                                    <td>
                                        <span className="badge badge-success">
                                            {servicio.totalContrataciones}
                                        </span>
                                    </td>
                                    <td>{servicio.cantidadTotal}</td>
                                    <td>
                                        <button
                                            className="btn-detail"
                                            onClick={() => setMostrarDetalle(
                                                mostrarDetalle === servicio.servicioId
                                                    ? null
                                                    : servicio.servicioId
                                            )}
                                        >
                                            {mostrarDetalle === servicio.servicioId ? 'Ocultar' : 'Ver Meses'}
                                        </button>
                                    </td>
                                </tr>
                                {mostrarDetalle === servicio.servicioId && (
                                    <tr className="detail-row">
                                        <td colSpan="4">
                                            <div className="detail-content">
                                                <h4>Distribución por Mes</h4>
                                                <div className="month-grid">
                                                    {Object.entries(servicio.porMes).map(([mes, datos]) => (
                                                        <div key={mes} className="month-card">
                                                            <div className="month-label">{mes}</div>
                                                            <div className="month-data">
                                                                <span>Contrataciones: {datos.contrataciones}</span>
                                                                <span>Cantidad: {datos.cantidad}</span>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </React.Fragment>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

// Componente para análisis de empleados
function EmpleadosAnalytics({ datos, loading }) {
    if (loading) {
        return <div className="analytics-loading">Cargando análisis de empleados...</div>;
    }

    if (!datos || datos.length === 0) {
        return <div className="analytics-empty">No hay datos de empleados disponibles</div>;
    }

    return (
        <div className="analytics-section">
            <div className="analytics-summary">
                <div className="summary-card">
                    <h3>Total Empleados</h3>
                    <p className="summary-number">{datos.length}</p>
                </div>
                <div className="summary-card">
                    <h3>Total Asignaciones</h3>
                    <p className="summary-number">
                        {datos.reduce((sum, e) => sum + e.totalAsignaciones, 0)}
                    </p>
                </div>
                <div className="summary-card">
                    <h3>Más Activo</h3>
                    <p className="summary-text">
                        {datos[0]?.empleadoNombre || 'N/A'}
                    </p>
                </div>
            </div>

            <div className="analytics-table-container">
                <table className="analytics-table">
                    <thead>
                        <tr>
                            <th>Empleado</th>
                            <th>Total Asignaciones</th>
                            <th>Activas</th>
                            <th>Completadas</th>
                            <th>Pendientes</th>
                        </tr>
                    </thead>
                    <tbody>
                        {datos.map((empleado) => (
                            <tr key={empleado.empleadoId}>
                                <td>
                                    <div className="table-cell-main">{empleado.empleadoNombre}</div>
                                </td>
                                <td>
                                    <span className="badge badge-primary">
                                        {empleado.totalAsignaciones}
                                    </span>
                                </td>
                                <td>
                                    <span className="badge badge-success">
                                        {empleado.porEstado.activas}
                                    </span>
                                </td>
                                <td>
                                    <span className="badge badge-info">
                                        {empleado.porEstado.completadas}
                                    </span>
                                </td>
                                <td>
                                    <span className="badge badge-warning">
                                        {empleado.porEstado.pendientes}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}