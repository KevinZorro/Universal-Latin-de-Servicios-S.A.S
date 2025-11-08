// src/pages/Login.jsx
import React from 'react';
import { useLogin } from './LoginLogic';
import './Login.css';

export default function Login() {
  const {
    cedula,
    setCedula,
    password,
    setPassword,
    loading,
    error,
    selectedRole,
    setSelectedRole,
    handleSubmit,
  } = useLogin();

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1 className="login-title">Universal Latin de Servicios S.A.S</h1>
        </div>

        <div className="role-selector">
          <button
            type="button"
            className={`role-button ${selectedRole === 'gerente' ? 'active' : ''}`}
            onClick={() => setSelectedRole('gerente')}
          >
            <div className="role-icon gerente-icon">
              <span className="icon">👑</span>
            </div>
            <span className="role-label">Gerente</span>
            {selectedRole === 'gerente' && <div className="checkmark">✓</div>}
          </button>

          <button
            type="button"
            className={`role-button ${selectedRole === 'empleado' ? 'active' : ''}`}
            onClick={() => setSelectedRole('empleado')}
          >
            <div className="role-icon empleado-icon">
              <span className="icon">👥</span>
            </div>
            <span className="role-label">Empleado</span>
            {selectedRole === 'empleado' && <div className="checkmark">✓</div>}
          </button>
        </div>

        <h2 className="form-title">
          Iniciar sesión como {selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1)}
        </h2>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label className="form-label">Cédula</label>
            <input
              type="text"
              value={cedula}
              onChange={(e) => setCedula(e.target.value)}
              placeholder="Ingresa tu cédula"
              required
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Ingresa tu contraseña"
              required
              className="form-input"
            />
          </div>

          {error && <p className="error-message">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="submit-button"
          >
            {loading ? 'Cargando...' : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  );
}