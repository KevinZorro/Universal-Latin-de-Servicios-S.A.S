import './HomePage.css';
import CarruselServicios from './components/CarruselServicios';

function HomePage() {
  return (
    <div className="home-container">
      <header className="header">
        <div className="logo">
          <img src="/logo.png" alt="Logo Universal Latin" />
          <span>Universal Latin de Servicios S.A.S.</span>
        </div>
        <nav className="nav-links">
          <a href="#inicio">Inicio</a>
          <a href="#quienes-somos">Quiénes Somos</a>
          <a href="#servicios">Servicios</a>
          <a href="#contacto">Contáctenos</a>
          <button className="contratar-btn">Contratar</button>
        </nav>
      </header>

      <main className="hero">
        <h1>Soluciones Profesionales en Servicios Generales</h1>
        <p>
          En <strong>Universal Latin de Servicios S.A.S.</strong> brindamos atención continua 24/7 con personal
          altamente calificado, insumos de calidad y supervisión constante. Garantizamos bienestar, limpieza y
          seguridad en cada espacio bajo nuestro cuidado.
        </p>
        <div className="hero-buttons">
          <button className="ver-servicios">Ver Servicios</button>
          <button className="contactar">Contactar</button>
        </div>
      </main>

      {/* 🟦 Carrusel de servicios */}
      <section id="servicios">
        <CarruselServicios />
      </section>

      {/* 🟩 Sección "Quiénes Somos" */}
      <section id="quienes-somos" className="quienes-somos">
        <h2>Quiénes Somos</h2>
        <h3>Universal Latin de Servicios S.A.S.</h3>
        <p>
          Somos una empresa colombiana especializada en la prestación de servicios integrales para hogares,
          empresas y conjuntos residenciales. Con años de experiencia en el mercado, nos hemos consolidado como
          líderes en soluciones de conserjería, mantenimiento, jardinería, aseo, cafetería, recepción, piscineros
          y oficios varios.
        </p>
      </section>
      <section className="mision-vision">
  <div className="tarjeta">
    <h3>Nuestra Misión</h3>
    <p>
      Prestamos servicios generales como conserjería, control de acceso, aseo, cafetería, jardinería, 
      mantenimiento de piscinas, salvavidas y oficios varios, enmarcados en el concepto de seguridad y 
      satisfacción. A través de una administración responsable, honesta y confiable, buscamos superar las 
      expectativas de nuestros clientes convirtiéndonos en su aliado estratégico en servicios con seguridad integral.
    </p>
  </div>

  <div className="tarjeta">
    <h3>Nuestra Visión</h3>
    <p>
      Para el año 2031 ser una empresa reconocida, distinguida y demandante en el sector de los servicios 
      generales e integrales, gracias a nuestra atención oportuna, excelencia y compromiso con el bienestar 
      de nuestros clientes y colaboradores, consolidándonos como socios de valor en servicios con seguridad integral.
    </p>
  </div>
</section>

    </div>
  );
}

export default HomePage;
