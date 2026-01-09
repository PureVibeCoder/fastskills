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

## 🚀 按需动态加载技能 / Dynamic Skill Loading

**核心优势：不需要预装 200+ 技能！通过 MCP 服务器按需加载，保持上下文窗口精简。**

**Core Advantage: No need to pre-install 200+ skills! Load on-demand via MCP server, keeping context window lean.**

### 推荐方式：FastSkills MCP / Recommended: FastSkills MCP

适用于 **Claude Code / OpenCode / 任何 MCP 兼容工具**

Works with **Claude Code / OpenCode / Any MCP-compatible tool**

#### 方式 A：远程 MCP（最推荐）/ Remote MCP (Highly Recommended)

**使用远程 MCP 服务器，无需本地安装！**

**Use remote MCP server, no local installation needed!**

```json
{
  "mcpServers": {
    "fastskills": {
      "url": "https://mcp.fastskills.xyz/sse"
    }
  }
}
```

**配置位置 / Configuration Paths:**
- Claude Code: `~/.claude/mcp.json`
- OpenCode: `.mcp.json` (项目根目录)
- 项目特定: `.claude/mcp.json`

**优点 / Benefits:**
- ✅ 智能语义搜索 / Smart semantic search
- ✅ 动态加载和卸载 / Hot load/unload skills
- ✅ 上下文优化 / Context optimization
- ✅ 自动补全 / Auto-completion

> 📖 **详细配置**: [MCP_SETUP.md](./MCP_SETUP.md)

#### 方式 B：HTTP API（零安装）/ HTTP API (Zero Install)

**无需安装任何依赖，直接调用云端 API！**

**No installation required, call cloud API directly!**

```bash
# 搜索技能 / Search skills
curl -X POST https://mcp.fastskills.xyz/find_skills \
  -H "Content-Type: application/json" \
  -d '{"query": "单细胞RNA分析", "limit": 5}'

# 获取技能内容 / Get skill content
curl -X POST https://mcp.fastskills.xyz/load_skills \
  -H "Content-Type: application/json" \
  -d '{"skills": ["scanpy", "anndata"]}'

# 列出所有技能 / List all skills
curl https://mcp.fastskills.xyz/list_skills
```

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/find_skills` | POST | 智能搜索技能 / Smart skill search |
| `/load_skills` | POST | 获取技能完整内容 / Get full skill content |
| `/list_skills` | GET | 列出所有技能 / List all skills |
| `/health` | GET | 健康检查 / Health check |

---

### 备选方式 / Alternative Methods

<details>
<summary><b>方式 C：Claude Code 插件市场 / Plugin Marketplace</b></summary>

在 Claude Code 中使用插件市场安装：

```bash
/plugin marketplace add fastskills-skills
/plugin install ai-ml-tools@fastskills
```

</details>

<details>
<summary><b>方式 D：手动复制 / Manual Installation (Offline)</b></summary>

适用于离线环境或特定场景。

```bash
git clone --recursive https://github.com/PureVibeCoder/fastskills.git
cp -r fastskills/anthropic-skills/.claude/skills/* ~/.claude/skills/
```

| Scope | Path |
|-------|------|
| Project | `.claude/skills/<skill-name>/SKILL.md` |
| Global | `~/.claude/skills/<skill-name>/SKILL.md` |

</details>

> 📖 **More details**: Visit [fastskills.xyz](https://fastskills.xyz) for interactive guides.
> 
> 📖 **更多详情**：访问 [fastskills.xyz](https://fastskills.xyz) 获取交互式指南。

---

## Overview / 项目概述

**FastSkills** aggregates 225+ high-quality Claude Code skills from 10+ open-source projects on GitHub, organized into 25 scenario-based skill packs for developers and researchers.

**FastSkills** 汇集来自 GitHub 10+ 个开源项目的 225+ 高质量 Claude Code 技能，并按场景打包成 25 个技能包，服务于开发者和科研工作者。

---

## Key Features / 核心功能

| Feature | Description |
|---------|-------------|
| **🌐 HTTP API** 云端接口 | Zero-install API at `mcp.fastskills.xyz` |
| **🎯 Dynamic Loading** 按需加载 | Load skills on-demand via MCP, no context bloat |
| **🔍 Smart Search** 智能搜索 | TF-IDF semantic search finds the right skills |
| **📦 Skill Aggregation** 技能聚合 | 225+ skills from 10+ curated open-source projects |
| **🎁 Scenario Packs** 场景打包 | 25 ready-to-use skill packs for different workflows |
| **🏷️ Category Filtering** 分类筛选 | 20 categories including 9 scientific sub-domains |
| **🔒 Security Scanning** 安全扫描 | Auto-generated security reports for each download |

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

### 第 1 步：配置 MCP（推荐）/ Step 1: Configure MCP (Recommended)

**最快的方式：3 分钟即可开始使用**

编辑 `~/.claude/mcp.json` 或项目的 `.claude/mcp.json`：

```json
{
  "mcpServers": {
    "fastskills": {
      "url": "https://mcp.fastskills.xyz/sse"
    }
  }
}
```

重启 Claude Code，开始使用！

> 📖 详见：[MCP_SETUP.md](./MCP_SETUP.md)

### 第 2 步（可选）：HTTP API 快速测试 / Step 2 (Optional): Quick Test with HTTP API

无需任何配置，直接测试：

```bash
# 搜索技能
curl -X POST https://mcp.fastskills.xyz/find_skills \
  -H "Content-Type: application/json" \
  -d '{"query": "前端开发", "limit": 5}'
```

### 其他方式 / Alternative Methods

**方式 2：从网站下载**

1. 访问 [fastskills.pages.dev](https://fastskills.pages.dev)
2. 浏览并下载技能或技能包
3. 审查 SKILL.md 文件内容
4. 复制到 `~/.claude/skills/` 或 `your-project/.claude/skills/`
5. 重启 Claude Code

**方式 3：克隆仓库**

```bash
# 克隆所有子模块
git clone --recursive https://github.com/PureVibeCoder/fastskills.git

# 复制技能
cp -r fastskills/anthropic-skills/.claude/skills/* ~/.claude/skills/
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
- **HTTP API**: [mcp.fastskills.xyz](https://mcp.fastskills.xyz)
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
