/*
 * @Author: capybarato 1023536640@qq.com
 * @Date: 2024-10-08 10:19:29
 * @LastEditors: capybarato 1023536640@qq.com
 * @LastEditTime: 2024-10-08 10:20:12
 * @FilePath: \roadMapPro\src\components\Roadmaps\RoadmapsPageHeader.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { isLoggedIn } from '../../lib/jwt.ts';
import { showLoginPopup } from '../../lib/popup.ts';

export function RoadmapsPageHeader() {
  return (
    <div className="bg-white py-3 sm:py-12">
      <div className="container">
        <div className="flex flex-col items-start bg-white sm:items-center">
          <h1 className="text-2xl font-bold sm:text-5xl">Developer Roadmaps</h1>
          <p className="mb-3 mt-1 text-sm sm:my-3 sm:text-lg">
            Browse the ever-growing list of up-to-date, community driven
            roadmaps
          </p>
          <p className="mb-3 flex w-full flex-col gap-1.5 sm:mb-0 sm:w-auto sm:flex-row sm:gap-3">
            {/* <a
              className="inline-block rounded-md bg-black px-3.5 py-2 text-sm text-white sm:py-1.5 sm:text-base"
              href="https://draw.roadmap.sh"
              onClick={(e) => {
                if (!isLoggedIn()) {
                  e.preventDefault();
                  showLoginPopup();
                }
              }}
            >
              Draw your own roadmap
            </a> */}
            <a
              className="inline-block rounded-md bg-gray-300 px-3.5 py-2 text-sm text-black sm:py-1.5 sm:text-base"
              // href="https://roadmap.sh/ai"
              href="https://localhost:4321/ai"
              onClick={(e) => {
                if (!isLoggedIn()) {
                  e.preventDefault();
                  showLoginPopup();
                }
              }}
            >
              人工智能Generate Roadmaps with AI
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
