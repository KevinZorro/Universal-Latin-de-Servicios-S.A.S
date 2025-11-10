import React, { useState, useEffect } from 'react';
import './GestionEmpleados.css';

const GestionEmpleados = () => {
    const [empleados, setEmpleados] = useState([]);
    const [candidatos, setCandidatos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [mostrarFormulario, setMostrarFormulario] = useState(false);
    const [enviando, setEnviando] = useState(false);
    const [erroresValidacion, setErroresValidacion] = useState([]);
    const [busqueda, setBusqueda] = useState('');
    const [mostrarModal, setMostrarModal] = useState(false);
    const [empleadoSeleccionado, setEmpleadoSeleccionado] = useState(null);

    const [formData, setFormData] = useState({
        cedula: '',
        salario: '',
        cargo: '',
        fechaContratacion: new Date().toISOString().slice(0, 10),
        estado: true
    });

    useEffect(() => {
        cargarDatos();
    }, []);

    const cargarDatos = async () => {
        try {
            setLoading(true);
            setError(null);

            // Cargar empleados
            const respEmpleados = await fetch('http://localhost:8080/api/empleados');
            if (!respEmpleados.ok) throw new Error('Error al cargar empleados');
            const dataEmpleados = await respEmpleados.json();
            setEmpleados(dataEmpleados || []);

            // Cargar candidatos para el select
            const respCandidatos = await fetch('http://localhost:8080/api/candidatos');
            if (!respCandidatos.ok) throw new Error('Error al cargar candidatos');
            const dataCandidatos = await respCandidatos.json();
            setCandidatos(dataCandidatos || []);
        } catch (err) {
            setError('Error al cargar los datos: ' + err.message);
            console.error('Error:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const validarFormulario = () => {
        const errores = [];

        if (!formData.cedula || formData.cedula.trim() === '') {
            errores.push('Debe seleccionar un candidato');
        }

        if (!formData.salario || parseFloat(formData.salario) <= 0) {
            errores.push('El salario debe ser mayor a 0');
        }

        if (!formData.cargo || formData.cargo.trim() === '') {
            errores.push('El cargo es obligatorio');
        }

        if (!formData.fechaContratacion) {
            errores.push('La fecha de contratación es obligatoria');
        }

        return {
            valido: errores.length === 0,
            errores
        };
    };

    const handleCrear = async (e) => {
        e.preventDefault();

        const validacion = validarFormulario();
        if (!validacion.valido) {
            setErroresValidacion(validacion.errores);
            return;
        }

        try {
            setEnviando(true);
            setErroresValidacion([]);

            const response = await fetch('http://localhost:8080/api/empleados', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    cedula: formData.cedula,
                    salario: parseFloat(formData.salario),
                    cargo: formData.cargo,
                    fechaContratacion: formData.fechaContratacion,
                    estado: formData.estado
                })
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || 'Error al crear empleado');
            }

            alert('✅ Empleado creado exitosamente');

            resetFormulario();
            await cargarDatos();
            setMostrarFormulario(false);
        } catch (err) {
            const mensajeError = err.message || 'Error al crear el empleado';
            setErroresValidacion([mensajeError]);
            console.error('Error al crear:', err);
        } finally {
            setEnviando(false);
        }
    };

    const handleEliminar = async (cedula) => {
        const confirmar = window.confirm(
            `¿Estás seguro de eliminar este empleado?\n\nEsta acción no se puede deshacer.`
        );

        if (!confirmar) return;

        try {
            setLoading(true);
            const response = await fetch(`http://localhost:8080/api/empleados/${cedula}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                throw new Error('Error al eliminar empleado');
            }

            alert('✅ Empleado eliminado exitosamente');
            await cargarDatos();
        } catch (err) {
            alert('❌ Error al eliminar el empleado: ' + err.message);
            console.error('Error al eliminar:', err);
        } finally {
            setLoading(false);
        }
    };

    const resetFormulario = () => {
        setFormData({
            cedula: '',
            salario: '',
            cargo: '',
            fechaContratacion: new Date().toISOString().slice(0, 10),
            estado: true
        });
        setErroresValidacion([]);
    };

    const cancelarFormulario = () => {
        resetFormulario();
        setMostrarFormulario(false);
    };

    const handleVerDetalle = async (cedula) => {
        try {
            const response = await fetch(`http://localhost:8080/api/empleados/${cedula}`);
            if (!response.ok) throw new Error('Error al cargar detalles');
            const data = await response.json();
            setEmpleadoSeleccionado(data);
            setMostrarModal(true);
        } catch (err) {
            alert('Error al cargar los detalles: ' + err.message);
        }
    };

    const obtenerNombreCandidato = (cedula) => {
        const candidato = candidatos.find(c => c.cedula === cedula);
        return candidato ? `${candidato.nombre} ${candidato.apellido}` : `CC: ${cedula}`;
    };

    const formatearFecha = (fecha) => {
        if (!fecha) return 'N/A';
        return new Date(fecha).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const formatearSalario = (salario) => {
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 0
        }).format(salario);
    };

    const empleadosFiltrados = empleados.filter(emp => {
        if (busqueda) {
            const busquedaLower = busqueda.toLowerCase();
            const nombre = obtenerNombreCandidato(emp.cedula).toLowerCase();
            return (
                emp.cedula.includes(busquedaLower) ||
                nombre.includes(busquedaLower) ||
                emp.cargo.toLowerCase().includes(busquedaLower)
            );
        }
        return true;
    });

    // Modal de detalles
    const ModalDetalleEmpleado = () => {
        if (!mostrarModal || !empleadoSeleccionado) return null;

        return (
            <div className="modal-overlay" onClick={() => setMostrarModal(false)}>
                <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                    <div className="modal-header">
                        <h2>👤 Detalle del Empleado</h2>
                        <button className="btn-close" onClick={() => setMostrarModal(false)}>✕</button>
                    </div>

                    <div className="modal-body">
                        <div className="detalle-seccion">
                            <h3>Información Personal</h3>
                            <div className="info-grid">
                                <div className="info-item">
                                    <span className="info-label">Cédula:</span>
                                    <span className="info-value">{empleadoSeleccionado.cedula}</span>
                                </div>
                                <div className="info-item">
                                    <span className="info-label">Nombre:</span>
                                    <span className="info-value">
                                        {obtenerNombreCandidato(empleadoSeleccionado.cedula)}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="detalle-seccion">
                            <h3>Información Laboral</h3>
                            <div className="info-grid">
                                <div className="info-item">
                                    <span className="info-label">Cargo:</span>
                                    <span className="info-value">{empleadoSeleccionado.cargo}</span>
                                </div>
                                <div className="info-item">
                                    <span className="info-label">Salario:</span>
                                    <span className="info-value">
                                        {formatearSalario(empleadoSeleccionado.salario)}
                                    </span>
                                </div>
                                <div className="info-item">
                                    <span className="info-label">Fecha de Contratación:</span>
                                    <span className="info-value">
                                        {formatearFecha(empleadoSeleccionado.fechaContratacion)}
                                    </span>
                                </div>
                                <div className="info-item">
                                    <span className="info-label">Estado:</span>
                                    <span
                                        className="badge-estado"
                                        style={{
                                            backgroundColor: empleadoSeleccionado.estado ? '#28a745' : '#dc3545'
                                        }}
                                    >
                                        {empleadoSeleccionado.estado ? 'Activo' : 'Inactivo'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="modal-footer">
                        <button className="btn btn-cerrar" onClick={() => setMostrarModal(false)}>
                            Cerrar
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    // Vista del formulario de creación
    if (mostrarFormulario) {
        return (
            <div className="gestion-container">
                <div className="breadcrumb">
                    <span className="breadcrumb-link" onClick={cancelarFormulario}>
                        ← Volver a Empleados
                    </span>
                </div>

                <div className="form-header">
                    <h1>Registrar Nuevo Empleado</h1>
                    <p className="form-subtitle">
                        Seleccione un candidato y complete la información laboral
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
                            <span className="section-icon">💼</span>
                            <div>
                                <h3>Información del Empleado</h3>
                                <p>Complete los datos laborales del nuevo empleado</p>
                            </div>
                        </div>

                        <div className="form-grid">
                            <div className="form-group">
                                <label htmlFor="cedula">Candidato*</label>
                                <select
                                    id="cedula"
                                    name="cedula"
                                    value={formData.cedula}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">Seleccione un candidato</option>
                                    {candidatos
                                        .filter(c => !empleados.some(e => e.cedula === c.cedula))
                                        .map(candidato => (
                                            <option key={candidato.cedula} value={candidato.cedula}>
                                                {candidato.nombre} {candidato.apellido} - CC: {candidato.cedula}
                                            </option>
                                        ))
                                    }
                                </select>
                                <small>Solo se muestran candidatos que no son empleados</small>
                            </div>

                            <div className="form-group">
                                <label htmlFor="cargo">Cargo*</label>
                                <input
                                    type="text"
                                    id="cargo"
                                    name="cargo"
                                    value={formData.cargo}
                                    onChange={handleChange}
                                    placeholder="Ej: Desarrollador, Gerente, etc."
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="salario">Salario*</label>
                                <input
                                    type="number"
                                    id="salario"
                                    name="salario"
                                    value={formData.salario}
                                    onChange={handleChange}
                                    placeholder="Ej: 2500000"
                                    min="0"
                                    step="1000"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="fechaContratacion">Fecha de Contratación*</label>
                                <input
                                    type="date"
                                    id="fechaContratacion"
                                    name="fechaContratacion"
                                    value={formData.fechaContratacion}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label className="toggle-label">
                                    <span>Estado del Empleado</span>
                                    <div className="toggle-switch">
                                        <input
                                            type="checkbox"
                                            name="estado"
                                            checked={formData.estado}
                                            onChange={handleChange}
                                            id="estado"
                                        />
                                        <label htmlFor="estado" className="toggle-slider"></label>
                                    </div>
                                    <span className={`toggle-status ${formData.estado ? 'active' : 'inactive'}`}>
                                        {formData.estado ? 'Activo' : 'Inactivo'}
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
                            {enviando ? 'Registrando...' : 'Registrar Empleado'}
                        </button>
                    </div>
                </form>
            </div>
        );
    }

    // Vista del listado de empleados
    return (
        <div className="gestion-container">
            <div className="catalog-header">
                <div>
                    <h1>👥 Gestión de Empleados</h1>
                    <div className="breadcrumb">
                        <span>Recursos Humanos</span> › <span>Empleados</span>
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
                    placeholder="🔍 Buscar por cédula, nombre o cargo..."
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                />
            </div>

            {loading && <div className="loading">⏳ Cargando empleados...</div>}

            {!loading && empleadosFiltrados.length === 0 && (
                <div className="empty-state">
                    <span className="empty-icon">📭</span>
                    <p>No hay empleados registrados</p>
                    {busqueda && <p>Intenta con otros términos de búsqueda</p>}
                </div>
            )}

            {!loading && empleadosFiltrados.length > 0 && (
                <div className="empleados-grid">
                    {empleadosFiltrados.map(empleado => (
                        <div key={empleado.cedula} className="empleado-card">
                            <div className="empleado-header">
                                <div className="empleado-avatar">
                                    {obtenerNombreCandidato(empleado.cedula).substring(0, 2).toUpperCase()}
                                </div>
                                <div className="empleado-info-principal">
                                    <h3>{obtenerNombreCandidato(empleado.cedula)}</h3>
                                    <span className="empleado-cedula">CC: {empleado.cedula}</span>
                                </div>
                            </div>

                            <div className="empleado-body">
                                <div className="info-row">
                                    <span className="info-icon">💼</span>
                                    <span>{empleado.cargo}</span>
                                </div>
                                <div className="info-row">
                                    <span className="info-icon">💰</span>
                                    <span>{formatearSalario(empleado.salario)}</span>
                                </div>
                                <div className="info-row">
                                    <span className="info-icon">📅</span>
                                    <span>{formatearFecha(empleado.fechaContratacion)}</span>
                                </div>
                            </div>

                            <div className="empleado-footer">
                                <span
                                    className="estado-badge"
                                    style={{
                                        backgroundColor: empleado.estado ? '#28a745' : '#dc3545'
                                    }}
                                >
                                    {empleado.estado ? 'Activo' : 'Inactivo'}
                                </span>
                                <div className="empleado-actions">
                                    <button
                                        className="btn-icon btn-view"
                                        onClick={() => handleVerDetalle(empleado.cedula)}
                                        title="Ver detalles"
                                    >
                                        👁️
                                    </button>
                                    <button
                                        className="btn-icon btn-delete"
                                        onClick={() => handleEliminar(empleado.cedula)}
                                        title="Eliminar empleado"
                                    >
                                        🗑️
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <div className="floating-actions">
                <button
                    className="btn btn-add"
                    onClick={() => {
                        resetFormulario();
                        setMostrarFormulario(true);
                    }}
                >
                    + Registrar Empleado
                </button>
            </div>

            <ModalDetalleEmpleado />
        </div>
    );
};

export default GestionEmpleados;