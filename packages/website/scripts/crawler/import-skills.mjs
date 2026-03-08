#!/usr/bin/env node
/**
 * 技能收录脚本
 * 
 * 将通过安全检查的技能收录到 FastSkills 项目中
 * 自动更新以下文件：
 * 1. skill-sources.ts - 添加技能源映射
 * 2. skills.ts - 添加技能元数据
 * 3. fastskills-router/SKILL.md - 添加路由条目
 * 
 * 用法:
 *   node import-skills.mjs <path-to-accepted-skills.json> [--dry-run]
 */

import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// ============================================================================
// 配置常量
// ============================================================================

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.resolve(__dirname, '../../../..');

const CONFIG = {
  SKILLS_TS_PATH: path.join(PROJECT_ROOT, 'packages/website/src/data/skills.ts'),
  SKILL_SOURCES_PATH: path.join(PROJECT_ROOT, 'packages/website/src/data/skill-sources.ts'),
  CATEGORIES_PATH: path.join(PROJECT_ROOT, 'packages/website/src/data/categories.ts'),
  ROUTER_SKILL_PATH: path.join(PROJECT_ROOT, 'skills/fastskills-router/SKILL.md'),
  OUTPUT_DIR: path.join(__dirname, 'output'),
};

// ============================================================================
// 日志工具
// ============================================================================

function log(level, message, ...args) {
  const timestamp = new Date().toISOString();
  const prefix = `[${timestamp}] [${level.toUpperCase()}]`;
  
  if (level === 'error') {
    console.error(prefix, message, ...args);
  } else if (level === 'warn') {
    console.warn(prefix, message, ...args);
  } else {
    console.log(prefix, message, ...args);
  }
}

const logger = {
  info: (...args) => log('info', ...args),
  warn: (...args) => log('warn', ...args),
  error: (...args) => log('error', ...args),
  debug: (...args) => log('debug', ...args),
};

// ============================================================================
// 技能元数据生成
// ============================================================================

/**
 * 从 SKILL.md 内容提取元数据
 */
