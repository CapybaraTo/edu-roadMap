/*
 * @Author: capybarato 1023536640@qq.com
 * @Date: 2024-06-13 14:21:34
 * @LastEditors: capybarato 1023536640@qq.com
 * @LastEditTime: 2024-06-13 14:21:44
 * @FilePath: \roadMapPro\src\components\Modal.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { type ReactNode, useRef } from 'react';
import { useOutsideClick } from '../hooks/use-outside-click';
import { useKeydown } from '../hooks/use-keydown';
import { cn } from '../lib/classname';

type ModalProps = {
  onClose: () => void;
  children: ReactNode;
  overlayClassName?: string;
  bodyClassName?: string;
  wrapperClassName?: string;
};

export function Modal(props: ModalProps) {
  const {
    onClose,
    children,
    bodyClassName,
    wrapperClassName,
    overlayClassName,
  } = props;

  const popupBodyEl = useRef<HTMLDivElement>(null);

  useKeydown('Escape', () => {
    onClose();
  });

  useOutsideClick(popupBodyEl, () => {
    onClose();
  });

  return (
    <div
      className={cn(
        'popup fixed left-0 right-0 top-0 z-[99] flex h-full items-center justify-center overflow-y-auto overflow-x-hidden bg-black/50',
        overlayClassName,
      )}
    >
      <div
        className={cn(
          'relative h-full w-full max-w-md p-4 md:h-auto',
          wrapperClassName,
        )}
      >
        <div
          ref={popupBodyEl}
          className={cn(
            'popup-body relative h-full rounded-lg bg-white shadow',
            bodyClassName,
          )}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
