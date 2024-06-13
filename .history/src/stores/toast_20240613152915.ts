/*
 * @Author: capybarato 1023536640@qq.com
 * @Date: 2024-06-07 14:54:19
 * @LastEditors: capybarato 1023536640@qq.com
 * @LastEditTime: 2024-06-13 15:27:45
 * @FilePath: \developer-roadmap\src\stores\toast.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { atom } from 'nanostores';
// 定义了与吐司消息（toast message）相关的类型和状态存储
// 为应用程序中的吐司消息提供了一个类型安全且可共享的状态存储解决方案
export type ToastType = 'success' | 'error' | 'info' | 'warning' | 'loading';
// 成功（success）、错误（error）、信息（info）、警告（warning）和加载中（loading）
// 使用 atom 函数创建的状态存储是不可变的，并且可以在整个应用程序中共享和访问
export type ToastMessage = {
  type: ToastType;
  message: string;
};

export const $toastMessage = atom<ToastMessage | undefined>(undefined);
