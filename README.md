# FastSkills

<p align="center">
  <strong>AI 编码助手技能聚合与智能路由平台</strong><br>
  <strong>AI Coding Assistant Skills Aggregation & Intelligent Routing Platform</strong>
</p>

<p align="center">
  <em>支持 Claude Code • OpenCode • Codex • Cursor • Windsurf</em>
</p>

<p align="center">
  <a href="https://opensource.org/licenses/MIT"><img src="https://img.shields.io/badge/License-MIT-blue.svg" alt="License: MIT"></a>
  <a href="#-skills-count--技能统计"><img src="https://img.shields.io/badge/Skills-257+-green" alt="Skills"></a>
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

## 🚀 一键安装，智能路由 / One-Click Install, Smart Routing

**核心优势：一个技能触发 256+ 专业技能！自动检测意图，智能加载相关技能。**

**Core Advantage: One skill triggers 256+ expert skills! Auto-detect intent, smart-load relevant skills.**

### 安装方式 / Installation

**使用 Claude Code 官方插件系统（推荐）：**

**Using Claude Code Official Plugin System (Recommended):**

```bash
# 第 1 步：注册 FastSkills 市场 / Step 1: Register FastSkills marketplace
/plugin marketplace add PureVibeCoder/fastskills

# 第 2 步：安装插件 / Step 2: Install plugin
/plugin install fastskills@fastskills
```

**完成！** 🎉 每次启动 Claude Code 会话，路由器会自动激活。无需编辑任何配置文件。

**Done!** 🎉 The router activates automatically on every Claude Code session. No config files to edit.

### 验证安装 / Verify Installation

```bash
/fastskills:status
```

### 更新 / Update

```bash
/plugin update fastskills
```

### 卸载 / Uninstall

```bash
/plugin uninstall fastskills
```

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

**FastSkills** aggregates 227+ high-quality Claude Code skills from 10+ open-source projects on GitHub, organized into 25 scenario-based skill packs for developers and researchers.

**FastSkills** 汇集来自 GitHub 10+ 个开源项目的 227+ 高质量 Claude Code 技能，并按场景打包成 25 个技能包，服务于开发者和科研工作者。

---

## Key Features / 核心功能

| Feature | Description |
|---------|-------------|
| **🎯 Smart Routing** 智能路由 | Auto-detect intent and load relevant skills |
| **📦 One-Click Install** 一键安装 | `/plugin install fastskills@fastskills` |
| **🔍 Intent Detection** 意图检测 | Understands: create, research, debug, refactor, test, deploy |
| **🌐 Bilingual** 双语支持 | Chinese-English keyword expansion |
| **📚 Skill Aggregation** 技能聚合 | 227+ skills from 10+ curated open-source projects |
| **🎁 Scenario Packs** 场景打包 | 25 ready-to-use skill packs for different workflows |
| **🏷️ Category Filtering** 分类筛选 | 20 categories including 9 scientific sub-domains |

---

## Skills Count / 技能统计

