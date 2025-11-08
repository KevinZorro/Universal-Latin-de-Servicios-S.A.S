// src/pages/Dashboard.jsx
import React from 'react';
import { useDashboard } from './DashboardLogic';
import { useEmpleados } from '../Gerente/useEmpleados';
import AgregarEmpleado from './CreateEmployee';
import ListarEmpleados from './ListarEmpleados';
import GestionCargos from './GestionCargos';
import GestionServicios from './GestionServicios';
import './Dashboard.css';
import GestionServiciosOrden from './GestionServiciosOrden';
import GestionOrdenes from './GestionOrdenes';
import ClienteManager from './ClienteManager';

export default function Dashboard() {
    const {
        userName,
        userRole,
        activeSection,
        setActiveSection,
        handleLogout,
    } = useDashboard();

    const menuItems = [
        { id: 'dashboard', label: 'Dashboard', icon: '📊' },
        { id: 'empleados', label: 'Empleados', icon: '👥' },
        { id: 'agregar-empleado', label: 'Agregar Empleado', icon: '➕' },
        { id: 'agregar-cargo', label: 'Agregar Cargo' },
        { id: 'gestion-servicios', label: 'Gestionar Servicios', icon: '🏡' },
        { id: 'gestion-ordenes', label: 'Gestionar Ordenes', icon: '📝' },
        { id: 'gestion-clientes', label: 'Gestionar Clientes', icon: '🕐' },
        { id: 'nomina', label: 'Nómina', icon: '💰' },
        { id: 'reportes', label: 'Reportes', icon: '📈' },
        { id: 'configuracion', label: 'Configuración', icon: '⚙️' },
    ];

    // Función para renderizar el contenido según la sección activa
    const renderContent = () => {
        switch (activeSection) {
            case 'dashboard':
                return <DashboardHome userName={userName} userRole={userRole} setActiveSection={setActiveSection} />;
            case 'empleados':
                return <ListarEmpleados />;
            case 'agregar-empleado':
                return <AgregarEmpleado />;
            case 'gestion-servicios':
                return <GestionServicios />;
            case 'agregar-cargo':
                return <GestionCargos />;
            case 'gestion-ordenes':
                return <GestionOrdenes />;
            case 'gestion-clientes':
                return <ClienteManager />;
            case 'nomina':
                return <ComingSoon section="Nómina" />;
            case 'reportes':
                return <ComingSoon section="Reportes" />;
            case 'configuracion':
                return <ComingSoon section="Configuración" />;
            default:
                return <DashboardHome userName={userName} userRole={userRole} setActiveSection={setActiveSection} />;
        }
    };

    return (
        <div className="dashboard-container">
            {/* Sidebar */}
            <aside className="sidebar">
                <div className="sidebar-header">
                    <div className="logo-container">
                        <div className="logo-icon">🌐</div>
                        <div className="logo-text">
                            <span className="logo-title">Universal Latin</span>
                            <span className="logo-subtitle">de Servicios S.A.S</span>
                        </div>
                    </div>
                </div>

                <nav className="sidebar-nav">
                    {menuItems.map((item) => (
                        <button
                            key={item.id}
                            className={`nav-item ${activeSection === item.id ? 'active' : ''}`}
                            onClick={() => setActiveSection(item.id)}
                        >
                            <span className="nav-icon">{item.icon}</span>
                            <span className="nav-label">{item.label}</span>
                        </button>
                    ))}
                </nav>

                {/* Logout button */}
                <div style={{ padding: '20px', marginTop: 'auto' }}>
                    <button
                        onClick={handleLogout}
                        style={{
                            width: '100%',
                            padding: '12px',
                            backgroundColor: '#dc3545',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontSize: '14px',
                            fontWeight: '500',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '8px'
                        }}
                    >
                        <span>🚪</span>
                        Cerrar Sesión
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <div className="main-content">
                {/* Header */}
                <header className="dashboard-header">
                    <div className="header-left">
                        <h2 className="page-title">
                            {menuItems.find((item) => item.id === activeSection)?.label || 'Dashboard'}
                        </h2>
                    </div>
                    <div className="header-right">
                        <div className="user-info">
                            <span className="user-name">{userName}</span>
                            <span className="user-role">{userRole}</span>
                        </div>
                        <div className="user-avatar">
                            {userName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                        </div>
                    </div>
                </header>

                {/* Content Area - Renderiza el componente según la sección */}
                {renderContent()}
            </div>
        </div>
    );
}

// Componente del Dashboard Principal - AHORA CON DATOS REALES
function DashboardHome({ userName, userRole, setActiveSection }) {
    // Usar el hook para obtener estadísticas reales
    const { getEstadisticas, loading } = useEmpleados(true);
    const estadisticas = getEstadisticas();

    return (
        <div className="content-area">
            {/* Dashboard Principal */}
            <div className="welcome-section">
                <h1 className="welcome-title">¡Bienvenido, {userName}!</h1>
            </div>

            {/* Cards de estadísticas CON DATOS REALES */}
            <div className="stats-grid">
                <div
                    className="stat-card"
                    style={{ cursor: 'pointer' }}
                    onClick={() => setActiveSection('empleados')}
                >
                    <div className="stat-icon empleados">👥</div>
                    <div className="stat-info">
                        <h3 className="stat-number">
                            {loading ? '...' : estadisticas.activos}
                        </h3>
                        <p className="stat-label">Empleados Activos</p>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon reportes">📈</div>
                    <div className="stat-info">
                        <h3 className="stat-number">
                            {loading ? '...' : estadisticas.inactivos}
                        </h3>
                        <p className="stat-label">Empleados Inactivos</p>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon solicitudes">📝</div>
                    <div className="stat-info">
                        <h3 className="stat-number">
                            {loading ? '...' : estadisticas.total}
                        </h3>
                        <p className="stat-label">Total de Empleados</p>
                    </div>
                </div>
            </div>

            {/* Acciones rápidas */}
            <div className="quick-actions">
                <h2 className="section-title">Acciones Rápidas</h2>
                <div className="actions-grid">
                    <button className="action-card" onClick={() => setActiveSection('agregar-empleado')}>
                        <span className="action-icon">➕</span>
                        <span className="action-label">Agregar Empleado</span>
                    </button>

                    <button className="action-card" onClick={() => setActiveSection('empleados')}>
                        <span className="action-icon">👥</span>
                        <span className="action-label">Ver Empleados</span>
                    </button>

                    <button className="action-card" onClick={() => setActiveSection('solicitudes')}>
                        <span className="action-icon">📋</span>
                        <span className="action-label">Ver Solicitudes</span>
                    </button>

                    <button className="action-card" onClick={() => setActiveSection('horarios')}>
                        <span className="action-icon">📅</span>
                        <span className="action-label">Gestionar Horarios</span>
                    </button>
                </div>
            </div>
        </div>
    );
}

// Componente temporal para secciones en desarrollo
function ComingSoon({ section }) {
    return (
        <div className="content-area">
            <div className="coming-soon">
                <div className="coming-soon-icon">🚧</div>
                <h2 className="coming-soon-title">Sección en Desarrollo</h2>
                <p className="coming-soon-text">
                    La sección de <strong>{section}</strong> estará disponible próximamente.
                </p>
            </div>
        </div>
    );
}