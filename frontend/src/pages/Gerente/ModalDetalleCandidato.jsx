// ModalDetalleCandidato.jsx
import React from 'react';
import * as candidatoApi from './candidatoApi';

const ModalDetalleCandidato = ({ mostrarModal, candidatoSeleccionado, onClose, onAbrirConfirmacion }) => {
    if (!mostrarModal || !candidatoSeleccionado) return null;

    const estadoProceso = candidatoApi.obtenerEstadoProceso(candidatoSeleccionado.estadoProceso);

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>👤 Detalle del Candidato</h2>
                    <button className="btn-close" onClick={onClose}>✕</button>
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
                            >
                                📄 Descargar Hoja de Vida
                            </a>
                        </div>
                    )}

                    <div className="detalle-seccion cambiar-estado-seccion">
                        <h3>🔄 Cambiar Estado del Proceso</h3>
                        <p className="estado-help-text">
                            Selecciona el nuevo estado para este candidato.
                        </p>

                        <div className="estado-chip-container">
                            {candidatoApi.obtenerTodosLosEstados().map(estado => {
                                const activo = candidatoSeleccionado.estadoProceso === estado.value;
                                return (
                                    <button
                                        key={estado.value}
                                        className={`estado-chip ${activo ? "activo" : ""}`}
                                        style={{
                                            "--color": estado.color
                                        }}
                                        onClick={() => {
                                            if (!activo) onAbrirConfirmacion(estado);
                                        }}
                                        disabled={activo}
                                    >
                                        <span className="estado-chip-icon">{estado.icon}</span>
                                        <span className="estado-chip-label">{estado.label}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                </div>

                <div className="modal-footer">
                    <button className="btn btn-cerrar" onClick={onClose}>
                        Cerrar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ModalDetalleCandidato;