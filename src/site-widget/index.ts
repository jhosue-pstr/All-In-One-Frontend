import { handleLogin, handleRegister, handleLogout } from './auth';
import { loadProfile } from './perfil';
import { initBlogBlocks } from "./blog";
import { initTiendaBlocks } from "./tienda";

(
  () => {
    function init(): void {
      const loginForms = document.querySelectorAll<HTMLFormElement>('[data-auth="login"] form');
      loginForms.forEach(handleLogin);

      const registerForms = document.querySelectorAll<HTMLFormElement>('[data-auth="registro"] form');
      registerForms.forEach(handleRegister);

      const logoutBtns = document.querySelectorAll<HTMLElement>('[data-auth="logout"]');
      logoutBtns.forEach(handleLogout);

      const perfilBlocks = document.querySelectorAll<HTMLElement>('[data-auth="perfil"]');
      perfilBlocks.forEach((block) => {
        try {
          const token = localStorage.getItem('site_token');
          if (token) {
            block.style.display = '';
            loadProfile(block);
          } else {
            block.style.display = 'none';
          }
        } catch {
          block.style.display = 'none';
        }
      });

      const loginBlocks = document.querySelectorAll<HTMLElement>('[data-auth="login"]');
      loginBlocks.forEach((block) => {
        try {
          const token = localStorage.getItem('site_token');
          if (token) {
            block.style.display = 'none';
          }
        } catch {
          // localStorage no disponible
        }
      });

      // Inicializar bloques dinámicos del Blog y Tienda
      initBlogBlocks();
      initTiendaBlocks();
    }

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', init);
    } else {
      init();
    }
  }
)();