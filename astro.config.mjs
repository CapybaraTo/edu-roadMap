/*
 * @Author: capybarato 1023536640@qq.com
 * @Date: 2024-06-07 15:47:31
 * @LastEditors: capybarato 1023536640@qq.com
 * @LastEditTime: 2024-06-14 09:07:06
 * @FilePath: \roadMapPro\astro.config.mjs
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";

import react from "@astrojs/react";

// https://astro.build/config
export default defineConfig({
  experimental: {
    rewriting: true,
  },
  
  integrations: [
    tailwind({
    config: {
      // 不自动应用基础样式
      applyBaseStyles: false
    }
  })
  // sitemap(),
  , react()]
});