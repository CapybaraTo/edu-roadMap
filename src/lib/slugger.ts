/*
 * @Author: capybarato 1023536640@qq.com
 * @Date: 2024-07-19 16:31:04
 * @LastEditors: capybarato 1023536640@qq.com
 * @LastEditTime: 2024-07-19 16:31:27
 * @FilePath: \roadMapPro\src\lib\slugger.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
// 将任何给定的字符串转换为适合用在URL中的格式
const regex = /[^A-Za-z0-9_\- ]/g;
export function slugify(value: string): string {
  if (typeof value !== 'string') {
    return '';
  }

  return value.toLowerCase().replace(regex, '').trim().replace(/ /g, '-');
}
