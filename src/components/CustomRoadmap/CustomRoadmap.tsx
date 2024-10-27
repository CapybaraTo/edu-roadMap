/*
 * @Author: capybarato 1023536640@qq.com
 * @Date: 2024-10-27 15:05:49
 * @LastEditors: capybarato 1023536640@qq.com
 * @LastEditTime: 2024-10-27 15:07:32
 * @FilePath: \roadMapPro\src\components\CustomRoadmap\CustomRoadmap
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { useEffect, useState } from 'react';
import { getUrlParams } from '../../lib/browser';
import { type AppError, type FetchError, httpGet } from '../../lib/http';
// import { RoadmapHeader } from './RoadmapHeader';
import { TopicDetail } from '../TopicDetail/TopicDetail';
// import type { RoadmapDocument } from './CreateRoadmap/CreateRoadmapModal';
// import { currentRoadmap } from '../../stores/roadmap';
// import { RestrictedPage } from './RestrictedPage';
// import { FlowRoadmapRenderer } from './FlowRoadmapRenderer';

export const allowedLinkTypes = [
  'video',
  'article',
  'opensource',
  'course',
  'website',
  'podcast',
  'roadmap.sh',
  'official',
  'roadmap',
  'feed',
] as const;

export type AllowedLinkTypes = (typeof allowedLinkTypes)[number];

export interface RoadmapContentDocument {
  _id?: string;
  roadmapId: string;
  nodeId: string;
  title: string;
  description: string;
  links: {
    id: string;
    type: AllowedLinkTypes;
    title: string;
    url: string;
  }[];
}

export type CreatorType = {
  id: string;
  name: string;
  avatar: string;
};

export function hideRoadmapLoader() {
  const loaderEl = document.querySelector(
    '[data-roadmap-loader]',
  ) as HTMLElement;
  if (loaderEl) {
    loaderEl.remove();
  }
}

type CustomRoadmapProps = {
  isEmbed?: boolean;
  slug?: string;
};

