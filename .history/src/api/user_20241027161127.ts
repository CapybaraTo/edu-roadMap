import { type APIContext } from 'astro';  //API上下文
import { api } from './api';  //发起api请求
import type { ResourceType } from '../lib/resource-progress.ts';

// 路线图
export const allowedRoadmapVisibility = ['all', 'none', 'selected'] as const;   // asconst确保只读
export type AllowedRoadmapVisibility =(typeof allowedRoadmapVisibility)[number]; // 类型别名 表示 AllowedRoadmapVisibility 可以是数组 allowedRoadmapVisibility 中的任何元素的类型

// 自定义路线图的可见性设置
export const allowedCustomRoadmapVisibility = [
  'all',
  'none',
  'selected',
] as const;
export type AllowedCustomRoadmapVisibility =
  (typeof allowedCustomRoadmapVisibility)[number];

// 用户个人资料的可见性
export const allowedProfileVisibility = ['public', 'private'] as const;
export type AllowedProfileVisibility = (typeof allowedProfileVisibility)[number];

// 定义新手入门节点完成状态
// export const allowedOnboardingStatus = ['done', 'pending', 'ignored'] as const;
// export type AllowedOnboardingStatus = (typeof allowedOnboardingStatus)[number];

// UserDocument接口 描述了用户文档的数据结构
export interface UserDocument {
  _id?: string;   // 可选属性  带问号的是可选
  name: string;   // 必填属性
  email: string;
  username:string;   // 替代email  username
  avatar?: string;   //用户头像url
  password: string;
  isEnabled: boolean;//用户账户是否启用
  // authProvider: 'github' | 'email';
  // authProvider: 'github' | 'google' | 'email' | 'linkedin';  //用户认证提供者种类
  metadata: Record<string, any>;     //
  calculatedStats: {
    activityCount: number;
    totalVisitCount: number;
    longestVisitStreak: number;   // 最长连续访问
    updatedAt: Date;
  };
  // verificationCode: string;   // 存储用户邮箱验证的验证码
  // resetPasswordCode: string;  // 存储用户重置密码的验证码
  isSyncedWithSendy: boolean;
  profileVisibility: AllowedProfileVisibility;    // 限定个人资料的可见性
  publicConfig?: {   // 用户的公共配置信息
    isAvailableForHire: boolean;
    isEmailVisible: boolean;
    headline: string;
    roadmaps: string[];
    customRoadmaps: string[];
    roadmapVisibility: AllowedRoadmapVisibility;
    customRoadmapVisibility: AllowedCustomRoadmapVisibility;
  };
  resetPasswordCodeAt: string;
  verifiedAt: string;
  createdAt: string;
  updatedAt: string;
}

// 用户活动计数类型
export type UserActivityCount = {
  activityCount: Record<string, number>;
  totalActivityCount: number;
};

// 进度响应类型
type ProgressResponse = {
  updatedAt: string;
  title: string;
  id: string;
  learning: number;
  skipped: number;
  done: number;
  total: number;
  roadmapSlug?: string;
};

// 公共个人资料响应类型
export type GetPublicProfileResponse = Omit<
  UserDocument,
  'password' | 'verificationCode' | 'resetPasswordCode' | 'resetPasswordCodeAt'
> & {
  activity: UserActivityCount;
  roadmaps: ProgressResponse[];
  isOwnProfile: boolean;
};

// 用户个人资料路线图响应类型
export type GetUserProfileRoadmapResponse = {
  title: string;
  topicCount: number;
  roadmapSlug?: string;
  done: string[];
  learning: string[];
  skipped: string[];
  nodes: any[];
  edges: any[];
};

// 用户API函数
export function userApi(context: APIContext) {
  return {
    getPublicProfile: async function (username: string) {
      return api(context).get<GetPublicProfileResponse>(
        `${import.meta.env.PUBLIC_API_URL}/v1-get-public-profile/${username}`,
      );
    },
    getUserProfileRoadmap: async function (
      username: string,
      resourceId: string,
      resourceType: ResourceType = 'roadmap',
    ) {
      return api(context).get<GetUserProfileRoadmapResponse>(
        `${
          import.meta.env.PUBLIC_API_URL
        }/v1-get-user-profile-roadmap/${username}`,
        {
          resourceId,
          resourceType,
        },
      );
    },
  };
}
