import path from 'node:path';
import fs from 'node:fs/promises';

async function getRoadmapIds() {
  return fs.readdir(path.join(process.cwd(), 'src/data/roadmaps'));
}

async function getBestPracticesIds() {
  return fs.readdir(path.join(process.cwd(), 'src/data/best-practices'));
}

export function shouldIndexPage(pageUrl) {
  return ![
    'https://localhost:4321/404',
    // 'https://localhost:4321/terms',
    // 'https://localhost:4321/privacy',
    // 'https://localhost:4321/pdfs',
    // 'https://localhost:4321/g',
  ].includes(pageUrl);
}

export async function serializeSitemap(item) {
  const highPriorityPages = [
    'https://localhost:4321',
    'https://localhost:4321/about',
    'https://localhost:4321/roadmaps',
    // 'https://roadmap.sh/best-practices',
    // 'https://roadmap.sh/guides',
    // 'https://roadmap.sh/videos',
    ...(await getRoadmapIds()).flatMap((id) => [
      `https://localhost:4321/${id}`,
      `https://localhost:4321/${id}/topics`,
    ]),
    ...(await getBestPracticesIds()).map(
      (id) => `https://localhost:4321/best-practices/${id}`
    ),
  ];

  // Roadmaps and other high priority pages
  for (let pageUrl of highPriorityPages) {
    if (item.url === pageUrl) {
      return {
        ...item,
        // @ts-ignore
        changefreq: 'monthly',
        priority: 1,
      };
    }
  }

  // Guide and video pages
  if (
    item.url.startsWith('https://localhost:4321/guides') ||
    item.url.startsWith('https://localhost:4321/videos')
  ) {
    return {
      ...item,
      // @ts-ignore
      changefreq: 'monthly',
      priority: 0.9,
    };
  }

  return undefined;
}
