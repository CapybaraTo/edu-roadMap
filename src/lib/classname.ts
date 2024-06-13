/*
 * @Author: capybarato 1023536640@qq.com
 * @Date: 2024-06-13 14:50:10
 * @LastEditors: capybarato 1023536640@qq.com
 * @LastEditTime: 2024-06-13 14:50:20
 * @FilePath: \roadMapPro\src\lib\classname.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
