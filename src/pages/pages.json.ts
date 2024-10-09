/*
 * @Author: capybarato 1023536640@qq.com
 * @Date: 2024-07-19 15:56:40
 * @LastEditors: capybarato 1023536640@qq.com
 * @LastEditTime: 2024-10-08 19:37:03
 * @FilePath: \roadMapPro\src\pages\pages.json.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
// Web服务端函数
// 定义了一个HTTP GET请求的处理函数GET，这个函数用于向客户端返回一些数据

// import { getAllBestPractices } from '../lib/best-practice';
// import { getAllGuides } from '../lib/guide';
import { getRoadmapsByTag } from '../lib/roadmap';
// import { getAllVideos } from '../lib/video';
import { getAllQuestionGroups } from '../lib/question-group';

export async function GET() {
  // const guides = await getAllGuides();
  // const videos = await getAllVideos();
  const questionGroups = await getAllQuestionGroups();
  const roadmaps = await getRoadmapsByTag('roadmap');
  // const bestPractices = await getAllBestPractices();

  return new Response(
    JSON.stringify([
      ...roadmaps.map((roadmap) => ({
        id: roadmap.id,
        url: `/${roadmap.id}`,
        title: roadmap.frontmatter.briefTitle,
        description: roadmap.frontmatter.briefDescription,
        group: 'Roadmaps',
        metadata: {
          tags: roadmap.frontmatter.tags,
        },
        renderer: roadmap?.frontmatter?.renderer || 'balsamiq',
      })),
      // ...bestPractices.map((bestPractice) => ({
      //   id: bestPractice.id,
      //   url: `/best-practices/${bestPractice.id}`,
      //   title: bestPractice.frontmatter.briefTitle,
      //   description: bestPractice.frontmatter.briefDescription,
      //   group: 'Best Practices',
      // })),
      ...questionGroups.map((questionGroup) => ({
        id: questionGroup.id,
        url: `/questions/${questionGroup.id}`,
        title: questionGroup.frontmatter.briefTitle,
        group: 'Questions',
      })),
      // ...guides.map((guide) => ({
      //   id: guide.id,
      //   url: guide.frontmatter.excludedBySlug
      //     ? guide.frontmatter.excludedBySlug
      //     : `/guides/${guide.id}`,
      //   title: guide.frontmatter.title,
      //   description: guide.frontmatter.description,
      //   authorId: guide.frontmatter.authorId,
      //   group: 'Guides',
      // })),
      // ...videos.map((video) => ({
      //   id: video.id,
      //   url: `/videos/${video.id}`,
      //   title: video.frontmatter.title,
      //   group: 'Videos',
      // })),
    ]),
    {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );
}
