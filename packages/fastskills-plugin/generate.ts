#!/usr/bin/env npx tsx
/**
 * FastSkills Router Skill Generator
 *
 * Generates a lightweight SKILL.md file with:
 * - Lightweight index of all 227+ skills (no full content)
 * - Auto-routing engine rules
 * - Intent detection and synonym mappings
 */

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface SkillIndex {
  id: string;
  name: string;
  category: string;
  triggers: string[];
  description: string;
  source: string;
}

// Category mapping
const CATEGORY_MAP: Record<string, string> = {
  'frontend': '前端开发',
  'backend': '后端开发',
  'testing': '测试质量',
  'devops': 'DevOps',
  'scientific': '科学研究',
  'bioinformatics': '生物信息学',
  'cheminformatics': '化学信息学',
  'clinical': '临床医学',
  'ml-ai': '机器学习与AI',
  'physics-materials': '物理与材料',
  'data-viz': '数据分析与可视化',
  'sci-databases': '科学数据库',
  'sci-communication': '科学写作与交流',
  'lab-automation': '实验室自动化',
  'document': '文档处理',
  'knowledge': '知识管理',
  'media': '媒体处理',
  'thinking': '思维方法',
  'tools': '开发工具',
  'skill-dev': '技能开发',
};

function parseSkills(): SkillIndex[] {
  const skillsPath = path.join(__dirname, '../website/src/data/skills.ts');
  const content = fs.readFileSync(skillsPath, 'utf-8');

  const skills: SkillIndex[] = [];

  // Parse each skill object - improved regex
  const skillRegex = /\{\s*id:\s*'([^']+)',\s*name:\s*'([^']+)',\s*description:\s*'([^']*)',\s*category:\s*categories\[categoryIndex\['([^']+)'\]/g;

  let match;
  while ((match = skillRegex.exec(content)) !== null) {
    const [, id, name, description, category] = match;

    // Find triggers
    const triggerMatch = content.slice(match.index).match(/triggers:\s*\[([^\]]+)\]/);
    const triggers = triggerMatch
      ? triggerMatch[1].match(/'([^']+)'/g)?.map(t => t.replace(/'/g, '')) || []
      : [];

    // Find source
    const sourceMatch = content.slice(match.index).match(/source:\s*'([^']+)'/);
    const source = sourceMatch ? sourceMatch[1] : 'unknown';

    skills.push({
      id,
      name,
      description: description.slice(0, 150), // Truncate for index
      category,
      triggers: triggers.slice(0, 5), // Keep top 5 triggers
      source,
    });
  }

  return skills;
}

function generateIndex(skills: SkillIndex[]): string {
  const lines: string[] = [];

  // Group by category
  const byCategory: Record<string, SkillIndex[]> = {};
  for (const skill of skills) {
    const cat = skill.category;
    if (!byCategory[cat]) byCategory[cat] = [];
    byCategory[cat].push(skill);
  }

  for (const [category, categorySkills] of Object.entries(byCategory)) {
    const catName = CATEGORY_MAP[category] || category;
    lines.push(`\n#### ${catName} (${categorySkills.length}个)`);

    for (const skill of categorySkills) {
      const desc = skill.description.slice(0, 80);
      lines.push(`- **${skill.id}**: ${desc}...`);
      lines.push(`  - 触发词: \`${skill.triggers.join('`, `')}\``);
    }
  }

  return lines.join('\n');
}

