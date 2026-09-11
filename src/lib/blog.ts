import { getCollection, type CollectionEntry } from 'astro:content';

import { site } from '../site.config';

export const SITE_URL = site.url;

export const CATEGORY_LABELS: Record<string, string> = {
  'guide': 'Guide',
  'comparison': 'Comparison',
  'reference': 'Reference',
  'migration': 'Migration',
  'explainer': 'Explainer',
};

export type BlogPost = CollectionEntry<'blog'>;

export async function getPublishedPosts(): Promise<BlogPost[]> {
  const posts = await getCollection('blog', ({ data }) => !data.draft);
  return posts.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
}

export function readingTime(body: string | undefined): number {
  const words = (body ?? '').trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 220));
}

export function postUrl(post: BlogPost): string {
  return `${SITE_URL}/blog/${post.id}/`;
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' });
}

/** Related posts: same category first, then shared tags, newest first. */
export function relatedPosts(post: BlogPost, all: BlogPost[], limit = 3): BlogPost[] {
  const others = all.filter((p) => p.id !== post.id);
  const score = (p: BlogPost) => {
    let s = 0;
    if (p.data.category === post.data.category) s += 2;
    s += p.data.tags.filter((t) => post.data.tags.includes(t)).length;
    return s;
  };
  return others
    .map((p) => ({ p, s: score(p) }))
    .sort((a, b) => b.s - a.s || b.p.data.pubDate.valueOf() - a.p.data.pubDate.valueOf())
    .slice(0, limit)
    .map(({ p }) => p);
}

export const PLATFORM_LABELS: Record<string, string> = {
  'gitlab': 'GitLab',
  'azure-devops': 'Azure DevOps',
  'bitbucket': 'Bitbucket',
  'multi': 'Across platforms',
};

/** Published guides for one forge, newest first. */
export async function getPostsForPlatform(platform: string) {
  return (await getPublishedPosts()).filter((p) => p.data.platform === platform);
}
