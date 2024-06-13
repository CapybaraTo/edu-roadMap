/*
 * @Author: capybarato 1023536640@qq.com
 * @Date: 2024-06-11 14:00:07
 * @LastEditors: capybarato 1023536640@qq.com
 * @LastEditTime: 2024-06-11 16:55:11
 * @FilePath: \roadMapPro\src\stores\roadmap.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
// 使用了nanostores库来创建可响应状态的原子变量（atoms）和计算属性（computed）
// atom用于创建一个可响应的状态变量，而computed则用于创建基于其他状态变量的计算属性
import { atom, computed } from 'nanostores';
import type { GetRoadmapResponse } from '../components/CustomRoadmap/CustomRoadmap';

export const currentRoadmap = atom<GetRoadmapResponse | undefined>(undefined);

// 判断当前的路线图是否是个人的，不是团队的
export const isCurrentRoadmapPersonal = computed(
  currentRoadmap,
  // (roadmap) => !roadmap?.teamId, 
  (roadmap) => roadmap = roadmap, 
  // 如果roadmap存在并且没有teamId属性，或者roadmap为undefined，则返回true，表示当前路线图是个人的
);

// 是否可以管理当前的路线图
export const canManageCurrentRoadmap = computed(
  currentRoadmap,
  (roadmap) => roadmap?.canManage,
);

// 原子变量 状态封装，不可变
// 原子变量 对象包含三个属性 学习进度属性
export const roadmapProgress = atom<
  { done: string[]; learning: string[]; skipped: string[] } | undefined
>();

// 原子变量 节点总数
export const totalRoadmapNodes = atom<number | undefined>();
