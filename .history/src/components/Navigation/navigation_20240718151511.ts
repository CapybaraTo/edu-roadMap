/*
 * @Author: capybarato 1023536640@qq.com
 * @Date: 2024-07-18 14:59:17
 * @LastEditors: capybarato 1023536640@qq.com
 * @LastEditTime: 2024-07-18 15:15:11
 * @FilePath: \roadMapPro\src\components\Navigation\navigation
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
// 登出功能：当用户点击登出按钮时，调用 logout 函数，移除认证 Token，并重新加载页面
// 移动导航栏的显示和隐藏：根据点击的元素，显示或隐藏移动导航栏。
// 账户下拉菜单的交互：点击账户按钮时，切换下拉菜单的显示状态；点击其他地方时，隐藏下拉菜单。
// 自定义事件：点击命令菜单时，派发一个自定义事件，可能用于触发其他功能或扩展
import Cookies from 'js-cookie';
import { TOKEN_COOKIE_NAME, removeAuthToken } from '../../lib/jwt';

export function logout() {
  removeAuthToken();  // 移除认证 Token 的 Cookie
  window.location.reload();   //  重新加载页面，这将自动根据当前的认证状态重定向用户。
}

// 为整个文档添加点击事件监听器
function bindEvents() {
  document.addEventListener('click', (e) => {
    const target = e.target as HTMLElement;    // 使用 e.target 获取点击事件的目标元素，并将其断言为 HTMLElement 类型
    const dataset = {
      ...target.dataset,
      ...target.closest('button')?.dataset,
    };

    // 处理点击事件
    // 获取具有 data-account-dropdown 属性的元素  就是下拉菜单
    const accountDropdown = document.querySelector('[data-account-dropdown]');

    // 检查点击的目标元素是否有 logoutButton 数据属性。如果有，调用 logout 函数处理用户登出，并阻止默认事件。
    // 检查点击的目标元素是否有 showMobileNav 数据属性。如果有，显示移动导航栏。
    // 检查点击的目标元素是否有 closeMobileNav 数据属性。如果有，隐藏移动导航栏。
    // 如果点击的不是 data-account-dropdown 元素，并且下拉菜单没有被隐藏，则隐藏下拉菜单。
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

  // 处理账户下拉菜单的显示和隐藏
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

// 模块加载时，自动调用 bindEvents 函数，绑定上述事件处理逻辑
bindEvents();
