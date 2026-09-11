/**
 * Everything that makes this site *this* site. A sibling in the network copies
 * the repo and edits this file; nothing else should hardcode the domain, the
 * name or the editorial line.
 */
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
