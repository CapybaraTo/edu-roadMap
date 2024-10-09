/*
 * @Author: capybarato 1023536640@qq.com
 * @Date: 2024-06-11 10:52:27
 * @LastEditors: capybarato 1023536640@qq.com
 * @LastEditTime: 2024-10-04 11:40:55
 * @FilePath: \roadMapPro\src\lib\jwt.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import * as jose from 'jose';
import Cookies from 'js-cookie';
import type { AllowedOnboardingStatus } from '../api/user';

export const TOKEN_COOKIE_NAME = '__roadmapsh_jt__';

export type TokenPayload = {
  id: string;
  email: string;
  username:string;
  name: string;
  avatar: string;
  onboardingStatus?: AllowedOnboardingStatus;
};

// decodeToken函数使用jose库解码JWT
export function decodeToken(token: string): TokenPayload {
  const claims = jose.decodeJwt(token);

  return claims as TokenPayload;
}

// 检查登录状态 isLoggedIn函数检查是否存在JWT Token，如果存在则返回true，表示用户已登录
export function isLoggedIn() {
  const token = Cookies.get(TOKEN_COOKIE_NAME);

  return !!token;
}

// 依据token获取当前用户信息
export function getUser() {
  const token = Cookies.get(TOKEN_COOKIE_NAME);
  if (!token) {
    return null;
  }
  return decodeToken(token);
}

// 设置认证Token  setAuthToken函数设置JWT Token到Cookie中，并提供了一些选项，如过期时间、路径、域等
export function setAuthToken(token: string) {
  Cookies.set(TOKEN_COOKIE_NAME, token, {
    path: '/',
    expires: 30,
    sameSite: 'lax',
    secure: true,
    // domain: import.meta.env.DEV ? 'localhost' : '.roadmap.sh',
    domain: import.meta.env.DEV ? 'localhost' : 'localhost',
  });
  removeAIReferralCode();
}

// 移除认证Token
export function removeAuthToken() {
  Cookies.remove(TOKEN_COOKIE_NAME, {
    path: '/',
    // domain: import.meta.env.DEV ? 'localhost' : '.roadmap.sh',
    domain: import.meta.env.DEV ? 'localhost' : 'localhost',

    
  });
}

// 访问AI路线图    visitAIRoadmap函数用于标记用户是否已经访问过特定的AI路线图
export function visitAIRoadmap(roadmapId: string) {
  const isAlreadyVisited = Number(Cookies.get(`crv-${roadmapId}`) || 0) === 1;
  if (isAlreadyVisited) {
    return;
  }
  Cookies.set(`crv-${roadmapId}`, '1', {
    path: '/',
    expires: 1 / 24, // 1 hour
    sameSite: 'lax',
    secure: !import.meta.env.DEV,
    // domain: import.meta.env.DEV ? 'localhost' : '.roadmap.sh',
    domain: import.meta.env.DEV ? 'localhost' : 'localhost',

  });
}

// 删除OpenAI秘钥
export function deleteOpenAIKey() {
  Cookies.remove('oak', {
    path: '/',
    // domain: import.meta.env.DEV ? 'localhost' : '.roadmap.sh',
    domain: import.meta.env.DEV ? 'localhost' : 'localhost',

  });
}

// 保存OpenAI秘钥
export function saveOpenAIKey(apiKey: string) {
  Cookies.set('oak', apiKey, {
    path: '/',
    expires: 365,
    sameSite: 'lax',
    secure: true,
    // domain: import.meta.env.DEV ? 'localhost' : '.roadmap.sh',
    domain: import.meta.env.DEV ? 'localhost' : 'localhost',
  });
}

// 获取OpenAI秘钥
export function getOpenAIKey() {
  return Cookies.get('oak');
}

const AI_REFERRAL_COOKIE_NAME = 'referral_code';

// 设置AI推荐代码
export function setAIReferralCode(code: string) {
  const alreadyExist = Cookies.get(AI_REFERRAL_COOKIE_NAME);
  if (alreadyExist) {
    return;
  }

  Cookies.set(AI_REFERRAL_COOKIE_NAME, code, {
    path: '/',
    expires: 365,
    sameSite: 'lax',
    secure: true,
    // domain: import.meta.env.DEV ? 'localhost' : '.roadmap.sh',
    domain: import.meta.env.DEV ? 'localhost' : 'localhost',
  });
}

// 移除AI推荐代码
export function removeAIReferralCode() {
  Cookies.remove(AI_REFERRAL_COOKIE_NAME, {
    path: '/',
    // domain: import.meta.env.DEV ? 'localhost' : '.roadmap.sh',
    domain: import.meta.env.DEV ? 'localhost' : 'localhost',
  });
}

// 设置产看赞助商Cookie
// export function setViewSponsorCookie(sponsorId: string) {
//   const key = `vsc-${sponsorId}`;
//   const alreadyExist = Cookies.get(key);
//   if (alreadyExist) {
//     return;
//   }

//   Cookies.set(key, '1', {
//     path: '/',
//     expires: 1,
//     sameSite: 'lax',
//     secure: true,
//     domain: import.meta.env.DEV ? 'localhost' : '.roadmap.sh',
//   });
// }
