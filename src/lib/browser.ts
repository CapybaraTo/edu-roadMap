/*
 * @Author: capybarato 1023536640@qq.com
 * @Date: 2024-06-12 09:12:48
 * @LastEditors: capybarato 1023536640@qq.com
 * @LastEditTime: 2024-06-12 09:29:07
 * @FilePath: \roadMapPro\src\lib\browser.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
// 操作网页的URL参数。定义了三个函数，分别用于获取URL参数、删除URL参数和设置URL参数
// 获取URL参数
export function getUrlParams() {
  // if (typeof window === 'undefined') {
  //   return {};   // 检查window对象是否存在，因为window是浏览器环境特有的，如果是在非浏览器环境（如Node.js）中运行，这个函数会返回一个空对象。
  // }

  // 解析url 遍历url中的参数，并将它们存储在一个对象parasmObj中
  const params = new URLSearchParams(window.location.search);
  const paramsObj: Record<string, any> = {};
  for (const [key, value] of params.entries()) {
    paramsObj[key] = value;
  }

  return paramsObj;
}

// 删除URL中的一个指定的查询参数  通过参数传递key
export function deleteUrlParam(key: string) {
  // if (typeof window === 'undefined') {
  //   return;
  // }

  const url = new URL(window.location.href);
  if (!url.searchParams.has(key)) {
    return;
  }

  url.searchParams.delete(key);
  window.history.pushState(null, '', url.toString());   // 更新浏览器历史记录而不刷新页面
}

// 设置或更新URL中的查询参数
export function setUrlParams(params: Record<string, string>) {
  // if (typeof window === 'undefined') {
  //   return;
  // }

  const url = new URL(window.location.href);  // 使用url对象来获取当前页面的URL
  let hasUpdatedUrl = false;

  for (const [key, value] of Object.entries(params)) {
    if (url.searchParams.get(key) === String(value)) {
      continue;   // 遍历每个键值对，如果URL中的现有参数与要设置的值不同，它会先删除旧的参数，然后设置新的参数
    }

    url.searchParams.delete(key);
    url.searchParams.set(key, value);

    hasUpdatedUrl = true;
  }

  if (hasUpdatedUrl) { 
    window.history.pushState(null, '', url.toString());   // 如果在遍历过程中有任何参数被更新，函数将使用window.history.pushState来更新浏览器历史记录而不刷新页面
  }
}
