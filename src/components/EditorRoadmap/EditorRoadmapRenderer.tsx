import { useCallback, useEffect, useRef } from 'react';     // REACT钩子
import './EditorRoadmapRenderer.css';    // 路线图渲染样式
import {
  renderResourceProgress,
  updateResourceProgress,
  type ResourceProgressType,
  renderTopicProgress,
  refreshProgressCounters,
} from '../../lib/resource-progress';      // 资源学习进展  进度条
import { pageProgressMessage } from '../../stores/page';    //  定义了一个名为 pageProgressMessage 的原子状态,存储页面进度信息的消息
// 导入Toast通知函数
import { useToast } from '../../hooks/use-toast';
// 导入reactflow库中定义的节点和边的类型
import type { Edge, Node } from 'reactflow';    
import { Renderer } from '../../../editor/renderer';    // 渲染器安装说明
import { slugify } from '../../lib/slugger.ts';    //字符串转换URL
import { isLoggedIn } from '../../lib/jwt';    // 检查用户是否登录
import { showLoginPopup } from '../../lib/popup.ts';    // 显示登录弹窗的函数

// 定义组件属性类型 
export type RoadmapRendererProps = {
  resourceId: string;  // 资源ID
  nodes: Node[];   // 节点数组
  edges: Edge[];   // 边数组
  dimensions: { 
    width: number;  // 宽度
    height: number; // 高度
  };
};

// 定义节点详情类型
type RoadmapNodeDetails = {
  nodeId: string;   //节点ID
  nodeType: string;    //节点类型
  targetGroup: SVGElement;    //目标SVG元素
  title?: string;   //节点标题
};

// 用于获取SVG元素的节点详情
function getNodeDetails(svgElement: SVGElement): RoadmapNodeDetails | null {
  // 使用最近父元素查询来获取节点所属的分组元素
  const targetGroup = (svgElement?.closest('g') as SVGElement) || {};
  // 从数据属性中获取节点ID和类型
  const nodeId = targetGroup?.dataset?.nodeId;
  const nodeType = targetGroup?.dataset?.type;
  const title = targetGroup?.dataset?.title;
  if (!nodeId || !nodeType) {
    return null;
  }
// 返回节点详情对象
  return { nodeId, nodeType, targetGroup, title };
}

// 定义允许的节点类型数组
const allowedNodeTypes = [
  'topic',
  'subtopic',
  'button',
  'link-item',
  'resourceButton',
  'todo',
  'todo-checkbox',
  'checklist-item',
];