function generateSkillMd(skills: SkillIndex[]): string {
  const index = generateIndex(skills);

  const template = `---
name: fastskills-router
description: 自动检测用户意图，智能加载 227+ 专业技能，无感增强 Claude 能力。当用户讨论前端、后端、数据分析、科学研究、文档处理等话题时自动匹配相关技能。
---

# FastSkills 自动路由系统

> 🚀 自动检测上下文，智能加载专业技能，无感增强 Claude 能力

## 核心规则

**作为 Claude，你必须遵循以下自动路由规则：**

### 1. 意图检测

每次收到用户消息时，分析消息内容并检测意图：

| 意图 | 中文触发词 | 英文触发词 | 推荐分类 |
|------|-----------|-----------|---------|
| **创建** | 创建、新建、开发、实现、写一个 | build, create, implement, make | frontend, backend, tools |
| **研究** | 研究、调研、分析、查找 | research, investigate, analyze | scientific, bioinformatics |
| **调试** | 调试、修复、解决、bug | debug, fix, solve, troubleshoot | testing, thinking |
| **重构** | 重构、优化、改进、整理 | refactor, optimize, improve | backend, frontend |
| **文档** | 文档、注释、readme | document, readme, explain | document, sci-communication |
| **测试** | 测试、单元测试、e2e | test, testing, e2e, coverage | testing, tools |
| **部署** | 部署、发布、docker | deploy, release, docker, k8s | devops, tools |
| **分析** | 分析、统计、可视化 | analyze, statistics, visualize | data-viz, ml-ai |
| **设计** | 设计、UI、UX、界面 | design, ui, ux, interface | frontend, media |
| **优化** | 优化、性能、加速 | optimize, performance, speed | backend, devops |

### 2. 中英文同义词扩展

当检测到以下词汇时，自动扩展匹配：

| 中文 | 扩展词 |
|-----|-------|
| 蛋白质 | protein, alphafold, esm |
| 单细胞 | single-cell, scRNA, scanpy |
| 基因 | gene, genomic, genome |
| 分子/化学 | molecule, chemistry, rdkit |
| 药物 | drug, pharmaceutical |
| 爬虫/自动化 | crawler, playwright, puppeteer |
| 数据库 | database, sql, mongodb |
| 机器学习 | ml, deep-learning, pytorch |
| 可视化 | visualization, plot, chart |
| 测试 | test, pytest, jest, vitest |
| 部署 | deploy, kubernetes, docker |
| 前端 | frontend, react, vue, ui |
| 后端 | backend, api, server |

### 3. 技能加载与通知

**匹配流程：**
1. 分析用户输入 → 检测意图和关键词
2. 匹配技能索引 → 找到相关技能
3. 显示加载通知 → \`📦 已加载技能: [技能列表]\`
4. 应用技能指令 → 增强回复质量

**重要规则：**
- 首次匹配到技能时，在回复开头显示加载通知
- 已加载的技能在整个会话期间持续生效
- 新技能追加到已加载列表，不替换
- 无需重复显示已加载的技能

### 4. 按需获取完整内容

当需要某个技能的详细指令时，从以下来源获取：

**FastSkills API（推荐）：**
\`\`\`
https://fastskills.pages.dev/api/skills.json
\`\`\`

**GitHub Raw URL：**
\`\`\`
https://raw.githubusercontent.com/[source]/[repo]/main/[path]/SKILL.md
\`\`\`

---

## 技能索引

共 ${skills.length} 个技能，按分类组织：
${index}

---

## 使用示例

**用户**: 帮我写一个 React 登录组件

**Claude 分析**:
- 意图: 创建 (写一个)
- 关键词: React, 组件
- 匹配技能: react-components, frontend-design

**Claude 回复**:
\`\`\`
📦 已加载技能: react-components, frontend-design

[应用技能增强的高质量回复...]
\`\`\`

---

**用户**: 分析这个单细胞 RNA-seq 数据

**Claude 分析**:
- 意图: 分析
- 关键词: 单细胞 → scanpy, RNA-seq
- 匹配技能: scanpy, biopython

**Claude 回复**:
\`\`\`
📦 已加载技能: scanpy, biopython

[专业的单细胞分析代码和解释...]
\`\`\`

---

*此文件由 FastSkills 自动生成，包含 ${skills.length} 个技能索引*
*完整技能内容请访问 https://fastskills.pages.dev*
`;

  return template;
}

// Main execution
async function main() {
  console.log('🚀 FastSkills Router Skill Generator');
  console.log('====================================\n');

  console.log('📖 Parsing skills from website/src/data/skills.ts...');
  const skills = parseSkills();
  console.log(`   Found ${skills.length} skills\n`);

  console.log('📝 Generating SKILL.md...');
  const skillMd = generateSkillMd(skills);

  // Output to purevibecoder-skills/fastskills-router/SKILL.md
  const outputPath = path.join(__dirname, '../../purevibecoder-skills/fastskills-router/SKILL.md');

  // Ensure directory exists
  const outputDir = path.dirname(outputPath);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  fs.writeFileSync(outputPath, skillMd, 'utf-8');

  const stats = fs.statSync(outputPath);
  console.log(`   Output: ${outputPath}`);
  console.log(`   Size: ${(stats.size / 1024).toFixed(1)} KB`);

  console.log('\n✅ Done!');
  console.log('\n📋 Next steps:');
  console.log('   1. Add to ~/.claude/CLAUDE.md:');
  console.log('      @/Users/marovole/GitHub/fastskills/purevibecoder-skills/fastskills-router/SKILL.md');
  console.log('   2. Start a new Claude Code session to test');
}

main().catch(console.error);
