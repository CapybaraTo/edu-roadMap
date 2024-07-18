/*
 * @Author: capybarato 1023536640@qq.com
 * @Date: 2024-07-18 15:27:39
 * @LastEditors: capybarato 1023536640@qq.com
 * @LastEditTime: 2024-07-18 15:28:01
 * @FilePath: \roadMapPro\src\components\PageProgress.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { useStore } from '@nanostores/react';
import { pageProgressMessage } from '../stores/page';
import { useEffect, useState } from 'react';
import { Spinner } from './ReactIcons/Spinner';

export interface Props {
  initialMessage: string;
}

export function PageProgress(props: Props) {
  const { initialMessage } = props;
  const [message, setMessage] = useState(initialMessage);

  const $pageProgressMessage = useStore(pageProgressMessage);

  useEffect(() => {
    if ($pageProgressMessage === undefined) {
      return;
    }

    setMessage($pageProgressMessage);
  }, [$pageProgressMessage]);

  if (!message) {
    return null;
  }

  return (
    <div>
      {/* Tailwind based spinner for full page */}
      <div className="fixed left-0 top-0 z-[100] flex h-full w-full items-center justify-center bg-white bg-opacity-75">
        <div className="flex  items-center justify-center rounded-md border bg-white px-4 py-2 ">
          <Spinner
            className="h-4 w-4 sm:h-4 sm:w-4"
            outerFill="#e5e7eb"
            innerFill="#2563eb"
          />
          <h1 className="ml-2">
            {message}
            <span className="animate-pulse">...</span>
          </h1>
        </div>
      </div>
    </div>
  );
}
