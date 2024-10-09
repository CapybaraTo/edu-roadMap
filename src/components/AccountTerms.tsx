/*
 * @Author: capybarato 1023536640@qq.com
 * @Date: 2024-10-03 10:06:49
 * @LastEditors: capybarato 1023536640@qq.com
 * @LastEditTime: 2024-10-04 10:35:06
 * @FilePath: \roadMapPro\src\components\AccountTerms.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
export function AccountTerms() {
  return (
    <div className="mt-3 text-left text-xs leading-normal text-gray-500">
      By continuing to use our services, you acknowledge that you have both read
      and agree to our{' '}
      <a
        href="/terms"
        className="font-medium underline underline-offset-2 hover:text-black"
      >
        Terms of Service
      </a>{' '}
      and{' '}
      <a
        href="/privacy"
        className="font-medium underline underline-offset-2 hover:text-black"
      >
        Privacy Policy（隐私政策）
      </a>
      .
    </div>
  );
}
