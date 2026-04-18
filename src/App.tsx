import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { Login } from './components/Login/Login';
import { Register } from './components/Register/Register';
import { Sidebar } from './components/Sidebar/Sidebar';
import { Inicio } from './pages/Inicio/Inicio';
import { Sitios } from './pages/Sitios/Sitios';
import { Plantillas } from './pages/Plantillas/Plantillas';
import { Modulos } from './pages/Modulos/Modulos';
import { Configuraciones } from './pages/Configuraciones/Configuraciones';
import { authService } from './services';
import type { User } from './models';
import './App.css';

function App() {
  const token = localStorage.getItem('token');
  const [isChecking, setIsChecking] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    if (token) {
      authService.me()
        .then(() => setIsAuthenticated(true))
        .catch(() => {
          authService.logout();
          setIsAuthenticated(false);
        })
        .finally(() => setIsChecking(false));
    } else {
      setTimeout(() => setIsChecking(false), 0);
    }
  }, [token]);

  if (isChecking) {
    return <div className="loading">Cargando...</div>;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={
          isAuthenticated ? <Navigate to="/inicio" replace /> : <AuthLayout />
        } />
        <Route element={<AuthenticatedLayout />}>
          <Route path="/inicio" element={<Inicio />} />
          <Route path="/sitios" element={<Sitios />} />
          <Route path="/plantillas" element={<Plantillas />} />
          <Route path="/modulos" element={<Modulos />} />
          <Route path="/configuraciones" element={<Configuraciones />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

function AuthenticatedLayout() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    authService.me()
      .then(setUser)
      .catch(() => {
        authService.logout();
        window.location.href = '/';
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="loading">Cargando...</div>;
  }

  return (
    <div className="app-layout">
      <Sidebar user={user} />
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}

function AuthLayout() {
  const [showRegister, setShowRegister] = useState(false);

  const handleAuthSuccess = () => {
    window.location.href = '/inicio';
  };

  return (
    <div className="auth-container">
      <div className="auth-forms">
        <div className="forms-wrapper">
          {showRegister ? (
            <Register 
              onSwitchToLogin={() => setShowRegister(false)} 
              onSuccess={() => setShowRegister(false)}
            />
          ) : (
            <Login onSuccess={handleAuthSuccess} />
          )}
          
          {!showRegister && (
            <p className="switch-text">
              ¿No tienes cuenta?{' '}
              <button 
                className="switch-btn" 
                onClick={() => setShowRegister(true)}
              >
                Regístrate
              </button>
            </p>
          )}
        </div>
      </div>
      
      <div className="auth-brand">
        <div className="brand-content">
          <h1>All in One</h1>
          <p>Tu plataforma integral de gestión</p>
        </div>
      </div>
    </div>
  );
}

export default App;