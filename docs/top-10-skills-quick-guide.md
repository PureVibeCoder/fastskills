# Claude Skills 入门：10 个让 AI 更好用的技能

> 快速导览版 —— 每个技能附带原作者开源链接

Skills 是什么？简单说就是一份"说明书"，告诉 Claude 怎么做某类事情。下面是 10 个最适合普通用户的技能，可以直接从原作者的 GitHub 仓库获取。

---

## 1. 头脑风暴 (Brainstorming)

让 Claude 在动手之前先问清楚你的需求。不再出现"写完才发现不是我想要的"情况，通过一问一答帮你理清思路。

🔗 **技能来源**: [obra/superpowers](https://github.com/obra/superpowers)

---

## 2. 文档协作 (Doc Co-Authoring)

一起写文档时，通过"读者测试"验证可读性：让一个没有上下文的新 Claude 读你的文档，看它能不能理解。发现盲点就修。

🔗 **技能来源**: [anthropics/skills](https://github.com/anthropics/skills)

---

## 3. 内部沟通 (Internal Comms)

企业内部沟通模板库：周报（Progress/Plans/Problems）、公司新闻稿、项目更新、FAQ 文档。拿来就能用，格式专业。

🔗 **技能来源**: [anthropics/skills](https://github.com/anthropics/skills)

---

## 4. 深度研究 (Research Executor)

7 阶段研究流程：界定问题 → 分解子主题 → 并行派出研究员 → 交叉验证 → 综合报告 → 引用检查 → 打包输出。所有来源按可信度分级（A-E）。

🔗 **技能来源**: [liangdabiao/Claude-Code-Deep-Research](https://github.com/liangdabiao/Claude-Code-Deep-Research-main)

---

## 5. 市场研究报告 (Market Research Reports)

生成麦肯锡风格的 50 页研究报告：执行摘要、TAM/SAM/SOM、波特五力、PESTLE 分析、竞争格局、风险评估。自动生成可视化图表。

🔗 **技能来源**: [K-Dense-AI/claude-scientific-skills](https://github.com/K-Dense-AI/claude-scientific-skills)

---

## 6. Excel 专家 (XLSX)

像 Excel 高手一样帮你：自动生成 VLOOKUP/SUMIF/透视表公式、设置条件格式（数据越大颜色越深）、创建专业图表、做财务建模。

🔗 **技能来源**: [anthropics/skills](https://github.com/anthropics/skills)

---

## 7. PPT 专家 (PPTX)

内置多种专业配色方案和布局策略。把长文字变成要点清晰的幻灯片，把数据变成直观图表，把流程变成步骤图。

🔗 **技能来源**: [anthropics/skills](https://github.com/anthropics/skills)

---

## 8. 科学写作 (Scientific Writing)

按学术规范写论文：正确的引用格式（APA/MLA/Chicago）、规范的图表标注、严谨的逻辑结构。确保写出来的东西符合期刊投稿标准。

🔗 **技能来源**: [K-Dense-AI/claude-scientific-skills](https://github.com/K-Dense-AI/claude-scientific-skills)

---

## 9. 知识管理 (Obsidian Bases)

帮 Obsidian 用户设计目录结构、优化双链引用、配置数据库视图、管理文档属性。把散乱笔记整理成可检索的知识网络。

🔗 **技能来源**: [kepano/obsidian-skills](https://github.com/kepano/obsidian-skills)

---

## 10. 创意设计 (Canvas Design)

通过文字描述生成视觉设计：活动海报、社交媒体配图、简单排版、数据可视化。对自媒体和内容创作者很实用。

🔗 **技能来源**: [anthropics/skills](https://github.com/anthropics/skills)

---

## 快速开始

上面这些技能都已收录在 **FastSkills** 项目中。在你的 `CLAUDE.md` 里加一行：

```markdown
@https://raw.githubusercontent.com/PureVibeCoder/fastskills/main/purevibecoder-skills/fastskills-router/SKILL.md
```

路由器会根据你说的话自动加载对应技能。

---

**开源地址**: https://github.com/PureVibeCoder/fastskills
**官网**: https://fastskills.pages.dev

