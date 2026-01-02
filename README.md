# Skills MCP Controller

> 智能技能编排控制器 - 集成 GitHub 高星开源项目，为 Claude Code 提供专家级技能


[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![MCP](https://img.shields.io/badge/MCP-1.0-purple)](https://modelcontextprotocol.io/)
[![Skills](https://img.shields.io/badge/Skills-58+-green)](#技能来源)

---

## 技能来源声明

**所有技能均来自 GitHub 高星开源项目，本项目仅为聚合和路由管理工具。**

| 项目 | Stars | 技能数 | 许可证 |
|:---:|:---:|:---:|:---:|
| [![Superpowers](https://github.githubassets.com/favicons/favicon.svg) Superpowers](https://github.com/obra/superpowers) | [![13k](https://img.shields.io/badge/⭐-13k-blue)](https://github.com/obra/superpowers) | 14 | MIT |
| [![ClaudeKit](https://github.githubassets.com/favicons/favicon.svg) ClaudeKit](https://github.com/mrgoonie/claudekit-skills) | [![1.1k](https://img.shields.io/badge/⭐-1.1k-blue)](https://github.com/mrgoonie/claudekit-skills) | 39 | MIT |
| [![Deep Research](https://github.githubassets.com/favicons/favicon.svg) Deep Research](https://github.com/liangdabiao/Claude-Code-Deep-Research-main) | [![55](https://img.shields.io/badge/⭐-55-blue)](https://github.com/liangdabiao/Claude-Code-Deep-Research-main) | 5 | - |
| [![superpowers-marketplace](https://github.githubassets.com/favicons/favicon.svg) superpowers-marketplace](https://github.com/obra/superpowers-marketplace) | [![51 forks](https://img.shields.io/badge/forks-51-blue)](https://github.com/obra/superpowers-marketplace) | TBD | MIT |
| [![superpowers-lab](https://github.githubassets.com/favicons/favicon.svg) superpowers-lab](https://github.com/obra/superpowers-lab) | [![7 forks](https://img.shields.io/badge/forks-7-blue)](https://github.com/obra/superpowers-lab) | TBD | MIT |
| [![ComposioHQ](https://github.githubassets.com/favicons/favicon.svg) ComposioHQ/awesome-claude-skills](https://github.com/ComposioHQ/awesome-claude-skills) | TBD | TBD | MIT |

---

## 简介

Skills MCP Controller 是一个基于 [Model Context Protocol (MCP)](https://modelcontextprotocol.io/) 的智能技能路由系统。它能够：

- **自动发现**：扫描并加载技能库中的所有技能
- **智能路由**：根据用户意图自动激活最相关的技能
- **按需加载**：只在需要时加载技能内容，节省上下文空间
- **自动管理**：用完自动停用，保持上下文清洁

---

## 快速开始

### 安装

#### 方式一：npm 安装（推荐）

```bash
npm install -g skillscontroller
```

#### 方式二：Homebrew 安装（macOS/Linux）

```bash
brew install marovole/tap/skillscontroller
```

#### 方式三：从源码安装

```bash
git clone https://github.com/marovole/skillscontroller.git
cd skillscontroller
npm install
```

### 配置 MCP

在你的 Claude Code 配置文件中添加（通常是 `~/.claude/.mcp.json` 或项目的 `.mcp.json`）：

**npm/全局安装：**

```json
{
  "mcpServers": {
    "skills": {
      "command": "skillscontroller"
    }
  }
}
```

**从源码安装：**

```json
{
  "mcpServers": {
    "skills": {
      "command": "node",
      "args": ["/path/to/skillscontroller/dist/skills-controller.js"]
    }
  }
}
```

### 配置全局规则（必需）

为了让 Skills MCP Controller 自动工作，你需要在 Claude Code 的全局配置中添加技能触发规则。

**编辑文件**：`~/.claude/CLAUDE.md`（如果不存在则创建）

**添加以下内容**：

```markdown
## 技能自动激活规则

**重要**：当用户请求任何技术任务时，始终优先调用 `mcp__skills__analyze_and_route` 工具。

### 必须调用工具的场景

- 任何编程任务（写代码、调试、重构）
- 设计相关（UI/UX、图形、布局）
- 文档处理（PDF、Word、Excel、PPT）
- 数据处理（数据库、API、文件）
- 开发操作（Git、Docker、部署、测试）
- 创建任何内容（网页、组件、脚本）
- **研究框架/库的原理**（如"Vue响应式原理"、"React虚拟DOM"）
- **查看源码、实现机制、内部工作原理**

### 无需调用工具的场景

- 简单问答（如"你好"、"谢谢"等社交对话）
- 闲聊
- **不涉及技术研究的概念解释**（如"什么是 HTTP？"等基础概念）

### 使用原则

```
用户请求 → 先调用 analyze_and_route → 使用激活的技能处理 → 完成后调用 deactivate_all_skills
```

**关键**：用户不需要知道技能系统的存在。一切自动发生。
```

> ⚠️ **注意**：如果不配置全局规则，Skills MCP Controller 不会自动触发技能，你需要手动调用 `analyze_and_route` 工具。

---

### 环境变量（可选）

```bash
# 自定义技能目录（多个目录用逗号分隔）
export SKILLS_DIR="/path/to/skills1,/path/to/skills2"
```

---

## 核心功能

### 1. 智能路由

根据用户输入自动分析意图并激活相关技能：

```
用户: "帮我设计一个登录页面"
   ↓
Skills Controller 分析意图
   ↓
激活: frontend-design 技能
```

### 2. 技能管理

| 工具 | 功能 |
|------|------|
| `analyze_and_route` | 分析用户意图并激活相关技能 |
| `list_active_skills` | 列出当前激活的技能 |
| `deactivate_skill` | 停用指定技能 |
| `deactivate_all_skills` | 停用所有技能 |
| `get_skill_index` | 获取所有技能索引 |
| `load_skill` | 直接加载指定技能 |
| `search_skills` | 搜索包含关键词的技能 |

### 3. 技能库

目前支持 **58+ 技能**，全部来自以下 GitHub 高星开源项目:

#### 从 Superpowers (⭐ 13k)
> [https://github.com/obra/superpowers](https://github.com/obra/superpowers)

`brainstorming` • `dispatching-parallel-agents` • `executing-plans` • `finishing-a-development-branch` • `receiving-code-review` 等 14 个核心开发技能

#### 从 ClaudeKit (⭐ 1.1k)
> [https://github.com/mrgoonie/claudekit-skills](https://github.com/mrgoonie/claudekit-skills)

`databases` • `devops` • `sequential-thinking` • `chrome-devtools` • `when-stuck` 等 39 个全能技能

#### 从 Deep Research (⭐ 55)
> [https://github.com/liangdabiao/Claude-Code-Deep-Research-main](https://github.com/liangdabiao/Claude-Code-Deep-Research-main)

`question-refiner` • `research-executor` • `got-controller` • `citation-validator` • `synthesizer` 等 5 个深度研究技能

**Deep Research 技能特点**：
- 🔍 **多智能体并行研究**：部署 3-8 个智能体同时研究不同子主题
- 📊 **Graph of Thoughts 框架**：使用 GoT 优化研究路径和质量
- 📚 **引用验证系统**：A-E 质量评级，确保每个声明都有可验证来源
- ✨ **完整研究流程**：从问题精炼到最终报告生成的 7 阶段方法
- 🎯 **依赖 Exa MCP**：需要配置 Exa AI MCP 服务器以使用网络搜索功能

#### 从 obra/superpowers-marketplace - 新增
> [https://github.com/obra/superpowers-marketplace](https://github.com/obra/superpowers-marketplace)

官方技能市场，提供社区贡献的技能

#### 从 obra/superpowers-lab - 新增
> [https://github.com/obra/superpowers-lab](https://github.com/obra/superpowers-lab)

实验性技能，包含最新的技能原型

#### 从 ComposioHQ/awesome-claude-skills - 新增
> [https://github.com/ComposioHQ/awesome-claude-skills](https://github.com/ComposioHQ/awesome-claude-skills)

Composio 团队维护的精选技能列表

---

**技能市场参考资源：**
- [skillsmp.com](https://skillsmp.com) - Anthropic 官方推荐平台（38,216+ 技能）
- [claudemarketplaces.com](https://claudemarketplaces.com) - 技能展示目录网站

---

## 项目结构

```
skillscontroller/
├── packages/
│   ├── mcp-server/              # MCP 服务器
│   ├── shared/                  # 共享类型和工具
│   └── website/                 # 项目网站
├── superpowers/                 # Superpowers 核心技能库 (⭐13.3k)
├── claudekit-skills/            # ClaudeKit 全能技能 (⭐1.1k)
├── deep-research-skills/        # Deep Research 研究技能 (⭐55)
├── package.json
├── pnpm-workspace.yaml
├── .mcp.json                    # MCP 配置示例
├── ROADMAP.md                   # 开发路线图
└── README.md
```

---

## 使用示例

### 在 Claude Code 中使用

```
用户: 帮我创建一个响应式的登录表单

Claude 会自动：
1. 调用 analyze_and_route 分析意图
2. 激活 frontend-design 技能
3. 根据技能指令生成代码
4. 完成后自动停用技能
```

### 深度研究示例

使用 Deep Research 技能进行全面的研究：

```
用户: 帮我研究 AI 在医疗诊断中的应用

Claude 会自动：
1. 调用 question-refiner 精炼研究问题
2. 激活 research-executor 部署多个研究智能体
3. 使用 Exa MCP 工具进行网络搜索和内容爬取
4. 调用 synthesizer 综合研究发现
5. 使用 citation-validator 验证所有引用
6. 生成包含引用的完整研究报告
```

或者使用斜杠命令：

```bash
/deep-research AI applications in clinical diagnosis

# 或分步执行
/refine-question What are the latest AI applications in healthcare?
/plan-research [精炼后的研究提示]
/synthesize-findings RESEARCH/ai-healthcare/research_notes/
/validate-citations RESEARCH/ai-healthcare/full_report.md
```

### CLI 工具

```bash
# 列出所有技能
skillscontroller list

# 搜索技能
skillscontroller search "database"
```

---

## 开发路线图

详见 [ROADMAP.md](./ROADMAP.md)

- [x] v1.0 - 核心功能实现
- [ ] v1.1 - 路由引擎增强（语义理解、多语言支持）
- [ ] v1.2 - 技能生态（贡献者系统、技能市场）
- [ ] v1.3 - 技能扩容（100+ 技能）
- [ ] v2.0 - 智能进化（项目感知、自适应学习）
- [ ] v2.5 - 开放生态（SDK、IDE 插件）

---

## 贡献指南

欢迎贡献新技能！请遵循以下步骤：

1. Fork 仓库
2. 创建技能目录
3. 编写 `SKILL.md` 文件
4. 提交 Pull Request

### 技能模板

```markdown
---
name: your-skill-name
description: 简短描述技能功能
author: your-name
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

## 技术栈

- **TypeScript** - 类型安全的 JavaScript
- **Model Context Protocol SDK** - MCP 服务器框架
- **Node.js** - 运行时环境

---

## 致谢

本项目的所有技能内容均来自以下优秀的开源项目:

| 项目 | 作者 | 链接 |
|------|------|------|
| **superpowers** | [obra](https://github.com/obra) | [github.com/obra/superpowers](https://github.com/obra/superpowers) |
| **superpowers-marketplace** | [obra](https://github.com/obra) | [github.com/obra/superpowers-marketplace](https://github.com/obra/superpowers-marketplace) |
| **superpowers-lab** | [obra](https://github.com/obra) | [github.com/obra/superpowers-lab](https://github.com/obra/superpowers-lab) |
| **claudekit-skills** | [mrgoonie](https://github.com/mrgoonie) | [github.com/mrgoonie/claudekit-skills](https://github.com/mrgoonie/claudekit-skills) |
| **Claude-Code-Deep-Research-main** | [liangdabiao](https://github.com/liangdabiao) | [github.com/liangdabiao/Claude-Code-Deep-Research-main](https://github.com/liangdabiao/Claude-Code-Deep-Research-main) |
| **awesome-claude-skills** | [ComposioHQ](https://github.com/ComposioHQ) | [github.com/ComposioHQ/awesome-claude-skills](https://github.com/ComposioHQ/awesome-claude-skills) |

**特别说明**:本项目仅为技能聚合和智能路由工具,所有技能的版权归各自原作者所有。

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
- [开发路线图](./ROADMAP.md)

---

## 技能路由测试指南

以下是测试所有技能是否正确触发的典型提示词，每个测试用例包含：
- **测试提示词**：发送给 Claude 的消息
- **预期意图**：应该识别出的用户意图
- **预期技能**：应该激活的技能
- **说明**：测试目的

### 1. 前端设计类测试

| 测试提示词 | 预期意图 | 预期技能 | 说明 |
|-----------|---------|---------|------|
| `帮我设计一个登录页面` | CREATE | frontend-design | 基础前端设计 |
| `创建一个响应式的导航栏组件` | CREATE | frontend-design | 组件创建 |
| `用React设计一个仪表盘界面` | CREATE | frontend-design, modern-frontend-design | React设计 |
| `实现一个glassmorphism风格的卡片` | CREATE | modern-frontend-design | 特定设计风格 |
| `重构这个组件的CSS样式` | REFACTOR | ui-styling, frontend-design | 样式重构 |
| `查看React Query的源码实现` | RESEARCH | open-source-librarian | ❌ 不应激活 frontend-design |

### 2. 代码研究类测试

| 测试提示词 | 预期意图 | 预期技能 | 说明 |
|-----------|---------|---------|------|
| `查看React的源码实现` | RESEARCH | open-source-librarian | 源码研究 |
| `了解Vue是怎么实现响应式的` | RESEARCH | open-source-librarian | 实现原理 |
| `研究Next.js的路由机制` | RESEARCH | open-source-librarian | 框架机制 |
| `这个开源库的内部实现是什么` | RESEARCH | open-source-librarian | 开源库分析 |
| `how does React useState work internally` | RESEARCH | open-source-librarian | 英文源码查询 |

### 3. 调试类测试

| 测试提示词 | 预期意图 | 预期技能 | 说明 |
|-----------|---------|---------|------|
| `修复这个登录功能的bug` | DEBUG | systematic-debugging | Bug修复 |
| `为什么这个API请求失败了` | DEBUG | systematic-debugging, root-cause-tracing | 错误排查 |
| `调试一下这个组件不渲染的问题` | DEBUG | systematic-debugging | 组件调试 |
| `我卡住了，不知道怎么解决这个问题` | DEBUG | when-stuck | 求助场景 |
| `分析这个错误的根本原因` | DEBUG | root-cause-tracing | 根因分析 |

### 4. 测试类技能测试

| 测试提示词 | 预期意图 | 预期技能 | 说明 |
|-----------|---------|---------|------|
| `帮我写单元测试` | TEST_WRITE_UNIT | 无 | 使用通用编程能力 |
| `编写单元测试用例` | TEST_WRITE_UNIT | 无 | 不激活特定技能 |
| `为这个API添加集成测试` | TEST_WRITE_INTEGRATION | 无 | 使用通用编程能力 |
| `编写集成测试脚本` | TEST_WRITE_INTEGRATION | 无 | 不激活特定技能 |
| `写E2E测试` | TEST_WRITE_E2E | webapp-testing | E2E测试 |
| `创建端到端测试用例` | TEST_WRITE_E2E | webapp-testing | E2E测试 |
| `运行E2E测试` | TEST_RUN | webapp-testing | 运行测试 |
| `用Playwright测试登录流程` | TEST_WRITE_E2E | webapp-testing | Playwright E2E |
| `playwright test` | TEST_RUN | webapp-testing | 运行 Playwright |

### 5. 代码审查类测试

| 测试提示词 | 预期意图 | 预期技能 | 说明 |
|-----------|---------|---------|------|
| `审查这段代码` | ANALYZE | code-review | 代码审查 |
| `review这个PR` | ANALYZE | code-review | PR审查 |
| `检查代码质量` | ANALYZE | code-review | 质量检查 |
| `分析这个函数有没有bug` | ANALYZE | code-review | Bug检测 |

### 6. 文档类测试

| 测试提示词 | 预期意图 | 预期技能 | 说明 |
|-----------|---------|---------|------|
| `帮我写API文档` | DOCUMENT | document-skills, doc-coauthoring | API文档 |
| `生成README文档` | DOCUMENT | document-skills | README生成 |
| `创建changelog` | DOCUMENT | changelog-generator | 更新日志 |
| `添加代码注释` | DOCUMENT | document-skills | 代码注释 |
| `查找Express.js的官方文档` | RESEARCH | docs-seeker | 文档搜索 |

### 7. 格式转换类测试

| 测试提示词 | 预期意图 | 预期技能 | 说明 |
|-----------|---------|---------|------|
| `导出为PDF` | CONVERT | pdf | PDF导出 |
| `生成Word文档` | CONVERT/CREATE | docx | Word生成 |
| `创建PPT演示文稿` | CONVERT/CREATE | pptx | PPT创建 |
| `转换成Excel表格` | CONVERT | xlsx | Excel转换 |
| `把这个报告转成PDF格式` | CONVERT | pdf | 格式转换 |

### 8. 后端开发类测试

| 测试提示词 | 预期意图 | 预期技能 | 说明 |
|-----------|---------|---------|------|
| `创建一个REST API` | CREATE | backend-development | API创建 |
| `用Express实现用户认证` | CREATE | backend-development, web-frameworks | 认证实现 |
| `修复数据库连接问题` | DEBUG | databases | 数据库调试 |
| `优化SQL查询性能` | REFACTOR | databases | 查询优化 |
| `创建MongoDB数据模型` | CREATE | databases | 数据模型 |

### 9. DevOps类测试

| 测试提示词 | 预期意图 | 预期技能 | 说明 |
|-----------|---------|---------|------|
| `部署到生产环境` | DEPLOY | devops | 生产部署 |
| `配置CI/CD流水线` | CREATE/DEPLOY | devops | CI/CD配置 |
| `创建Docker配置` | CREATE | devops | Docker配置 |
| `发布新版本` | DEPLOY | devops | 版本发布 |

### 10. 浏览器自动化类测试

| 测试提示词 | 预期意图 | 预期技能 | 说明 |
|-----------|---------|---------|------|
| `用Chrome自动化抓取网页` | CREATE | browser | 网页抓取 |
| `截取网页截图` | CREATE | browser | 截图功能 |
| `使用DevTools调试页面` | DEBUG | chrome-devtools | DevTools调试 |
| `启动浏览器自动化测试` | TEST | browser | 自动化测试 |

### 11. MCP/工具类测试

| 测试提示词 | 预期意图 | 预期技能 | 说明 |
|-----------|---------|---------|------|
| `创建一个MCP服务器` | CREATE | mcp-builder | MCP创建 |
| `开发新技能` | CREATE | skill-creator | 技能开发 |
| `管理MCP配置` | CREATE | mcp-management | MCP管理 |

### 12. 媒体处理类测试

| 测试提示词 | 预期意图 | 预期技能 | 说明 |
|-----------|---------|---------|------|
| `处理这个视频文件` | CONVERT | media-processing | 视频处理 |
| `增强这张图片` | CREATE | image-enhancer | 图片增强 |
| `下载这个视频` | CREATE | video-downloader | 视频下载 |
| `创建一个GIF动图` | CREATE | slack-gif-creator | GIF创建 |

### 13. 图表可视化类测试

| 测试提示词 | 预期意图 | 预期技能 | 说明 |
|-----------|---------|---------|------|
| `画一个流程图` | CREATE | mermaidjs-v11 | 流程图 |
| `创建时序图` | CREATE | mermaidjs-v11 | 时序图 |
| `生成算法艺术` | CREATE | algorithmic-art | 算法艺术 |
| `用Mermaid画架构图` | CREATE | mermaidjs-v11 | 架构图 |

### 14. 认证授权类测试

| 测试提示词 | 预期意图 | 预期技能 | 说明 |
|-----------|---------|---------|------|
| `实现JWT认证` | CREATE | better-auth | JWT认证 |
| `创建登录授权流程` | CREATE | better-auth | 授权流程 |
| `修复认证bug` | DEBUG | better-auth | 认证调试 |

### 15. 思维方法类测试

| 测试提示词 | 预期意图 | 预期技能 | 说明 |
|-----------|---------|---------|------|
| `逐步分析这个问题` | ANY | sequential-thinking | 顺序思考 |
| `从反面考虑这个方案` | ANY | inversion-exercise | 逆向思维 |
| `分析这个系统的规模扩展性` | ANY | scale-game | 规模化思考 |
| `简化这个复杂的设计` | REFACTOR | simplification-cascades | 简化设计 |
| `在完成前验证一下` | TEST/ANALYZE | verification-before-completion | 完成验证 |

### 16. 业务领域类测试

| 测试提示词 | 预期意图 | 预期技能 | 说明 |
|-----------|---------|---------|------|
| `创建Shopify店铺` | CREATE | shopify | 电商创建 |
| `设计品牌指南` | CREATE | brand-guidelines | 品牌设计 |
| `整理发票` | CREATE | invoice-organizer | 发票整理 |
| `分析会议记录` | ANALYZE | meeting-insights-analyzer | 会议分析 |
| `想一个域名` | CREATE | domain-name-brainstormer | 域名构思 |
| `抽奖选出获胜者` | CREATE | raffle-winner-picker | 抽奖功能 |

### 17. 边界情况测试（不应激活技能）

| 测试提示词 | 预期意图 | 预期结果 | 说明 |
|-----------|---------|----------|------|
| `你好` | CHAT | 无技能激活 | 简单问候 |
| `什么是React` | CHAT | 无技能激活 | 概念解释 |
| `谢谢你的帮助` | CHAT | 无技能激活 | 致谢 |
| `解释一下MVC模式` | CHAT | 无技能激活 | 概念说明 |

### 18. 意图排除测试（关键测试）

这些测试验证意图感知系统是否正确排除不相关技能：

| 测试提示词 | 预期意图 | 应激活 | 不应激活 | 说明 |
|-----------|---------|--------|----------|------|
| `查看React的源码实现` | RESEARCH | open-source-librarian | frontend-design | 源码研究不触发设计 |
| `了解Vue响应式原理` | RESEARCH | open-source-librarian | frontend-design | 原理研究不触发设计 |
| `研究Next.js是怎么实现SSR的` | RESEARCH | open-source-librarian | web-frameworks | 研究不触发开发 |
| `看看这个库的内部实现` | RESEARCH | open-source-librarian | 任何设计/开发技能 | 源码查看 |
| `分析React Query怎么做缓存的` | RESEARCH | open-source-librarian | frontend-design | 实现分析 |

---

### 运行测试

1. **重启 MCP 服务器**：在 Claude Code 中运行 `/mcp` 命令或重启应用
2. **逐个发送测试提示词**：观察控制台输出的意图识别和技能激活日志
3. **验证预期结果**：确认激活的技能与预期匹配

### 控制台日志示例

正确的路由行为应该输出类似：

```
[Skills Controller] 识别意图: research (次要: analyze)
[Skills Controller] frontend-design 被意图排除: research
[Skills Controller] 匹配结果: open-source-librarian(14)
```

这表示：
- 识别到 RESEARCH 意图
- frontend-design 因为 `excludedIntents: [RESEARCH]` 被正确排除
- open-source-librarian 被激活（分数14）

---

**让每一次 AI 对话都拥有专家级能力** ⚡
