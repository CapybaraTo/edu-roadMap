/*
 * @Author: capybarato 1023536640@qq.com
 * @Date: 2024-10-04 11:42:49
 * @LastEditors: capybarato 1023536640@qq.com
 * @LastEditTime: 2024-10-04 11:43:03
 * @FilePath: \roadMapPro\src\components\Popup\popup.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
export class Popup {
  constructor() {
    this.triggerPopup = this.triggerPopup.bind(this);
    this.onDOMLoaded = this.onDOMLoaded.bind(this);
    this.handleClosePopup = this.handleClosePopup.bind(this);
    this.handleKeydown = this.handleKeydown.bind(this);
  }

  /**
   * Triggers the popup on target elements
   * @param {Event} e
   */
  triggerPopup(e) {
    const popupToShow =
      e?.target?.closest('[data-popup]')?.dataset?.popup || 'unknown-popup';
    const popupEl = document.querySelector(`#${popupToShow}`);

    if (!popupEl) {
      return;
    }

    e.preventDefault();
    popupEl.classList.remove('hidden');
    popupEl.classList.add('flex');
    const focusEl = popupEl.querySelector('[autofocus]');
    if (focusEl) {
      focusEl.focus();
    }
  }

  handleClosePopup(e) {
    const target = e.target;
    const popupBody = target.closest('.popup-body');
    const closestPopup = target.closest('.popup');
    const closeBtn = target.closest('.popup-close');

    if (!closeBtn && popupBody) {
      return;
    }

    if (closestPopup) {
      closestPopup.classList.add('hidden');
      closestPopup.classList.remove('flex');
    }
  }

  handleKeydown(e) {
    if (e.key !== 'Escape') {
      return;
    }

    const popup = document.querySelector('.popup:not(.hidden)');
    if (popup) {
      popup.classList.add('hidden');
      popup.classList.remove('flex');
    }
  }

  onDOMLoaded() {
    document.addEventListener('click', this.triggerPopup);
    document.addEventListener('click', this.handleClosePopup);
    document.addEventListener('keydown', this.handleKeydown);
  }

  init() {
    window.addEventListener('DOMContentLoaded', this.onDOMLoaded);
  }
}

const popupRef = new Popup();
popupRef.init();
