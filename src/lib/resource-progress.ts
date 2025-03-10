// 路线图进度配置相关。以及计算完成任务数等
import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { httpGet, httpPost } from './http';   // 导入 httpGet 和 httpPost 函数用于发起 HTTP GET 和 POST 请求
import { TOKEN_COOKIE_NAME, getUser, decodeToken } from './jwt'; 
// @ts-ignore
import Element = astroHTML.JSX.Element;   //导入 Element 类型，可能用于操作 JSX 或类似 JSX 的元素   JSX元素：允许你在JavaScript代码中写类似HTML的标记语言
import { roadmapProgress, totalRoadmapNodes } from '../stores/roadmap.ts';

export type ResourceType = 'roadmap' | 'best-practice';
export type ResourceProgressType =
  | 'done'
  | 'learning'
  | 'pending'
  | 'skipped'
  | 'removed';
type TopicMeta = {
  topicId: string;    
  resourceType: ResourceType;   
  resourceId: string;  
};

// 判断知识点是否完成  是否被标记为完成  调用getResourceProgress 获取状态
export async function isTopicDone(
  topic: TopicMeta
): Promise<boolean> {
  const { topicId, resourceType, resourceId } = topic;
  const { done = [] } =
    (await getResourceProgress(resourceType, resourceId)) || {};

  return done?.includes(topicId);   // done list里包不包含当前的topicid
}

// 判断知识点状态  调用getResourceProgress 获取状态
export async function getTopicStatus(
  topic: TopicMeta,
): Promise<ResourceProgressType> {
  const { topicId,resourceType, resourceId} = topic;
  // const userId = getUser()?.id;
  const progressResult = await getResourceProgress(resourceType, resourceId);
  if (progressResult?.done?.includes(topicId)) {
    return 'done';
  }
  if (progressResult?.learning?.includes(topicId)) {
    return 'learning';
  }
  if (progressResult?.skipped?.includes(topicId)) {
    return 'skipped';
  }
  return 'pending';
}

// 更新资源进展  发送请求 
// /resource/update-user-progress
export async function updateResourceProgress(
  topic: TopicMeta,
  progressType: ResourceProgressType,
) {
  const { topicId, resourceType, resourceId } = topic;
  const userId = getUser()?.id;
  const username = getUser()?.username;
  const { response, error } = await httpPost<{
    done: string[];
    learning: string[];
    skipped: string[];
    isFavorite: boolean;
  }>(`${import.meta.env.PUBLIC_API_URL}/resource/update-user-progress`, {
    userId,
    username,
    topicId,
    resourceType,
    resourceId,
    progress: progressType,
  });

  if (error || !response?.done || !response?.learning) {
    throw new Error(error?.message || 'Something went wrong');
  }

  setResourceProgress(
    resourceType,
    resourceId,
    response.done,   // done list
    response.learning,  // learning list
    response.skipped,   // skipped list
  );

  return response;
}

// 清除迁移的路线图进度
export function clearMigratedRoadmapProgress(
  resourceType: string,
  resourceId: string,
) {
  const migratedRoadmaps = [
    'frontend',
    'backend',
    'react',
    'vue',
    'javascript',
    'nodejs',
    'python',
    'test',    //
    'ai-test'   //
  ];

  if (!migratedRoadmaps.includes(resourceId)) {
    return;
  }

  const userId = getUser()?.id;
  if (!userId) {
    return;
  }

  const roadmapKey = `${resourceType}-${resourceId}-${userId}-progress`;
  const clearedKey = `${resourceType}-${resourceId}-${userId}-cleared`;

  const clearedCount = parseInt(localStorage.getItem(clearedKey) || '0', 10);

  if (clearedCount >= 10) {
    return;
  }

  localStorage.removeItem(roadmapKey);
  localStorage.setItem(clearedKey, `${clearedCount + 1}`);
}

