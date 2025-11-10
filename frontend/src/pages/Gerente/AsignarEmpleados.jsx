import React, { useState, useEffect } from "react";
import * as asignacionApi from "../Gerente/asignacionApi";

export default function AsignarEmpleados() {
    const [ordenesServicio, setOrdenesServicio] = useState([]);
    const [empleados, setEmpleados] = useState([]);
    const [asignaciones, setAsignaciones] = useState([]);
    const [formData, setFormData] = useState({
        ordenServicioId: "",
        empleadoId: "",
        fechaAsignacion: new Date().toISOString().split("T")[0] // fecha actual
    });
    const [modalOpen, setModalOpen] = useState(false);

    useEffect(() => {
        cargarDatos();
    }, []);

    async function cargarDatos() {
        const [ord, emp, asig] = await Promise.all([
            asignacionApi.obtenerOrdenesServicio(),
            asignacionApi.obtenerEmpleados(),
            asignacionApi.obtenerAsignaciones(),
        ]);
        setOrdenesServicio(ord);
        setEmpleados(emp);
        setAsignaciones(asig);
    }

    async function handleSubmit(e) {
        e.preventDefault();
        try {
            await asignacionApi.crearAsignacion(formData);
            alert("Empleado asignado correctamente ✅");
            setFormData({
                ordenServicioId: "",
                empleadoId: "",
                fechaAsignacion: new Date().toISOString().split("T")[0]
            });
            setModalOpen(false);
            cargarDatos();
        } catch (error) {
            alert(error.message);
        }
    }

    async function handleEliminar(id) {
        if (window.confirm("¿Deseas eliminar esta asignación?")) {
            await asignacionApi.eliminarAsignacion(id);
            cargarDatos();
        }
    }

    return (
        <div className="container mt-4">
            <h2>🧑‍💼 Asignar Empleado a Orden-Servicio</h2>
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
                                <label>Orden-Servicio:</label>
                                <select
                                    className="form-select"
                                    value={formData.ordenServicioId}
                                    onChange={(e) => setFormData({ ...formData, ordenServicioId: e.target.value })}
                                    required
                                >
                                    <option value="">Seleccione una orden-servicio</option>
                                    {ordenesServicio.map((os) => (
                                        <option key={os.id} value={os.id}>
                                            #{os.id} - Servicio #{os.servicioId}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="mb-3">
                                <label>Empleado:</label>
                                <select
                                    className="form-select"
                                    value={formData.empleadoId}
                                    onChange={(e) => setFormData({ ...formData, empleadoId: e.target.value })}
                                    required
                                >
                                    <option value="">Seleccione un empleado</option>
                                    {empleados.map((emp) => (
                                        <option key={emp.cedula} value={emp.cedula}>
                                            {emp.nombre} {emp.apellido} {/* CORRECCIÓN */}
                                        </option>
                                    ))}

                                </select>
                            </div>

                            <div className="mb-3">
                                <label>Fecha de asignación:</label>
                                <input
                                    type="date"
                                    className="form-control"
                                    value={formData.fechaAsignacion}
                                    onChange={(e) => setFormData({ ...formData, fechaAsignacion: e.target.value })}
                                    required
                                />
                            </div>

                            <button className="btn btn-primary" type="submit">Guardar</button>
                        </form>
                    </div>
                </div>
            )}

            <h4>📋 Asignaciones existentes</h4>
            <table className="table table-bordered table-striped">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Orden-Servicio</th>
                        <th>Empleado</th>
                        <th>Fecha</th>
                        <th>Acción</th>
                    </tr>
                </thead>
                <tbody>
                    {asignaciones.map((a) => (
                        <tr key={a.id}>
                            <td>{a.id}</td>
                            <td>{a.ordenServicioId}</td>
                            <td>{a.empleadoId}</td>
                            <td>{new Date(a.fechaAsignacion).toLocaleDateString('es-CO')}</td>
                            <td>
                                <button className="btn btn-danger btn-sm" onClick={() => handleEliminar(a.id)}>
                                    🗑️ Eliminar
                                </button>
                            </td>
                        </tr>
                    ))}
                    {asignaciones.length === 0 && (
                        <tr>
                            <td colSpan="5" className="text-center">No hay asignaciones registradas</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}
