---
description: 为研究主题创建详细的执行计划，包括子主题分解和智能体部署策略
argument-hint: [结构化研究提示]
allowed-tools: Read, Write, TodoWrite
---

# Plan Research - 规划研究

为您的研究主题创建详细的执行计划。

## 研究提示

$ARGUMENTS

## 规划内容

此命令将创建包含以下内容的研究计划：

### 1. 主题分解
将主题分解为 3-7 个可管理的子主题

### 2. 智能体部署策略
- 确定需要部署多少个研究智能体 (3-8个)
- 为每个智能体分配特定的子主题或角色
- 规划并行 vs 顺序执行

### 3. Graph of Thoughts 策略
选择适当的研究模式：
- **平衡模式**：Generate(4-5) → Score → Deepen top → Aggregate
- **深度优先**：Generate(3) → Take best → Generate(3) from it
- **广度优先**：Generate(8) → KeepBestN(5) → Generate(2) each

### 4. 时间线估算
- 快速研究（窄主题）：10-15 分钟
- 标准研究（中等范围）：20-30 分钟
- 全面研究（广泛范围）：30-60 分钟

### 5. 质量目标
- 来源质量要求（A-E 评级）
- 引用完整性标准
- 最终报告格式

## 输出

您将获得一个可执行的研究计划，可以直接用于 **research-executor** 技能。
