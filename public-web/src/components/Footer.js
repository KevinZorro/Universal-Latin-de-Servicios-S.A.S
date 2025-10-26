import './Footer.css';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        {/* Columna izquierda */}
        <div className="footer-section about">
          <div className="footer-logo">
            <img src="/logo.png" alt="Logo Universal Latin" />
            <div>
              <h3>Universal Latin</h3>
              <p>de Servicios S.A.S.</p>
            </div>
          </div>
          <p className="footer-description">
            Brindamos servicios profesionales de alta calidad para hogares, empresas y conjuntos residenciales.
          </p>
          <a href="#pqrs" className="pqrs-link">
            PQRS - Peticiones, Quejas, Reclamos y Sugerencias
          </a>
        </div>

        {/* Columna central */}
        <div className="footer-section services">
          <h4>Nuestros Servicios</h4>
          <ul>
            <li>Jardinería</li>
            <li>Celaduría</li>
            <li>Limpieza</li>
            <li>Conserjería</li>
            <li>Mantenimiento</li>
            <li>Cafetería</li>
            <li>Recepción</li>
            <li>Piscineros</li>
            <li>Oficios Varios</li>
          </ul>
        </div>

        {/* Columna derecha */}
        <div className="footer-section contact">
          <h4>Contacto</h4>
          <p>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.88 19.88 0 0 1-8.63-3.07A19.5 19.5 0 0 1 3.05 9.81 19.88 19.88 0 0 1 0 1.18 2 2 0 0 1 2 0h3a2 2 0 0 1 2 1.72c.12.83.3 1.65.54 2.44a2 2 0 0 1-.45 2.11L5.1 7.91a16 16 0 0 0 6 6l1.64-1a2 2 0 0 1 2.11-.45c.79.24 1.61.42 2.44.54A2 2 0 0 1 20 14.92z" />
            </svg>
            313 680 1502 - 310 212 6380
          </p>
          <p>
  <svg className="icon-mail" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" aria-hidden="true">
    <path d="M4 8.5l7.5 5L19 8.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M4 7.2h16v9.6H4z" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
  unilatinservisas@gmail.com
</p>
          <p>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5A2.5 2.5 0 1 1 12 6a2.5 2.5 0 0 1 0 5.5z" />
            </svg>
            Cúcuta, Norte de Santander<br />
            Avenida 3 #16-81, Barrio La Playa, Oficina 101
          </p>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© 2025 Universal Latin de Servicios S.A.S. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
}

export default Footer;
