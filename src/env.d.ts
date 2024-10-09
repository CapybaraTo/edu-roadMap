/*
 * @Author: capybarato 1023536640@qq.com
 * @Date: 2024-06-07 15:47:31
 * @LastEditors: capybarato 1023536640@qq.com
 * @LastEditTime: 2024-10-08 20:49:05
 * @FilePath: \roadMapPro\src\env.d.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

interface ImportMetaEnv {
  GITHUB_SHA: string;
  PUBLIC_API_URL: string;
  PUBLIC_APP_URL: string;
  PUBLIC_AVATAR_BASE_URL: string;
  PUBLIC_EDITOR_APP_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
