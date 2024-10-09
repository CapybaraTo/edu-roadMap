/*
 * @Author: capybarato 1023536640@qq.com
 * @Date: 2024-07-26 14:19:25
 * @LastEditors: capybarato 1023536640@qq.com
 * @LastEditTime: 2024-07-26 14:19:57
 * @FilePath: \roadMapPro\src\hooks\use-load-topic
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
// 监听 roadmap.topic.click 和 roadmap.node.click 事件
import { useEffect } from 'react';
import type { ResourceType } from '../lib/resource-progress';

type CallbackType = (data: {
  resourceType: ResourceType;
  resourceId: string;
  topicId: string;
  isCustomResource: boolean;
}) => void;

export function useLoadTopic(callback: CallbackType) {
  useEffect(() => {
    function handleTopicClick(e: any) {
      const {
        resourceType,
        resourceId,
        topicId,
        isCustomResource = false,
      } = e.detail;

      callback({
        resourceType,
        resourceId,
        topicId,
        isCustomResource,
      });
    }

    window.addEventListener(`roadmap.topic.click`, handleTopicClick);
    window.addEventListener(`best-practice.topic.click`, handleTopicClick);
    window.addEventListener(`roadmap.node.click`, handleTopicClick);

    return () => {
      window.removeEventListener(`roadmap.topic.click`, handleTopicClick);
      window.removeEventListener(`best-practice.topic.click`, handleTopicClick);
      window.removeEventListener(`roadmap.node.click`, handleTopicClick);
    };
  }, []);
}
