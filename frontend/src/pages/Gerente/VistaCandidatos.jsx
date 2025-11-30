// VistaCandidatos.jsx
import React, { useState, useEffect } from 'react';
import * as candidatoApi from './candidatoApi';
import ModalDetalleCandidato from './ModalDetalleCandidato';
import ModalConfirmacion from './ModalConfirmacion';
import './VistaCandidatos.css';

const VistaCandidatos = () => {
    const [candidatos, setCandidatos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [busqueda, setBusqueda] = useState('');
    const [filtroEstado, setFiltroEstado] = useState('TODOS');
    const [candidatoSeleccionado, setCandidatoSeleccionado] = useState(null);
    const [mostrarModal, setMostrarModal] = useState(false);
    const [modalConfirmacion, setModalConfirmacion] = useState({
        mostrar: false,
        estadoNuevo: null
    });

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
            setMostrarModal(true);
        } catch (err) {
            alert('Error al cargar los detalles del candidato: ' + err.message);
        }
    };

    const handleCambiarEstado = async (cedula, nuevoEstado) => {
        try {
            // Cerrar modal de confirmación
            setModalConfirmacion({ mostrar: false, estadoNuevo: null });

            // CORRECCIÓN: nuevoEstado ya es un string (estado.value)
            const response = await fetch(`http://localhost:8080/api/candidatos/${cedula}/estado/${nuevoEstado.toLowerCase()}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (!response.ok) {
                throw new Error('Error al actualizar el estado');
            }

            // Actualizar el candidato seleccionado
            setCandidatoSeleccionado(prev => ({
                ...prev,
                estadoProceso: nuevoEstado
            }));

            // Actualizar la lista de candidatos
            setCandidatos(prev => prev.map(c =>
                c.cedula === cedula ? { ...c, estadoProceso: nuevoEstado } : c
            ));

        } catch (err) {
            alert('Error al cambiar el estado: ' + err.message);
            console.error('Error:', err);
        }
    };

    const abrirModalConfirmacion = (estadoNuevo) => {
        setModalConfirmacion({
            mostrar: true,
            estadoNuevo: estadoNuevo
        });
    };

    const cerrarModalConfirmacion = () => {
        setModalConfirmacion({ mostrar: false, estadoNuevo: null });
    };

    const candidatosFiltrados = candidatos.filter(candidato => {
        const cumpleBusqueda = busqueda === '' ||
            candidato.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
            candidato.apellido.toLowerCase().includes(busqueda.toLowerCase()) ||
            candidato.cedula.includes(busqueda) ||
            candidato.posicion.toLowerCase().includes(busqueda.toLowerCase()) ||
            candidato.email.toLowerCase().includes(busqueda.toLowerCase());

        const cumpleEstado =
            filtroEstado === 'TODOS' ||
            candidato.estadoProceso === filtroEstado;

        return cumpleBusqueda && cumpleEstado;
    });

    return (
        <div>
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
                            <option value="EN_REVISION">En revisión</option>
                            <option value="CONTRATADO">Contratado</option>
                            <option value="APROBADO">Aprobado</option>
                            <option value="RECHAZADO">Rechazado</option>
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
            </div>
            {/* Modales */}
            <ModalDetalleCandidato
                mostrarModal={mostrarModal}
                candidatoSeleccionado={candidatoSeleccionado}
                onClose={() => setMostrarModal(false)}
                onAbrirConfirmacion={abrirModalConfirmacion}
            />

            <ModalConfirmacion
                modalConfirmacion={modalConfirmacion}
                candidatoSeleccionado={candidatoSeleccionado}
                onConfirmar={handleCambiarEstado}
                onCerrar={cerrarModalConfirmacion}
            />
        </div>
    );
};

export default VistaCandidatos;