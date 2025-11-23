import React, { useState, useEffect } from 'react';
import { obtenerMisAsignaciones, crearEvidencia } from './empleadoApi';
import './EmployeeDashboard.css';


export default function CargarEvidencia() {
    const [asignaciones, setAsignaciones] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [cedula, setCedula] = useState('');


    // Estado del formulario
    const [formData, setFormData] = useState({
        ordenServicioId: '',
        descripcion: '',
        horaInicio: '',
        horaFin: '',
        imagen: null
    });

    useEffect(() => {
        // Obtener cédula del localStorage
        const storedCedula = localStorage.getItem('cedula');
        if (storedCedula) {
            setCedula(storedCedula);
            cargarAsignaciones(storedCedula);
        } else {
            setError("No se encontró la sesión del empleado.");
        }
    }, []);

    const cargarAsignaciones = async (cedulaEmpleado) => {
        try {
            const data = await obtenerMisAsignaciones(cedulaEmpleado);
            // Filtramos para que solo aparezcan las que están EN_PROCESO o ASIGNADAS (opcional)
            // O mostramos todas para que pueda subir evidencia en cualquier momento
            setAsignaciones(data || []);
        } catch (err) {
            console.error(err);
            setError("Error al cargar las órdenes disponibles.");
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setFormData(prev => ({ ...prev, imagen: e.target.files[0] }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(false);

        try {
            // Validaciones básicas
            if (!formData.ordenServicioId) throw new Error("Debes seleccionar una orden.");
            if (!formData.imagen) throw new Error("Debes adjuntar una imagen de evidencia.");
            if (!formData.horaInicio || !formData.horaFin) throw new Error("Debes indicar las horas de inicio y fin.");

            // Validar que hora fin sea mayor a inicio
            if (new Date(formData.horaFin) <= new Date(formData.horaInicio)) {
                throw new Error("La hora de fin debe ser posterior a la de inicio.");
            }

            // Construir FormData para el envío
            const dataToSend = new FormData();
            dataToSend.append('ordenServicioId', formData.ordenServicioId);
            dataToSend.append('descripcion', formData.descripcion);
            dataToSend.append('empleadoId', cedula); // Cédula del empleado logueado
            dataToSend.append('imagen', formData.imagen);
            // Convertir fechas a ISO String para el backend (LocalDateTime)
            dataToSend.append('horaInicio', new Date(formData.horaInicio).toISOString());
            dataToSend.append('horaFin', new Date(formData.horaFin).toISOString());

            await crearEvidencia(dataToSend);

            setSuccess(true);
            // Limpiar formulario
            setFormData({
                ordenServicioId: '',
                descripcion: '',
                horaInicio: '',
                horaFin: '',
                imagen: null
            });
            // Resetear input file visualmente
            document.getElementById('fileInput').value = "";

        } catch (err) {
            setError(err.message || "Error al subir la evidencia.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="cargar-evidencia-container">
            <div className="section-header">
                <div>
                    <h2>📷 Cargar Evidencia</h2>
                    <p className="subtitle">Sube fotos y reportes de tus servicios</p>
                </div>
            </div>

            {error && <div className="alert-error">{error}</div>}
            {success && <div className="alert-success">✅ Evidencia subida correctamente.</div>}


            <form onSubmit={handleSubmit} className="evidencia-form">
                
                {/* Selección de Orden */}
                <div className="form-group">
                    <label htmlFor="ordenServicioId">Orden de Servicio *</label>
                    <select
                    id="ordenServicioId"
                    name="ordenServicioId"
                    value={formData.ordenServicioId}
                    onChange={handleChange}
                    required
                    className="form-control"
                    >
                        <option value="">Seleccione una orden...</option>
                        {asignaciones
                        .filter(asig => asig.estado === "FINALIZADO")
                        .map(asig => (
                        <option key={asig.ordenServicioId} value={asig.ordenServicioId}>
                            {`Orden #${asig.ordenId} - ${asig.servicioNombre} (${asig.estado})`}
                            </option>
                            ))
                            }
                    </select>

                </div>

                {/* Descripción */}
                <div className="form-group">
                    <label htmlFor="descripcion">Descripción de la Actividad *</label>
                    <textarea
                        id="descripcion"
                        name="descripcion"
                        value={formData.descripcion}
                        onChange={handleChange}
                        required
                        placeholder="Describe brevemente qué se realizó..."
                        className="form-control"
                        rows="3"
                    />
                </div>

                {/* Fechas y Horas */}
                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="horaInicio">Hora Inicio *</label>
                        <input
                            type="datetime-local"
                            id="horaInicio"
                            name="horaInicio"
                            value={formData.horaInicio}
                            onChange={handleChange}
                            required
                            className="form-control"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="horaFin">Hora Fin *</label>
                        <input
                            type="datetime-local"
                            id="horaFin"
                            name="horaFin"
                            value={formData.horaFin}
                            onChange={handleChange}
                            required
                            className="form-control"
                        />
                    </div>
                </div>

                {/* Carga de Archivo */}
                <div className="form-group">
                    <label htmlFor="imagen">Adjuntar Evidencia (Foto) *</label>
                    <div className="file-upload-wrapper">
                        <input
                            type="file"
                            id="fileInput"
                            accept="image/*"
                            onChange={handleFileChange}
                            required
                            className="file-input"
                        />
                        <div className="file-preview">
                            {formData.imagen ? (
                                <span>📄 {formData.imagen.name}</span>
                            ) : (
                                <span style={{color: '#999'}}>Ningún archivo seleccionado</span>
                            )}
                        </div>
                    </div>
                </div>

                <div className="form-actions">
                    <button type="submit" className="btn-submit" disabled={loading}>
                        {loading ? 'Subiendo...' : '🚀 Subir Evidencia'}
                    </button>
                </div>
            </form>
        </div>
    );
}