// Centralized repository configuration for FastSkills
// This file serves as the single source of truth for repository locations and raw content URLs.

export interface RepoConfig {
  /** The local submodule path relative to project root */
  path: string;
  /** The remote GitHub repository URL */
  url: string;
  /** The base URL for fetching raw content (e.g., via MCP server) */
  rawBase: string;
  /** Pattern to find skills within the repo (glob or specific logic) */
  contentPath: string;
  /** ID used in source field */
  id: string;
}

export const REPO_CONFIG: Record<string, RepoConfig> = {
  anthropic: {
    id: 'anthropic',
    path: 'anthropic-skills',
    url: 'https://github.com/anthropics/skills.git',
    rawBase: 'https://raw.githubusercontent.com/anthropics/skills/main',
    contentPath: 'skills'
  },
  claudekit: {
    id: 'claudekit',
    path: 'claudekit-skills',
    url: 'https://github.com/mrgoonie/claudekit-skills.git',
    rawBase: 'https://raw.githubusercontent.com/ClaudeKit/claude-skills/main',
    contentPath: '.claude/skills'
  },
  scientific: {
    id: 'scientific',
    path: 'scientific-skills',
    url: 'https://github.com/K-Dense-AI/claude-scientific-skills.git',
    rawBase: 'https://raw.githubusercontent.com/K-Dense-AI/claude-scientific-skills/main',
    contentPath: 'scientific-skills'
  },
  community: {
    id: 'community',
    path: 'awesome-claude-skills',
    url: 'https://github.com/ComposioHQ/awesome-claude-skills.git',
    rawBase: 'https://raw.githubusercontent.com/LeonKohli/awesome-claude-code-skills/main',
    contentPath: '.'
  },
  composio: {
    id: 'composio',
    path: 'composio-skills',
    url: 'https://github.com/ComposioHQ/awesome-claude-skills.git',
    rawBase: 'https://raw.githubusercontent.com/ComposioHQ/composio-claudecode-skills/main',
    contentPath: '.'
  },
  voltagent: {
    id: 'voltagent',
    path: 'voltagent-skills',
    url: 'https://github.com/VoltAgent/voltagent.git',
    rawBase: 'https://raw.githubusercontent.com/VoltAgent/voltagent-skills/main',
    contentPath: '.'
  },
  obsidian: {
    id: 'obsidian',
    path: 'obsidian-skills',
    url: 'https://github.com/kepano/obsidian-skills.git',
    rawBase: 'https://raw.githubusercontent.com/PureVibeCoder/obsidian-skills/main',
    contentPath: '.'
  },
  superpowers: {
    id: 'superpowers',
    path: 'superpowers',
    url: 'https://github.com/obra/superpowers.git',
    rawBase: 'https://raw.githubusercontent.com/obra/superpowers/main',
    contentPath: 'skills'
  },
  'deep-research': {
    id: 'deep-research',
    path: 'deep-research-skills',
    url: 'https://github.com/liangdabiao/Claude-Code-Deep-Research-main.git',
    rawBase: 'https://raw.githubusercontent.com/PureVibeCoder/deep-research-skills/main',
    contentPath: '.'
  },
  'skill-from-masters': {
    id: 'skill-from-masters',
    path: 'skill-from-masters',
    url: 'https://github.com/GBSOSS/skill-from-masters.git',
    rawBase: 'https://raw.githubusercontent.com/PureVibeCoder/fastskills/main',
    contentPath: 'skill-from-masters'
  },
  planning: {
    id: 'planning',
    path: 'planning-with-files',
    url: 'https://github.com/marovole/planning-with-files.git',
    rawBase: 'https://raw.githubusercontent.com/PureVibeCoder/fastskills/main',
    contentPath: 'planning-with-files'
  }
};
