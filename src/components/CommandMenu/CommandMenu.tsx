// 一个命令菜单组件，通常用于显示一个可搜索的菜单，允许用户快速导航到不同的页面或资源

import {
  Fragment,
  type ReactElement,
  useEffect,
  useRef,
  useState,
} from 'react';     // 引入钩子
import { useKeydown } from '../../hooks/use-keydown';
import { useOutsideClick } from '../../hooks/use-outside-click';
import { httpGet } from '../../lib/http';
import { isLoggedIn } from '../../lib/jwt';   // 检查用户是否登录
// 引入系列图标
// import { BestPracticesIcon } from '../ReactIcons/BestPracticesIcon.tsx';
import { UserIcon } from '../ReactIcons/UserIcon.tsx';
// import { GroupIcon } from '../ReactIcons/GroupIcon.tsx';
import { RoadmapIcon } from '../ReactIcons/RoadmapIcon.tsx';
import { ClipboardIcon } from '../ReactIcons/ClipboardIcon.tsx';
// import { GuideIcon } from '../ReactIcons/GuideIcon.tsx';
import { HomeIcon } from '../ReactIcons/HomeIcon.tsx';
import { VideoIcon } from '../ReactIcons/VideoIcon.tsx';
import { cn } from '../../lib/classname.ts';  //CSS类名组合
import type { AllowedRoadmapRenderer } from '../../lib/roadmap.ts';

// 一个界面对象 比如包含路径名等的
export type PageType = {
  id: string;
  url: string;
  title: string;
  group: string;
  icon?: ReactElement;
  isProtected?: boolean;
  metadata?: Record<string, any>;
  renderer?: AllowedRoadmapRenderer;
};

// 页面对象默认取值
const defaultPages: PageType[] = [
  {
    id: 'home',
    url: '/',
    title: 'Home',
    group: 'Pages',
    icon: <HomeIcon className="mr-2 h-4 w-4 stroke-2" />,
  },
  {
    id: 'account',
    url: '/account',
    title: 'Account',
    group: 'Pages',
    icon: <UserIcon className="mr-2 h-4 w-4 stroke-2" />,
    isProtected: true,
  },
  // {
  //   id: 'team',
  //   url: '/team',
  //   title: 'Teams',
  //   group: 'Pages',
  //   icon: <GroupIcon className="mr-2 h-4 w-4 stroke-2" />,
  //   isProtected: true,
  // },
  // {
  //   id: 'friends',
  //   url: '/account/friends',
  //   title: 'Friends',
  //   group: 'Pages',
  //   icon: <GroupIcon className="mr-2 h-4 w-4 stroke-2" />,
  //   isProtected: true,
  // },
  {
    id: 'roadmaps',
    url: '/roadmaps',
    title: 'Roadmaps',
    group: 'Pages',
    icon: <RoadmapIcon className="mr-2 h-4 w-4 stroke-2" />,
  },
  // 自定义路线图
  // {
  //   id: 'account-roadmaps',
  //   url: '/account/roadmaps',
  //   title: 'Custom Roadmaps',
  //   group: 'Pages',
  //   icon: <RoadmapIcon className="mr-2 h-4 w-4 stroke-2" />,
  //   isProtected: true,
  // },
  // 最佳实践
  // {
  //   id: 'best-practices',
  //   url: '/best-practices',
  //   title: 'Best Practices',
  //   group: 'Pages',
  //   icon: <BestPracticesIcon className="mr-2 h-4 w-4 stroke-2" />,
  // },
  {
    id: 'questions',
    url: '/questions',
    title: 'Questions',
    group: 'Pages',
    icon: <ClipboardIcon className="mr-2 h-4 w-4 stroke-2" />,
  },
  // {
  //   id: 'guides',
  //   url: '/guides',
  //   title: 'Guides',
  //   group: 'Pages',
  //   icon: <GuideIcon className="mr-2 h-4 w-4 stroke-2" />,
  // },
  {
    id: 'videos',
    url: '/videos',
    title: 'Videos',
    group: 'Pages',
    icon: <VideoIcon className="mr-2 h-4 w-4 stroke-2" />,
  },
];

// 判断页面是否应该显示，基于页面是否受保护和用户是否登录
function shouldShowPage(page: PageType) {
  const isUser = isLoggedIn();
  return !page.isProtected || isUser;
}


