---
description: 将多个研究智能体的发现综合成连贯的报告，包含执行摘要和完整分析
argument-hint: [研究笔记目录路径]
allowed-tools: Read, Write, Glob
---

# Synthesize Findings - 综合研究发现

将来自多个研究智能体的原始发现组合成结构化的研究报告。

## 研究笔记位置

$ARGUMENTS

## 综合流程

**synthesizer** 技能将执行以下操作：

### 1. 收集和组织
- 读取所有智能体研究笔记
- 识别关键主题和模式
- 对发现进行分类

### 2. 交叉引用和验证
- 识别多个来源的共同发现
- 标记矛盾或不一致
- 验证事实性声明

### 3. 生成执行摘要
创建 1-2 页的高层次摘要，包含：
- 关键发现（3-7 个要点）
- 主要结论
- 可操作的见解

### 4. 编写完整报告
生成 20-50 页的详细分析，包含：
- 引言和背景
- 方法论
- 详细发现（按主题组织）
- 分析和讨论
- 结论和建议
- 参考文献

### 5. 质量检查
- 确保所有声明都有引用
- 验证引用格式一致性
- 检查逻辑流程和连贯性

## 输出文件

- `RESEARCH/[topic]/executive_summary.md` - 执行摘要
- `RESEARCH/[topic]/full_report.md` - 完整报告
- `RESEARCH/[topic]/sources/bibliography.md` - 完整参考文献

报告将包含内联引用，格式为 (Author, Year, "Title")。
