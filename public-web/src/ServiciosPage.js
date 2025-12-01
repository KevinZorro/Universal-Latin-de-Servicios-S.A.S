import React, { useState, useEffect } from 'react';
import './ServiciosPage.css';
import FormularioServicio from './components/FormularioServicio';

// URL base de tu backend
const API_URL = process.env.REACT_APP_API_BASE + "/api/servicios";

// 1. LISTA DE NOMBRES DE ARCHIVOS DE IMAGEN LOCALES (sin la extensión .jpeg)
// ¡VERIFICA QUE ESTOS NOMBRES EXISTAN EN TU CARPETA /public/imagenes!
const IMAGENES_LOCALES = [
    'aseo', 
    'porteria', 
    'jardineria', 
    'piscineros', // Asumiendo que esta es la imagen para 'Mantenimiento de Piscinas'
    // Los demás servicios ('Recepcionista', 'Conserjería', 'Cafetería') usarán el logo.
];

// 2. FUNCIÓN AUXILIAR PARA NORMALIZAR TEXTO (MÁS ROBUSTA)
const normalizeText = (text) => {
    return text
        .toLowerCase()
        .normalize("NFD") // Descompone caracteres acentuados (ó -> ó)
        .replace(/[\u0300-\u036f]/g, "") // Elimina los diacríticos (ó -> o)
        .replace(/\s/g, ''); // Elimina todos los espacios
};


// 3. FUNCIÓN AUXILIAR PARA DETERMINAR LA RUTA DE LA IMAGEN
const getImagePath = (nombreServicio) => {
    
    const nombreNormalizado = normalizeText(nombreServicio);
    let nombreArchivo;

    // Manejo de casos especiales donde el nombre del servicio es largo
    if (nombreNormalizado.includes('mantenimientodepiscinas')) {
        nombreArchivo = 'piscineros'; 
    } else {
        nombreArchivo = nombreNormalizado;
    }
    
    // Comprobar si tenemos un archivo local que coincida con el nombre
    if (IMAGENES_LOCALES.includes(nombreArchivo)) {
        return `/imagenes/${nombreArchivo}.jpeg`; 
    } else {
        // Fallback al logo si no hay imagen específica
        return '/logo.png'; 
    }
};

function ServiciosPage() {
    const [servicios, setServicios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [servicioSeleccionado, setServicioSeleccionado] = useState(null);

    const handleContratar = (servicio) => {
        setServicioSeleccionado(servicio);
    };

    const handleCloseModal = () => {
        setServicioSeleccionado(null);
    };

    useEffect(() => {
        const fetchServicios = async () => {
            try {
                const response = await fetch(API_URL);
                if (!response.ok) {
                    throw new Error(`Error HTTP: ${response.status}`);
                }
                const data = await response.json();
                
                const serviciosActivos = data
                    .filter(s => s.estado === true)
                    .map(s => ({
                        id: s.id, 
                        nombre: s.nombreServicio,
                        descripcion: s.descripcion,
                        // Usa la función mejorada
                        imagen: getImagePath(s.nombreServicio) 
                    }));

                setServicios(serviciosActivos);
            } catch (err) {
                console.error("Error al obtener los servicios:", err);
                setError("No se pudieron cargar los servicios. Intenta de nuevo más tarde.");
            } finally {
                setLoading(false);
            }
        };

        fetchServicios();
    }, []); 

    if (loading) {
        return <div className="servicios-container">Cargando servicios...</div>;
    }

    if (error) {
        return <div className="servicios-container error-message">{error}</div>;
    }

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
                                // Fallback: si la imagen específica falla, carga el logo.png
                                onError={(e) => { e.target.onError = null; e.target.src = '/logo.png'; }}
                            />
                        </div>
                        <div className="tarjeta-contenido">
                            <h3>{servicio.nombre}</h3>
                            <p>{servicio.descripcion}</p>
                            <button
                                className="tarjeta-boton"
                                onClick={() => handleContratar(servicio)}
                            >
                                Contratar Servicio
                            </button>
                        </div>
                    </div>
                ))}
            </div>

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