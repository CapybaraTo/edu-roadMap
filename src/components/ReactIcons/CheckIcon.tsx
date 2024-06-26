/*
 * @Author: capybarato 1023536640@qq.com
 * @Date: 2024-06-13 16:47:36
 * @LastEditors: capybarato 1023536640@qq.com
 * @LastEditTime: 2024-06-13 16:48:00
 * @FilePath: \roadMapPro\src\components\Reactions\Checkicon.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
// 复选标记图标
type CheckIconProps = {
  additionalClasses?: string;
};

export function CheckIcon(props: CheckIconProps) {
  const { additionalClasses = 'mr-2 top-[0.5px] w-[20px] h-[20px]' } = props;

  return (
    <svg
      className={`relative ${additionalClasses}`}
      stroke="currentColor"
      fill="currentColor"
      strokeWidth="0"
      viewBox="0 0 16 16"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"></path>
    </svg>
  );
}
