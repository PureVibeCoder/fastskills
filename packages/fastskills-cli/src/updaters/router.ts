import { readFileSync, promises as fs } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = join(__dirname, '..', '..', '..', '..');

export async function addToRouter(
  skillId: string,
  triggers: string[],
  priority: number = 50
): Promise<void> {
  const routerPath = join(projectRoot, 'skills', 'fastskills-router', 'SKILL.md');
  let content = await fs.readFile(routerPath, 'utf-8');

  // Format the triggers for the table
  const formattedTriggers = triggers.slice(0, 8).join(', ');

  // Create new route entry
  const newRoute = `| ${priority} | ${skillId} | ${formattedTriggers} | \`${skillId}\` |`;

  // Find the ROUTES TABLE section and insert the new route
  // Insert after the header line, sorted by priority (descending)
  const tableHeader = '| Priority | ID | Keywords (Any Match) | Load Skills |';
  const lines = content.split('\n');
  const headerIndex = lines.findIndex(line => line.includes(tableHeader));

  if (headerIndex === -1) {
    throw new Error('Could not find ROUTES TABLE in router SKILL.md');
  }

  // Find the correct position to insert (maintain priority order)
  let insertIndex = headerIndex + 2; // Start after header and separator
  while (insertIndex < lines.length) {
    const line = lines[insertIndex];
    if (!line.startsWith('|')) break;

    // Parse existing priority
    const existingPriority = parseInt(line.split('|')[1]?.trim() || '0');
    if (existingPriority < priority) {
      break;
    }
    insertIndex++;
  }

  // Insert the new route
  lines.splice(insertIndex, 0, newRoute);
  content = lines.join('\n');

  await fs.writeFile(routerPath, content, 'utf-8');
}
