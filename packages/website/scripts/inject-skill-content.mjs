#!/usr/bin/env node
/**
 * 注入完整的 SKILL.md 内容到独立的 JSON 文件
 * 优化构建产物大小，避免 skills.ts 过大
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// ============================================================================
// 配置常量
// ============================================================================

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.resolve(__dirname, '../../..');
const SKILLS_TS_PATH = path.join(__dirname, '../src/data/skills.ts');
const SKILL_SOURCES_PATH = path.join(__dirname, '../src/data/skill-sources.ts');
const OUTPUT_DIR = path.join(__dirname, '../public/data');
const OUTPUT_FILE = 'skills-content.json';

// ============================================================================
// 正则工具函数
// ============================================================================

/**
 * 创建匹配带引号字符串的正则表达式
 * 正确处理转义字符，避免提前截断
 *
 * @param {string} quote - 引号字符: ` ' "
 * @returns {RegExp} 匹配 content: <quote>...<quote>, 的正则
 */
function createContentPattern(quote) {
  // 模式说明:
  // - content:\s*  匹配 "content:" 及后续空白
  // - <quote>      匹配开始引号
  // - (?:[^<quote>\\]|\\.)*  匹配: 非引号非反斜杠 或 转义序列
  // - <quote>\s*,  匹配结束引号及逗号
  const escaped = quote.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return new RegExp(`content:\\s*${escaped}(?:[^${escaped}\\\\]|\\\\.)*${escaped}\\s*,`, 'g');
}

/**
 * 创建清理器函数，将所有 content 字段替换为空字符串
 */
function createContentCleaner() {
  const patterns = ['`', "'", '"'].map(createContentPattern);

  return (content) => {
    return patterns.reduce(
      (text, pattern) => text.replace(pattern, "content: '',"),
      content
    );
  };
}

// ============================================================================
// 从 REPO_CONFIG 动态生成 SOURCE_BASE_PATHS
// 避免重复维护两份数据
// ============================================================================

function loadRepoConfig() {
  const repoConfigPath = path.join(__dirname, '../src/data/repo-config.ts');

  if (!fs.existsSync(repoConfigPath)) {
    throw new Error(`REPO_CONFIG not found: ${repoConfigPath}`);
  }

  const content = fs.readFileSync(repoConfigPath, 'utf-8');
  const config = {};

  // 解析 TypeScript 对象字面量
  const entryRegex = /(\w+(?:-\w+)*):\s*\{[^}]*path:\s*'([^']+)'[^}]*contentPath:\s*'([^']*)'/g;
  let match;

  while ((match = entryRegex.exec(content)) !== null) {
    const [, id, submodulePath, contentPath] = match;
    config[id] = {
      path: submodulePath,
      contentPath: contentPath
    };
  }

  return config;
}

function buildSourceBasePaths(repoConfig) {
  const paths = {};

  for (const [id, config] of Object.entries(repoConfig)) {
    // 构建完整路径: projectRoot/submodulePath/contentPath
    const fullPath = config.contentPath
      ? path.join(PROJECT_ROOT, config.path, config.contentPath)
      : path.join(PROJECT_ROOT, config.path);
    paths[id] = fullPath;
  }

  return paths;
}

// ============================================================================
// 解析函数 - 单一职责
// ============================================================================

/**
 * 从 skills.ts 解析技能元数据 (id, source)
 */
function parseSkillsMetadata() {
  if (!fs.existsSync(SKILLS_TS_PATH)) {
    throw new Error(`skills.ts not found: ${SKILLS_TS_PATH}`);
  }

  const content = fs.readFileSync(SKILLS_TS_PATH, 'utf-8');
  const skills = [];
  const skillBlockRegex = /{\s*id:\s*'([^']+)',[\s\S]*?source:\s*'([^']+)'/g;

  let match;
  while ((match = skillBlockRegex.exec(content)) !== null) {
    skills.push({ id: match[1], source: match[2] });
  }

  if (skills.length === 0) {
    throw new Error('No skills found in skills.ts');
  }

  return skills;
}

/**
 * 从 skill-sources.ts 读取已有的路径映射
 */
function parseSourceMappings() {
  if (!fs.existsSync(SKILL_SOURCES_PATH)) {
    return {};
  }

  const content = fs.readFileSync(SKILL_SOURCES_PATH, 'utf-8');
  const mappings = {};
  const regex = /'([^']+)':\s*{\s*source:\s*'([^']+)',\s*path:\s*'([^']*)'/g;

  let match;
  while ((match = regex.exec(content)) !== null) {
    mappings[match[1]] = { source: match[2], path: match[3] };
  }

  return mappings;
}

