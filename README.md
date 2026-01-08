# Claude Code FastSkills

<p align="center">
  <strong>Claude Code 技能聚合与场景化打包平台</strong><br>
  <strong>Claude Code Skills Aggregation & Scenario-Based Packaging Platform</strong>
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

## 🚀 Install Skills Instantly / 一键安装技能

### Plugin Installation (Recommended) / 插件安装（推荐）

Use the `/plugin` command in Claude Code to install skills directly:

在 Claude Code 中使用 `/plugin` 命令直接安装技能：

```bash
# Install a single skill pack / 安装单个技能包
/plugin claudekit-skills

# Install specific skills / 安装特定技能
/plugin scientific-skills
/plugin superpowers
```

Available plugins: `claudekit-skills`, `scientific-skills`, `superpowers`, `anthropic-skills`, `obsidian-skills`

### MCP Integration / MCP 集成

For advanced users, integrate with Model Context Protocol:

高级用户可以集成 MCP 协议：

```json
// Add to your Claude config / 添加到 Claude 配置
{
  "mcpServers": {
    "mcp-manager": {
      "command": "npx",
      "args": ["-y", "@anthropic/mcp-manager"]
    }
  }
}
```

Then use MCP tools in your conversations for dynamic skill loading and sub-agent orchestration.

然后在对话中使用 MCP 工具进行动态技能加载和子代理编排。

> 📖 **More details**: Visit [fastskills.xyz](https://fastskills.xyz) for interactive installation guides.
> 
> 📖 **更多详情**：访问 [fastskills.xyz](https://fastskills.xyz) 获取交互式安装指南。

---

## Overview / 项目概述

**FastSkills** aggregates 225+ high-quality Claude Code skills from 10+ open-source projects on GitHub, organized into 25 scenario-based skill packs for developers and researchers.

**FastSkills** 汇集来自 GitHub 10+ 个开源项目的 225+ 高质量 Claude Code 技能，并按场景打包成 25 个技能包，服务于开发者和科研工作者。

---

## Key Features / 核心功能

| Feature | Description |
|---------|-------------|
| **Skill Aggregation** 技能聚合 | 225+ skills from 10+ curated open-source projects |
| **Scenario Packs** 场景打包 | 25 ready-to-use skill packs for different workflows |
| **Category Filtering** 分类筛选 | 20 categories including 9 scientific sub-domains |
| **One-Click Download** 一键下载 | Download individual skills or entire packs as ZIP |
| **Security Scanning** 安全扫描 | Auto-generated security reports for each download |
| **Static & Fast** 静态高速 | Built with Astro, deployed on Cloudflare Pages |

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
| **MCP Developer** MCP开发 | 🔧 | 3 | Model Context Protocol |
| **Task Planning** 任务规划 | 🧠 | 2 | Manus-style planning |

---

## Quick Start / 快速开始

### Method 1: Download from Website (Recommended) / 网站下载（推荐）

1. Visit [fastskills.xyz](https://fastskills.xyz)
2. Browse and download skills or packs
3. **Review the SKILL.md files** before importing
4. Copy to `~/.claude/skills/` or `your-project/.claude/skills/`
5. Restart Claude Code

### Method 2: Clone Repository / 克隆仓库

```bash
# Clone with submodules
git clone --recursive https://github.com/PureVibeCoder/fastskills.git

# Copy skills to your project
cp -r fastskills/anthropic-skills/skills/frontend-design ~/.claude/skills/
```

### Method 3: Git Submodule / 使用子模块

```bash
# Add Anthropic official skills
git submodule add https://github.com/anthropics/skills.git .claude/skills/anthropic

# Or add scientific skills
git submodule add https://github.com/K-Dense-AI/claude-scientific-skills.git .claude/skills/scientific
```

---

## Security / 安全须知

> **Warning**: Always review skills before importing. Skills may contain shell commands, file operations, or network requests.

> **警告**：导入前务必审查技能文件。技能可能包含 shell 命令、文件操作或网络请求。

### Security Checklist / 安全检查清单

- [ ] Verify source project reputation / 验证来源项目信誉
- [ ] Read SKILL.md thoroughly / 仔细阅读 SKILL.md
- [ ] Check SECURITY_REPORT.md / 查看安全扫描报告
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
| Tools 开发工具 | 🛠️ | MCP, automation |
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
