import { readFileSync, promises as fs } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = join(__dirname, '..', '..', '..', '..');

export interface SkillMetadata {
  id: string;
  name: string;
  description: string;
  filePath: string;
  triggers: string[];
  priority: number;
  content: string;
}

export async function addToSkills(
  skill: SkillMetadata,
  categoryId: string,
  source: string
): Promise<void> {
  const skillsPath = join(projectRoot, 'packages', 'website', 'src', 'data', 'skills.ts');
  let content = await fs.readFile(skillsPath, 'utf-8');

  // Escape backticks in description for template literal
  const escapedDescription = skill.description.replace(/`/g, '\\`');

  // Format triggers array
  const triggersArray = skill.triggers.map(t => `'${t}'`).join(', ');

  // Get category indices for the entry
  const categoryIdx = findCategoryIndex(content, categoryId);
  const defaultIdx = findCategoryIndex(content, 'skill-dev');

  // Create new skill entry
  const newEntry = `  {
    id: '${skill.id}',
    name: '${skill.name}',
    description: \`${escapedDescription}\`,
    category: categories[categoryIndex['${categoryId}'] ?? ${defaultIdx}],
    source: '${source}',
    triggers: [${triggersArray}],
    priority: ${skill.priority},
    content: ''
  },`;

  // Find the appropriate section to insert (by source)
  const sourcePattern = new RegExp(`// ${source} skills`);

  if (sourcePattern.test(content)) {
    // Add to existing section
    content = content.replace(sourcePattern, `${sourcePattern.source}\n${newEntry}`);
  } else {
    // Add at the end before the closing bracket
    content = content.replace(/\n\];$/, `\n${newEntry}\n];`);
  }

  await fs.writeFile(skillsPath, content, 'utf-8');
}

// Helper to find category index
function findCategoryIndex(content: string, categoryId: string): number {
  const regex = new RegExp(`'${categoryId}':\\s*(\\d+)`);
  const match = content.match(regex);
  return match ? parseInt(match[1]) : 19; // Default to skill-dev index
}
