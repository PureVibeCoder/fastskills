import { categories, type Category } from './categories';

export interface Skill {
  id: string;
  name: string;
  description: string;
  category: Category;
  source: 'anthropic' | 'claudekit' | 'scientific' | 'community' | 'composio' | 'voltagent' | 'obsidian' | 'planning';
  triggers: string[];
  priority: number;
  content: string;
}

export const skills: Skill[] = [
  // Frontend Skills
  {
    id: 'frontend-design',
    name: 'Frontend Design',
    description: '创建生产级前端界面，遵循设计原则和最佳实践',
    category: categories[0],
    source: 'anthropic',
    triggers: ['UI', '界面', '组件', '页面', 'CSS', '设计'],
    priority: 6,
    content: `---
name: frontend-design
description: |
  创建独特、生产质量的前端界面。
  专注于现代设计原则、可访问性和最佳实践。
  适用于：React、Vue、Svelte 等框架。
---

# Frontend Design

此技能专注于创建高质量的前端用户界面。

## 使用场景

- 设计和实现新的 UI 组件
- 改进现有界面的视觉设计
- 确保可访问性和响应式设计
- 遵循现代设计系统原则

## 触发词

UI、界面、组件、页面、CSS、设计、布局、样式

## 来源

Anthropic 官方技能
`
  },
  {
    id: 'modern-frontend-design',
    name: 'Modern Frontend Design',
    description: '现代前端设计系统，包含设计模式和美学原则',
    category: categories[0],
    source: 'anthropic',
    triggers: ['现代前端', '设计系统', '美学', '视觉'],
    priority: 7,
    content: `---
name: modern-frontend-design
description: |
  现代前端设计系统专家。
  深入理解设计模式、美学原则和用户体验。
---

# Modern Frontend Design

专注于现代前端设计的技能包。

## 核心能力

- 设计系统架构
- 视觉美学指导
- 用户体验优化
- 设计模式应用

## 触发词

现代前端、设计系统、美学、视觉、UX
`
  },
  {
    id: 'react-components',
    name: 'React Components',
    description: 'React 组件开发和状态管理最佳实践',
    category: categories[0],
    source: 'community',
    triggers: ['React', '组件', 'useState', 'useEffect', 'Hooks'],
    priority: 6,
    content: `---
name: react-components
description: |
  React 组件开发专家。
  精通 Hooks、状态管理和组件设计模式。
---

# React Components

React 组件开发和架构最佳实践。

## 技能范围

- 函数式组件和 Hooks
- 状态管理（Context、Redux、Zustand）
- 组件设计模式
- 性能优化
`
  },

  // Backend Skills
  {
    id: 'backend-development',
    name: 'Backend Development',
    description: '后端开发、API 设计、服务端架构',
    category: categories[1],
    source: 'claudekit',
    triggers: ['后端', 'API', '服务端', '服务器', 'REST', 'GraphQL'],
    priority: 6,
    content: `---
name: backend-development
description: |
  后端开发专家。
  精通 API 设计、数据库架构和服务端开发。
---

# Backend Development

全栈后端开发能力。

## 核心领域

- RESTful API 设计
- GraphQL API
- 数据库建模
- 认证和授权
- 微服务架构
`
  },
  {
    id: 'database-design',
    name: 'Database Design',
    description: '数据库设计、SQL 优化、数据建模',
    category: categories[1],
    source: 'claudekit',
    triggers: ['数据库', 'SQL', 'PostgreSQL', 'MySQL', 'MongoDB'],
    priority: 6,
    content: `---
name: database-design
description: |
  数据库设计和优化专家。
  支持关系型和非关系型数据库。
---

# Database Design

专业的数据库设计和优化技能。

## 支持的数据库

- PostgreSQL
- MySQL
- MongoDB
- Redis
- SQLite
`
  },

  // Testing Skills
  {
    id: 'webapp-testing',
    name: 'Web App Testing',
    description: '使用 Playwright 进行 E2E 测试',
    category: categories[2],
    source: 'community',
    triggers: ['E2E', '测试', 'playwright', '端到端', '自动化测试'],
    priority: 6,
    content: `---
name: webapp-testing
description: |
  Web 应用测试专家。
  使用 Playwright 进行端到端测试。
---

# Web App Testing

基于 Playwright 的 E2E 测试解决方案。

## 测试能力

- 浏览器自动化测试
- 跨浏览器测试
- 移动端测试
- 视觉回归测试
- 性能测试
`
  },
  {
    id: 'code-review',
    name: 'Code Review',
    description: '代码审查、PR 评审、质量检查',
    category: categories[2],
    source: 'community',
    triggers: ['审查', 'review', 'PR', '代码质量', 'Code Review'],
    priority: 7,
    content: `---
name: code-review
description: |
  代码审查专家。
  全面的 PR 评审和代码质量检查。
---

# Code Review

专业的代码审查和质量管理。

## 审查维度

- 代码正确性
- 性能考虑
- 安全问题
- 可维护性
- 最佳实践
`
  },

  // DevOps Skills
  {
    id: 'devops',
    name: 'DevOps',
    description: 'CI/CD、Docker、部署自动化',
    category: categories[3],
    source: 'claudekit',
    triggers: ['DevOps', 'CI/CD', '部署', 'Docker', 'Kubernetes'],
    priority: 6,
    content: `---
name: devops
description: |
  DevOps 自动化专家。
  精通 CI/CD、容器化和云部署。
---

# DevOps

现代化的 DevOps 实践和自动化。

## 核心技能

- Docker 容器化
- Kubernetes 编排
- GitHub Actions
- CI/CD 管道
- 云平台部署
`
  },
  {
    id: 'docker',
    name: 'Docker',
    description: 'Docker 容器化和容器编排',
    category: categories[3],
    source: 'community',
    triggers: ['Docker', '容器', 'Dockerfile', 'docker-compose'],
    priority: 6,
    content: `---
name: docker
description: |
  Docker 容器化专家。
  优化镜像构建和容器配置。
---

# Docker

专业的 Docker 容器化解决方案。

## 技能范围

- Dockerfile 优化
- 多阶段构建
- docker-compose 编排
- 镜像优化和安全
`
  },

  // Documentation Skills
  {
    id: 'document-skills',
    name: 'Document Skills',
    description: '文档生成、Markdown 处理',
    category: categories[5],
    source: 'community',
    triggers: ['文档', 'Markdown', 'readme', '文档生成'],
    priority: 5,
    content: `---
name: document-skills
description: |
  技术文档专家。
  生成高质量的 README 和 API 文档。
---

# Document Skills

专业的技术文档编写能力。

## 文档类型

- README 文档
- API 文档
- 用户指南
- 开发者文档
- 变更日志
`
  },
  {
    id: 'pdf',
    name: 'PDF',
    description: 'PDF 生成和处理',
    category: categories[5],
    source: 'anthropic',
    triggers: ['PDF', 'pdf文件', '导出PDF'],
    priority: 6,
    content: `---
name: pdf
description: |
  PDF 文档处理专家。
  生成、转换和处理 PDF 文件。
---

# PDF

PDF 文档处理解决方案。

## 能力范围

- PDF 生成
- PDF 转换
- 文档合并
- PDF 解析
`
  },

  // Knowledge Management Skills (Obsidian)
  {
    id: 'obsidian-markdown',
    name: 'Obsidian Markdown',
    description: '创建和编辑 Obsidian 风格的 Markdown 文件，支持 wikilinks、callouts、properties 等',
    category: categories[6],
    source: 'obsidian',
    triggers: ['Obsidian', 'wikilinks', 'callout', 'markdown', '双链', '知识库', 'Obsidian笔记'],
    priority: 7,
    content: `---
name: obsidian-markdown
description: Create and edit Obsidian Flavored Markdown with wikilinks, embeds, callouts, properties, and other Obsidian-specific syntax. Use when working with .md files in Obsidian, or when the user mentions wikilinks, callouts, frontmatter, tags, embeds, or Obsidian notes.
---

# Obsidian Flavored Markdown Skill

This skill enables Claude Code to create and edit valid Obsidian Flavored Markdown, including all Obsidian-specific syntax extensions.

## Overview

Obsidian uses a combination of Markdown flavors:
- [CommonMark](https://commonmark.org/)
- [GitHub Flavored Markdown](https://github.github.com/gfm/)
- [LaTeX](https://www.latex-project.org/) for math
- Obsidian-specific extensions (wikilinks, callouts, embeds, etc.)

For complete syntax reference, see the full SKILL.md file in obsidian-skills/obsidian-markdown/
`
  },
  {
    id: 'obsidian-bases',
    name: 'Obsidian Bases',
    description: '创建和编辑 Obsidian Bases 格式文件，支持数据库视图和结构化数据',
    category: categories[6],
    source: 'obsidian',
    triggers: ['Obsidian Bases', 'base文件', '数据库视图', 'Obsidian数据库', 'Bases', '视图'],
    priority: 6,
    content: `---
name: obsidian-bases
version: "1.0.0"
description: Create and edit Obsidian Bases (.base files) with views, filters, formulas, and summaries. Use when working with .base files, creating database-like views of notes, or when the user mentions Bases, table views, card views, filters, or formulas in Obsidian.
---

# Obsidian Bases Skill

This skill enables Claude Code to create and edit valid Obsidian Bases (\`.base\` files) including views, filters, formulas, and all related configurations.

## Overview

Obsidian Bases are YAML-based files that define dynamic views of notes in an Obsidian vault. A Base file can contain multiple views, global filters, formulas, property configurations, and custom summaries.

For complete syntax reference, see the full SKILL.md file in obsidian-skills/obsidian-bases/
`
  },
  {
    id: 'json-canvas',
    name: 'JSON Canvas',
    description: '创建和编辑 JSON Canvas 无限画布文件，可视化知识图谱',
    category: categories[6],
    source: 'obsidian',
    triggers: ['JSON Canvas', 'canvas', '画布', '可视化', '知识图谱', 'Canvas文件', '无限画布'],
    priority: 6,
    content: `---
name: json-canvas
version: "1.0.0"
description: Create and edit JSON Canvas files (.canvas) with nodes, edges, groups, and connections. Use when working with .canvas files, creating visual canvases, mind maps, flowcharts, or when the user mentions Canvas files in Obsidian.
---

# JSON Canvas Skill

This skill enables Claude Code to create and edit valid JSON Canvas files (\`.canvas\`) used in Obsidian and other applications.

## Overview

JSON Canvas is an open file format for infinite canvas data. Canvas files use the \`.canvas\` extension and contain valid JSON following the [JSON Canvas Spec 1.0](https://jsoncanvas.org/spec/1.0/).

For complete syntax reference, see the full SKILL.md file in obsidian-skills/json-canvas/
`
  },

  // Media Skills
  {
    id: 'image-enhancer',
    name: 'Image Enhancer',
    description: '图片增强和处理',
    category: categories[7],
    source: 'community',
    triggers: ['图片', '图像', '增强', 'Image'],
    priority: 5,
    content: `---
name: image-enhancer
description: |
  图片处理和增强专家。
  图像编辑、优化和格式转换。
---

# Image Enhancer

专业的图片处理解决方案。

## 功能特性

- 图片裁剪和调整
- 格式转换
- 压缩优化
- 滤镜应用
`
  },

  // Thinking Skills
  {
    id: 'sequential-thinking',
    name: 'Sequential Thinking',
    description: '逐步推理和顺序思考',
    category: categories[8],
    source: 'claudekit',
    triggers: ['顺序思考', '逐步推理', '逻辑推理'],
    priority: 4,
    content: `---
name: sequential-thinking
description: |
  顺序思考专家。
  通过逐步推理解决复杂问题。
---

# Sequential Thinking

结构化的逐步推理方法。

## 思考模式

1. 问题分解
2. 逐步分析
3. 逻辑推理
4. 结论验证
`
  },
  {
    id: 'planning-with-files',
    name: 'Planning with Files',
    description: 'Manus 风格持久化 Markdown 规划，用文档作为 LLM 的外部存储',
    category: categories[8],
    source: 'planning',
    triggers: ['规划', '任务', '计划', 'plan', 'task_plan', 'notes', 'Manus', '文件规划', '持久化规划'],
    priority: 8,
    content: `---
name: planning-with-files
description: |
  Manus 风格持久化 Markdown 规划。
  用文档作为 LLM 的外部存储，实现任务规划、进度追踪和知识存储。
  适用于：复杂任务、多步骤项目、研究任务、任何需要结构化输出的场景。
---

# Planning with Files

像 Manus 一样工作：使用持久化 Markdown 文件作为你的"磁盘工作内存"。

## 核心概念

Manus AI（被 Meta 以 20 亿美元收购）的核心工作流模式——用文件系统作为 LLM 的外部存储。

## 3-文件模式

对于每个非平凡任务，创建三个文件：

| 文件 | 用途 | 更新时机 |
|------|------|----------|
| \`task_plan.md\` | 追踪阶段和进度 | 每个阶段后 |
| \`notes.md\` | 存储研究发现 | 研究过程中 |
| \`[产出物].md\` | 最终输出 | 完成后 |

## 核心工作流

- 循环 1：创建 task_plan.md，包含目标和阶段
- 循环 2：研究 → 保存到 notes.md → 更新 task_plan.md
- 循环 3：读取 notes.md → 创建产出物 → 更新 task_plan.md
- 循环 4：交付最终输出

## 关键规则

1. **始终先创建计划** - 对于复杂任务，永远不要跳过 task_plan.md
2. **决策前读取计划** - 每次重大决策前重新读取，保持目标在注意力窗口
3. **行动后更新** - 完成每个阶段后立即更新计划文件
4. **存储而非塞入** - 大内容存入文件，而非塞入上下文
5. **记录所有错误** - 每次错误都记录在"Errors Encountered"部分

## 触发词

规划、任务、计划、plan、task_plan、notes、Manus、文件规划、持久化规划
`
  },

  // Tools Skills
  {
    id: 'mcp-builder',
    name: 'MCP Builder',
    description: 'MCP 服务器创建和开发',
    category: categories[9],
    source: 'community',
    triggers: ['MCP', '服务器', '集成', 'Model Context Protocol'],
    priority: 6,
    content: `---
name: mcp-builder
description: |
  MCP 服务器开发专家。
  创建和调试 Model Context Protocol 服务器。
---

# MCP Builder

MCP 服务器开发和集成。

## 开发能力

- MCP 服务器架构
- 工具函数开发
- 资源管理
- Prompt 模板
- 客户端集成
`
  },
  {
    id: 'browser-automation',
    name: 'Browser Automation',
    description: '浏览器自动化和网页抓取',
    category: categories[9],
    source: 'community',
    triggers: ['浏览器', '自动化', '抓取', 'Puppeteer', 'Playwright'],
    priority: 5,
    content: `---
name: browser-automation
description: |
  浏览器自动化专家。
  使用 Puppeteer/Playwright 进行网页操作。
---

# Browser Automation

浏览器自动化和网页交互。

## 自动化能力

- 网页导航
- 元素交互
- 数据抓取
- 截图和 PDF
- 表单填写
`
  },

  // Scientific Skills (示例 - 实际包含 138 个技能)
  {
    id: 'biopython',
    name: 'BioPython',
    description: '生物序列分析、基因组学、蛋白质结构分析',
    category: categories[4],
    source: 'scientific',
    triggers: ['生物', '基因', 'DNA', 'RNA', '蛋白质', '序列分析', 'BioPython'],
    priority: 7,
    content: `---
name: biopython
description: |
  BioPython 生物信息学分析专家。
  处理生物序列、基因组数据、蛋白质结构。
---

# BioPython

专业的生物信息学分析工具。

## 核心功能

- DNA/RNA 序列分析
- 蛋白质结构预测
- 系统发育树构建
- BLAST 搜索
- GenBank 数据处理
`
  },
  {
    id: 'rdkit',
    name: 'RDKit',
    description: '化学信息学、分子操作、药物发现',
    category: categories[4],
    source: 'scientific',
    triggers: ['化学', '分子', '药物', '化合物', 'RDKit', 'SMILES'],
    priority: 7,
    content: `---
name: rdkit
description: |
  RDKit 化学信息学专家。
  分子结构分析、药物性质预测、虚拟筛选。
---

# RDKit

化学信息学和药物发现工具。

## 主要能力

- 分子结构操作
- 化学性质计算
- 分子指纹生成
- 子结构搜索
- 3D 分子构象
`
  },
  {
    id: 'scanpy',
    name: 'Scanpy',
    description: '单细胞 RNA 测序分析、细胞类型鉴定',
    category: categories[4],
    source: 'scientific',
    triggers: ['单细胞', 'scRNA-seq', 'Scanpy', '细胞', '基因表达'],
    priority: 7,
    content: `---
name: scanpy
description: |
  Scanpy 单细胞分析专家。
  处理和分析单细胞 RNA-seq 数据。
---

# Scanpy

单细胞 RNA 测序数据分析。

## 分析流程

- 质量控制和过滤
- 归一化和批次矫正
- 降维和聚类
- 差异表达分析
- 细胞类型注释
`
  },
  {
    id: 'deepchem',
    name: 'DeepChem',
    description: '深度学习药物发现、分子性质预测',
    category: categories[4],
    source: 'scientific',
    triggers: ['深度学习', '药物发现', 'DeepChem', 'AI药物', '分子预测'],
    priority: 7,
    content: `---
name: deepchem
description: |
  DeepChem 深度学习药物发现专家。
  使用 AI 预测分子性质和生物活性。
---

# DeepChem

AI 驱动的药物发现平台。

## 核心功能

- 分子性质预测
- ADMET 预测
- 蛋白-配体结合预测
- 图神经网络模型
- 虚拟筛选
`
  },
  {
    id: 'pubmed',
    name: 'PubMed',
    description: '生物医学文献搜索和分析',
    category: categories[4],
    source: 'scientific',
    triggers: ['文献', 'PubMed', '论文', '生物医学', '科研'],
    priority: 6,
    content: `---
name: pubmed
description: |
  PubMed 文献检索专家。
  搜索和分析生物医学文献。
---

# PubMed

生物医学文献数据库访问。

## 功能特性

- 关键词搜索
- 高级查询构建
- 文献元数据提取
- 引用分析
- 相关文献推荐
`
  }
];

// 按分类获取技能
export function getSkillsByCategory(categoryId: string): Skill[] {
  return skills.filter(skill => skill.category.id === categoryId);
}

// 根据 ID 获取技能
export function getSkillById(id: string): Skill | undefined {
  return skills.find(skill => skill.id === id);
}

// 搜索技能
export function searchSkills(query: string): Skill[] {
  const lowerQuery = query.toLowerCase();
  return skills.filter(skill =>
    skill.name.toLowerCase().includes(lowerQuery) ||
    skill.description.toLowerCase().includes(lowerQuery) ||
    skill.triggers.some(trigger => trigger.toLowerCase().includes(lowerQuery))
  );
}