export function CommandMenu() {
  // 使用 useRef 创建了两个引用 inputRef 和 modalRef，分别用于引用搜索输入框和菜单容器的DOM元素。
  const inputRef = useRef<HTMLInputElement>(null);
  const modalRef = useRef<HTMLInputElement>(null);
  // 使用 useState 创建了几个状态
  const [isActive, setIsActive] = useState(false);  // 控制菜单的显示和隐藏
  const [allPages, setAllPages] = useState<PageType[]>([]);    // 存储所有页面数据
  const [searchResults, setSearchResults] = useState<PageType[]>(defaultPages);   //存储搜索结果
  const [searchedText, setSearchedText] = useState('');    // 存储搜索文本
  const [activeCounter, setActiveCounter] = useState(0);   // 存储当前高亮的搜索结果索引

  // 当按下 mod_k（通常是 Ctrl/Cmd + K）时，显示命令菜单
  useKeydown('mod_k', () => {
    setIsActive(true);
  });

  // 当点击菜单外部区域时，关闭命令菜单并清空搜索文本
  useOutsideClick(modalRef, () => {
    setSearchedText('');
    setIsActive(false);
  });

  // 在组件挂载时，获取所有页面数据，并设置事件监听器，用于处理命令键的快捷操作
  useEffect(() => {
    function handleToggleTopic(e: any) {
      setIsActive(true);
    }

    getAllPages();
    window.addEventListener(`command.k`, handleToggleTopic);
    return () => {
      window.removeEventListener(`command.k`, handleToggleTopic);
    };
  }, []);

  // 当 isActive 状态改变时，如果 isActive 为 true，则将焦点设置到搜索输入框
  useEffect(() => {
    if (!isActive || !inputRef.current) {
      return;
    }

    inputRef.current.focus();
  }, [isActive]);

  // 异步函数，用于获取所有页面数据。首先尝试从本地状态获取，如果没有则通过 httpGet 请求获取，并过滤出应该显示的页面。
  async function getAllPages() {
    if (allPages.length > 0) {
      return allPages;
    }
    const { error, response } = await httpGet<PageType[]>(`/pages.json`);
    if (!response) {
      return defaultPages.filter(shouldShowPage);
    }

    setAllPages([...defaultPages, ...response].filter(shouldShowPage));

    return response;
  }

  // 当 searchedText 状态改变时，根据搜索文本过滤页面数据，并更新搜索结果。
  useEffect(() => {
    if (!searchedText) {
      setSearchResults(defaultPages.filter(shouldShowPage));
      return;
    }
    const normalizedSearchText = searchedText.trim().toLowerCase();
    getAllPages().then((unfilteredPages = defaultPages) => {
      const filteredPages = unfilteredPages
        .filter((currPage: PageType) => {
          return (
            currPage.title.toLowerCase().indexOf(normalizedSearchText) !== -1
          );
        })
        .slice(0, 10);

      setActiveCounter(0);
      setSearchResults(filteredPages);
    });
  }, [searchedText]);

      // 渲染逻辑
      // 如果 isActive 为 false，则不渲染任何内容。
  if (!isActive) {
    return null;
  }

  // 渲染一个包含搜索输入框和搜索结果列表的模态框。
  return (
    <div className="fixed left-0 right-0 top-0 z-50 flex h-full justify-center overflow-y-auto overflow-x-hidden bg-black/50">
      <div className="relative top-0 h-full w-full max-w-lg p-2 sm:mt-20 md:h-auto">
        <div className="relative rounded-lg bg-white shadow" ref={modalRef}>
          <input
            ref={inputRef}
            autoFocus={true}
            type="text"
            value={searchedText}
            className="w-full rounded-t-md border-b p-4 text-sm focus:bg-gray-50 focus:outline-none"
            placeholder="搜索路线图、练习题或者课程..."
            autoComplete="off"
            onInput={(e) => {
              const value = (e.target as HTMLInputElement).value.trim();
              setSearchedText(value);
            }}
            onKeyDown={(e) => {
              if (e.key === 'ArrowDown') {
                const canGoNext = activeCounter < searchResults.length - 1;
                setActiveCounter(canGoNext ? activeCounter + 1 : 0);
              } else if (e.key === 'ArrowUp') {
                const canGoPrev = activeCounter > 0;
                setActiveCounter(
                  canGoPrev ? activeCounter - 1 : searchResults.length - 1,
                );
              } else if (e.key === 'Tab') {
                e.preventDefault();
              } else if (e.key === 'Escape') {
                setSearchedText('');
                setIsActive(false);
              } else if (e.key === 'Enter') {
                const activePage = searchResults[activeCounter];
                if (activePage) {
                  window.location.href = activePage.url;
                }
              }
            }}
          />

          <div className="px-2 py-2">
            <div className="flex flex-col">
              {searchResults.length === 0 && (
                <div className="p-5 text-center text-sm text-gray-400">
                  没有找到相关结果
                </div>
              )}


              {searchResults.map((page: PageType, counter: number) => {
                const prevPage = searchResults[counter - 1];
                const groupChanged = prevPage && prevPage.group !== page.group;

                // 显示搜索结果，每个结果可以鼠标悬停高亮，并点击跳转。
                return (
                  <Fragment key={page.id}>
                    {groupChanged && (
                      <div className="border-b border-gray-100"></div>
                    )}
                    <a
                      className={cn(
                        'flex w-full items-center rounded p-2 text-sm',
                        counter === activeCounter ? 'bg-gray-100' : '',
                      )}
                      onMouseOver={() => setActiveCounter(counter)}
                      href={page.url}
                    >
                      {!page.icon && (
                        <span className="mr-2 text-gray-400">{page.group}</span>
                      )}
                      {page.icon && page.icon}
                      {page.title}
                    </a>
                  </Fragment>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
