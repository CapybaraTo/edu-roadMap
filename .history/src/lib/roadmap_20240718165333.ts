/*
 * @Author: capybarato 1023536640@qq.com
 * @Date: 2024-07-18 16:05:20
 * @LastEditors: capybarato 1023536640@qq.com
 * @LastEditTime: 2024-07-18 16:45:25
 * @FilePath: \roadMapPro\src\lib\roadmap.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
// 处理与“路线图”（roadmap）相关的内容和数据
import type { MarkdownFileType } from './file.ts';

// id中的小写改为标题里的大写
// 将 id 字符串分割为单词数组，将每个单词的首字母大写，然后重新组合成一个标题化的字符串。
export function resourceTitleFromId(id: string): string {
  if (id === 'devops') {
    return 'DevOps';
  }
  return id
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

// 允许的路线图渲染器
export type AllowedRoadmapRenderer = 'balsamiq' | 'editor';

// 接口定义了路线图文件的元数据
export interface RoadmapFrontmatter {
  pdfUrl: string;  // PDF链接
  order: number;  // 排序
  briefTitle: string;  // 标题
  briefDescription: string;  // 描述
  title: string;  // 标题
  description: string;  // 描述
  hasTopics: boolean;  // 是否含有主题
  isForkable?: boolean;  // 是否可分叉
  isHidden: boolean;  //是否隐藏
  isNew: boolean;  // 是否为新内容
  isUpcoming: boolean;  // 即将到来的内容
  tnsBannerLink?: string;   // 
  note?: string;
  question?: {
    title: string;
    description: string;
  };
  dimensions?: {   // 尺寸信息
    width: number;
    height: number;
  };
  seo: {   // SEO相关元数据
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
  relatedRoadmaps: string[];   // 相关路线图
  relatedQuestions: string[];  //相关的问题
  sitemap: {
    priority: number;
    changefreq: string;
  };
  tags: string[];
  renderer?: AllowedRoadmapRenderer;
}

// RoadmapFileType 类型是 MarkdownFileType 的泛型版本，并且增加了一个 id 属性
export type RoadmapFileType = MarkdownFileType<RoadmapFrontmatter> & {
  id: string;
};

// 路线图路径到ID的转换函数
function roadmapPathToId(filePath: string): string {
  const fileName = filePath.split('/').pop() || '';
  return fileName.replace('.md', '');
}

/**
 * Gets the IDs of all the roadmaps available on the website
 *
 * @returns string[] Array of roadmap IDs
 */
// getRoadmapIds 异步函数使用 import.meta.glob 加载所有 .md 文件，并返回一个包含这些文件的 ID 数组
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
// getRoadmapsByTag 异步函数接受一个 tag 字符串参数，获取所有带有该标签的路线图文件，并按顺序排序。
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
// getRoadmapById 异步函数接受一个 id 字符串参数，根据 ID 获取相应的路线图文件。
export async function getRoadmapById(id: string): Promise<RoadmapFileType> {
  const roadmapFilesMap: Record<string, RoadmapFileType> =
    import.meta.glob<RoadmapFileType>('/src/data/roadmaps/*/*.md', {
      eager: true,
    });
  const roadmapFile = Object.values(roadmapFilesMap).find((roadmapFile) => {
    return roadmapPathToId(roadmapFile.file) === id;
  });
  if (!roadmapFile) {
    throw new Error(`路线图 with ID ${id} not found`);
  }
  return {
    ...roadmapFile,
    id: roadmapPathToId(roadmapFile.file),
  };
}

// 按ID列表获取路线图文件的函数
export async function getRoadmapsByIds(
  ids: string[],
): Promise<RoadmapFileType[]> {
  if (!ids?.length) {
    return [];
  }
  return Promise.all(ids.map((id) => getRoadmapById(id)));
}

// 获取路线图常见问题解答的函数
export async function getRoadmapFaqsById(roadmapId: string): Promise<string[]> {
  const { faqs } = await import(
    `../data/roadmaps/${roadmapId}/faqs.astro`
  ).catch(() => ({}));

  return faqs || [];
}
