// src/pages/ListarEmpleados.jsx
import React, { useState, useEffect } from 'react';
import './Dashboard.css';

const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:8080';

export default function ListarEmpleados() {
    const [empleados, setEmpleados] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    // Cargar empleados al montar el componente
    useEffect(() => {
        fetchEmpleados();
    }, []);

    const fetchEmpleados = async () => {
        setLoading(true);
        setError('');

        try {
            const token = localStorage.getItem('token');

            if (!token) {
                throw new Error('No se encontró token de autenticación');
            }

            console.log('Obteniendo empleados de:', `${API_BASE}/api/empleados`);

            const response = await fetch(`${API_BASE}/api/empleados`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            console.log('Status de respuesta:', response.status);

            if (!response.ok) {
                let errorMessage = 'Error al obtener empleados';

                try {
                    const fullErrorText = await response.text();
                    console.log('Respuesta del servidor:', fullErrorText);

                    try {
                        const errorData = JSON.parse(fullErrorText);
                        errorMessage = errorData.message || errorData.error || fullErrorText;
                    } catch {
                        errorMessage = fullErrorText || `Error ${response.status}: ${response.statusText}`;
                    }
                } catch {
                    errorMessage = `Error ${response.status}: ${response.statusText}`;
                }

                throw new Error(errorMessage);
            }

            const data = await response.json();
            console.log('Empleados obtenidos:', data);
            setEmpleados(data);

        } catch (err) {
            console.error('Error al cargar empleados:', err);
            setError(err.message || 'Error inesperado al cargar empleados');
        } finally {
            setLoading(false);
        }
    };

    // Filtrar empleados por búsqueda
    const empleadosFiltrados = empleados.filter(emp => {
        const searchLower = searchTerm.toLowerCase();
        return (
            emp.nombre?.toLowerCase().includes(searchLower) ||
            emp.apellido?.toLowerCase().includes(searchLower) ||
            emp.cedula?.toString().includes(searchLower) ||
            emp.email?.toLowerCase().includes(searchLower) ||
            emp.telefono?.includes(searchTerm)
        );
    });

    const getEstadoBadge = (activo) => {
        if (activo) {
            return <span className="activity-badge success">Activo</span>;
        }
        return <span className="activity-badge pending">Inactivo</span>;
    };

    const getRolBadge = (rol) => {
        const colors = {
            'GERENTE': 'info',
            'EMPLEADO': 'success',
            'ADMIN': 'pending',
        };
        return <span className={`activity-badge ${colors[rol] || 'info'}`}>{rol}</span>;
    };

    return (
        <div className="content-area">
            {/* Header */}
            <div className="content-header">
                <div>
                    <h1 className="content-title">Lista de Empleados</h1>
                    <p className="content-subtitle">
                        Gestiona y visualiza todos los empleados registrados en el sistema
                    </p>
                </div>
                <button className="btn-primary" onClick={fetchEmpleados} disabled={loading}>
                    {loading ? '🔄 Cargando...' : '🔄 Actualizar'}
                </button>
            </div>

            {/* Error Alert */}
            {error && (
                <div className="error-alert" style={{
                    backgroundColor: '#fee',
                    border: '1px solid #fcc',
                    borderRadius: '8px',
                    padding: '12px 16px',
                    marginBottom: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px'
                }}>
                    <span style={{ fontSize: '20px' }}>⚠️</span>
                    <p style={{ margin: 0, color: '#c33' }}>{error}</p>
                </div>
            )}

            {/* Barra de búsqueda y estadísticas */}
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '20px',
                gap: '20px'
            }}>
                <div style={{ flex: 1, maxWidth: '500px' }}>
                    <input
                        type="text"
                        className="form-input"
                        placeholder="🔍 Buscar por nombre, cédula, email o teléfono..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{ width: '100%' }}
                    />
                </div>
                <div className="stat-card" style={{
                    minWidth: '200px',
                    margin: 0,
                    padding: '12px 20px'
                }}>
                    <div className="stat-info">
                        <h3 className="stat-number">{empleadosFiltrados.length}</h3>
                        <p className="stat-label">
                            {searchTerm ? 'Resultados encontrados' : 'Total de empleados'}
                        </p>
                    </div>
                </div>
            </div>

            {/* Loading State */}
            {loading && (
                <div style={{
                    textAlign: 'center',
                    padding: '60px 20px',
                    color: '#666'
                }}>
                    <div style={{ fontSize: '48px', marginBottom: '16px' }}>⏳</div>
                    <p style={{ fontSize: '18px' }}>Cargando empleados...</p>
                </div>
            )}

            {/* Empty State */}
            {!loading && empleados.length === 0 && !error && (
                <div className="coming-soon">
                    <div className="coming-soon-icon">📭</div>
                    <h2 className="coming-soon-title">No hay empleados registrados</h2>
                    <p className="coming-soon-text">
                        Aún no se han registrado empleados en el sistema.
                    </p>
                </div>
            )}

            {/* No Results State */}
            {!loading && empleados.length > 0 && empleadosFiltrados.length === 0 && (
                <div className="coming-soon">
                    <div className="coming-soon-icon">🔍</div>
                    <h2 className="coming-soon-title">No se encontraron resultados</h2>
                    <p className="coming-soon-text">
                        No hay empleados que coincidan con "<strong>{searchTerm}</strong>"
                    </p>
                </div>
            )}

            {/* Tabla de empleados */}
            {!loading && empleadosFiltrados.length > 0 && (
                <div style={{
                    backgroundColor: 'white',
                    borderRadius: '12px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                    overflow: 'hidden'
                }}>
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{
                            width: '100%',
                            borderCollapse: 'collapse',
                        }}>
                            <thead>
                                <tr style={{
                                    backgroundColor: '#f8f9fa',
                                    borderBottom: '2px solid #e9ecef'
                                }}>
                                    <th style={tableHeaderStyle}>Cédula</th>
                                    <th style={tableHeaderStyle}>Nombre Completo</th>
                                    <th style={tableHeaderStyle}>Email</th>
                                    <th style={tableHeaderStyle}>Teléfono</th>
                                    <th style={tableHeaderStyle}>Fecha Ingreso</th>
                                    <th style={tableHeaderStyle}>Rol</th>
                                    <th style={tableHeaderStyle}>Estado</th>
                                    <th style={tableHeaderStyle}>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {empleadosFiltrados.map((empleado, index) => (
                                    <tr
                                        key={empleado.id || index}
                                        style={{
                                            borderBottom: '1px solid #e9ecef',
                                            transition: 'background-color 0.2s',
                                        }}
                                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8f9fa'}
                                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
                                    >
                                        <td style={tableCellStyle}>
                                            <strong>{empleado.cedula}</strong>
                                        </td>
                                        <td style={tableCellStyle}>
                                            <div>
                                                <div style={{ fontWeight: '500' }}>
                                                    {empleado.nombre} {empleado.apellido}
                                                </div>
                                            </div>
                                        </td>
                                        <td style={tableCellStyle}>
                                            <a
                                                href={`mailto:${empleado.email}`}
                                                style={{ color: '#4a90e2', textDecoration: 'none' }}
                                            >
                                                {empleado.email}
                                            </a>
                                        </td>
                                        <td style={tableCellStyle}>
                                            {empleado.telefono || 'N/A'}
                                        </td>
                                        <td style={tableCellStyle}>
                                            {empleado.fechaIngreso ? new Date(empleado.fechaIngreso).toLocaleDateString('es-CO') : 'N/A'}
                                        </td>
                                        <td style={tableCellStyle}>
                                            {getRolBadge(empleado.rol)}
                                        </td>
                                        <td style={tableCellStyle}>
                                            {getEstadoBadge(empleado.activo)}
                                        </td>
                                        <td style={tableCellStyle}>
                                            <div style={{
                                                display: 'flex',
                                                gap: '8px',
                                                justifyContent: 'center'
                                            }}>
                                                <button
                                                    style={actionButtonStyle}
                                                    title="Ver detalles"
                                                    onClick={() => alert(`Ver detalles de ${empleado.nombre}`)}
                                                >
                                                    👁️
                                                </button>
                                                <button
                                                    style={actionButtonStyle}
                                                    title="Editar"
                                                    onClick={() => alert(`Editar ${empleado.nombre}`)}
                                                >
                                                    ✏️
                                                </button>
                                                <button
                                                    style={{ ...actionButtonStyle, color: '#dc3545' }}
                                                    title="Eliminar"
                                                    onClick={() => {
                                                        if (window.confirm(`¿Está seguro de eliminar a ${empleado.nombre} ${empleado.apellido}?`)) {
                                                            alert('Función de eliminar pendiente de implementar');
                                                        }
                                                    }}
                                                >
                                                    🗑️
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Footer con resumen */}
                    <div style={{
                        padding: '16px 20px',
                        backgroundColor: '#f8f9fa',
                        borderTop: '1px solid #e9ecef',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        fontSize: '14px',
                        color: '#666'
                    }}>
                        <div>
                            Mostrando <strong>{empleadosFiltrados.length}</strong> de <strong>{empleados.length}</strong> empleados
                        </div>
                        <div>
                            Activos: <strong style={{ color: '#28a745' }}>
                                {empleados.filter(e => e.activo).length}
                            </strong>
                            {' | '}
                            Inactivos: <strong style={{ color: '#ffc107' }}>
                                {empleados.filter(e => !e.activo).length}
                            </strong>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

// Estilos inline para la tabla
const tableHeaderStyle = {
    padding: '16px',
    textAlign: 'left',
    fontWeight: '600',
    fontSize: '14px',
    color: '#495057',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
};

const tableCellStyle = {
    padding: '16px',
    fontSize: '14px',
    color: '#212529',
};

const actionButtonStyle = {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: '18px',
    padding: '4px 8px',
    borderRadius: '4px',
    transition: 'background-color 0.2s',
};