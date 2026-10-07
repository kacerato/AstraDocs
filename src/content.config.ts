import { defineCollection } from 'astro:content';
import { docsLoader } from '@astrojs/starlight/loaders';
import { docsSchema } from '@astrojs/starlight/schema';
import { z } from 'astro/zod';
export const collections = {
  docs: defineCollection({ loader: docsLoader(), schema: docsSchema({ extend: z.object({
    version: z.string().default('snapshot-2026-10-06'),
    kind: z.enum(['guide','api','component','recipe','index','release','diagnostic','roadmap']).default('guide'),
    status: z.enum(['source-reviewed','semantic-reference','editorial','partial']).default('source-reviewed'),
    reviewedAt: z.string().default('2026-10-06'),
    runtimeVerified: z.boolean().default(false),
  }) }) }),
};
