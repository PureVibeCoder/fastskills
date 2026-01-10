#!/usr/bin/env npx tsx
/**
 * FastSkills Plugin Generator
 *
 * Generates a CLAUDE.md plugin file with:
 * - Lightweight index of all 227+ skills
 * - Full content of Top 50 popular skills
 * - Auto-routing engine rules
 */

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Top 50 popular skills (based on recommended packages and general utility)
const TOP_50_SKILLS = [
  // General Development (15)
  'backend-development',
  'database-design',
  'frontend-design',
  'modern-frontend-design',
  'react-components',
  'canvas-design',
  'theme-factory',
  'devops',
  'docker',
  'code-review',
  'webapp-testing',
  'browser-automation',
  'mcp-builder',
  'skill-creator',
  'frontend-designer',

  // Document Processing (5)
  'doc-coauthoring',
  'docx',
  'pdf',
  'pptx',
  'xlsx',

  // Knowledge Management (3)
  'obsidian-markdown',
  'obsidian-bases',
  'json-canvas',

  // Thinking Methods (6)
  'sequential-thinking',
  'planning-with-files',
  'brainstorming',
  'when-stuck',
  'context-engineering',
  'research-executor',

  // Data Analysis (5)
  'matplotlib',
  'plotly',
  'seaborn',
  'statistical-analysis',
  'exploratory-data-analysis',

  // Machine Learning (4)
  'pytorch-lightning',
  'transformers',
  'scikit-learn',
  'shap',

  // Scientific Research (12)
  'rdkit',
  'scanpy',
  'biopython',
  'scientific-writing',
  'literature-review',
  'pubmed-database',
  'uniprot-database',
  'deepchem',
  'datamol',
  'clinical-decision-support',
  'alphafold-database',
  'scientific-visualization',
];

interface SkillIndex {
  id: string;
  name: string;
  category: string;
  triggers: string[];
  description: string;
}

interface FullSkill extends SkillIndex {
  content: string;
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

function parseSkills(): FullSkill[] {
  const skillsPath = path.join(__dirname, '../website/src/data/skills.ts');
  const content = fs.readFileSync(skillsPath, 'utf-8');

  const skills: FullSkill[] = [];

  // Parse each skill object
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

    // Find content (this is tricky due to template literals)
    const contentStart = content.indexOf("content: `", match.index);
    if (contentStart !== -1) {
      let depth = 0;
      let contentEnd = contentStart + 10;
      let inBacktick = true;

      for (let i = contentStart + 10; i < content.length && inBacktick; i++) {
        if (content[i] === '`' && content[i-1] !== '\\') {
          inBacktick = false;
          contentEnd = i;
        }
      }

      const skillContent = content.slice(contentStart + 10, contentEnd);

      skills.push({
        id,
        name,
        description: description.slice(0, 200), // Truncate for index
        category,
        triggers,
        source,
        content: skillContent,
      });
    }
  }

  return skills;
}

function generateIndex(skills: FullSkill[]): string {
  const lines: string[] = [];

  // Group by category
  const byCategory: Record<string, FullSkill[]> = {};
  for (const skill of skills) {
    const cat = skill.category;
    if (!byCategory[cat]) byCategory[cat] = [];
    byCategory[cat].push(skill);
  }

  for (const [category, categorySkills] of Object.entries(byCategory)) {
    const catName = CATEGORY_MAP[category] || category;
    lines.push(`\n### ${catName} (${categorySkills.length})`);

    for (const skill of categorySkills) {
      const isHot = TOP_50_SKILLS.includes(skill.id) ? '🔥' : '';
      lines.push(`- **${skill.id}**${isHot}: ${skill.description.slice(0, 100)}...`);
      lines.push(`  触发词: ${skill.triggers.slice(0, 5).join(', ')}`);
    }
  }

  return lines.join('\n');
}