// 获取资源进展    
// 从本地存储或后端获取资源的进展状态。如果用户未登录或本地存储的进展已过期（超过15分钟），则加载新的进展
// 前端请求参数形式：
// {
//   "userId":14,
//   "resourceType":"roadmap",
//   "resourceId":"Javascript"
// }
export async function getResourceProgress(
  resourceType: 'roadmap' | 'best-practice',
  resourceId: string,
): Promise<{ done: string[]; learning: string[]; skipped: string[] }> {
  // 如果没登录的话，不显示进度
  if (!Cookies.get(TOKEN_COOKIE_NAME)) {
    return {
      done: [],
      learning: [],
      skipped: [],
    };
  }
// 用户已经登录
  const userId = getUser()?.id;
  console.log('getResourceProgress userId',userId);
  const progressKey = `${resourceType}-${resourceId}-${userId}-progress`;
  const isFavoriteKey = `${resourceType}-${resourceId}-favorite`;
// 先从localstorage中获取  是否标记为收藏 的值
  const rawIsFavorite = localStorage.getItem(isFavoriteKey);
  const isFavorite = JSON.parse(rawIsFavorite || '0') === 1;    //转为bool值
// 先从localstorage中获取  资源进展
  const rawProgress = localStorage.getItem(progressKey);
  const progress = JSON.parse(rawProgress || 'null');
// 判断localstorage里的资源新不新
  const progressTimestamp = progress?.timestamp;
  const diff = new Date().getTime() - parseInt(progressTimestamp || '0', 10);   //当前时间
  const isProgressExpired = diff > 15 * 60 * 1000; // 15 minutes

  // 如果进展非空或localstorage未更新的时间超过15分钟  重新加载页面各节点进度
  if (!progress || isProgressExpired) {
    return loadFreshProgress(resourceType, resourceId);
  } else {
    // 进度状态存进localstorage
    setResourceProgress(
      resourceType,
      resourceId,
      progress?.done || [],
      progress?.learning || [],
      progress?.skipped || [],
    );
  }

  // Dispatch event to update favorite status in the MarkFavorite component
  window.dispatchEvent(
    new CustomEvent('mark-favorite', {
      detail: {
        resourceType,
        resourceId,
        isFavorite,
      },
    }),
  );

  return progress;
}

// get-user-progress 发送获取进度的请求
// 前端传 resourceType 和 resourceId
async function loadFreshProgress(
  resourceType: ResourceType,
  resourceId: string,
) {
  const userId =  getUser()?.id;  
  console.log('loadFreshProgress userId', userId);
  const { response, error } = await httpPost<{
    done: string[];
    learning: string[];
    skipped: string[];
    // isFavorite: boolean;
  // }>(`${import.meta.env.PUBLIC_API_URL}/v1-get-user-resource-progress`, {
  }>(`${import.meta.env.PUBLIC_API_URL}/resource/get-user-progress`, {
    userId,
    resourceType,
    resourceId,
  });

  if (error || !response) {
    console.error(error);
    return {
      done: [],
      learning: [],
      skipped: [],
    };
  }

  setResourceProgress(
    resourceType,
    resourceId,
    response?.done || [],
    response?.learning || [],
    response?.skipped || [],
  );

  // Dispatch event to update favorite status in the MarkFavorite component
  window.dispatchEvent(
    new CustomEvent('mark-favorite', {
      detail: {
        resourceType,
        resourceId,
        // isFavorite: response.isFavorite,
      },
    }),
  );

  return response;
}

// 进展保存到本地存储 localstorage
export function setResourceProgress(
  resourceType: 'roadmap' | 'best-practice',
  resourceId: string,
  done: string[],
  learning: string[],
  skipped: string[],
): void {
  roadmapProgress.set({
    done,
    learning,
    skipped,
  });

  // 将进度暂存进localstorage
  const userId = getUser()?.id;
  console.log('setResourceProgress userId',userId);
  localStorage.setItem(
    `${resourceType}-${resourceId}-${userId}-progress`,
    JSON.stringify({
      done,
      learning,
      skipped,
      timestamp: new Date().getTime(),
    }),
  );
}

