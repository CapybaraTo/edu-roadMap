// 显示和编辑路线图的React组件
import { useEffect, useState, type CSSProperties } from 'react';     // react钩子
import {
  EditorRoadmapRenderer,
  type RoadmapRendererProps,
} from './EditorRoadmapRenderer.tsx';      // 渲染路线SVG图像的渲染器
import { Spinner } from '../ReactIcons/Spinner';   // 旋转图标
import type { ResourceType } from '../../lib/resource-progress';    // 进度
import { httpGet } from '../../lib/http';   // HTTP请求
import { ProgressNudge } from '../FrameRenderer/ProgressNudge.tsx';    // 进度显示组件

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
  const [isLoading, setIsLoading] = useState(true);
  const [roadmapData, setRoadmapData] = useState<
    Omit<RoadmapRendererProps, 'resourceId'> | undefined
  >(undefined);

  // loadRoadmapData是一个异步函数，用于从服务器加载路线图数据。
  // 如果加载成功，将数据存储到roadmapData状态中，并更新isLoading状态为false。
  const loadRoadmapData = async () => {
    setIsLoading(true);
    const { response, error } = await httpGet<
      Omit<RoadmapRendererProps, 'resourceId'>
    >(`/${resourceId}.json`);

    if (error) {
      console.error(error);
      return;
    }

    setRoadmapData(response);
    setIsLoading(false);
  };

  // 当resourceId变化时重新加载数据
  useEffect(() => {
    loadRoadmapData().finally();
  }, [resourceId]);

  // 如果isLoading为true或roadmapData未定义，则显示加载中的Spinner组件
  // 渲染EditorRoadmapRenderer组件，传入路线图数据和其他必要属性，并在下方显示ProgressNudge组件以显示进度
  if (!roadmapData || isLoading) {
    return (
      <div
        style={
          {
            '--aspect-ratio': dimensions.width / dimensions.height,
          } as CSSProperties
        }
        className="flex aspect-[var(--aspect-ratio)] w-full justify-center"
      >
        <div className="flex w-full justify-center">
          <Spinner
            innerFill="#2563eb"
            outerFill="#E5E7EB"
            className="h-6 w-6 animate-spin sm:h-12 sm:w-12"
          />
        </div>
      </div>
    );
  }

  return (
    <div
      style={
        {
          '--aspect-ratio': dimensions.width / dimensions.height,
        } as CSSProperties
      }
      className="flex aspect-[var(--aspect-ratio)] w-full justify-center"
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
