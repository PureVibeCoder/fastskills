import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = join(__dirname, '..', '..', '..', '..');

export interface Skill {
  id: string;
  name: string;
  description: string;
  category: CategoryRef | null;
  source: string;
  triggers: string[];
  priority: number;
  content: string;
}

export interface CategoryRef {
  id: string;
  name: string;
  nameEn: string;
}

let cache: Skill[] | null = null;

export function loadSkills(): Skill[] {
  if (cache) return cache;

  const skillsPath = join(projectRoot, 'packages', 'website', 'src', 'data', 'skills.ts');
  const content = readFileSync(skillsPath, 'utf-8');

  // Parse skills array - extract each skill entry
  const skills: Skill[] = [];

  // Match each skill object in the skills array
  const skillRegex = /\{\s*id:\s*'([^']+)',\s*name:\s*'([^']*)',\s*description:\s*`([^`]*)`,\s*category:\s*categories\[categoryIndex\['([^']+)'(?:\s*\?\s*\[\s*\])?\s*\]\s*\],\s*source:\s*'([^']+)',\s*triggers:\s*\[[\s\S]*?\],\s*priority:\s*(\d+),\s*content:\s*`[\s\S]*?`\s*\}/g;

  // Alternative simpler regex to match skills
  const simpleRegex = /\{\s*id:\s*'([^']+)',\s*name:\s*'([^']*)',\s*description:\s*`([^`]*)`,\s*category:\s*categories\[categoryIndex\['([^']+)'(?:\s*\?\s*\])?\s*\]\s*\][\s\S]*?source:\s*'([^']+)'[\s\S]*?triggers:\s*(\[[^\]]*\])[\s\S]*?priority:\s*(\d+)/g;

  // For now, let's use a simpler approach - extract id and basic info
  const idRegex = /'\s*id\s*:\s*'([^']+)'/g;

  // Find all skill ids
  const skillIds: string[] = [];
  for (const match of content.matchAll(/id:\s*'([^']+)'/g)) {
    if (match[1] && !skillIds.includes(match[1])) {
      skillIds.push(match[1]);
    }
  }

  // Parse each skill's details
  for (const skillId of skillIds) {
    // Find the full skill object
    const skillBlockRegex = new RegExp(`id:\\s*'${skillId}'[\\s\\S]*?category:\\s*categories\\[categoryIndex\\['([^']+)'`);
    const blockMatch = content.match(skillBlockRegex);

    if (blockMatch) {
      skills.push({
        id: skillId,
        name: skillId, // Simplified - use id as name
        description: '',
        category: { id: blockMatch[1], name: '', nameEn: '' },
        source: '',
        triggers: [],
        priority: 50,
        content: ''
      });
    }
  }

  cache = skills;
  return skills;
}
