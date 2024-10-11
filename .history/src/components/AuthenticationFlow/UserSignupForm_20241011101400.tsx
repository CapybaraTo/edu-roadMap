import { type FormEvent, useState, useRef } from 'react';
import { httpPost } from '../../lib/http';
import CountButton from './coutdown'

import { 
  Form, 
  Input, 
  Space,
  Button,
  Row,
  Col,
  Tabs,
} from 'antd';

type UserSignupFormProps = {
  isDisabled?: boolean;
  setIsDisabled?: (isDisabled: boolean) => void;
};

export function UserSignupForm(props: UserSignupFormProps) {
  const { isDisabled, setIsDisabled } = props;

  const [form] = Form.useForm();
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const btdRef = useRef();

  // 新增账号
  const onSubmit = async (values: any) => {
    setIsLoading(true);
    setIsDisabled?.(true);
    setError('');
    console.log(values);
    const username = form.getFieldValue("userName")
    const password = form.getFieldValue("password");
    const phone = form.getFieldValue("phone");
    const email = form.getFieldValue("email");
    // const createdAt = ;
    const { response, error } = await httpPost<{status: "ok"}>(
      `${import.meta.env.PUBLIC_API_URL}/user/signup`,
      {
        username,
        phone,
        password,
        email,
      },
    );

    console.log(response)
    if (response?.status == 'ok') {
      console.log(response);
      window.location.reload();
      return;
    }

    // if (error || response?.status !== 'ok') {
    //   setIsLoading(false);
    //   setIsDisabled?.(false);
    //   setError(
    //     error?.message || 'Something went wrong. Please try again later.',
    //   );
    //   return;
    // }

    window.location.href = `/verification-pending?phone=${encodeURIComponent(
      phone,
    )}`;
  };

  return (
    <Form 
      className="flex w-full flex-col gap-2" 
      form={form} 
      onFinish={onSubmit}
      >

      <Form.Item
        name="userName"
        style={{ marginBottom: '8px' }}
        // label="userName"
        rules={[
          {
            required:true,
            message:'请输入用户名'
          },
          { min: 3, message: '用户名长度不能小于3'},
          { max: 50,message: '用户名长度不能大于50' },
        ]}
      >
        <Input 
          size='large'
          className="block w-full rounded-lg border border-gray-300 px-3 py-2 outline-none placeholder:text-gray-400 focus:ring-2 focus:ring-black focus:ring-offset-1"
          placeholder="用户名称"
          // onInput={(e) => setName(String((e.target as any).value))}
        />
      </Form.Item>

      <Form.Item
        name="password"
        style={{ marginBottom: '8px' }}
        rules={[
          {
            required:true,
            message:'请输入手机号'
          },
          { min: 6, message: '密码长度至少不能小于6'},
          { max: 50,message: '密码长度至多不能大于50'},
        ]}
      >
        <Input.Password
          size='large'
          className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none placeholder:text-gray-400 focus:ring-2 focus:ring-black focus:ring-offset-1"
          placeholder='设置密码'
        />
      </Form.Item>

      <Form.Item
        name="phone"
        style={{ marginBottom: '1px' }}
        rules={[
          {
            required:true,
            message:'请输入用户名'
          },
          {                               
            pattern: /^1\d{10}$/,
            message: '手机号格式错误',
          },
        ]}
      >
        <Input
          size='large'
          className="block w-full rounded-lg border border-gray-300 px-3 py-2  outline-none placeholder:text-gray-400 focus:ring-2 focus:ring-black focus:ring-offset-1"
          placeholder='请输入手机号'
          // onInput={(e) => setEmail(String((e.target as any).value))}
        />
      </Form.Item>

      <Form.Item   
        style={{ marginBottom: '8px' }}
        rules={[{required: true}]} >
        <Row gutter={8}>
          <Col span={11}>
            <Form.Item
              name="mobileCode"
              noStyle
              rules={[
                { required: true, message: '请输入验证码' },
                { pattern: /^\d{6}$/, message: '手机短信验证码是由6位数字组成的数字串' },
                {
                  //验证码实时校验
                  validator(_, value) {           //value是当前Form.Item的值。
                    if (!value) {
                      return new Promise((reject) => {reject('')})
                    } else {
                      //拿当前Form.Item的值到CountButton组件中进行校验(btdRef.current.validate方法)，
                      //若与CountButton中产生的options.code值相同，则通过校验。
                      const status = btdRef.current.validate(value)
                      return status
                        ? Promise.resolve()
                        : Promise.reject(new Error('验证码不正确'))
                    }
                  }
                },
              ]}
            >
              <Input 
                className="mt-2 block rounded-lg border border-gray-300 px-3 py-2 shadow-sm outline-none placeholder:text-gray-400 focus:ring-2 focus:ring-black focus:ring-offset-1"
                style ={{width:'200px', fontSize:'16px'}} 
                placeholder={'请输入动态验证码'} />
            </Form.Item>
          </Col>
          <Col >
            <CountButton form={form} bRef={btdRef} name={"mobile"} />
          </Col>
        </Row>
      </Form.Item>

      {error && (
        <p className="rounded-lg bg-red-100 p-2 text-red-700">{error}.</p>
      )}

      <Form.Item 
        style={{ marginBottom: '8px' }}
      >
      <button
        type="submit"
        disabled={isLoading || isDisabled}
        className="inline-flex w-full items-center justify-center rounded-lg bg-black p-2 py-3 text-sm font-medium text-white outline-none focus:ring-2 focus:ring-black focus:ring-offset-1 disabled:bg-gray-400"
      >
        {isLoading ? 'Please wait...' : '继续'}
      </button>
      </Form.Item>
    </Form>
  );
}
