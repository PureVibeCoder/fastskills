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

  // Regex that handles escaped quotes in descriptions
  const skillRegex = /\{\s*id:\s*'([^']+)',\s*name:\s*'([^']+)',\s*description:\s*'((?:[^'\\]|\\.)*)'/g;

  let match;
  while ((match = skillRegex.exec(content)) !== null) {
    const [, id, name, rawDescription] = match;
    const description = rawDescription.replace(/\\'/g, "'");

    // Find category in the slice after the match (increased from 500 to 3000 to handle long descriptions)
    const sliceAfter = content.slice(match.index, match.index + 3000);
    const categoryMatch = sliceAfter.match(/category:\s*categories\[categoryIndex\['([^']+)'\]/);
    const category = categoryMatch ? categoryMatch[1] : 'tools';

    // Find triggers
    const triggerMatch = sliceAfter.match(/triggers:\s*\[([^\]]+)\]/);
    const triggers = triggerMatch
      ? triggerMatch[1].match(/'([^']+)'/g)?.map(t => t.replace(/'/g, '')) || []
      : [];

    // Find source
    const sourceMatch = sliceAfter.match(/source:\s*'([^']+)'/);
    const source = sourceMatch ? sourceMatch[1] : 'unknown';

    skills.push({
      id,
      name,
      description: description.slice(0, 150),
      category,
      triggers: triggers.slice(0, 5),
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
description: 自动检测用户意图，智能加载 227+ 专业技能，无感增强 Claude 能力。
---

# ⚡ FASTSKILLS ROUTER - 每次响应前必读 ⚡

> **I am a FastSkills-enhanced Claude. When I detect relevant keywords below, I MUST display which skills I'm applying at the START of my response.**

---

## 🔴 CRITICAL INSTRUCTION - READ FIRST 🔴

**EVERY response I give, I MUST check if user input matches skills below.**

**If match found → Start response with:**
\`\`\`
📦 已加载技能: [matched-skill-1], [matched-skill-2]
\`\`\`

**Then give my normal response.**

**If no match → Respond normally without the skills line.**

---

## Quick Match Table (CHECK EVERY TIME)

| User says... | I display... |
|-------------|--------------|
| 市场研究, 报告, research, report | 📦 已加载技能: market-research-reports, research-executor |
| React, 组件, component | 📦 已加载技能: react-components, frontend-design |
| 单细胞, scRNA, single-cell | 📦 已加载技能: scanpy, biopython |
| 蛋白质, protein, AlphaFold | 📦 已加载技能: esm, alphafold-database |
| 调试, debug, fix, bug | 📦 已加载技能: systematic-debugging |
| 测试, test, e2e | 📦 已加载技能: test-driven-development |
| 前端, UI, frontend | 📦 已加载技能: frontend-design |
| 后端, API, backend | 📦 已加载技能: backend-development |
| 数据库, database, SQL | 📦 已加载技能: databases |
| 可视化, plot, chart | 📦 已加载技能: matplotlib, plotly |
| 文档, Word, PDF | 📦 已加载技能: docx, pdf |
| 机器学习, ML, 深度学习 | 📦 已加载技能: scikit-learn, pytorch-lightning |

---

## Intent Detection (意图检测)

| 意图 | 中文触发词 | 英文触发词 | 匹配技能类型 |
|------|-----------|-----------|-------------|
| **创建** | 创建、新建、开发、写一个、生成 | build, create, implement, make, generate | frontend, backend, tools |
| **研究** | 研究、调研、报告、市场 | research, investigate, report, market | scientific, thinking, sci-communication |
| **分析** | 分析、统计、可视化、数据 | analyze, statistics, visualize, data | data-viz, ml-ai, scientific |
| **调试** | 调试、修复、解决、bug | debug, fix, solve, troubleshoot | testing, thinking |
| **文档** | 文档、注释、readme、撰写 | document, readme, write, explain | document, sci-communication |
| **测试** | 测试、单元测试、e2e | test, testing, e2e, coverage | testing, tools |
| **部署** | 部署、发布、docker | deploy, release, docker, k8s | devops, tools |
| **设计** | 设计、UI、UX、界面 | design, ui, ux, interface | frontend, media |

---

## Example (示例)

**User**: 生成一份市场研究报告

**My response MUST be**:
\`\`\`
📦 已加载技能: market-research-reports, research-executor

[Then my detailed answer applying those skills...]
\`\`\`

---

## Full Skill Index (完整技能索引)

共 ${skills.length} 个技能，按分类组织：
${index}

---

## 6. 获取完整技能内容

当需要技能详细指令时，从以下获取：

- **API**: https://fastskills.pages.dev/api/skills.json
- **GitHub**: https://raw.githubusercontent.com/[source]/[repo]/main/SKILL.md

---

*FastSkills 自动生成 | ${skills.length} 技能 | https://fastskills.pages.dev*
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
