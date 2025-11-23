import { useState } from 'react';

const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:8080';
const TOKEN_KEY = 'token';
const ROL_KEY = 'rol';
const NOMBRE_KEY = 'nombre';
const CEDULA_KEY = 'cedula';

export const useLogin = () => {
    const [cedula, setCedula] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [selectedRole, setSelectedRole] = useState('gerente');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const res = await fetch(`${API_BASE}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ cedula, password }),
            });

            const bodyText = await res.text();
            let body = null;
            try {
                body = bodyText ? JSON.parse(bodyText) : null;
            } catch (parseErr) {
                body = { message: bodyText };
            }

            if (!res.ok) {
                const msg = body?.error || body?.message || `Error ${res.status}`;
                throw new Error(msg);
            }

            const token = body?.token || (typeof body === 'string' ? body : null);
            if (!token) {
                throw new Error('Respuesta inválida del servidor: no se recibió token');
            }

            // --- VALIDACIÓN DE ROL SELECCIONADO ---
            const rolRealDelUsuario = body?.rol; // Ej: 'EMPLEADO' (Viene del Backend)
            const rolSeleccionadoEnUI = selectedRole.toUpperCase(); // Ej: 'GERENTE' (Viene del Botón)

            // Si el usuario seleccionó un rol diferente al que tiene asignado, bloqueamos el acceso
            if (rolRealDelUsuario !== rolSeleccionadoEnUI) {
                throw new Error(`Credenciales correctas`);
            }
            // --------------------------------------

            // Guardamos los datos (Solo si pasó la validación de rol)
            localStorage.setItem(TOKEN_KEY, token);
            if (body?.rol) localStorage.setItem(ROL_KEY, body.rol);
            if (body?.nombre) localStorage.setItem(NOMBRE_KEY, body.nombre);
            localStorage.setItem(CEDULA_KEY, cedula);

            console.log('✅ Login exitoso y rol verificado');
            
            // Redirección
            if (rolRealDelUsuario === 'EMPLEADO') {
                window.location.href = '/employee-dashboard';
            } else {
                window.location.href = '/dashboard';
            }

        } catch (err) {
            console.error('❌ Error en el login:', err);
            // Si el error es nuestro mensaje personalizado, lo mostramos tal cual
            setError(err.message || 'Error inesperado al iniciar sesión');
            
            // Opcional: Limpiar el localStorage si falló la validación de rol para evitar estados inconsistentes
            if (err.message.includes('permisos')) {
                localStorage.clear();
            }
        } finally {
            setLoading(false);
        }
    };

    return {
        cedula,
        setCedula,
        password,
        setPassword,
        loading,
        error,
        selectedRole,
        setSelectedRole,
        handleSubmit,
    };
};