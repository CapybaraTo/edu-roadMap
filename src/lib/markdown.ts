/*
 * @Author: capybarato 1023536640@qq.com
 * @Date: 2024-07-26 13:47:53
 * @LastEditors: capybarato 1023536640@qq.com
 * @LastEditTime: 2024-07-26 13:53:56
 * @FilePath: \roadMapPro\src\lib\markdown.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
// @ts-ignore
import MarkdownIt from 'markdown-it';     // Markdown解析器

// 将 Markdown 字符串中的变量占位符如 @variableName@ 替换为具体的值
export function replaceVariables(
  markdown: string,
  variables: Record<string, string> = {},
): string {
  const allVariables: Record<string, string> = {
    ...variables,
    currentYear: new Date().getFullYear().toString(),
  };

  return markdown.replace(/@([^@]+)@/g, (match, p1) => {
    return allVariables[p1] || match;
  });
}

// 使用 markdown-it 库将 Markdown 字符串转换为 HTML
export function markdownToHtml(markdown: string, isInline = true): string {
  try {
    const md = new MarkdownIt({
      html: true,
      linkify: true,
    });

    // 在markdown的新选项卡中打开链接的解决方案
    // 否则，默认是在同一选项卡中打开
    //
    // https://github.com/markdown-it/markdown-it/blob/master/docs/architecture.md#renderer
    //
    const defaultRender =
      md.renderer.rules.link_open ||
      // @ts-ignore
      function (tokens, idx, options, env, self) {
        return self.renderToken(tokens, idx, options);
      };

    // @ts-ignore
    md.renderer.rules.link_open = function (tokens, idx, options, env, self) {
      tokens[idx].attrSet('target', '_blank');
      return defaultRender(tokens, idx, options, env, self);
    };

    if (isInline) {
      return md.renderInline(markdown);
    } else {
      return md.render(markdown);
    }
  } catch (e) {
    return markdown;
  }
}

// 处理 Markdown 中的链接，尤其转义字符的链接
export function sanitizeMarkdown(markdown: string) {
  return markdown.replace(/\\\[([^\\]+)\\\]\(([^\\]+)\)/g, '[$1]($2)');
}
