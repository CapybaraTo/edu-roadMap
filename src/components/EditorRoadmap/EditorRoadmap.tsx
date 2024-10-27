/*
 * @Author: capybarato 1023536640@qq.com
 * @Date: 2024-07-19 16:19:35
 * @LastEditors: capybarato 1023536640@qq.com
 * @LastEditTime: 2024-10-25 21:40:41
 * @FilePath: \roadMapPro\src\components\EditorRoadmap\EditorRoadmap.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
// 显示和编辑路线图的React组件
import { useEffect, useState, type CSSProperties } from 'react';     // react钩子
import {
  EditorRoadmapRenderer,
  type RoadmapRendererProps,
} from './EditorRoadmapRenderer.tsx';      // 渲染路线SVG图像的渲染器
import { Spinner } from '../ReactIcons/Spinner';   // 旋转图标
import {
  clearMigratedRoadmapProgress,
  type ResourceType,
} from '../../lib/resource-progress';   // 进度
import { httpGet } from '../../lib/http';   // HTTP请求
import { ProgressNudge } from '../FrameRenderer/ProgressNudge.tsx';    // 进度显示组件
import { getUrlParams } from '../../lib/browser.ts';

type EditorRoadmapProps = {
  resourceId: string;
  resourceType?: ResourceType;
  dimensions: {
    width: number;
    height: number;
  };
};

export function EditorRoadmap(props: EditorRoadmapProps) {
  const { resourceId, resourceType = 'roadmap', dimensions } = props;

  const [hasSwitchedRoadmap, setHasSwitchedRoadmap] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [roadmapData, setRoadmapData] = useState<
    Omit<RoadmapRendererProps, 'resourceId'> | undefined
  >(undefined);

  // loadRoadmapData是一个异步函数，用于从服务器加载路线图数据。
  // 如果加载成功，将数据存储到roadmapData状态中，并更新isLoading状态为false。
  const loadRoadmapData = async () => {
    setIsLoading(true);
    const { r: switchRoadmapId } = getUrlParams();

    const { response, error } = await httpGet<
      Omit<RoadmapRendererProps, 'resourceId'>
    >(`/${switchRoadmapId || resourceId}.json`);

    if (error) {
      console.error(error);
      return;
    }

    setRoadmapData(response);
    setIsLoading(false);
    setHasSwitchedRoadmap(!!switchRoadmapId);
  };

  // 当resourceId变化时重新加载数据
  useEffect(() => {
    clearMigratedRoadmapProgress(resourceType, resourceId);    //清除之前的记录
    loadRoadmapData().finally();
  }, [resourceId]);

  const aspectRatio = dimensions.width / dimensions.height;

  // 如果isLoading为true或roadmapData未定义，则显示加载中的Spinner组件
  // 渲染EditorRoadmapRenderer组件，传入路线图数据和其他必要属性，并在下方显示ProgressNudge组件以显示进度
  if (!roadmapData || isLoading) {
    return (
      <div
        style={
          !hasSwitchedRoadmap
          ?({
            '--aspect-ratio': aspectRatio,
          } as CSSProperties)
          : undefined
        }
        className={'mt-5 flex aspect-[var(--aspect-ratio)] w-full flex-col justify-center'}
      >
        <div className="flex w-full justify-center">
          <Spinner
           className="h-6 w-6 animate-spin sm:h-12 sm:w-12"
           isDualRing={false}
          />
        </div>
      </div>
    );
  }

  return (
    <div
      style={
        !hasSwitchedRoadmap
        ? ({
          '--aspect-ratio': dimensions.width / dimensions.height,
        } as CSSProperties)
        : undefined
      }
      className={
        'mt-5 flex aspect-[var(--aspect-ratio)] w-full flex-col justify-center'
      }
    >
      <EditorRoadmapRenderer
        {...roadmapData}
        dimensions={dimensions}
        resourceId={resourceId}
      />
      <ProgressNudge resourceId={resourceId} resourceType={resourceType} />
    </div>
  );
}
