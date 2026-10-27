export type OgKind = 'home' | 'about' | 'blog' | 'post' | 'projects' | 'project';

export const OG_IMAGE: Record<OgKind, string> = {
  home: '/og/home.png',
  about: '/og/about.png',
  blog: '/og/blog.png',
  post: '/og/post.png',
  projects: '/og/projects.png',
  project: '/og/project.png',
};

export const OG_IMAGE_ALT: Record<OgKind, string> = {
  home: 'Mauro Eijsenring — platform and infrastructure engineer',
  about: 'Taking prototypes to production platforms',
  blog: 'Field notes from operating platforms',
  post: 'The command, the commit, the tradeoff',
  projects: 'Prototypes turned into platforms',
  project: 'The problem, the role, the hard part',
};

export function canonicalPath(pathname: string): string {
  const withoutIndex = pathname.replace(/index\.html$/, '');
  const trimmed = withoutIndex.replace(/\/+$/, '');
  return trimmed === '' ? '/' : trimmed;
}

export function absoluteUrl(path: string): string {
  return new URL(path, 'https://sooth.dev').href;
}

export function ogKindFor(pathname: string): OgKind {
  const path = canonicalPath(pathname);
  if (path === '/') return 'home';
  if (path === '/about') return 'about';
  if (path === '/blog') return 'blog';
  if (path.startsWith('/blog/')) return 'post';
  if (path === '/projects') return 'projects';
  if (path.startsWith('/projects/')) return 'project';
  return 'home';
}

const SITE_SUFFIX = ' — sooth.dev';

export function pageTitle(short: string): string {
  const title = short.trim().replace(/\s+/g, ' ');
  if (title.length + SITE_SUFFIX.length <= 60) return title + SITE_SUFFIX;
  if (title.length <= 60) return title;
  return title.slice(0, 57).trimEnd() + '…';
}

export function trimDescription(description: string): string {
  const text = description.trim().replace(/\s+/g, ' ');
  if (text.length <= 160) return text;
  return text.slice(0, 157).trimEnd() + '…';
}
