(function () {
  'use strict';

  var API_BASE = '/api/site-auth';
  var TOKEN_KEY = 'site_auth_token';
  var SITIO_KEY = 'site_auth_sitio_id';

  function getToken() { return localStorage.getItem(TOKEN_KEY); }
  function setToken(t) { if (t) localStorage.setItem(TOKEN_KEY, t); else localStorage.removeItem(TOKEN_KEY); }
  function getSitioId() { return localStorage.getItem(SITIO_KEY); }
  function setSitioId(id) { if (id) localStorage.setItem(SITIO_KEY, id); else localStorage.removeItem(SITIO_KEY); }

  function api(path, options) {
    return fetch(API_BASE + path, {
      headers: { 'Content-Type': 'application/json', ...(options.token !== false && getToken() ? { 'Authorization': 'Bearer ' + getToken() } : {}) },
      ...options,
    }).then(function (r) {
      if (!r.ok) return r.json().then(function (e) { throw new Error(e.detail || 'Error'); });
      return r.json();
    });
  }

  function showError(el, msg) {
    var err = el.querySelector('.auth-error');
    if (err) { err.textContent = msg; err.style.display = 'block'; }
  }

  function clearError(el) {
    var err = el.querySelector('.auth-error');
    if (err) { err.textContent = ''; err.style.display = 'none'; }
  }

  function updateUI() {
    var loggedIn = !!getToken();
    document.querySelectorAll('[data-auth-visible]').forEach(function (el) {
      var show = el.getAttribute('data-auth-visible') === 'logged-in';
      el.style.display = (loggedIn === show) ? '' : 'none';
    });
  }

  function handleLogin(form, container) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      clearError(container);
      var data = { correo: form.correo.value, contrasena: form.contrasena.value, id_sitio: parseInt(container.getAttribute('data-sitio-id') || getSitioId() || '0') };
      api('/login', { method: 'POST', body: JSON.stringify(data), token: false }).then(function (res) {
        setToken(res.access_token);
        setSitioId(data.id_sitio);
        updateUI();
        window.location.reload();
      }).catch(function (err) { showError(container, err.message); });
    });
  }

  function handleRegister(form, container) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      clearError(container);
      var data = {
        correo: form.correo.value, contrasena: form.contrasena.value,
        nombre: form.nombre ? form.nombre.value : '', apellido: form.apellido ? form.apellido.value : '',
        id_sitio: parseInt(container.getAttribute('data-sitio-id') || getSitioId() || '0')
      };
      api('/registro', { method: 'POST', body: JSON.stringify(data), token: false }).then(function () {
        var loginForm = document.querySelector('[data-auth="login"]');
        if (loginForm) { loginForm.scrollIntoView({ behavior: 'smooth' }); showError(container, 'Cuenta creada. Ahora inicia sesión.'); }
        else { window.location.reload(); }
      }).catch(function (err) { showError(container, err.message); });
    });
  }

  function handleProfile(container) {
    var token = getToken();
    if (!token) { container.style.display = 'none'; return; }
    api('/me').then(function (user) {
      container.querySelectorAll('[data-perfil]').forEach(function (el) {
        var key = el.getAttribute('data-perfil');
        if (key === 'nombre_completo') el.textContent = user.nombre + ' ' + user.apellido;
        else el.textContent = user[key] || '';
      });
      if (user.miniatura) {
        var img = container.querySelector('[data-perfil="avatar"]');
        if (img) img.src = user.miniatura;
      }
    }).catch(function () { setToken(null); container.style.display = 'none'; });

    var logoutBtn = container.querySelector('[data-auth="logout"]');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', function (e) {
        e.preventDefault();
        api('/logout', { method: 'POST' }).then(function () {
          setToken(null);
          setSitioId(null);
          window.location.reload();
        }).catch(function () { setToken(null); window.location.reload(); });
      });
    }
  }

  function init() {
    document.querySelectorAll('[data-auth]').forEach(function (container) {
      var type = container.getAttribute('data-auth');
      if (type === 'login') handleLogin(container.querySelector('form'), container);
      else if (type === 'registro') handleRegister(container.querySelector('form'), container);
      else if (type === 'perfil') handleProfile(container);
    });
    updateUI();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
