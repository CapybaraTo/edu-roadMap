/*
 * @Author: capybarato 1023536640@qq.com
 * @Date: 2024-07-18 14:16:39
 * @LastEditors: capybarato 1023536640@qq.com
 * @LastEditTime: 2024-10-10 17:30:11
 * @FilePath: \roadMapPro\src\components\Navigation\AccountDropdown.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
// 我的账户部分的下拉菜单  ：新手任务、账号、我的文件、朋友、新建roadmap、团队、登出logout

import { useEffect, useRef, useState } from 'react';        //REACT钩子
import { ChevronDown } from 'lucide-react';    //图标
import { getUser, isLoggedIn } from '../../lib/jwt.ts';    // token和cookies   处理用户身份验证和获取用户信息
import { AccountDropdownList } from './AccountDropdownList.tsx';
import { useOutsideClick } from '../../hooks/use-outside-click.ts';     // 点击外部空白关闭下拉菜单
// import { OnboardingModal } from './OnboardingModal.tsx';    // 新人任务  入门引导
import { httpGet } from '../../lib/http.ts';   // 发送 HTTP GET 请求
import { useToast } from '../../hooks/use-toast.ts';    // 用于显示通知消息
import type { UserDocument } from '../../api/user.ts';
// import { NotificationIndicator } from './NotificationIndicator.tsx';     // 提示器
// import { OnboardingNudge } from '../OnboardingNudge.tsx';


export function AccountDropdown() {
  const toast = useToast();       // 提示消息
  const dropdownRef = useRef(null);    // 引用下拉菜单的 DOM 元素

  const [showDropdown, setShowDropdown] = useState(false);    //控制下拉菜单的显示和隐藏
  const [isConfigLoading, setIsConfigLoading] = useState(false);   // 控制加载配置的加载状态
  const currentUser = getUser();

  useOutsideClick(dropdownRef, () => {
    setShowDropdown(false);
    setIsConfigLoading(true);
  });

  // 使用 useEffect 加载入门引导配置
  useEffect(() => {
    if (!isLoggedIn() || !showDropdown) {
      return;
    }
    // loadOnboardingConfig().finally(() => {
    //   setIsConfigLoading(false);
    // });
  }, [showDropdown]);

    // 渲染组件：
    // 如果用户未登录，则不渲染任何内容。
    // 渲染入门引导提示、模态框、下拉菜单按钮和下拉菜单内容。
    // 下拉菜单内容根据 isTeamsOpen 的值显示团队列表或账户列表。
    // 账户列表中包含创建路线图、显示入门引导状态和加载状态等操作。 
  if (!isLoggedIn()) {
    return null;
  }

  return (
    <>
      <div className="relative z-[90] animate-fade-in">
        <button
          className="relative flex h-8 w-40 items-center justify-center gap-1.5 rounded-full bg-gradient-to-r from-purple-500 to-purple-700 px-4 py-2 text-sm font-medium text-white hover:from-purple-500 hover:to-purple-600"
          onClick={() => {
            setShowDropdown(!showDropdown);
          }}
        >
          <span className="inline-flex items-center">
            我的&nbsp;
          </span>
          <ChevronDown className="h-4 w-4 shrink-0 stroke-[2.5px]" />
        </button>

        {showDropdown && (
          <div
            ref={dropdownRef}
            className="absolute right-0 z-50 mt-2 min-h-[152px] w-48 rounded-md bg-slate-800 py-1 shadow-xl"
          >
            {(
              <AccountDropdownList />
            )}
          </div>
        )}
      </div>
    </>
  );
}
