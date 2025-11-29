import React, { useEffect, useState } from "react";
import axios from "axios";
import "./VerEvidencias.css";
import { obtenerOrdenPorId, obtenerClientePorId } from "../Gerente/verEvidenciasApi";

export default function VistaOrdenesEvidencias() {
    const [ordenes, setOrdenes] = useState([]);
    const [evidencias, setEvidencias] = useState([]);
    const [ordenSeleccionada, setOrdenSeleccionada] = useState(null);
    const [loadingEvidencias, setLoadingEvidencias] = useState(false);
    const [imagenAmpliada, setImagenAmpliada] = useState(null);
    const [ordenesConCliente, setOrdenesConCliente] = useState([]);
    const [ordenesConNit, setOrdenesConNit] = useState([]);
    const [filtroNit, setFiltroNit] = useState("");

    // ✅ NUEVO: filtro por cliente
    const [filtroCliente, setFiltroCliente] = useState("");

    // Formato legible para horas
    const formatearHora = (fechaISO) => {
        return new Date(fechaISO).toLocaleTimeString("es-CO", {
            hour: "2-digit",
            minute: "2-digit"
        });
    };

    useEffect(() => {
    const cargarDatos = async () => {
        try {
            const res = await axios.get("/api/ordenes-servicio");
            const ordenesServicio = res.data;

            const ordenesFinales = await Promise.all(
                ordenesServicio.map(async (os) => {
                    const orden = await obtenerOrdenPorId(os.ordenId);
                    const cliente = await obtenerClientePorId(orden.clienteId);

                    return {
                        ...os,
                        clienteId: orden.clienteId,
                        nitCliente: cliente.nit
                    };
                })
            );

            setOrdenesConNit(ordenesFinales);

        } catch (error) {
            console.error("Error cargando órdenes:", error);
        }
    };

    cargarDatos();
}, []);



    const verEvidencias = async (idOrden) => {
        setOrdenSeleccionada(idOrden);
        setLoadingEvidencias(true);

        try {
            const res = await axios.get(`/api/evidencias/por-orden/${idOrden}`);
            setEvidencias(res.data);
        } catch (e) {
            console.error("Error cargando evidencias:", e);
            setEvidencias([]);
        }

        setLoadingEvidencias(false);
    };

    // ✅ NUEVO: órdenes filtradas por nit
    const ordenesFiltradas = ordenesConNit.filter(o => {
    if (!filtroNit) return true;

    const nit = o.nitCliente?.toString() || "";
    return nit.includes(filtroNit);
});





    return (
        <div className="content-area">

            <h2 className="section-title">Órdenes de Servicio</h2>

            {/* ✅ FILTRO POR CLIENTE */}
            <div className="filtro-cliente">
    <input
    type="text"
    value={filtroNit}
    onChange={(e) => {
        const soloNumeros = e.target.value.replace(/\D/g, "");
        setFiltroNit(soloNumeros);
    }}
    placeholder="Filtrar por NIT"
/>
</div>



            <table className="tabla-estilos">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>NIT Cliente</th>
                        <th>Servicio</th>
                        <th>Orden</th>
                        <th>Estado</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {ordenesFiltradas.map(orden => (
                        <tr key={orden.id}>
                            <td>{orden.id}</td>
                            <td>{orden.nitCliente}</td>
                            <td>{orden.servicioId}</td>
                            <td>{orden.ordenId}</td>
                            <td>{orden.estado}</td>
                            <td>
                                <button
                                    className="btn-ver"
                                    onClick={() => verEvidencias(orden.id)}
                                >
                                    Ver Evidencias
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* ✅ MENSAJE CUANDO NO HAY RESULTADOS */}
            {ordenesFiltradas.length === 0 && (
                <p style={{ textAlign: "center", marginTop: "20px" }}>
                    ❌ No hay órdenes para ese cliente
                </p>
            )}

            <hr style={{ margin: "30px 0" }} />

            <h2 className="section-title">Evidencias</h2>

            {loadingEvidencias && <p>Cargando evidencias...</p>}

            {ordenSeleccionada && !loadingEvidencias && evidencias.length === 0 && (
                <p>No hay evidencias registradas para esta orden.</p>
            )}

            {evidencias.length > 0 && (
                <div className="evidencias-grid">
                    {evidencias.map(e => (
                        <div className="card-evidencia" key={e.idEvidencia}>
                            <img
                                src={e.rutaArchivo}
                                alt="Evidencia"
                                className="img-evidencia"
                                onClick={() => setImagenAmpliada(e.rutaArchivo)}
                            />

                            <p><strong>Descripción:</strong> {e.descripcion}</p>
                            <p><strong>Empleado:</strong> {e.empleadoId}</p>
                            <p><strong>Hora Inicio:</strong> {formatearHora(e.horaInicio)}</p>
                            <p><strong>Hora Fin:</strong> {formatearHora(e.horaFin)}</p>
                            <p><strong>Fecha Registro:</strong> {new Date(e.fechaRegistro).toLocaleString()}</p>
                        </div>
                    ))}
                </div>
            )}

            {/* MODAL PARA IMAGEN AMPLIADA */}
            {imagenAmpliada && (
                <div className="modal-overlay" onClick={() => setImagenAmpliada(null)}>
                    <img
                        src={imagenAmpliada}
                        alt="Zoom"
                        className="modal-image"
                    />
                </div>
            )}

        </div>
    );
}
