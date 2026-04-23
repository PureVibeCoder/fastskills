import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = join(__dirname, '..', '..', '..', '..');

export interface SkillSource {
  source: string;
  path: string;
}

let cache: Record<string, SkillSource> | null = null;

export function loadSkillSources(): Record<string, SkillSource> {
  if (cache) return cache;

  const sourcesPath = join(projectRoot, 'packages', 'website', 'src', 'data', 'skill-sources.ts');
  const content = readFileSync(sourcesPath, 'utf-8');

  // Parse SKILL_TO_SOURCE
  const match = content.match(/export const SKILL_TO_SOURCE: Record<string, SkillSource> = \{([\s\S]*?)\n\};/);
  if (!match) {
    cache = {};
    return cache;
  }

  const objectContent = match[1];

  // Extract entries
  const entries: Record<string, SkillSource> = {};
  const entryRegex = /'([^']+)':\s*\{\s*source:\s*'([^']+)',\s*path:\s*'([^']+)'\s*\}/g;

  for (const entry of objectContent.matchAll(entryRegex)) {
    entries[entry[1]] = {
      source: entry[2],
      path: entry[3]
    };
  }

  cache = entries;
  return cache;
}
