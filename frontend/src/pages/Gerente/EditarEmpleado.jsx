// src/pages/EditarEmpleado.jsx
import React, { useState, useEffect } from 'react';
import { empleadosService } from '../Gerente/apiService';
import './Dashboard.css';

export default function EditarEmpleado({ empleado, onClose, onSuccess }) {
    const [formData, setFormData] = useState({
        cedula: '',
        nombre: '',
        apellido: '',
        telefono: '',
        email: '',
        fechaIngreso: '',
        activo: true,
        rol: 'EMPLEADO',
        desprendiblePagoURL: '',
        hojaDeVidaURL: '',
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Cargar datos del empleado cuando el componente se monta
    useEffect(() => {
        if (empleado) {
            setFormData({
                cedula: empleado.cedula || '',
                nombre: empleado.nombre || '',
                apellido: empleado.apellido || '',
                telefono: empleado.telefono || '',
                email: empleado.email || '',
                fechaIngreso: empleado.fechaIngreso || '',
                activo: empleado.activo ?? true,
                rol: empleado.rol || 'EMPLEADO',
                desprendiblePagoURL: empleado.desprendiblePagoURL || '',
                hojaDeVidaURL: empleado.hojaDeVidaURL || '',
            });
        }
    }, [empleado]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            console.log('Actualizando empleado:', formData);

            // Actualizar usando la cédula como identificador
            const updated = await empleadosService.update(empleado.cedula, formData);

            console.log('Empleado actualizado:', updated);
            alert('✅ Empleado actualizado exitosamente');

            if (onSuccess) {
                onSuccess(updated);
            }

            if (onClose) {
                onClose();
            }

        } catch (err) {
            console.error('Error al actualizar empleado:', err);
            setError(err.message || 'Error inesperado al actualizar el empleado');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={modalOverlayStyle} onClick={onClose}>
            <div style={modalContentStyle} onClick={(e) => e.stopPropagation()}>
                {/* Header del Modal */}
                <div style={modalHeaderStyle}>
                    <div>
                        <h2 style={{ margin: 0, fontSize: '24px', color: '#333' }}>
                            ✏️ Editar Empleado
                        </h2>
                        <p style={{ margin: '4px 0 0 0', color: '#666', fontSize: '14px' }}>
                            Cédula: {empleado?.cedula}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        style={closeButtonStyle}
                        title="Cerrar"
                        disabled={loading}
                    >
                        ✕
                    </button>
                </div>

                {/* Error Alert */}
                {error && (
                    <div style={{
                        backgroundColor: '#fee',
                        border: '1px solid #fcc',
                        borderRadius: '8px',
                        padding: '12px 16px',
                        margin: '0 24px 16px 24px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px'
                    }}>
                        <span style={{ fontSize: '20px' }}>⚠️</span>
                        <p style={{ margin: 0, color: '#c33' }}>{error}</p>
                    </div>
                )}

                {/* Formulario */}
                <form onSubmit={handleSubmit} style={modalBodyStyle}>
                    {/* Información Personal */}
                    <section style={sectionStyle}>
                        <h3 style={sectionTitleStyle}>
                            <span style={{ marginRight: '8px' }}>👤</span>
                            Información Personal
                        </h3>
                        <div style={formRowStyle}>
                            <div style={formFieldStyle}>
                                <label style={labelStyle}>
                                    Cédula <span style={{ color: 'red' }}>*</span>
                                </label>
                                <input
                                    type="text"
                                    name="cedula"
                                    value={formData.cedula}
                                    className="form-input"
                                    disabled
                                    style={{ backgroundColor: '#f0f0f0', cursor: 'not-allowed' }}
                                />
                                <small style={{ color: '#666', fontSize: '12px' }}>
                                    La cédula no se puede modificar
                                </small>
                            </div>
                        </div>

                        <div style={formRowStyle}>
                            <div style={formFieldStyle}>
                                <label style={labelStyle}>
                                    Nombre <span style={{ color: 'red' }}>*</span>
                                </label>
                                <input
                                    type="text"
                                    name="nombre"
                                    value={formData.nombre}
                                    onChange={handleChange}
                                    className="form-input"
                                    placeholder="Ej: Juan Carlos"
                                    required
                                    disabled={loading}
                                />
                            </div>
                            <div style={formFieldStyle}>
                                <label style={labelStyle}>
                                    Apellido <span style={{ color: 'red' }}>*</span>
                                </label>
                                <input
                                    type="text"
                                    name="apellido"
                                    value={formData.apellido}
                                    onChange={handleChange}
                                    className="form-input"
                                    placeholder="Ej: Pérez García"
                                    required
                                    disabled={loading}
                                />
                            </div>
                        </div>
                    </section>

                    {/* Información de Contacto */}
                    <section style={sectionStyle}>
                        <h3 style={sectionTitleStyle}>
                            <span style={{ marginRight: '8px' }}>📞</span>
                            Información de Contacto
                        </h3>
                        <div style={formRowStyle}>
                            <div style={formFieldStyle}>
                                <label style={labelStyle}>
                                    Teléfono <span style={{ color: 'red' }}>*</span>
                                </label>
                                <input
                                    type="tel"
                                    name="telefono"
                                    value={formData.telefono}
                                    onChange={handleChange}
                                    className="form-input"
                                    placeholder="+57 316 234 5678"
                                    required
                                    disabled={loading}
                                />
                            </div>
                            <div style={formFieldStyle}>
                                <label style={labelStyle}>
                                    Correo Electrónico <span style={{ color: 'red' }}>*</span>
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="form-input"
                                    placeholder="empleado@ejemplo.com"
                                    required
                                    disabled={loading}
                                />
                            </div>
                        </div>
                    </section>

                    {/* Información Laboral */}
                    <section style={sectionStyle}>
                        <h3 style={sectionTitleStyle}>
                            <span style={{ marginRight: '8px' }}>💼</span>
                            Información Laboral
                        </h3>
                        <div style={formRowStyle}>
                            <div style={formFieldStyle}>
                                <label style={labelStyle}>
                                    Fecha de Ingreso <span style={{ color: 'red' }}>*</span>
                                </label>
                                <input
                                    type="date"
                                    name="fechaIngreso"
                                    value={formData.fechaIngreso}
                                    onChange={handleChange}
                                    className="form-input"
                                    required
                                    disabled={loading}
                                />
                            </div>
                            <div style={formFieldStyle}>
                                <label style={labelStyle}>
                                    Rol <span style={{ color: 'red' }}>*</span>
                                </label>
                                <select
                                    name="rol"
                                    value={formData.rol}
                                    onChange={handleChange}
                                    className="form-select"
                                    required
                                    disabled={loading}
                                >
                                    <option value="EMPLEADO">Empleado</option>
                                    <option value="GERENTE">Gerente</option>
                                    <option value="ADMIN">Administrador</option>
                                </select>
                            </div>
                        </div>

                        <div style={formRowStyle}>
                            <div style={formFieldStyle}>
                                <label style={labelStyle}>
                                    <input
                                        type="checkbox"
                                        name="activo"
                                        checked={formData.activo}
                                        onChange={handleChange}
                                        disabled={loading}
                                        style={{ marginRight: '8px' }}
                                    />
                                    Empleado Activo
                                </label>
                                <small style={{ color: '#666', fontSize: '12px', display: 'block', marginTop: '4px' }}>
                                    {formData.activo ? '✓ El empleado está activo en el sistema' : '○ El empleado está inactivo'}
                                </small>
                            </div>
                        </div>
                    </section>

                    {/* Documentos */}
                    <section style={sectionStyle}>
                        <h3 style={sectionTitleStyle}>
                            <span style={{ marginRight: '8px' }}>📄</span>
                            Documentos (URLs)
                        </h3>
                        <div style={formRowStyle}>
                            <div style={formFieldStyle}>
                                <label style={labelStyle}>
                                    URL Desprendible de Pago
                                </label>
                                <input
                                    type="url"
                                    name="desprendiblePagoURL"
                                    value={formData.desprendiblePagoURL}
                                    onChange={handleChange}
                                    className="form-input"
                                    placeholder="https://ejemplo.com/desprendible.pdf"
                                    disabled={loading}
                                />
                            </div>
                        </div>

                        <div style={formRowStyle}>
                            <div style={formFieldStyle}>
                                <label style={labelStyle}>
                                    URL Hoja de Vida
                                </label>
                                <input
                                    type="url"
                                    name="hojaDeVidaURL"
                                    value={formData.hojaDeVidaURL}
                                    onChange={handleChange}
                                    className="form-input"
                                    placeholder="https://ejemplo.com/hojadevida.pdf"
                                    disabled={loading}
                                />
                            </div>
                        </div>
                    </section>

                    {/* Footer del Modal con botones */}
                    <div style={modalFooterStyle}>
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={loading}
                            style={secondaryButtonStyle}
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            style={{
                                ...primaryButtonStyle,
                                backgroundColor: loading ? '#ccc' : '#4a90e2',
                                cursor: loading ? 'not-allowed' : 'pointer',
                            }}
                        >
                            {loading ? '⏳ Guardando...' : '💾 Guardar Cambios'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

// Estilos
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
    maxWidth: '900px',
    width: '100%',
    maxHeight: '90vh',
    overflow: 'hidden',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
    display: 'flex',
    flexDirection: 'column',
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
    overflowY: 'auto',
    flex: 1,
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
    transition: 'background-color 0.2s',
};

const sectionStyle = {
    marginBottom: '32px',
    paddingBottom: '24px',
    borderBottom: '1px solid #e9ecef',
};

const sectionTitleStyle = {
    fontSize: '18px',
    fontWeight: '600',
    color: '#333',
    marginBottom: '20px',
    display: 'flex',
    alignItems: 'center',
};

const formRowStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '20px',
    marginBottom: '20px',
};

const formFieldStyle = {
    display: 'flex',
    flexDirection: 'column',
};

const labelStyle = {
    display: 'block',
    marginBottom: '8px',
    fontSize: '14px',
    fontWeight: '600',
    color: '#333',
};

const primaryButtonStyle = {
    padding: '12px 24px',
    backgroundColor: '#4a90e2',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    transition: 'background-color 0.2s',
};

const secondaryButtonStyle = {
    padding: '12px 24px',
    backgroundColor: 'transparent',
    color: '#666',
    border: '1px solid #ddd',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    transition: 'all 0.2s',
};