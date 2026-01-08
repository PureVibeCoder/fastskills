# Claude Code Skills Hub

> Claude Code 技能收录与场景化打包平台 - 汇集 GitHub 高星开源项目的 240+ 精选技能

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Skills](https://img.shields.io/badge/Skills-241+-green)](#技能来源)
[![Packages](https://img.shields.io/badge/Packages-21-blue)](#场景化技能包)
[![Static Site](https://img.shields.io/badge/Static-Astro-orange)](https://astro.build/)
[![Website](https://img.shields.io/badge/Website-Live-success)](https://skillscontroller.pages.dev)

---

## 📖 项目简介

**Claude Code Skills Hub** 是一个专业的 Claude Code 技能聚合平台，致力于打造最全面的技能收录和场景化打包解决方案。

### 🎯 核心功能

1. **🗂️ 技能聚合与分类** - 汇集 10+ 个 GitHub 高星开源项目的 241+ 精选技能，按 16 大类别科学分类
2. **📦 场景化技能包** - 精心打造 21 个场景化技能包，覆盖开发、科研、办公等多个领域
3. **🔍 智能搜索与筛选** - 支持按名称、描述、分类快速定位所需技能
4. **⬇️ 安全下载与集成** - 提供单个技能或整包下载，支持手动集成到本地环境
5. **🛡️ 安全审查机制** - 提倡在导入技能前进行代码审查，确保运行环境安全
6. **📚 详细使用指南** - 每个技能都有完整的文档和使用示例

### ✨ 项目特色

- **全面性** - 收录市面上主流的 Claude Code 技能库，一站式获取
- **专业性** - 特别强化科学研究领域，包含 138+ 科学计算、生物信息、化学等专业技能
- **实用性** - 按实际工作场景打包，开箱即用，提升工作效率
- **开放性** - 所有技能均来自开源项目，遵循原项目许可证
- **静态化** - 基于 Astro 构建的纯静态网站，访问速度快，无后端依赖

---

## 🛡️ 安全审查机制

**重要提示**：本项目仅提供技能聚合和下载服务，所有技能均来自第三方开源项目。在导入任何技能到您的 Claude Code 环境之前，**您必须进行安全审查**。

### ⚠️ 安全风险提示

1. **代码执行风险**：技能文件可能包含执行 shell 命令、文件操作或网络请求的指令
2. **依赖风险**：技能可能依赖外部库或服务，存在供应链攻击风险
3. **权限风险**：技能可能尝试访问敏感文件或系统资源
4. **数据泄露风险**：技能可能意外或故意收集并传输敏感数据

### 🔒 安全审查清单

在下载并导入技能之前，请检查以下项目：

- [ ] **验证来源**：确认技能来自可信的开源项目
- [ ] **阅读文档**：仔细阅读 SKILL.md 文件中的所有说明
- [ ] **检查触发词**：确保技能的触发词不会与现有技能冲突
- [ ] **审查命令**：检查操作指南中的所有命令是否安全
- [ ] **评估影响**：理解技能可能执行的的所有操作及其影响

### 🚫 发现以下情况时请谨慎

- 要求执行未知的 shell 命令
- 尝试访问敏感文件路径（如 ~/.ssh, /etc 等）
- 使用 `eval()` 或类似动态代码执行
- 包含硬编码的 API 密钥、密码或令牌
- 尝试修改系统配置或环境变量
- 向未知服务器发送数据

### 📋 下载后操作

1. **解压下载的文件**
2. **仔细阅读** 每个技能目录下的 `SKILL.md` 文件
3. **检查** 技能中的命令和脚本
4. **仅导入** 您已审查并信任的技能
5. **定期更新** 已安装的技能以获取安全修复

### 🤖 自动安全扫描

下载的技能包包含自动生成的安全扫描报告（SECURITY_REPORT.md），提供以下信息：

- **安全评分**：0-100 分评估
- **风险等级**：安全 / 中等 / 高风险 / 危险
- **发现的问题**：检测到的潜在安全问题列表
- **建议措施**：针对发现问题的处理建议

> **注意**：自动扫描仅供参考，不能替代人工代码审查。

---

## 📦 技能来源

**本项目旨在聚合展示优秀的开源技能，促进技术共享。所有技能均来自 GitHub 开源项目，用户在导入使用前应自行进行安全审查（Security Review），以防潜在的安全风险。**

| 项目 | Stars | 技能数 | 领域 | 许可证 |
|:---:|:---:|:---:|:---:|:---:|
| [![Superpowers](https://github.githubassets.com/favicons/favicon.svg) Superpowers](https://github.com/obra/superpowers) | ⭐ 13k | 14 | 通用开发 | MIT |
| [![Anthropic Skills](https://github.githubassets.com/favicons/favicon.svg) Anthropic Skills](https://github.com/anthropics/skills) | 🔥 官方 | 16+ | 官方推荐 | MIT |
| [![Awesome Claude Skills](https://github.githubassets.com/favicons/favicon.svg) Awesome Claude Skills](https://github.com/ComposioHQ/awesome-claude-skills) | ⭐ 3.9k | 25+ | 社区精选 | MIT |
| [![ClaudeKit](https://github.githubassets.com/favicons/favicon.svg) ClaudeKit](https://github.com/mrgoonie/claudekit-skills) | ⭐ 1.1k | 39 | 全栈开发 | MIT |
| [![Scientific Skills](https://github.githubassets.com/favicons/favicon.svg) Scientific Skills](https://github.com/K-Dense-AI/claude-scientific-skills) | ⭐ 2.9k | 138 | 科学研究 | MIT |
| [![Deep Research](https://github.githubassets.com/favicons/favicon.svg) Deep Research](https://github.com/liangdabiao/Claude-Code-Deep-Research-main) | ⭐ 55 | 5 | 深度研究 | - |
| [![Obsidian Skills](https://github.githubassets.com/favicons/favicon.svg) Obsidian Skills](https://github.com/kepano/obsidian-skills) | ⭐ 160 | 3 | 知识管理 | MIT |
| [![VoltAgent](https://github.githubassets.com/favicons/favicon.svg) VoltAgent](https://github.com/VoltAgent/voltagent) | 🚀 新增 | 10+ | AI Agent | - |
| [![Planning with Files](https://github.githubassets.com/favicons/favicon.svg) Planning with Files](https://github.com/marovole/planning-with-files) | 🧠 新增 | 1 | 任务规划 | MIT |
| [![Composio](https://github.githubassets.com/favicons/favicon.svg) Composio Skills](https://github.com/ComposioHQ/awesome-claude-skills) | ⭐ 3.9k | 20+ | 工具集成 | MIT |

**总计：241+ 技能覆盖 16 大领域**

---

## 🎁 场景化技能包

精心打造 **21 个场景化技能包**，覆盖开发、科研、办公等多个领域，让你快速获得所需能力。

### 🔥 推荐套件（最受欢迎）

#### 1. 🎨 前端开发者套件
**适用场景**：前端工程师、UI 开发、组件库开发

**包含技能**：`frontend-design`, `modern-frontend-design`, `canvas-design`, `theme-factory`, `webapp-testing`, `react-components`

**核心能力**：UI 设计、响应式布局、组件开发、主题定制、E2E 测试

#### 2. ⚡ 全栈开发者套件
**适用场景**：全栈工程师、独立开发者、创业团队

**包含技能**：`frontend-design`, `backend-development`, `database-design`, `devops`, `webapp-testing`, `code-review`

**核心能力**：前后端全流程开发、数据库设计、自动化部署、代码质量保障

#### 3. 📄 文档生产套件
**适用场景**：技术写作、文档管理、报告生成

**包含技能**：`doc-coauthoring`, `docx`, `pdf`, `pptx`, `xlsx`, `document-skills`

**核心能力**：多格式文档处理（Word/PDF/PPT/Excel）、协作编辑、文档转换

#### 4. 📓 知识管理套件
**适用场景**：笔记系统、知识库建设、个人知识管理

**包含技能**：`obsidian-markdown`, `obsidian-bases`, `json-canvas`, `document-skills`

**核心能力**：Obsidian 集成、Markdown 编辑、可视化知识图谱、数据库管理

---

### 🧑‍💻 开发工具套件

#### 5. 🚀 DevOps 工程师套件
**适用场景**：运维工程师、CI/CD、容器化部署

**包含技能**：`devops`, `docker`, `mcp-builder`, `skill-creator`

#### 6. 🔧 MCP 开发者套件
**适用场景**：Model Context Protocol 服务器和工具开发

**包含技能**：`mcp-builder`, `skill-creator`, `browser-automation`

#### 7. ✅ 测试与质量保障套件
**适用场景**：QA 工程师、自动化测试、代码审查

**包含技能**：`webapp-testing`, `code-review`, `browser-automation`

#### 8. ⚙️ 后端专家套件
**适用场景**：后端开发、API 设计、微服务架构

**包含技能**：`backend-development`, `database-design`, `devops`

#### 9. 🎭 设计系统套件
**适用场景**：设计系统建设、UI 规范、品牌统一

**包含技能**：`frontend-design`, `modern-frontend-design`, `theme-factory`, `brand-guidelines`, `canvas-design`

---

### 📝 内容创作套件

#### 10. ✍️ 内容创作套件
**适用场景**：内容创作者、营销人员、社交媒体运营

**包含技能**：`content-research-writer`, `brand-guidelines`, `internal-comms`, `slack-gif-creator`, `changelog-generator`

#### 11. 📊 研究分析套件
**适用场景**：市场研究、竞品分析、数据洞察

**包含技能**：`lead-research-assistant`, `developer-growth-analysis`, `competitive-ads-extractor`, `meeting-insights-analyzer`

#### 12. 🎬 媒体处理套件
**适用场景**：图片处理、视频编辑、创意设计

**包含技能**：`image-enhancer`, `video-downloader`, `canvas-design`, `algorithmic-art`, `slack-gif-creator`

#### 13. ⚡ 效率工具套件
**适用场景**：日常办公、文件管理、效率提升

**包含技能**：`file-organizer`, `invoice-organizer`, `meeting-insights-analyzer`, `raffle-winner-picker`, `domain-name-brainstormer`

---

### 🔬 科学研究套件（138+ 专业技能）

#### 14. 💊 药物发现套件 ⭐
**适用场景**：药物设计、分子筛选、ADMET 预测、化合物优化

**包含技能**：`rdkit`, `deepchem`, `datamol`, `molfeat`, `diffdock`, `medchem`, `torchdrug`, `chembl-database`, `pubchem-database`, `drugbank-database`, `zinc-database`

**核心能力**：虚拟筛选、分子对接、理化性质计算、药物数据库检索

#### 15. 🧬 基因组学与生物信息学套件 ⭐
**适用场景**：序列分析、单细胞 RNA-seq、基因调控网络、进化分析

**包含技能**：`biopython`, `scanpy`, `anndata`, `scvi-tools`, `arboreto`, `pysam`, `gget`, `scikit-bio`, `etetoolkit`, `deeptools`, `ensembl-database`, `ncbi-gene-database`

**核心能力**：基因组序列处理、单细胞数据分析、系统发育树构建、基因表达分析

#### 16. 🏥 临床研究套件 ⭐
**适用场景**：临床试验、变异解读、药物基因组学、精准医疗

**包含技能**：`clinical-decision-support`, `clinical-reports`, `treatment-plans`, `pyhealth`, `neurokit2`, `clinvar-database`, `clinpgx-database`, `clinicaltrials-database`, `cosmic-database`, `fda-database`

**核心能力**：临床决策支持、变异致病性评估、电子病历分析、药物相互作用预测

#### 17. 🤖 机器学习与深度学习套件
**适用场景**：PyTorch、scikit-learn、强化学习、模型解释

**包含技能**：`pytorch-lightning`, `transformers`, `scikit-learn`, `scikit-survival`, `shap`, `stable-baselines3`, `pufferlib`, `pymc`, `pymoo`, `torch_geometric`, `umap-learn`, `aeon`

#### 18. 🔮 量子计算与物理套件
**适用场景**：量子计算、天文学、材料科学

**包含技能**：`qiskit`, `pennylane`, `cirq`, `qutip`, `astropy`, `pymatgen`, `sympy`

#### 19. 📊 科学数据可视化套件
**适用场景**：统计分析、网络可视化、出版级图表

**包含技能**：`matplotlib`, `seaborn`, `plotly`, `scientific-visualization`, `networkx`, `statsmodels`, `statistical-analysis`, `exploratory-data-analysis`, `polars`, `dask`, `vaex`

#### 20. 🗄️ 科学数据库套件
**适用场景**：文献检索、蛋白质结构、通路分析

**包含技能**：`pubmed-database`, `uniprot-database`, `pdb-database`, `alphafold-database`, `kegg-database`, `reactome-database`, `string-database`, `opentargets-database`, `openalex-database`, `biorxiv-database`, `geo-database`, `ena-database`

**数据库覆盖**：PubMed、UniProt、PDB、AlphaFold、KEGG、Reactome 等 28+ 科学数据库

#### 21. 🔬 科学写作与交流套件
**适用场景**：论文写作、同行评审、海报制作、文献管理

**包含技能**：`scientific-writing`, `literature-review`, `peer-review`, `citation-management`, `scientific-slides`, `latex-posters`, `pptx-posters`, `scientific-schematics`, `paper-2-web`, `venue-templates`

**核心能力**：学术论文撰写、参考文献管理、学术海报设计、研究演示制作

---

## 如何使用技能

### ⬇️ 方式一：下载并集成（推荐）

1. 访问 [Skills Hub 网站](https://skillscontroller.pages.dev)
2. 浏览并下载感兴趣的技能或场景包
3. **⚠️ 安全审查（必做）**：
   - 解压下载的文件
   - 仔细阅读每个技能目录下的 `SKILL.md` 文件
   - 检查技能描述、触发器和操作指南
   - 查看随包附带的 `SECURITY_REPORT.md` 了解自动扫描结果
   - **仅导入您已审查并信任的技能**
4. **手动集成**：将通过审核的技能文件放入以下目录之一：
   - 当前项目：`your-project/.claude/skills/`
   - 全局配置：`~/.claude/skills/` (macOS/Linux)
5. 重新启动 Claude Code 即可自动加载

> **⚠️ 警告**：永远不要导入未经过安全审查的技能！

### 🛠️ 方式二：手动克隆安装

```bash
# 克隆本仓库
git clone https://github.com/marovole/skillscontroller.git

# 复制需要的技能到你的项目
cp -r skillscontroller/anthropic-skills/skills/frontend-design ~/.claude/skills/
```

### 方式三：使用 git submodule

```bash
# 在你的项目中添加技能库
git submodule add https://github.com/anthropics/anthropic-skills.git .claude/anthropic-skills
```

---

## 技能目录结构

```
your-project/
└── .claude/
    ├── commands/           # 斜杠命令
    └── skills/             # 技能文件
        ├── frontend-design/
        │   └── SKILL.md
        ├── backend-development/
        │   └── SKILL.md
        └── ...
```

---

## 项目结构

```
skillscontroller/
├── packages/
│   └── website/                 # Astro 静态网站
│       ├── src/
│       │   ├── components/      # UI 组件
│       │   ├── data/            # 技能数据和场景包定义
│       │   ├── pages/           # 页面路由
│       │   └── styles/          # 样式文件
│       └── public/              # 静态资源
├── anthropic-skills/            # Anthropic 官方技能 (submodule)
├── awesome-claude-skills/       # 社区精选技能 (submodule)
├── claudekit-skills/            # ClaudeKit 技能 (submodule)
├── composio-skills/             # Composio 技能 (submodule)
├── scientific-skills/           # Scientific Skills 科学技能库 (submodule)
├── obsidian-skills/             # Obsidian 知识管理技能 (submodule)
└── voltagent-skills/            # VoltAgent 技能 (submodule)
```

---

## 本地开发

```bash
# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev

# 构建生产版本
pnpm build

# 预览构建结果
pnpm preview
```

---

## 🗂️ 技能分类体系

### 主分类（16 大领域）

| 分类 | 说明 | 技能数 | 适用人群 |
|------|------|--------|---------|
| 🎨 **前端开发** | UI 设计、组件、响应式布局 | 15+ | 前端工程师、设计师 |
| ⚙️ **后端开发** | API、数据库、认证 | 10+ | 后端工程师、架构师 |
| ✅ **测试质量** | E2E 测试、代码审查 | 5+ | QA 工程师、测试开发 |
| 🚀 **DevOps** | CI/CD、Docker、部署 | 8+ | 运维工程师、SRE |
| 📄 **文档处理** | PDF、Word、PPT、Excel | 6+ | 技术写作、文档管理 |
| 📓 **知识管理** | Obsidian、笔记系统、知识库 | 5+ | 知识工作者、研究员 |
| 🎬 **媒体处理** | 图片、视频、GIF | 5+ | 设计师、内容创作者 |
| 🧠 **思维方法** | 问题分析、决策辅助 | 3+ | 产品经理、分析师 |
| 🛠️ **开发工具** | MCP、浏览器自动化 | 6+ | 工具开发者 |
| 📊 **数据分析** | 统计分析、可视化 | 15+ | 数据分析师、科学家 |

### 科学研究子分类（138+ 专业技能）

| 子分类 | 说明 | 技能数 | 适用场景 |
|--------|------|--------|---------|
| 🧬 **生物信息学** | 基因组学、序列分析、单细胞分析 | 25+ | 基因组研究、转录组分析 |
| 🧪 **化学信息学** | 药物发现、分子设计、虚拟筛选 | 20+ | 药物研发、化合物设计 |
| 🏥 **临床医学** | 临床研究、精准医疗、变异解读 | 18+ | 临床研究、精准医学 |
| 🤖 **机器学习与 AI** | 深度学习、强化学习、模型解释 | 15+ | AI 研究、模型开发 |
| 🔮 **物理与材料** | 量子计算、天文学、材料科学 | 10+ | 物理研究、材料工程 |
| 📊 **数据可视化** | 统计分析、网络分析、科学绘图 | 15+ | 数据展示、论文插图 |
| 🗄️ **科学数据库** | PubMed、UniProt、ChEMBL 等 | 28+ | 文献检索、数据挖掘 |
| 📝 **科学写作** | 论文写作、同行评审、海报制作 | 12+ | 学术写作、会议展示 |
| 🔧 **实验室自动化** | 液体处理、实验流程自动化 | 10+ | 高通量实验、实验室管理 |

**总计：241+ 技能覆盖 16 大领域 + 9 个科学研究子领域**

---

## 贡献指南

欢迎贡献新技能或改进现有技能！

### 贡献方式

1. **发现优质技能** - 如果发现 GitHub 上有优质的 Claude Code 技能库，欢迎提 Issue 告知我们
2. **改进网站** - 欢迎提交 PR 改进网站功能和用户体验
3. **报告问题** - 如发现技能问题或网站 Bug，请提交 Issue

### 技能格式规范

每个技能应包含一个 `SKILL.md` 文件：

```markdown
---
name: skill-name
description: 技能简短描述
author: 作者名
license: MIT
---

# 技能名称

## 使用场景
描述何时使用此技能

## 操作指南
1. 步骤一
2. 步骤二

## 示例
提供使用示例
```

---

## 致谢

本项目的所有技能内容均来自以下优秀的开源项目：

| 项目 | 作者 | 链接 |
|------|------|------|
| **superpowers** | [obra](https://github.com/obra) | [github.com/obra/superpowers](https://github.com/obra/superpowers) |
| **superpowers-marketplace** | [obra](https://github.com/obra) | [github.com/obra/superpowers-marketplace](https://github.com/obra/superpowers-marketplace) |
| **superpowers-lab** | [obra](https://github.com/obra) | [github.com/obra/superpowers-lab](https://github.com/obra/superpowers-lab) |
| **anthropic-skills** | [Anthropic](https://github.com/anthropics) | [github.com/anthropics/anthropic-skills](https://github.com/anthropics/anthropic-skills) |
| **awesome-claude-skills** | [ComposioHQ](https://github.com/ComposioHQ) | [github.com/ComposioHQ/awesome-claude-skills](https://github.com/ComposioHQ/awesome-claude-skills) |
| **claudekit-skills** | [mrgoonie](https://github.com/mrgoonie) | [github.com/mrgoonie/claudekit-skills](https://github.com/mrgoonie/claudekit-skills) |
| **claude-scientific-skills** | [K-Dense AI](https://github.com/K-Dense-AI) | [github.com/K-Dense-AI/claude-scientific-skills](https://github.com/K-Dense-AI/claude-scientific-skills) |
| **Claude-Code-Deep-Research-main** | [liangdabiao](https://github.com/liangdabiao) | [github.com/liangdabiao/Claude-Code-Deep-Research-main](https://github.com/liangdabiao/Claude-Code-Deep-Research-main) |
| **obsidian-skills** | [kepano](https://github.com/kepano) | [github.com/kepano/obsidian-skills](https://github.com/kepano/obsidian-skills) |

**特别说明**：本项目仅为技能聚合展示平台，所有技能的版权归各自原作者所有。

---

## 相关资源

- [Claude Code 官方文档](https://docs.anthropic.com/claude/docs/claude-code)
- [skillsmp.com](https://skillsmp.com) - Anthropic 官方推荐平台
- [claudemarketplaces.com](https://claudemarketplaces.com) - 技能展示目录

---

## 许可证

MIT License - 详见 [LICENSE](./LICENSE)

---

## 作者

**marovole** - [GitHub](https://github.com/marovole)

---

## 链接

- [GitHub 仓库](https://github.com/marovole/skillscontroller)
- [问题反馈](https://github.com/marovole/skillscontroller/issues)
- [在线网站](https://skillscontroller.pages.dev)

---

## 🌟 为什么选择 Skills Hub？

### 对于开发者
- 🛡️ **安全可控** - 强调下载后审查，确保每一行导入的代码都安全可靠
- 🎯 **场景化打包** - 按工作场景获取所需技能组合，支持灵活的手动集成
- 🔄 **持续更新** - 紧跟社区动态，及时收录最新优质技能

### 对于科研工作者
- 🔬 **专业深度** - 138+ 科学技能覆盖生物、化学、医学、物理等多个学科
- 📚 **数据库丰富** - 集成 28+ 科学数据库，快速检索文献、蛋白质、化合物
- 📝 **学术写作** - 从论文撰写到海报制作，全流程支持

### 对于团队
- 📦 **统一标准** - 团队共享技能包，保持 AI 助手能力一致性
- 🚀 **快速上手** - 新成员无需学习，下载即用
- 💡 **最佳实践** - 汇集社区智慧，避免重复造轮子

---

## 📊 项目数据

- 🎯 **10+ 个**精选开源项目
- 📦 **241+ 个**高质量技能
- 🎁 **21 个**场景化技能包
- 🔬 **138+ 个**科学研究专业技能
- 🗄️ **28+ 个**科学数据库集成
- 🌍 **16 大**技能领域分类

---

## 🔗 快速链接

- 🌐 **在线网站**：[skillscontroller.pages.dev](https://skillscontroller.pages.dev)
- 📦 **GitHub 仓库**：[github.com/marovole/skillscontroller](https://github.com/marovole/skillscontroller)
- 💬 **问题反馈**：[GitHub Issues](https://github.com/marovole/skillscontroller/issues)
- 📖 **Claude Code 文档**：[docs.anthropic.com/claude/docs/claude-code](https://docs.anthropic.com/claude/docs/claude-code)

---

**🚀 让每一次 Claude Code 对话都拥有专家级能力！**
