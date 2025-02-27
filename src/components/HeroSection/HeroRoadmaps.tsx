import type { UserProgressResponse } from './FavoriteRoadmaps.tsx';     // 收藏的路线图
import { CheckIcon } from '../ReactIcons/CheckIcon.tsx';     // 
import { MarkFavorite } from '../FeaturedItems/MarkFavorite';
import { Spinner } from '../ReactIcons/Spinner';
import type { ResourceType } from '../../lib/resource-progress';
import { MapIcon, Users2 } from 'lucide-react';
// import { CreateRoadmapButton } from '../CustomRoadmap/CreateRoadmap/CreateRoadmapButton';
// import { CreateRoadmapModal } from '../CustomRoadmap/CreateRoadmap/CreateRoadmapModal';
import { type ReactNode, useState } from 'react';
import { AIAnnouncement } from '../AIAnnouncement.tsx';

// 定义了 HeroRoadmap 组件的属性类型，包括资源的URL、完成度百分比、是否允许收藏等
type ProgressRoadmapProps = {
  url: string;
  percentageDone: number;
  allowFavorite?: boolean;

  resourceId: string;
  resourceType: ResourceType;
  resourceTitle: string;
  isFavorite?: boolean;
};
// 接收 ProgressRoadmapProps 类型的属性，返回一个JSX元素-链接(<a>)元素，其中包含资源标题和进度条。如果允许收藏，还会显示一个收藏图标。
function HeroRoadmap(props: ProgressRoadmapProps) {
  const {
    url,
    percentageDone,
    resourceType,
    resourceId,
    resourceTitle,
    isFavorite,
    allowFavorite = true,
  } = props;

  return (
    <a
      href={url}
      className="group relative flex flex-col overflow-hidden rounded-lg border border-slate-800 bg-slate-900/80 p-4 text-sm text-slate-400 transition-all duration-200 hover:border-slate-600 hover:bg-slate-800/80 hover:text-slate-300 hover:shadow-md hover:shadow-slate-900/30"
    >
      <span className="relative z-20 font-medium">{resourceTitle}</span>

      <span
        className="absolute bottom-0 left-0 top-0 z-10 bg-gradient-to-r from-blue-900/40 to-purple-900/40 transition-all duration-300 group-hover:from-blue-800/40 group-hover:to-purple-800/40"
        style={{ width: `${percentageDone}%` }}
        data-progress
      ></span>

      {allowFavorite && (
        <MarkFavorite
          resourceId={resourceId}
          resourceType={resourceType}
          favorite={isFavorite}
        />
      )}
    </a>
  );
}
// 定义了 HeroTitle 组件的属性类型，包括图标、标题和是否处于加载状态。
type ProgressTitleProps = {
  icon: any;
  isLoading?: boolean;
  title: string | ReactNode;
};
// 用于显示标题，如果处于加载状态，会显示一个加载图标
export function HeroTitle(props: ProgressTitleProps) {
  const { isLoading = false, title, icon } = props;

  return (
    <h3 className="mb-4 flex items-center gap-2 text-sm font-medium text-gray-300">
      {!isLoading && (
        <span className="text-purple-400">
          {icon}
        </span>
      )}
      {isLoading && (
        <span className="text-purple-400">
          <Spinner />
        </span>
      )}
      {title}
    </h3>
  );
}
// 定义了一个类型，表示团队路线图的记录，键是字符串，值是 UserProgressResponse 类型。
// export type HeroTeamRoadmaps = Record<string, UserProgressResponse>;

