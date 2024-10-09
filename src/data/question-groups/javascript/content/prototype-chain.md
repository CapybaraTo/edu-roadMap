<!--
 * @Author: capybarato 1023536640@qq.com
 * @Date: 2024-10-08 19:23:45
 * @LastEditors: capybarato 1023536640@qq.com
 * @LastEditTime: 2024-10-08 20:42:31
 * @FilePath: \roadMapPro\src\data\question-groups\javascript\content\prototype-chain.md
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
The prototype chain in JavaScript refers to the chain of objects linked by their prototypes. When a property or method is accessed on an object, JavaScript first checks the object itself. If it doesn't find it there, it looks up the property or method in the object's prototype. This process continues, moving up the chain from one prototype to the next, until the property or method is found or the end of the chain is reached (typically the prototype of the base object, which is `null`). The prototype chain is fundamental to JavaScript's prototypal inheritance model, allowing objects to inherit properties and methods from other objects.

## Example

```js
const roadmap = {
  getRoadmapUrl() {
    // console.log(`https://roadmap.sh/${this.slug}`);
    console.log(`https://localhost:4321/${this.slug}`);
  },
};

const javascript = {
  name: 'JavaScript 学习路线图',
  description: 'Learn JavaScript',
  slug: 'javascript',
  greet() {
    console.log(`${this.name} - ${this.description}`);
  },
};

Object.setPrototypeOf(javascript, roadmap); // or javascript.__proto__ = roadmap;

javascript.getRoadmapUrl(); // https://roadmap.sh/javascript
javascript.greet(); // JavaScript Roadmap - Learn JavaScript
```

In the above example, the `javascript` object inherits the `getRoadmapUrl()` method from the `roadmap` object. This is because the `javascript` object's prototype is set to the `roadmap` object using the `Object.setPrototypeOf()` method. In the `javascript` object, the `getRoadmapUrl()` method is not found, so JavaScript looks up the prototype chain and finds the `getRoadmapUrl()` method in the `roadmap` object.
