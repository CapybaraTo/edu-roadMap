/*
 * @Author: capybarato 1023536640@qq.com
 * @Date: 2024-07-18 16:55:05
 * @LastEditors: capybarato 1023536640@qq.com
 * @LastEditTime: 2024-07-18 16:57:35
 * @FilePath: \roadMapPro\src\stores\roadmap.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { atom, computed } from 'nanostores';
// import type { GetRoadmapResponse } from '../components/CustomRoadmap/CustomRoadmap';

// export const currentRoadmap = atom<GetRoadmapResponse | undefined>(undefined);
// 团队当前最新的roadmap
// export const isCurrentRoadmapPersonal = computed(
//   currentRoadmap,
//   (roadmap) => !roadmap?.teamId,
// );
// 路线图操作权限
// export const canManageCurrentRoadmap = computed(
//   currentRoadmap,
//   (roadmap) => roadmap?.canManage,
// );

export const roadmapProgress = atom<
  { done: string[]; learning: string[]; skipped: string[] } | undefined
>();
export const totalRoadmapNodes = atom<number | undefined>();