// 本组件的实现
export function EditorRoadmapRenderer(props: RoadmapRendererProps) {
  // 解构赋值获取props属性
  const { resourceId, nodes = [], edges = [] } = props;
  // 使用useRef Hook引用DOM元素
  const roadmapRef = useRef<HTMLDivElement>(null);

  const toast = useToast();

  // 更新主题状态的异步函数
  async function updateTopicStatus(
    topicId: string,
    newStatus: ResourceProgressType,
  ) {
    // 设置页面进度信息
    pageProgressMessage.set('正在更新进度');
    // 更新资源进度，并处理成功或失败的结果
    updateResourceProgress(
      {
        resourceId,
        resourceType: 'roadmap',
        topicId,
      },
      newStatus,
    )
      .then(() => {
        renderTopicProgress(topicId, newStatus);
      })
      .catch((err) => {
        toast.error('Something went wrong, please try again.');
        console.error(err);
      })
      .finally(() => {
        pageProgressMessage.set('');
        refreshProgressCounters();
      });

    return;
  }

  // 优化性能，避免不必要的重新渲染
  const handleSvgClick = useCallback((e: MouseEvent) => {
    // 获取点击事件的SVG元素
    const target = e.target as SVGElement;
    const { nodeId, nodeType, targetGroup, title } =
      getNodeDetails(target) || {};

      // 检查是否获取到了节点ID、类型，并确保类型是允许的
    if (!nodeId || !nodeType || !allowedNodeTypes.includes(nodeType)) {
      return;
    }

    // 处理按钮或链接项的点击事件
    if (nodeType === 'button' || nodeType === 'link-item' || nodeType === 'resourceButton') {
      // 根据数据属性获取链接，并判断是否为外链
      const link = targetGroup?.dataset?.link || '';
      const isExternalLink = link.startsWith('http');
      if (isExternalLink) {
        window.open(link, '_blank');
      } else {
        window.location.href = link;
      }
      return;
    }

    // 处理主题状态的变更
    const isCurrentStatusLearning = targetGroup?.classList.contains('learning');   //学习状态
    const isCurrentStatusSkipped = targetGroup?.classList.contains('skipped');   //跳过状态

    if (nodeType === 'todo-checkbox') {
      e.preventDefault();
      if (!isLoggedIn()) {
        showLoginPopup();
        return;
      }

      const newStatus = targetGroup?.classList.contains('done')
        ? 'pending'
        : 'done';
      updateTopicStatus(nodeId, newStatus);
      return;
    }


    // 使用Shift键点击时更新主题状态
    if (e.shiftKey) {
      e.preventDefault();
      if (!isLoggedIn()) {
        showLoginPopup();
        return;
      }

      updateTopicStatus(
        nodeId,
        isCurrentStatusLearning ? 'pending' : 'learning',
      );
      return;
    } else if (e.altKey) {
      // 使用Alt键点击时更新主题状态
      e.preventDefault();
      if (!isLoggedIn()) {
        showLoginPopup();
        return;
      }

      updateTopicStatus(nodeId, isCurrentStatusSkipped ? 'pending' : 'skipped');
      return;
    }

        // for the click on rect of checklist-item
    if (nodeType === 'checklist-item' && target.tagName === 'rect') {
      e.preventDefault();
      if (!isLoggedIn()) {
        showLoginPopup();
        return;
      }
    
      const newStatus = targetGroup?.classList.contains('done')
        ? 'pending'
        : 'done';
      updateTopicStatus(nodeId, newStatus);
      return;
    }


    // we don't have the topic popup for checklist-item
    if (nodeType === 'checklist-item') {
      return;
    }

    // 如果点击的不是按钮或链接项，且有标题，则派发自定义事件
    if (!title) {
      return;
    }
    const detailsPattern = `${slugify(title)}@${nodeId}`;
    window.dispatchEvent(
      new CustomEvent('roadmap.node.click', {
        detail: {
          topicId: detailsPattern,
          resourceId,
          resourceType: 'roadmap',
        },
      }),
    );
  }, []);

  // 处理右键点击SVG元素的事件
  const handleSvgRightClick = useCallback((e: MouseEvent) => {
    e.preventDefault();   // 阻止默认的上下文菜单显示

    // 同上，获取点击的SVG元素的节点详情
    const target = e.target as SVGElement;
    const { nodeId, nodeType, targetGroup } = getNodeDetails(target) || {};
    if (!nodeId || !nodeType || !allowedNodeTypes.includes(nodeType)) {
      return;
    }

    // 如果节点类型是'button'，则不处理
    if (nodeType === 'button') {
      return;
    }

    // 如果用户未登录，则显示登录弹窗
    if (!isLoggedIn()) {
      showLoginPopup();
      return;
    }
    // 更新主题状态为完成或未完成
    const isCurrentStatusDone = targetGroup?.classList.contains('done');
    updateTopicStatus(nodeId, isCurrentStatusDone ? 'pending' : 'done');
  }, []);

  useEffect(() => {
     // 如果ref指向的DOM元素存在，添加点击和右键点击事件监听
    if (!roadmapRef?.current) {
      return;
    }
    roadmapRef?.current?.addEventListener('click', handleSvgClick);
    roadmapRef?.current?.addEventListener('contextmenu', handleSvgRightClick);
// 组件卸载时移除事件监听
    return () => {
      roadmapRef?.current?.removeEventListener('click', handleSvgClick);
      roadmapRef?.current?.removeEventListener(
        'contextmenu',
        handleSvgRightClick,
      );
    };
  }, []);
 // 返回渲染的React元素
  return (
    <Renderer
      ref={roadmapRef}
      roadmap={{ nodes, edges }}
      onRendered={() => {
        roadmapRef.current?.setAttribute('data-renderer', 'editor');
        renderResourceProgress('roadmap', resourceId).finally();
      }}
    />
  );
}
