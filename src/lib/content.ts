import type { CollectionEntry } from 'astro:content';

const WORDS_PER_MINUTE = 220;

export function readingTime(body: string | undefined): number {
  const text = (body ?? '').trim();
  if (!text) return 1;
  const words = text.split(/\s+/).length;
  return Math.max(1, Math.round(words / WORDS_PER_MINUTE));
}

function sharedTagCount(a: string[], b: string[]): number {
  const tags = new Set(b);
  return a.filter(tag => tags.has(tag)).length;
}

export function relatedPosts(
  post: CollectionEntry<'blog'>,
  all: CollectionEntry<'blog'>[],
): CollectionEntry<'blog'>[] {
  return all
    .filter(other => other.id !== post.id)
    .map(other => {
      const sameProject = post.data.project && other.data.project === post.data.project ? 1 : 0;
      const score = sameProject * 10 + sharedTagCount(post.data.tags, other.data.tags);
      return { other, score };
    })
    .sort((a, b) => b.score - a.score || b.other.data.pubDate.valueOf() - a.other.data.pubDate.valueOf())
    .slice(0, 3)
    .map(({ other }) => other);
}

export function relatedProjects(
  project: CollectionEntry<'projects'>,
  all: CollectionEntry<'projects'>[],
): CollectionEntry<'projects'>[] {
  return all
    .filter(other => other.id !== project.id)
    .map(other => ({ other, score: sharedTagCount(project.data.tags, other.data.tags) }))
    .sort((a, b) => b.score - a.score || a.other.data.order - b.other.data.order)
    .slice(0, 3)
    .map(({ other }) => other);
}

export function slugifyHeading(text: string): string {
  return text
    .toLowerCase()
    .replace(/<[^>]+>/g, '')
    .replace(/[`*_~]/g, '')
    .replace(/[^\p{L}\p{N}\s-]/gu, '')
    .trim()
    .replace(/\s+/g, '-');
}

export interface Heading {
  id: string;
  text: string;
}

export function extractHeadings(body: string | undefined, levels: number[] = [2]): Heading[] {
  const headings: Heading[] = [];
  for (const line of (body ?? '').split('\n')) {
    const match = /^(#{2,3})\s+(.+?)\s*$/.exec(line);
    if (!match) continue;
    if (!levels.includes(match[1].length)) continue;
    const text = match[2].replace(/[`*_~]/g, '').trim();
    headings.push({ id: slugifyHeading(text), text });
  }
  return headings;
}
