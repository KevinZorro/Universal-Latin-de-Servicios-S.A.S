import './FormularioServicio.css';
import { useState } from 'react';

function FormularioServicio({ servicio, onClose }) {
  // Estado para el teléfono
  const [telefono, setTelefono] = useState('');
  const [errorTelefono, setErrorTelefono] = useState('');

  // Estado para el email (NUEVO)
  const [email, setEmail] = useState('');
  const [errorEmail, setErrorEmail] = useState('');

  const validarTelefono = (e) => {
    const valor = e.target.value;
    setTelefono(valor);
    const soloNumeros = /^[0-9+\s-]*$/;
    if (!soloNumeros.test(valor)) {
      setErrorTelefono('El número de teléfono solo debe contener números, espacios, "+" o guiones.');
    } else {
      setErrorTelefono('');
    }
  };

  // Función para validar el email (NUEVO)
  const validarEmail = (e) => {
    const valor = e.target.value;
    setEmail(valor);
    // Expresión regular para validar email (formato básico)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    
    // Solo validamos si el campo no está vacío
    if (!valor) {
      setErrorEmail('El correo electrónico es obligatorio.');
    } else if (emailRegex.test(valor)) {
      setErrorEmail('');
    } else {
      setErrorEmail('Por favor, introduce un correo válido (ej. nombre@dominio.com).');
    }
  };

  // Comprobar si hay algún error para deshabilitar el botón
  // El botón se deshabilita si hay algún error O si el email está vacío (ya que es requerido)
  const hayErrores = !!errorTelefono || !!errorEmail || !email;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Contratar Servicio de {servicio}</h2>
        <p className="descripcion">Complete el formulario y nos pondremos en contacto con usted</p>
        <form>
          <label>Nombre completo </label>
          <input type="text" required />

          <label>Correo electrónico </label>
          <input
            type="email"
            value={email}
            onChange={validarEmail} // Añadido
            onBlur={validarEmail} // Validar también cuando pierde el foco
            required
          />
          {/* Muestra error de email */}
          {errorEmail && <span className="error">{errorEmail}</span>}

          <label>Teléfono </label>
          <input
            type="tel"
            value={telefono}
            onChange={validarTelefono}
            required
          />
          {errorTelefono && <span className="error">{errorTelefono}</span>}

          <label>Dirección </label>
          <input type="text" required />

          <div className="botones">
            <button type="button" onClick={onClose}>Cancelar</button>
            {/* El botón se deshabilita si hay errores */}
            <button type="submit" disabled={hayErrores}>Enviar Solicitud</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default FormularioServicio;

