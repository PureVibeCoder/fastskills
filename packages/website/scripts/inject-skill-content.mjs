#!/usr/bin/env node
/**
 * 注入完整的 SKILL.md 内容到独立的 JSON 文件
 * 优化构建产物大小，避免 skills.ts 过大
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '../../..');
const skillsTsPath = path.join(__dirname, '../src/data/skills.ts');
const distDataDir = path.join(__dirname, '../public/data'); // 存放生成的 JSON

// 确保输出目录存在
if (!fs.existsSync(distDataDir)) {
  fs.mkdirSync(distDataDir, { recursive: true });
}

// 源目录映射（与 skill-sources.ts 和 api/skill-content.ts 保持一致）
const SOURCE_BASE_PATHS = {
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
};

// 我们需要读取 skills.ts 来获取所有定义的 ID 和来源
function parseSkillsTs() {
  const content = fs.readFileSync(skillsTsPath, 'utf-8');
  const skills = [];

  // 简单的正则解析，提取 id 和 source
  const skillBlockRegex = /{\s*id:\s*'([^']+)',[\s\S]*?source:\s*'([^']+)'/g;
  let match;
  while ((match = skillBlockRegex.exec(content)) !== null) {
    skills.push({ id: match[1], source: match[2] });
  }
  return skills;
}

// 读取现有的 skill-sources.ts 文件内容
function readExistingMappings() {
  const mappingPath = path.join(__dirname, '../src/data/skill-sources.ts');
  if (fs.existsSync(mappingPath)) {
    const content = fs.readFileSync(mappingPath, 'utf-8');
    const map = {};
    const regex = /'([^']+)':\s*{\s*source:\s*'([^']+)',\s*path:\s*'([^']*)'/g;
    let match;
    while ((match = regex.exec(content)) !== null) {
      map[match[1]] = { source: match[2], path: match[3] };
    }
    return map;
  }
  return {};
}

/**
 * 读取 SKILL.md 文件内容
 */
function readSkillContent(skillId, sourceInfo) {
  if (!sourceInfo) return null;

  const basePath = SOURCE_BASE_PATHS[sourceInfo.source];
  if (!basePath || !fs.existsSync(basePath)) return null;

  // 尝试几种常见的路径模式
  const pathsToTry = [
    path.join(basePath, sourceInfo.path, 'SKILL.md'),
    path.join(basePath, skillId, 'SKILL.md'), // 尝试用 ID 作为目录
    path.join(basePath, 'SKILL.md') // 如果 path 是空的或者是 .
  ];

  for (const p of pathsToTry) {
    if (fs.existsSync(p) && fs.statSync(p).isFile()) {
      return fs.readFileSync(p, 'utf-8');
    }
  }

  return null;
}

function processSkills() {
  console.log('Extacting skill content to external JSON files...');

  const skillList = parseSkillsTs();
  const mappings = readExistingMappings();
  const contentMap = {};

  let foundCount = 0;

  for (const skill of skillList) {
    // 优先使用映射，如果没有则尝试默认路径逻辑
    let sourceInfo = mappings[skill.id];

    // 如果没有映射，尝试根据 ID 猜测
    if (!sourceInfo) {
      sourceInfo = { source: skill.source, path: skill.id };
    }

    const content = readSkillContent(skill.id, sourceInfo);

    if (content) {
      contentMap[skill.id] = content;
      foundCount++;
    }
  }

  // 写入 content map 到 JSON
  const outputPath = path.join(distDataDir, 'skills-content.json');
  fs.writeFileSync(outputPath, JSON.stringify(contentMap, null, 2));

  console.log(`Extracted content for ${foundCount} skills to ${outputPath}`);
  console.log(`File size: ${(fs.statSync(outputPath).size / 1024 / 1024).toFixed(2)} MB`);

  // 清理 skills.ts
  let skillsTsContent = fs.readFileSync(skillsTsPath, 'utf-8');
  const originalSize = fs.statSync(skillsTsPath).size;

  const newContent = skillsTsContent.replace(/content:\s*`[\s\S]*?`\s*,/g, "content: '',")
                                    .replace(/content:\s*'[\s\S]*?'\s*,/g, "content: '',")
                                    .replace(/content:\s*"[\s\S]*?"\s*,/g, "content: '',");

  fs.writeFileSync(skillsTsPath, newContent);

  const newSize = fs.statSync(skillsTsPath).size;
  console.log(`Cleaned skills.ts: ${(originalSize / 1024).toFixed(2)} KB -> ${(newSize / 1024).toFixed(2)} KB`);
}

processSkills();
