/** Static markdown shards emitted by inject-skill-content.mjs under public/data/. */
export const SKILL_MARKDOWN_PUBLIC_PREFIX = '/data/skill-markdown';

export function skillMarkdownAssetUrl(skillId: string): string {
  return `${SKILL_MARKDOWN_PUBLIC_PREFIX}/${encodeURIComponent(skillId)}.md`;
}
