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
