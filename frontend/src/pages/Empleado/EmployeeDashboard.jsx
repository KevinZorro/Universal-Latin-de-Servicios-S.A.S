import React, { useState, useEffect } from 'react';
import MisAsignaciones from './MisAsignaciones';
import EmpleadoAgenda from './EmpleadoAgenda';
import CargarEvidencia from './CargarEvidencia';
import MiPerfil from './MiPerfil';
import './EmployeeDashboard.css';

// Claves de localStorage
const TOKEN_KEY = 'token';
const ROL_KEY = 'rol';
const NOMBRE_KEY = 'nombre';
const CEDULA_KEY = 'cedula';

export default function EmployeeDashboard() {
    const [activeSection, setActiveSection] = useState('inicio');
    const [userData, setUserData] = useState({ nombre: '', rol: '', cedula: '' });
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem(TOKEN_KEY);
        const rol = localStorage.getItem(ROL_KEY);
        const nombre = localStorage.getItem(NOMBRE_KEY);
        const cedula = localStorage.getItem(CEDULA_KEY);

        if (!token || rol !== 'EMPLEADO') {
            window.location.href = '/login';
            return;
        }

        setUserData({ nombre, rol, cedula });
    }, []);

    const handleLogout = () => {
        localStorage.clear();
        window.location.href = '/login';
    };

    const renderContent = () => {
        switch (activeSection) {
            case 'inicio':
                return <EmployeeHome userName={userData.nombre} onNavigate={setActiveSection} />;
            case 'mis-asignaciones':
                return <MisAsignaciones cedula={userData.cedula} />;
            case 'cargar-evidencia':
                return <CargarEvidencia />;
            case 'mi-agenda':
                return <EmpleadoAgenda empleadoId={userData.cedula} />;
            case 'mi-perfil':
                return <MiPerfil cedula={userData.cedula} />;
            default:
                return <EmployeeHome userName={userData.nombre} onNavigate={setActiveSection} />;
        }
    };

    // Obtener iniciales para el avatar (Ej: "Juan Perez" -> "JP")
    const getInitials = (name) => {
        if (!name) return 'E';
        return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    };

    return (
        <div className="emp-dashboard-container">
            {/* Sidebar */}
            <aside className={`emp-sidebar ${isSidebarOpen ? 'open' : ''}`}>
                <div className="emp-sidebar-header">
                    <div className="emp-logo">
                        <span className="icon">👷</span>
                        <div className="text">
                            <h3>Portal Empleado</h3>
                            <small>Universal Latin</small>
                        </div>
                    </div>
                    <button className="close-menu-btn" onClick={() => setIsSidebarOpen(false)}>✕</button>
                </div>

                <nav className="emp-nav">
                    <button
                        className={`emp-nav-item ${activeSection === 'inicio' ? 'active' : ''}`}
                        onClick={() => { setActiveSection('inicio'); setIsSidebarOpen(false); }}
                    >
                        <span className="nav-icon">🏠</span>
                        <span className="nav-label">Inicio</span>
                    </button>

                    <button
                        className={`emp-nav-item ${activeSection === 'mis-asignaciones' ? 'active' : ''}`}
                        onClick={() => { setActiveSection('mis-asignaciones'); setIsSidebarOpen(false); }}
                    >
                        <span className="nav-icon">📋</span>
                        <span className="nav-label">Mis Asignaciones</span>
                    </button>

                    <button
                        className={`emp-nav-item ${activeSection === 'mi-agenda' ? 'active' : ''}`}
                        onClick={() => { setActiveSection('mi-agenda'); setIsSidebarOpen(false); }}
                    >
                        <span className="nav-icon">📑</span>
                        <span className="nav-label">Mi Agenda</span>
                    </button>

                    <button 
                        className={`emp-nav-item ${activeSection === 'cargar-evidencia' ? 'active' : ''}`}
                        onClick={() => { setActiveSection('cargar-evidencia'); setIsSidebarOpen(false); }}
                    >
                        <span className="nav-icon">📷</span>
                        <span className="nav-label">Cargar Evidencia</span>
                    </button>


                    <button
                        className={`emp-nav-item ${activeSection === 'mi-perfil' ? 'active' : ''}`}
                        onClick={() => { setActiveSection('mi-perfil'); setIsSidebarOpen(false); }}
                    >
                        <span className="nav-icon">👤</span>
                        <span className="nav-label">Mi Perfil</span>
                    </button>
                </nav>

                <div className="emp-logout-container">
                    <button onClick={handleLogout} className="btn-logout">
                        🚪 Cerrar Sesión
                    </button>
                </div>
            </aside>

            {/* Overlay móvil */}
            {isSidebarOpen && <div className="sidebar-overlay" onClick={() => setIsSidebarOpen(false)}></div>}

            {/* Contenido Principal */}
            <div className="emp-main-content">
                <header className="emp-topbar">
                    <button className="menu-toggle" onClick={() => setIsSidebarOpen(true)}>☰</button>

                    {/* Título visible solo en móvil si es necesario */}
                    <div className="page-title-mobile">
                        Universal Latin
                    </div>

                    {/* --- SECCIÓN DE USUARIO MODIFICADA --- */}
                    <div className="user-info">
                        <div className="user-details">
                            <span className="user-name">{userData.nombre || 'Usuario'}</span>
                            <span className="user-role">{userData.rol || 'EMPLEADO'}</span>
                        </div>
                        <div className="user-avatar">
                            {getInitials(userData.nombre)}
                        </div>
                    </div>
                </header>

                <div className="emp-content-area">
                    {renderContent()}
                </div>
            </div>
        </div>
    );
}

function EmployeeHome({ userName, onNavigate }) {
    return (
        <div className="emp-home">
            <div className="welcome-banner">
                <h1>¡Hola, {userName}! 👋</h1>
                <p>Bienvenido a tu portal de trabajo. Revisa tus pendientes.</p>
            </div>

            <div className="emp-actions-grid">
                <div className="emp-action-card primary" onClick={() => onNavigate('mis-asignaciones')}>
                    <div className="card-icon">📋</div>
                    <h3>Ver mis Asignaciones</h3>
                    <p>Consulta las órdenes de servicio asignadas y su estado.</p>
                </div>

                <div className="emp-action-card secondary" onClick={() => onNavigate('cargar-evidencia')}>
                    <div className="card-icon">📷</div>
                    <h3>Cargar Evidencia</h3>
                    <p>Sube fotos y documentos de tus trabajos realizados.</p>
                </div>

                <div className="emp-action-card info" onClick={() => onNavigate('mi-agenda')}>
                    <div className="card-icon">📑</div>
                    <h3>Agenda</h3>
                    <p>consulta tu agenda de asignaciones</p>
                </div>
            </div>
        </div>
    );
}