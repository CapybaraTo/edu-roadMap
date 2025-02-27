type AIAnnouncementProps = {};

export function AIAnnouncement(props: AIAnnouncementProps) {
  return (
    <a
      className="group flex items-center rounded-full bg-gradient-to-r from-purple-900/50 to-indigo-900/50 px-4 py-2 text-sm font-medium text-purple-200 transition-all hover:from-purple-800/60 hover:to-indigo-800/60 hover:shadow-lg hover:shadow-purple-900/20"
      href="/ai"
    >
      <span className="relative mr-2 rounded-full bg-purple-500 px-1.5 py-0.5 text-xs font-semibold uppercase text-white">
        NEW
      </span>
      <span className={'hidden sm:inline'}>使用AI生成可视化路线图</span>
      <span className={'inline sm:hidden'}>AI路线图生成器！</span>
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        className="ml-1.5 h-4 w-4 text-purple-300 transition-transform group-hover:translate-x-0.5" 
        viewBox="0 0 20 20" 
        fill="currentColor"
      >
        <path 
          fillRule="evenodd" 
          d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" 
          clipRule="evenodd" 
        />
      </svg>
    </a>
  );
}
