
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import './CarruselServicios.css';

const servicios = [
  {
    nombre: 'Servicio de Aseo',
    descripcion: 'Ofrecemos soluciones de limpieza profesional para todo tipo de espacios residenciales, empresariales y comerciales.',
    imagen: '/imagenes/aseo.jpeg'
  },
  {
    nombre: 'Servicio de Portería y recepcionista',
    descripcion: 'Control y gestión de acceso en edificios, conjuntos y empresas.',
    imagen: '/imagenes/porteria.jpeg'
  },
  {
    nombre: 'Servicio de Jardinería',
    descripcion: 'Cuidado y embellecimiento de jardines, parques y zonas verdes.',
    imagen: '/imagenes/jardineria.jpeg'
  },
  {
    nombre: 'Servicio de Piscineros',
    descripcion: 'Mantenimiento y limpieza de piscinas, control del pH y productos químicos.',
    imagen: '/imagenes/piscineros.jpeg'
  }
];

const responsive = {
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 1
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 1
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 1
  }
};

function CarruselServicios() {
  return (
    <div className="carrusel-container">
      <Carousel
        responsive={responsive}
        autoPlay
        autoPlaySpeed={3000}
        infinite
        arrows
        showDots
      >
        {servicios.map((servicio, index) => (
          <div key={index} className="slide">
            <img src={servicio.imagen} alt={servicio.nombre} />
            <div className="overlay">
              <h2>{servicio.nombre}</h2>
              <p>{servicio.descripcion}</p>
            </div>
          </div>
        ))}
      </Carousel>
    </div>
  );
}

export default CarruselServicios;
