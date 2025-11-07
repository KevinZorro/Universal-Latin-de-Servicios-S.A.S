import './HomePage.css';
import CarruselServicios from './components/CarruselServicios';
import { Link } from 'react-router-dom';

function HomePage() {
  return (
    <div className="home-container">
      {/* <header> fue movido a App.js </header> */}

      <main className="hero">
        <h1>Soluciones Profesionales en Servicios Generales</h1>
        <p>
          En <strong>Universal Latin de Servicios S.A.S.</strong> brindamos atención continua 24/7 con personal
          altamente calificado, insumos de calidad y supervisión constante. Garantizamos bienestar, limpieza y
          seguridad en cada espacio bajo nuestro cuidado.
        </p>
        <div className="hero-buttons">
          <Link to="/servicios" className="ver-servicios">Ver Servicios</Link>
          {/* --- BOTÓN MODIFICADO --- */}
          <Link to="/contacto" className="contactar">Contactar</Link>
        </div>
      </main>

      {/* 🟦 Carrusel de servicios */}
      <section id="servicios-carrusel">
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
        <Link to="/nosotros" className="ver-mas-btn">Ver más información</Link>
      </section>

      {/* 🟨 Sección Misión y Visión */}
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

      {/* 🟦 Sección "Trabaja con Nosotros" */}
      <section className="trabaja-con-nosotros">
        <h2 className="titulo-seccion">Trabaja con Nosotros</h2>
        <p className="subtitulo-trabaja">Únete a nuestro equipo de profesionales</p>
        
        <div className="columnas-trabaja">
          <div className="columna-izquierda">
            <h4>¿Por qué trabajar con nosotros?</h4>
            <ul className="lista-beneficios">
              <li><span className="check-icon">✓</span> Ambiente laboral positivo</li>
              <li><span className="check-icon">✓</span> Capacitación constante</li>
              <li><span className="check-icon">✓</span> Oportunidades de crecimiento</li>
              <li><span className="check-icon">✓</span> Prestaciones de ley</li>
              <li><span className="check-icon">✓</span> Pagos puntuales</li>
            </ul>
          </div>
          
          <div className="columna-derecha">
            <h4>Posiciones disponibles</h4>
            <ul>
              <li>Jardinería</li>
              <li>Portería / Recepcionista</li>
              <li>Limpieza / Aseo</li>
              <li>Conserjería</li>
              <li>Mantenimiento</li>
              <li>Cafetería</li>
              <li>Mantenimiento de Piscinas</li>
              <li>Oficios Varios</li>
            </ul>
            <button className="aplicar-btn">Aplicar Ahora</button>
          </div>
        </div>
      </section>

      {/* 🟩 Sección "Listo para comenzar" (CTA) */}
      <section className="cta-final">
        <h3>¿Listo para comenzar?</h3>
        <p>
          Solicita una cotización personalizada o contrata directamente uno de nuestros servicios.
          Nuestro equipo está listo para atenderte.
        </p>
        <div className="cta-buttons">
          <Link to="/servicios" className="contratar-btn-cta">
            Contratar un Servicio
          </Link>
          <button className="trabaja-btn-cta">Trabaja con Nosotros</button>
        </div>
      </section>

    </div>
  );
}

export default HomePage;

