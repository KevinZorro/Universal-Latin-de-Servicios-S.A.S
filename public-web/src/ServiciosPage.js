import React, { useState } from 'react';
import './ServiciosPage.css';
import FormularioServicio from './components/FormularioServicio'; // Importar el formulario

// Lista de servicios actualizada y separada
const servicios = [
  {
    id: 'aseo',
    nombre: 'Aseo',
    descripcion: 'Soluciones de limpieza profesional para empresas, oficinas y conjuntos residenciales, con personal calificado.',
    imagen: '/imagenes/aseo.jpeg'
  },
  {
    id: 'porteria',
    nombre: 'Portería',
    descripcion: 'Servicio profesional de control de acceso, monitoreo y gestión de correspondencia para conjuntos y edificios.',
    imagen: '/imagenes/porteria.jpeg'
  },
  {
    id: 'jardineria',
    nombre: 'Jardinería',
    descripcion: 'Mantenimiento y embellecimiento de zonas verdes, jardines y áreas comunes. Creamos espacios agradables.',
    imagen: '/imagenes/jardineria.jpeg'
  },
  {
    id: 'piscinas',
    nombre: 'Mantenimiento de Piscinas',
    descripcion: 'Nos encargamos de la limpieza, tratamiento químico y mantenimiento general de su piscina, asegurando su perfecto estado.',
    imagen: '/imagenes/piscineros.jpeg'
  },
  {
    id: 'recepcionista',
    nombre: 'Recepcionista',
    descripcion: 'Atención profesional al visitante, gestión de llamadas y orientación en oficinas y centros empresariales.',
    imagen: '/logo.png' // Imagen placeholder
  },
  {
    id: 'conserjeria',
    nombre: 'Conserjería',
    descripcion: 'Personal multifuncional para oficios varios, reparaciones menores y atención general en copropiedades y empresas.',
    imagen: '/logo.png' // Imagen placeholder
  },
  {
    id: 'cafeteria',
    nombre: 'Cafetería',
    descripcion: 'Servicio de cafetería para personal de empresas, asegurando una atención amable, oportuna y de calidad.',
    imagen: '/logo.png' // Imagen placeholder
  }
];

function ServiciosPage() {
  // --- Lógica para el Modal ---
  const [servicioSeleccionado, setServicioSeleccionado] = useState(null);

  // Función para abrir el modal
  const handleContratar = (nombreServicio) => {
    setServicioSeleccionado(nombreServicio);
  };

  // Función para cerrar el modal
  const handleCloseModal = () => {
    setServicioSeleccionado(null);
  };
  // --------------------------

  return (
    <div className="servicios-container">
      <div className="servicios-header">
        <h1>Nuestros Servicios</h1>
        <p>
          Ofrecemos un portafolio integral para satisfacer todas las necesidades de su copropiedad o empresa,
          con personal calificado y supervisión 24/7.
        </p>
      </div>

      <div className="servicios-grid">
        {servicios.map((servicio) => (
          <div key={servicio.id} className="servicio-tarjeta">
            <div className="tarjeta-imagen-container">
              <img
                src={servicio.imagen}
                alt={`Servicio de ${servicio.nombre}`}
                className="tarjeta-imagen"
              />
            </div>
            <div className="tarjeta-contenido">
              <h3>{servicio.nombre}</h3>
              <p>{servicio.descripcion}</p>
              {/* Botón que ahora abre el modal */}
              <button
                className="tarjeta-boton"
                onClick={() => handleContratar(servicio.nombre)}
              >
                Contratar Servicio
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* --- Modal del Formulario --- */}
      {/* Se muestra solo si 'servicioSeleccionado' no es null */}
      {servicioSeleccionado && (
        <FormularioServicio
          servicio={servicioSeleccionado}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
}

export default ServiciosPage;

