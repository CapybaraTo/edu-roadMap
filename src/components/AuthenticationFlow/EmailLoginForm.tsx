import type { FormEvent } from 'react';   // 表单事件
import { useState } from 'react';
import { httpPost } from '../../lib/http';
import { setAuthToken } from '../../lib/jwt';

// 
type EmailLoginFormProps = {
  isDisabled?: boolean;
  setIsDisabled?: (isDisabled: boolean) => void;
};

// 邮箱表单提交
export function EmailLoginForm(props: EmailLoginFormProps) {
  const { isDisabled, setIsDisabled } = props;

  const [email, setEmail] = useState<string>(''); 
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState('');

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleFormSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setIsDisabled?.(true);
    setError('');

    const { response, error } = await httpPost<{ token: string }>(
      `${import.meta.env.PUBLIC_API_URL}/v1-login`,
      {
        email,
        password,
      },
    );

    // Log the user in and reload the page
    if (response?.token) {
      setAuthToken(response.token);
      window.location.reload();
      return;
    }

    // @todo use proper types
    if ((error as any).type === 'user_not_verified') {
      window.location.href = `/verification-pending?email=${encodeURIComponent(
        email,
      )}`;
      return;
    }

    setIsLoading(false);
    setIsDisabled?.(false);
    setError(error?.message || '出现错误，请稍后重试。');
  };

  return (
    <form className="w-full" onSubmit={handleFormSubmit}>
      <label htmlFor="email" className="sr-only">
        邮件地址
      </label>
      <input
        name="email"
        type="email"
        autoComplete="email"
        required
        className="block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm outline-none placeholder:text-gray-400 focus:ring-2 focus:ring-black focus:ring-offset-1"
        placeholder="邮箱"
        value={email}
        onInput={(e) => setEmail(String((e.target as any).value))}
      />
      <label htmlFor="password" className="sr-only">
        密码
      </label>
      <input
        name="password"
        type="password"
        autoComplete="current-password"
        required
        className="mt-2 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm outline-none placeholder:text-gray-400 focus:ring-2 focus:ring-black focus:ring-offset-1"
        placeholder="密码"
        value={password}
        onInput={(e) => setPassword(String((e.target as any).value))}
      />

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

      <button
        type="submit"
        disabled={isLoading || isDisabled}
        className="inline-flex w-full items-center justify-center rounded-lg bg-black p-2 py-3 text-sm font-medium text-white outline-none focus:ring-2 focus:ring-black focus:ring-offset-1 disabled:bg-gray-400"
      >
        {isLoading ? '请稍等...' : '继续'}
      </button>
    </form>
  );
}
