import type { FormEvent } from 'react';   // 表单事件
import { useState, useRef } from 'react';
// import Captcha from "react-captcha-code";
import CaptchaInput from './captchainput';  //图形验证码组件
import { httpPost } from '../../lib/http';
import type { ResData, RespError } from '../../types/global';   //
import { setAuthToken } from '../../lib/jwt';
import { 
  Form, 
  Input, 
  Space,
  Button,
  Row,
  Col,
  Tabs,
} from 'antd';
import { CloudCog } from 'lucide-react';

type UserLoginFormProps = {
  isDisabled?: boolean;
  setIsDisabled?: (isDisabled: boolean) => void;
};

// 用户名表单提交
export function UserLoginForm(props: UserLoginFormProps) {
  const [form] = Form.useForm();
  const { isDisabled, setIsDisabled } = props;
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const childRef = useRef()  // 图形校验码ref
  // console.log(`${import.meta.env.PUBLIC_API_URL}`)

  // 处理表单提交
  // 手机号密码 登录   注册时需要填写用户名
  // 只向后端传递手机号 和 密码
  const handleFormSubmit = async (values: any) => {
    setIsLoading(true);
    setIsDisabled?.(true);
    setError('');
    console.log(values);
    const phone= form.getFieldValue("phone");
    const password = form.getFieldValue("password");
    console.log(phone)
    console.log(password)
    // 发送post请求，预期返回token
    // console.log(`${import.meta.env.PUBLIC_API_URL}/user/login`)
    console.log(`${import.meta.env.PUBLIC_API_URL}`)
    const { response, error } = await httpPost<{token: string}>(
      `${import.meta.env.PUBLIC_API_URL}/user/login`,
      {
        phone,
        password
      },
    );
    // Log the user in and reload the page
    // if (response?.token) {
    console.log(response)
    if (response?.token) {
      console.log(response.token);
      console.log(typeof response.token);
      setAuthToken(response.token);
      window.location.reload();
      return;
    }
    // if ((error as any).type === 'user_not_verified') {
    //   window.location.href = `/verification-pending?phone=${encodeURIComponent(
    //     phone,
    //   )}`;
    //   return;
    // }
    setIsLoading(false);
    setIsDisabled?.(false);
    setError(error?.message || '出现错误，请稍后重试。');
  };

  // 表单页面
  return (
    <Form 
      style={{ maxWidth: 600 }}
      form={form} 
      className="w-full" 
      onFinish={handleFormSubmit} 
      >   
      <Form.Item
        name="phone"
        // label="phone"
        style={{ marginBottom: '8px' }}
        rules={[
          {
            required:true,
            message:'请输入手机号'
          },
          {                               
            pattern: /^1\d{10}$/,
            message: '手机号格式错误',
          },
        ]}
      >
      <Input
        size="large"
        className="block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm outline-none placeholder:text-gray-400 focus:ring-2 focus:ring-black focus:ring-offset-1"
        placeholder="手机号"
        // prefix={<UserLoginForm/>}
        // onInput={(e) => setEmail(String((e.target as any).value))}
      />
      </Form.Item>

      <Form.Item
        name="password"
        // label="password"
        style={{ marginBottom: '8px' }}
        rules={[
          {required:true, message:'必须输入密码'}
        ]}
        // hasFeedback ={true}
        validateStatus="success"
      >
      <Input.Password
        size="large"
        className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm outline-none placeholder:text-gray-400 focus:ring-2 focus:ring-black focus:ring-offset-1"
        placeholder="密码"
        // prefix={<LockOutlined />}
        // onInput={(e) => setPassword(String((e.target as any).value))}
      />
      </Form.Item>
      <Form.Item 
        // label="图形验证码" 
        rules={[{required: true}]} 
        style={{ marginBottom: '8px' }}
        extra="We must make sure that your are a human.">
        <Row gutter={8}>
        <Col >
        <Form.Item
            name="captcha"
            noStyle
            rules={[
              { required: true, message: 'Please input the captcha you got!' },
              {
                validator(_, value) {
                  if (!value) {
                    return new Promise((reject) => {reject('')})
                  } else {
                    const status = childRef.current.validate(value)
                    return status
                      ? Promise.resolve()
                      : Promise.reject(new Error('验证码不正确'))
                  }
                }
              }
            ]}
        >
          <Input
            className="mt-2 block rounded-lg border border-gray-300 px-3 py-2 shadow-sm outline-none placeholder:text-gray-400 focus:ring-2 focus:ring-black focus:ring-offset-1"
            style ={{width:'200px', fontSize:'16px'}}
            placeholder="验证码"/>
        </Form.Item>
        </Col>
        <Col >
          <CaptchaInput  cRef={childRef} />
        </Col>
        </Row>
      </Form.Item>
      <p className="mb-3 mt-2 text-sm text-gray-500">
        <a
          href="/forgot-password"
          className="text-blue-800 hover:text-blue-600"
        >
          忘记密码?
        </a>
      </p>

      {error && (
        <p className="mb-2 rounded-md bg-red-100 p-2 text-red-800">{error}</p>
      )}

      <Form.Item>
      <button
        type="submit"
        disabled={isLoading || isDisabled}
        className="inline-flex w-full items-center justify-center rounded-lg bg-black p-2 py-3 text-sm font-medium text-white outline-none focus:ring-2 focus:ring-black focus:ring-offset-1 disabled:bg-gray-400"
      >
        {isLoading ? '请稍等...' : '继续'}
      </button>
      </Form.Item>
    </Form>
  );
}
