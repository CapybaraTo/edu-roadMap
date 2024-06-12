/*
 * @Author: capybarato 1023536640@qq.com
 * @Date: 2024-06-11 10:49:06
 * @LastEditors: capybarato 1023536640@qq.com
 * @LastEditTime: 2024-06-11 10:56:24
 * @FilePath: \roadMapPro\src\api\ai-roadmap.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { type APIContext } from 'astro'
// api.ts提供了一组用于发起HTTP请求的函数和类型定义
import { api } from './api.ts'

export type GETAIRoadmapBySlugResponse = {
  id:string;
  term:string;
  title:string;
  data:string;
  isAuthenticatedUser:boolean;
}