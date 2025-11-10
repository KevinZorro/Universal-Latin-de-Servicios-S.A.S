import React from 'react';
import './ContactoPage.css';

// --- Iconos SVG para la información de contacto ---
const PhoneIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
    <path d="M2 3.5A1.5 1.5 0 013.5 2h1.148a1.5 1.5 0 011.465 1.175l.716 3.066a1.5 1.5 0 01-1.652 1.732L4.63 7.69a12.162 12.162 0 007.68 7.68l-.283-1.036a1.5 1.5 0 011.732-1.652l3.066.716A1.5 1.5 0 0118 15.352V16.5A1.5 1.5 0 0116.5 18H16a14 14 0 01-14-14v-.5z" />
  </svg>
);

const EmailIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
    <path d="M3 4a2 2 0 00-2 2v1.161l8.441 4.221a1.25 1.25 0 001.118 0L19 7.161V6a2 2 0 00-2-2H3z" />
    <path d="M19 8.839l-7.77 3.885a2.75 2.75 0 01-2.46 0L1 8.839V14a2 2 0 002 2h14a2 2 0 002-2V8.839z" />
  </svg>
);

const LocationIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M9.69 18.233l-.003-.006C8.69 17.444 4 13.062 4 9a6 6 0 1112 0c0 4.062-4.69 8.444-5.687 9.227l-.003.006a1.5 1.5 0 01-1.62 0zM10 11.25a2.25 2.25 0 100-4.5 2.25 2.25 0 000 4.5z" clipRule="evenodd" />
  </svg>
);

//Recibimos la prop onOpenPqrs
function ContactoPage({ onOpenPqrs }) {
  return (
    <div className="contacto-container">
      <div className="info-empresa-contacto">
        
        <h2 className="titulo-contacto">Contáctenos</h2>
        <p className="subtitulo-contacto">
          Estamos listos para atenderte. Elige tu canal de comunicación preferido.
        </p>
        
        <div className="contacto-info-box">
          
          <div className="info-item">
            <div className="icon-wrapper"><PhoneIcon /></div>
            <div className="info-texto">
              <strong>Teléfonos</strong>
              <span>313 680 1502 - 310 212 6380</span>
            </div>
          </div>
          
          <div className="info-item">
            <div className="icon-wrapper"><EmailIcon /></div>
            <div className="info-texto">
              <strong>Email</strong>
              <span>unilatinservisas@gmail.com</span>
            </div>
          </div>
          
          <div className="info-item">
            <div className="icon-wrapper"><LocationIcon /></div>
            <div className="info-texto">
              <strong>Oficina Principal</strong>
              <span>Cúcuta, Norte de Santander</span>
              <span>Avenida 3 #16-81, Barrio La Playa, Oficina 101</span>
            </div>
          </div>

          {/* --- Sección PQRS --- */}
          <div className="pqrs-seccion">
            <h3>Peticiones, Quejas, Reclamos y Sugerencias</h3>
            <p>Tu opinión es importante para nosotros. Haz clic aquí para gestionar tu solicitud.</p>
            {/* Botón conectado para abrir el modal */}
            <button className="pqrs-btn" onClick={onOpenPqrs}>
              Formulario PQRS
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}

export default ContactoPage;