function generatePlugin(skills: FullSkill[]): string {
  const hotSkills = skills.filter(s => TOP_50_SKILLS.includes(s.id));
  const index = generateIndex(skills);

  const template = `# FastSkills 自动增强系统

> 🚀 自动检测上下文，智能加载 227+ 专业技能，无感增强 Claude 能力

## 📋 系统说明

本系统会在每次对话中自动分析用户意图，并加载最相关的专业技能来增强回复质量。

### 工作原理

1. **意图检测**: 分析用户输入，识别任务类型（创建、研究、调试、设计等）
2. **关键词匹配**: 根据触发词匹配相关技能
3. **自动加载**: 将匹配的技能指令应用到当前对话
4. **显示通知**: 告知用户已加载哪些技能

### 会话状态追踪

**重要规则**：每次回复时，如果检测到需要加载新技能，必须在回复开头显示：

\`\`\`
📦 已加载技能: [技能1], [技能2], ...
\`\`\`

已加载的技能在整个会话期间持续生效，无需重复加载。

---

## 🎯 意图检测规则

根据用户输入自动检测意图并推荐技能分类：

| 意图类型 | 触发词（中文） | 触发词（英文） | 推荐分类 |
|---------|--------------|--------------|---------|
| 创建 CREATE | 创建、新建、开发、实现、写一个 | build, create, implement, make | frontend, backend, tools |
| 研究 RESEARCH | 研究、调研、分析、查找 | research, investigate, analyze | scientific, bioinformatics |
| 调试 DEBUG | 调试、修复、解决、排查、bug | debug, fix, solve, troubleshoot | testing, thinking |
| 重构 REFACTOR | 重构、优化、改进、整理 | refactor, optimize, improve | backend, frontend |
| 文档 DOCUMENT | 文档、注释、说明、readme | document, readme, explain | document, sci-communication |
| 测试 TEST | 测试、单元测试、e2e、覆盖率 | test, testing, unit test, e2e | testing, tools |
| 部署 DEPLOY | 部署、发布、上线、docker | deploy, release, docker, k8s | devops, tools |
| 分析 ANALYZE | 分析、统计、数据、可视化 | analyze, statistics, data, visualize | data-viz, ml-ai |
| 设计 DESIGN | 设计、UI、UX、界面、样式 | design, ui, ux, interface, style | frontend, media |
| 优化 OPTIMIZE | 优化、性能、加速、缓存 | optimize, performance, speed | backend, devops |

---

## 🔤 中英文同义词映射

当检测到以下中文词汇时，自动扩展匹配相关英文技能：

| 中文 | 英文扩展 |
|-----|---------|
| 蛋白质 | protein, alphafold, esm |
| 单细胞 | single-cell, scRNA, scanpy |
| 基因 | gene, genomic, genome |
| 分子 | molecule, molecular, compound |
| 化学 | chemistry, chemical, cheminformatics |
| 药物 | drug, pharmaceutical, medicine |
| 爬虫 | crawler, scraping, playwright, puppeteer |
| 自动化 | automation, automated, auto |
| 浏览器 | browser, chrome, web |
| 数据库 | database, sql, mongodb, postgresql |
| 机器学习 | machine-learning, ml, deep-learning |
| 深度学习 | deep-learning, neural, pytorch |
| 可视化 | visualization, visualize, plot, chart |
| 测试 | test, testing, pytest, jest, vitest |
| 部署 | deploy, deployment, kubernetes, docker |
| 前端 | frontend, react, vue, ui |
| 后端 | backend, api, server |

---

## 📚 技能索引（共 ${skills.length} 个）

以下是所有可用技能的索引，🔥 标记表示热门技能（已内嵌完整内容）：
${index}

---

## 🔥 热门技能完整内容

以下 ${hotSkills.length} 个热门技能已内嵌完整内容，可直接应用：

${hotSkills.map(skill => `
### ${skill.id}

**分类**: ${CATEGORY_MAP[skill.category] || skill.category}
**触发词**: ${skill.triggers.join(', ')}

\`\`\`markdown
${skill.content.trim()}
\`\`\`
`).join('\n---\n')}

---

## 📡 按需加载其他技能

对于未内嵌的技能，可以从以下 URL 获取完整内容：

\`\`\`
https://raw.githubusercontent.com/PureVibeCoder/fastskills/main/[source]-skills/[skill-id]/SKILL.md
\`\`\`

或通过 FastSkills API 获取：

\`\`\`
https://fastskills.pages.dev/api/skills.json
\`\`\`

---

## ⚙️ 自动路由引擎规则

**作为 Claude，你必须遵循以下规则：**

1. **每次收到用户消息时**，分析消息内容并检测意图
2. **匹配技能**：根据意图类型和关键词匹配相关技能
3. **加载通知**：如果需要加载新技能，在回复开头显示 \`📦 已加载技能: ...\`
4. **应用技能**：将已加载技能的指令和最佳实践应用到回复中
5. **持久化**：已加载的技能在整个会话中持续生效
6. **累积加载**：新技能追加到已加载列表，不替换

**匹配优先级**：
1. 精确 ID 匹配（最高）
2. 触发词匹配
3. 意图-分类匹配
4. 同义词扩展匹配

**示例**：

用户: "帮我写一个 React 登录组件"

分析:
- 意图: CREATE (写一个)
- 关键词: React, 组件
- 匹配技能: react-components, frontend-design

回复:
📦 已加载技能: react-components, frontend-design

[应用技能增强的高质量回复...]

---

*此文件由 FastSkills 自动生成，包含 ${skills.length} 个技能索引和 ${hotSkills.length} 个热门技能完整内容*
`;

  return template;
}

// Main execution
async function main() {
  console.log('🚀 FastSkills Plugin Generator');
  console.log('================================\n');

  console.log('📖 Parsing skills from website/src/data/skills.ts...');
  const skills = parseSkills();
  console.log(`   Found ${skills.length} skills\n`);

  const hotSkillsFound = skills.filter(s => TOP_50_SKILLS.includes(s.id));
  console.log(`🔥 Hot skills (embedded): ${hotSkillsFound.length}/${TOP_50_SKILLS.length}`);

  const missing = TOP_50_SKILLS.filter(id => !skills.find(s => s.id === id));
  if (missing.length > 0) {
    console.log(`   Missing: ${missing.join(', ')}`);
  }

  console.log('\n📝 Generating plugin file...');
  const plugin = generatePlugin(skills);

  const outputPath = path.join(__dirname, 'FASTSKILLS.md');
  fs.writeFileSync(outputPath, plugin, 'utf-8');

  const stats = fs.statSync(outputPath);
  console.log(`   Output: ${outputPath}`);
  console.log(`   Size: ${(stats.size / 1024).toFixed(1)} KB`);

  console.log('\n✅ Done! Copy FASTSKILLS.md content to your ~/.claude/CLAUDE.md');
}

main().catch(console.error);
