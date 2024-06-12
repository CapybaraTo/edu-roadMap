/*
 * @Author: capybarato 1023536640@qq.com
 * @Date: 2024-06-07 15:59:12
 * @LastEditors: capybarato 1023536640@qq.com
 * @LastEditTime: 2024-06-11 10:36:28
 * @FilePath: \roadMapPro\tailwind.config.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      typography: {
        quoteless: {
          css: {
            "blockquote p:first-of-type::before": { content: "none" },
            "blockquote p:first-of-type::after": { content: "none" },
          },
        },
        keyframes: {
          "fade-slide-up": {
            "0%": {
              opacity: "0",
              transform:
                "translateX(var(--tw-translate-x, 0)) translateY(20px)",
            },
            "100%": {
              opacity: "1",
              transform: "translateX(var(--tw-translate-x, 0)) translateY(0)",
            },
          },
          "fade-in": {
            "0%": {
              opacity: "0",
            },
            "100%": {
              opacity: "1",
            },
          },
        },
        animation: {
          "fade-slide-up":
            "fade-slide-up 0.2s cubic-bezier(0.4, 0, 0.2, 1) forwards",
          "fade-in": "fade-in 0.2s cubic-bezier(0.4, 0, 0.2, 1) forwards",
        },
      },
      container: {
        center: true,
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
