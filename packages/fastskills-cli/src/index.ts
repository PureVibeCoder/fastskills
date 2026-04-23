#!/usr/bin/env node
import { Command } from 'commander';
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { addCommand } from './commands/add.js';
import { listCommand } from './commands/list.js';
import { removeCommand } from './commands/remove.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const pkgPath = join(__dirname, '..', 'package.json');
const { version } = JSON.parse(readFileSync(pkgPath, 'utf-8'));

const program = new Command();

program
  .name('fastskills')
  .description('FastSkills CLI - Manage Claude Code skills')
  .version(version);

program
  .command('add')
  .description('Add a new skill to FastSkills')
  .argument('[repo]', 'GitHub repository URL or slug (e.g., jimliu/baoyu-skills)')
  .option('-y, --yes', 'Skip confirmation prompts')
  .option('--skip-install', 'Skip npm install')
  .action(addCommand);

program
  .command('list')
  .description('List all installed skills')
  .action(listCommand);

program
  .command('remove')
  .description('Remove a skill from FastSkills')
  .argument('<skill-id>', 'Skill ID to remove')
  .action(removeCommand);

export async function main(): Promise<void> {
  await program.parseAsync();
}
