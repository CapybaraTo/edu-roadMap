/*
 * @Author: capybarato 1023536640@qq.com
 * @Date: 2024-07-23 16:45:46
 * @LastEditors: capybarato 1023536640@qq.com
 * @LastEditTime: 2024-07-23 16:45:54
 * @FilePath: \roadMapPro\src\lib\dom.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
export function replaceChildren(parentNode: Element, newChild: Element) {
  if (parentNode.replaceChildren) {
    return parentNode.replaceChildren(newChild);
  }

  parentNode.innerHTML = '';
  parentNode.append(newChild);
}
