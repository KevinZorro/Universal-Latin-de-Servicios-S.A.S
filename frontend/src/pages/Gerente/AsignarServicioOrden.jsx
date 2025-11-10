// src/pages/AsignarServicioOrden.jsx
import React, { useState, useEffect } from "react";
import * as ordenServicioApi from "../Gerente/ordenServicioApi";
import * as ordenApi from "../Gerente/ordenApi";
import * as servicioApi from "../Gerente/servicioApi";

export default function AsignarServicioOrden() {
    const [ordenes, setOrdenes] = useState([]);
    const [servicios, setServicios] = useState([]);
    const [asignaciones, setAsignaciones] = useState([]);
    const [formData, setFormData] = useState({
        ordenId: "",
        servicioId: "",
        estado: "",
    });

    // Cargar datos
    useEffect(() => {
        cargarDatos();
    }, []);

    async function cargarDatos() {
        const [ord, srv, asig] = await Promise.all([
            ordenApi.obtenerTodasOrdenes(),  // 👈 ejecutada
            servicioApi.obtenerTodosServicios(), // 👈 ejecutada
            ordenServicioApi.obtenerOrdenesServicio(), // 👈 ejecutada
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
        <div className="container mt-4">
            <h2>🧩 Asignar Servicio a Orden</h2>
            <form onSubmit={handleSubmit} className="card p-3 mb-4 shadow-sm">
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
                                {s.nombreServicio} {/* antes estaba s.nombre */}
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
                    Asignar Servicio
                </button>
            </form>

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
