import React, { useState, useEffect } from "react";
import * as ordenServicioApi from "../Gerente/ordenServicioApi";
import * as ordenApi from "../Gerente/ordenApi";
import * as servicioApi from "../Gerente/servicioApi";
import ClienteService from "../Gerente/ClienteService";
import "./AsignarServicioOrden.css";

export default function AsignarServicioOrden() {
    const [ordenes, setOrdenes] = useState([]);
    const [servicios, setServicios] = useState([]);
    const [asignaciones, setAsignaciones] = useState([]);
    const [filtroEstado, setFiltroEstado] = useState(""); 
    const [asignacionesDetalladas, setAsignacionesDetalladas] = useState([]);

    const [modalOpen, setModalOpen] = useState(false); // crear asignación
    const [modoEdicion, setModoEdicion] = useState(false);
    const [idEditando, setIdEditando] = useState(null);


    const [formData, setFormData] = useState({
        ordenId: "",
        servicioId: "",
        estado: "PENDIENTE",
    });
    const [ordenesConNit, setOrdenesConNit] = useState([]);

    useEffect(() => {
        cargarDatos();
    }, []);

   async function cargarDatos() {
    const [ord, srv, asig] = await Promise.all([
        ordenApi.obtenerTodasOrdenes(),
        servicioApi.obtenerTodosServicios(),
        ordenServicioApi.obtenerOrdenesServicio(),
    ]);

    setOrdenes(ord);
    setServicios(srv);
    setAsignaciones(asig);

    // ✅ ORDENES CON NIT
    const ordenesNit = await Promise.all(
        ord.map(async (o) => {
            try {
                const cliente = await ClienteService.getClienteById(o.clienteId);
                return {
                    ...o,
                    nitCliente: cliente.nit
                };
            } catch (error) {
                return {
                    ...o,
                    nitCliente: "No disponible"
                };
            }
        })
    );

    setOrdenesConNit(ordenesNit);

    // ✅ ASIGNACIONES CON NOMBRE SERVICIO Y NIT CLIENTE
    const resultado = await Promise.all(
        asig.map(async (a) => {
            try {
                const servicio = await servicioApi.obtenerServicioPorId(a.servicioId);
                const orden = ordenesNit.find(o => o.idOrden === a.ordenId);

                return {
                    ...a,
                    nombreServicio: servicio.nombreServicio,
                    nitCliente: orden?.nitCliente || "No disponible"
                };
            } catch (error) {
                console.error("Error armando asignación:", error);
                return {
                    ...a,
                    nombreServicio: "No disponible",
                    nitCliente: "No disponible"
                };
            }
        })
    );

    setAsignacionesDetalladas(resultado);
}



    async function handleSubmit(e) {
    e.preventDefault();

    try {
        if (modoEdicion) {
            // ✅ PUT (ACTUALIZAR)
            await ordenServicioApi.actualizarOrdenServicio(idEditando, formData);
            alert("✅ Asignación actualizada correctamente");
        } else {
            // ✅ POST (CREAR)
            await ordenServicioApi.crearOrdenServicio(formData);
            alert("✅ Servicio asignado correctamente");
        }

        setFormData({ ordenId: "", servicioId: "", estado: "PENDIENTE" });
        setModalOpen(false);
        setModoEdicion(false);
        setIdEditando(null);

        cargarDatos();

    } catch (error) {
        alert("❌ Error al guardar la asignación");
    }
}


    async function eliminarAsignacion(id) {
    const confirmado = window.confirm("¿Estás seguro de que deseas eliminar esta asignación?");

    if (!confirmado) return;

    try {
        await ordenServicioApi.eliminarOrdenServicio(id);

        alert("✅ Asignación eliminada correctamente");

        // Actualizar tabla sin recargar todo
        setAsignaciones(prev => prev.filter(a => a.id !== id));

    } catch (error) {
        console.error(error);
        alert("❌ Error al eliminar la asignación");
    }
}


    // -------------------------
    // MODIFICAR ASIGNACIÓN
    // -------------------------

    function abrirModalEditar(a) {
    setFormData({
        ordenId: a.ordenId,
        servicioId: a.servicioId,
        estado: a.estado
    });

    setIdEditando(a.id);
    setModoEdicion(true);
    setModalOpen(true);
}

    return (
        <div className="container">

            <button
    className="btn btn-primary mb-3"
    onClick={() => {
        setModoEdicion(false); // ✅ MODO CREAR
        setIdEditando(null);
        setFormData({ ordenId: "", servicioId: "", estado: "PENDIENTE" }); // ✅ LIMPIAR FORM
        setModalOpen(true);
    }}
>
    ➕ Crear nueva asignación
</button>


            {/* ---------------- Modal Crear ---------------- */}
            {modalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5>{modoEdicion ? "Actualizar Asignación" : "Crear Asignación"}</h5>
                            <span className="close-btn" onClick={() => setModalOpen(false)}>
                                &times;
                            </span>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label>Orden:</label>
                                <select
                                    className="form-select"
                                    value={formData.ordenId}
                                    onChange={(e) => setFormData({ ...formData, ordenId: e.target.value })}
                                    required
                                >
                                    <option value="">Seleccione una orden</option>
                                    {ordenesConNit.map((o) => (
    <option key={o.idOrden} value={o.idOrden}>
        #{o.idOrden} — NIT: {o.nitCliente}
    </option>
))}

                                </select>
                            </div>

                            <div className="mb-3">
                                <label>Servicio:</label>
                                <select
                                    className="form-select"
                                    value={formData.servicioId}
                                    onChange={(e) => setFormData({ ...formData, servicioId: e.target.value })}
                                    required
                                >
                                    <option value="">Seleccione un servicio</option>
                                    {servicios.map((s) => (
                                        <option key={s.id} value={s.id}>
                                            {s.nombreServicio}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="mb-3">
                                <label>Estado:</label>
                                <select
                                    className="form-select"
                                    value={formData.estado}
                                    onChange={(e) => setFormData({ ...formData, estado: e.target.value })}
                                    required
                                >
                                    <option value="PENDIENTE">PENDIENTE</option>
                                    <option value="EN_PROCESO">EN PROCESO</option>
                                    <option value="CANCELADO">CANCELADO</option>
                                    <option value="FINALIZADO">FINALIZADO</option>
                                </select>
                            </div>

                            <button className="btn btn-primary" type="submit">
                                {modoEdicion ? "Actualizar" : "Guardar"}
                            </button>

                        </form>
                    </div>
                </div>
            )}

            <h4>📋 Asignaciones existentes</h4>
            <div className="mb-3 d-flex gap-3 align-items-center">
    <label className="fw-bold">Filtrar por estado:</label>

    <select
        className="form-select w-auto"
        value={filtroEstado}
        onChange={(e) => setFiltroEstado(e.target.value)}
    >
        <option value="">Todos</option>
        <option value="PENDIENTE">PENDIENTE</option>
        <option value="EN_PROCESO">EN PROCESO</option>
        <option value="FINALIZADO">FINALIZADO</option>
        <option value="CANCELADO">CANCELADO</option>
    </select>
</div>


            <table className="table table-bordered table-striped">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Orden</th>
                        <th>ID servicio</th>
                        <th>Servicio</th>
                        <th>NIT Cliente</th>
                        <th>Estado</th>
                        <th>Acción</th>
                    </tr>
                </thead>

                <tbody>
                    {asignacionesDetalladas
    .filter(a => {
        if (!filtroEstado) return true;
        return a.estado === filtroEstado;
    })
    .map((a) => (

                        <tr key={a.id}>
                            <td>{a.id}</td>
                            <td>{a.ordenId}</td>
                            <td>{a.servicioId}</td>
                            <td>{a.nombreServicio}</td>
                            <td>{a.nitCliente}</td>
                            <td>{a.estado}</td>
                            <td>
                                <button
                                    className="btn btn-warning btn-sm me-4"
                                    onClick={() => abrirModalEditar(a)}
                                >
                                    ✏️ Modificar
                                </button>

                                <button
                                    className="btn btn-danger btn-sm "
                                    onClick={() => eliminarAsignacion(a.id)}
                                >
                                    🗑️ Eliminar
                                </button>
                            </td>
                        </tr>
                    ))}

                    {asignaciones.length === 0 && (
                        <tr>
                            <td colSpan="5" className="text-center">
                                No hay asignaciones registradas
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}
