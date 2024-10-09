/*
 * @Author: capybarato 1023536640@qq.com
 * @Date: 2024-07-19 16:29:47
 * @LastEditors: capybarato 1023536640@qq.com
 * @LastEditTime: 2024-07-19 16:30:03
 * @FilePath: \roadMapPro\editor\readonly-editor.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
export function ReadonlyEditor(props: any) {
  return (
    <div className="fixed bottom-0 left-0 right-0 top-0 z-[9999] border bg-white p-5 text-black">
      <h2 className="mb-2 text-xl font-semibold">Private Component</h2>
      <p className="mb-4">
        Renderer is a private component. If you are a collaborator and have
        access to it. Run the following command:
      </p>
      <code className="mt-5 rounded-md bg-gray-800 p-2 text-white">
        npm run generate-renderer
      </code>
    </div>
  );
}
