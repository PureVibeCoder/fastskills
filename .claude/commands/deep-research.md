---
description: 对指定主题执行完整的深度研究流程，从问题细化到最终报告生成
argument-hint: [研究主题或问题]
allowed-tools: Task, WebSearch, WebFetch, Read, Write, TodoWrite, mcp__exa__web_search_exa, mcp__exa__get_code_context_exa, mcp__exa__crawling_exa, mcp__exa__deep_researcher_start, mcp__exa__deep_researcher_check
---

# Deep Research - 深度研究

对给定主题执行全面的深度研究，使用 7 阶段研究方法和 Graph of Thoughts 框架。

## 研究主题

$ARGUMENTS

## 研究流程

此命令将执行以下步骤：

### 第 1 步：问题精炼
使用 **question-refiner** 技能提出澄清问题并生成结构化研究提示。

### 第 2 步：研究规划
将研究主题分解为 3-7 个子主题并创建详细的执行计划。

### 第 3 步：多智能体研究
部署多个并行研究智能体从不同来源收集信息：
- 网络研究智能体 (3-5 个)：当前信息、趋势、新闻
- 学术/技术智能体 (1-2 个)：研究论文、技术规范
- 交叉引用智能体 (1 个)：事实核查和验证

### 第 4 步：来源三角验证
比较多个来源的发现并使用 A-E 质量评级系统验证声明。

### 第 5 步：知识综合
使用 **synthesizer** 技能将发现组合成带有内联引用的连贯报告。

### 第 6 步：引用验证
使用 **citation-validator** 技能验证所有声明都有准确、完整的引用。

### 第 7 步：输出生成
在 `RESEARCH/[topic]/` 目录中生成结构化研究输出：
- README.md
- executive_summary.md (执行摘要)
- full_report.md (完整报告)
- data/ (数据)
- visuals/ (可视化)
- sources/ (来源)
- research_notes/ (研究笔记)
- appendices/ (附录)

## 引用要求

确保每个事实性声明都包括：
1. 作者/组织名称
2. 发布日期
3. 来源标题
4. 直接 URL/DOI
5. 页码（如适用）

现在开始深度研究过程。
