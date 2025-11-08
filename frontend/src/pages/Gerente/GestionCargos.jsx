// src/pages/GestionCargos.jsx
import React, { useState, useEffect } from 'react';
import { cargosService } from '../Gerente/apiService';
import './Dashboard.css';

export default function GestionCargos() {
    const [cargos, setCargos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    // Estados para el modal
    const [showModal, setShowModal] = useState(false);
    const [modalMode, setModalMode] = useState('create'); // 'create' o 'edit'
    const [selectedCargo, setSelectedCargo] = useState(null);

    // Estados para el formulario
    const [formData, setFormData] = useState({
        nombre: '',
        descripcion: '',
    });
    const [formLoading, setFormLoading] = useState(false);

    // Cargar cargos al montar el componente
    useEffect(() => {
        fetchCargos();
    }, []);

    const fetchCargos = async () => {
        setLoading(true);
        setError('');

        try {
            const data = await cargosService.getAll();
            console.log('Cargos obtenidos:', data);

            // Si la respuesta viene con HATEOAS (_embedded), extraer los cargos
            const cargosArray = data._embedded?.cargoList || data._embedded?.tiposEmpleado || data;
            setCargos(Array.isArray(cargosArray) ? cargosArray : []);

        } catch (err) {
            console.error('Error al cargar cargos:', err);
            setError(err.message || 'Error inesperado al cargar tipos de empleado');
        } finally {
            setLoading(false);
        }
    };

    // Filtrar cargos por búsqueda
    const cargosFiltrados = cargos.filter(cargo => {
        const searchLower = searchTerm.toLowerCase();
        return (
            cargo.nombre?.toLowerCase().includes(searchLower) ||
            cargo.descripcion?.toLowerCase().includes(searchLower)
        );
    });

    // Abrir modal para crear
    const handleCrearNuevo = () => {
        setModalMode('create');
        setFormData({ nombre: '', descripcion: '' });
        setShowModal(true);
    };

    // Abrir modal para editar
    const handleEditar = (cargo) => {
        setModalMode('edit');
        setSelectedCargo(cargo);
        setFormData({
            nombre: cargo.nombre || '',
            descripcion: cargo.descripcion || '',
        });
        setShowModal(true);
    };

    // Cerrar modal
    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedCargo(null);
        setFormData({ nombre: '', descripcion: '' });
        setError('');
    };

    // Manejar cambios en el formulario
    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // Guardar cargo (crear o actualizar)
    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormLoading(true);
        setError('');

        try {
            if (modalMode === 'create') {
                await cargosService.create(formData);
                alert('✅ Tipo de empleado creado exitosamente');
            } else {
                await cargosService.update(selectedCargo.id, formData);
                alert('✅ Tipo de empleado actualizado exitosamente');
            }

            handleCloseModal();
            fetchCargos(); // Recargar la lista

        } catch (err) {
            console.error('Error al guardar:', err);
            setError(err.message || 'Error al guardar el tipo de empleado');
        } finally {
            setFormLoading(false);
        }
    };

    // Eliminar cargo
    const handleEliminar = async (cargo) => {
        if (!window.confirm(`¿Está seguro de eliminar el tipo de empleado "${cargo.nombre}"?`)) {
            return;
        }

        try {
            await cargosService.delete(cargo.id);
            alert('✅ Tipo de empleado eliminado exitosamente');
            fetchCargos(); // Recargar la lista
        } catch (err) {
            console.error('Error al eliminar:', err);
            alert(`❌ Error al eliminar: ${err.message}`);
        }
    };

    return (
        <div className="content-area">
            {/* Header */}
            <div className="content-header">
                <div>
                    <h1 className="content-title">Gestión de Tipos de Empleado</h1>
                    <p className="content-subtitle">
                        Administra los diferentes tipos de cargos disponibles en el sistema
                    </p>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <button className="btn-primary" onClick={fetchCargos} disabled={loading}>
                        {loading ? '🔄 Cargando...' : '🔄 Actualizar'}
                    </button>
                    <button
                        className="btn-primary"
                        onClick={handleCrearNuevo}
                        style={{ backgroundColor: '#28a745' }}
                    >
                        ➕ Nuevo Tipo
                    </button>
                </div>
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
                        placeholder="🔍 Buscar por nombre o descripción..."
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
                        <h3 className="stat-number">{cargosFiltrados.length}</h3>
                        <p className="stat-label">
                            {searchTerm ? 'Resultados' : 'Total de tipos'}
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
                    <p style={{ fontSize: '18px' }}>Cargando tipos de empleado...</p>
                </div>
            )}

            {/* Empty State */}
            {!loading && cargos.length === 0 && !error && (
                <div className="coming-soon">
                    <div className="coming-soon-icon">📭</div>
                    <h2 className="coming-soon-title">No hay tipos de empleado registrados</h2>
                    <p className="coming-soon-text">
                        Crea el primer tipo de empleado haciendo clic en "Nuevo Tipo"
                    </p>
                </div>
            )}

            {/* Grid de Cards */}
            {!loading && cargosFiltrados.length > 0 && (
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                    gap: '20px',
                }}>
                    {cargosFiltrados.map((cargo) => (
                        <div
                            key={cargo.id}
                            style={{
                                backgroundColor: 'white',
                                borderRadius: '12px',
                                padding: '24px',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                                transition: 'transform 0.2s, box-shadow 0.2s',
                                cursor: 'pointer',
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-4px)';
                                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
                            }}
                        >
                            {/* Header de la card */}
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'start',
                                marginBottom: '16px'
                            }}>
                                <div style={{ flex: 1 }}>
                                    <h3 style={{
                                        margin: 0,
                                        fontSize: '20px',
                                        fontWeight: '600',
                                        color: '#333',
                                        marginBottom: '8px'
                                    }}>
                                        {cargo.nombre}
                                    </h3>
                                    <span style={{
                                        fontSize: '12px',
                                        color: '#666',
                                        backgroundColor: '#f0f0f0',
                                        padding: '4px 8px',
                                        borderRadius: '4px'
                                    }}>
                                        ID: {cargo.id}
                                    </span>
                                </div>
                            </div>

                            {/* Botones de acción */}
                            <div style={{
                                display: 'flex',
                                gap: '8px',
                                paddingTop: '16px',
                                borderTop: '1px solid #e9ecef'
                            }}>
                                <button
                                    style={{
                                        flex: 1,
                                        padding: '8px 16px',
                                        backgroundColor: '#4a90e2',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '6px',
                                        cursor: 'pointer',
                                        fontSize: '14px',
                                        fontWeight: '500',
                                        transition: 'background-color 0.2s',
                                    }}
                                    onClick={() => handleEditar(cargo)}
                                >
                                    ✏️ Editar
                                </button>
                                <button
                                    style={{
                                        flex: 1,
                                        padding: '8px 16px',
                                        backgroundColor: '#dc3545',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '6px',
                                        cursor: 'pointer',
                                        fontSize: '14px',
                                        fontWeight: '500',
                                        transition: 'background-color 0.2s',
                                    }}
                                    onClick={() => handleEliminar(cargo)}
                                >
                                    🗑️ Eliminar
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* No Results State */}
            {!loading && cargos.length > 0 && cargosFiltrados.length === 0 && (
                <div className="coming-soon">
                    <div className="coming-soon-icon">🔍</div>
                    <h2 className="coming-soon-title">No se encontraron resultados</h2>
                    <p className="coming-soon-text">
                        No hay tipos de empleado que coincidan con "<strong>{searchTerm}</strong>"
                    </p>
                </div>
            )}

            {/* Modal para crear/editar */}
            {showModal && (
                <div style={modalOverlayStyle} onClick={handleCloseModal}>
                    <div style={modalContentStyle} onClick={(e) => e.stopPropagation()}>
                        <div style={modalHeaderStyle}>
                            <h2 style={{ margin: 0, fontSize: '24px', color: '#333' }}>
                                {modalMode === 'create' ? '➕ Nuevo Tipo de Empleado' : '✏️ Editar Tipo de Empleado'}
                            </h2>
                            <button onClick={handleCloseModal} style={closeButtonStyle}>✕</button>
                        </div>

                        <form onSubmit={handleSubmit} style={modalBodyStyle}>
                            <div style={{ marginBottom: '20px' }}>
                                <label style={labelStyle}>
                                    Nombre del Cargo <span style={{ color: 'red' }}>*</span>
                                </label>
                                <input
                                    type="text"
                                    name="nombre"
                                    value={formData.nombre}
                                    onChange={handleFormChange}
                                    className="form-input"
                                    placeholder="Ej: Conserje, Portero, Jardinero"
                                    required
                                    disabled={formLoading}
                                    style={{ width: '100%' }}
                                />
                            </div>

                            <div style={{ marginBottom: '20px' }}>
                                <label style={labelStyle}>Descripción</label>
                                <textarea
                                    name="descripcion"
                                    value={formData.descripcion}
                                    onChange={handleFormChange}
                                    className="form-input"
                                    placeholder="Descripción del cargo..."
                                    rows="4"
                                    disabled={formLoading}
                                    style={{ width: '100%', resize: 'vertical' }}
                                />
                            </div>

                            <div style={modalFooterStyle}>
                                <button
                                    type="button"
                                    onClick={handleCloseModal}
                                    disabled={formLoading}
                                    style={{
                                        padding: '10px 20px',
                                        backgroundColor: 'transparent',
                                        color: '#666',
                                        border: '1px solid #ddd',
                                        borderRadius: '8px',
                                        cursor: formLoading ? 'not-allowed' : 'pointer',
                                        fontSize: '14px',
                                        fontWeight: '500',
                                    }}
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    disabled={formLoading}
                                    style={{
                                        padding: '10px 20px',
                                        backgroundColor: formLoading ? '#ccc' : '#4a90e2',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '8px',
                                        cursor: formLoading ? 'not-allowed' : 'pointer',
                                        fontSize: '14px',
                                        fontWeight: '500',
                                    }}
                                >
                                    {formLoading ? 'Guardando...' : (modalMode === 'create' ? 'Crear' : 'Actualizar')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

// Estilos del modal
const modalOverlayStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    padding: '20px',
};

const modalContentStyle = {
    backgroundColor: 'white',
    borderRadius: '16px',
    maxWidth: '600px',
    width: '100%',
    maxHeight: '90vh',
    overflow: 'hidden',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
};

const modalHeaderStyle = {
    padding: '24px',
    borderBottom: '1px solid #e9ecef',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
};

const modalBodyStyle = {
    padding: '24px',
};

const modalFooterStyle = {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '12px',
    paddingTop: '20px',
    borderTop: '1px solid #e9ecef',
    marginTop: '20px',
};

const closeButtonStyle = {
    background: 'none',
    border: 'none',
    fontSize: '28px',
    cursor: 'pointer',
    color: '#666',
    padding: '0',
    width: '36px',
    height: '36px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '50%',
};

const labelStyle = {
    display: 'block',
    marginBottom: '8px',
    fontSize: '14px',
    fontWeight: '600',
    color: '#333',
};