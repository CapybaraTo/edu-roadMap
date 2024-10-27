import CalendarHeatmap from 'react-calendar-heatmap';
import { Tooltip as ReactTooltip } from 'react-tooltip';
import { httpGet } from '../../lib/http';
import 'react-calendar-heatmap/dist/styles.css';
import 'react-tooltip/dist/react-tooltip.css';
import { formatActivityDate, formatMonthDate } from '../../lib/date.ts';
import type { UserActivityCount } from '../../api/user.ts';
import dayjs from 'dayjs';
import { useState } from 'react';

// type UserActivityHeatmapProps = {
//   activityProgress: UserActivityCount;
//   joinedAt: string;
// };

export type dateActivity = {
  date: string,
  count: number,
};

// data 就是赋值后的heatmapResponse
export type heatmapResponse = {
  heatActivities: dateActivity[],
  joinedAt: string
};

const legends = [
  { count: '1-2', color: 'bg-gray-200' },
  { count: '3-4', color: 'bg-gray-300' },
  { count: '5-9', color: 'bg-gray-500' },
  { count: '10-19', color: 'bg-gray-600' },
  { count: '20+', color: 'bg-gray-800' },
];

export function UserActivityHeatmap(props: heatmapResponse) {
  // const { activityProgress } = props;
  // const data = Object.entries(activityProgress.activityCount).map(([date, count]) => ({
  //   date,
  //   count,
  // }));
  const {heatActivities, joinedAt} = props;

  // const startDate = dayjs().subtract(1, 'year').toDate();
  const startDate = dayjs().subtract(8, 'month').toDate();
  const endDate = dayjs().toDate();

  return (
    <div className="rounded-lg border bg-white p-4">
      <div className="-mx-4 mb-8 flex justify-between border-b px-4 pb-3">
        <div className="">
          <h2 className="mb-0.5 font-semibold">学习活动</h2>
          <p className="text-sm text-gray-500">
            过去一年的最新进展
          </p>
        </div>
        <span className="text-sm text-gray-400">
          自从: {formatMonthDate(props.joinedAt)}
        </span>
      </div>
      <CalendarHeatmap
        startDate={startDate}
        endDate={endDate}
        values={heatActivities}
        classForValue={(value) => {
          if (!value) {
            return 'fill-gray-100 rounded-md [rx:2px] focus:outline-none';
          }

          const { count } = value;
          if (count >= 10) {
            return 'fill-gray-800 rounded-md [rx:2px] focus:outline-none';
          } else if (count >= 5) {
            return 'fill-gray-600 rounded-md [rx:2px] focus:outline-none';
          } else if (count >= 3) {
            return 'fill-gray-500 rounded-md [rx:2px] focus:outline-none';
          } else if (count >= 2) {
            return 'fill-gray-300 rounded-md [rx:2px] focus:outline-none';
          } else {
            return 'fill-gray-200 rounded-md [rx:2px] focus:outline-none';
          }
        }}
        tooltipDataAttrs={(value: any) => {
          if (!value || !value.date) {
            return null;
          }

          const formattedDate = formatActivityDate(value.date);
          return {
            'data-tooltip-id': 'user-activity-tip',
            'data-tooltip-content': `${value.count} Updates - ${formattedDate}`,
          };
        }}
      />

      <ReactTooltip
        id="user-activity-tip"
        className="!rounded-lg !bg-gray-900 !p-1 !px-2 !text-sm"
      />

      <div className="mt-4 flex items-center justify-between">
        <span className="text-sm text-gray-400">
        标记按天完成的知识点数量
        </span>
        <div className="flex items-center">
          <span className="mr-2 text-xs text-gray-500">学的较少</span>
          {legends.map((legend) => (
            <div
              key={legend.count}
              className="flex items-center"
              data-tooltip-id="user-activity-tip"
              data-tooltip-content={`${legend.count} Updates`}
            >
              <div className={`h-3 w-3 ${legend.color} mr-1 rounded-sm`}></div>
            </div>
          ))}
          <span className="ml-2 text-xs text-gray-500">学了很多</span>
          <ReactTooltip
            id="user-activity-tip"
            className="!rounded-lg !bg-gray-900 !p-1 !px-2 !text-sm"
          />
        </div>
      </div>
    </div>
  );
}
