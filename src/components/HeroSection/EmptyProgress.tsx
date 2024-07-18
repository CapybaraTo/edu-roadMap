/*
 * @Author: capybarato 1023536640@qq.com
 * @Date: 2024-06-13 16:38:44
 * @LastEditors: capybarato 1023536640@qq.com
 * @LastEditTime: 2024-06-14 10:15:47
 * @FilePath: \roadMapPro\src\components\HeroSection\EmptyProgress.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { CheckIcon } from '../ReactIcons/CheckIcon.tsx';   // 勾选标记图标
import { AIAnnouncement } from '../AIAnnouncement.tsx';    // AI相关的公告或信息
// 定义标题和消息的文本内容
type EmptyProgressProps = {
  title?: string;
  message?: string;
};
// 使用解构赋值，从 props 中取出 title 和 message，同时为它们提供了默认值
export function EmptyProgress(props: EmptyProgressProps) {
  const {
    title = '开始学习..',
    message = '你的进度与收藏路线图展示在这里：',
  } = props;

  return (
    <div className="relative flex min-h-full flex-col items-start justify-center py-6 sm:items-center">
      <h2
        className={'mb-1.5 flex items-center text-lg text-gray-200 sm:text-2xl'}
      >
        <CheckIcon additionalClasses="mr-2 top-[0.5px] w-[16px] h-[16px] sm:w-[20px] sm:h-[20px]" />
        {title}
      </h2>
      <p className={'text-sm text-gray-400 sm:text-base'}>{message}</p>

      <p className="mt-5">
        <AIAnnouncement />
      </p>
    </div>
  );
}
