import './FormularioServicio.css';
import { useState } from 'react';

const API_BASE_URL = 'http://localhost:8080/api'; 

function FormularioServicio({ servicio, onClose }) {
    // --- NUEVO ESTADO PARA CONTROLAR LA VISTA ---
    const [isSubmitted, setIsSubmitted] = useState(false);
    
    // --- ESTADOS DE DATOS ---
    const [nit, setNit] = useState('');
    const [nombre, setNombre] = useState('');
    const [email, setEmail] = useState('');
    const [telefono, setTelefono] = useState('');
    const [direccion, setDireccion] = useState('');
    const [ciudad, setCiudad] = useState('');
    
    // --- ESTADOS DE VALIDACIÓN Y CONTROL ---
    const [errorEmail, setErrorEmail] = useState('');
    const [errorTelefono, setErrorTelefono] = useState('');
    const [loading, setLoading] = useState(false);
    // [fetchSuccess] ya no es necesario para el mensaje, solo para la lógica de envío
    const [fetchError, setFetchError] = useState(null); 

    // --- HANDLERS SIMPLES (se mantienen) ---
    const handleNombreChange = (e) => setNombre(e.target.value);
    const handleNitChange = (e) => setNit(e.target.value);
    const handleDireccionChange = (e) => setDireccion(e.target.value);
    const handleCiudadChange = (e) => setCiudad(e.target.value);

    // --- FUNCIONES DE VALIDACIÓN (se mantienen) ---
    const validarTelefono = (e) => {
        const valor = e.target.value;
        setTelefono(valor);
        const soloNumeros = /^[0-9+\s-]*$/;
        if (!soloNumeros.test(valor)) {
            setErrorTelefono('El número de teléfono solo debe contener números, espacios, "+" o guiones.');
        } else {
            setErrorTelefono('');
        }
    };

    const validarEmail = (e) => {
        const valor = e.target.value;
        setEmail(valor);
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
        
        if (!valor) {
            setErrorEmail('El correo electrónico es obligatorio.');
        } else if (emailRegex.test(valor)) {
            setErrorEmail('');
        } else {
            setErrorEmail('Por favor, introduce un correo válido.');
        }
    };
    
    // --- LÓGICA PRINCIPAL DE ENVÍO ---
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // 1. Validaciones
        const camposRequeridosLlenos = !!nit && !!nombre && !!email && !!telefono && !!direccion && !!ciudad;
        const hayErrores = !!errorTelefono || !!errorEmail || !camposRequeridosLlenos || loading;

        if (hayErrores) {
            setFetchError("Por favor, corrige los errores del formulario antes de enviar.");
            return;
        }
        
        setLoading(true);
        setFetchError(null);

        try {
            // --- PASO 1: Crear Cliente ---
            const clienteData = { nombre, telefono, direccion, nit: parseInt(nit), email, ciudad };
            const clienteResponse = await fetch(`${API_BASE_URL}/clientes`, {
                method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(clienteData)
            });

            if (!clienteResponse.ok) throw new Error(`Error al crear el cliente: ${clienteResponse.statusText}`);
            const clienteCreado = await clienteResponse.json();
            const clienteId = clienteCreado.id;
            
            // --- PASO 2: Crear Orden ---
            const today = new Date().toISOString(); 
            const ordenData = { clienteId: clienteId, fechaCreacion: today, fechaFin: today, estadoOrden: false };
            
            const ordenResponse = await fetch(`${API_BASE_URL}/ordenes`, {
                method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(ordenData)
            });

            if (!ordenResponse.ok) throw new Error(`Error al crear la orden: ${ordenResponse.statusText}`);
            const ordenCreada = await ordenResponse.json();
            const ordenId = ordenCreada.idOrden;
            
            // --- PASO 3: Crear OrdenServicio ---
            const ordenServicioData = { servicioId: servicio.id, ordenId: ordenId, estado: "PENDIENTE" };

            const osResponse = await fetch(`${API_BASE_URL}/ordenes-servicio`, {
                method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(ordenServicioData)
            });

            if (!osResponse.ok) throw new Error(`Error al crear la Orden-Servicio: ${osResponse.statusText}`);

            // --- ÉXITO FINAL: CAMBIAR LA VISTA ---
            setIsSubmitted(true);
            
            // Cierra el modal después de 3 segundos
            setTimeout(onClose, 3000); 

        } catch (error) {
            console.error('Error en el proceso de contratación:', error);
            setFetchError(`❌ Error al procesar la solicitud. Intente nuevamente. Detalles: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };
    
    // --- COMPROBACIÓN DE ERRORES Y CAMPOS REQUERIDOS ---
    const camposRequeridosLlenos = !!nit && !!nombre && !!email && !!telefono && !!direccion && !!ciudad;
    const hayErrores = !!errorTelefono || !!errorEmail || !camposRequeridosLlenos || loading;
    
    // --- RENDERIZADO CONDICIONAL ---
    const renderContent = () => {
        if (isSubmitted) {
            return (
                <div className="success-message-panel">
                    <h2>🎉 ¡Solicitud Enviada con Éxito!</h2>
                    <p>Hemos registrado su solicitud de servicio.</p>
                    <p className="small-detail">Gracias por elegir a UFPS Universal Latin De Servicios S.A.S.</p>
                    <button onClick={onClose} className="success-close-button">Cerrar</button>
                </div>
            );
        }

        // Si no se ha enviado, muestra el formulario
        return (
            <>
                <h2>Contratar Servicio de **{servicio.nombre || servicio}**</h2> 
                <p className="descripcion">Complete el formulario y nos pondremos en contacto con usted</p>
                <form onSubmit={handleSubmit}>
                    
                    {/* --- DATOS DEL CLIENTE --- */}
                    <h3>Datos del Cliente</h3>
                    
                    <label>NIT / Cédula *</label>
                    <input type="number" value={nit} onChange={handleNitChange} placeholder="Identificación única del cliente/empresa" required />
                    <label>Nombre completo *</label>
                    <input type="text" value={nombre} onChange={handleNombreChange} required placeholder="Nombre o Razón Social"/>
                    <label>Correo electrónico *</label>
                    <input type="email" value={email} onChange={validarEmail} onBlur={validarEmail} required/>
                    {errorEmail && <span className="error">{errorEmail}</span>}
                    <label>Teléfono *</label>
                    <input type="tel" value={telefono} onChange={validarTelefono} onBlur={validarTelefono} required/>
                    {errorTelefono && <span className="error">{errorTelefono}</span>}
                    <label>Dirección *</label>
                    <input type="text" value={direccion} onChange={handleDireccionChange} required placeholder="Dirección completa"/>
                    <label>Ciudad *</label>
                    <input type="text" value={ciudad} onChange={handleCiudadChange} required placeholder="Ciudad"/>
                    
                    {/* Mensajes de estado */}
                    {fetchError && <span className="error-message">{fetchError}</span>} 

                    <div className="botones">
                        <button type="button" onClick={onClose} disabled={loading}>Cancelar</button>
                        <button type="submit" disabled={hayErrores}>
                            {loading ? 'Enviando Solicitud...' : 'Enviar Solicitud'}
                        </button>
                    </div>
                </form>
            </>
        );
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                {renderContent()}
            </div>
        </div>
    );
}

export default FormularioServicio;