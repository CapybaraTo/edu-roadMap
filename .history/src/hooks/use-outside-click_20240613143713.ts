/*
 * @Author: capybarato 1023536640@qq.com
 * @Date: 2024-06-13 14:37:04
 * @LastEditors: capybarato 1023536640@qq.com
 * @LastEditTime: 2024-06-13 14:37:10
 * @FilePath: \roadMapPro\src\hooks\use-outside-click.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { useEffect } from 'react';

export function useOutsideClick(ref: any, callback: any) {
  useEffect(() => {
    const listener = (event: any) => {
      const isClickedOutside =
        !ref?.current?.contains(event.target) &&
        !document?.getElementById('gtx-trans')?.contains(event.target);
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
