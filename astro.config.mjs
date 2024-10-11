/*
 * @Author: capybarato 1023536640@qq.com
 * @Date: 2024-06-07 14:54:16
 * @LastEditors: capybarato 1023536640@qq.com
 * @LastEditTime: 2024-10-10 12:49:23
 * @FilePath: \developer-roadmap\astro.config.mjs
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
// https://astro.build/config
import sitemap from '@astrojs/sitemap';  
import tailwind from '@astrojs/tailwind';  // 集成Tailwind CSS框架
import node from '@astrojs/node';
import { defineConfig } from 'astro/config';
import rehypeExternalLinks from 'rehype-external-links'; //处理Markdown文件中的外部链接
import { serializeSitemap, shouldIndexPage } from './sitemap.mjs';
import react from '@astrojs/react'; //导入React集成，使Astro可以渲染React组件

// https://astro.build/config
export default defineConfig({
  site: 'https://localhost:4321/',
  experimental: {
    rewriting: true,
  },
  markdown: {
    shikiConfig: {
      // 配置了代码高亮主题为 "dracula"
      theme: 'dracula',
    },
    rehypePlugins: [
      [
        rehypeExternalLinks,
        // 插件，用于自动为所有外部链接添加特定的HTML属性。这里定义了一个函数，当链接不符合白名单规则时，添加 rel="noopener noreferrer nofollow" 属性。
        {
          target: '_blank',
          rel: function (element) {
            const href = element.properties.href;
            const whiteListedStarts = [
              '/',
              '#',
              'mailto:',
              'https://github.com/CapybaraTo/edu-roadMap',
              'https://localhost:4321/',
            ];
            if (whiteListedStarts.some((start) => href.startsWith(start))) {
              return [];
            }
            return 'noopener noreferrer nofollow';
          },
        },
      ],
    ],
  },
  output: 'hybrid',
  adapter: node({
    mode: 'standalone',
  }),
  // 设置为 never，意味着生成的URL不会带有尾随斜杠
  trailingSlash: 'never',
  integrations: [
    tailwind({
      config: {
        applyBaseStyles: false,
      },
    }),
      sitemap({
        // 定义哪些页面应该被包含在站点地图   shouldIndexPage 函数
        filter: shouldIndexPage,
        // 定义了如何将页面信息转换为站点地图的格式    使用的是 serializeSitemap 函数
        serialize: serializeSitemap,
      }),
    react(),
  ],
  vite:{
    // mode: process.env.NODE_ENV,
    define: {
      'import.meta.env.PUBLIC_API_URL': JSON.stringify(process.env.VITE_PUBLIC_API_URL),
    },
    server: {
      proxy: {
        '/api': {
          target: 'http://localhost:8999',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ''),
        },
      },
    },
  }
});
