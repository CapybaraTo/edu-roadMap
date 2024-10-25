/*
 * @Author: capybarato 1023536640@qq.com
 * @Date: 2024-10-15 11:12:30
 * @LastEditors: capybarato 1023536640@qq.com
 * @LastEditTime: 2024-10-15 11:29:29
 * @FilePath: \roadMapPro\src\components\ProfileSettings\ProfileSettingsPage
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { useEffect, useState } from 'react';
// import { UpdateEmailForm } from '../UpdateEmail/UpdateEmailForm';
import UpdatePasswordForm from '../UpdatePassword/UpdatePasswordForm.tsx';
import { pageProgressMessage } from '../../stores/page.ts';
import { httpGet } from '../../lib/http.ts';
import { useToast } from '../../hooks/use-toast.ts';

export function ProfileSettingsPage() {
  const toast = useToast();

  const [authProvider, setAuthProvider] = useState('');
  const [currentEmail, setCurrentEmail] = useState('');
  const [newEmail, setNewEmail] = useState('');

  const loadProfile = async () => {
    const { error, response } = await httpGet(
      `${import.meta.env.PUBLIC_API_URL}/v1-me`,
    );

    if (error || !response) {
      toast.error(error?.message || 'Something went wrong');

      return;
    }

    const { authProvider, email, newEmail } = response;
    setAuthProvider(authProvider);
    setCurrentEmail(email);
    setNewEmail(newEmail || '');
  };

  useEffect(() => {
    loadProfile().finally(() => {
      pageProgressMessage.set('');
    });
  }, []);

  return (
    <>
      <UpdatePasswordForm authProvider={authProvider} />
      <hr className="my-8" />
      {/* TODO邮箱更改 添加邮箱验证 */}
      {/* <UpdateEmailForm
        authProvider={authProvider}
        currentEmail={currentEmail}
        newEmail={newEmail}
        key={newEmail}
        onSendVerificationCode={(newEmail) => {
          setNewEmail(newEmail);
          loadProfile().finally(() => {});
        }}
        onVerificationCancel={() => {
          loadProfile().finally(() => {});
        }}
      /> */}
    </>
  );
}
