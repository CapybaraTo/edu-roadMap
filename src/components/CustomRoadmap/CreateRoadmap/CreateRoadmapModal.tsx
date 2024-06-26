import {
  type FormEvent,
  type MouseEvent,
  useEffect,
  useRef,
  useState,
} from 'react';    // 导入react相关的钩子
import { Loader2 } from 'lucide-react';
import { Modal } from '../../Modal';
import { useToast } from '../../../hooks/use-toast';
import { httpPost } from '../../../lib/http';
import { cn } from '../../../lib/classname';

// 路线图可见性
export const allowedRoadmapVisibility = [
  'me',
  'friends',
  'team',
  'public',
] as const;    
export type AllowedRoadmapVisibility =
  (typeof allowedRoadmapVisibility)[number];

// 自定义路线图的类型
export const allowedCustomRoadmapType = ['role', 'skill'] as const;   
export type AllowedCustomRoadmapType =
  (typeof allowedCustomRoadmapType)[number];

// 定义路线图文档的数据结构，包括标题、描述、创建者ID、是否可发现、类型、可见性、节点、边等属性。
export interface RoadmapDocument {
  _id?: string;
  title: string;
  description?: string;
  slug?: string;
  creatorId: string;
  teamId?: string;
  isDiscoverable: boolean;
  type: AllowedCustomRoadmapType;
  visibility: AllowedRoadmapVisibility;
  sharedFriendIds?: string[];
  sharedTeamMemberIds?: string[];
  nodes: any[];
  edges: any[];
  createdAt: Date;
  updatedAt: Date;
  canManage: boolean;
  isCustomResource: boolean;
}

// 定义了CreateRoadmapModal组件的属性，包括关闭函数onClose、创建成功后的回调onCreated、团队ID:teamId和默认可见性visibility
interface CreateRoadmapModalProps {
  onClose: () => void;
  onCreated?: (roadmap: RoadmapDocument) => void;
  teamId?: string;
  visibility?: AllowedRoadmapVisibility;
}

// CreateRoadmapModal组件实现
export function CreateRoadmapModal(props: CreateRoadmapModalProps) {
  const { onClose, onCreated, teamId } = props;
  // const { onClose, onCreated } = props;

  const titleRef = useRef<HTMLInputElement>(null);   // 使用useRef钩子创建对输入框的引用，以便可以对其进行聚焦
  const toast = useToast();

  const [isLoading, setIsLoading] = useState(false);  // 使用useState钩子创建状态变量，包括加载状态isLoading、标题title和描述description
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const isInvalidDescription = description?.trim().length > 80;

  // 自定义路径图提交事件，绑定modal中的提交按钮
  // handleSubmit异步函数处理表单提交，通过调用httpPost函数发送请求到后端API创建路线图
  async function handleSubmit(
    e: FormEvent<HTMLFormElement> | MouseEvent<HTMLButtonElement>,
    redirect: boolean = true,
  ) {
    e.preventDefault();
    if (isLoading) { 
      return;
    }

    if (title.trim() === '' || isInvalidDescription) {
      toast.error('请填写所有字段');
      return;
    }

    setIsLoading(true);
    const { response, error } = await httpPost<RoadmapDocument>(
      `${import.meta.env.PUBLIC_API_URL}/v1-create-roadmap`,
      {
        title,
        description,
        ...(teamId && {
          teamId,
        }),
        nodes: [],
        edges: [],
      },   //传的参数
    );

    if (error) {
      setIsLoading(false);
      toast.error(error?.message || '出现问题，请重试');
      return;
    }

    toast.success('路径图创建成功');
    if (redirect) {
      window.location.href = `${
        import.meta.env.PUBLIC_EDITOR_APP_URL
      }/${response?._id}`;
      return;
    }

    if (onCreated) {
      onCreated(response as RoadmapDocument);
      return;
    }

    onClose();

    setTitle('');
    setDescription('');
    setIsLoading(false);
  }

  // 使用useEffect钩子在组件加载后自动聚焦到标题输入框
  useEffect(() => {
    titleRef.current?.focus();
  }, []);

  // JSX组件 UI实现  模态框内包含标题、描述输入框，以及提交和取消按钮。
  return (
    <Modal
      onClose={onClose}
      bodyClassName="p-4"
      wrapperClassName={cn(teamId && 'max-w-lg')}
    >
      <div className="mb-4">
        <h2 className="text-lg font-medium text-gray-900">Create Roadmap</h2>
        <p className="mt-1 text-sm text-gray-500">
        给你的路径图中添加标题和说明。
        </p>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="mt-4">
          <label
            htmlFor="title"
            className="block text-xs uppercase text-gray-400"
          >
            路径图标题
          </label>
          <div className="mt-1">
            <input
              ref={titleRef}
              type="text"
              name="title"
              id="title"
              required
              className="block w-full rounded-md border border-gray-300 px-2.5 py-2 text-black outline-none focus:border-black sm:text-sm"
              placeholder="Enter Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
        </div>
        <div className="mt-4">
          <label
            htmlFor="description"
            className="block text-xs uppercase text-gray-400"
          >
            描述
          </label>
          <div className="relative mt-1">
            <textarea
              id="description"
              name="description"
              required
              className={cn(
                'block h-24 w-full resize-none rounded-md border border-gray-300 px-2.5 py-2 text-black outline-none focus:border-black sm:text-sm',
                isInvalidDescription && 'border-red-300 bg-red-100',
              )}
              placeholder="Enter Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <div className="absolute bottom-2 right-2 text-xs text-gray-400">
              {description.length}/80
            </div>
          </div>
        </div>

        <div
          className={cn('mt-4 flex justify-between gap-2', teamId && 'mt-8')}
        >
          <button
            onClick={onClose}
            type="button"
            className={cn(
              'block h-9 rounded-md border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-black outline-none hover:border-gray-300 hover:bg-gray-50 focus:border-gray-300 focus:bg-gray-100',
              !teamId && 'w-full',
            )}
          >
            取消
          </button>

          <div className={cn('flex items-center gap-2', !teamId && 'w-full')}>
            {teamId && !isLoading && (
              <button
                disabled={isLoading}
                type="button"
                onClick={(e) => handleSubmit(e, false)}
                className="flex h-9 items-center justify-center rounded-md border border-black bg-white px-4 py-2 text-sm font-medium text-black outline-none hover:bg-black hover:text-white focus:bg-black focus:text-white"
              >
                {isLoading ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  'Save as Placeholder'
                )}
              </button>
            )}

            <button
              disabled={isLoading}
              type="submit"
              className={cn(
                'flex h-9 items-center justify-center rounded-md border border-transparent bg-black px-4 py-2 text-sm font-medium text-white outline-none hover:bg-gray-800 focus:bg-gray-800',
                teamId ? 'hidden sm:flex' : 'w-full',
              )}
            >
              {isLoading ? (
                <Loader2 size={16} className="animate-spin" />
              ) : teamId ? (
                '继续编辑'
              ) : (
                '创建'
              )}
            </button>
          </div>
        </div>
        {teamId && (
          <>
            <p className="mt-4 hidden rounded-md border border-orange-200 bg-orange-50 p-2.5 text-sm text-orange-600 sm:block">
            准备路线图可能需要一些时间，请随时将其保存为占位符和任何具有该角色的人 <strong>admin</strong>{' '}
              or <strong>manager</strong> can prepare it later.
            </p>
            <p className="mt-4 rounded-md border border-orange-200 bg-orange-50 p-2.5 text-sm text-orange-600 sm:hidden">
              Create a placeholder now and prepare it later.
            </p>
          </>
        )}
      </form>
    </Modal>
  );
}
