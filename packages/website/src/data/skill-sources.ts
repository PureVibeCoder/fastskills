// 技能到源目录的映射
// 供 packager.ts 和 install.sh.ts 共用

export interface SkillSource {
  source: string;
  path: string;
}

export const SKILL_TO_SOURCE: Record<string, SkillSource> = {
  // anthropic-skills
  'frontend-design': { source: 'anthropic', path: 'frontend-design' },
  'modern-frontend-design': { source: 'anthropic', path: 'modern-frontend-design' },
  'brand-guidelines': { source: 'anthropic', path: 'brand-guidelines' },
  'canvas-design': { source: 'anthropic', path: 'canvas-design' },
  'theme-factory': { source: 'anthropic', path: 'theme-factory' },
  'pdf': { source: 'anthropic', path: 'pdf' },
  'doc-coauthoring': { source: 'anthropic', path: 'doc-coauthoring' },
  'docx': { source: 'anthropic', path: 'docx' },
  'pptx': { source: 'anthropic', path: 'pptx' },
  'xlsx': { source: 'anthropic', path: 'xlsx' },
  'algorithmic-art': { source: 'anthropic', path: 'algorithmic-art' },
  'slack-gif-creator': { source: 'anthropic', path: 'slack-gif-creator' },
  'mcp-builder': { source: 'anthropic', path: 'mcp-builder' },
  'skill-creator': { source: 'anthropic', path: 'skill-creator' },
  'internal-comms': { source: 'anthropic', path: 'internal-comms' },
  'web-artifacts-builder': { source: 'anthropic', path: 'web-artifacts-builder' },
  'webapp-testing': { source: 'anthropic', path: 'webapp-testing' },
  // claudekit-skills
  'backend-development': { source: 'claudekit', path: 'backend-development' },
  'database-design': { source: 'claudekit', path: 'databases' },
  'devops': { source: 'claudekit', path: 'devops' },
  'sequential-thinking': { source: 'claudekit', path: 'sequential-thinking' },
  'code-review': { source: 'claudekit', path: 'code-review' },
  // community skills
  'react-components': { source: 'community', path: 'react-components' },
  'docker': { source: 'community', path: 'docker' },
  'browser-automation': { source: 'community', path: 'browser-automation' },
  'image-enhancer': { source: 'community', path: 'image-enhancer' },
  // scientific skills
  'biopython': { source: 'scientific', path: 'biopython' },
  'rdkit': { source: 'scientific', path: 'rdkit' },
  'scanpy': { source: 'scientific', path: 'scanpy' },
  'deepchem': { source: 'scientific', path: 'deepchem' },
  'pubmed-database': { source: 'scientific', path: 'pubmed-database' },
  // obsidian skills
  'obsidian-markdown': { source: 'obsidian', path: 'obsidian-markdown' },
  'obsidian-bases': { source: 'obsidian', path: 'obsidian-bases' },
  'json-canvas': { source: 'obsidian', path: 'json-canvas' },
  // planning
  'planning-with-files': { source: 'planning', path: 'planning-with-files' }
};

// 根据技能 ID 获取源信息
export function getSkillSource(skillId: string): SkillSource | null {
  return SKILL_TO_SOURCE[skillId] || null;
}

// 检查技能是否有源信息
export function hasSkillSource(skillId: string): boolean {
  return skillId in SKILL_TO_SOURCE;
}
