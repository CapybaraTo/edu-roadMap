/*
 * @Author: capybarato 1023536640@qq.com
 * @Date: 2024-06-13 14:21:34
 * @LastEditors: capybarato 1023536640@qq.com
 * @LastEditTime: 2024-06-13 14:35:37
 * @FilePath: \roadMapPro\src\components\Modal.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
// 这段代码定义了一个名为 Modal 的React组件，用于创建一个模态框（Modal）。
// 模态框是一种常见的用户界面元素，用于显示需要用户注意的信息或表单，通常在页面的中心位置弹出，并且会覆盖页面的其余部分。
import { type ReactNode, useRef } from 'react';
import { useOutsideClick } from '../hooks/use-outside-click';
import { useKeydown } from '../hooks/use-keydown';
import { cn } from '../lib/classname';

type ModalProps = {
  onClose: () => void;    // 当模态框需要关闭时调用
  children: ReactNode;    // 模态框内显示的内容，使用ReactNode类型，可以是任何有效的React元素或元素的组合。
  overlayClassName?: string;    // 可选，用于覆盖模态框遮罩层的类名
  bodyClassName?: string;       // 可选，用于覆盖模态框主体的类名
  wrapperClassName?: string;    // 可选，用于覆盖包裹模态框的容器的类名
};

export function Modal(props: ModalProps) {
  const {
    onClose,
    children,
    bodyClassName,
    wrapperClassName,
    overlayClassName,
  } = props;

  const popupBodyEl = useRef<HTMLDivElement>(null);   // 使用useRef创建对模态框主体元素的引用

  useKeydown('Escape', () => {    // useKeydown钩子监听键盘按下Escape键的事件，当按下时调用onClose函数关闭模态框。
    onClose();
  });

  useOutsideClick(popupBodyEl, () => {   // 使用useOutsideClick钩子监听点击模态框外部区域的事件，当检测到点击时调用onClose函数关闭模态框。
    onClose();
  });

  // JSX组件  
  // 最外层的div作为遮罩层，使用了popup类和一些样式，以及一个透明度为50%的黑色背景。
  // 第二层的div作为包裹模态框的容器，使用了relative类和max-w-md类限制最大宽度。
  // 最内层的div是模态框的主体，使用了popup-body类和一些样式，包括圆角、白色背景和阴影效果。
  return (
    // 使用cn函数动态生成CSS类名，这个函数可能接受多个参数，根据条件返回相应的类名。
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