function extractMetadata(content) {
  const metadata = {
    name: '',
    description: '',
    triggers: [],
  };
  
  // 提取 name (YAML frontmatter 或标题)
  const nameMatch = content.match(/^name:\s*(.+)$/m);
  if (nameMatch) {
    metadata.name = nameMatch[1].trim();
  } else {
    // 从标题提取
    const titleMatch = content.match(/^#\s+(.+)$/m);
    if (titleMatch) {
      metadata.name = titleMatch[1].trim();
    }
  }
  
  // 提取 description (YAML frontmatter 或第一段)
  const descMatch = content.match(/^description:\s*(.+)$/m);
  if (descMatch) {
    metadata.description = descMatch[1].trim();
  } else {
    // 从第一段提取
    const paraMatch = content.match(/\n\n([^#\n][^\n]{50,200})/);
    if (paraMatch) {
      metadata.description = paraMatch[1].trim();
    }
  }
  
  // 生成触发关键词
  metadata.triggers = generateTriggers(metadata.name, metadata.description);
  
  return metadata;
}

/**
 * 生成触发关键词
 */
function generateTriggers(name, description) {
  const triggers = new Set();
  
  // 从名称提取关键词
  const nameWords = name.toLowerCase().split(/[-\s]+/);
  nameWords.forEach(word => {
    if (word.length > 2) {
      triggers.add(word);
    }
  });
  
  // 从描述提取重要词汇
  if (description) {
    const descWords = description.toLowerCase()
      .replace(/[^a-z\s]/g, '')
      .split(/\s+/)
      .filter(w => w.length > 3);
    
    // 取前 5 个词
    descWords.slice(0, 5).forEach(word => triggers.add(word));
  }
  
  return Array.from(triggers).slice(0, 8);
}

/**
 * 推断分类
 */
function inferCategory(name, description) {
  const text = (name + ' ' + description).toLowerCase();
  
  const categoryMap = [
    { keywords: ['frontend', 'ui', 'css', 'html', 'react', 'vue', 'design'], category: 'frontend' },
    { keywords: ['backend', 'api', 'database', 'server', 'node', 'python'], category: 'backend' },
    { keywords: ['test', 'testing', 'jest', 'vitest', 'cypress'], category: 'testing' },
    { keywords: ['devops', 'docker', 'kubernetes', 'ci/cd', 'deploy'], category: 'devops' },
    { keywords: ['bio', 'gene', 'medical', 'clinical', 'protein'], category: 'scientific' },
    { keywords: ['pdf', 'docx', 'xlsx', 'pptx', 'document'], category: 'document' },
    { keywords: ['obsidian', 'knowledge', 'note'], category: 'knowledge' },
    { keywords: ['video', 'image', 'media', 'audio'], category: 'media' },
    { keywords: ['debug', 'brainstorm', 'thinking', 'plan'], category: 'thinking' },
    { keywords: ['skill', 'mcp', 'tool'], category: 'skill-dev' },
  ];
  
  for (const { keywords, category } of categoryMap) {
    if (keywords.some(kw => text.includes(kw))) {
      return category;
    }
  }
  
  return 'tools'; // 默认分类
}

// ============================================================================
// 文件操作
// ============================================================================

/**
 * 更新 skill-sources.ts
 */
async function updateSkillSources(skills, dryRun = false) {
  logger.info('Updating skill-sources.ts...');
  
  let content = await fs.readFile(CONFIG.SKILL_SOURCES_PATH, 'utf-8');
  const updates = [];
  
  for (const skill of skills) {
    const { skillInfo } = skill;
    const sourceId = skillInfo.owner.toLowerCase().replace(/[^a-z0-9]/g, '-');
    
    // 检查是否已存在
    if (content.includes(`'${skillInfo.id}':`)) {
      logger.warn(`  Skipping ${skillInfo.id}: already exists`);
      continue;
    }
    
    // 找到最后一个条目后插入
    const newEntry = `  '${skillInfo.id}': { source: '${sourceId}', path: '${skillInfo.skillPath}' },`;
    updates.push(newEntry);
  }
  
  if (updates.length === 0) {
    logger.info('  No new skills to add');
    return [];
  }
  
  // 在最后一个条目后插入新条目
  const lastEntryMatch = content.match(/'[^']+':\s*\{[^}]+\},?\s*\n};/);
  if (lastEntryMatch) {
    const insertPosition = lastEntryMatch.index;
    content = content.slice(0, insertPosition) + updates.join('\n') + '\n' + content.slice(insertPosition);
  }
  
  if (!dryRun) {
    await fs.writeFile(CONFIG.SKILL_SOURCES_PATH, content);
    logger.info(`  Added ${updates.length} new source mappings`);
  } else {
    logger.info(`  [DRY RUN] Would add ${updates.length} new source mappings`);
  }
  
  return skills.filter(s => !content.includes(`'${s.skillInfo.id}':`));
}

/**
 * 更新 skills.ts
 */
async function updateSkills(skills, dryRun = false) {
  logger.info('Updating skills.ts...');
  
  let content = await fs.readFile(CONFIG.SKILLS_TS_PATH, 'utf-8');
  const updates = [];
  
  // 获取当前最大优先级
  const priorityMatches = content.match(/priority:\s*(\d+)/g);
  let nextPriority = 1;
  if (priorityMatches) {
    const priorities = priorityMatches.map(m => parseInt(m.match(/\d+/)[0], 10));
    nextPriority = Math.max(...priorities) + 1;
  }
  
  for (const skill of skills) {
    const { skillInfo, content: skillContent } = skill;
    
    // 检查是否已存在
    if (content.includes(`id: '${skillInfo.id}'`)) {
      continue;
    }
    
    const metadata = extractMetadata(skillContent);
    const category = inferCategory(metadata.name, metadata.description);
    
    // 构建技能对象
    const skillEntry = `  {
    id: '${skillInfo.id}',
    name: '${metadata.name || skillInfo.name}',
    description: '${metadata.description || `Skill from ${skillInfo.owner}/${skillInfo.repo}`}',
    category: categories[categoryIndex['${category}'] ?? 0],
    source: '${skillInfo.owner.toLowerCase().replace(/[^a-z0-9]/g, '-')}',
    triggers: [${metadata.triggers.map(t => `'${t}'`).join(', ')}],
    priority: ${nextPriority++},
    content: '',
  },`;
    
    updates.push(skillEntry);
  }
  
  if (updates.length === 0) {
    logger.info('  No new skills to add');
    return;
  }
  
  // 在 skills 数组末尾插入
  const arrayEndMatch = content.match(/];\s*$/);
  if (arrayEndMatch) {
    const insertPosition = arrayEndMatch.index;
    content = content.slice(0, insertPosition) + updates.join('\n') + '\n' + content.slice(insertPosition);
  }
  
  if (!dryRun) {
    await fs.writeFile(CONFIG.SKILLS_TS_PATH, content);
    logger.info(`  Added ${updates.length} new skills`);
  } else {
    logger.info(`  [DRY RUN] Would add ${updates.length} new skills`);
  }
}

/**
 * 更新 ROUTES TABLE
 */
async function updateRoutes(skills, dryRun = false) {
  logger.info('Updating ROUTES TABLE...');
  
  let content = await fs.readFile(CONFIG.ROUTER_SKILL_PATH, 'utf-8');
  const updates = [];
  
  for (const skill of skills) {
    const { skillInfo, content: skillContent } = skill;
    const metadata = extractMetadata(skillContent);
    
    // 检查是否已存在
    if (content.includes(`| ${skillInfo.id} |`)) {
      continue;
    }
    
    // 生成关键词
    const keywords = metadata.triggers.slice(0, 4).join(', ');
    
    // 构建路由条目
    const routeEntry = `| ${skill.priority || 'auto'} | ${skillInfo.id} | ${keywords} | \`${skillInfo.id}\` |`;
    updates.push(routeEntry);
  }
  
  if (updates.length === 0) {
    logger.info('  No new routes to add');
    return;
  }
  
  // 在 ROUTES TABLE 后插入
  const tableMatch = content.match(/(\| Priority \| ID \| Keywords[^|]+\|[^-]+[-|]+\n)/);
  if (tableMatch) {
    const insertPosition = tableMatch.index + tableMatch[0].length;
    content = content.slice(0, insertPosition) + updates.join('\n') + '\n' + content.slice(insertPosition);
  }
  
  if (!dryRun) {
    await fs.writeFile(CONFIG.ROUTER_SKILL_PATH, content);
    logger.info(`  Added ${updates.length} new routes`);
  } else {
    logger.info(`  [DRY RUN] Would add ${updates.length} new routes`);
  }
}

// ============================================================================
// 主流程
// ============================================================================

async function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes('--dry-run');
  
  // 获取输入文件路径
  const inputFile = args.find(a => !a.startsWith('--'));
  
  if (!inputFile) {
    // 默认读取 accepted-skills.json
    const defaultPath = path.join(CONFIG.OUTPUT_DIR, 'accepted-skills.json');
    logger.info(`No input file specified, using default: ${defaultPath}`);
    
    try {
      await fs.access(defaultPath);
      args.push(defaultPath);
    } catch {
      logger.error('No accepted-skills.json found. Please run crawl-skills-sh.mjs first.');
      process.exit(1);
    }
  }
  
  const skillsFile = inputFile || path.join(CONFIG.OUTPUT_DIR, 'accepted-skills.json');
  
  logger.info('='.repeat(60));
  logger.info('FastSkills Import Tool');
  logger.info('='.repeat(60));
  logger.info(`Input file: ${skillsFile}`);
  logger.info(`Dry run: ${dryRun}`);
  logger.info('='.repeat(60));
  
  try {
    // 读取通过安全检查的技能
    const skillsJson = await fs.readFile(skillsFile, 'utf-8');
    const skills = JSON.parse(skillsJson);
    
    if (skills.length === 0) {
      logger.info('No skills to import');
      return;
    }
    
    logger.info(`\nFound ${skills.length} skills to import\n`);
    
    // 更新三个文件
    const newSkills = await updateSkillSources(skills, dryRun);
    await updateSkills(newSkills, dryRun);
    await updateRoutes(newSkills, dryRun);
    
    logger.info('\n' + '='.repeat(60));
    logger.info('Import completed!');
    logger.info('='.repeat(60));
    
    if (!dryRun) {
      logger.info('\nNext steps:');
      logger.info('  1. Review the changes in git');
      logger.info('  2. Run: pnpm build');
      logger.info('  3. Test the new skills');
      logger.info('  4. Commit and push');
    }
    
  } catch (error) {
    logger.error('Import failed:', error.message);
    logger.error(error.stack);
    process.exit(1);
  }
}

// 如果直接运行此脚本
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(error => {
    logger.error('Unhandled error:', error);
    process.exit(1);
  });
}

export { extractMetadata, generateTriggers, inferCategory };
