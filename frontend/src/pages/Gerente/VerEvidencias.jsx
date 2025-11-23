import React, { useEffect, useState } from "react";
import { obtenerOrdenesServicio, obtenerEvidenciasPorOrden } from "../Gerente/verEvidenciasApi";
import "./VerEvidencias.css";

export default function VerEvidencias() {
    const [ordenes, setOrdenes] = useState([]);
    const [evidencias, setEvidencias] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [ordenSeleccionada, setOrdenSeleccionada] = useState(null);

    useEffect(() => {
        cargarOrdenes();
    }, []);

    const cargarOrdenes = async () => {
        try {
            setLoading(true);
            const data = await obtenerOrdenesServicio();
            setOrdenes(data);
        } catch (e) {
            setError("Error al cargar órdenes de servicio");
        } finally {
            setLoading(false);
        }
    };

    const verEvidencias = async (idOrdenServicio) => {
        try {
            setLoading(true);
            setOrdenSeleccionada(idOrdenServicio);
            const data = await obtenerEvidenciasPorOrden(idOrdenServicio);
            setEvidencias(data);
        } catch (e) {
            setError("Error al cargar las evidencias");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="ver-evidencias-container">

            <h2>📋 Órdenes de Servicio</h2>

            {loading && <p>Cargando...</p>}
            {error && <div className="alert-error">{error}</div>}

            {/* ------- LISTA DE ÓRDENES DE SERVICIO -------- */}
            <div className="ordenes-grid">
                {ordenes.map(os => (
                    <div key={os.id} className="orden-card">
                        <p><strong>Orden:</strong> #{os.ordenId}</p>
                        <p><strong>Servicio:</strong> {os.servicioId}</p>
                        <p><strong>Estado:</strong> {os.estado}</p>

                        <button
                            className="btn-ver"
                            onClick={() => verEvidencias(os.id)}
                        >
                            Ver Evidencias
                        </button>
                    </div>
                ))}
            </div>

            {/* ------- MOSTRAR EVIDENCIAS DE LA ORDEN -------- */}
            {ordenSeleccionada && (
                <>
                    <h2>📷 Evidencias de la Orden #{ordenSeleccionada}</h2>

                    <div className="evidencias-grid">
                        {evidencias.length === 0 && (
                            <p>No hay evidencias registradas.</p>
                        )}

                        {evidencias.map(ev => (
                            <div key={ev.idEvidencia} className="evidencia-card">
                                <img
                                    src={ev.rutaArchivo}
                                    alt="Evidencia"
                                    className="evidencia-img"
                                />
                                <div className="evidencia-info">
                                    <p><strong>Empleado:</strong> {ev.empleadoId}</p>
                                    <p><strong>Descripción:</strong> {ev.descripcion}</p>
                                    <p><strong>Inicio:</strong> {ev.horaInicio}</p>
                                    <p><strong>Fin:</strong> {ev.horaFin}</p>
                                    <p><strong>Fecha Registro:</strong> {ev.fechaRegistro}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}
