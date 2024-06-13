/*
 * @Author: capybarato 1023536640@qq.com
 * @Date: 2024-06-13 14:40:46
 * @LastEditors: capybarato 1023536640@qq.com
 * @LastEditTime: 2024-06-13 14:40:55
 * @FilePath: \roadMapPro\src\hooks\use-keydown.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { useEffect } from 'react';

export function useKeydown(keyName: string, callback: any, deps: any[] = []) {
  useEffect(() => {
    const listener = (event: any) => {
      if (
        !keyName.startsWith('mod_') &&
        event.key.toLowerCase() === keyName.toLowerCase()
      ) {
        callback();
      } else if (
        keyName.startsWith('mod_') &&
        event.metaKey &&
        event.key.toLowerCase() === keyName.replace('mod_', '').toLowerCase()
      ) {
        event.preventDefault();
        callback();
      }
    };

    window.addEventListener('keydown', listener);
    return () => {
      window.removeEventListener('keydown', listener);
    };
  }, deps);
}