| Metric | Count |
|--------|-------|
| Total Skills / 技能总数 | **257+** |
| Skill Packs / 场景包 | **25** |
| Categories / 分类 | **20** |
| Scientific Skills / 科学技能 | **138+** |
| Scientific Databases / 科学数据库 | **28+** |
| Source Projects / 来源项目 | **11+** |

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
| [Makepad Skills](https://github.com/ZhangHanDong/makepad-skills) | - | 11 | Rust UI | MIT |
| [UI Skills](https://github.com/ibelick/ui-skills) | 200+ | 1 | UI/UX Constraints | MIT |
| [Planning with Files](https://github.com/marovole/planning-with-files) | - | 1 | Planning | MIT |

---

## Skill Packs / 场景化技能包

### Popular Packs / 热门推荐

| Pack | Icon | Skills | Use Case |
|------|------|--------|----------|
| **Frontend Developer** 前端开发 | 🎨 | 7 | UI/UX, components, testing |
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

在 Claude Code 中运行以下命令：

Run these commands in Claude Code:

```bash
# 注册市场 / Register marketplace
/plugin marketplace add PureVibeCoder/fastskills

# 安装插件 / Install plugin
/plugin install fastskills@fastskills

# 验证安装 / Verify installation
/fastskills:status
```

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

## 🌐 多平台支持 / Multi-Platform Support

FastSkills 不仅支持 Claude Code，还支持其他主流 AI 编码助手！

FastSkills supports not only Claude Code, but also other major AI coding assistants!

### 支持的平台 / Supported Platforms

| 平台 Platform | 兼容性 Compatibility | 安装难度 Difficulty |
|---------------|---------------------|---------------------|
| **Claude Code** | ✅ 原生支持 Native | ⭐ 一键安装 |
| **OpenCode** | ✅ 原生兼容 Native | ⭐ 零配置 |
| **Codex (OpenAI)** | ✅ 原生支持 Native | ⭐⭐ 复制文件 |
| **Cursor** | ⚠️ 需转换 Convert | ⭐⭐⭐ |
| **Windsurf** | ⚠️ 需转换 Convert | ⭐⭐⭐ |

---

### OpenCode 用户 / For OpenCode Users

OpenCode 原生支持读取 `CLAUDE.md` 文件，**零配置即可使用 FastSkills**！

OpenCode natively supports reading `CLAUDE.md` files. **Zero configuration required!**

**方法 1：使用现有 CLAUDE.md（推荐）**

```bash
# OpenCode 会自动检测并加载项目中的 CLAUDE.md
# 只需将 FastSkills Router 内容添加到你的 CLAUDE.md
curl -o CLAUDE.md https://raw.githubusercontent.com/PureVibeCoder/fastskills/main/skills/fastskills-router/SKILL.md
```

**方法 2：配置 fallback（如果你已有 AGENTS.md）**

```toml
# ~/.opencode/config.toml
project_doc_fallback_filenames = ["CLAUDE.md", "AGENTS.md"]
```

---

### Codex (OpenAI) 用户 / For Codex Users

Codex 使用 `AGENTS.md` 作为项目指令文件。我们提供了专门的 AGENTS.md 版本！

Codex uses `AGENTS.md` as project instruction files. We provide a dedicated AGENTS.md version!

**方法 1：直接下载 AGENTS.md（推荐）**

```bash
# 下载 FastSkills Router 的 AGENTS.md 版本
curl -o AGENTS.md https://raw.githubusercontent.com/PureVibeCoder/fastskills/main/skills/fastskills-router/AGENTS.md

# 或者放到全局配置
mkdir -p ~/.codex && curl -o ~/.codex/AGENTS.md https://raw.githubusercontent.com/PureVibeCoder/fastskills/main/skills/fastskills-router/AGENTS.md
```

**方法 2：配置 fallback 使用 CLAUDE.md**

```toml
# ~/.codex/config.toml
project_doc_fallback_filenames = ["CLAUDE.md"]
```

**Codex AGENTS.md 层级结构：**

| 位置 Location | 作用域 Scope |
|---------------|-------------|
| `~/.codex/AGENTS.md` | 全局配置（所有项目） |
| `./AGENTS.md` | 项目根目录 |
| `./subdir/AGENTS.md` | 子目录覆盖 |

---

### Cursor / Windsurf 用户 / For Cursor / Windsurf Users

这些平台使用 `.cursorrules` 或 `.windsurfrules` 文件。

These platforms use `.cursorrules` or `.windsurfrules` files.

```bash
# Cursor
curl -o .cursorrules https://raw.githubusercontent.com/PureVibeCoder/fastskills/main/skills/fastskills-router/SKILL.md

# Windsurf
curl -o .windsurfrules https://raw.githubusercontent.com/PureVibeCoder/fastskills/main/skills/fastskills-router/SKILL.md
```

> **注意**：部分高级功能（如意图分析 XML 输出）可能需要根据平台特性调整。
> 
> **Note**: Some advanced features (like intent analysis XML output) may need adjustments based on platform specifics.

---

## 从旧版迁移 / Migration from Old Version

如果你之前使用 `@https://...` 方式安装：

If you previously used the `@https://...` installation method:

1. 从 `~/.claude/CLAUDE.md` 或项目 `CLAUDE.md` 中删除以下行：
   Remove this line from your `~/.claude/CLAUDE.md` or project `CLAUDE.md`:
   ```
   @https://raw.githubusercontent.com/PureVibeCoder/fastskills/main/purevibecoder-skills/fastskills-router/SKILL.md
   ```

2. 使用新的插件安装方式 / Use the new plugin installation:
   ```bash
   /plugin marketplace add PureVibeCoder/fastskills
   /plugin install fastskills@fastskills
   ```

新版本使用 SessionStart Hook 自动注入，无需手动引用。

The new version uses SessionStart Hook for automatic injection. No manual reference needed.

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
├── .claude-plugin/          # Plugin manifests
│   ├── marketplace.json     # Marketplace definition
│   └── plugin.json          # Plugin metadata
├── hooks/                   # SessionStart hooks
│   ├── hooks.json           # Hook configuration
│   └── session-start.sh     # Auto-inject router
├── commands/                # Custom slash commands
│   └── status.md            # /fastskills:status
├── skills/                  # Core skills
│   └── fastskills-router/   # Main router (SKILL.md)
├── packages/website/        # Astro website
│   ├── src/
│   │   ├── components/      # UI components
│   │   ├── data/            # Skills & packages data
│   │   ├── pages/           # Routes & API
│   │   └── utils/           # Utilities
│   └── public/              # Static assets
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
| [makepad-skills](https://github.com/ZhangHanDong/makepad-skills) | [@ZhangHanDong](https://github.com/ZhangHanDong) |

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
