/*
 * @Author: capybarato 1023536640@qq.com
 * @Date: 2024-10-28 12:12:18
 * @LastEditors: capybarato 1023536640@qq.com
 * @LastEditTime: 2024-10-28 12:12:41
 * @FilePath: \roadMapPro\src\components\TableOfContent\TableOfContent.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { useState, type CSSProperties } from 'react';
import type { HeadingGroupType } from '../../lib/guide';
import { ChevronDown } from 'lucide-react';
import { cn } from '../../lib/classname';

type TableOfContentProps = {
  toc: HeadingGroupType[];
};

export function TableOfContent(props: TableOfContentProps) {
  const { toc } = props;

  const [isOpen, setIsOpen] = useState(false);

  if (toc.length === 0) {
    return null;
  }

  const totalRows = toc.flatMap((heading) => {
    return [heading, ...heading.children];
  }).length;

  return (
    <div
      className={cn(
        'relative min-w-[250px] px-5 pt-0 max-lg:min-w-full max-lg:max-w-full max-lg:border-none max-lg:px-0 lg:pt-10',
        {
          'top-0 lg:!sticky': totalRows <= 20,
        },
      )}
    >
      <h4 className="text-lg font-medium max-lg:hidden">In this article</h4>
      <button
        className="flex w-full items-center justify-between gap-2 bg-gray-300 px-3 py-2 text-sm font-medium lg:hidden"
        onClick={() => setIsOpen(!isOpen)}
      >
        内容图表
        <ChevronDown
          size={16}
          className={cn(
            'transform transition-transform',
            isOpen && 'rotate-180',
          )}
        />
      </button>

      <ol
        className={cn(
          'mt-0.5 max-lg:absolute max-lg:top-full max-lg:mt-0 max-lg:w-full space-y-0 max-lg:bg-white max-lg:shadow',
          !isOpen && 'hidden lg:block',
          isOpen && 'block',
        )}
      >
        {toc.map((heading) => (
          <li key={heading.slug}>
            <a
              href={`#${heading.slug}`}
              className="text-sm text-gray-500 no-underline hover:text-black max-lg:block max-lg:border-b max-lg:px-3 max-lg:py-1"
              onClick={() => {
                if (!isOpen) {
                  return;
                }

                setIsOpen(false);
              }}
            >
              {heading.text}
            </a>

            {heading.children.length > 0 && (
              <ol className="my-0 ml-4 mt-1 max-lg:ml-0 max-lg:mt-0 max-lg:list-none space-y-0">
                {heading.children.map((children) => {
                  return (
                    <li key={children.slug}>
                      <a
                        href={`#${children.slug}`}
                        className="text-sm text-gray-500 no-underline hover:text-black max-lg:block max-lg:border-b max-lg:px-3 max-lg:py-1 max-lg:pl-8"
                        onClick={() => {
                          if (!isOpen) {
                            return;
                          }

                          setIsOpen(false);
                        }}
                      >
                        {children.text}
                      </a>
                    </li>
                  );
                })}
              </ol>
            )}
          </li>
        ))}
      </ol>
    </div>
  );
}
