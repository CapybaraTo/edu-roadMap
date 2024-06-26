import { RoadmapHint } from './RoadmapHint.tsx';   // 输出是一个包含可能的横幅和资源进度统计的容器
import { useStore } from '@nanostores/react';
import { canManageCurrentRoadmap, currentRoadmap } from '../../stores/roadmap';    // 状态存储，存储当前路线图的元数据和权限信息
// import { ShareOptionsModal } from '../ShareOptions/ShareOptionsModal';   // 分享 --删除
import { useState } from 'react';
import { pageProgressMessage } from '../../stores/page.ts';   // 进度信息 原子变量
import { httpDelete, httpPut } from '../../lib/http';
// import { type TeamResourceConfig } from '../CreateTeam/RoadmapSelector';   // 类型定义，可能与团队资源配置相关
import { useToast } from '../../hooks/use-toast';   // 用于管理应用程序中的吐司消息（toast messages）。吐司消息是一种轻量级的通知方式，通常用于向用户显示短暂的信息提示
import { RoadmapActionButton } from './RoadmapActionButton.tsx';   // 用于展示路线图操作按钮
import { Lock, Shapes } from 'lucide-react';   // 图标组件
// import { Modal } from '../Modal';   // 模态框组件
// import { ShareSuccess } from '../ShareOptions/ShareSuccess';   // 分享到twitter等  --删除
// import { ShareRoadmapButton } from '../ShareRoadmapButton.tsx';   // 分享到twitter等   --删除
// import { CustomRoadmapAlert } from './CustomRoadmapAlert.tsx';   // 用于提醒用户当前页面展示的是社区创建的路线图，并非官方验证

type RoadmapHeaderProps = {};

