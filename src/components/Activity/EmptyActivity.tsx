import { RoadmapIcon } from "../ReactIcons/RoadmapIcon";

export function EmptyActivity() {
  return (
    <div className="rounded-md">
      <div className="flex flex-col items-center p-7 text-center">
        <RoadmapIcon className="mb-2  h-14 w-14 opacity-10" />

        <h2 className="text-lg sm:text-xl font-bold">没有进展</h2>
        <p className="my-1 sm:my-2 max-w-[400px] text-gray-500 text-sm sm:text-base">
          进度将会展示在此处，包括您{' '}
          <a href="/roadmaps" className="mt-4 text-blue-500 hover:underline">
            路线图
          </a>{' '}
          or{' '}
          <a href="/best-practices" className="mt-4 text-blue-500 hover:underline">
            最佳实践
          </a>{' '}
          的学习进展。
        </p>
      </div>
    </div>
  );
}
