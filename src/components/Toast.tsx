/*
 * @Author: capybarato 1023536640@qq.com
 * @Date: 2024-07-18 15:29:11
 * @LastEditors: capybarato 1023536640@qq.com
 * @LastEditTime: 2024-07-18 15:32:33
 * @FilePath: \roadMapPro\src\components\Toast.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { useStore } from '@nanostores/react';
import { $toastMessage } from '../stores/toast';
import { useEffect } from 'react';
import { CheckIcon } from './ReactIcons/CheckIcon';
import { ErrorIcon } from './ReactIcons/ErrorIcon.tsx';
import { WarningIcon } from './ReactIcons/WarningIcon.tsx';
import { InfoIcon } from './ReactIcons/InfoIcon.tsx';
import { Spinner } from './ReactIcons/Spinner';
import { deleteUrlParam, getUrlParams, setUrlParams } from '../lib/browser';

export interface Props {}

// 团队消息
const messageCodes: Record<string, string> = {
  tl: 'Successfully left the team',
  fs: 'Friend request sent',
  fa: 'Friend request accepted',
};

export function Toaster(props: Props) {
  const toastMessage = useStore($toastMessage);

  const { c } = getUrlParams();
  if (c) {
    deleteUrlParam('c');

    if (messageCodes[c]) {
      $toastMessage.set({ type: 'success', message: messageCodes[c] });
    }
  }

  useEffect(() => {
    if (toastMessage === undefined) {
      return;
    }

    const removeMessage = setTimeout(() => {
      if (toastMessage?.type !== 'loading') {
        $toastMessage.set(undefined);
      }
    }, 2500);

    return () => {
      clearTimeout(removeMessage);
    };
  }, [toastMessage]);

  if (!toastMessage) {
    return null;
  }

  return (
    <div
      onClick={() => {
        $toastMessage.set(undefined);
      }}
      className={`fixed bottom-5 left-1/2 z-[9999] min-w-[375px] max-w-[375px] animate-fade-slide-up sm:min-w-[auto]`}
    >
      <div
        className={`flex -translate-x-1/2 transform cursor-pointer items-center gap-2 rounded-md border border-gray-200 bg-white py-3 pl-4 pr-5 text-black shadow-md hover:bg-gray-50`}
      >
        {toastMessage.type === 'success' && (
          <CheckIcon additionalClasses="h-5 w-5 shrink-0 relative top-[0.5px] text-green-500" />
        )}

        {toastMessage.type === 'error' && (
          <ErrorIcon additionalClasses="h-5 w-5 shrink-0 relative top-[0.5px] text-red-500" />
        )}

        {toastMessage.type === 'warning' && (
          <WarningIcon additionalClasses="h-5 w-5 shrink-0 relative top-[0.5px] text-orange-500" />
        )}

        {toastMessage.type === 'info' && (
          <InfoIcon additionalClasses="h-5 w-5 shrink-0 relative top-[0.5px] text-blue-500" />
        )}

        {toastMessage.type === 'loading' && <Spinner isDualRing={false} />}

        <span className="flex-grow text-base">{toastMessage.message}</span>
      </div>
    </div>
  );
}
