// 答题进度及其操作
import {
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  SkipForward,
  Sparkles,
} from 'lucide-react';
import { showLoginPopup } from '../../lib/popup';

type QuestionsProgressProps = {
  isLoading?: boolean;
  showLoginAlert?: boolean;
  knowCount?: number;
  didNotKnowCount?: number;
  totalCount?: number;
  skippedCount?: number;
  onResetClick?: () => void;
  onPrevClick?: () => void;
  onNextClick?: () => void;
};

export function QuestionsProgress(props: QuestionsProgressProps) {
  const {
    showLoginAlert,
    isLoading = false,
    knowCount = 0,
    didNotKnowCount = 0,
    totalCount = 0,
    skippedCount = 0,
    onResetClick = () => null,
    onPrevClick = () => null,
    onNextClick = () => null,
  } = props;

  const totalSolved = knowCount + didNotKnowCount + skippedCount;
  const donePercentage = (totalSolved / totalCount) * 100;

  return (
    <div className="mb-3 overflow-hidden rounded-lg border border-gray-300 bg-white p-4 sm:mb-5 sm:p-6">
      <div className="mb-3 flex items-center text-gray-600">
        <div className="relative w-full flex-1 rounded-xl bg-gray-200 p-1">
          <div
            className="duration-400 absolute bottom-0 left-0 top-0 rounded-xl bg-slate-800 transition-[width]"
            style={{
              width: `${donePercentage}%`,
            }}
          />
        </div>
        <span className="ml-3 flex items-center text-sm">
          <button
            onClick={onPrevClick}
            className="text-zinc-400 hover:text-black"
          >
            <ChevronLeft className="h-4" strokeWidth={3} />
          </button>
          <span className="block min-w-[41px] text-center">
            <span className="tabular-nums">{totalSolved}</span> / {totalCount}
          </span>
          <button
            onClick={onNextClick}
            className="text-zinc-400 hover:text-black"
          >
            <ChevronRight className="h-4" strokeWidth={3} />
          </button>
        </span>
      </div>

      <div className="relative -left-1 flex flex-col gap-2 text-sm text-black sm:flex-row sm:gap-3">
        <span className="flex items-center">
          <CheckCircle className="mr-1 h-4" />
          <span>已学会</span>
          <span className="ml-2 rounded-md bg-gray-200/80 px-1.5 font-medium text-black">
            <span className="tabular-nums">{knowCount}</span> 个题目
          </span>
        </span>

        <span className="flex items-center">
          <Sparkles className="mr-1 h-4" />
          <span>正在学习</span>
          <span className="ml-2 rounded-md bg-gray-200/80 px-1.5 font-medium text-black">
            <span className="tabular-nums">{didNotKnowCount}</span> 个题目
          </span>
        </span>

        <span className="flex items-center">
          <SkipForward className="mr-1 h-4" />
          <span>已跳过</span>
          <span className="ml-2 rounded-md bg-gray-200/80 px-1.5 font-medium text-black">
            <span className="tabular-nums">{skippedCount}</span> 个题目
          </span>
        </span>

        <button
          disabled={isLoading}
          onClick={onResetClick}
          className="flex items-center text-red-600 transition-opacity duration-300 hover:text-red-900 disabled:opacity-50"
        >
          <RotateCcw className="mr-1 h-4" />
          重置
          <span className="inline lg:hidden">进展</span>
        </button>
      </div>

      {showLoginAlert && (
        <p className="-mx-6 -mb-6 mt-6 border-t bg-yellow-100 py-3 text-sm text-yellow-900">
          你的答题进度未保存。 请{' '}
          <button
            onClick={() => {
              showLoginPopup();
            }}
            className="underline-offset-3 font-medium underline hover:text-black"
          >
            登录并保存你的答题进度.
          </button>
        </p>
      )}
    </div>
  );
}
