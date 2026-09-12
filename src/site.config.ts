/**
 * Everything that makes this site *this* site. A sibling in the network copies
 * the repo and edits this file; nothing else should hardcode the domain, the
 * name or the editorial line.
 */
/**
 * The two closed sets the content model enforces. They live here, next to the
 * platform rails, because three consumers need them and only one of them can
 * import `astro:content`: the collection schema, the pages, and the content API
 * route that writes a post's frontmatter. When the API kept its own copy the two
 * drifted within a day and every API-written post failed the schema at build.
 */
export const PLATFORMS = ['gitlab', 'azure-devops', 'bitbucket', 'multi'] as const;
export const BLOG_CATEGORIES = ['guide', 'comparison', 'reference', 'migration', 'explainer'] as const;

export const site = {
  url: 'https://mergerequests.dev',
  name: 'mergerequests.dev',
  wordmark: 'mergerequests.dev',
  description:
    'Developer tooling for teams on GitLab, Azure DevOps and Bitbucket. CI, review, security and metrics, written for the people who do not work on GitHub.',
  footerLine: 'Tooling notes for teams who say merge request.',
  defaultAuthor: 'mergerequests.dev',
  rssTitle: 'mergerequests.dev',
  gaMeasurementId: null as string | null,
  ogImage: 'https://mergerequests.dev/og-image.png',
  maintainer: {
    name: 'Kodus',
    url: 'https://kodus.io',
    line: 'Sponsored by',
  },
  /**
   * The site is organised by platform, not by date. These are the rails on the
   * home page and the sections a guide belongs to; the `platform` field in a
   * post's frontmatter has to be one of these keys.
   */
  platforms: [
    {
      key: 'gitlab',
      label: 'GitLab',
      blurb: 'SaaS and self-managed. Merge request automation, CI, and what changes when the instance is yours.',
    },
    {
      key: 'azure-devops',
      label: 'Azure DevOps',
      blurb: 'Services and Server. Pipelines, pull request policies, and the tooling gap nobody writes about.',
    },
    {
      key: 'bitbucket',
      label: 'Bitbucket',
      blurb: 'Cloud and Data Center. Pipelines, review workflow, and living next to the rest of Atlassian.',
    },
    {
      key: 'multi',
      label: 'Across platforms',
      blurb: 'Migrations, tools that work on more than one forge, and the comparisons that span all of them.',
    },
  ],
  nav: [
    { label: 'GitLab', href: '/platform/gitlab' },
    { label: 'Azure DevOps', href: '/platform/azure-devops' },
    { label: 'Bitbucket', href: '/platform/bitbucket' },
    { label: 'About', href: '/about' },
  ],
} as const;

export type SiteConfig = typeof site;
export type PlatformKey = (typeof site.platforms)[number]['key'];
