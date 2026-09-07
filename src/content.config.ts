import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// Blog posts — drop a .md file in src/content/blog/ and it appears on /blog.
const blog = defineCollection({
  loader: glob({ pattern: '**/[^_]*.{md,mdx}', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    tags: z.array(z.string()).default([]),
    // Slug of a project entry this post relates to (optional).
    project: z.string().optional(),
    draft: z.boolean().default(false),
  }),
});

// Portfolio projects — one markdown file per project in src/content/projects/.
const projects = defineCollection({
  loader: glob({ pattern: '**/[^_]*.{md,mdx}', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    role: z.string(),
    period: z.string().optional(),
    repo: z.string().optional(),
    live: z.string().optional(),
    stack: z.array(z.string()).default([]),
    // active | completed | archived | private
    status: z.enum(['active', 'completed', 'archived', 'private']).default('completed'),
    summary: z.string(),
    featured: z.boolean().default(false),
    // Lower = higher up the list; featured items float to top first.
    order: z.number().default(0),
    tags: z.array(z.string()).default([]),
  }),
});

export const collections = { blog, projects };
