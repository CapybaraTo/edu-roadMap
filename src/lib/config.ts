/*
 * @Author: capybarato 1023536640@qq.com
 * @Date: 2024-07-18 16:50:43
 * @LastEditors: capybarato 1023536640@qq.com
 * @LastEditTime: 2024-07-18 16:51:55
 * @FilePath: \roadMapPro\src\lib\config
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
// Footer部分的内容
export const siteConfig = {
  title: "Roadmaps to becoming a modern developer",
  description:
    "Community driven roadmaps, articles and guides for developers to grow in their career.",
  url: {
    twitter: "https://twitter.com/roadmapsh",
    youtube: "https://youtube.com/theroadmap?sub_confirmation=1",
    repo: "https://github.com/kamranahmedse/developer-roadmap",
    contribute:
      "https://github.com/kamranahmedse/developer-roadmap/tree/master/contributing.md",
    issue: "https://github.com/kamranahmedse/developer-roadmap/issues/new",
  },
  keywords: [
    "roadmap",
    "developer roadmaps",
    "developer roadmap",
    "how to become a developer",
    ...[
      "frontend developer",
      "backend developer",
      "sre",
      "devops",
      "android developer",
      "dba",
      "blockchain developer",
      "qa",
      "qa engineer",
      "software architect",
      "asp.net core developer",
      "react developer",
      "angular developer",
      "vue developer",
      "test developer",   //
      "ai-test developer", //
      "node.js developer",
      "javascript developer",
      "python developer",
      "go developer",
      "java developer",
      "design system",
      "software design",
      "graphql",
    ].flatMap((roadmapKeyword) => [
      `${roadmapKeyword} roadmap`,
      `${roadmapKeyword} roadmap 2023`,
    ]),
  ],
};
