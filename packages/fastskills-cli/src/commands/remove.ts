import * as p from '@clack/prompts';
import chalk from 'chalk';
import { existsSync, readFileSync, promises as fs } from 'node:fs';
import { join } from 'node:path';
import { loadSkills } from '../utils/skills.js';
import { loadSkillSources } from '../utils/skill-sources.js';

export async function removeCommand(skillId: string): Promise<void> {
  const projectRoot = join(import.meta.url.startsWith('file:') ? '' : process.cwd(), '..', '..', '..');

  p.intro(chalk.cyan('FastSkills CLI - Remove Skill'));

  const skills = loadSkills();
  const skillSources = loadSkillSources();

  // Check if skill exists
  const skill = skills.find(s => s.id === skillId);
  const source = skillSources[skillId];

  if (!skill && !source) {
    p.log.error(`Skill ${chalk.cyan(skillId)} not found`);
    process.exit(1);
  }

  // Confirm removal
  const confirm = await p.confirm({
    message: `Remove skill ${chalk.cyan(skillId)}?`,
    initialValue: true
  });

  if (p.isCancel(confirm) || !confirm) {
    p.cancel('Operation cancelled.');
    process.exit(0);
  }

  // Remove from skill-sources.ts
  if (source) {
    const skillSourcesPath = join(projectRoot, 'packages', 'website', 'src', 'data', 'skill-sources.ts');
    let content = await fs.readFile(skillSourcesPath, 'utf-8');

    // Remove the skill entry
    const pattern = new RegExp(`\\s*'${skillId}':\\s*\\{[^}]+},?`, 'g');
    content = content.replace(pattern, '');

    await fs.writeFile(skillSourcesPath, content, 'utf-8');
    p.log.success(`Removed from skill-sources.ts`);
  }

  // Note: Full removal would also require removing from skills.ts and router
  // This is more complex and requires careful editing
  p.log.warn(`Manual steps required:`);
  console.log(`  1. Remove from packages/website/src/data/skills.ts`);
  console.log(`  2. Remove from skills/fastskills-router/SKILL.md`);
  if (source) {
    console.log(`  3. Remove submodule at submodules/${source.path}`);
  }

  p.outro(chalk.yellow('Skill marked for removal. Complete manual steps above.'));
}
