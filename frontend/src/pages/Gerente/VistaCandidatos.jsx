import React, { useState, useEffect } from 'react';
import * as candidatoApi from './candidatoApi';
import './VistaCandidatos.css';

const VistaCandidatos = () => {
    const [candidatos, setCandidatos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [busqueda, setBusqueda] = useState('');
    const [filtroEstado, setFiltroEstado] = useState('TODOS'); // TODOS, EN_PROCESO, FINALIZADO
    const [candidatoSeleccionado, setCandidatoSeleccionado] = useState(null);
    const [mostrarModal, setMostrarModal] = useState(false);

    useEffect(() => {
        cargarCandidatos();
    }, []);

    const cargarCandidatos = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await candidatoApi.obtenerTodosCandidatos();
            setCandidatos(data || []);
        } catch (err) {
            setError('Error al cargar los candidatos: ' + err.message);
            console.error('Error:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleVerDetalle = async (cedula) => {
        try {
            const candidato = await candidatoApi.obtenerCandidatoPorCedula(cedula);
            setCandidatoSeleccionado(candidato);
            console.log("Seleccionado0", candidato)
            setMostrarModal(true);
        } catch (err) {
            alert('Error al cargar los detalles del candidato: ' + err.message);
        }
    };

    const candidatosFiltrados = candidatos.filter(candidato => {
        // Filtro por búsqueda
        const cumpleBusqueda = busqueda === '' ||
            candidato.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
            candidato.apellido.toLowerCase().includes(busqueda.toLowerCase()) ||
            candidato.cedula.includes(busqueda) ||
            candidato.posicion.toLowerCase().includes(busqueda.toLowerCase()) ||
            candidato.email.toLowerCase().includes(busqueda.toLowerCase());

        // Filtro por estado
        const cumpleEstado = filtroEstado === 'TODOS' ||
            (filtroEstado === 'EN_PROCESO' && candidato.estadoProceso) ||
            (filtroEstado === 'FINALIZADO' && !candidato.estadoProceso);

        return cumpleBusqueda && cumpleEstado;
    });

    // Modal de detalles
    const ModalDetalleCandidato = () => {
        if (!mostrarModal || !candidatoSeleccionado) return null;

        const estadoProceso = candidatoApi.obtenerEstadoProceso(candidatoSeleccionado.estadoProceso);

        return (
            <div className="modal-overlay" onClick={() => setMostrarModal(false)}>
                <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                    <div className="modal-header">
                        <h2>👤 Detalle del Candidato</h2>
                        <button className="btn-close" onClick={() => setMostrarModal(false)}>✕</button>
                    </div>

                    <div className="modal-body">
                        <div className="detalle-seccion">
                            <h3>Información Personal</h3>
                            <div className="info-grid">
                                <div className="info-item">
                                    <span className="info-label">Nombre completo:</span>
                                    <span className="info-value">
                                        {candidatoSeleccionado.nombre} {candidatoSeleccionado.apellido}
                                    </span>
                                </div>
                                <div className="info-item">
                                    <span className="info-label">Cédula:</span>
                                    <span className="info-value">{candidatoSeleccionado.cedula}</span>
                                </div>
                                <div className="info-item">
                                    <span className="info-label">Email:</span>
                                    <span className="info-value">{candidatoSeleccionado.email}</span>
                                </div>
                                <div className="info-item">
                                    <span className="info-label">Teléfono:</span>
                                    <span className="info-value">{candidatoSeleccionado.telefono}</span>
                                </div>
                            </div>
                        </div>

                        <div className="detalle-seccion">
                            <h3>Información Profesional</h3>
                            <div className="info-grid">
                                <div className="info-item">
                                    <span className="info-label">Posición aplicada:</span>
                                    <span className="info-value">{candidatoSeleccionado.posicion}</span>
                                </div>
                                <div className="info-item">
                                    <span className="info-label">Experiencia:</span>
                                    <span className="info-value">
                                        {candidatoApi.formatearExperiencia(candidatoSeleccionado.experiencia)}
                                    </span>
                                </div>
                                <div className="info-item">
                                    <span className="info-label">Estado del proceso:</span>
                                    <span
                                        className="badge-estado"
                                        style={{ backgroundColor: estadoProceso.color }}
                                    >
                                        {estadoProceso.label}
                                    </span>
                                </div>
                                <div className="info-item">
                                    <span className="info-label">Rol:</span>
                                    <span className="info-value">{candidatoSeleccionado.rol}</span>
                                </div>
                            </div>
                        </div>

                        {candidatoSeleccionado.mensaje && (
                            <div className="detalle-seccion">
                                <h3>Mensaje del Candidato</h3>
                                <div className="mensaje-box">
                                    {candidatoSeleccionado.mensaje}
                                </div>
                            </div>
                        )}

                        {candidatoSeleccionado.hojaDeVidaURL && (
                            <div className="detalle-seccion">
                                <h3>Hoja de Vida</h3>
                                <a
                                    href={candidatoSeleccionado.hojaDeVidaURL}
                                    download={`HV_${candidatoSeleccionado.nombre}_${candidatoSeleccionado.apellido}.pdf`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn btn-download"
                                >📄 Descargar Hoja de Vida
                                </a>
                            </div>
                        )}
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

    return (
        <div className="candidatos-container">
            {error && (
                <div className="info-box info-box-error">
                    <div className="info-icon">⚠️</div>
                    <div>{error}</div>
                </div>
            )}

            {/* Filtros y búsqueda */}
            <div className="filtros-container">
                <div className="search-bar">
                    <input
                        type="text"
                        placeholder="🔍 Buscar por nombre, cédula, email o posición..."
                        value={busqueda}
                        onChange={(e) => setBusqueda(e.target.value)}
                    />
                </div>

                <div className="filtro-estado">
                    <label>Estado del proceso:</label>
                    <select
                        value={filtroEstado}
                        onChange={(e) => setFiltroEstado(e.target.value)}
                    >
                        <option value="TODOS">Todos</option>
                        <option value="EN_PROCESO">En proceso</option>
                        <option value="FINALIZADO">Finalizados</option>
                    </select>
                </div>
            </div>

            {loading && <div className="loading">⏳ Cargando candidatos...</div>}

            {!loading && candidatosFiltrados.length === 0 && (
                <div className="empty-state">
                    <span className="empty-icon">📭</span>
                    <p>No se encontraron candidatos</p>
                    {busqueda && <p>Intenta con otros términos de búsqueda</p>}
                </div>
            )}

            {!loading && candidatosFiltrados.length > 0 && (
                <div className="candidatos-grid">
                    {candidatosFiltrados.map(candidato => {
                        const estadoProceso = candidatoApi.obtenerEstadoProceso(candidato.estadoProceso);

                        return (
                            <div key={candidato.cedula} className="candidato-card">
                                <div className="candidato-header">
                                    <div className="candidato-avatar">
                                        {candidato.nombre.charAt(0)}{candidato.apellido.charAt(0)}
                                    </div>
                                    <div className="candidato-info-principal">
                                        <h3>{candidato.nombre} {candidato.apellido}</h3>
                                        <span className="candidato-cedula">CC: {candidato.cedula}</span>
                                    </div>
                                </div>

                                <div className="candidato-body">
                                    <div className="info-row">
                                        <span className="info-icon">💼</span>
                                        <span>{candidato.posicion}</span>
                                    </div>
                                    <div className="info-row">
                                        <span className="info-icon">📧</span>
                                        <span>{candidato.email}</span>
                                    </div>
                                    <div className="info-row">
                                        <span className="info-icon">📞</span>
                                        <span>{candidato.telefono}</span>
                                    </div>
                                    <div className="info-row">
                                        <span className="info-icon">⏱️</span>
                                        <span>{candidatoApi.formatearExperiencia(candidato.experiencia)}</span>
                                    </div>
                                </div>

                                <div className="candidato-footer">
                                    <span
                                        className="estado-badge"
                                        style={{ backgroundColor: estadoProceso.color }}
                                    >
                                        {estadoProceso.label}
                                    </span>
                                    <button
                                        className="btn btn-ver-detalle"
                                        onClick={() => handleVerDetalle(candidato.cedula)}
                                    >
                                        Ver Detalle 👁️
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            <ModalDetalleCandidato />
        </div>
    );
};

export default VistaCandidatos;