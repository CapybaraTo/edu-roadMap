/*
 * @Author: capybarato 1023536640@qq.com
 * @Date: 2024-10-10 14:56:13
 * @LastEditors: capybarato 1023536640@qq.com
 * @LastEditTime: 2024-10-10 15:01:06
 * @FilePath: \roadMapPro\src\components\Navigation\OnboardingModal.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { cn } from '../lib/classname';
import { memo, useEffect, useState } from 'react';
import { useScrollPosition } from '../hooks/use-scroll-position';
import { X } from 'lucide-react';

type OnboardingNudgeProps = {
  onStartOnboarding: () => void;
};

export const NUDGE_ONBOARDING_KEY = 'should_nudge_onboarding';

export function OnboardingNudge(props: OnboardingNudgeProps) {
  const { onStartOnboarding } = props;
  const [isLoading, setIsLoading] = useState(false);
  const { y: scrollY } = useScrollPosition();

  useEffect(() => {
    if (localStorage.getItem(NUDGE_ONBOARDING_KEY) === null) {
      localStorage.setItem(NUDGE_ONBOARDING_KEY, 'true');
    }
  }, []);

  if (localStorage.getItem(NUDGE_ONBOARDING_KEY) !== 'true') {
    return null;
  }

  if (scrollY < 100) {
    return null;
  }

  return (
    <div
      className={cn(
        'fixed left-0 right-0 top-0 z-[91] flex w-full items-center justify-center bg-yellow-300 border-b border-b-yellow-500/30 pt-1.5 pb-2',
        {
          'striped-loader': isLoading,
        },
      )}
    >
      <p className="text-base font-semibold text-yellow-950">
        Welcome! Please take a moment to{' '}
        <button
          type="button"
          onClick={() => {
            setIsLoading(true);
            localStorage.setItem(NUDGE_ONBOARDING_KEY, 'false');
            onStartOnboarding();
          }}
          className="underline"
        >
          complete onboarding
        </button>
        <button
          type="button"
          className="relative top-[3px] ml-1 px-1 py-1 text-yellow-600 hover:text-yellow-950"
          onClick={(e) => {
            e.stopPropagation();
            localStorage.setItem(NUDGE_ONBOARDING_KEY, 'false');
            setIsLoading(true);
          }}
        >
          <X className="h-4 w-4" strokeWidth={3} />
        </button>
      </p>
    </div>
  );
}
