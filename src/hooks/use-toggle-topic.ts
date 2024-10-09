/*
 * @Author: capybarato 1023536640@qq.com
 * @Date: 2024-07-26 14:23:34
 * @LastEditors: capybarato 1023536640@qq.com
 * @LastEditTime: 2024-08-15 15:43:02
 * @FilePath: \roadMapPro\src\hooks\use-toggle-topic
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
// 监听事件，当事件触发时执行传入的回调函数
import { useEffect } from 'react';
import type { ResourceType } from '../lib/resource-progress';

type CallbackType = (data: {
  resourceType: ResourceType;
  resourceId: string;
  topicId: string;
}) => void;

export function useToggleTopic(callback: CallbackType) {
  useEffect(() => {
    function handleToggleTopic(e: any) {
      const { resourceType, resourceId, topicId } = e.detail;

      callback({
        resourceType,
        resourceId,
        topicId,
      });
    }

    window.addEventListener(`roadmap.topic.toggle`, handleToggleTopic);
    window.addEventListener(`best-practice.topic.toggle`, handleToggleTopic);
    return () => {
      window.removeEventListener(
        `best-practice.topic.toggle`,
        handleToggleTopic
      );
    };
  }, []);
}
