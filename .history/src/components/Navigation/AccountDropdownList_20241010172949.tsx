// 我的账户下拉菜单的列表内容

import {
  ChevronRight,
  LogOut,
  Map,
  Plus,
  SquareUserRound,
  User2,
  Users2,
  Handshake,
} from 'lucide-react';    // 图标
import { logout } from './navigation.ts';
// import { CreateRoadmapModal } from '../CustomRoadmap/CreateRoadmap/CreateRoadmapModal.tsx';
import { useState } from 'react';
import { cn } from '../../lib/classname.ts';
// import { NotificationIndicator } from './NotificationIndicator.tsx';
import { Spinner } from '../ReactIcons/Spinner.tsx';
import { CheckIcon } from '../ReactIcons/CheckIcon.tsx';

type AccountDropdownListProps = {
  // onCreateRoadmap: () => void;    // 创新路线图
  // setIsTeamsOpen: (isOpen: boolean) => void;   //团队
  // onOnboardingClick: () => void;   //入门
  // isConfigLoading: boolean;
  // shouldShowOnboardingStatus?: boolean;    // 入门状态
  // onboardingConfigCount: number;    // 入门任务数
  // doneConfigCount: number;    // 入门任务完成数
};

export function AccountDropdownList(props: AccountDropdownListProps) {
  const {
    // setIsTeamsOpen,
    // onCreateRoadmap,
    // onOnboardingClick,
    // isConfigLoading = true,
    // shouldShowOnboardingStatus = false,
    // onboardingConfigCount,
    // doneConfigCount,
  } = props;

  return (
    <ul>
      <li className="px-1">
        <a
          href="/account"
          className="group flex items-center gap-2 rounded py-2 pl-3 pr-2 text-sm font-medium text-slate-100 hover:bg-slate-700"
        >
          <User2 className="h-4 w-4 stroke-[2.5px] text-slate-400 group-hover:text-white" />
          我的账户
        </a>
      </li>
      <li className="border-b border-b-gray-700/60 px-1 pb-1">
        <a
          href="/account/roadmaps"
          className="group flex items-center gap-2 rounded py-2 pl-3 pr-2 text-sm font-medium text-slate-100 hover:bg-slate-700"
        >
          <Map className="h-4 w-4 stroke-[2px] text-slate-400 group-hover:text-white" />
          路线图
        </a>
      </li>
      <li className="px-1">
        <button
          className="group flex w-full items-center gap-2 rounded py-2 pl-3 pr-2 text-left text-sm font-medium text-slate-100 hover:bg-slate-700"
          type="button"
          onClick={logout}
        >
          <LogOut className="h-4 w-4 stroke-[2px] text-slate-400 group-hover:text-white" />
          登出
        </button>
      </li>
    </ul>
  );
}
