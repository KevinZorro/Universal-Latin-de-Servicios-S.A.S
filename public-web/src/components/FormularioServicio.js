import './FormularioServicio.css';
import { useState } from 'react';

function FormularioServicio({ servicio, onClose }) {
  const [telefono, setTelefono] = useState('');
  const [errorTelefono, setErrorTelefono] = useState('');

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

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Contratar Servicio de {servicio}</h2>
        <p className="descripcion">Complete el formulario y nos pondremos en contacto con usted</p>
        <form>
          <label>Nombre completo </label>
          <input type="text" required />

          <label>Correo electrónico </label>
          <input type="email" required />

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
            <button type="submit" disabled={!!errorTelefono}>Enviar Solicitud</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default FormularioServicio;
