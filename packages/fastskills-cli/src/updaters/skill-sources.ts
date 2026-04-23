import { readFileSync, promises as fs } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = join(__dirname, '..', '..', '..', '..');

export interface SkillSource {
  source: string;
  path: string;
}

export async function addToSkillSources(skillId: string, source: string, path: string): Promise<void> {
  const sourcesPath = join(projectRoot, 'packages', 'website', 'src', 'data', 'skill-sources.ts');
  let content = await fs.readFile(sourcesPath, 'utf-8');

  // Find the section for the source and add the entry
  const sourceSection = `// ${source} skills`;
  const sourcePattern = new RegExp(`// ${source} skills`);

  if (sourcePattern.test(content)) {
    // Add to existing section
    const newEntry = `  '${skillId}': { source: '${source}', path: '${path}' },\n`;
    content = content.replace(sourcePattern, (match) => `${match}\n${newEntry}`);
  } else {
    // Add new section at the end (before closing brace)
    const newSection = `\n  // ${source} skills\n${`  '${skillId}': { source: '${source}', path: '${path}' },`}`;
    content = content.replace(/\n\};$/, `${newSection}\n};`);
  }

  await fs.writeFile(sourcesPath, content, 'utf-8');
}
