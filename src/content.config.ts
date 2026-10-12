import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    published: z.coerce.date(),
    updated: z.coerce.date().optional(),
    summary: z.string().max(120),
    tags: z.array(z.string()).default([]),
    hero: z.string().url().optional(),
    repo: z.string().url().optional(),
    demo: z.string().url().optional(),
    relatedArticles: z
      .array(
        z.object({
          title: z.string(),
          url: z.string().url(),
        })
      )
      .default([]),
    featured: z.boolean().default(false),
    draft: z.boolean().default(false),
  }),
});

const about = defineCollection({
  loader: glob({ pattern: 'index.md', base: './src/content/about' }),
  schema: z.object({
    name: z.string(),
    affiliation: z.string(),
    field: z.string(),
    interests: z.array(z.string()).default([]),
    history: z
      .array(
        z.object({
          year: z.string(),
          event: z.string(),
        })
      )
      .default([]),
  }),
});

export const collections = { projects, about };
