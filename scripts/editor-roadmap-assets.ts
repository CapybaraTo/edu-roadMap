/*
 * @Author: capybarato 1023536640@qq.com
 * @Date: 2024-10-25 21:49:59
 * @LastEditors: capybarato 1023536640@qq.com
 * @LastEditTime: 2024-10-25 21:52:06
 * @FilePath: \roadMapPro\scripts\editor-roadmap-assets.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import playwright from 'playwright';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import matter from 'gray-matter';
import type { RoadmapFrontmatter } from '../src/lib/roadmap';

// ERROR: `__dirname` is not defined in ES module scope
// https://iamwebwiz.medium.com/how-to-fix-dirname-is-not-defined-in-es-module-scope-34d94a86694d
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Usage: tsx ./scripts/editor-roadmap-dirs.ts <roadmapId>

// Directory containing the roadmaps
const ROADMAP_CONTENT_DIR = path.join(__dirname, '../src/data/roadmaps');
const roadmapId = process.argv[2];

const allowedRoadmapIds = await fs.readdir(ROADMAP_CONTENT_DIR);
if (!roadmapId) {
  console.error('Roadmap Id is required');
  process.exit(1);
}

if (!allowedRoadmapIds.includes(roadmapId)) {
  console.error(`Invalid roadmap key ${roadmapId}`);
  console.error(`Allowed keys are ${allowedRoadmapIds.join(', ')}`);
  process.exit(1);
}

const roadmapFrontmatterDir = path.join(
  ROADMAP_CONTENT_DIR,
  roadmapId,
  `${roadmapId}.md`,
);
const roadmapFrontmatterRaw = await fs.readFile(roadmapFrontmatterDir, 'utf-8');
const { data } = matter(roadmapFrontmatterRaw);

const roadmapFrontmatter = data as RoadmapFrontmatter;
if (!roadmapFrontmatter) {
  console.error('Invalid roadmap frontmatter');
  process.exit(1);
}

if (roadmapFrontmatter.renderer !== 'editor') {
  console.error('Only Editor Rendered Roadmaps are allowed');
  process.exit(1);
}

console.log(`Launching chromium`);
const browser = await playwright.chromium.launch();
const context = await browser.newContext();
const page = await context.newPage();

const pageUrl = `http://localhost:4321/${roadmapId}/svg`;
console.log(`Opening page ${pageUrl}`);
await page.goto(pageUrl);
await page.waitForSelector('#resource-svg-wrap');
await page.waitForTimeout(5000);
console.log(`Generating PDF ${pageUrl}`);
await page.pdf({
  path: `./public/pdfs/roadmaps/${roadmapId}.pdf`,
  margin: { top: 0, right: 0, bottom: 0, left: 0 },
  height: roadmapFrontmatter?.dimensions?.height || 2000,
  width: roadmapFrontmatter?.dimensions?.width || 968,
});

// @todo generate png from the pdf
console.log(`Generating png ${pageUrl}`);
await page.locator('#resource-svg-wrap>svg').screenshot({
  path: `./public/roadmaps/${roadmapId}.png`,
  type: 'png',
  scale: 'device',
});

await browser.close();
