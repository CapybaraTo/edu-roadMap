/*
 * @Author: capybarato 1023536640@qq.com
 * @Date: 2024-06-14 10:30:14
 * @LastEditors: capybarato 1023536640@qq.com
 * @LastEditTime: 2024-10-07 20:54:36
 * @FilePath: \roadMapPro\src\components\AuthenticationFlow\AuthenticationForm.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
// 登录模块 已删除第三方登录
import { useState } from 'react';
import {UserLoginForm} from './UserLoginForm';
import {UserSignupForm} from './UserSignupForm';
// import { EmailLoginForm } from './EmailLoginForm.tsx';
// import { EmailSignupForm } from './EmailSignupForm';

// 表示登录注册 问号表示type是可选的，未提供则默认login
type AuthenticationFormProps = {
  type?: 'login' | 'signup';
};

export function AuthenticationForm(props: AuthenticationFormProps) {
  const { type = 'login' } = props;
  // console.log("登录还是注册：",type)

  const [isDisabled, setIsDisabled] = useState(false);

  return (
    <>
      {type === 'login' && (
        <UserLoginForm isDisabled={isDisabled} setIsDisabled={setIsDisabled} />
      )}
      {type === 'signup' &&  (
        <UserSignupForm
          isDisabled={isDisabled}
          setIsDisabled={setIsDisabled}
        />
      )}
    </>
  );
}