// 如下三个函数用于在网页上选择和操作与特定主题（topic）相关的元素，以及根据主题的进展状态来更新这些元素的样式
// topicSelectorAll函数功能：选择与 topicId 相关的所有 DOM 元素
export function topicSelectorAll(
  topicId: string,
  parentElement: Document | SVGElement | HTMLDivElement = document,
): Element[] {
  const matchingElements: Element[] = [];

  // Elements having sort order in the beginning of the group id
  parentElement
    .querySelectorAll(`[data-group-id$="-${topicId}"]`)   //属性选择器 选择DOM元素qsAll  具有 data-group-id 属性且以 -${topicId} 结尾的元素
    .forEach((element: unknown) => {
      const foundGroupId =
        (element as HTMLOrSVGElement)?.dataset?.groupId || '';
      const validGroupRegex = new RegExp(`^\\d+-${topicId}$`);   // 以一个或多个数字开头，后面紧跟一个短横线，然后是 ${topicId} 变量的值

      if (validGroupRegex.test(foundGroupId)) {
        matchingElements.push(element);   // 符合条件的元素添加到 matchingElements 数组
      }
    });

  getMatchingElements(
    [
      `[data-group-id="${topicId}"]`, // Elements with exact match of the topic id
      `[data-group-id="check:${topicId}"]`, // Matching "check:XXXX" box of the topic
      `[data-node-id="${topicId}"]`, // Matching custom roadmap nodes
      `[data-id="${topicId}"]`, // Matching custom roadmap nodes
      `[data-checklist-checkbox][data-checklist-id="${topicId}"]`, // Matching checklist checkboxes
      `[data-checklist-label][data-checklist-id="${topicId}"]`, // Matching checklist labels
    ],
    parentElement,
  ).forEach((element) => {
    matchingElements.push(element);
  });

  return matchingElements;     // 返回包含所有匹配元素的数组
}

// 渲染：根据主题的进展状态（根据传的参数），更新与该主题相关的 DOM 元素的类列表，样式
export function renderTopicProgress(
  topicId: string,
  topicProgress: ResourceProgressType,
) {
  const isLearning = topicProgress === 'learning';
  const isSkipped = topicProgress === 'skipped';
  const isDone = topicProgress === 'done';
  const isRemoved = topicProgress === 'removed';

  const matchingElements: Element[] = topicSelectorAll(topicId);

  matchingElements.forEach((element) => {
    if (isDone) {
      element.classList.add('done');
      element.classList.remove('learning', 'skipped');
    } else if (isLearning) {
      element.classList.add('learning');
      element.classList.remove('done', 'skipped');
    } else if (isSkipped) {
      element.classList.add('skipped');
      element.classList.remove('done', 'learning');
    } else if (isRemoved) {
      element.classList.add('removed');
      element.classList.remove('done', 'learning', 'skipped');
    } else {
      element.classList.remove('done', 'skipped', 'learning', 'removed');
    }
  });
}

// 清除所有资源的进展状态，移除特定DOM元素上的类
export function clearResourceProgress() {
  const matchingElements = getMatchingElements([
    '.clickable-group',
    '[data-type="topic"]',
    '[data-type="subtopic"]',
    '.react-flow__node-topic',
    '.react-flow__node-subtopic',
  ]);
  for (const clickableElement of matchingElements) {
    clickableElement.classList.remove('done', 'skipped', 'learning', 'removed');
  }
}

// 用于在网页上渲染和更新资源的进展状态，并刷新进度计数器
// 根据获取的资源进展状态，调用 renderTopicProgress 来更新每个主题的进展显示。
export async function renderResourceProgress(
  userId: string,
  resourceType: ResourceType,
  resourceId: string,
) {
  const {
    done = [],
    learning = [],
    skipped = [],
  } = (await getResourceProgress(userId, resourceType, resourceId)) || {};    //从 getResourceProgress 异步函数获取资源的进展状态

  done.forEach((topicId) => {
    renderTopicProgress(topicId, 'done');  //调用渲染函数
  });

  learning.forEach((topicId) => {
    renderTopicProgress(topicId, 'learning');
  });

  skipped.forEach((topicId) => {
    renderTopicProgress(topicId, 'skipped');
  });

  refreshProgressCounters();   // 刷新页面上的进度计数器
}

// 根据提供的 CSS 选择器数组和父元素，查找并返回所有匹配的 DOM 元素数组
function getMatchingElements(
  queries: string[],   // 一个包含 CSS 选择器的字符串数组
  parentElement: Document | SVGElement | HTMLDivElement = document,     // 指定从哪个 DOM 元素开始查询，默认为 document
): Element[] {
  const matchingElements: Element[] = [];
  queries.forEach((query) => {
    parentElement.querySelectorAll(query).forEach((element) => {
      matchingElements.push(element);
    });
  });
  return matchingElements;
}

