// reactr编写的一些组件  功能是加载和显示一个路线图
// 从 react 导入了 useEffect 和 useState 钩子，用于处理副作用和状态管理
import { useEffect, useState } from 'react';
import { getUrlParams } from '../../lib/browser';
import { type AppError, type FetchError, httpGet } from '../../lib/http';
import { RoadmapHeader } from './RoadmapHeader';
import { TopicDetail } from '../TopicDetail/TopicDetail';
// import type { RoadmapDocument } from './CreateRoadmap/CreateRoadmapModal';    // 自定义路径图 自己创建
import { currentRoadmap } from '../../stores/roadmap';
import { RestrictedPage } from './RestrictedPage';
import { FlowRoadmapRenderer } from './FlowRoadmapRenderer';

// 定义了一个只读数组，含了允许的链接类型
export const allowedLinkTypes = [
  'video',      // 替换中国慕课
  'article',
  'opensource',
  'course',
  'website',
  'podcast',
  'roadmap.sh',
  'official',
  'roadmap',
] as const;

// 索引
export type AllowedLinkTypes = (typeof allowedLinkTypes)[number];

// 定义了路线图内容文档的结构
export interface RoadmapContentDocument {
  _id?: string;
  roadmapId: string;  // 路线图ID
  nodeId: string;     // 节点ID
  title: string;      // 题目
  description: string;// 描述
  links: {             //连接线
    id: string;
    type: AllowedLinkTypes;   //连接线类型
    title: string;
    url: string;
  }[];
}

// 描述创建者的类型
export type CreatorType = {
  id: string;
  name: string;
  avatar: string;
};

// 结合了 RoadmapDocument路线图文档 和其他属性
// export type GetRoadmapResponse = RoadmapDocument & {
//   canManage: boolean;
//   creator?: CreatorType;
//   team?: CreatorType;
// };

// 用于移除页面上的加载器元素
export function hideRoadmapLoader() {
  const loaderEl = document.querySelector(
    '[data-roadmap-loader]',
  ) as HTMLElement;
  if (loaderEl) {
    loaderEl.remove();
  }
}

// 定义了 CustomRoadmap 组件的属性
type CustomRoadmapProps = {
  isEmbed?: boolean;
  slug?: string;
};

// 是一个 React 组件，用于根据提供的属性加载和显示一个路线图
export function CustomRoadmap(props: CustomRoadmapProps) {
  // isEmbed属性用来指示当前的路线图是否应该以嵌入式的方式显示。在网页中，嵌入式通常意味着内容可以被放置在另一个页面或框架中，而不是作为一个独立的页面显示。
  // slug 通常用于表示一个资源的简短、易读的标识符
  const { isEmbed = false, slug } = props;

  const { id, secret } = getUrlParams() as { id: string; secret: string };

  // useState 钩子定义了三个状态变量.
  const [isLoading, setIsLoading] = useState(true);  // 追踪加载状态
  const [roadmap, setRoadmap] = useState<GetRoadmapResponse | null>(null);   // 存储获取的路线图数据
  const [error, setError] = useState<AppError | FetchError | undefined>();   // 用于存储可能发生的错误

  // 定义了一个异步函数 getRoadmap，用于从后端 API 获取路线图数据
  async function getRoadmap() {
    setIsLoading(true);   // 设置isLoading为true

    //  根据 slug 或 id 构建请求 URL
    const roadmapUrl = slug
      ? new URL(
          `${import.meta.env.PUBLIC_API_URL}/v1-get-roadmap-by-slug/${slug}`,
        )
      : new URL(`${import.meta.env.PUBLIC_API_URL}/v1-get-roadmap/${id}`);

      // 如果存在一个 secret 值，就将其作为一个查询参数添加到请求 URL 中
      // 例如，如果 secret 的值为 "mysecret"，并且原始 URL 是 "http://example.com/api/roadmap/123"，添加查询参数后的 URL 将会是：http://example.com/api/roadmap/123?secret=mysecret
    if (secret) {
      roadmapUrl.searchParams.set('secret', secret);
    }

    // 使用 httpGet 函数发起 GET 请求，获取响应或错误
    const { response, error } = await httpGet<GetRoadmapResponse>(
      roadmapUrl.toString(),
    );

    // 如果有错误或没有响应，则设置 error 并结束加载
    if (error || !response) {
      setError(error);
      setIsLoading(false);
      return;
    }

    // 如果成功获取数据，则更新文档标题
    document.title = `${response.title} - roadmap.sh`;

    // 并使用 setRoadmap 和 currentRoadmap.set 更新状态
    setRoadmap(response);
    currentRoadmap.set(response);
    setIsLoading(false);
  }

  //  useEffect 钩子  是react里的一个钩子  副作用包括如计时器、监听、订阅等，接近于 Vue 中的 mounted 钩子
  // 在组件加载时调用 getRoadmap 函数，并在完成时调用 hideRoadmapLoader 函数隐藏加载器。
  useEffect(() => {
    getRoadmap().finally(() => {
      hideRoadmapLoader();
    });
  }, []);

  // 如果 isLoading 为 true，则组件返回 null，表示正在加载
  if (isLoading) {
    return null;
  }

  // 如果有 error，则渲染 RestrictedPage 组件并传递错误信息。
  if (error) {
    return <RestrictedPage error={error} />;
  }

  // 如果没有加载和错误，组件将渲染以下 JSX 结构
  // 渲染 FlowRoadmapRenderer 组件，传入 isEmbed 和路线图数据 roadmap。
  // 渲染 TopicDetail 组件，传入路线图的标题、资源类型、是否为嵌入式视图和是否允许提交贡献的布尔值。
  return (
    <>
      {!isEmbed && <RoadmapHeader />}
      <FlowRoadmapRenderer isEmbed={isEmbed} roadmap={roadmap!} />
      <TopicDetail
        resourceTitle={roadmap!.title}
        resourceType="roadmap"
        isEmbed={isEmbed}
        canSubmitContribution={false}
      />
    </>
  );
}
