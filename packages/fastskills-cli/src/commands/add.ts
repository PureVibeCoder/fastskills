import { existsSync, readFileSync, promises as fs } from 'node:fs';
import { join } from 'node:path';
import { execSync } from 'node:child_process';
import { setTimeout } from 'node:timers/promises';
import * as p from '@clack/prompts';
import chalk from 'chalk';
import simpleGit from 'simple-git';
import matter from 'gray-matter';
import { addToSkillSources } from '../updaters/skill-sources.js';
import { addToSkills } from '../updaters/skills.js';
import { addToRouter } from '../updaters/router.js';
import { loadCategories } from '../utils/categories.js';
import { loadSkillSources } from '../utils/skill-sources.js';
import { loadSkills } from '../utils/skills.js';
import { detectSkillCategory } from '../utils/category-detector.js';
import { extractTriggers } from '../utils/trigger-extractor.js';

interface AddOptions {
  yes?: boolean;
  skipInstall?: boolean;
}

export async function addCommand(repo: string | undefined, options: AddOptions): Promise<void> {
  const projectRoot = join(import.meta.url.startsWith('file:') ? '' : process.cwd(), '..', '..', '..');
  const submodulesDir = join(projectRoot, 'submodules');

  p.intro(chalk.cyan('FastSkills CLI - Add Skill'));

  // Step 1: Get repository URL
  let repoUrl = repo;
  if (!repoUrl) {
    const repoInput = await p.text({
      message: 'Enter GitHub repository URL or slug:',
      placeholder: 'e.g., jimliu/baoyu-skills or https://github.com/jimliu/baoyu-skills',
      validate: (value) => {
        if (!value) return 'Repository is required';
        if (!value.includes('/') && !value.includes('github.com')) {
          return 'Please enter a valid repository slug (owner/repo) or full URL';
        }
      }
    });

    if (p.isCancel(repoInput)) {
      p.cancel('Operation cancelled.');
      process.exit(0);
    }

    repoUrl = repoInput as string;
  }

  // Normalize repo URL
  const repoInfo = normalizeRepoUrl(repoUrl);
  const repoName = repoInfo.name;
  const submodulePath = join(submodulesDir, repoName);

  // Step 2: Clone or update submodule
  p.log.step(`Checking repository ${chalk.cyan(repoInfo.url)}...`);

  const spinner = p.spinner();

  try {
    spinner.start('Cloning repository...');

    // Check if submodule already exists
    const git = simpleGit();
    const submoduleExists = existsSync(submodulePath);

    if (submoduleExists) {
      spinner.stop('Repository already exists, updating...');
      p.log.info(`Submodule at ${submodulePath} already exists`);

      // Update existing submodule
      const subGit = simpleGit(submodulePath);
      await subGit.fetch();
      await subGit.pull();
    } else {
      // Clone as submodule
      execSync(`git submodule add ${repoInfo.url} ${submodulePath}`, {
        cwd: projectRoot,
        stdio: 'pipe'
      });
      execSync('git submodule update --init --recursive', {
        cwd: projectRoot,
        stdio: 'pipe'
      });
      spinner.stop('Repository cloned successfully');
    }

    await setTimeout(100);
  } catch (error) {
    spinner.stop('Failed to clone repository');
    p.log.error(`Failed to clone repository: ${(error as Error).message}`);
    process.exit(1);
  }

  // Step 3: Find SKILL.md files
  p.log.step('Discovering skills...');

  const skillFiles: string[] = [];
  const findSkillsRecursive = async (dir: string, basePath: string): Promise<void> => {
    const entries = await fs.readdir(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = join(dir, entry.name);
      const relativePath = join(basePath, entry.name);

      if (entry.isDirectory() && !entry.name.startsWith('.') && entry.name !== 'node_modules') {
        await findSkillsRecursive(fullPath, relativePath);
      } else if (entry.name === 'SKILL.md' || entry.name === 'skill.md') {
        skillFiles.push(fullPath);
      }
    }
  };

  await findSkillsRecursive(submodulePath, '');

  if (skillFiles.length === 0) {
    p.log.error('No SKILL.md files found in the repository');
    process.exit(1);
  }

  p.log.info(`Found ${skillFiles.length} skill file(s)`);

  // Step 4: Parse and display skills for selection
  const skills: Array<{
    id: string;
    name: string;
    description: string;
    filePath: string;
    triggers: string[];
    priority: number;
    content: string;
  }> = [];

  for (const filePath of skillFiles) {
    try {
      const content = await fs.readFile(filePath, 'utf-8');
      const { data } = matter(content);

      // Determine skill ID from path
      const relativePath = filePath.replace(submodulePath + '/', '').replace('/SKILL.md', '').replace('/skill.md', '');
      const skillId = relativePath.replace(/\//g, '-').toLowerCase();

      skills.push({
        id: skillId,
        name: data.name || skillId,
        description: data.description || 'No description provided',
        filePath,
        triggers: extractTriggers(data.name || '', data.description || '', content),
        priority: data.priority || 50,
        content
      });
    } catch (error) {
      p.log.warn(`Failed to parse ${filePath}: ${(error as Error).message}`);
    }
  }

  if (skills.length === 0) {
    p.log.error('No valid skills could be parsed');
    process.exit(1);
  }

  // Step 5: Select skills to add
  let selectedSkills: typeof skills;

  if (options.yes || skills.length === 1) {
    selectedSkills = skills;
  } else {
    const selection = await p.multiselect({
      message: 'Select skills to add:',
      options: skills.map(s => ({
        value: s.id,
        label: chalk.cyan(s.name),
        hint: s.description.substring(0, 50)
      })),
      required: true
    });

    if (p.isCancel(selection)) {
      p.cancel('Operation cancelled.');
      process.exit(0);
    }

    if (selection.length === 0) {
      p.cancel('No skills selected.');
      process.exit(0);
    }

    selectedSkills = skills.filter(s => (selection as string[]).includes(s.id));
  }

  // Step 6: Select category for each skill
  const categories = loadCategories();
  const existingSkillSources = loadSkillSources();
  const existingSkills = loadSkills();

  p.log.step('Configuring skills...');

  for (const skill of selectedSkills) {
    // Check if skill already exists
    if (existingSkillSources[skill.id] || existingSkills.some(s => s.id === skill.id)) {
      p.log.warn(`Skill ${chalk.cyan(skill.id)} already exists, skipping...`);
      continue;
    }

    let categoryId: string;

    if (options.yes) {
      // Auto-detect category
      categoryId = detectSkillCategory(skill.name, skill.description, categories);
    } else {
      const categorySelection = await p.select({
        message: `Select category for ${chalk.cyan(skill.name)}:`,
        options: categories.map(c => ({
          value: c.id,
          label: `${c.icon} ${c.name}`,
          hint: c.nameEn
        }))
      });

      if (p.isCancel(categorySelection)) {
        p.cancel('Operation cancelled.');
        process.exit(0);
      }

      categoryId = categorySelection as string;
    }

    // Calculate priority (avoid duplicates)
    const existingPriorities = existingSkills
      .filter(s => s.category?.id === categoryId)
      .map(s => s.priority);
    const maxPriority = Math.max(0, ...existingPriorities, 0);
    const priority = Math.min(100, maxPriority + 5);

    // Update data files
    const source = repoInfo.source || 'community';

    await addToSkillSources(skill.id, source, skill.filePath.replace(submodulePath + '/', ''));
    await addToSkills(skill, categoryId, source);
    await addToRouter(skill.id, skill.triggers, priority);

    p.log.success(`Added ${chalk.cyan(skill.name)} (ID: ${skill.id})`);
  }

  // Step 7: Summary
  p.outro(chalk.green('Skill(s) added successfully!') + '\n\n' +
    'Next steps:\n' +
    `  1. Run ${chalk.cyan('pnpm build')} to rebuild the website\n` +
    `  2. Test skills at http://localhost:4321\n` +
    `  3. Commit your changes`);
}

function normalizeRepoUrl(input: string): { url: string; name: string; source: string } {
  // Handle full URL
  if (input.includes('github.com')) {
    const match = input.match(/github\.com[/:]([^/]+)\/([^/.]+)/);
    if (match) {
      const owner = match[1];
      const name = match[2].replace(/\.git$/, '');
      return {
        url: `https://github.com/${owner}/${name}.git`,
        name,
        source: 'community'
      };
    }
  }

  // Handle owner/repo format
  if (input.includes('/')) {
    const [owner, name] = input.split('/');
    return {
      url: `https://github.com/${owner}/${name}.git`,
      name: name.replace(/\.git$/, ''),
      source: 'community'
    };
  }

  // Handle bare repo name
  return {
    url: `https://github.com/${input}/${input}.git`,
    name: input,
    source: 'community'
  };
}
