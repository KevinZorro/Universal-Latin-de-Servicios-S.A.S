import React from 'react';
import './Footer.css';
import { Link } from 'react-router-dom';

// Recibimos onOpenPqrs como prop
function Footer({ onOpenPqrs }) {
  return (
    <footer className="footer">
      <div className="footer-content">
        
        {/* Sección 1: Logo y Descripción */}
        <div className="footer-section about">
          <div className="footer-logo">
            <img src="/logo.png" alt="Logo Universal Latin" />
            <h3>Universal Latin de<br />Servicios S.A.S.</h3>
          </div>
          <p className="footer-description">
            Su aliado estratégico en servicios generales, brindando calidad, confianza y seguridad 24/7.
          </p>
        </div>

        {/* Sección 2: Servicios Rápidos */}
        <div className="footer-section services">
          <h4>Nuestros Servicios</h4>
          <ul>
            <li>Aseo</li>
            <li>Portería</li>
            <li>Jardinería</li>
            <li>Piscinas</li>
            <li>Recepción</li>
            <li>Conserjería</li>
            <li>Cafetería</li>
            <li>Mantenimiento</li>
          </ul>
        </div>

        {/* Sección 3: Contacto */}
        <div className="footer-section contact">
          <h4>Contáctenos</h4>
          <p>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="icon-phone">
              <path d="M6.62 10.79a15.05 15.05 0 006.59 6.59l2.2-2.2a1 1 0 011.11-.27c1.12.44 2.33.68 3.58.68.55 0 1 .45 1 1V20c0 .55-.45 1-1 1C9.39 21 3 14.61 3 4c0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.24 2.46.68 3.58.13.33.07.73-.27 1.11l-2.2 2.2z" />
            </svg>
            313 680 1502 - 310 212 6380
          </p>
          <p>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="icon-mail">
              <path d="M1.5 8.67v8.58a3 3 0 003 3h15a3 3 0 003-3V8.67l-8.928 5.493a3 3 0 01-3.144 0L1.5 8.67z" />
              <path d="M22.5 6.908V6.75a3 3 0 00-3-3h-15a3 3 0 00-3 3v.158l9.714 5.978a1.5 1.5 0 001.572 0L22.5 6.908z" />
            </svg>
            unilatinservisas@gmail.com
          </p>
          <p>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="icon-location">
              <path fillRule="evenodd" d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 00-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 002.682 2.282 16.975 16.975 0 001.145.742zM12 13.5a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
            </svg>
            Cúcuta, Norte de Santander<br />Avenida 3 #16-81, Barrio La Playa, Oficina 101
          </p>
          
          {/* Enlace PQRS actualizado para usar la función */}
          <button onClick={onOpenPqrs} className="pqrs-link-footer">
            Radicar PQRS
          </button>
        </div>

      </div>
      <div className="footer-bottom">
        &copy; {new Date().getFullYear()} Universal Latin de Servicios S.A.S. Todos los derechos reservados.
      </div>
    </footer>
  );
}

export default Footer;