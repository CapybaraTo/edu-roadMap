
import { wireframeJSONToSVG } from 'roadmap-renderer';  //导入wireframeJSONToSVG函数，用于将JSON格式的线框图转换为SVG元素
import { isLoggedIn } from '../../lib/jwt';  // 导入isLoggedIn函数，用于检查用户是否登录
import type {
  ResourceProgressType,
  ResourceType,
} from '../../lib/resource-progress';  // 资源进度
import {
  refreshProgressCounters,
  renderResourceProgress,
  renderTopicProgress,
  updateResourceProgress,
} from '../../lib/resource-progress';
import { pageProgressMessage } from '../../stores/page';   // 页面进度
import { showLoginPopup } from '../../lib/popup.ts';  // 登录弹窗
import { replaceChildren } from '../../lib/dom.ts';  // 替换DOM元素的子元素
import { setUrlParams } from '../../lib/browser.ts';  // 设置URL参数

// 包括资源ID、资源类型、JSON URL、加载器HTML内容
export class Renderer {
  resourceId: string;
  resourceType: ResourceType | string;
  jsonUrl: string;
  loaderHTML: string | null;

  containerId: string;
  loaderId: string;

  // 构造函数，初始化属性并绑定方法到类的实例
  constructor() {
    // 初始化属性
    this.resourceId = '';
    this.resourceType = '';
    this.jsonUrl = '';
    this.loaderHTML = null;

    // 设置容器和加载器的ID
    this.containerId = 'resource-svg-wrap';
    this.loaderId = 'resource-loader';

    // 绑定方法，确保在回调中使用正确的this上下文
    this.init = this.init.bind(this);
    this.onDOMLoaded = this.onDOMLoaded.bind(this);
    this.jsonToSvg = this.jsonToSvg.bind(this);
    this.handleSvgClick = this.handleSvgClick.bind(this);
    this.handleSvgRightClick = this.handleSvgRightClick.bind(this);
    this.prepareConfig = this.prepareConfig.bind(this);
    this.switchRoadmap = this.switchRoadmap.bind(this);
    this.updateTopicStatus = this.updateTopicStatus.bind(this);
  }

   // 获取加载器元素的getter方法
  get loaderEl() {
    return document.getElementById(this.loaderId);
  }

  // 获取容器元素的getter方法
  get containerEl() {
    return document.getElementById(this.containerId);
  }

  // 准备配置信息的方法
  prepareConfig() {
    // 如果容器元素不存在，返回false
    if (!this.containerEl) {
      return false;
    }

    // 克隆加载器HTML，以便之后使用
    this.loaderHTML = this.loaderEl!.innerHTML;
    const dataset = this.containerEl.dataset;
// 从数据属性中获取资源类型和资源ID
    this.resourceType = dataset.resourceType!;
    this.resourceId = dataset.resourceId!;

    return true;
  }

  /**
   * @param { string } jsonUrl
   * @returns {Promise<SVGElement>}
   */
  // 将JSON转换为SVG元素的方法
  jsonToSvg(jsonUrl: string) {
    // console.log('jsonUrl:',jsonUrl);
    // 检查jsonUrl是否已定义
    if (!jsonUrl) {
      console.error('检查jsonUrl是否已定义jsonUrl not defined in frontmatter');
      return null;
    }

    // 检查容器元素是否存在
    if (!this.containerEl) {
      // console.log('检查容器元素是否存在');
      return null;
    }
// 将容器元素的内容设置为加载器HTML
    this.containerEl.innerHTML = this.loaderHTML!;

    // 使用fetch获取JSON数据并转换为SVG
    return fetch(jsonUrl)
      .then((res) => {
        // console.log('res:',res);        
        return res.json();
      })
      .then((json) => {
        console.log('json:',json);        
        return wireframeJSONToSVG(json, {
          fontURL: '/fonts/balsamiq.woff2',
        });
      })
      .then((svg) => {
        // 替换容器元素的子元素为SVG
        console.log('替换容器元素的子元素为SVG')
        replaceChildren(this.containerEl!, svg);
      })
      .then(() => {
        // 渲染资源进度
        return renderResourceProgress(
          this.resourceType as ResourceType,
          this.resourceId,
        );
      })
      .catch((error) => {
        if (!this.containerEl) {
          return;
        }
        const message = 
        `
          <strong>这里有一个错误.</strong><br>
          尝试重新加载页面. 位于./components/FrameRenderer/renderer.ts。or submit an issue on GitHub with following:<br><br>
          ${error.message} <br /> ${error.stack}
        `;
        this.containerEl.innerHTML = `<div class="error py-5 text-center text-red-600 mx-auto">${message}</div>`;
      });
  }

  // 当DOM加载完成时调用的方法
  onDOMLoaded() {
    // 准备配置信息
    if (!this.prepareConfig()) {
      return;
    }

    // 从URL参数中获取路线图类型
    const urlParams = new URLSearchParams(window.location.search);
    const roadmapType = urlParams.get('r');

    // 根据路线图类型切换JSON文件或渲染SVG
    if (roadmapType) {
      this.switchRoadmap(`/${roadmapType}.json`);
    } else {
      this.jsonToSvg(
        this.resourceType === 'roadmap'
          ? `/${this.resourceId}.json`
          // : `/best-practices/${this.resourceId}.json`,
          : '/${this.resourceId}.json'
      );
    }
  }

