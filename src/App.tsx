import { useState, useEffect } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Outlet,
  useLocation,
} from "react-router-dom";

import { Login } from "./components/Login/Login";
import { Register } from "./components/Register/Register";
import { Sidebar } from "./components/Sidebar/Sidebar";
import { ProtectedRoute } from "./components/ProtectedRoute/ProtectedRoute";
import { PermisosProvider } from "./context/PermisosContext";
import { SiteProvider } from "./context/SiteContext";

import { Inicio } from "./pages/Inicio/Inicio";
import { Sitios } from "./pages/Sitios/Sitios";
import { Plantillas } from "./pages/Plantillas/Plantillas";
import { Modulos } from "./pages/Modulos/Modulos";
import { Configuraciones } from "./pages/Configuraciones/Configuraciones";
import { WebEditor } from "./pages/WebEditor/WebEditor";
import Blog from "./pages/Blog/Blog";
import Tienda from "./pages/Tienda/Tienda";
import RolesPage from "./pages/Roles/RolesPage";

import { authService } from "./services";
import type { User } from "./models";
import "./App.css";
import Analitica from "./pages/Analitica/Analitica";

function App() {
  const token = localStorage.getItem("token");
  const [isChecking, setIsChecking] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    if (token) {
      authService
        .me()
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
        <Route
          path="/"
          element={
            isAuthenticated ? <Navigate to="/inicio" replace /> : <AuthLayout />
          }
        />

        <Route element={<AuthenticatedLayout />}>
          <Route
            path="/inicio"
            element={
              <ProtectedRoute permiso="inicio.ver">
                <Inicio />
              </ProtectedRoute>
            }
          />

          <Route
            path="/sitios"
            element={
              <ProtectedRoute permiso="sitios.ver">
                <Sitios />
              </ProtectedRoute>
            }
          />

          <Route
            path="/plantillas"
            element={
              <ProtectedRoute permiso="plantillas.ver">
                <Plantillas />
              </ProtectedRoute>
            }
          />

          <Route
            path="/modulos"
            element={
              <ProtectedRoute permiso="modulos.ver">
                <Modulos />
              </ProtectedRoute>
            }
          />

          <Route
            path="/configuraciones"
            element={
              <ProtectedRoute permiso="configuraciones.ver">
                <Configuraciones />
              </ProtectedRoute>
            }
          />

          <Route
            path="/blog"
            element={
              <ProtectedRoute permiso="blog.ver">
                <Blog />
              </ProtectedRoute>
            }
          />

          <Route
            path="/tienda"
            element={
              <ProtectedRoute permiso="tienda.ver">
                <Tienda />
              </ProtectedRoute>
            }
          />

          <Route
            path="/analitica"
            element={
              <ProtectedRoute permiso="analitica.ver">
                <Analitica />
              </ProtectedRoute>
            }
          />

          <Route
            path="/roles"
            element={
              <ProtectedRoute permiso="roles.ver">
                <RolesPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/sitio/:id/editar"
            element={
              <ProtectedRoute permiso="sitios.editar">
                <WebEditor />
              </ProtectedRoute>
            }
          />

          <Route
            path="/plantillas/:id/editar"
            element={
              <ProtectedRoute permiso="plantillas.editar">
                <WebEditor />
              </ProtectedRoute>
            }
          />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

function AuthenticatedLayout() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const isEditor = location.pathname.startsWith("/sitio/") || location.pathname.startsWith("/plantillas/");

  useEffect(() => {
    authService
      .me()
      .then(setUser)
      .catch(() => {
        authService.logout();
        globalThis.location.href = "/";
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="loading">Cargando...</div>;
  }

  return (
    <PermisosProvider>
      <SiteProvider>
        <div className="app-layout">
          {!isEditor && <Sidebar user={user} />}
          <main className={isEditor ? "" : "main-content"}>
            <Outlet />
          </main>
        </div>
      </SiteProvider>
    </PermisosProvider>
  );
}

function AuthLayout() {
  const [showRegister, setShowRegister] = useState(false);

  const handleAuthSuccess = () => {
    globalThis.location.href = "/inicio";
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
              ¿No tienes cuenta?{" "}
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