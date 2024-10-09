/*
 * @Author: capybarato 1023536640@qq.com
 * @Date: 2024-08-15 16:21:59
 * @LastEditors: capybarato 1023536640@qq.com
 * @LastEditTime: 2024-08-15 16:22:09
 * @FilePath: \roadMapPro\src\lib\author.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import type { MarkdownFileType } from './file';

export interface AuthorFrontmatter {
  name: string;
  imageUrl: string;
  employment?: {
    title: string;
    company: string;
  };
  social: {
    twitter: string;
    github: string;
    linkedin: string;
    website: string;
  };
}

export type AuthorFileType = MarkdownFileType<AuthorFrontmatter> & {
  id: string;
};

function authorPathToId(filePath: string): string {
  const fileName = filePath.split('/').pop() || '';

  return fileName.replace('.md', '');
}

/**
 * Gets the IDs of all the authors available on the website
 *
 * @returns string[] Array of author IDs
 */
export async function getAuthorIds() {
  const authorFiles = import.meta.glob<AuthorFileType>(
    '/src/data/authors/*.md',
    {
      eager: true,
    },
  );

  return Object.keys(authorFiles).map(authorPathToId);
}

export async function getAllAuthors(): Promise<AuthorFileType[]> {
  const authorFilesMap: Record<string, AuthorFileType> =
    import.meta.glob<AuthorFileType>('/src/data/authors/*.md', {
      eager: true,
    });

  const authorFiles = Object.values(authorFilesMap);

  return authorFiles.map((authorFile) => ({
    ...authorFile,
    id: authorPathToId(authorFile.file),
  }));
}

export async function getAuthorById(id: string): Promise<AuthorFileType> {
  const authorFilesMap: Record<string, AuthorFileType> =
    import.meta.glob<AuthorFileType>('/src/data/authors/*.md', {
      eager: true,
    });

  const authorFile = Object.values(authorFilesMap).find((authorFile) => {
    return authorPathToId(authorFile.file) === id;
  });

  if (!authorFile) {
    throw new Error(`Author with ID ${id} not found`);
  }

  return {
    ...authorFile,
    id: authorPathToId(authorFile.file),
  };
}
