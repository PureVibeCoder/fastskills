# Claude Code FastSkills

<p align="center">
  <strong>Claude Code 技能聚合与智能路由平台</strong><br>
  <strong>Claude Code Skills Aggregation & Intelligent Routing Platform</strong>
</p>

<p align="center">
  <a href="https://opensource.org/licenses/MIT"><img src="https://img.shields.io/badge/License-MIT-blue.svg" alt="License: MIT"></a>
  <a href="#-skills-count--技能统计"><img src="https://img.shields.io/badge/Skills-225+-green" alt="Skills"></a>
  <a href="#-skill-packs--场景化技能包"><img src="https://img.shields.io/badge/Packs-25-blue" alt="Packages"></a>
  <a href="https://astro.build/"><img src="https://img.shields.io/badge/Built_with-Astro-orange" alt="Astro"></a>
  <a href="https://fastskills.xyz"><img src="https://img.shields.io/badge/Website-Live-success" alt="Website"></a>
</p>

<p align="center">
  <a href="https://fastskills.xyz">在线访问 / Live Website</a> •
  <a href="#-quick-start--快速开始">快速开始 / Quick Start</a> •
  <a href="#-contributing--贡献指南">贡献 / Contribute</a>
</p>

---

## 🚀 一行安装，智能路由 / One-Line Install, Smart Routing

**核心优势：一个技能触发 225+ 专业技能！自动检测意图，智能加载相关技能。**

**Core Advantage: One skill triggers 225+ expert skills! Auto-detect intent, smart-load relevant skills.**

### 安装方式 / Installation

**只需一行命令，在你的 `CLAUDE.md` 中添加引用：**

**Just one line - add reference to your `CLAUDE.md`:**

```markdown
@https://raw.githubusercontent.com/PureVibeCoder/fastskills/main/purevibecoder-skills/fastskills-router/SKILL.md
```

**或本地克隆后使用相对路径：**

**Or use relative path after cloning locally:**

```bash
# 克隆仓库 / Clone repository
git clone --recursive https://github.com/PureVibeCoder/fastskills.git

# 在你的 CLAUDE.md 中添加 / Add to your CLAUDE.md
@/path/to/fastskills/purevibecoder-skills/fastskills-router/SKILL.md
```

**配置位置 / Configuration Paths:**
- 全局: `~/.claude/CLAUDE.md`
- 项目级: `your-project/CLAUDE.md`

**完成！** Claude 现在会自动检测你的意图并加载相关技能。

**Done!** Claude now auto-detects your intent and loads relevant skills.

---

## 工作原理 / How It Works

```
用户: "帮我写一个 React 登录组件"

Claude 自动分析:
├── 意图检测: 创建 (写一个)
├── 关键词匹配: React, 组件
└── 技能加载: react-components, frontend-design

📦 已加载技能: react-components, frontend-design

[应用专业技能增强的高质量回复...]
```

### 智能路由特性 / Smart Routing Features

| 特性 | 说明 |
|------|------|
| **🎯 意图检测** | 自动识别：创建、研究、调试、重构、测试、部署等 |
| **🌐 双语支持** | 中英文关键词自动扩展匹配 |
| **📦 按需加载** | 只加载当前任务相关的技能 |
| **🔄 会话持续** | 已加载技能在整个会话期间生效 |

---

## Overview / 项目概述

**FastSkills** aggregates 225+ high-quality Claude Code skills from 10+ open-source projects on GitHub, organized into 25 scenario-based skill packs for developers and researchers.

**FastSkills** 汇集来自 GitHub 10+ 个开源项目的 225+ 高质量 Claude Code 技能，并按场景打包成 25 个技能包，服务于开发者和科研工作者。

---

## Key Features / 核心功能

| Feature | Description |
|---------|-------------|
| **🎯 Smart Routing** 智能路由 | Auto-detect intent and load relevant skills |
| **📦 One-Line Install** 一行安装 | Just add one @ reference to CLAUDE.md |
| **🔍 Intent Detection** 意图检测 | Understands: create, research, debug, refactor, test, deploy |
| **🌐 Bilingual** 双语支持 | Chinese-English keyword expansion |
| **📚 Skill Aggregation** 技能聚合 | 225+ skills from 10+ curated open-source projects |
| **🎁 Scenario Packs** 场景打包 | 25 ready-to-use skill packs for different workflows |
| **🏷️ Category Filtering** 分类筛选 | 20 categories including 9 scientific sub-domains |

---

## Skills Count / 技能统计

| Metric | Count |
|--------|-------|
| Total Skills / 技能总数 | **225+** |
| Skill Packs / 场景包 | **25** |
| Categories / 分类 | **20** |
| Scientific Skills / 科学技能 | **138+** |
| Scientific Databases / 科学数据库 | **28+** |
| Source Projects / 来源项目 | **10+** |

---

## Skill Sources / 技能来源

All skills are aggregated from reputable open-source projects. Review before importing.

所有技能均来自优质开源项目，导入前请进行安全审查。