export function RoadmapHeader(props: RoadmapHeaderProps) {
  // const $canManageCurrentRoadmap = useStore(canManageCurrentRoadmap);
  const $currentRoadmap = useStore(currentRoadmap);

  const {
    title,
    description,
    _id: roadmapId,
    slug: roadmapSlug,
    creator,
    team,
    visibility,
  } = useStore(currentRoadmap) || {};

  //使用 useState 创建 isSharing 和 isSharingWithOthers 状态，用于控制分享状态和分享给他人的模态框。
  // const [isSharing, setIsSharing] = useState(false);
  // const [isSharingWithOthers, setIsSharingWithOthers] = useState(false);
  const toast = useToast();

  // 删除路线图函数   按钮隐藏
  // async function deleteResource() {
  //   pageProgressMessage.set('路线图删除中');

  //   const teamId = $currentRoadmap?.teamId;
  //   const baseApiUrl = import.meta.env.PUBLIC_API_URL;

  //   let error, response;
  //   if (teamId) {
  //     ({ error, response } = await httpPut<TeamResourceConfig>(
  //       `${baseApiUrl}/v1-delete-team-resource-config/${teamId}`,
  //       {
  //         resourceId: roadmapId,
  //         resourceType: 'roadmap',
  //       },
  //     ));
  //   } else {
  //     ({ error, response } = await httpDelete<TeamResourceConfig>(
  //       `${baseApiUrl}/v1-delete-roadmap/${roadmapId}`,
  //     ));
  //   }

  //   if (error || !response) {
  //     toast.error(error?.message || 'Something went wrong');
  //     return;
  //   }

  //   toast.success('Roadmap removed');
  //   if (!teamId) {
  //     window.location.href = '/account/roadmaps';
  //   } else {
  //     window.location.href = `/team/roadmaps?t=${teamId}`;
  //   }
  // }

  const avatarUrl = creator?.avatar
    ? `${import.meta.env.PUBLIC_AVATAR_BASE_URL}/${creator?.avatar}`
    : '/images/default-avatar.png';

    // 分享
  // const sharingWithOthersModal = isSharingWithOthers && (
  //   <Modal
  //     onClose={() => setIsSharingWithOthers(false)}
  //     wrapperClassName="max-w-lg"
  //     bodyClassName="p-4 flex flex-col"
  //   >
  //     <ShareSuccess
  //       visibility="public"
  //       roadmapSlug={roadmapSlug}
  //       roadmapId={roadmapId!}
  //       description={description}
  //       onClose={() => setIsSharingWithOthers(false)}
  //       isSharingWithOthers={true}
  //     />
  //   </Modal>
  // );

  return (
    <div className="border-b">
      <div className="container relative py-5 sm:py-12">
        {/* {!$canManageCurrentRoadmap && <CustomRoadmapAlert />} */}

        {creator?.name && (
          <div className="-mb-1 flex items-center gap-1.5 text-sm text-gray-500">
            <img
              alt={creator.name}
              src={avatarUrl}
              className="h-5 w-5 rounded-full"
            />
            <span>
              创建来自&nbsp;
              <span className="font-semibold text-gray-900">
                {creator?.name}
              </span>
              {/* {team && (
                <>
                  &nbsp;from&nbsp;
                  <span className="font-semibold text-gray-900">
                    {team?.name}
                  </span>
                </>
              )} */}
            </span>
          </div>
        )}
        <div className="mb-3 mt-4 sm:mb-4">
          <h1 className="text-2xl font-bold sm:mb-2 sm:text-4xl">{title}</h1>
          <p className="mt-0.5 text-sm text-gray-500 sm:text-lg">
            {description}
          </p>
        </div>

        <div className="flex justify-between gap-2 sm:gap-0">
          <div className="flex justify-stretch gap-1 sm:gap-2">
            <a
              href="/roadmaps"
              className="rounded-md bg-gray-500 px-3 py-1.5 text-xs font-medium text-white hover:bg-gray-600 sm:text-sm"
              aria-label="Back to All Roadmaps"
            >
              &larr;<span className="hidden sm:inline">&nbsp;所有路线图</span>
            </a>

            {/* <ShareRoadmapButton
              roadmapId={roadmapId!}
              description={description!}
              pageUrl={`https://roadmap.sh/r/${roadmapSlug}`}
              allowEmbed={true}
            /> */}
          </div>
          <div className="flex items-center gap-2">
            {/* {$canManageCurrentRoadmap && (
              <>
                {isSharing && $currentRoadmap && (
                  <ShareOptionsModal
                    roadmapSlug={$currentRoadmap?.slug}
                    isDiscoverable={$currentRoadmap.isDiscoverable}
                    description={$currentRoadmap?.description}
                    visibility={$currentRoadmap?.visibility}
                    teamId={$currentRoadmap?.teamId}
                    roadmapId={$currentRoadmap?._id!}
                    sharedFriendIds={$currentRoadmap?.sharedFriendIds || []}
                    sharedTeamMemberIds={
                      $currentRoadmap?.sharedTeamMemberIds || []
                    }
                    onClose={() => setIsSharing(false)}
                    onShareSettingsUpdate={(settings) => {
                      currentRoadmap.set({
                        ...$currentRoadmap,
                        ...settings,
                      });
                    }}
                  />
                )}

                <a
                  href={`${
                    import.meta.env.PUBLIC_EDITOR_APP_URL
                  }/${$currentRoadmap?._id}`}
                  target="_blank"
                  className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white py-1.5 pl-2 pr-2 text-xs font-medium  text-black hover:border-gray-300 hover:bg-gray-300 sm:px-3 sm:text-sm"
                >
                  <Shapes className="mr-1.5 h-4 w-4 stroke-[2.5]" />
                  <span className="hidden sm:inline-block">Edit Roadmap</span>
                  <span className="sm:hidden">编辑</span>
                </a>
                <button
                  onClick={() => setIsSharing(true)}
                  className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white py-1.5 pl-2 pr-2 text-xs font-medium text-black hover:border-gray-300 hover:bg-gray-300 sm:px-3 sm:text-sm"
                >
                  <Lock className="mr-1.5 h-4 w-4 stroke-[2.5]" />
                  分享中
                </button>

                <RoadmapActionButton
                  onDelete={() => {
                    const confirmation = window.confirm(
                      '确定要删除这张路线图?',
                    );

                    if (!confirmation) {
                      return;
                    }

                    deleteResource().finally(() => null);
                  }}
                />
              </>
            )} */}

            {/* {!$canManageCurrentRoadmap && visibility === 'public' && (
              <>
                {sharingWithOthersModal}
                <button
                  onClick={() => setIsSharingWithOthers(true)}
                  className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white py-1.5 pl-2 pr-2 text-xs font-medium  text-black hover:border-gray-300 hover:bg-gray-300 sm:px-3 sm:text-sm"
                >
                  <Lock className="mr-1.5 h-4 w-4 stroke-[2.5]" />
                  Share with Others
                </button>
              </>
            )} */}
          </div>
        </div>

        <RoadmapHint
          roadmapTitle={title!}
          hasTNSBanner={false}
          roadmapId={roadmapId!}
        />
      </div>
    </div>
  );
}
