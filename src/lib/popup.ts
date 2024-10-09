/*
 * @Author: capybarato 1023536640@qq.com
 * @Date: 2024-06-13 17:01:50
 * @LastEditors: capybarato 1023536640@qq.com
 * @LastEditTime: 2024-06-13 17:02:00
 * @FilePath: \roadMapPro\src\lib\popup.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */

// 显示登录弹窗
export function showLoginPopup() {
  const popupEl = document.querySelector(`#login-popup`);
  if (!popupEl) {
    return;
  }

  popupEl.classList.remove('hidden');
  popupEl.classList.add('flex');

  const focusEl = popupEl.querySelector<HTMLElement>('[autofocus]');
  if (focusEl) {
    focusEl.focus();
  }
}
