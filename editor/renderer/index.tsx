export function Renderer(props: any) {
  return (
    <div className="fixed bottom-0 left-0 right-0 top-0 z-[9999] border bg-white p-5 text-black">
      <h2 className="mb-2 text-xl font-semibold">Private Component</h2>
      <p className="mb-4">
      渲染器是一个私有组件。如果你是一名合作者，并且
      访问它。运行以下命令：
      </p>
      <code className="mt-5 rounded-md bg-gray-800 p-2 text-white">
        npm run generate-renderer
      </code>
    </div>
  );
}
