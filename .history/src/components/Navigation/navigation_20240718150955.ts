/*
 * @Author: capybarato 1023536640@qq.com
 * @Date: 2024-07-18 14:59:17
 * @LastEditors: capybarato 1023536640@qq.com
 * @LastEditTime: 2024-07-18 15:09:55
 * @FilePath: \roadMapPro\src\components\Navigation\navigation
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
// 处理用户登出逻辑和一些界面交互事件
import Cookies from 'js-cookie';
import { TOKEN_COOKIE_NAME, removeAuthToken } from '../../lib/jwt';

export function logout() {
  removeAuthToken();

  // Reloading will automatically redirect the user if required
  window.location.reload();
}

function bindEvents() {
  document.addEventListener('click', (e) => {
    const target = e.target as HTMLElement;
    const dataset = {
      ...target.dataset,
      ...target.closest('button')?.dataset,
    };

    const accountDropdown = document.querySelector('[data-account-dropdown]');

    // If the user clicks on the logout button, remove the token cookie
    if (dataset.logoutButton !== undefined) {
      e.preventDefault();
      logout();
    } else if (dataset.showMobileNav !== undefined) {
      document.querySelector('[data-mobile-nav]')?.classList.remove('hidden');
    } else if (dataset.closeMobileNav !== undefined) {
      document.querySelector('[data-mobile-nav]')?.classList.add('hidden');
    } else if (
      accountDropdown &&
      !target?.closest('[data-account-dropdown]') &&
      !accountDropdown.classList.contains('hidden')
    ) {
      accountDropdown.classList.add('hidden');
    }
  });

  document
    .querySelector('[data-account-button]')
    ?.addEventListener('click', (e) => {
      e.stopPropagation();
      document
        .querySelector('[data-account-dropdown]')
        ?.classList.toggle('hidden');
    });

  document
    .querySelector('[data-command-menu]')
    ?.addEventListener('click', () => {
      window.dispatchEvent(new CustomEvent('command.k'));
    });
}

bindEvents();
