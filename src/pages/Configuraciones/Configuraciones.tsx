import { useState, useEffect } from 'react';
import { HiOutlineUser, HiOutlineGlobe, HiOutlineShieldCheck, HiOutlineBell } from 'react-icons/hi';
import { authService, USER_IMAGE_KEY } from '../../services';
import type { User } from '../../models';
import './Configuraciones.css';

export function Configuraciones() {
  const [activeTab, setActiveTab] = useState('perfil');
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [userImage, setUserImage] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    contrasena_actual: '',
    nueva_contrasena: '',
    confirmar_contrasena: '',
  });

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const userData = await authService.me();
      setUser(userData);
      setFormData(prev => ({
        ...prev,
        nombre: userData.nombre,
        apellido: userData.apellido,
      }));
      setUserImage(localStorage.getItem(USER_IMAGE_KEY));
    } catch (error) {
      console.error('Error loading user:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    
    try {
      const updatedUser = await authService.update({
        nombre: formData.nombre,
        apellido: formData.apellido,
      });
      setUser(updatedUser);
      setMessage('Perfil actualizado correctamente');
    } catch {
      setMessage('Error al actualizar el perfil');
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.nueva_contrasena !== formData.confirmar_contrasena) {
      setMessage('Las contraseñas no coinciden');
      return;
    }

    setSaving(true);
    setMessage('');

    try {
      await authService.update({
        contrasena: formData.nueva_contrasena,
      });
      setMessage('Contraseña actualizada correctamente');
      setFormData(prev => ({
        ...prev,
        contrasena_actual: '',
        nueva_contrasena: '',
        confirmar_contrasena: '',
      }));
    } catch {
      setMessage('Error al actualizar la contraseña');
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      localStorage.setItem(USER_IMAGE_KEY, base64);
      setUserImage(base64);
      setMessage('Imagen actualizada correctamente');
    };
    reader.readAsDataURL(file);
  };

  if (loading) {
    return <div className="page-loading">Cargando...</div>;
  }

  return (
    <div className="config-container">
      <header className="page-header">
        <h1>Configuraciones</h1>
      </header>

      <div className="config-layout">
        <nav className="config-nav">
          <button 
            className={`nav-tab ${activeTab === 'perfil' ? 'active' : ''}`}
            onClick={() => setActiveTab('perfil')}
          >
            <HiOutlineUser className="tab-icon" />
            <span>Perfil</span>
          </button>
          <button 
            className={`nav-tab ${activeTab === 'sitio' ? 'active' : ''}`}
            onClick={() => setActiveTab('sitio')}
          >
            <HiOutlineGlobe className="tab-icon" />
            <span>Sitio</span>
          </button>
          <button 
            className={`nav-tab ${activeTab === 'seguridad' ? 'active' : ''}`}
            onClick={() => setActiveTab('seguridad')}
          >
            <HiOutlineShieldCheck className="tab-icon" />
            <span>Seguridad</span>
          </button>
          <button 
            className={`nav-tab ${activeTab === 'notificaciones' ? 'active' : ''}`}
            onClick={() => setActiveTab('notificaciones')}
          >
            <HiOutlineBell className="tab-icon" />
            <span>Notificaciones</span>
          </button>
        </nav>

        <div className="config-content">
          {activeTab === 'perfil' && (
            <div className="config-section">
              <h2>Información del Perfil</h2>
              
              <div className="profile-header">
                <div className="profile-avatar">
                  {userImage ? (
                    <img src={userImage} alt="Avatar" />
                  ) : (
                    <span>{user?.nombre?.charAt(0).toUpperCase() || 'U'}</span>
                  )}
                </div>
                <label className="avatar-upload">
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleImageUpload}
                  />
                  <span>Cambiar imagen</span>
                </label>
              </div>

              {message && (
                <div className={`message ${message.includes('Error') ? 'error' : 'success'}`}>
                  {message}
                </div>
              )}

              <form className="config-form" onSubmit={handleProfileSubmit}>
                <div className="form-group">
                  <label htmlFor="nombre">Nombre</label>
                  <input 
                    id="nombre"
                    type="text" 
                    value={formData.nombre}
                    onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="apellido">Apellido</label>
                  <input 
                    id="apellido"
                    type="text" 
                    value={formData.apellido}
                    onChange={(e) => setFormData({ ...formData, apellido: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="correo">Correo electrónico</label>
                  <input 
                    id="correo"
                    type="email" 
                    value={user?.correo || ''} 
                    disabled 
                    className="input-disabled"
                  />
                </div>
                <button type="submit" className="btn-primary" disabled={saving}>
                  {saving ? 'Guardando...' : 'Guardar cambios'}
                </button>
              </form>
            </div>
          )}

          {activeTab === 'sitio' && (
            <div className="config-section">
              <h2>Configuración del Sitio</h2>
              <p className="section-info">La configuración del sitio se gestiona desde la sección de Sitios.</p>
            </div>
          )}

          {activeTab === 'seguridad' && (
            <div className="config-section">
              <h2>Seguridad</h2>
              {message && (
                <div className={`message ${message.includes('Error') ? 'error' : 'success'}`}>
                  {message}
                </div>
              )}
              <form className="config-form" onSubmit={handlePasswordSubmit}>
                <div className="form-group">
                  <label htmlFor="nueva-contrasena">Nueva contraseña</label>
                  <input 
                    id="nueva-contrasena"
                    type="password" 
                    value={formData.nueva_contrasena}
                    onChange={(e) => setFormData({ ...formData, nueva_contrasena: e.target.value })}
                    placeholder="Nueva contraseña"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="confirmar-contrasena">Confirmar contraseña</label>
                  <input 
                    id="confirmar-contrasena"
                    type="password" 
                    value={formData.confirmar_contrasena}
                    onChange={(e) => setFormData({ ...formData, confirmar_contrasena: e.target.value })}
                    placeholder="Confirmar contraseña"
                  />
                </div>
                <button type="submit" className="btn-primary" disabled={saving}>
                  {saving ? 'Actualizando...' : 'Actualizar contraseña'}
                </button>
              </form>
            </div>
          )}

          {activeTab === 'notificaciones' && (
            <div className="config-section">
              <h2>Notificaciones</h2>
              <div className="notification-options">
                <label className="checkbox-label">
                  <input type="checkbox" defaultChecked />
                  <span>Notificaciones por email</span>
                </label>
                <label className="checkbox-label">
                  <input type="checkbox" defaultChecked />
                  <span>Alertas de actividad</span>
                </label>
                <label className="checkbox-label">
                  <input type="checkbox" />
                  <span>Newsletter</span>
                </label>
              </div>
              <button className="btn-primary">Guardar preferencias</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}