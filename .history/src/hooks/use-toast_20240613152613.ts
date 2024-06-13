/*
 * @Author: capybarato 1023536640@qq.com
 * @Date: 2024-06-13 15:24:08
 * @LastEditors: capybarato 1023536640@qq.com
 * @LastEditTime: 2024-06-13 15:26:10
 * @FilePath: \roadMapPro\src\hooks\use-toast.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
// 用于管理应用程序中的吐司消息（toast messages）。吐司消息是一种轻量级的通知方式，通常用于向用户显示短暂的信息提示
import { $toastMessage } from '../stores/toast';

export function useToast() {
  function success(message: string) {
    $toastMessage.set({ type: 'success', message });
  }
  function error(message: string) {
    $toastMessage.set({ type: 'error', message });
  }
  function info(message: string) {
    $toastMessage.set({ type: 'info', message });
  }

  function warning(message: string) {
    $toastMessage.set({ type: 'warning', message });
  }

  function loading(message: string) {
    $toastMessage.set({ type: 'loading', message });
  }

  return { success, error, info, warning, loading, $toastMessage };
}
