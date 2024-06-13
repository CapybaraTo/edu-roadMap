/*
 * @Author: capybarato 1023536640@qq.com
 * @Date: 2024-06-13 15:20:12
 * @LastEditors: capybarato 1023536640@qq.com
 * @LastEditTime: 2024-06-13 15:22:53
 * @FilePath: \roadMapPro\src\stores\page.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
//  nanostores 库，这是一个用于React应用程序的状态管理库。代码定义了两个原子状态（atom），它们是不可分割的状态单元，可以在整个应用程序中共享和访问
import { atom } from 'nanostores';

// 定义了一个名为 pageProgressMessage 的原子状态，并将其类型指定为 string | undefined。这意味着 pageProgressMessage 可以存储一个字符串或者 undefined（未定义）。初始值被设置为 undefined。
// 这个状态可能用于存储页面进度信息的消息
export const pageProgressMessage = atom<string | undefined>(undefined);
// 赞助商信息
// export const sponsorHidden = atom(false);
