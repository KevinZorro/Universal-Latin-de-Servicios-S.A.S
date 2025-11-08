import React, { useState, useEffect } from 'react';
import {
    obtenerTodosServicios,
    obtenerServicioPorId,
    crearServicio,
    actualizarServicio,
    eliminarServicio,
    validarDatosServicio
} from './servicioApi';
import './GestionServicios.css'; // Opcional: para estilos

const GestionServicios = () => {
    // Estados principales
    const [servicios, setServicios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Estados para el formulario
    const [modoEdicion, setModoEdicion] = useState(false);
    const [servicioEditando, setServicioEditando] = useState(null);
    const [mostrarFormulario, setMostrarFormulario] = useState(false);

    // Estados del formulario
    const [formData, setFormData] = useState({
        nombreServicio: '',
        descripcion: '',
        estado: true,
        tipoHorario: ''
    });

    const [erroresValidacion, setErroresValidacion] = useState([]);
    const [enviando, setEnviando] = useState(false);

    // Estados para filtros
    const [filtroEstado, setFiltroEstado] = useState('todos'); // 'todos', 'activos', 'inactivos'
    const [busqueda, setBusqueda] = useState('');

    // Cargar servicios al montar el componente
    useEffect(() => {
        cargarServicios();
    }, []);

    // ============================================
    // FUNCIONES CRUD
    // ============================================

    /**
     * Cargar todos los servicios desde el backend
     */
    const cargarServicios = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await obtenerTodosServicios();
            setServicios(data || []);
        } catch (err) {
            setError('Error al cargar los servicios: ' + err.message);
            console.error('Error:', err);
        } finally {
            setLoading(false);
        }
    };

    /**
     * Manejar cambios en los campos del formulario
     */
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    /**
     * Crear nuevo servicio
     */
    const handleCrear = async (e) => {
        e.preventDefault();

        // Validar datos antes de enviar
        const validacion = validarDatosServicio(formData);
        if (!validacion.valido) {
            setErroresValidacion(validacion.errores);
            return;
        }

        try {
            setEnviando(true);
            setErroresValidacion([]);

            await crearServicio(formData);

            // Mostrar mensaje de éxito
            alert('✅ Servicio creado exitosamente');

            // Limpiar formulario
            resetFormulario();

            // Recargar lista
            await cargarServicios();

            // Ocultar formulario
            setMostrarFormulario(false);
        } catch (err) {
            const mensajeError = err.details?.message || err.message || 'Error al crear el servicio';
            setErroresValidacion([mensajeError]);
            console.error('Error al crear:', err);
        } finally {
            setEnviando(false);
        }
    };

    /**
     * Preparar formulario para editar
     */
    const iniciarEdicion = async (id) => {
        try {
            setLoading(true);
            const servicio = await obtenerServicioPorId(id);

            setFormData({
                nombreServicio: servicio.nombreServicio,
                descripcion: servicio.descripcion,
                estado: servicio.estado,
                tipoHorario: servicio.tipoHorario
            });

            setServicioEditando(id);
            setModoEdicion(true);
            setMostrarFormulario(true);
            setErroresValidacion([]);
        } catch (err) {
            alert('Error al cargar el servicio: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    /**
     * Actualizar servicio existente
     */
    const handleActualizar = async (e) => {
        e.preventDefault();

        // Validar datos antes de enviar
        const validacion = validarDatosServicio(formData);
        if (!validacion.valido) {
            setErroresValidacion(validacion.errores);
            return;
        }

        try {
            setEnviando(true);
            setErroresValidacion([]);

            await actualizarServicio(servicioEditando, formData);

            // Mostrar mensaje de éxito
            alert('✅ Servicio actualizado exitosamente');

            // Limpiar formulario
            resetFormulario();

            // Recargar lista
            await cargarServicios();

            // Salir del modo edición
            setModoEdicion(false);
            setServicioEditando(null);
            setMostrarFormulario(false);
        } catch (err) {
            const mensajeError = err.details?.message || err.message || 'Error al actualizar el servicio';
            setErroresValidacion([mensajeError]);
            console.error('Error al actualizar:', err);
        } finally {
            setEnviando(false);
        }
    };

    /**
     * Eliminar servicio
     */
    const handleEliminar = async (id, nombreServicio) => {
        const confirmar = window.confirm(
            `¿Estás seguro de que deseas eliminar el servicio "${nombreServicio}"?\n\nEsta acción no se puede deshacer.`
        );

        if (!confirmar) return;

        try {
            setLoading(true);
            await eliminarServicio(id);

            // Mostrar mensaje de éxito
            alert('✅ Servicio eliminado exitosamente');

            // Recargar lista
            await cargarServicios();
        } catch (err) {
            alert('❌ Error al eliminar el servicio: ' + err.message);
            console.error('Error al eliminar:', err);
        } finally {
            setLoading(false);
        }
    };

    /**
     * Resetear formulario a valores por defecto
     */
    const resetFormulario = () => {
        setFormData({
            nombreServicio: '',
            descripcion: '',
            estado: true,
            tipoHorario: ''
        });
        setErroresValidacion([]);
        setModoEdicion(false);
        setServicioEditando(null);
    };

    /**
     * Cancelar edición/creación
     */
    const cancelarFormulario = () => {
        resetFormulario();
        setMostrarFormulario(false);
    };

    // ============================================
    // FUNCIONES DE FILTRADO
    // ============================================

    /**
     * Filtrar servicios según criterios
     */
    const serviciosFiltrados = servicios.filter(servicio => {
        // Filtro por estado
        if (filtroEstado === 'activos' && !servicio.estado) return false;
        if (filtroEstado === 'inactivos' && servicio.estado) return false;

        // Filtro por búsqueda
        if (busqueda) {
            const busquedaLower = busqueda.toLowerCase();
            return (
                servicio.nombreServicio.toLowerCase().includes(busquedaLower) ||
                servicio.descripcion.toLowerCase().includes(busquedaLower) ||
                servicio.tipoHorario.toLowerCase().includes(busquedaLower)
            );
        }

        return true;
    });

    // ============================================
    // RENDER
    // ============================================

    return (
        <div className="gestion-servicios-container">
            <div className="header">
                <button
                    className="btn btn-primary"
                    onClick={() => {
                        resetFormulario();
                        setMostrarFormulario(!mostrarFormulario);
                    }}
                >
                    {mostrarFormulario ? '❌ Cancelar' : '➕ Nuevo Servicio'}
                </button>
            </div>

            {/* Mensajes de error global */}
            {error && (
                <div className="alert alert-error">
                    {error}
                    <button onClick={() => setError(null)}>✕</button>
                </div>
            )}

            {/* Formulario de Creación/Edición */}
            {mostrarFormulario && (
                <div className="formulario-container">
                    <h2>{modoEdicion ? '✏️ Editar Servicio' : '➕ Crear Nuevo Servicio'}</h2>

                    {/* Errores de validación */}
                    {erroresValidacion.length > 0 && (
                        <div className="alert alert-error">
                            <ul>
                                {erroresValidacion.map((error, idx) => (
                                    <li key={idx}>{error}</li>
                                ))}
                            </ul>
                        </div>
                    )}

                    <form onSubmit={modoEdicion ? handleActualizar : handleCrear}>
                        <div className="form-group">
                            <label htmlFor="nombreServicio">
                                Nombre del Servicio <span className="required">*</span>
                            </label>
                            <input
                                type="text"
                                id="nombreServicio"
                                name="nombreServicio"
                                value={formData.nombreServicio}
                                onChange={handleChange}
                                placeholder="Ej: Mantenimiento Preventivo"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="descripcion">
                                Descripción <span className="required">*</span>
                            </label>
                            <textarea
                                id="descripcion"
                                name="descripcion"
                                value={formData.descripcion}
                                onChange={handleChange}
                                placeholder="Describe el servicio..."
                                rows="4"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="tipoHorario">
                                Tipo de Horario <span className="required">*</span>
                            </label>
                            <select
                                id="tipoHorario"
                                name="tipoHorario"
                                value={formData.tipoHorario}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Selecciona un tipo</option>
                                <option value="DIURNO">Diurno</option>
                                <option value="NOCTURNO">Nocturno</option>
                                <option value="MIXTO">Mixto</option>
                                <option value="24_HORAS">24 Horas</option>
                            </select>
                        </div>

                        <div className="form-group checkbox-group">
                            <label>
                                <input
                                    type="checkbox"
                                    name="estado"
                                    checked={formData.estado}
                                    onChange={handleChange}
                                />
                                <span>Servicio Activo</span>
                            </label>
                        </div>

                        <div className="form-actions">
                            <button
                                type="submit"
                                className="btn btn-success"
                                disabled={enviando}
                            >
                                {enviando
                                    ? '⏳ Guardando...'
                                    : modoEdicion
                                        ? '💾 Actualizar'
                                        : '💾 Crear'
                                }
                            </button>
                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={cancelarFormulario}
                                disabled={enviando}
                            >
                                ❌ Cancelar
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Filtros y Búsqueda */}
            <div className="filtros-container">
                <div className="filtro-busqueda">
                    <input
                        type="text"
                        placeholder="🔍 Buscar servicio..."
                        value={busqueda}
                        onChange={(e) => setBusqueda(e.target.value)}
                    />
                </div>

                <div className="filtro-estado">
                    <label>Filtrar por estado:</label>
                    <select
                        value={filtroEstado}
                        onChange={(e) => setFiltroEstado(e.target.value)}
                    >
                        <option value="todos">Todos</option>
                        <option value="activos">Activos</option>
                        <option value="inactivos">Inactivos</option>
                    </select>
                </div>

                <button
                    className="btn btn-secondary"
                    onClick={cargarServicios}
                    disabled={loading}
                >
                    🔄 Actualizar
                </button>
            </div>

            {/* Lista de Servicios */}
            <div className="servicios-lista">
                <h2>
                    Servicios ({serviciosFiltrados.length})
                </h2>

                {loading && <div className="loading">⏳ Cargando servicios...</div>}

                {!loading && serviciosFiltrados.length === 0 && (
                    <div className="empty-state">
                        <p>📭 No hay servicios que mostrar</p>
                        {busqueda && <p>Intenta con otros términos de búsqueda</p>}
                    </div>
                )}

                {!loading && serviciosFiltrados.length > 0 && (
                    <div className="tabla-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Nombre</th>
                                    <th>Descripción</th>
                                    <th>Tipo Horario</th>
                                    <th>Estado</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {serviciosFiltrados.map(servicio => (
                                    <tr key={servicio.id}>
                                        <td>{servicio.id}</td>
                                        <td className="nombre-servicio">{servicio.nombreServicio}</td>
                                        <td className="descripcion">{servicio.descripcion}</td>
                                        <td>{servicio.tipoHorario}</td>
                                        <td>
                                            <span className={`badge ${servicio.estado ? 'badge-activo' : 'badge-inactivo'}`}>
                                                {servicio.estado ? '✅ Activo' : '❌ Inactivo'}
                                            </span>
                                        </td>
                                        <td className="acciones">
                                            <button
                                                className="btn btn-editar"
                                                onClick={() => iniciarEdicion(servicio.id)}
                                                title="Editar servicio"
                                            >
                                                ✏️ Editar
                                            </button>
                                            <button
                                                className="btn btn-eliminar"
                                                onClick={() => handleEliminar(servicio.id, servicio.nombreServicio)}
                                                title="Eliminar servicio"
                                            >
                                                🗑️ Eliminar
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default GestionServicios;