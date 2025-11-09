import React, { useState } from 'react';
import './TrabajaForm.css';

function TrabajaForm({ onClose }) {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    posicion: '',
    experiencia: '',
    mensaje: '',
    hojaDeVida: null
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: files ? files[0] : value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Datos del formulario de trabajo:', formData);
    alert('Gracias por tu interés. Hemos recibido tu solicitud.');
    onClose();
  };

  return (
    <div className="trabaja-modal-overlay" onClick={onClose}>
      <div className="trabaja-modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="trabaja-close-btn" onClick={onClose}>×</button>
        <h2>Trabaja con Nosotros</h2>
        <p className="trabaja-descripcion">Únete a nuestro equipo de profesionales</p>

        <form onSubmit={handleSubmit} className="trabaja-form">
          <div className="form-group">
            <label htmlFor="nombre">Nombre completo *</label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              placeholder="Juan Pérez"
              required
              value={formData.nombre}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Correo electrónico *</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="juan@ejemplo.com"
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
              placeholder="+57 300 123 4567"
              required
              value={formData.telefono}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="posicion">Posición de interés *</label>
            <select
              id="posicion"
              name="posicion"
              required
              value={formData.posicion}
              onChange={handleChange}
            >
              <option value="">Selecciona una posición</option>
              <option value="jardineria">Jardinería</option>
              <option value="porteria">Portería / Recepcionista</option>
              <option value="aseo">Limpieza / Aseo</option>
              <option value="conserjeria">Conserjería</option>
              <option value="mantenimiento">Mantenimiento</option>
              <option value="cafeteria">Cafetería</option>
              <option value="piscinas">Mantenimiento de Piscinas</option>
              <option value="oficios">Oficios Varios</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="experiencia">Años de experiencia *</label>
            <input
              type="text"
              id="experiencia"
              name="experiencia"
              placeholder="Ej: 3 años"
              required
              value={formData.experiencia}
              onChange={handleChange}
            />
          </div>

          <div className="form-group file-input-group">
            <label htmlFor="hojaDeVida">Hoja de vida *</label>
            <div className="file-drop-area">
              <span className="file-icon">📄</span>
              <span className="file-msg">Haz clic para subir tu hoja de vida</span>
              <span className="file-info">PDF, DOC, DOCX (máx. 5MB)</span>
              <input
                type="file"
                id="hojaDeVida"
                name="hojaDeVida"
                className="file-input"
                accept=".pdf,.doc,.docx"
                required
                onChange={handleChange}
              />
            </div>
             {formData.hojaDeVida && (
                <p className="file-selected">Archivo seleccionado: {formData.hojaDeVida.name}</p>
              )}
          </div>

          <div className="form-group">
            <label htmlFor="mensaje">Cuéntanos sobre ti (opcional)</label>
            <textarea
              id="mensaje"
              name="mensaje"
              placeholder="Experiencia, habilidades, disponibilidad..."
              rows="3"
              value={formData.mensaje}
              onChange={handleChange}
            ></textarea>
          </div>

          <div className="trabaja-botones">
            <button type="button" className="btn-cancelar" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="btn-enviar">
              Enviar Solicitud
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default TrabajaForm;