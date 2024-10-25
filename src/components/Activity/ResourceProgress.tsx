/*
 * @Author: capybarato 1023536640@qq.com
 * @Date: 2024-10-15 09:26:47
 * @LastEditors: capybarato 1023536640@qq.com
 * @LastEditTime: 2024-10-15 09:39:00
 * @FilePath: \roadMapPro\src\components\Activity\ResourceProgress.tsx
 * @Description: 个人路线图列表，及进度条
 */
import { getUser } from '../../lib/jwt';
import { getPercentage } from '../../helper/number';
import { ResourceProgressActions } from './ResourceProgressActions.tsx';   // 路线图操作：进度清空
import { cn } from '../../lib/classname';

type ResourceProgressType = {
  resourceType: 'roadmap' | 'best-practice';
  resourceId: string;
  title: string;
  updatedAt: string;
  totalCount: number;
  doneCount: number;
  learningCount: number;
  skippedCount: number;
  onCleared?: () => void;
  showClearButton?: boolean;
  roadmapSlug?: string;
  showActions?: boolean;
  onResourceClick?: () => void;
};

export function ResourceProgress(props: ResourceProgressType) {
  const {
    showClearButton = true,
    showActions = true,
    onResourceClick,
  } = props;

  const userId = getUser()?.id;

  const {
    updatedAt,
    resourceType,
    resourceId,
    title,
    totalCount,
    learningCount,
    doneCount,
    skippedCount,
    onCleared,
    roadmapSlug,
  } = props;

  let url =
    resourceType === 'roadmap'
      ? `/${resourceId}`
      : `/best-practices/${resourceId}`;

  const totalMarked = doneCount + skippedCount;
  const progressPercentage = getPercentage(totalMarked, totalCount);   //百分比进度

  const Slot = onResourceClick ? 'button' : 'a';

  return (
    <div className="relative">
      <Slot
        {...(onResourceClick
          ? {
              onClick: onResourceClick,
            }
          : {
              href: url,
              target: '_blank',
            })}
        className={cn(
          'group relative flex w-full items-center justify-between overflow-hidden rounded-md border border-gray-300 bg-white px-3 py-2 text-left text-sm transition-all hover:border-gray-400',
          showActions ? 'pr-7' : '',
        )}
      >
        <span className="flex-grow truncate">{title}</span>
        <span className="text-xs text-gray-400">
          {parseInt(progressPercentage, 10)}%
        </span>

        <span
          className="absolute left-0 top-0 block h-full cursor-pointer rounded-tl-md bg-black/5 transition-colors group-hover:bg-black/10"
          style={{
            width: `${progressPercentage}%`,
          }}
        ></span>
      </Slot>

      {showActions && (
        <div className="absolute right-2 top-0 flex h-full items-center">
          <ResourceProgressActions
            userId={userId!}
            resourceType={resourceType}
            resourceId={resourceId}
            onCleared={onCleared}
            showClearButton={showClearButton}
          />
        </div>
      )}
    </div>
  );
}
