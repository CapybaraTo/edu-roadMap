/*
 * @Author: capybarato 1023536640@qq.com
 * @Date: 2024-06-13 16:38:00
 * @LastEditors: capybarato 1023536640@qq.com
 * @LastEditTime: 2024-06-14 10:11:22
 * @FilePath: \roadMapPro\src\components\HeroSection\FavoriteRoadmaps.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { useEffect, useState } from 'react';   // 导入了 useEffect 和 useState 钩子，用于处理组件的状态和生命周期
// 导入了 EmptyProgress 组件用于展示空进度的情况，httpGet 函数用于发起HTTP GET请求，以及 HeroRoadmaps 组件用于展示路线图。
import { EmptyProgress } from './EmptyProgress';
import { httpGet } from '../../lib/http';
// import { HeroRoadmaps, type HeroTeamRoadmaps } from './HeroRoadmaps';
import { HeroRoadmaps } from './HeroRoadmaps';
// 用 isLoggedIn 函数检查用户是否已经登录。
import { isLoggedIn } from '../../lib/jwt';
// import type { AllowedMemberRoles } from '../ShareOptions/ShareTeamMemberList.tsx';

// 定义了用户进度响应的数据结构
export type UserProgressResponse = {
  resourceId: string;
  resourceType: 'roadmap' | 'best-practice';
  resourceTitle: string;
  isFavorite: boolean;
  done: number;
  learning: number;
  skipped: number;
  total: number;
  updatedAt: Date;
  // isCustomResource: boolean;
  roadmapSlug?: string;
  // team?: {
  //   name: string;
  //   id: string;
  //   role: AllowedMemberRoles;
  // };
}[];

// 此函数接收一个进度列表，遍历列表，为每个进度项设置一个自定义事件，更新进度条的宽度。
function renderProgress(progressList: UserProgressResponse) {
  progressList.forEach((progress) => {
    const href =
      progress.resourceType === 'best-practice'
        ? `/best-practices/${progress.resourceId}`
        : `/${progress.resourceId}`;
    const element = document.querySelector(`a[href="${href}"]`);
    if (!element) {
      return;
    }

    // 向页面上的所有监听器发送事件
    // 通知页面上的监听'mark-favorite'事件的组件，某个资源(传的参)的收藏状态已经改变
    window.dispatchEvent(
      new CustomEvent('mark-favorite', {
        detail: {
          resourceId: progress.resourceId,
          resourceType: progress.resourceType,
          isFavorite: progress.isFavorite,
        },
      }),
    );

    const totalDone = progress.done + progress.skipped;
    const percentageDone = (totalDone / progress.total) * 100;

    const progressBar: HTMLElement | null =
      element.querySelector('[data-progress]');
    if (progressBar) {
      progressBar.style.width = `${percentageDone}%`;
    }
  });
}

type ProgressResponse = UserProgressResponse;

export function FavoriteRoadmaps() {
  // 首先检查用户是否已登录。
  const isAuthenticated = isLoggedIn();
  if (!isAuthenticated) {
    return null;
  }
// useState 来管理组件的状态，包括是否正在准备、是否正在加载、进度列表和容器的透明度。
// setIsLoading 是一个函数，它用于更新 isLoading 状态。当你调用 setIsLoading 并传递一个新的布尔值时，React 会重新渲染组件并使用新的值更新状态。
// React中常见的“状态-更新函数”对  
  const [isPreparing, setIsPreparing] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState<ProgressResponse>([]);
  const [containerOpacity, setContainerOpacity] = useState(0);

  // 显示进度容器
  function showProgressContainer() {
    const heroEl = document.getElementById('hero-text')!;
    if (!heroEl) {
      return;
    }

    heroEl.classList.add('opacity-0');
    setTimeout(() => {
      heroEl.parentElement?.removeChild(heroEl);
      setIsPreparing(false);

      setTimeout(() => {
        setContainerOpacity(100);
      }, 50);
    }, 0);
  }

  // 用于加载进度数据，如果加载成功，会调用 renderProgress 函数来渲染进度条。
  // 组件渲染逻辑包括检查是否正在准备、是否有进度数据以及是否正在加载，并根据这些状态渲染不同的内容。
  async function loadProgress() {
    // 设置加载状态isLoading为true
    setIsLoading(true);

    // 请求
    const { response: progressList, error } = await httpGet<ProgressResponse>(
      `${import.meta.env.PUBLIC_API_URL}/v1-get-hero-roadmaps`,
    );

    if (error || !progressList) {
      return;
    }

    // 设置进度列表的值为progressList
    setProgress(progressList);
    // 设置加载状态为false
    setIsLoading(false);
    // 显示进度容器
    showProgressContainer();

    // 渲染进度表
    renderProgress(progressList);
  }

  //  useEffect 钩子来处理组件加载和自定义事件的监听
  useEffect(() => {
    loadProgress().finally(() => {
      setIsLoading(false);
    });
  }, []);

  // 监听refresh-favorite事件，触发该事件时重新加载进度
  useEffect(() => {
    window.addEventListener('refresh-favorites', loadProgress);
    return () => window.removeEventListener('refresh-favorites', loadProgress);
  }, []);

  if (isPreparing) {
    return null;
  }

  const hasProgress = progress?.length > 0;
  // 自定义路线图
  // const customRoadmaps = progress?.filter(
  //   (p) => p.isCustomResource && !p.team?.name,
  // );
    // const defaultRoadmaps = progress?.filter((p) => !p.isCustomResource);
  const defaultRoadmaps = progress?.filter((p) => true);


  // 团队路线图
  // const teamRoadmaps: HeroTeamRoadmaps = progress?.filter((p) => p.isCustomResource && p.team?.name)
  //   .reduce((acc: HeroTeamRoadmaps, curr) => {
  //     const currTeam = curr.team!;
  //     if (!acc[currTeam.name]) {
  //       acc[currTeam.name] = [];
  //     }

  //     acc[currTeam.name].push(curr);

  //     return acc;
  //   }, {});

  return (
    <div
      className={`transition-opacity duration-500  opacity-${containerOpacity}`}
    >
      <div
        className={`flex min-h-[192px] bg-gradient-to-b sm:min-h-[280px] ${
          hasProgress && `border-t border-t-[#1e293c]`
        }`}
      >
        <div className="container min-h-full">
          {!isLoading && progress?.length == 0 && <EmptyProgress />}
          {hasProgress && (
            <HeroRoadmaps
              progress={defaultRoadmaps}
              isLoading={isLoading}
            />
          )}
        </div>
      </div>
    </div>
  );
}
