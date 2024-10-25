/*
 * @Author: capybarato 1023536640@qq.com
 * @Date: 2024-10-15 09:21:46
 * @LastEditors: capybarato 1023536640@qq.com
 * @LastEditTime: 2024-10-25 14:30:44
 * @FilePath: \roadMapPro\src\components\Activity\ActivityCounters.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
// 上侧 总体统计信息
type ActivityCountersType = {
  // done: {
  //   today: number;
  //   total: number;
  // };
  done:number;
  learning: {
    // today: number;
    total: number;
  };
  streak: {
    count: number;
  };
};

type ActivityCounterType = {
  text: string;
  count: string;
};

function ActivityCounter(props: ActivityCounterType) {
  const { text, count } = props;

  return (
    <div className="relative flex flex-1 flex-row-reverse sm:flex-col px-0 sm:px-4 py-2 sm:py-4 text-center sm:pt-[1.62rem] items-center gap-2 sm:gap-0 justify-end">
      <h2 className="text-base sm:text-5xl font-bold">
        {count}
      </h2>
      <p className="mt-0 sm:mt-2 text-sm text-gray-400">{text}</p>
    </div>
  );
}

export function ActivityCounters(props: ActivityCountersType) {
  const { done, learning, streak } = props;

  return (
    <div className="mx-0 -mt-5 sm:-mx-10 md:-mt-10">
      <div className="flex flex-col sm:flex-row gap-0 sm:gap-2 divide-y sm:divide-y-0 divide-x-0 sm:divide-x border-b">
        <ActivityCounter
          text={'学成知识点数'}
          count={`${done || 0}`}
        />

        <ActivityCounter
          text={'正在学习的路线图'}
          count={`${learning?.total || 0}`}
        />

        <ActivityCounter
          text={'学习天数'}
          count={`${streak?.count || 0}d`}
        />
      </div>
    </div>
  );
}
