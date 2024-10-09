/*
 * @Author: capybarato 1023536640@qq.com
 * @Date: 2024-07-19 17:13:28
 * @LastEditors: capybarato 1023536640@qq.com
 * @LastEditTime: 2024-10-08 19:48:25
 * @FilePath: \roadMapPro\src\lib\open-graph
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
type RoadmapOpenGraphQuery = {
  group: 'roadmap' | 'guide' | 'best-practice';
  resourceId: string;
};

// 'http://localhost:3000'
export function getOpenGraphImageUrl(params: RoadmapOpenGraphQuery) {
  return `${import.meta.env.DEV ? 'http://localhost:4321' : 'https://localhost:4321'}/og/${params.group}/${params.resourceId}`;
}

export async function getDefaultOpenGraphImageBuffer() {
  const defaultImageUrl = `${import.meta.env.DEV ? 'http://localhost:4321' : 'https://localhost:4321'}/images/og-img.png`;
  return fetch(defaultImageUrl).then((response) => response.arrayBuffer());
}

export async function getResourceOpenGraph(
  type: 'roadmap' | 'guide' | 'best-practice',
  resourceId: string,
) {
  const url = new URL(`${import.meta.env.PUBLIC_API_URL}/v1-open-graph`);
  url.searchParams.set('type', type);
  url.searchParams.set('resourceId', resourceId);
  url.searchParams.set('variant', 'image');
  const response = await fetch(url.toString());

  return response.text();
}
