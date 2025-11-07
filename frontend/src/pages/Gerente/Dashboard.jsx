// src/pages/Dashboard.jsx
import React from 'react';
import { useDashboard } from './DashboardLogic';
import AgregarEmpleado from './CreateEmployee';
import ListarEmpleados from './ListarEmpleados';
import './Dashboard.css';

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
        { id: 'solicitudes', label: 'Solicitudes', icon: '📝' },
        { id: 'horarios', label: 'Horarios', icon: '🕐' },
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
            case 'solicitudes':
                return <ComingSoon section="Solicitudes" />;
            case 'horarios':
                return <ComingSoon section="Horarios" />;
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

// Componente del Dashboard Principal
function DashboardHome({ userName, userRole, setActiveSection }) {
    return (
        <div className="content-area">
            {/* Dashboard Principal */}
            <div className="welcome-section">
                <h1 className="welcome-title">¡Bienvenido, {userName}!</h1>
                <p className="welcome-subtitle">
                    Este es tu panel de control como {userRole}. Aquí podrás gestionar empleados, solicitudes y más.
                </p>
            </div>

            {/* Cards de estadísticas */}
            <div className="stats-grid">
                <div className="stat-card" style={{ cursor: 'pointer' }} onClick={() => setActiveSection('empleados')}>
                    <div className="stat-icon empleados">👥</div>
                    <div className="stat-info">
                        <h3 className="stat-number">24</h3>
                        <p className="stat-label">Empleados Activos</p>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon solicitudes">📝</div>
                    <div className="stat-info">
                        <h3 className="stat-number">8</h3>
                        <p className="stat-label">Solicitudes Pendientes</p>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon horarios">🕐</div>
                    <div className="stat-info">
                        <h3 className="stat-number">12</h3>
                        <p className="stat-label">Turnos Programados</p>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon reportes">📈</div>
                    <div className="stat-info">
                        <h3 className="stat-number">95%</h3>
                        <p className="stat-label">Asistencia del Mes</p>
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

            {/* Actividad reciente */}
            <div className="recent-activity">
                <h2 className="section-title">Actividad Reciente</h2>
                <div className="activity-list">
                    <div className="activity-item">
                        <div className="activity-icon new">📄</div>
                        <div className="activity-content">
                            <p className="activity-title">Nueva solicitud de vacaciones</p>
                            <p className="activity-subtitle">Juan Pérez - Hace 2 horas</p>
                        </div>
                        <span className="activity-badge pending">Pendiente</span>
                    </div>

                    <div className="activity-item">
                        <div className="activity-icon success">✓</div>
                        <div className="activity-content">
                            <p className="activity-title">Empleado registrado exitosamente</p>
                            <p className="activity-subtitle">María González - Hace 5 horas</p>
                        </div>
                        <span className="activity-badge success">Completado</span>
                    </div>

                    <div className="activity-item">
                        <div className="activity-icon info">🕐</div>
                        <div className="activity-content">
                            <p className="activity-title">Turno modificado</p>
                            <p className="activity-subtitle">Carlos Ramírez - Hace 1 día</p>
                        </div>
                        <span className="activity-badge info">Informativo</span>
                    </div>

                    <div className="activity-item">
                        <div className="activity-icon success">✓</div>
                        <div className="activity-content">
                            <p className="activity-title">Nómina procesada</p>
                            <p className="activity-subtitle">Sistema - Hace 2 días</p>
                        </div>
                        <span className="activity-badge success">Completado</span>
                    </div>
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