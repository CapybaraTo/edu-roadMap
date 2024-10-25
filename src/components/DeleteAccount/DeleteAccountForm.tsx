/*
 * @Author: capybarato 1023536640@qq.com
 * @Date: 2024-10-15 11:10:53
 * @LastEditors: capybarato 1023536640@qq.com
 * @LastEditTime: 2024-10-15 11:11:13
 * @FilePath: \roadMapPro\src\components\DeleteAccount\DeleteAccountForm.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { type FormEvent, useEffect, useState } from 'react';
import { httpDelete } from '../../lib/http';
import { logout } from '../Navigation/navigation';

export function DeleteAccountForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [confirmationText, setConfirmationText] = useState('');

  useEffect(() => {
    setError('');
    setConfirmationText('');
  }, []);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (confirmationText.toUpperCase() !== 'DELETE') {
      setError('Verification text does not match');
      setIsLoading(false);
      return;
    }

    const { response, error } = await httpDelete(
      `${import.meta.env.PUBLIC_API_URL}/logout`
    );

    if (error || !response) {
      setIsLoading(false);
      setError(error?.message || 'Something went wrong');
      return;
    }

    logout();
  };

  const handleClosePopup = () => {
    setIsLoading(false);
    setError('');
    setConfirmationText('');

    const deleteAccountPopup = document.getElementById('delete-account-popup');
    deleteAccountPopup?.classList.add('hidden');
    deleteAccountPopup?.classList.remove('flex');
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="my-4">
        <input
          type="text"
          name="delete-account"
          id="delete-account"
          className="mt-2 block w-full rounded-md border border-gray-300 px-3 py-2 outline-none placeholder:text-gray-400 focus:border-gray-400"
          placeholder={'Type "delete" to confirm'}
          required
          autoFocus
          value={confirmationText}
          onInput={(e) =>
            setConfirmationText((e.target as HTMLInputElement).value)
          }
        />
        {error && (
          <p className="mt-2 rounded-lg bg-red-100 p-2 text-red-700">{error}</p>
        )}
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          disabled={isLoading}
          onClick={handleClosePopup}
          className="flex-grow cursor-pointer rounded-lg bg-gray-200 py-2 text-center"
        >
          取消
        </button>
        <button
          type="submit"
          disabled={isLoading || confirmationText.toUpperCase() !== 'DELETE'}
          className="flex-grow cursor-pointer rounded-lg bg-red-500 py-2 text-white disabled:opacity-40"
        >
          {isLoading ? '请稍等...' : '确认'}
        </button>
      </div>
    </form>
  );
}
