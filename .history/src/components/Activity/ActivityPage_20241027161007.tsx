import { useEffect, useState } from 'react';
import { httpGet } from '../../lib/http';
import { ActivityCounters } from './ActivityCounters.tsx';   //上边栏 总体统计信息
import { ResourceProgress } from './ResourceProgress.tsx';   //路线图进度
import { pageProgressMessage } from '../../stores/page';
import { EmptyActivity } from './EmptyActivity.tsx';   //空进展显示组件
import { ActivityStream, type UserStreamActivity } from './ActivityStream.tsx';   // 活动流
import type { PageType } from '../CommandMenu/CommandMenu';
import { useToast } from '../../hooks/use-toast';
import type { GetPublicProfileResponse } from '../../api/user';
import { UserActivityHeatmap } from '../UserProgress/UserProgressActivityHeatmap';

type ProgressResponse = {
  updatedAt: string;
  title: string;
  id: string;
  learning: number;
  skipped: number;
  done: number;
  total: number;
};

type UserPublicProfilePageProps = GetPublicProfileResponse;

export function UserPublicProfilePage(props: UserPublicProfilePageProps) {
  const {
    activity,
    username,
    _id: userId,
    createdAt,
  } = props;
}

export type ActivityResponse = {
  done: number;
  learning: {     //正在学习的路线图
    total: number;
    roadmaps: ProgressResponse[];
  };
  streak: {
    count: number;
    firstVisitAt: Date | null;
    lastVisitAt: Date | null;
  };
  activities: UserStreamActivity[];
};

// 加载路线图学习进度  userRoadmapStats
export function ActivityPage() {
  const toast = useToast();
  const [activity, setActivity] = useState<ActivityResponse>();
  const [isLoading, setIsLoading] = useState(true);
  const [projectDetails, setProjectDetails] = useState<PageType[]>([]);

  async function loadActivity() {
    const { error, response } = await httpGet<ActivityResponse>(
      `${import.meta.env.PUBLIC_API_URL}/user/stats`,    
    );

    // 获取用户状态所有信息
    console.log("activity:",response);
    console.log("response.activities.topics接收到的",response?.activities)

    if (!response || error) {
      console.error('Error! 加载活动时好像出现了什么问题...');
      console.error(error);

      return;
    }

    // 将单一字符串转换为字符串数组
    function convertTopics(topics: string): string[] {
      return topics.split(',').map(topic => topic.trim());
    }
    response.activities = response.activities.map(activityA => ({
      ...activityA,
      topics: activityA.topics ? convertTopics(activityA.topics) : undefined,
    }));
    setActivity(response);
    console.log("response.activities.topics转换后的",response?.activities)

  }

  // 链接路线图
  async function loadAllProjectDetails() {
    const { error, response } = await httpGet<PageType[]>(`/pages.json`);

    if (error) {
      toast.error(error.message || 'Something went wrong');
      return;
    }

    if (!response) {
      return [];
    }

    const allProjects = response.filter((page) => page.group === 'Projects');
    setProjectDetails(allProjects);
  }

  useEffect(() => {
    Promise.allSettled([loadActivity(), loadAllProjectDetails()]).finally(
      () => {
        pageProgressMessage.set('');
        setIsLoading(false);
      },
    );
  }, []);

  // 抽出来learning的roadmap部分单独一个对象learningRoadmaps
  const learningRoadmaps = activity?.learning.roadmaps || [];
  // const learningBestPractices = activity?.learning.bestPractices || [];

  if (isLoading) {
    return null;
  }

  // 按日期排序   // 并去掉learning以及done为0
  const learningRoadmapsToShow = learningRoadmaps
    .sort((a, b) => {
      const updatedAtA = new Date(a.updatedAt);
      const updatedAtB = new Date(b.updatedAt);

      return updatedAtB.getTime() - updatedAtA.getTime();
    })
    .filter((roadmap) => roadmap.learning > 0 || roadmap.done > 0);

    const hasProgress = learningRoadmapsToShow.length !== 0;


  return (
    <>
      <ActivityCounters
        done={activity?.done || 0}
        learning={activity?.learning || {  total: 0 }}
        streak={activity?.streak || { count: 0 }}
      />

      <div className="mx-0 px-0 py-5 pb-0 md:-mx-10 md:px-8 md:py-8 md:pb-0">
        {learningRoadmapsToShow.length === 0 && <EmptyActivity />}

        {learningRoadmapsToShow.length > 0 && (
          <>
          <div>
            {/* 类github的提交heatmap */}
          </div>
            <h2 className="mb-3 text-xs uppercase text-gray-400">
              持续跟踪
            </h2>
            <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-2">
              {learningRoadmaps
                .sort((a, b) => {
                  const updatedAtA = new Date(a.updatedAt);
                  const updatedAtB = new Date(b.updatedAt);

                  return updatedAtB.getTime() - updatedAtA.getTime();
                })
                .filter((roadmap) => roadmap.learning > 0 || roadmap.done > 0)
                .map((roadmap) => {
                  const learningCount = roadmap.learning || 0;
                  const doneCount = roadmap.done || 0;
                  const totalCount = roadmap.total || 0;
                  const skippedCount = roadmap.skipped || 0;

                  return (
                    <ResourceProgress
                      key={roadmap.id}
                      doneCount={
                        doneCount > totalCount ? totalCount : doneCount
                      }
                      learningCount={
                        learningCount > totalCount ? totalCount : learningCount
                      }
                      totalCount={totalCount}
                      skippedCount={skippedCount}
                      resourceId={roadmap.id}
                      resourceType={'roadmap'}
                      updatedAt={roadmap.updatedAt}
                      title={roadmap.title}
                      onCleared={() => {
                        pageProgressMessage.set('Updating activity');
                        loadActivity().finally(() => {
                          pageProgressMessage.set('');
                        });
                      }}
                    />
                  );
                })}

              {/* {learningBestPractices
                .sort((a, b) => {
                  const updatedAtA = new Date(a.updatedAt);
                  const updatedAtB = new Date(b.updatedAt);

                  return updatedAtB.getTime() - updatedAtA.getTime();
                })
                .filter(
                  (bestPractice) =>
                    bestPractice.learning > 0 || bestPractice.done > 0,
                )
                .map((bestPractice) => (
                  <ResourceProgress
                    key={bestPractice.id}
                    doneCount={bestPractice.done || 0}
                    totalCount={bestPractice.total || 0}
                    learningCount={bestPractice.learning || 0}
                    resourceId={bestPractice.id}
                    skippedCount={bestPractice.skipped || 0}
                    resourceType={'best-practice'}
                    title={bestPractice.title}
                    updatedAt={bestPractice.updatedAt}
                    onCleared={() => {
                      pageProgressMessage.set('Updating activity');
                      loadActivity().finally(() => {
                        pageProgressMessage.set('');
                      });
                    }}
                  />
                ))} */}
            </div>
          </>
        )}
      </div>

      {/* 活动heatmap  需要获取每天的活动数量 */}
      {hasProgress &&(
        <UserActivityHeatmap joinedAt={createdAt} activity={activity!} />
      )}

      {hasProgress && (
        <ActivityStream activities={activity?.activities || []} />
      )}
    </>
  );
}
