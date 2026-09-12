import { getPublishedPosts, SITE_URL, CATEGORY_LABELS, PLATFORM_LABELS } from '../lib/blog';
import { site } from '../site.config';

// llms.txt — index of the site for LLMs/AI agents (https://llmstxt.org)
export async function GET() {
  const posts = await getPublishedPosts();
  const lastUpdated = posts.reduce((latest, post) => {
    const updated = post.data.updatedDate ?? post.data.pubDate;
    return updated > latest ? updated : latest;
  }, new Date(0));

  const lines: string[] = [
    `# ${site.name}`,
    '',
    `> Technical guides and comparisons for engineering teams using GitLab, Azure DevOps, and Bitbucket. Covers merge request workflow, CI/CD, code review, security, metrics, and platform migrations.`,
    '',
    '## Editorial scope',
    '',
    `${site.name} is organized by forge, not by vendor or publishing date. It helps teams evaluate workflows and tooling across GitLab, Azure DevOps, and Bitbucket, including self-managed and enterprise environments.`,
    '',
    `Claims about products are sourced from vendor documentation and dated when checked. The site is sponsored by ${site.maintainer.name}; the editorial method and funding disclosure are available at ${SITE_URL}/about/.`,
    '',
    '## Start here',
    '',
    `- [GitLab](${SITE_URL}/platform/gitlab/)`,
    `- [Azure DevOps](${SITE_URL}/platform/azure-devops/)`,
    `- [Bitbucket](${SITE_URL}/platform/bitbucket/)`,
    `- [Cross-platform guides](${SITE_URL}/platform/multi/)`,
    `- [Blog](${SITE_URL}/blog/)`,
    `- [About, methodology, and funding](${SITE_URL}/about/)`,
    `- [RSS](${SITE_URL}/rss.xml)`,
    `- [Sitemap](${SITE_URL}/sitemap-index.xml)`,
    `- [Complete machine-readable content](${SITE_URL}/llms-full.txt)`,
    '',
    '## Content available in Markdown',
    '',
    'Each published article has a Markdown version at the article URL with `.md` appended.',
    '',
    `Last updated: ${lastUpdated.toISOString().slice(0, 10)}`,
    '',
    '## Articles',
  ];

  for (const platform of site.platforms) {
    const platformPosts = posts.filter((post) => post.data.platform === platform.key);
    if (!platformPosts.length) continue;

    lines.push('', `### ${PLATFORM_LABELS[platform.key] ?? platform.label}`);
    for (const category of Object.keys(CATEGORY_LABELS)) {
      const categoryPosts = platformPosts.filter((post) => post.data.category === category);
      if (!categoryPosts.length) continue;

      lines.push('', `#### ${CATEGORY_LABELS[category]}`, '');
      for (const post of categoryPosts) {
        const date = post.data.updatedDate ?? post.data.pubDate;
        lines.push(
          `- [${post.data.title}](${SITE_URL}/blog/${post.id}/) — ${CATEGORY_LABELS[post.data.category]} · ${PLATFORM_LABELS[post.data.platform]} · ${date.toISOString().slice(0, 10)}`,
          `  ${post.data.description}`,
        );
      }
    }
  }

  lines.push('');
  return new Response(lines.join('\n'), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
