// src/pages/CreateEmployee.jsx
import React, { useState, useEffect } from 'react';
import './Dashboard.css';
import { cargosService } from "../Gerente/apiService"; // <-- importa el servicio


const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:8080';

export default function AgregarEmpleado() {
  const [formData, setFormData] = useState({
  tipoEmpleado: '',
  nombres: '',
  apellidos: '',
  fechaNacimiento: '',
  tipoDocumento: '',
  numeroDocumento: '',
  genero: '',
  telefonoPrincipal: '',
  telefonoSecundario: '',
  email: '',
  direccion: '',
  ciudad: '',
  departamento: '',
  codigoPostal: '',
  fechaIngreso: '',
  turno: '',
  area: '',
  estado: 'Activo',

  // ✅ NUEVOS CAMPOS
  tipoContrato: '',
  fechaRetiro: '',
});

useEffect(() => {
  if (formData.tipoContrato === "INDEFINIDO") {
    setFormData(prev => ({
      ...prev,
      fechaRetiro: ''
    }));
  }
}, [formData.tipoContrato]);


  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setLoading(true);

    try {
      const token = localStorage.getItem('token');

      if (!token) {
        throw new Error('No se encontró token de autenticación');
      }

      // TRANSFORMAR los datos al formato que espera el backend
      const empleadoData = {
  cedula: formData.numeroDocumento,
  nombre: formData.nombres,
  apellido: formData.apellidos,
  telefono: formData.telefonoPrincipal,
  email: formData.email,
  fechaIngreso: formData.fechaIngreso,

  // ✅ NUEVOS CAMPOS
  tipoContrato: formData.tipoContrato,
  fechaRetiro:
    formData.tipoContrato === "INDEFINIDO"
      ? null
      : formData.fechaRetiro || null,

  activo: formData.estado === 'Activo',
  rol: 'EMPLEADO',
  passwordHash: formData.password,
};


      console.log('Datos del formulario:', formData);
      console.log('Enviando al backend:', empleadoData);

      const response = await fetch(`${API_BASE}/api/empleados/crear`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(empleadoData),
      });

      console.log('Status de respuesta:', response.status);
      console.log('Headers de respuesta:', Object.fromEntries(response.headers.entries()));

      // CORRECCIÓN: Manejar correctamente errores del servidor
      if (!response.ok) {
        let errorMessage = 'Error al guardar el empleado';
        let fullErrorText = '';

        try {
          // Primero intentar obtener como texto
          fullErrorText = await response.text();
          console.log('Respuesta completa del servidor:', fullErrorText);

          // Luego intentar parsear como JSON
          try {
            const errorData = JSON.parse(fullErrorText);
            errorMessage = errorData.message || errorData.error || errorData.mensaje || fullErrorText;
            console.log('Error parseado como JSON:', errorData);
          } catch {
            // Si no es JSON válido, usar el texto completo
            errorMessage = fullErrorText || `Error ${response.status}: ${response.statusText}`;
          }
        } catch (textError) {
          console.error('No se pudo leer la respuesta:', textError);
          errorMessage = `Error ${response.status}: ${response.statusText}`;
        }

        throw new Error(errorMessage);
      }

      // Si la respuesta es exitosa, parsear los datos
      const data = await response.json();

      setSuccess(true);
      console.log('Empleado guardado exitosamente:', data);

      // Limpiar el formulario después de 2 segundos
      setTimeout(() => {
        setFormData({
          tipoEmpleado: '',
          nombres: '',
          apellidos: '',
          fechaNacimiento: '',
          tipoDocumento: '',
          numeroDocumento: '',
          genero: '',
          telefonoPrincipal: '',
          telefonoSecundario: '',
          password: '',
          email: '',
          direccion: '',
          ciudad: '',
          departamento: '',
          codigoPostal: '',
          fechaIngreso: '',
          turno: '',
          area: '',
          estado: 'Activo',
          tipoContrato: '',
          fechaRetiro: '',
        });
        setSuccess(false);
      }, 2000);

    } catch (err) {
      console.error('Error al guardar empleado:', err);
      setError(err.message || 'Error inesperado al guardar el empleado');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      tipoEmpleado: '',
      nombres: '',
      apellidos: '',
      fechaNacimiento: '',
      tipoDocumento: '',
      numeroDocumento: '',
      genero: '',
      telefonoPrincipal: '',
      telefonoSecundario: '',
      email: '',
      direccion: '',
      ciudad: '',
      departamento: '',
      codigoPostal: '',
      fechaIngreso: '',
      turno: '',
      area: '',
      estado: 'Activo',
    });
    setError('');
    setSuccess(false);
  };

  const [cargos, setCargos] = useState([]); // aquí se guardan los tipos de empleado

  useEffect(() => {
    const fetchCargos = async () => {
      try {
        setLoading(true);
        const data = await cargosService.getAll(); // obtiene los cargos desde el backend
        console.log("Aqui")
        console.log(data)
        setCargos(data._embedded?.cargoList || []);
      } catch (error) {
        console.error("Error cargando los tipos de empleado:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCargos();
  }, []);

  return (
    <div className="content-area">
      <div className="content-header">
        <div>
          <h1 className="content-title">Agregar Nuevo Empleado</h1>
          <p className="content-subtitle">
            Complete el formulario con la información del empleado
          </p>
        </div>
      </div>

      {/* Mensajes de Error y Éxito */}
      {error && (
        <div className="error-alert" style={{
          backgroundColor: '#fee',
          border: '1px solid #fcc',
          borderRadius: '8px',
          padding: '12px 16px',
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          <span style={{ fontSize: '20px' }}>⚠️</span>
          <p style={{ margin: 0, color: '#c33' }}>{error}</p>
        </div>
      )}

      {success && (
        <div className="success-alert" style={{
          backgroundColor: '#efe',
          border: '1px solid #cfc',
          borderRadius: '8px',
          padding: '12px 16px',
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          <span style={{ fontSize: '20px' }}>✅</span>
          <p style={{ margin: 0, color: '#3c3' }}>¡Empleado guardado exitosamente!</p>
        </div>
      )}

      {/* Info Alert */}
      <div className="info-alert">
        <span className="alert-icon">ℹ️</span>
        <p className="alert-text">
          Todos los campos marcados con (*) son obligatorios. La contraseña inicial del empleado será su número de documento.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="form-container">
        {/* Tipo de Empleado */}
        <section className="form-section">
          <div className="section-header">
            <span className="section-icon">👤</span>
            <h3 className="section-title">Tipo de Empleado</h3>
          </div>
          <div className="form-row">
            <div className="form-field full-width">
              <select
                name="tipoEmpleado"
                value={formData.tipoEmpleado}
                onChange={handleChange}
                className="form-select"
                required
                disabled={loading}
              >
                <option value="">Seleccione</option>

                {cargos.length > 0 ? (
                  cargos.map((cargo) => (
                    <option key={cargo.id} value={cargo.nombre}>
                      {cargo.nombre}
                    </option>
                  ))
                ) : (
                  <option disabled>Cargando cargos...</option>
                )}
              </select>
            </div>
          </div>
        </section>
        {/* Información Personal */}
        <section className="form-section">
          <div className="section-header">
            <span className="section-icon">📋</span>
            <h3 className="section-title">Información Personal</h3>
          </div>
          <div className="form-row">
            <div className="form-field">
              <label className="field-label">
                Nombres <span className="required">*</span>
              </label>
              <input
                type="text"
                name="nombres"
                value={formData.nombres}
                onChange={handleChange}
                className="form-input"
                placeholder="Ej: Juan Carlos"
                required
                disabled={loading}
              />
            </div>
            <div className="form-field">
              <label className="field-label">
                Apellidos <span className="required">*</span>
              </label>
              <input
                type="text"
                name="apellidos"
                value={formData.apellidos}
                onChange={handleChange}
                className="form-input"
                placeholder="Ej: Pérez García"
                required
                disabled={loading}
              />
            </div>
            <div className="form-field">
              <label className="field-label">
                Fecha de Nacimiento <span className="required">*</span>
              </label>
              <input
                type="date"
                name="fechaNacimiento"
                value={formData.fechaNacimiento}
                onChange={handleChange}
                className="form-input"
                required
                disabled={loading}
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-field">
              <label className="field-label">
                Tipo de Documento <span className="required">*</span>
              </label>
              <select
                name="tipoDocumento"
                value={formData.tipoDocumento}
                onChange={handleChange}
                className="form-select"
                required
                disabled={loading}
              >
                <option value="">Seleccione</option>
                <option value="cc">Cédula de Ciudadanía</option>
                <option value="ce">Cédula de Extranjería</option>
                <option value="pasaporte">Pasaporte</option>
              </select>
            </div>
            <div className="form-field">
              <label className="field-label">
                Número de Documento <span className="required">*</span>
              </label>
              <input
                type="text"
                name="numeroDocumento"
                value={formData.numeroDocumento}
                onChange={handleChange}
                className="form-input"
                placeholder="Ej: 123456789"
                required
                disabled={loading}
              />
            </div>
            <div className="form-field">
              <label className="field-label">
                Género <span className="required">*</span>
              </label>
              <select
                name="genero"
                value={formData.genero}
                onChange={handleChange}
                className="form-select"
                required
                disabled={loading}
              >
                <option value="">Seleccione</option>
                <option value="masculino">Masculino</option>
                <option value="femenino">Femenino</option>
                <option value="otro">Otro</option>
              </select>
            </div>
          </div>

          <div className="form-field">
            <label className="field-label">
              Contraseña del Empleado <span className="required">*</span>
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="form-input"
              placeholder="Ingrese una contraseña"
              required
              disabled={loading}
            />
          </div>

        </section>

        {/* Información de Contacto */}
        <section className="form-section">
          <div className="section-header">
            <span className="section-icon">📞</span>
            <h3 className="section-title">Información de Contacto</h3>
          </div>
          <div className="form-row">
            <div className="form-field">
              <label className="field-label">
                Teléfono Principal <span className="required">*</span>
              </label>
              <input
                type="tel"
                name="telefonoPrincipal"
                value={formData.telefonoPrincipal}
                onChange={handleChange}
                className="form-input"
                placeholder="+57 316 234 5678"
                required
                disabled={loading}
              />
            </div>
            <div className="form-field">
              <label className="field-label">
                Correo Electrónico <span className="required">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="form-input"
                placeholder="empleado@ejemplo.com"
                required
                disabled={loading}
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-field full-width">
              <label className="field-label">
                Dirección de Residencia <span className="required">*</span>
              </label>
              <input
                type="text"
                name="direccion"
                value={formData.direccion}
                onChange={handleChange}
                className="form-input"
                placeholder="Ej: Calle 45 # 23-12, Barrio Centro"
                required
                disabled={loading}
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-field">
              <label className="field-label">
                Ciudad <span className="required">*</span>
              </label>
              <input
                type="text"
                name="ciudad"
                value={formData.ciudad}
                onChange={handleChange}
                className="form-input"
                placeholder="Bogotá"
                required
                disabled={loading}
              />
            </div>
          </div>
        </section>

        {/* Información Laboral */}
        <section className="form-section">
          <div className="section-header">
            <span className="section-icon">💼</span>
            <h3 className="section-title">Información Laboral</h3>
          </div>
          <div className="form-row">
            <div className="form-field">
              <label className="field-label">
                Fecha de Ingreso <span className="required">*</span>
              </label>
              <input
                type="date"
                name="fechaIngreso"
                value={formData.fechaIngreso}
                onChange={handleChange}
                className="form-input"
                required
                disabled={loading}
              />
            </div>
            <div className="form-row">
  <div className="form-field">
    <label className="field-label">
      Tipo de Contrato <span className="required">*</span>
    </label>

    <select
      name="tipoContrato"
      value={formData.tipoContrato}
      onChange={handleChange}
      className="form-select"
      required
      disabled={loading}
    >
      <option value="">Seleccione</option>
      <option value="FIJO">Fijo</option>
      <option value="TEMPORAL">Temporal</option>
      <option value="POR_PROYECTO">Por Proyecto</option>
      <option value="INDEFINIDO">Término Indefinido</option>
    </select>
  </div>

  <div className="form-field">
    <label className="field-label">
      Fecha de Retiro
    </label>

    <input
      type="date"
      name="fechaRetiro"
      value={formData.fechaRetiro}
      onChange={handleChange}
      className="form-input"
      disabled={loading || formData.tipoContrato === "INDEFINIDO"}
    />
  </div>
</div>

            <div className="form-field">
              <label className="field-label">
                Turno de Trabajo <span className="required">*</span>
              </label>
              <select
                name="turno"
                value={formData.turno}
                onChange={handleChange}
                className="form-select"
                required
                disabled={loading}
              >
                <option value="">Seleccione</option>
                <option value="manana">Mañana (6am - 2pm)</option>
                <option value="tarde">Tarde (2pm - 10pm)</option>
                <option value="noche">Noche (10pm - 6am)</option>
              </select>
            </div>
          </div>
          <div className="form-row">
            <div className="form-field">
              <label className="field-label">
                Estado del Empleado <span className="required">*</span>
              </label>
              <select
                name="estado"
                value={formData.estado}
                onChange={handleChange}
                className="form-select"
                required
                disabled={loading}
              >
                <option value="Activo">Activo</option>
                <option value="Inactivo">Inactivo</option>
                <option value="Vacaciones">Vacaciones</option>
                <option value="Incapacidad">Incapacidad</option>
              </select>
            </div>
          </div>
        </section>

        {/* Action Buttons */}
        <div className="form-actions">
          <button
            type="button"
            className="btn-secondary"
            onClick={handleCancel}
            disabled={loading}
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="btn-primary"
            disabled={loading}
          >
            {loading ? 'Guardando...' : 'Guardar Empleado'}
          </button>
        </div>
      </form>
      {/* Toast de éxito */}
      {success && (
        <div
          style={{
            position: 'fixed',
            bottom: '30px',
            right: '30px',
            backgroundColor: '#4CAF50',
            color: 'white',
            padding: '16px 24px',
            borderRadius: '10px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
            fontSize: '16px',
            fontWeight: 'bold',
            zIndex: 9999,
            animation: 'fadeIn 0.3s ease-in-out',
          }}
        >
          ✅ Empleado creado exitosamente
        </div>
      )}

    </div>
  );
}