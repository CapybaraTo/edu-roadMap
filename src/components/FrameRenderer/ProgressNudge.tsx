/*
 * @Author: capybarato 1023536640@qq.com
 * @Date: 2024-07-19 16:36:22
 * @LastEditors: capybarato 1023536640@qq.com
 * @LastEditTime: 2024-07-23 16:43:33
 * @FilePath: \roadMapPro\src\components\FrameRenderer\ProgressNudge.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
// 进度显示组件
import { cn } from '../../lib/classname.ts';
import { roadmapProgress, totalRoadmapNodes } from '../../stores/roadmap.ts';
import { useStore } from '@nanostores/react';

type ProgressNudgeProps = {
  resourceType: 'roadmap' | 'best-practice';   //
  resourceId: string;
};

export function ProgressNudge(props: ProgressNudgeProps) {
  const $totalRoadmapNodes = useStore(totalRoadmapNodes);
  const $roadmapProgress = useStore(roadmapProgress);
  const done = $roadmapProgress?.done?.length || 0;
  const hasProgress = done > 0;
  if (!$totalRoadmapNodes) {
    return null;
  }

 
  return (
    <div
      className={
        'fixed bottom-5 left-1/2 z-30 hidden -translate-x-1/2 transform animate-fade-slide-up overflow-hidden rounded-full bg-stone-900 px-4 py-2 text-center text-white shadow-2xl transition-all duration-300 sm:block'
      }
    >
      {/*   // 如果没有进度，显示提示信息，告诉用户如何标记主题为完成。 */}
      <span
        className={cn('block', {
          hidden: hasProgress,
        })}
      >
        <span className="mr-2 text-sm font-semibold uppercase text-yellow-400">
          Tip
        </span>
        <span className="text-sm text-gray-200">
          右击主题 to mark it as done.{' '}
          <button
            data-popup="progress-help"
            className="cursor-pointer font-semibold text-yellow-500 underline"
          >
            学习更多.
          </button>
        </span>
      </span>
      {/*  // 如果存在进度，显示已完成的节点数和总节点数，并显示一个进度条。 */}
      <span
        className={cn('relative z-20 block text-sm', {
          hidden: !hasProgress,
        })}
      >
        <span className="relative -top-[0.45px] mr-2 text-xs font-medium uppercase text-yellow-400">
          Progress
        </span>
        <span>{done}</span> of <span>{$totalRoadmapNodes}</span> Done
      </span>

      <span
        className="absolute bottom-0 left-0 top-0 z-10 bg-stone-700"
        style={{
          width: `${(done / $totalRoadmapNodes) * 100}%`,
        }}
      ></span>
    </div>
  );
}
