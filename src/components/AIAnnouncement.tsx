type AIAnnouncementProps = {};

export function AIAnnouncement(props: AIAnnouncementProps) {
  return (
    <a
      className="rounded-md border border-dashed border-purple-600 px-3 py-1.5 text-purple-400 transition-colors hover:border-purple-400 hover:text-purple-200"
      href="/ai"
    >
      <span className="relative -top-[1px] mr-1 text-xs font-semibold uppercase text-white">
        NEW
      </span>{' '}
      <span className={'hidden sm:inline'}>使用AI生成可视化路线图</span>
      <span className={'inline text-sm sm:hidden'}>AI路线图生成器！</span>
    </a>
  );
}
