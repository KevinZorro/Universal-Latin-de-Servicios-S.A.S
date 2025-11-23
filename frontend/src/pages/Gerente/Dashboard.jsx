// src/pages/Dashboard.jsx
import React, { useState } from 'react';
import { useDashboard } from './DashboardLogic';
import { useEmpleados } from '../Gerente/useEmpleados';
import AgregarEmpleado from './CreateEmployee';
import ListarEmpleados from './ListarEmpleados';
import GestionCargos from './GestionCargos';
import GestionServicios from './GestionServicios';
import './Dashboard.css';
import GestionServiciosOrden from './GestionServiciosOrden';
import VistaCandidatos from './VistaCandidatos';
import GestionOrdenes from './GestionOrdenes';
import ClienteManager from './ClienteManager';
import AsignarServicioOrden from './AsignarServicioOrden';
import AsignarEmpleados from './AsignarEmpleados';

export default function Dashboard() {
    const {
        userName,
        userRole,
        activeSection,
        setActiveSection,
        handleLogout,
    } = useDashboard();

    const [expandedMenus, setExpandedMenus] = useState({
        empleados: true,
        servicios: false,
        ordenes: false,
    });

    const toggleMenu = (menuId) => {
        setExpandedMenus(prev => ({
            ...prev,
            [menuId]: !prev[menuId]
        }));
    };

    const menuStructure = [
        { id: 'dashboard', label: 'Dashboard', icon: '📊', type: 'single' },
        {
            id: 'empleados',
            label: 'Empleados',
            icon: '👥',
            type: 'expandable',
            submenu: [
                { id: 'empleados', label: 'Ver Empleados', icon: '👥' },
                { id: 'agregar-empleado', label: 'Agregar Empleado', icon: '➕' },
                { id: 'agregar-cargo', label: 'Gestionar Cargos', icon: '💼' },
                { id: 'candidatos', label: 'Ver Candidatos', icon: '📋' },
            ]
        },
        {
            id: 'servicios',
            label: 'Servicios',
            icon: '🏡',
            type: 'expandable',
            submenu: [
                { id: 'gestion-servicios', label: 'Gestionar Servicios', icon: '🔧' },
            ]
        },
        {
            id: 'ordenes',
            label: 'Órdenes',
            icon: '📝',
            type: 'expandable',
            submenu: [
                { id: 'gestion-ordenes', label: 'Gestionar Órdenes', icon: '📋' },
                { id: 'gestion-ordenes-servicios', label: 'Gestionar Órdenes y Servicios' },
                { id: 'asignar-empleados', label: 'Asignar Empleados' },
            ]
        },
        { id: 'gestion-clientes', label: 'Clientes', icon: '👤', type: 'single' },
        { id: 'configuracion', label: 'Configuración', icon: '⚙️', type: 'single' },
    ];

    const renderContent = () => {
        switch (activeSection) {
            case 'dashboard':
                return <DashboardHome userName={userName} userRole={userRole} setActiveSection={setActiveSection} />;
            case 'empleados':
                return <ListarEmpleados />;
            case 'agregar-empleado':
                return <AgregarEmpleado />;
            case 'candidatos':
                return <VistaCandidatos />;
            case 'gestion-servicios':
                return <GestionServicios />;
            case 'agregar-cargo':
                return <GestionCargos />;
            case 'gestion-ordenes':
                return <GestionOrdenes />;
            case 'gestion-ordenes-servicios':
                return <AsignarServicioOrden />;
            case 'asignar-empleados':
                return <AsignarEmpleados />;
            case 'gestion-clientes':
                return <ClienteManager />;
            case 'configuracion':
                return <ComingSoon section="Configuración" />;
            default:
                return <DashboardHome userName={userName} userRole={userRole} setActiveSection={setActiveSection} />;
        }
    };

    const getCurrentPageTitle = () => {
        for (const item of menuStructure) {
            if (item.type === 'single' && item.id === activeSection) {
                return item.label;
            }
            if (item.type === 'expandable' && item.submenu) {
                const submenuItem = item.submenu.find(sub => sub.id === activeSection);
                if (submenuItem) {
                    return submenuItem.label;
                }
            }
        }
        return 'Dashboard';
    };

    return (
        <div className="dashboard-container">
            <aside className="sidebar">
                <div className="sidebar-header">
                    <div className="logo-container">
                        <img 
                        src="/logo.png" 
                        alt="Logo empresa" 
                        className="logo-image"
                        />
                        <div className="logo-text">
                            <span className="logo-title">Universal Latin</span>
                            <span className="logo-subtitle">de Servicios S.A.S</span>
                        </div>
                    </div>
                </div>

                <nav className="sidebar-nav">
                    {menuStructure.map((item) => (
                        <div key={item.id} className="menu-item-container">
                            {item.type === 'single' ? (
                                <button
                                    className={`nav-item ${activeSection === item.id ? 'active' : ''}`}
                                    onClick={() => setActiveSection(item.id)}
                                >
                                    <span className="nav-icon">{item.icon}</span>
                                    <span className="nav-label">{item.label}</span>
                                </button>
                            ) : (
                                <>
                                    <button
                                        className={`nav-item expandable ${expandedMenus[item.id] ? 'expanded' : ''}`}
                                        onClick={() => toggleMenu(item.id)}
                                    >
                                        <div className="nav-item-content">
                                            <span className="nav-icon">{item.icon}</span>
                                            <span className="nav-label">{item.label}</span>
                                        </div>
                                        <span className="expand-icon">
                                            {expandedMenus[item.id] ? '▼' : '▶'}
                                        </span>
                                    </button>
                                    {expandedMenus[item.id] && (
                                        <div className="submenu">
                                            {item.submenu.map((subItem) => (
                                                <button
                                                    key={subItem.id}
                                                    className={`submenu-item ${activeSection === subItem.id ? 'active' : ''}`}
                                                    onClick={() => setActiveSection(subItem.id)}
                                                >
                                                    <span className="nav-icon">{subItem.icon}</span>
                                                    <span className="nav-label">{subItem.label}</span>
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    ))}
                </nav>

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

            <div className="main-content">
                <header className="dashboard-header">
                    <div className="header-left">
                        <h2 className="page-title">{getCurrentPageTitle()}</h2>
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

                {renderContent()}
            </div>
        </div>
    );
}

function DashboardHome({ userName, userRole, setActiveSection }) {
    const { getEstadisticas, loading } = useEmpleados(true);
    const estadisticas = getEstadisticas();

    return (
        <div className="content-area">
            <div className="welcome-section">
                <h1 className="welcome-title">¡Bienvenido, {userName}!</h1>
            </div>

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

                    <button className="action-card" onClick={() => setActiveSection('gestion-ordenes')}>
                        <span className="action-icon">📋</span>
                        <span className="action-label">Ver Órdenes</span>
                    </button>

                    <button className="action-card" onClick={() => setActiveSection('gestion-clientes')}>
                        <span className="action-icon">👤</span>
                        <span className="action-label">Gestionar Clientes</span>
                    </button>
                </div>
            </div>
        </div>
    );
}

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