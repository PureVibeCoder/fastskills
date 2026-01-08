import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { createRouterServer } from './server.js';
import { SkillMeta } from './types.js';
import { safeValidateSkillsIndex } from './schemas/skills-schema.js';

import * as fs from 'fs/promises';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function loadSkillsIndex(): Promise<SkillMeta[]> {
  const indexPath = path.join(__dirname, 'data', 'skills.json');
  
  try {
    const content = await fs.readFile(indexPath, 'utf-8');
    const parsed = JSON.parse(content);
    
    const validation = safeValidateSkillsIndex(parsed);
    if (!validation.success) {
      console.error(`Warning: Skills index validation failed:`);
      console.error(validation.error.errors.slice(0, 5).map(e => 
        `  - ${e.path.join('.')}: ${e.message}`
      ).join('\n'));
      console.error('Using unvalidated data...');
      return parsed as SkillMeta[];
    }
    
    return validation.data;
  } catch (error) {
    if (error instanceof SyntaxError) {
      console.error(`Error: Invalid JSON in skills index: ${error.message}`);
      return [];
    }
    console.error(`Warning: Could not load skills index from ${indexPath}`);
    console.error('Run "npm run generate-index" to create the index.');
    return [];
  }
}

async function main() {
  const skills = await loadSkillsIndex();
  
  const { server } = createRouterServer({ skills });

  const transport = new StdioServerTransport();
  await server.connect(transport);
  
  console.error(`FastSkills Router MCP Server started (${skills.length} skills indexed)`);
}

main().catch(console.error);
