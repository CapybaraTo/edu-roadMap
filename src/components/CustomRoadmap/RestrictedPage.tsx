/*
 * @Author: capybarato 1023536640@qq.com
 * @Date: 2024-06-12 09:34:01
 * @LastEditors: capybarato 1023536640@qq.com
 * @LastEditTime: 2024-06-12 10:10:05
 * @FilePath: \roadMapPro\src\components\CustomRoadmap\RestrictedPage.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { ShieldBan } from 'lucide-react';    // 图标组件
import type { FetchError } from '../../lib/http';

type RestrictedPageProps = {
  error: FetchError;   // 属性是一个error，其类型为FetchError
};

export function RestrictedPage(props: RestrictedPageProps) {
  const { error } = props;  // 解构了props中的error属性

  if (error.status === 404) {   // 错误状态码是否为404，如果是，则渲染一个ErrorMessage组件，显示特定的错误信息和图标
    return (
      <ErrorMessage
        icon={<ShieldBan className="h-16 w-16" />}
        title="路线图没有找到"
        message="当前搜索的路线图不存在或已被删除"
        // title="Roadmap not found"
        // message="The roadmap you are looking for does not exist or has been deleted."
      />
    );
  }

  return (  // 不是404错误，渲染另一个ErrorMessage组件
    <ErrorMessage
      icon={<ShieldBan className="h-16 w-16" />}
      title="访问受限"
      message={error?.message}
    />
  );
}

type ErrorMessageProps = {
  title: string;
  message: string;
  icon: React.ReactNode;
};

// 用于描述ErrorMessage组件的属性
function ErrorMessage(props: ErrorMessageProps) {
  const { title, message, icon } = props;
  return (
    <div className="flex grow flex-col items-center justify-center">
      {icon}
      <h2 className="mt-4 text-2xl font-semibold">{title}</h2>
      <p>{message || '该路线图受限访问'}</p>

      <a
        href="/"
        className="mt-4 font-medium underline underline-offset-2 hover:no-underline"
      >
        &larr; 回到首页
      </a>
    </div>
  );
}
