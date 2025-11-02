import { Link } from 'react-router-dom';
import './Header.css';

function Header() {
  return (
    <header className="header">
      <div className="logo">
        <img src="/logo.png" alt="Logo Universal Latin" />
        <span>Universal Latin de Servicios S.A.S.</span>
      </div>
      <nav className="nav-links">
        <Link to="/">Inicio</Link>
        <Link to="/nosotros">Quiénes Somos</Link>
        <Link to="/servicios">Servicios</Link>
        <Link to="/contacto">Contáctenos</Link>
        <Link to="/servicios" className="contratar-btn">
          Contratar
        </Link>
      </nav>
    </header>
  );
}

export default Header;

