// 导航栏下拉菜单及链接地址

import {
  // BookOpenText,
  // CheckSquare,
  FileQuestion,
  Menu,
  // Shirt,
  Video,
  Waypoints,
} from 'lucide-react';    // 图标
import { useRef, useState } from 'react';    // react的钩子
import { cn } from '../../lib/classname.ts';    // 处理类名  合并CSS类名
import { useOutsideClick } from '../../hooks/use-outside-click.ts';      // 点击外部空白关闭下拉菜单。导入了 useOutsideClick 钩子，用于处理点击外部区域时关闭下拉菜单的逻辑

const links = [
  {
    link: '/roadmaps',
    label: '路线图',
    description: '一步一步的学习路径',
    Icon: Waypoints,
  },
  // {
  //   link: '/best-practices',
  //   label: 'Best Practices',
  //   description: "Do's and don'ts",
  //   Icon: CheckSquare,
  // },
  {
    link: '/questions',
    label: '测试题',
    description: '测试/练习学习成果',
    Icon: FileQuestion,
  },
  // {
  //   link: '/guides',
  //   label: 'Guides',
  //   description: 'In-depth articles and tutorials',
  //   Icon: BookOpenText,
  // },
  {
    link: '/videos',
    label: '课程视频',
    description: '查看视频课程',
    Icon: Video,
    isExternal: true,
  },
  // {
  //   link: 'https://cottonbureau.com/people/roadmapsh',
  //   label: 'Shop',
  //   description: 'Get some cool swag',
  //   Icon: Shirt,
  //   isExternal: true,
  // },
];

export function NavigationDropdown() {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);

  useOutsideClick(dropdownRef, () => {
    setIsOpen(false);
  });

  return (
    <div className="relative flex items-center" ref={dropdownRef}>
      <button
        className={cn('text-slate-500 hover:text-slate-700', {
          'text-slate-700': isOpen,
        })}
        onClick={() => setIsOpen(true)}
        onMouseOver={() => setIsOpen(true)}
        aria-label="打开导航栏下拉菜单"
      >
        <Menu className="h-5 w-5" />
      </button>
      <div
        className={cn(
          'pointer-events-none invisible absolute left-0 top-full z-[999] mt-2 w-48 min-w-[320px] -translate-y-1 rounded-lg bg-white py-2 opacity-0 shadow-lg transition-all duration-100 border border-slate-200',
          {
            'pointer-events-auto visible translate-y-2.5 opacity-100': isOpen,
          },
        )}
      >
        {links.map((link) => (
          <a
            href={link.link}
            target={link.isExternal ? '_blank' : undefined}
            rel={link.isExternal ? 'noopener noreferrer' : undefined}
            key={link.link}
            className="group flex items-center gap-3 px-4 py-2.5 text-slate-500 transition-colors hover:bg-slate-50"
          >
            <span className="flex h-[40px] w-[40px] items-center justify-center rounded-full bg-slate-100 transition-colors group-hover:bg-slate-200 group-hover:text-slate-700">
              <link.Icon className="inline-block h-5 w-5" />
            </span>
            <span className="flex flex-col">
              <span className="font-medium text-slate-700 transition-colors group-hover:text-slate-900">
                {link.label}
              </span>
              <span className="text-sm text-slate-500">{link.description}</span>
            </span>
          </a>
        ))}
      </div>
    </div>
  );
}
