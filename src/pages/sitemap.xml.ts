import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { absoluteUrl } from '../lib/seo';

export const GET: APIRoute = async () => {
  const [posts, projects] = await Promise.all([getCollection('blog'), getCollection('projects')]);

  const staticPaths = ['/', '/about', '/blog', '/projects'];
  const entries: Array<{ path: string; lastmod?: string }> = [
    ...staticPaths.map(path => ({ path })),
    ...posts
      .filter(post => !post.data.draft)
      .map(post => ({
        path: `/blog/${post.id}`,
        lastmod: (post.data.updatedDate ?? post.data.pubDate).toISOString().slice(0, 10),
      })),
    ...projects.map(project => ({ path: `/projects/${project.id}` })),
  ];

  const urls = entries
    .map(entry => {
      const lastmod = entry.lastmod ? `\n    <lastmod>${entry.lastmod}</lastmod>` : '';
      return `  <url>\n    <loc>${absoluteUrl(entry.path)}</loc>${lastmod}\n  </url>`;
    })
    .join('\n');

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;

  return new Response(body, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
};
