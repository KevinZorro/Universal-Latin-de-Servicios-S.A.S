import React, { useState } from 'react';
import './TrabajaForm.css';

function TrabajaForm({ onClose }) {
  // Estado para el formulario (con 'apellido' añadido)
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '', // <-- AÑADIDO
    cedula: '',
    email: '',
    telefono: '',
    posicion: '',
    experiencia: '',
    mensaje: '',
    hojaDeVida: null
  });

  // Estados para manejar la respuesta del servidor
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Tu manejador de cambios (funciona perfecto)
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: files ? files[0] : value
    });
  };

  /**
   * Manejador de envío actualizado para conectar al Backend
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Resetear estados
    setLoading(true);
    setError(null);
    setSuccess(null);

    // 1. Validar que la hoja de vida exista y no sea muy grande (10MB)
    if (!formData.hojaDeVida) {
      setError('Por favor, adjunta tu hoja de vida.');
      setLoading(false);
      return;
    }

    // --- LÍMITE DE TAMAÑO ACTUALIZADO ---
    const maxSizeInBytes = 10 * 1024 * 1024; // 10MB
    if (formData.hojaDeVida.size > maxSizeInBytes) {
      setError('El archivo es muy pesado (Máx 10MB).'); // Mensaje actualizado
      setLoading(false);
      return;
    }

    // 2. Crear el DTO de texto (debe coincidir con CandidatoRegistroDto.java)
    const candidatoDto = {
      cedula: formData.cedula,
      nombre: formData.nombre,
      apellido: formData.apellido, // <-- AÑADIDO
      email: formData.email,
      telefono: formData.telefono,
      posicion: formData.posicion,
      experiencia: formData.experiencia,
      mensaje: formData.mensaje
    };

    // 3. Crear el FormData
    const data = new FormData();

    // 'hojaDeVida' debe coincidir con @RequestPart("hojaDeVida")
    data.append('hojaDeVida', formData.hojaDeVida);

    // 'candidato' debe coincidir con @RequestPart("candidato")
    data.append('candidato', new Blob([JSON.stringify(candidatoDto)], {
      type: "application/json"
    }));

    // 4. Enviar la petición al backend
    // 4. Enviar la petición al backend
    try {
      // URL del endpoint que creamos en el CandidatoController
      const response = await fetch('http://localhost:8080/api/candidatos/registrar', {
        method: 'POST',
        body: data,
      });

      setLoading(false);

      if (response.ok) {
        setSuccess('¡Solicitud enviada! Gracias por tu interés.');
        // Limpiar formulario (con 'apellido' añadido)
        setFormData({
          nombre: '', apellido: '', cedula: '', email: '', telefono: '',
          posicion: '', experiencia: '', mensaje: '', hojaDeVida: null
        });
        e.target.reset(); // Resetea el input de archivo

        // Cierra el modal después de 2 segundos
        setTimeout(onClose, 2000);
      } else {
        const errData = await response.json();
        setError(errData.error || 'Ocurrió un error al enviar la solicitud.');
      }

    } catch (err) {
      setLoading(false);
      setError('Error de conexión. Inténtalo más tarde.');
      console.error(err);
    }
  };

  return (
    <div className="trabaja-modal-overlay" onClick={onClose}>
      <div className="trabaja-modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="trabaja-close-btn" onClick={onClose}>×</button>
        <h2>Trabaja con Nosotros</h2>
        <p className="trabaja-descripcion">Únete a nuestro equipo de profesionales</p>

        <form onSubmit={handleSubmit} className="trabaja-form">

          {/* --- CAMPO NOMBRE ACTUALIZADO --- */}
          <div className="form-group">
            <label htmlFor="nombre">Nombre *</label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              placeholder="Juan"
              required
              value={formData.nombre}
              onChange={handleChange}
            />
          </div>

          {/* --- CAMPO APELLIDO AÑADIDO --- */}
          <div className="form-group">
            <label htmlFor="apellido">Apellido *</label>
            <input
              type="text"
              id="apellido"
              name="apellido"
              placeholder="Pérez"
              required
              value={formData.apellido}
              onChange={handleChange}
            />
          </div>

          {/* CAMPO CÉDULA */}
          <div className="form-group">
            <label htmlFor="cedula">Cédula / N° de Identificación *</label>
            <input
              type="text"
              id="cedula"
              name="cedula"
              placeholder="Tu número de identificación"
              required
              value={formData.cedula}
              onChange={handleChange}
            />
          </div>

          {/* Campo Email */}
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

          {/* Campo Teléfono */}
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

          {/* Campo Posición */}
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

          {/* Campo Experiencia */}
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

          {/* Campo Hoja de Vida */}
          <div className="form-group file-input-group">
            <label htmlFor="hojaDeVida">Hoja de vida *</label>
            <div className="file-drop-area">
              <span className="file-icon">📄</span>
              <span className="file-msg">
                {formData.hojaDeVida ? formData.hojaDeVida.name : "Haz clic para subir tu hoja de vida"}
              </span>
              {/* --- TEXTO DE TAMAÑO ACTUALIZADO --- */}
              <span className="file-info">PDF, DOC, DOCX (máx. 10MB)</span>
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
          </div>

          {/* Campo Mensaje */}
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

          {/* --- Mensajes de Estado --- */}
          <div className="form-status">
            {loading && <p className="loading-message">Enviando solicitud...</p>}
            {error && <p className="error-message">{error}</p>}
            {success && <p className="success-message">{success}</p>}
          </div>

          {/* Botones */}
          <div className="trabaja-botones">
            <button type="button" className="btn-cancelar" onClick={onClose} disabled={loading}>
              Cancelar
            </button>
            <button type="submit" className="btn-enviar" disabled={loading}>
              {loading ? 'Enviando...' : 'Enviar Solicitud'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default TrabajaForm;