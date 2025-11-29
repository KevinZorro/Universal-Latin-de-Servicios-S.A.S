import React, { useState, useEffect } from "react";
import * as asignacionApi from "../Gerente/asignacionApi";
import '../Gerente/AsignarEmpleados.css'
import * as servicioApi from "../Gerente/servicioApi";


export default function AsignarEmpleados() {
    const [ordenesServicio, setOrdenesServicio] = useState([]);
    const [empleados, setEmpleados] = useState([]);
    const [asignaciones, setAsignaciones] = useState([]);
    const [asignacionesDetalladas, setAsignacionesDetalladas] = useState([]);
    const [modoEdicion, setModoEdicion] = useState(false);
    const [asignacionEditandoId, setAsignacionEditandoId] = useState(null);
    const [servicios, setServicios] = useState([]);
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

    // ✅ AQUÍ BUSCAMOS EL SERVICIO USANDO EL SERVICIO API (COMO TÚ QUIERES)
    const resultado = await Promise.all(
        asig.map(async (a) => {
            try {
                const ordenServicio = ord.find(o => Number(o.id) === Number(a.ordenServicioId));

                if (!ordenServicio) {
                    return { ...a, nombreServicio: "Orden no encontrada" };
                }

                const servicio = await servicioApi.obtenerServicioPorId(ordenServicio.servicioId);

                return {
                    ...a,
                    nombreServicio: servicio.nombreServicio // ✅ ESTE SÍ LLEGA
                };
            } catch (error) {
                console.error("Error obteniendo servicio:", error);
                return {
                    ...a,
                    nombreServicio: "No disponible"
                };
            }
        })
    );

    setAsignacionesDetalladas(resultado);
}



    function abrirEdicion(asignacion) {
    setFormData({
        ordenServicioId: asignacion.ordenServicioId,
        empleadoId: asignacion.empleadoId,
        fechaAsignacion: asignacion.fechaAsignacion.split("T")[0]
    });

    setAsignacionEditandoId(asignacion.id);
    setModoEdicion(true);
    setModalOpen(true);
}

    async function handleSubmit(e) {
    e.preventDefault();

    try {
        if (modoEdicion) {
            await asignacionApi.actualizarAsignacion(asignacionEditandoId, formData);
            alert("✅ Asignación actualizada correctamente");
        } else {
            await asignacionApi.crearAsignacion(formData);
            alert("✅ Empleado asignado correctamente");
        }

        setFormData({
            ordenServicioId: "",
            empleadoId: "",
            fechaAsignacion: new Date().toISOString().split("T")[0]
        });

        setModoEdicion(false);
        setAsignacionEditandoId(null);
        setModalOpen(false);
        cargarDatos();

    } catch (error) {
        alert("❌ Error al guardar la asignación");
    }
}


    async function handleEliminar(id) {
    const confirmado = window.confirm("¿Estás seguro de que deseas eliminar esta asignación de empleado?");

    if (!confirmado) return;

    try {
        await asignacionApi.eliminarAsignacion(id);

        alert("✅ Asignación de empleado eliminada correctamente");

        // Actualiza la tabla sin recargar todo
        setAsignaciones(prev => prev.filter(a => a.id !== id));

    } catch (error) {
        console.error(error);
        alert("❌ Error al eliminar la asignación del empleado");
    }
}

function obtenerNombreServicioPorOrden(ordenServicioId) {
    const orden = ordenesServicio.find(
        o => Number(o.id) === Number(ordenServicioId)
    );
    if (!orden) return "Orden no encontrada";

    const servicio = servicios.find(
        s => Number(s.id) === Number(orden.servicioId)
    );

    return servicio ? servicio.nombre : "Servicio no encontrado";
}

    return (
        <div className="container mt-4">
            <button 
    className="btn btn-primary mb-3"
    onClick={() => {
        setModoEdicion(false);
        setAsignacionEditandoId(null);
        setFormData({
            ordenServicioId: "",
            empleadoId: "",
            fechaAsignacion: new Date().toISOString().split("T")[0]
        });
        setModalOpen(true);
    }}
>
    ➕ Crear nueva asignación
</button>


            {modalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5>{modoEdicion ? "Editar Asignación" : "Crear Asignación"}</h5>
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
                                    {asignacionesDetalladas.map((a) => (
    <option key={a.ordenServicioId} value={a.ordenServicioId}>
        Orden #{a.ordenServicioId} - {a.nombreServicio}
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

                            <button className="btn btn-primary" type="submit">
                                {modoEdicion ? "Actualizar" : "Guardar"}
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
                        <th>Orden-Servicio</th>
                        <th>Servicio</th>
                        <th>Empleado</th>
                        <th>Fecha</th>
                        <th>Acción</th>
                    </tr>
                </thead>
                <tbody>
                    {asignacionesDetalladas.map((a) => (
                        <tr key={a.id}>
                            <td>{a.id}</td>
                            <td>{a.ordenServicioId}</td>
                            <td>{a.nombreServicio}</td>
                            <td>{a.empleadoId}</td>
                            <td>{new Date(a.fechaAsignacion).toLocaleDateString('es-CO')}</td>
                            <td>
    <button 
        className="btn btn-warning btn-sm me-2"
        onClick={() => abrirEdicion(a)}
    >
        ✏️ Editar
    </button>

    <button 
        className="btn btn-danger btn-sm"
        onClick={() => handleEliminar(a.id)}
    >
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
