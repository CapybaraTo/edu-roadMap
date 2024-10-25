import { useState } from 'react';
import { httpPost } from '../../lib/http';
import { useToast } from '../../hooks/use-toast';

import { 
  Form, 
  Input, 
  Space,
  Button,
  Row,
  Col,
  Tabs,
} from 'antd';

type UpdatePasswordFormProps = {
  authProvider: string;
};

export default function UpdatePasswordForm(props: UpdatePasswordFormProps) {
  const { authProvider } = props;

  const toast = useToast();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newPasswordConfirmation, setNewPasswordConfirmation] = useState('');

  const [isLoading, setIsLoading] = useState(false);

  const [form] = Form.useForm();

  const handleSubmit = async (values: any) => {
    // e.preventDefault();
    setIsLoading(true);

    if (newPassword !== newPasswordConfirmation) {
      toast.error('Passwords do not match');
      setIsLoading(false);

      return;
    }

    const oldPassword = form.getFieldValue("oldPassword");
    const password = form.getFieldValue("password");
    const confirmPassword = form.getFieldValue("confirmPassword");


    const { response, error } = await httpPost(
      `${import.meta.env.PUBLIC_API_URL}/v1-update-password`,
      {
        oldPassword,
        password,
        confirmPassword
      },
    );

    if (error || !response) {
      toast.error(error?.message || 'Something went wrong');
      setIsLoading(false);

      return;
    }

    setCurrentPassword('');
    setNewPassword('');
    setNewPasswordConfirmation('');
    toast.success('Password updated successfully');
    setIsLoading(false);
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  return (
    <Form onFinish={handleSubmit}>
      <div className="mb-8 hidden md:block">
        <h2 className="text-3xl font-bold sm:text-4xl">密码</h2>
        <p className="mt-2 text-gray-400">
          填写下面表格更新你的密码
        </p>
      </div>
      <div className="space-y-4">
        {authProvider === 'email' && (
          <div className="flex w-full flex-col">
            <Form.Item
              name = "oldPassword"
              className="text-sm leading-none text-slate-500"
            >
              <Input.Password
                placeholder='原密码'
                className="mt-2 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm outline-none placeholder:text-gray-400 focus:ring-2 focus:ring-black focus:ring-offset-1 disabled:bg-gray-100"
              />
            </Form.Item>
          </div>
        )}

        <div className="flex w-full flex-col">
            <Form.Item
              name = "newPassword"
              className="text-sm leading-none text-slate-500"
              rules={[
                { min: 6, message: '密码长度至少不能小于6'},
                { max: 50,message: '密码长度至多不能大于50'}
              ]}
            >
              <Input.Password
                placeholder='新密码'
                className="mt-2 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm outline-none placeholder:text-gray-400 focus:ring-2 focus:ring-black focus:ring-offset-1"
              />
            </Form.Item>
        </div>
        
        <div className="flex w-full flex-col">
            <Form.Item
              name = "confirmPassword"
              className="text-sm leading-none text-slate-500"
            >
              <Input.Password
                placeholder='确认新密码'
                className="mt-2 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm outline-none placeholder:text-gray-400 focus:ring-2 focus:ring-black focus:ring-offset-1"
              />
            </Form.Item>
        </div>

        <button
          type="submit"
          disabled={
            isLoading || !newPassword || newPassword !== newPasswordConfirmation
          }
          className="inline-flex w-full items-center justify-center rounded-lg bg-black p-2 py-3 text-sm font-medium text-white outline-none focus:ring-2 focus:ring-black focus:ring-offset-1 disabled:bg-gray-400"
        >
          {isLoading ? '请稍等...' : '更新密码'}
        </button>
      </div>
    </Form>
  );
}
