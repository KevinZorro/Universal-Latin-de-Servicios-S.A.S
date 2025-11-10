import React, { useState, useEffect } from "react";
import * as ordenServicioApi from "../Gerente/ordenServicioApi";
import * as ordenApi from "../Gerente/ordenApi";
import * as servicioApi from "../Gerente/servicioApi";
import "./AsignarServicioOrden.css";

export default function AsignarServicioOrden() {
    const [ordenes, setOrdenes] = useState([]);
    const [servicios, setServicios] = useState([]);
    const [asignaciones, setAsignaciones] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);

    const [formData, setFormData] = useState({
        ordenId: "",
        servicioId: "",
        estado: "PENDIENTE",
    });

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
    }

    async function handleSubmit(e) {
        e.preventDefault();
        try {
            await ordenServicioApi.crearOrdenServicio(formData);
            alert("Servicio asignado correctamente ✅");
            setFormData({ ordenId: "", servicioId: "", estado: "PENDIENTE" });
            setModalOpen(false);
            cargarDatos();
        } catch (error) {
            alert(error.message);
        }
    }

    async function eliminarAsignacion(id) {
        if (window.confirm("¿Deseas eliminar esta asignación?")) {
            await ordenServicioApi.eliminarOrdenServicio(id);
            cargarDatos();
        }
    }

    return (
        <div className="container">

            <button className="btn btn-primary mb-3" onClick={() => setModalOpen(true)}>
                ➕ Crear nueva asignación
            </button>

            {modalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5>Crear Asignación</h5>
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
                                    {ordenes.map((o) => (
                                        <option key={o.idOrden} value={o.idOrden}>
                                            #{o.idOrden}
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
                                    <option value="">Seleccione un estado</option>
                                    <option value="PENDIENTE">PENDIENTE</option>
                                    <option value="FINALIZADO">FINALIZADO</option>
                                </select>
                            </div>

                            <button className="btn btn-primary" type="submit">
                                Guardar
                            </button>
                        </form>
                    </div>
                </div>
            )}

            <h4>📋 Asignaciones existentes</h4>
            <table className="table table-bordered table-striped">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Orden</th>
                        <th>Servicio</th>
                        <th>Estado</th>
                        <th>Acción</th>
                    </tr>
                </thead>
                <tbody>
                    {asignaciones.map((a) => (
                        <tr key={a.id}>
                            <td>{a.id}</td>
                            <td>{a.ordenId}</td>
                            <td>{a.servicioId}</td>
                            <td>{a.estado}</td>
                            <td>
                                <button
                                    className="btn btn-danger btn-sm"
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
