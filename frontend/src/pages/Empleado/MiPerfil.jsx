import React, { useState, useEffect } from 'react';
import { actualizarPerfilEmpleado, obtenerEmpleadoPorCedula } from './empleadoService';
import './miPerfil.css';

export default function MiPerfil({ cedula }) {
    const [form, setForm] = useState({ nombre: '', apellido: '', email: '', telefono: '' });
    const [loading, setLoading] = useState(true);
    const [mensaje, setMensaje] = useState(null); // ahora es un objeto { texto, tipo }

    useEffect(() => {
        async function cargarDatos() {
            try {
                setLoading(true);
                const data = await obtenerEmpleadoPorCedula(cedula);
                setForm({
                    nombre: data.nombre,
                    apellido: data.apellido,
                    email: data.email,
                    telefono: data.telefono
                });
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        }
        cargarDatos();
    }, [cedula]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await actualizarPerfilEmpleado(cedula, form);
            setMensaje({ texto: '✅ ¡Perfil actualizado correctamente!', tipo: 'success' });
        } catch (err) {
            console.error(err);
            setMensaje({ texto: '❌ Error al actualizar perfil, intenta de nuevo.', tipo: 'error' });
        }
    };

    if (loading) return <p>Cargando...</p>;

    return (
        <div className="perfil-container">
            <h2>Mi Perfil</h2>
            {mensaje && (
                <p className={`perfil-message ${mensaje.tipo}`}>
                    {mensaje.texto}
                </p>
            )}
            <form onSubmit={handleSubmit} className="perfil-form">
                <label>
                    Nombre:
                    <input type="text" name="nombre" value={form.nombre} onChange={handleChange} />
                </label>
                <label>
                    Apellido:
                    <input type="text" name="apellido" value={form.apellido} onChange={handleChange} />
                </label>
                <label>
                    Email:
                    <input type="email" name="email" value={form.email} onChange={handleChange} />
                </label>
                <label>
                    Teléfono:
                    <input type="text" name="telefono" value={form.telefono} onChange={handleChange} />
                </label>
                <button type="submit">Guardar cambios</button>
            </form>
        </div>
    );
}
