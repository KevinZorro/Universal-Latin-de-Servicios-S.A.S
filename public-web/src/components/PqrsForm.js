import React, { useState } from 'react';
import './PqrsForm.css';

function PqrsForm({ onClose }) {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    tipo: '',
    asunto: '',
    mensaje: ''
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Limpiar error al escribir
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const validate = () => {
    let tempErrors = {};
    if (!formData.nombre) tempErrors.nombre = "El nombre es obligatorio.";
    if (!formData.email) {
      tempErrors.email = "El correo es obligatorio.";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      tempErrors.email = "Formato de correo inválido.";
    }
    if (!formData.telefono) tempErrors.telefono = "El teléfono es obligatorio.";
    if (!formData.tipo) tempErrors.tipo = "Debe seleccionar un tipo.";
    if (!formData.asunto) tempErrors.asunto = "El asunto es obligatorio.";
    if (!formData.mensaje) tempErrors.mensaje = "El mensaje es obligatorio.";

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      console.log("Datos PQRS a enviar:", formData);
      alert("¡Gracias! Su PQRS ha sido recibida. Nos pondremos en contacto pronto.");
      onClose(); // Cerrar el modal tras envío exitoso
    }
  };

  return (
    <div className="pqrs-modal-overlay" onClick={onClose}>
      <div className="pqrs-modal-content" onClick={e => e.stopPropagation()}>
        <button className="pqrs-close-btn" onClick={onClose}>×</button>
        <h2>PQRS</h2>
        <p className="pqrs-subtitle">Peticiones, Quejas, Reclamos y Sugerencias</p>

        <form onSubmit={handleSubmit} className="pqrs-form">
          <div className="form-group">
            <label>Nombre completo *</label>
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              placeholder="Juan Pérez"
              className={errors.nombre ? 'input-error' : ''}
            />
            {errors.nombre && <small className="error-text">{errors.nombre}</small>}
          </div>

          <div className="form-group">
            <label>Correo electrónico *</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="juan@ejemplo.com"
              className={errors.email ? 'input-error' : ''}
            />
            {errors.email && <small className="error-text">{errors.email}</small>}
          </div>

          <div className="form-group">
            <label>Teléfono *</label>
            <input
              type="tel"
              name="telefono"
              value={formData.telefono}
              onChange={handleChange}
              placeholder="+57 300 123 4567"
              className={errors.telefono ? 'input-error' : ''}
            />
            {errors.telefono && <small className="error-text">{errors.telefono}</small>}
          </div>

          <div className="form-group">
            <label>Tipo *</label>
            <select
              name="tipo"
              value={formData.tipo}
              onChange={handleChange}
              className={errors.tipo ? 'input-error' : ''}
            >
              <option value="">Selecciona el tipo</option>
              <option value="peticion">Petición</option>
              <option value="queja">Queja</option>
              <option value="reclamo">Reclamo</option>
              <option value="sugerencia">Sugerencia</option>
              <option value="felicitacion">Felicitación</option>
            </select>
            {errors.tipo && <small className="error-text">{errors.tipo}</small>}
          </div>

          <div className="form-group">
            <label>Asunto *</label>
            <input
              type="text"
              name="asunto"
              value={formData.asunto}
              onChange={handleChange}
              placeholder="Descripción breve del asunto"
              className={errors.asunto ? 'input-error' : ''}
            />
            {errors.asunto && <small className="error-text">{errors.asunto}</small>}
          </div>

          <div className="form-group">
            <label>Mensaje *</label>
            <textarea
              name="mensaje"
              value={formData.mensaje}
              onChange={handleChange}
              placeholder="Describe tu petición, queja, reclamo o sugerencia..."
              rows="4"
              className={errors.mensaje ? 'input-error' : ''}
            ></textarea>
            {errors.mensaje && <small className="error-text">{errors.mensaje}</small>}
          </div>

          <div className="pqrs-botones">
            <button type="button" className="btn-cancelar" onClick={onClose}>Cancelar</button>
            <button type="submit" className="btn-enviar">Enviar</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default PqrsForm;