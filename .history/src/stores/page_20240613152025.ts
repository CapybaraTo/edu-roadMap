/*
 * @Author: capybarato 1023536640@qq.com
 * @Date: 2024-06-13 15:20:12
 * @LastEditors: capybarato 1023536640@qq.com
 * @LastEditTime: 2024-06-13 15:20:22
 * @FilePath: \roadMapPro\src\stores\page.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { atom } from 'nanostores';

export const pageProgressMessage = atom<string | undefined>(undefined);
export const sponsorHidden = atom(false);
