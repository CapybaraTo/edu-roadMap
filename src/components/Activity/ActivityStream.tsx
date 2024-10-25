import { useState } from 'react';
import { getRelativeTimeString } from '../../lib/date.ts';
import type { ResourceType } from '../../lib/resource-progress.ts';
import { EmptyStream } from './EmptyStream.tsx';    // 空活动流
import { ActivityTopicsModal } from './ActivityTopicsModal.tsx';  // 连接到路线图
import { ChevronsDown, ChevronsUp } from 'lucide-react';
import { ActivityTopicTitles } from './ActivityTopicTitles.tsx';  //展示全部与折叠
import { cn } from '../../lib/classname.ts';

export const allowedActivityActionType = [
  'learning',
  'done',
  'skipped',
  'answered',
] as const;
export type AllowedActivityActionType =
  (typeof allowedActivityActionType)[number];

export type UserStreamActivity = {
  activityId?: string;
  resourceType: ResourceType | 'question';
  resourceId: string;
  resourceTitle: string;
  // actionType: AllowedActivityActionType;
  status:AllowedActivityActionType;
  // topicTitles?: string[];
  topics?: string[];
  // createdAt: Date;
  updatedAt: Date;
};

type ActivityStreamProps = {
  activities: UserStreamActivity[];
  className?: string;
  onResourceClick?: (
    resourceId: string,
    resourceType: ResourceType,
  ) => void;
};

export function ActivityStream(props: ActivityStreamProps) {
  const { activities, className, onResourceClick } = props;
  const [showAll, setShowAll] = useState(false);
  const [selectedActivity, setSelectedActivity] =
    useState<UserStreamActivity | null>(null);


    // 对获取的数据进行按时间进度排序
  const sortedActivities = activities
    .filter(
      (activity) => activity?.topics && activity.topics.length > 0,
    )
    .sort((a, b) => {
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    })
    .slice(0, showAll ? activities.length : 10);

  return (
    <div className={cn('mx-0 px-0 py-5 md:-mx-10 md:px-8 md:py-8', className)}>
      {activities.length > 0 && (
        <h2 className="mb-3 text-xs uppercase text-gray-400">
          学习进度
        </h2>
      )}

      {selectedActivity && (
        <ActivityTopicsModal
          onClose={() => setSelectedActivity(null)}
          activityId={selectedActivity.activityId!}
          resourceId={selectedActivity.resourceId}
          resourceType={selectedActivity.resourceType}
          topics={selectedActivity.topics || []}
          topicCount={selectedActivity.topics?.length || 0}
          status={selectedActivity.status}
        />
      )}

      {activities.length > 0 ? (
        <ul className="divide-y divide-gray-100">
          {sortedActivities.map((activity) => {
            const {
              activityId,
              resourceType,
              resourceId,
              resourceTitle,
              // actionType,
              status,
              updatedAt,
              // topicTitles,
              topics,
            } = activity;

            const resourceUrl =
              resourceType === 'question'
                ? `/questions/${resourceId}`
                : resourceType === 'best-practice'
                  ? `/best-practices/${resourceId}`
                    : `/${resourceId}`;

            const resourceLinkComponent =
              onResourceClick && resourceType !== 'question' ? (
                <button
                  className="font-medium underline transition-colors hover:cursor-pointer hover:text-black"
                  onClick={() =>
                    onResourceClick(resourceId, resourceType)
                  }
                >
                  {resourceTitle}
                </button>
              ) : (
                <a
                  className="font-medium underline transition-colors hover:cursor-pointer hover:text-black"
                  target="_blank"
                  href={resourceUrl}
                >
                  {resourceTitle}
                </a>
              );

            const topicCount = topics?.length || 0;

            const timeAgo = (
              <span className="ml-1 text-xs text-gray-400">
                {getRelativeTimeString(new Date(updatedAt).toISOString())}
              </span>
            );

            return (
              <li key={activityId} className="py-2 text-sm text-gray-600">
                {status === 'learning' && (
                  <>
                    <p className="mb-1">
                      开始了&nbsp;{topicCount}&nbsp;知识点
                      {topicCount > 1 ? 's' : ''}&nbsp;in&nbsp;
                      {resourceLinkComponent}&nbsp;
                      {timeAgo}
                    </p>
                    <ActivityTopicTitles topicTitles={topics || []} />
                  </>
                )}
                {status === 'done' && (
                  <>
                    <p className="mb-1">
                      学完了&nbsp;{topicCount}&nbsp;知识点
                      {topicCount > 1 ? 's' : ''}&nbsp;in&nbsp;
                      {resourceLinkComponent}&nbsp;
                      {timeAgo}
                    </p>
                    <ActivityTopicTitles topicTitles={topics || []} />
                  </>
                )}
                {status === 'skipped' && (
                  <>
                    <p className="mb-1">
                      跳过了&nbsp;{topicCount}&nbsp;知识点
                      {topicCount > 1 ? 's' : ''}&nbsp;in&nbsp;
                      {resourceLinkComponent}&nbsp;
                      {timeAgo}
                    </p>
                    <ActivityTopicTitles topicTitles={topics || []} />
                  </>
                )}
                {status === 'answered' && (
                  <>
                    <p className="mb-1">
                      完成了&nbsp;{topicCount}&nbsp;题目
                      {topicCount > 1 ? 's' : ''}&nbsp;in&nbsp;
                      {resourceLinkComponent}&nbsp;
                      {timeAgo}
                    </p>
                    <ActivityTopicTitles topicTitles={topics || []} />
                  </>
                )}
              </li>
            );
          })}
        </ul>
      ) : (
        <EmptyStream />
      )}

      {activities.length > 10 && (
        <button
          className="mt-3 flex items-center gap-2 rounded-md border border-black py-1 pl-1.5 pr-2 text-xs uppercase tracking-wide text-black transition-colors hover:border-black hover:bg-black hover:text-white"
          onClick={() => setShowAll(!showAll)}
        >
          {showAll ? (
            <>
              <ChevronsUp size={14} />
              不用展示这么多
            </>
          ) : (
            <>
              <ChevronsDown size={14} />
              展示更多
            </>
          )}
        </button>
      )}
    </div>
  );
}
