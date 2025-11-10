import React, { useState } from 'react';
import './PqrsForm.css';

function PqrsForm({ onClose }) {
  const [formData, setFormData] = useState({
    nombreCompleto: '',
    email: '',
    telefono: '',
    tipo: '',
    asunto: '',
    mensaje: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    // Preparamos los datos tal como los espera el NUEVO PQRsDto en el backend
    const payload = {
      tipo: formData.tipo,
      // Concatenamos asunto y mensaje en la descripción, ya que PQRsDto solo tiene 'descripcion'
      descripcion: `ASUNTO: ${formData.asunto} - DESCRIPCIÓN: ${formData.mensaje}`,
      // Enviamos los datos del cliente por separado para que el backend los procese
      nombreCompleto: formData.nombreCompleto,
      email: formData.email,
      telefono: formData.telefono,
      estado: 'Pendiente'
    };

    try {
      const response = await fetch('http://localhost:8080/api/pqrs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error('Error al enviar la PQRS.');
      }

      alert('¡Su solicitud PQRS ha sido radicada exitosamente!');
      onClose();
    } catch (err) {
      console.error("Error:", err);
      setError('Hubo un problema al enviar su solicitud.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    // ... (El JSX del formulario sigue exactamente igual que antes)
    <div className="pqrs-modal-overlay" onClick={onClose}>
      {/* ... contenido del modal ... */}
       <div className="pqrs-modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="pqrs-close-btn" onClick={onClose}>×</button>
        <h2>PQRS</h2>
        <p className="pqrs-descripcion">Peticiones, Quejas, Reclamos y Sugerencias</p>

        {error && <div className="error-message" style={{ color: 'red', marginBottom: '1rem' }}>{error}</div>}

        <form onSubmit={handleSubmit} className="pqrs-form">
          <div className="form-group">
            <label htmlFor="nombreCompleto">Nombre completo *</label>
            <input
              type="text"
              id="nombreCompleto"
              name="nombreCompleto"
              required
              value={formData.nombreCompleto}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Correo electrónico *</label>
            <input
              type="email"
              id="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="telefono">Teléfono *</label>
            <input
              type="tel"
              id="telefono"
              name="telefono"
              required
              value={formData.telefono}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="tipo">Tipo *</label>
            <select
              id="tipo"
              name="tipo"
              required
              value={formData.tipo}
              onChange={handleChange}
            >
              <option value="">Selecciona el tipo</option>
              <option value="Petición">Petición</option>
              <option value="Queja">Queja</option>
              <option value="Reclamo">Reclamo</option>
              <option value="Sugerencia">Sugerencia</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="asunto">Asunto *</label>
            <input
              type="text"
              id="asunto"
              name="asunto"
              required
              value={formData.asunto}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="mensaje">Mensaje *</label>
            <textarea
              id="mensaje"
              name="mensaje"
              rows="4"
              required
              value={formData.mensaje}
              onChange={handleChange}
            ></textarea>
          </div>

          <div className="pqrs-botones">
            <button type="button" className="btn-cancelar" onClick={onClose} disabled={isSubmitting}>
              Cancelar
            </button>
            <button type="submit" className="btn-enviar" disabled={isSubmitting}>
              {isSubmitting ? 'Enviando...' : 'Enviar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default PqrsForm;