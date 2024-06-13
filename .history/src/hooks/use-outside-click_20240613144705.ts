/*
 * @Author: capybarato 1023536640@qq.com
 * @Date: 2024-06-13 14:37:04
 * @LastEditors: capybarato 1023536640@qq.com
 * @LastEditTime: 2024-06-13 14:47:04
 * @FilePath: \roadMapPro\src\hooks\use-outside-click.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { useEffect } from 'react';

// 接收两个参数，ref是DOM元素引用，callback是点击该元素执行的回调函数
export function useOutsideClick(ref: any, callback: any) {
  useEffect(() => {   // useEffect 是React的一个钩子，用于处理副作用（side effects），例如添加和清除事件监听器。
    const listener = (event: any) => {    // 定义了一个内部的事件监听器函数 listener
      const isClickedOutside =
        !ref?.current?.contains(event.target) &&
        !document?.getElementById('gtx-trans')?.contains(event.target);
      // isClickedOutside一个布尔值 listener 函数检查传入的事件对象 event 的目标元素（event.target）是否不在 ref 引用的元素内部，并且也不在ID为 'gtx-trans' 的元素内部。如果两者都不满足，说明点击发生在了外部。
      if (isClickedOutside) {
        callback();
      }
    };

    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);

    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [ref]);
}
