import React from 'react';

const ModalConfirmacion = ({ modalConfirmacion, candidatoSeleccionado, onConfirmar, onCerrar }) => {
    if (!modalConfirmacion.mostrar || !modalConfirmacion.estadoNuevo || !candidatoSeleccionado) {
        return null;
    }

    const estadoInfo = modalConfirmacion.estadoNuevo;

    return (
        <div className="modal-confirmacion-overlay" onClick={onCerrar}>
            <div className="modal-confirmacion-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-confirmacion-icon" style={{ color: estadoInfo.color }}>
                    <span className="icon-grande">{estadoInfo.icon}</span>
                </div>

                <h3 className="modal-confirmacion-titulo">¿Confirmar cambio de estado?</h3>

                <p className="modal-confirmacion-mensaje">
                    Estás a punto de cambiar el estado del candidato <strong>{candidatoSeleccionado.nombre} {candidatoSeleccionado.apellido}</strong> a:
                </p>

                <div className="estado-nuevo-badge" style={{ backgroundColor: estadoInfo.color }}>
                    <span className="estado-icon">{estadoInfo.icon}</span>
                    <span>{estadoInfo.label}</span>
                </div>

                <div className="modal-confirmacion-botones">
                    <button
                        className="btn-cancelar"
                        onClick={onCerrar}
                    >
                        Cancelar
                    </button>
                    <button
                        className="btn-confirmar"
                        style={{ backgroundColor: estadoInfo.color }}
                        onClick={() => onConfirmar(candidatoSeleccionado.cedula, estadoInfo.value)}
                    >
                        Confirmar cambio
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ModalConfirmacion;

// Estilos CSS para el modal de confirmación
const styles = `
.modal-confirmacion-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
}

.modal-confirmacion-content {
    background: white;
    border-radius: 16px;
    padding: 2rem;
    max-width: 450px;
    width: 90%;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
    text-align: center;
    animation: modalSlideIn 0.3s ease-out;
}

@keyframes modalSlideIn {
    from {
        opacity: 0;
        transform: translateY(-20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.modal-confirmacion-icon {
    margin-bottom: 1rem;
}

.icon-grande {
    font-size: 4rem;
    display: inline-block;
    animation: iconPulse 0.6s ease-in-out;
}

@keyframes iconPulse {
    0%, 100% {
        transform: scale(1);
    }
    50% {
        transform: scale(1.1);
    }
}

.modal-confirmacion-titulo {
    font-size: 1.5rem;
    color: #2c3e50;
    margin-bottom: 1rem;
}

.modal-confirmacion-mensaje {
    color: #495057;
    margin-bottom: 1.5rem;
    line-height: 1.5;
}

.estado-nuevo-badge {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1.5rem;
    border-radius: 25px;
    color: white;
    font-weight: 600;
    margin-bottom: 2rem;
    font-size: 1rem;
}

.estado-icon {
    font-size: 1.2rem;
}

.modal-confirmacion-botones {
    display: flex;
    gap: 1rem;
    justify-content: center;
}

.btn-cancelar,
.btn-confirmar {
    padding: 0.75rem 1.5rem;
    border: none;
    border-radius: 8px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    min-width: 120px;
}

.btn-cancelar {
    background: #e9ecef;
    color: #495057;
}

.btn-cancelar:hover {
    background: #dee2e6;
    transform: translateY(-2px);
}

.btn-confirmar {
    color: white;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.btn-confirmar:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
}

@media (max-width: 768px) {
    .modal-confirmacion-content {
        padding: 1.5rem;
    }

    .modal-confirmacion-botones {
        flex-direction: column;
    }

    .btn-cancelar,
    .btn-confirmar {
        width: 100%;
    }
}
`;

// Inyectar estilos si no existen
if (typeof document !== 'undefined' && !document.getElementById('modal-confirmacion-styles')) {
    const styleSheet = document.createElement('style');
    styleSheet.id = 'modal-confirmacion-styles';
    styleSheet.textContent = styles;
    document.head.appendChild(styleSheet);
}