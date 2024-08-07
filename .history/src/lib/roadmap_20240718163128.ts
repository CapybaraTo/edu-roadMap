/*
 * @Author: capybarato 1023536640@qq.com
 * @Date: 2024-07-18 16:05:20
 * @LastEditors: capybarato 1023536640@qq.com
 * @LastEditTime: 2024-07-18 16:31:28
 * @FilePath: \roadMapPro\src\lib\roadmap.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
// 处理与“路线图”（roadmap）相关的内容和数据
import type { MarkdownFileType } from './file';

export function resourceTitleFromId(id: string): string {
  if (id === 'devops') {
    return 'DevOps';
  }

  return id
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export type AllowedRoadmapRenderer = 'balsamiq' | 'editor';

export interface RoadmapFrontmatter {
  pdfUrl: string;
  order: number;
  briefTitle: string;
  briefDescription: string;
  title: string;
  description: string;
  hasTopics: boolean;
  isForkable?: boolean;
  isHidden: boolean;
  isNew: boolean;
  isUpcoming: boolean;
  tnsBannerLink?: string;
  note?: string;
  question?: {
    title: string;
    description: string;
  };
  dimensions?: {
    width: number;
    height: number;
  };
  seo: {
    title: string;
    description: string;
    ogImageUrl?: string;
    keywords: string[];
  };
  schema?: {
    headline: string;
    description: string;
    datePublished: string;
    dateModified: string;
    imageUrl: string;
  };
  relatedRoadmaps: string[];
  relatedQuestions: string[];
  sitemap: {
    priority: number;
    changefreq: string;
  };
  tags: string[];
  renderer?: AllowedRoadmapRenderer;
}

export type RoadmapFileType = MarkdownFileType<RoadmapFrontmatter> & {
  id: string;
};

function roadmapPathToId(filePath: string): string {
  const fileName = filePath.split('/').pop() || '';

  return fileName.replace('.md', '');
}

/**
 * Gets the IDs of all the roadmaps available on the website
 *
 * @returns string[] Array of roadmap IDs
 */
export async function getRoadmapIds() {
  const roadmapFiles = import.meta.glob<RoadmapFileType>(
    '/src/data/roadmaps/*/*.md',
    {
      eager: true,
    },
  );

  return Object.keys(roadmapFiles).map(roadmapPathToId);
}

/**
 * Gets the roadmap files which have the given tag assigned
 *
 * @param tag Tag assigned to roadmap
 * @returns Promisified RoadmapFileType[]
 */
export async function getRoadmapsByTag(
  tag: string,
): Promise<RoadmapFileType[]> {
  const roadmapFilesMap = import.meta.glob<RoadmapFileType>(
    '/src/data/roadmaps/*/*.md',
    {
      eager: true,
    },
  );

  const roadmapFiles: RoadmapFileType[] = Object.values(roadmapFilesMap);
  const filteredRoadmaps = roadmapFiles
    .filter((roadmapFile) => roadmapFile.frontmatter.tags.includes(tag))
    .map((roadmapFile) => ({
      ...roadmapFile,
      id: roadmapPathToId(roadmapFile.file),
    }));

  return filteredRoadmaps.sort(
    (a, b) => a.frontmatter.order - b.frontmatter.order,
  );
}

export async function getRoadmapById(id: string): Promise<RoadmapFileType> {
  const roadmapFilesMap: Record<string, RoadmapFileType> =
    import.meta.glob<RoadmapFileType>('/src/data/roadmaps/*/*.md', {
      eager: true,
    });

  const roadmapFile = Object.values(roadmapFilesMap).find((roadmapFile) => {
    return roadmapPathToId(roadmapFile.file) === id;
  });

  if (!roadmapFile) {
    throw new Error(`Roadmap with ID ${id} not found`);
  }

  return {
    ...roadmapFile,
    id: roadmapPathToId(roadmapFile.file),
  };
}

export async function getRoadmapsByIds(
  ids: string[],
): Promise<RoadmapFileType[]> {
  if (!ids?.length) {
    return [];
  }

  return Promise.all(ids.map((id) => getRoadmapById(id)));
}

export async function getRoadmapFaqsById(roadmapId: string): Promise<string[]> {
  const { faqs } = await import(
    `../data/roadmaps/${roadmapId}/faqs.astro`
  ).catch(() => ({}));

  return faqs || [];
}
