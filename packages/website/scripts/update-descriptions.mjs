#!/usr/bin/env node
/**
 * 更新 skills.ts 中的 description 字段，使用完整的描述
 * 从各个 submodule 的 SKILL.md 文件中读取完整描述
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '../../..');
const skillsPath = path.join(__dirname, '../src/data/skills.ts');

// 源目录映射
const SOURCE_PATHS = {
  'anthropic': path.join(projectRoot, 'anthropic-skills/skills'),
  'claudekit': path.join(projectRoot, 'claudekit-skills/.claude/skills'),
  'scientific': path.join(projectRoot, 'scientific-skills/scientific-skills'),
  'community': path.join(projectRoot, 'awesome-claude-skills'),
  'composio': path.join(projectRoot, 'composio-skills/skills'),
  'voltagent': path.join(projectRoot, 'voltagent-skills/skills'),
  'obsidian': path.join(projectRoot, 'obsidian-skills/skills'),
  'planning': path.join(projectRoot, 'planning-with-files'),
  'deep-research': path.join(projectRoot, 'deep-research-skills/.claude/skills'),
  'superpowers': path.join(projectRoot, 'superpowers/skills'),
  'skill-from-masters': path.join(projectRoot, 'skill-from-masters/skill-from-masters'),
  'videocut': path.join(projectRoot, 'videocut-skills')
};

/**
 * 递归查找所有 SKILL.md 文件
 */
function findSkillFiles(dir, files = []) {
  if (!fs.existsSync(dir)) {
    return files;
  }

  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    // 跳过 node_modules 和 .git
    if (entry.name === 'node_modules' || entry.name === '.git') {
      continue;
    }

    if (entry.isDirectory()) {
      findSkillFiles(fullPath, files);
    } else if (entry.name === 'SKILL.md') {
      files.push(fullPath);
    }
  }

  return files;
}

/**
 * 简单的 YAML frontmatter 解析器
 */
function parseFrontmatter(content) {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) {
    return null;
  }

  const yaml = match[1];
  const data = {};

  // 解析简单的 key: value 格式
  const lines = yaml.split('\n');
  let currentKey = null;
  let currentValue = '';

  for (const line of lines) {
    // 检查是否是新的 key: value
    const keyMatch = line.match(/^(\w+):\s*(.*)/);
    if (keyMatch) {
      // 保存之前的 key-value
      if (currentKey) {
        data[currentKey] = currentValue.trim();
      }
      currentKey = keyMatch[1];
      currentValue = keyMatch[2];
    } else if (currentKey && line.startsWith('  ')) {
      // 多行值的续行
      currentValue += ' ' + line.trim();
    }
  }

  // 保存最后一个 key-value
  if (currentKey) {
    data[currentKey] = currentValue.trim();
  }

  return data;
}

function scanSkillFiles() {
  const skillDescriptions = new Map();

  console.log('Scanning SKILL.md files from all sources...\n');

  for (const [source, basePath] of Object.entries(SOURCE_PATHS)) {
    if (!fs.existsSync(basePath)) {
      console.log(`  [SKIP] ${source}: directory not found`);
      continue;
    }

    const skillFiles = findSkillFiles(basePath);
    console.log(`  [${source}] Found ${skillFiles.length} SKILL.md files`);

    for (const filePath of skillFiles) {
      try {
        const content = fs.readFileSync(filePath, 'utf-8');
        const data = parseFrontmatter(content);

        if (data && data.name && data.description) {
          const id = data.name.toLowerCase().replace(/\s+/g, '-');
          skillDescriptions.set(id, {
            name: data.name,
            description: data.description,
            source,
            filePath,
          });
        }
      } catch (error) {
        console.warn(`    Warning: Failed to parse ${filePath}:`, error.message);
      }
    }
  }

  console.log(`\nTotal unique skills found: ${skillDescriptions.size}\n`);
  return skillDescriptions;
}

function escapeForSingleQuote(str) {
  // 转义反斜杠和单引号
  return str.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
}

function updateSkillsFile(skillDescriptions) {
  console.log('Reading skills.ts...');
  let content = fs.readFileSync(skillsPath, 'utf-8');

  let updatedCount = 0;
  let skippedCount = 0;
  const updates = [];

  // 匹配每个 skill 对象: { id: '...', name: '...', description: '...', ...
  // 使用逐个匹配的方式
  const idPattern = /id:\s*'([^']+)'/g;
  let idMatch = idPattern.exec(content);

  while (idMatch !== null) {
    const skillId = idMatch[1];
    const skillInfo = skillDescriptions.get(skillId);

    if (!skillInfo || !skillInfo.description) {
      skippedCount++;
      continue;
    }

    // 在这个 id 后面找到对应的 description
    const searchStart = idMatch.index;
    const searchEnd = Math.min(searchStart + 500, content.length);
    const searchArea = content.slice(searchStart, searchEnd);

    // 匹配 description: '...'
    const descMatch = searchArea.match(/description:\s*'((?:[^'\\]|\\.)*)'/);
    if (!descMatch) {
      skippedCount++;
      continue;
    }

    const oldDescription = descMatch[1];
    const newDescription = escapeForSingleQuote(skillInfo.description);

    // 检查是否需要更新（描述被截断了）
    if (oldDescription !== newDescription && oldDescription.length < newDescription.length) {
      const descStart = searchStart + descMatch.index;
      updates.push({
        start: descStart,
        oldText: descMatch[0],
        newText: `description: '${newDescription}'`,
        skillId,
      });
      updatedCount++;
    } else {
      skippedCount++;
    }

    idMatch = idPattern.exec(content);
  }

  // 从后向前替换，保持位置正确
  updates.sort((a, b) => b.start - a.start);

  for (const update of updates) {
    content = content.slice(0, update.start) + update.newText + content.slice(update.start + update.oldText.length);
  }

  console.log(`Updated ${updatedCount} descriptions`);
  console.log(`Skipped ${skippedCount} skills`);

  // 写入更新后的文件
  console.log('\nWriting updated skills.ts...');
  fs.writeFileSync(skillsPath, content);

  return { updatedCount, skippedCount };
}

function main() {
  console.log('='.repeat(60));
  console.log('Skills Description Updater');
  console.log('='.repeat(60) + '\n');

  // 1. 扫描所有 SKILL.md 文件
  const skillDescriptions = scanSkillFiles();

  // 2. 更新 skills.ts
  const { updatedCount, skippedCount } = updateSkillsFile(skillDescriptions);

  console.log('\n' + '='.repeat(60));
  console.log('Summary:');
  console.log(`  - Total skills scanned: ${skillDescriptions.size}`);
  console.log(`  - Descriptions updated: ${updatedCount}`);
  console.log(`  - Skipped: ${skippedCount}`);
  console.log('='.repeat(60));
}

main();
