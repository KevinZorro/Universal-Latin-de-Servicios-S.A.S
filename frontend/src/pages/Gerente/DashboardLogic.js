// src/pages/DashboardLogic.js
import { useState, useEffect } from 'react';

const NOMBRE_KEY = 'nombre';
const ROL_KEY = 'rol';
const TOKEN_KEY = 'token';

export const useDashboard = () => {
    const [userName, setUserName] = useState('Ramiro Chilama');
    const [userRole, setUserRole] = useState('Gerente');
    const [activeSection, setActiveSection] = useState('empleados');

    useEffect(() => {
        // Cargar información del usuario desde localStorage
        const nombre = localStorage.getItem(NOMBRE_KEY);
        const rol = localStorage.getItem(ROL_KEY);

        if (nombre) setUserName(nombre);
        if (rol) setUserRole(rol);

        // Verificar si hay token, si no redirigir al login
        const token = localStorage.getItem(TOKEN_KEY);
        if (!token) {
            window.location.href = '/';
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(ROL_KEY);
        localStorage.removeItem(NOMBRE_KEY);
        localStorage.removeItem('cedula');
        window.location.href = '/';
    };

    return {
        userName,
        userRole,
        activeSection,
        setActiveSection,
        handleLogout,
    };
};