// 定义了 HeroRoadmaps 组件的属性类型，包括用户进度、自定义路线图、团队路线图和是否处于加载状态。
type ProgressListProps = {
  progress: UserProgressResponse;
  // customRoadmaps: UserProgressResponse;
  // teamRoadmaps?: HeroTeamRoadmaps;
  isLoading?: boolean;
};
// 用于展示用户的进度和收藏的路线图，以及自定义和团队路线图
// 使用了几个子组件来展示不同的部分
// AIAnnouncement 组件，可能用于显示AI相关的公告。
// CreateRoadmapModal 组件，用于创建新的路线图。
// CreateRoadmapButton 组件，用于触发创建路线图的模态框或操作
export function HeroRoadmaps(props: ProgressListProps) {
  const {
    progress,
    isLoading = false
  } = props;

  // const [isCreatingRoadmap, setIsCreatingRoadmap] = useState(false);
  // const [creatingRoadmapTeamId, setCreatingRoadmapTeamId] = useState<string>();

  return (
    <div className="relative pb-12 pt-4 sm:pt-7">
      <div className="mb-7 mt-2">
        <AIAnnouncement />
      </div>
      {/* {isCreatingRoadmap && (
        <CreateRoadmapModal
          teamId={creatingRoadmapTeamId}
          onClose={() => {
            setIsCreatingRoadmap(false);
            setCreatingRoadmapTeamId(undefined);
          }}
        />
      )} */}
      {
        <HeroTitle
          icon={
            (<CheckIcon additionalClasses="h-[16px] w-[16px]" />) as any
          }
          isLoading={isLoading}
          title="你的进度和收藏的路线图"
        />
      }

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
        {progress.map((resource) => (
          <HeroRoadmap
            key={`${resource.resourceType}-${resource.resourceId}`}
            resourceId={resource.resourceId}
            resourceType={resource.resourceType}
            resourceTitle={resource.resourceTitle}
            isFavorite={resource.isFavorite}
            percentageDone={
              ((resource.skipped + resource.done) / resource.total) * 100
            }
            url={
              resource.resourceType === 'roadmap'
                ? `/${resource.resourceId}`
                : `/best-practices/${resource.resourceId}`
            }
          />
        ))}
      </div>

      <div className="mt-5">
        {/* {
          <HeroTitle
            icon={<MapIcon className="mr-1.5 h-[14px] w-[14px]" />}
            title="你自定义的路线图"
          />
        } */}

        {/* {customRoadmaps.length === 0 && (
          <p className="rounded-md border border-dashed border-gray-800 p-2 text-sm text-gray-600">
            You haven't created any custom roadmaps yet.{' '}
            <button
              className="text-gray-500 underline underline-offset-2 hover:text-gray-400"
              onClick={() => setIsCreatingRoadmap(true)}
            >
              Create one!
            </button>
          </p>
        )} */}

        {/* {customRoadmaps.length > 0 && (
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3">
            {customRoadmaps.map((customRoadmap) => {
              return (
                <HeroRoadmap
                  key={customRoadmap.resourceId}
                  resourceId={customRoadmap.resourceId}
                  resourceType={'roadmap'}
                  resourceTitle={customRoadmap.resourceTitle}
                  percentageDone={
                    ((customRoadmap.skipped + customRoadmap.done) /
                      customRoadmap.total) *
                    100
                  }
                  url={`/r/${customRoadmap?.roadmapSlug}`}
                  allowFavorite={false}
                />
              );
            })}

            <CreateRoadmapButton />
          </div>
        )} */}
      </div>

      {/* 团队路线图 */}
      {/* {Object.keys(teamRoadmaps).map((teamName) => {
        const currentTeam: UserProgressResponse[0]['team'] =
          teamRoadmaps?.[teamName]?.[0]?.team;
        const roadmapsList = teamRoadmaps[teamName].filter(
          (roadmap) => !!roadmap.resourceTitle,
        );
        const canManageTeam = ['admin', 'manager'].includes(currentTeam?.role!);

        return (
          <div className="mt-5" key={teamName}>
            {
              <HeroTitle
                icon={<Users2 className="mr-1.5 h-[14px] w-[14px]" />}
                title={
                  <>
                    Team{' '}
                    <a
                      className="mx-1 font-medium underline underline-offset-2 transition-colors hover:text-gray-300"
                      href={`/team/activity?t=${currentTeam?.id}`}
                    >
                      {teamName}
                    </a>
                    Roadmaps
                  </>
                }
              />
            }

            {roadmapsList.length === 0 && (
              <p className="rounded-md border border-dashed border-gray-800 p-2 text-sm text-gray-600">
                Team does not have any roadmaps yet.{' '}
                {canManageTeam && (
                  <button
                    className="text-gray-500 underline underline-offset-2 hover:text-gray-400"
                    onClick={() => {
                      setCreatingRoadmapTeamId(currentTeam?.id);
                      setIsCreatingRoadmap(true);
                    }}
                  >
                    Create one!
                  </button>
                )}
              </p>
            )}

            {roadmapsList.length > 0 && (
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3">
                {roadmapsList.map((customRoadmap) => {
                  return (
                    <HeroRoadmap
                      key={customRoadmap.resourceId}
                      resourceId={customRoadmap.resourceId}
                      resourceType={'roadmap'}
                      resourceTitle={customRoadmap.resourceTitle}
                      percentageDone={
                        ((customRoadmap.skipped + customRoadmap.done) /
                          customRoadmap.total) *
                        100
                      }
                      url={`/r/${customRoadmap?.roadmapSlug}`}
                      allowFavorite={false}
                    />
                  );
                })}

                {canManageTeam && (
                  <CreateRoadmapButton
                    teamId={currentTeam?.id}
                    text="Create Team Roadmap"
                  />
                )}
              </div>
            )}
          </div>
        );
      })} */}
    </div>
  );
}