// 刷新页面上的进度计数器，如完成、学习中、已跳过的主题数量，以及总体进度百分比。
export function refreshProgressCounters() {
  const progressNumsContainers = document.querySelectorAll(
    '[data-progress-nums-container]',
  );
  const progressNums = document.querySelectorAll('[data-progress-nums]');
  if (progressNumsContainers.length === 0 || progressNums.length === 0) {
    return;
  }

  // 使用 getMatchingElements 函数查找页面上的所有可点击元素、外部链接、路线图切换器、复选框等
  // 并计算它们的总数和各自完成的状态数量。
  const totalClickable = getMatchingElements([  
    '.clickable-group',
    '[data-type="topic"]',
    '[data-type="subtopic"]',
    '.react-flow__node-topic',
    '.react-flow__node-subtopic',
  ]).length;

  const externalLinks = document.querySelectorAll(
    '[data-group-id^="ext_link:"]',
  ).length;
  const roadmapSwitchers = document.querySelectorAll(
    '[data-group-id^="json:"]',
  ).length;
  const checkBoxes = document.querySelectorAll(
    '[data-group-id^="check:"]',
  ).length;

  const totalCheckBoxesDone = document.querySelectorAll(
    '[data-group-id^="check:"].done',
  ).length;
  const totalCheckBoxesLearning = document.querySelectorAll(
    '[data-group-id^="check:"].learning',
  ).length;
  const totalCheckBoxesSkipped = document.querySelectorAll(
    '[data-group-id^="check:"].skipped',
  ).length;

  const totalRemoved = document.querySelectorAll(
    '.clickable-group.removed',
  ).length;
  const totalItems =
    totalClickable -
    externalLinks -
    roadmapSwitchers -
    checkBoxes -
    totalRemoved;

    // 更新全局状态 totalRoadmapNodes 以反映剩余的总项目数
  totalRoadmapNodes.set(totalItems);


  // 计算并更新页面上显示的完成、学习中、已跳过的数量。
  // 计算完成、学习中、已跳过的任务数
  const totalDone =
    getMatchingElements([
      '.clickable-group.done:not([data-group-id^="ext_link:"])',
      '[data-node-id].done', // All data-node-id=*.done elements are custom roadmap nodes
      '[data-id].done', // All data-id=*.done elements are custom roadmap nodes
    ]).length - totalCheckBoxesDone;
  const totalLearning =
    getMatchingElements([
      '.clickable-group.learning',
      '[data-node-id].learning',
      '[data-id].learning',
    ]).length - totalCheckBoxesLearning;
  const totalSkipped =
    getMatchingElements([
      '.clickable-group.skipped',
      '[data-node-id].skipped',
      '[data-id].skipped',
    ]).length - totalCheckBoxesSkipped;

  // 更新已完成、学习中、跳过的任务数
  const doneCountEls = document.querySelectorAll('[data-progress-done]');
  if (doneCountEls.length > 0) {
    doneCountEls.forEach(
      (doneCountEl) => (doneCountEl.innerHTML = `${totalDone}`),
    );
  }

  const learningCountEls = document.querySelectorAll(
    '[data-progress-learning]',
  );
  if (learningCountEls.length > 0) {
    learningCountEls.forEach(
      (learningCountEl) => (learningCountEl.innerHTML = `${totalLearning}`),
    );
  }

  const skippedCountEls = document.querySelectorAll('[data-progress-skipped]');
  if (skippedCountEls.length > 0) {
    skippedCountEls.forEach(
      (skippedCountEl) => (skippedCountEl.innerHTML = `${totalSkipped}`),
    );
  }

  // 总进度
  const totalCountEls = document.querySelectorAll('[data-progress-total]');
  if (totalCountEls.length > 0) {
    totalCountEls.forEach(
      (totalCountEl) => (totalCountEl.innerHTML = `${totalItems}`),
    );
  }

    // 计算并更新总体进度百分比，并在页面上显示
  const progressPercentage =
    Math.round(((totalDone + totalSkipped) / totalItems) * 100) || 0;
  const progressPercentageEls = document.querySelectorAll(
    '[data-progress-percentage]',
  );
  if (progressPercentageEls.length > 0) {
    progressPercentageEls.forEach(
      (progressPercentageEl) =>
        (progressPercentageEl.innerHTML = `${progressPercentage}`),
    );
  }

  // 移除之前oading的条纹效果，并确保所有进度数字都可见。
  progressNumsContainers.forEach((progressNumsContainer) =>
    progressNumsContainer.classList.remove('striped-loader'),
  );
  progressNums.forEach((progressNum) => {
    progressNum.classList.remove('opacity-0');
  });
}
