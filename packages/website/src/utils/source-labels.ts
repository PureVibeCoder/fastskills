/** skill.source -> 展示名（英文站点标签） */
export const SOURCE_LABELS: Record<string, string> = {
  anthropic: 'Anthropic',
  claudekit: 'ClaudeKit',
  community: 'Community',
  composio: 'Composio',
  voltagent: 'VoltAgent',
  scientific: 'Scientific',
  obsidian: 'Obsidian',
  planning: 'Planning',
  superpowers: 'Superpowers',
  'deep-research': 'DeepResearch',
  'skill-from-masters': 'SkillFromMasters',
  nanobanana: 'NanoBanana PPT',
  'humanizer-zh': 'Humanizer-zh',
  purevibecoder: 'PureVibeCoder',
  'ui-ux-pro-max': 'UI/UX Pro Max',
  makepad: 'Makepad',
  vercel: 'Vercel',
  videocut: 'VideoCut',
  threejs: 'Three.js'
};

export function sourceLabel(source: string): string {
  return SOURCE_LABELS[source] ?? source;
}