  // 切换路线图JSON文件的方法
  switchRoadmap(newJsonUrl: string) {
    // 清除容器元素的样式
    this.containerEl?.setAttribute('style', '');

    // 获取新的JSON文件名称
    const newJsonFileSlug = newJsonUrl.split('/').pop()?.replace('.json', '');

    // 设置URL参数
    const type = this.resourceType[0]; // r for roadmap, b for best-practices
    setUrlParams({ [type]: newJsonFileSlug! });

    // 使用新的JSON URL渲染SVG
    this.jsonToSvg(newJsonUrl)?.then(() => {});
  }

  // 更新主题状态的方法
  updateTopicStatus(topicId: string, newStatus: ResourceProgressType) {
    if (!isLoggedIn()) {
      showLoginPopup();
      return;
    }

    // roadmap2 新版
    if (/^check:/.test(topicId)) {
      topicId = topicId.replace('check:', '');
    }

    // 设置页面进度信息
    pageProgressMessage.set('更新进度');
    // 更新资源进度
    updateResourceProgress(
      {
        resourceId: this.resourceId,
        resourceType: this.resourceType as ResourceType,
        topicId,
      },
      newStatus,
    )
      .then(() => {
        // 渲染主题进度
        renderTopicProgress(topicId, newStatus);
        // 刷新进度计数器
        refreshProgressCounters();
      })
      .catch((err) => {
        alert('Something went wrong, please try again.');
        console.error(err);
      })
      .finally(() => {
        pageProgressMessage.set('');
      });

    return;
  }

  // 定义了处理SVG元素右键点击事件的方法
  handleSvgRightClick(e: any) {
    // 尝试获取触发事件的元素，并查找最近的<g>元素祖先。
    const targetGroup = e.target?.closest('g') || {};
    const groupId = targetGroup.dataset ? targetGroup.dataset.groupId : '';
    if (!groupId) {
      return;
    }

    // 右键  直接删除
    if (targetGroup.classList.contains('removed')) {
      return;
    }

    e.preventDefault();

    const isCurrentStatusDone = targetGroup.classList.contains('done');
    // 清理groupId的前缀，移除数字和短横线
    const normalizedGroupId = groupId.replace(/^\d+-/, '');

    if (normalizedGroupId.startsWith('ext_link:')) {
      return;
    }

    this.updateTopicStatus(
      normalizedGroupId,
      !isCurrentStatusDone ? 'done' : 'pending',
    );
  }

  handleSvgClick(e: any) {
    const targetGroup = e.target?.closest('g') || {};
    const groupId = targetGroup.dataset ? targetGroup.dataset.groupId : '';
    if (!groupId) {
      return;
    }

    e.stopImmediatePropagation();

    if (targetGroup.classList.contains('removed')) {
      return;
    }


    if (/^ext_link/.test(groupId)) {
      const externalLink = groupId.replace('ext_link:', '');

      if (!externalLink.startsWith('localhost:4321')) {
        // window.fireEvent
        (window as any).fireEvent({
          category: 'RoadmapExternalLink',
          action: `${this.resourceType} / ${this.resourceId}`,
          label: externalLink,
        });

        window.open(`https://${externalLink}`);
      } else {
        window.location.href = `https://${externalLink}`;
      }

      return;
    }

    if (/^json:/.test(groupId)) {
      // e.g. /roadmaps/frontend-beginner.json
      const newJsonUrl = groupId.replace('json:', '');

      this.switchRoadmap(newJsonUrl);
      return;
    }

    if (/^check:/.test(groupId)) {
      window.dispatchEvent(
        new CustomEvent(`${this.resourceType}.topic.toggle`, {
          detail: {
            topicId: groupId.replace('check:', ''),
            resourceType: this.resourceType,
            resourceId: this.resourceId,
          },
        }),
      );
      return;
    }

    // Remove sorting prefix from groupId
    const normalizedGroupId = groupId.replace(/^\d+-/, '');

    const isCurrentStatusLearning = targetGroup.classList.contains('learning');
    const isCurrentStatusSkipped = targetGroup.classList.contains('skipped');

    if (e.shiftKey) {
      e.preventDefault();
      this.updateTopicStatus(
        normalizedGroupId,
        !isCurrentStatusLearning ? 'learning' : 'pending',
      );
      return;
    }

    if (e.altKey) {
      e.preventDefault();
      this.updateTopicStatus(
        normalizedGroupId,
        !isCurrentStatusSkipped ? 'skipped' : 'pending',
      );

      return;
    }

    window.dispatchEvent(
      new CustomEvent(`${this.resourceType}.topic.click`, {
        detail: {
          topicId: normalizedGroupId,
          resourceId: this.resourceId,
          resourceType: this.resourceType,
        },
      }),
    );
  }

  init() {
    window.addEventListener('DOMContentLoaded', this.onDOMLoaded);
    window.addEventListener('click', this.handleSvgClick);
    window.addEventListener('contextmenu', this.handleSvgRightClick);
  }
}

const renderer = new Renderer();
renderer.init();
