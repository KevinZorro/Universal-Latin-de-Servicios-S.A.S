// client/src/components/PQRSForm.jsx
import React, { useState } from "react";
import "../styles/PQRSForm.css";

const initialState = {
  nombre: "",
  correo: "",
  telefono: "",
  tipo: "",
  asunto: "",
  mensaje: "",
};

export default function PQRSForm() {
  const [form, setForm] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState(null);

  const validate = (data) => {
    const e = {};
    if (!data.nombre.trim()) e.nombre = "Nombre requerido";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.correo)) e.correo = "Email inválido";
    if (!/^[0-9+\s()-]{7,20}$/.test(data.telefono)) e.telefono = "Teléfono inválido";
    if (!data.tipo) e.tipo = "Seleccione un tipo";
    if (!data.asunto.trim()) e.asunto = "Asunto requerido";
    if (!data.mensaje.trim() || data.mensaje.length < 10) e.mensaje = "Mensaje mínimo 10 caracteres";
    return e;
  };

  const handleChange = (e) => {
    setForm((s) => ({ ...s, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    setSuccess(null);
    const e = validate(form);
    setErrors(e);
    if (Object.keys(e).length > 0) return;

    setSending(true);
    try {
      const res = await fetch("/api/pqrs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error(`Server ${res.status}`);
      const json = await res.json();
      setSuccess("Enviado correctamente.");
      setForm(initialState);
    } catch (err) {
      setSuccess(`Error al enviar: ${err.message}`);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="pqrs-modal">
      <form className="pqrs-form" onSubmit={handleSubmit} noValidate>
        <h2>PQRs — Peticiones, Quejas, Reclamos y Sugerencias</h2>

        <label>Nombre completo *</label>
        <input name="nombre" value={form.nombre} onChange={handleChange} />
        {errors.nombre && <small className="err">{errors.nombre}</small>}

        <label>Correo electrónico *</label>
        <input name="correo" value={form.correo} onChange={handleChange} />
        {errors.correo && <small className="err">{errors.correo}</small>}

        <label>Teléfono *</label>
        <input name="telefono" value={form.telefono} onChange={handleChange} placeholder="+57 300 123 4567" />
        {errors.telefono && <small className="err">{errors.telefono}</small>}

        <label>Tipo *</label>
        <select name="tipo" value={form.tipo} onChange={handleChange}>
          <option value="">Selecciona el tipo</option>
          <option value="peticion">Petición</option>
          <option value="queja">Queja</option>
          <option value="reclamo">Reclamo</option>
          <option value="sugerencia">Sugerencia</option>
        </select>
        {errors.tipo && <small className="err">{errors.tipo}</small>}

        <label>Asunto *</label>
        <input name="asunto" value={form.asunto} onChange={handleChange} />
        {errors.asunto && <small className="err">{errors.asunto}</small>}

        <label>Mensaje *</label>
        <textarea name="mensaje" value={form.mensaje} onChange={handleChange} rows="5" />
        {errors.mensaje && <small className="err">{errors.mensaje}</small>}

        <div className="pqrs-actions">
          <button type="button" onClick={() => setForm(initialState)} className="btn cancel">Cancelar</button>
          <button type="submit" className="btn primary" disabled={sending}>
            {sending ? "Enviando..." : "Enviar"}
          </button>
        </div>

        {success && <p className="status">{success}</p>}
      </form>
    </div>
  );
}
