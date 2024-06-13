/*
 * @Author: capybarato 1023536640@qq.com
 * @Date: 2024-06-13 15:01:21
 * @LastEditors: capybarato 1023536640@qq.com
 * @LastEditTime: 2024-06-13 15:16:21
 * @FilePath: \roadMapPro\src\components\CustomRoadmap\RoadmapHint.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { cn } from '../../lib/classname';
import { ResourceProgressStats } from './ResourceProgressStats.tsx';   // 显示资源（可能是课程、路线图等）的进度统计信息的组件

type RoadmapHintProps = {
  roadmapId: string;     // 路线图ID
  roadmapTitle: string;    // 路线图标题
  hasTNSBanner?: boolean;  // 是否显示TheNewStack的横幅
  tnsBannerLink?: string;  // TheNewStack横幅链接
};

export function RoadmapHint(props: RoadmapHintProps) {
  const {
    roadmapTitle,
    roadmapId,
    hasTNSBanner = false,
    tnsBannerLink = '',
  } = props;   // 解构赋值从 props 中提取 roadmapTitle、roadmapId、hasTNSBanner 和 tnsBannerLink

  // 返回JSX元素
  // 整个组件的输出是一个包含可能的横幅和资源进度统计的容器
  // 如果 hasTNSBanner 为 true，则渲染一个包含TheNewStack横幅的 <div>，其中包含一个指向 tnsBannerLink 的链接
  // 渲染 ResourceProgressStats 组件，传递 isSecondaryBanner、resourceId 和 resourceType 作为属性。
  return (
    <div
      className={cn('mb-0 mt-4 rounded-md border-0 sm:mt-7 sm:border', {
        'sm:-mb-[82px]': hasTNSBanner,
        'sm:-mb-[65px]': !hasTNSBanner,
      })}
    >
      
      {/* {hasTNSBanner && (
        <div className="hidden border-b bg-gray-100 px-2 py-1.5 sm:block">
          <p className="text-sm">
            Get the latest {roadmapTitle} news from our sister site{' '}
            <a
              href={tnsBannerLink}
              target="_blank"
              className="font-semibold underline"
            >
              TheNewStack.io
            </a>
          </p>
        </div>
      )} */}

      <ResourceProgressStats
        isSecondaryBanner={hasTNSBanner}
        resourceId={roadmapId}
        resourceType="roadmap"
      />
    </div>
  );
}