| Project | Stars | Skills | Domain | License |
|---------|-------|--------|--------|---------|
| [Superpowers](https://github.com/obra/superpowers) | 13k+ | 14 | General Dev | MIT |
| [Anthropic Skills](https://github.com/anthropics/skills) | Official | 16+ | Official | MIT |
| [Awesome Claude Skills](https://github.com/ComposioHQ/awesome-claude-skills) | 3.9k+ | 25+ | Community | MIT |
| [ClaudeKit](https://github.com/mrgoonie/claudekit-skills) | 1.1k+ | 39 | Full-Stack | MIT |
| [Scientific Skills](https://github.com/K-Dense-AI/claude-scientific-skills) | 2.9k+ | 138 | Scientific | MIT |
| [Deep Research](https://github.com/liangdabiao/Claude-Code-Deep-Research-main) | 55+ | 5 | Research | - |
| [Obsidian Skills](https://github.com/kepano/obsidian-skills) | 160+ | 3 | Knowledge | MIT |
| [VoltAgent](https://github.com/VoltAgent/voltagent) | - | 10+ | AI Agent | - |
| [Planning with Files](https://github.com/marovole/planning-with-files) | - | 1 | Planning | MIT |

---

## Skill Packs / 场景化技能包

### Popular Packs / 热门推荐

| Pack | Icon | Skills | Use Case |
|------|------|--------|----------|
| **Frontend Developer** 前端开发 | 🎨 | 6 | UI/UX, components, testing |
| **Fullstack Developer** 全栈开发 | ⚡ | 6 | End-to-end development |
| **Document Production** 文档生产 | 📄 | 6 | Word, PDF, PPT, Excel |
| **Knowledge Management** 知识管理 | 📓 | 4 | Obsidian, note systems |

### Scientific Research / 科学研究

| Pack | Icon | Skills | Use Case |
|------|------|--------|----------|
| **Drug Discovery** 药物发现 | 💊 | 11 | Virtual screening, docking |
| **Genomics & Bioinformatics** 基因组学 | 🧬 | 12 | RNA-seq, sequence analysis |
| **Clinical Research** 临床研究 | 🏥 | 10 | Clinical trials, precision medicine |
| **ML & Deep Learning** 机器学习 | 🤖 | 12 | PyTorch, scikit-learn |
| **Quantum & Physics** 量子物理 | 🔮 | 7 | Quantum computing, astronomy |
| **Scientific Databases** 科学数据库 | 🗄️ | 12 | PubMed, UniProt, KEGG |
| **Scientific Writing** 科学写作 | 📝 | 10 | Paper writing, peer review |

### Development Tools / 开发工具

| Pack | Icon | Skills | Use Case |
|------|------|--------|----------|
| **DevOps Engineer** DevOps | 🚀 | 4 | CI/CD, Docker |
| **Testing & QA** 测试质量 | ✅ | 3 | Automated testing |
| **Task Planning** 任务规划 | 🧠 | 2 | Manus-style planning |

---

## Quick Start / 快速开始

### 第 1 步：添加技能路由 / Step 1: Add Skill Router

**全局安装（推荐）/ Global Installation (Recommended):**

```bash
# 编辑全局 CLAUDE.md / Edit global CLAUDE.md
echo "@https://raw.githubusercontent.com/PureVibeCoder/fastskills/main/purevibecoder-skills/fastskills-router/SKILL.md" >> ~/.claude/CLAUDE.md
```

**项目级安装 / Project-level Installation:**

```bash
# 在项目根目录创建或编辑 CLAUDE.md
echo "@https://raw.githubusercontent.com/PureVibeCoder/fastskills/main/purevibecoder-skills/fastskills-router/SKILL.md" >> ./CLAUDE.md
```

### 第 2 步：开始使用 / Step 2: Start Using

重启 Claude Code，开始对话！技能会根据你的意图自动加载。

Restart Claude Code and start chatting! Skills will auto-load based on your intent.

**示例 / Examples:**

```
你: "帮我分析这个单细胞 RNA-seq 数据"
Claude: 📦 已加载技能: scanpy, biopython
       [专业的单细胞分析代码和解释...]

你: "写一个 React 表单组件"
Claude: 📦 已加载技能: react-components, frontend-design
       [高质量的 React 代码...]

你: "调试这个 Python 错误"
Claude: 📦 已加载技能: systematic-debugging, root-cause-tracing
       [系统化的调试步骤...]
```

---

## 离线使用 / Offline Usage

如需离线使用，可克隆仓库并使用本地路径：

For offline usage, clone the repo and use local path:

```bash
# 克隆仓库（包含所有子模块）
git clone --recursive https://github.com/PureVibeCoder/fastskills.git

# 在 CLAUDE.md 中使用本地路径
@/absolute/path/to/fastskills/purevibecoder-skills/fastskills-router/SKILL.md
```

---

## Security / 安全须知

> **Warning**: Always review skills before importing. Skills may contain shell commands, file operations, or network requests.

> **警告**：导入前务必审查技能文件。技能可能包含 shell 命令、文件操作或网络请求。

### Security Checklist / 安全检查清单

- [ ] Verify source project reputation / 验证来源项目信誉
- [ ] Read SKILL.md thoroughly / 仔细阅读 SKILL.md
- [ ] Review shell commands / 审查 shell 命令
- [ ] Only import trusted skills / 仅导入信任的技能

### Red Flags / 危险信号

- `eval()` or dynamic code execution
- Access to `~/.ssh`, `/etc`, or sensitive paths
- Hardcoded API keys or credentials
- Unknown network requests

---

## Local Development / 本地开发

```bash
# Install dependencies
pnpm install

# Start dev server (http://localhost:4321)
pnpm dev

# Build for production
pnpm build

# Run tests
pnpm test
```

---

## Project Structure / 项目结构

```
fastskills/
├── packages/website/        # Astro website
│   ├── src/
│   │   ├── components/      # UI components
│   │   ├── data/            # Skills & packages data
│   │   ├── pages/           # Routes & API
│   │   └── utils/           # Utilities
│   └── public/              # Static assets
├── purevibecoder-skills/    # FastSkills Router
│   └── fastskills-router/   # Main skill router (SKILL.md)
├── anthropic-skills/        # Git submodule
├── claudekit-skills/        # Git submodule
├── scientific-skills/       # Git submodule (138+ skills)
├── awesome-claude-skills/   # Git submodule
├── obsidian-skills/         # Git submodule
├── superpowers/             # Git submodule
└── ...                      # Other submodules
```

---

## Categories / 分类体系

### Main Categories / 主分类 (11)

| Category | Icon | Description |
|----------|------|-------------|
| Frontend 前端开发 | 🎨 | UI, components, styling |
| Backend 后端开发 | ⚙️ | API, database, auth |
| Testing 测试质量 | ✅ | E2E, code review |
| DevOps | 🚀 | CI/CD, Docker |
| Scientific 科学研究 | 🔬 | Research, analysis |
| Document 文档处理 | 📄 | PDF, Word, PPT |
| Knowledge 知识管理 | 📓 | Obsidian, notes |
| Media 媒体处理 | 🎬 | Image, video |
| Thinking 思维方法 | 🧠 | Problem solving |
| Tools 开发工具 | 🛠️ | Automation |
| Skill Dev 技能开发 | 🧙 | Skill creation |

### Scientific Sub-Categories / 科学子分类 (9)

| Sub-Category | Icon | Skills |
|--------------|------|--------|
| Bioinformatics 生物信息学 | 🧬 | 25+ |
| Cheminformatics 化学信息学 | 🧪 | 20+ |
| Clinical 临床医学 | 🏥 | 18+ |
| ML & AI 机器学习 | 🤖 | 15+ |
| Physics 物理材料 | 🔮 | 10+ |
| Data Viz 数据可视化 | 📊 | 15+ |
| Databases 科学数据库 | 🗄️ | 28+ |
| Sci Writing 科学写作 | 📝 | 12+ |
| Lab Automation 实验室自动化 | 🔧 | 10+ |

---

## Contributing / 贡献指南

Contributions welcome! You can:

欢迎贡献！您可以：

1. **Report Issues** / 报告问题 - Found a bug? [Open an issue](https://github.com/PureVibeCoder/fastskills/issues)
2. **Suggest Skills** / 推荐技能 - Know a good skill repo? Tell us!
3. **Improve Website** / 改进网站 - Submit PRs for features or fixes
4. **Translate** / 翻译 - Help with i18n

---

## Credits / 致谢

All skills are from these amazing open-source projects:

所有技能均来自以下优秀开源项目：

| Project | Author |
|---------|--------|
| [superpowers](https://github.com/obra/superpowers) | [@obra](https://github.com/obra) |
| [anthropic-skills](https://github.com/anthropics/skills) | [Anthropic](https://github.com/anthropics) |
| [awesome-claude-skills](https://github.com/ComposioHQ/awesome-claude-skills) | [ComposioHQ](https://github.com/ComposioHQ) |
| [claudekit-skills](https://github.com/mrgoonie/claudekit-skills) | [@mrgoonie](https://github.com/mrgoonie) |
| [claude-scientific-skills](https://github.com/K-Dense-AI/claude-scientific-skills) | [K-Dense AI](https://github.com/K-Dense-AI) |
| [obsidian-skills](https://github.com/kepano/obsidian-skills) | [@kepano](https://github.com/kepano) |

**Note**: This project only aggregates and displays skills. All copyrights belong to original authors.

**声明**：本项目仅聚合展示技能，所有版权归原作者所有。

---

## Links / 链接

- **Website / 网站**: [fastskills.xyz](https://fastskills.xyz)
- **GitHub**: [github.com/PureVibeCoder/fastskills](https://github.com/PureVibeCoder/fastskills)
- **Issues / 问题反馈**: [GitHub Issues](https://github.com/PureVibeCoder/fastskills/issues)
- **Claude Code Docs**: [docs.anthropic.com/claude/docs/claude-code](https://docs.anthropic.com/claude/docs/claude-code)

---

## License / 许可证

MIT License - see [LICENSE](./LICENSE)

---

<p align="center">
  <strong>Empower every Claude Code conversation with expert-level skills!</strong><br>
  <strong>让每一次 Claude Code 对话都拥有专家级能力！</strong>
</p>