// ============================================================================
// 内容读取函数 - 单一职责
// ============================================================================

/**
 * 查找并读取 SKILL.md 文件内容
 */
function findSkillContent(skillId, sourceInfo, sourceBasePaths) {
  if (!sourceInfo) return null;

  const basePath = sourceBasePaths[sourceInfo.source];
  if (!basePath || !fs.existsSync(basePath)) return null;

  // 按优先级尝试不同路径模式
  const candidatePaths = [
    path.join(basePath, sourceInfo.path, 'SKILL.md'),
    path.join(basePath, skillId, 'SKILL.md'),
    path.join(basePath, 'SKILL.md')
  ];

  for (const candidatePath of candidatePaths) {
    try {
      if (fs.existsSync(candidatePath) && fs.statSync(candidatePath).isFile()) {
        return fs.readFileSync(candidatePath, 'utf-8');
      }
    } catch {
      // 忽略单个文件读取错误，继续尝试下一个路径
      continue;
    }
  }

  return null;
}

/**
 * 批量提取所有技能内容
 */
function extractAllContent(skills, mappings, sourceBasePaths) {
  const contentMap = {};
  let foundCount = 0;
  let errorCount = 0;

  for (const skill of skills) {
    try {
      // 优先使用显式映射，否则根据 ID 推断
      const sourceInfo = mappings[skill.id] || { source: skill.source, path: skill.id };
      const content = findSkillContent(skill.id, sourceInfo, sourceBasePaths);

      if (content) {
        contentMap[skill.id] = content;
        foundCount++;
      }
    } catch (error) {
      console.warn(`Warning: Failed to extract content for ${skill.id}: ${error.message}`);
      errorCount++;
    }
  }

  return { contentMap, foundCount, errorCount };
}

// ============================================================================
// 输出函数 - 单一职责
// ============================================================================

/**
 * 将内容写入 JSON 文件
 */
function writeContentJson(contentMap) {
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  const outputPath = path.join(OUTPUT_DIR, OUTPUT_FILE);
  fs.writeFileSync(outputPath, JSON.stringify(contentMap, null, 2));

  const fileSizeMB = (fs.statSync(outputPath).size / 1024 / 1024).toFixed(2);
  return { outputPath, fileSizeMB };
}

/**
 * 清理 skills.ts 中的内联 content 字段
 */
function cleanSkillsTsContent() {
  const originalContent = fs.readFileSync(SKILLS_TS_PATH, 'utf-8');
  const originalSize = fs.statSync(SKILLS_TS_PATH).size;

  const cleanContent = createContentCleaner();
  const cleanedContent = cleanContent(originalContent);

  fs.writeFileSync(SKILLS_TS_PATH, cleanedContent);

  const newSize = fs.statSync(SKILLS_TS_PATH).size;
  return {
    originalSizeKB: (originalSize / 1024).toFixed(2),
    newSizeKB: (newSize / 1024).toFixed(2)
  };
}

// ============================================================================
// 主函数 - 协调各模块
// ============================================================================

function main() {
  console.log('Extracting skill content to external JSON files...\n');

  try {
    // 1. 加载配置
    console.log('Loading REPO_CONFIG...');
    const repoConfig = loadRepoConfig();
    const sourceBasePaths = buildSourceBasePaths(repoConfig);
    console.log(`  Found ${Object.keys(repoConfig).length} source configurations\n`);

    // 2. 解析技能元数据
    console.log('Parsing skills metadata...');
    const skills = parseSkillsMetadata();
    const mappings = parseSourceMappings();
    console.log(`  Found ${skills.length} skills, ${Object.keys(mappings).length} explicit mappings\n`);

    // 3. 提取内容
    console.log('Extracting content...');
    const { contentMap, foundCount, errorCount } = extractAllContent(skills, mappings, sourceBasePaths);
    console.log(`  Extracted: ${foundCount}/${skills.length} skills`);
    if (errorCount > 0) {
      console.log(`  Errors: ${errorCount}`);
    }
    console.log('');

    // 4. 写入 JSON
    console.log('Writing content JSON...');
    const { outputPath, fileSizeMB } = writeContentJson(contentMap);
    console.log(`  Output: ${outputPath}`);
    console.log(`  Size: ${fileSizeMB} MB\n`);

    // 5. 清理 skills.ts
    console.log('Cleaning skills.ts...');
    const { originalSizeKB, newSizeKB } = cleanSkillsTsContent();
    console.log(`  Size: ${originalSizeKB} KB → ${newSizeKB} KB\n`);

    console.log('Done!');

  } catch (error) {
    console.error(`\nError: ${error.message}`);
    console.error(error.stack);
    process.exit(1);
  }
}

main();
