// @ts-check
import { defineConfig } from 'astro/config';
import { execFileSync } from 'node:child_process';
import { readFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

import tailwindcss from '@tailwindcss/vite';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel';

const root = path.dirname(fileURLToPath(import.meta.url));

/** Last commit date (ISO 8601) for a tracked file, or now for one with no git history yet. */
function gitLastModified(relativePath) {
  try {
    const out = execFileSync('git', ['log', '-1', '--format=%cI', '--', relativePath], { cwd: root })
      .toString()
      .trim();
    return out || new Date().toISOString();
  } catch {
    return new Date().toISOString();
  }
}

/** Blog post slug -> ISO lastmod, straight from frontmatter (updatedDate if set, else pubDate). */
function getBlogLastmodBySlug() {
  const blogDir = path.join(root, 'src/content/blog');
  const map = new Map();
  for (const file of readdirSync(blogDir)) {
    if (!/\.mdx?$/.test(file)) continue;
    const raw = readFileSync(path.join(blogDir, file), 'utf-8');
    const frontmatter = raw.match(/^---\n([\s\S]*?)\n---/)?.[1] ?? '';
    const updatedDate = frontmatter.match(/^updatedDate:\s*(\S+)/m)?.[1];
    const pubDate = frontmatter.match(/^pubDate:\s*(\S+)/m)?.[1];
    const date = updatedDate ?? pubDate;
    map.set(file.replace(/\.mdx?$/, ''), date ? new Date(date).toISOString() : new Date().toISOString());
  }
  return map;
}

const blogLastmodBySlug = getBlogLastmodBySlug();
const staticPageLastmod = {
  index: gitLastModified('src/pages/index.astro'),
  about: gitLastModified('src/pages/about.astro'),
  blogIndex: gitLastModified('src/pages/blog/index.astro'),
  platform: gitLastModified('src/pages/platform/[platform].astro'),
};

/** All static pages share one template file, so blog posts are the only per-entry lastmod. */
function serializeSitemapEntry(item) {
  const pathname = new URL(item.url).pathname.replace(/\/+$/, '');
  let lastmod;
  if (pathname === '') lastmod = staticPageLastmod.index;
  else if (pathname === '/about') lastmod = staticPageLastmod.about;
  else if (pathname === '/blog') lastmod = staticPageLastmod.blogIndex;
  else if (pathname.startsWith('/blog/')) lastmod = blogLastmodBySlug.get(pathname.slice('/blog/'.length));
  else if (pathname.startsWith('/platform/')) lastmod = staticPageLastmod.platform;

  return { ...item, lastmod: lastmod ?? item.lastmod };
}

// https://astro.build/config
export default defineConfig({
  site: 'https://mergerequests.dev',
  // Static by default; only routes that opt out (export const prerender = false),
  // like /api/posts, become Vercel serverless functions.
  output: 'static',
  adapter: vercel(),
  vite: {
    plugins: [tailwindcss()]
  },

  integrations: [mdx(), sitemap({
    // Keep non-HTML endpoints (feeds, llms.txt, raw-markdown mirrors) out of the sitemap.
    filter: (page) => !/\.(xml|txt|md|json)$/.test(new URL(page).pathname) && !page.includes('/api/'),
    serialize: serializeSitemapEntry,
  })]
});
