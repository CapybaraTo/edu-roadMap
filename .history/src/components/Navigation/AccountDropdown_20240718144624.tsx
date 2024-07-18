// 我的账户部分的下拉菜单  ：新手任务、账号、我的文件、朋友、新建roadmap、团队、登出logout

import { useEffect, useRef, useState } from 'react';        //REACT钩子
import { ChevronDown } from 'lucide-react';    //图标
import { getUser, isLoggedIn } from '../../lib/jwt.ts';    // token和cookies   处理用户身份验证和获取用户信息
import { useOutsideClick } from '../../hooks/use-outside-click.ts';     // 点击外部空白关闭下拉菜单
// import { OnboardingModal } from './OnboardingModal.tsx';    // 新人任务  入门引导
import { httpGet } from '../../lib/http.ts';   // 发送 HTTP GET 请求
import { useToast } from '../../hooks/use-toast.ts';    // 用于显示通知消息
import type { UserDocument } from '../../api/user.ts';
import { NotificationIndicator } from './NotificationIndicator.tsx';
// import { OnboardingNudge } from '../OnboardingNudge.tsx';

export type OnboardingConfig = Pick<
  UserDocument,
  'onboarding' | 'onboardingStatus'
>;

export function AccountDropdown() {
  const toast = useToast();       // 提示消息
  const dropdownRef = useRef(null);    // 引用下拉菜单的 DOM 元素

  // 创建多个状态
  const [showDropdown, setShowDropdown] = useState(false);    //控制下拉菜单的显示和隐藏
  // const [isTeamsOpen, setIsTeamsOpen] = useState(false);// 控制团队列表的显示和隐藏
  // const [isCreatingRoadmap, setIsCreatingRoadmap] = useState(false);   // 控制创建路线图的显示和隐藏
  const [isConfigLoading, setIsConfigLoading] = useState(false);   // 控制加载配置的加载状态
  // const [isOnboardingModalOpen, setIsOnboardingModalOpen] = useState(false);  // 控制入门引导模态框的显示和隐藏
  // const [onboardingConfig, setOnboardingConfig] = useState<
  //   OnboardingConfig | undefined
  // >(undefined);   // 存储入门引导配置
  const currentUser = getUser();

  // 判断是否显示入门引导状态
  // const shouldShowOnboardingStatus =
  //   currentUser?.onboardingStatus === 'pending' ||
  //   onboardingConfig?.onboardingStatus === 'pending';

  // 加载入门引导配置
  // const loadOnboardingConfig = async () => {
  //   if (!isLoggedIn() || !shouldShowOnboardingStatus) {
  //     return;
  //   }

  //   setIsConfigLoading(true);
  //   const { response, error } = await httpGet<OnboardingConfig>(
  //     `${import.meta.env.PUBLIC_API_URL}/v1-get-onboarding-config`,
  //   );

  //   if (error || !response) {
  //     toast.error(error?.message || 'Failed to load onboarding config');
  //   }

  //   setOnboardingConfig(response);
  // };

  // 
  useOutsideClick(dropdownRef, () => {
    setShowDropdown(false);
    // setIsTeamsOpen(false);
    setIsConfigLoading(true);
  });

  // 使用 useEffect 加载入门引导配置
  // useEffect(() => {
  //   if (!isLoggedIn() || !showDropdown) {
  //     return;
  //   }

  //   loadOnboardingConfig().finally(() => {
  //     setIsConfigLoading(false);
  //   });
  // }, [showDropdown]);

  // 使用 useEffect 处理页面可见性变化
  // 当页面可见性变化时（如用户切换标签页），重新加载入门引导配置
  // useEffect(() => {
  //   const loadConfig = () => {
  //     loadOnboardingConfig().finally(() => {
  //       setIsConfigLoading(false);
  //     });
  //   };

  //   window.addEventListener('visibilitychange', loadConfig);
  //   return () => {
  //     window.removeEventListener('visibilitychange', loadConfig);
  //   };
  // }, []);

  if (!isLoggedIn()) {
    return null;
  }

  // 渲染组件：
// 如果用户未登录，则不渲染任何内容。
// 渲染入门引导提示、模态框、下拉菜单按钮和下拉菜单内容。
// 下拉菜单内容根据 isTeamsOpen 的值显示团队列表或账户列表。
// 账户列表中包含创建路线图、显示入门引导状态和加载状态等操作。
  const onboardingDoneCount = Object.values(
    onboardingConfig?.onboarding || {},
  ).filter((status) => status !== 'pending').length;
  const onboardingCount = Object.keys(
    onboardingConfig?.onboarding || {},
  ).length;

  return (
    <>
      {shouldShowOnboardingStatus && !isOnboardingModalOpen && (
        <OnboardingNudge
          onStartOnboarding={() => {
            loadOnboardingConfig().then(() => {
              setIsOnboardingModalOpen(true);
            });
          }}
        />
      )}

      <div className="relative z-[90] animate-fade-in">
        {isOnboardingModalOpen && onboardingConfig && (
          <OnboardingModal
            onboardingConfig={onboardingConfig}
            onClose={() => {
              setIsOnboardingModalOpen(false);
            }}
            onIgnoreTask={(taskId, status) => {
              loadOnboardingConfig().finally(() => {});
            }}
          />
        )}
        {isCreatingRoadmap && (
          <CreateRoadmapModal
            onClose={() => {
              setIsCreatingRoadmap(false);
            }}
          />
        )}

        <button
          className="relative flex h-8 w-40 items-center justify-center gap-1.5 rounded-full bg-gradient-to-r from-purple-500 to-purple-700 px-4 py-2 text-sm font-medium text-white hover:from-purple-500 hover:to-purple-600"
          onClick={() => {
            setIsTeamsOpen(false);
            setShowDropdown(!showDropdown);
          }}
        >
          <span className="inline-flex items-center">
            Account&nbsp;<span className="text-gray-300">/</span>&nbsp;Teams
          </span>
          <ChevronDown className="h-4 w-4 shrink-0 stroke-[2.5px]" />
          {shouldShowOnboardingStatus && !showDropdown && (
            <NotificationIndicator />
          )}
        </button>

        {showDropdown && (
          <div
            ref={dropdownRef}
            className="absolute right-0 z-50 mt-2 min-h-[152px] w-48 rounded-md bg-slate-800 py-1 shadow-xl"
          >
            {isTeamsOpen ? (
              <DropdownTeamList setIsTeamsOpen={setIsTeamsOpen} />
            ) : (
              <AccountDropdownList
                onCreateRoadmap={() => {
                  setIsCreatingRoadmap(true);
                  setShowDropdown(false);
                }}
                setIsTeamsOpen={setIsTeamsOpen}
                onOnboardingClick={() => {
                  setIsOnboardingModalOpen(true);
                  setShowDropdown(false);
                }}
                shouldShowOnboardingStatus={shouldShowOnboardingStatus}
                isConfigLoading={isConfigLoading}
                onboardingConfigCount={onboardingCount}
                doneConfigCount={onboardingDoneCount}
              />
            )}
          </div>
        )}
      </div>
    </>
  );
}
