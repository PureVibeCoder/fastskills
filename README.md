# Skills MCP Controller

> 智能技能编排控制器 - 根据上下文动态激活/停用 Claude Code 技能

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![MCP](https://img.shields.io/badge/MCP-1.0-purple)](https://modelcontextprotocol.io/)

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

```bash
# 克隆仓库
git clone https://github.com/marovole/skillscontroller.git
cd skillscontroller

# 安装依赖
npm install

# 构建
npm run build
```

### 配置 MCP

在你的 Claude Code 配置文件中添加（通常是 `~/.claude/.mcp.json` 或项目的 `.mcp.json`）：

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

目前支持 **60+ 技能**，来源于：

- **Anthropic 官方** (16 个)：docx, pdf, pptx, xlsx, frontend-design 等
- **ClaudeKit** (29 个)：databases, devops, sequential-thinking, chrome-devtools 等
- **社区贡献** (15 个)：video-downloader, image-enhancer, changelog-generator 等

---

## 项目结构

```
skillscontroller/
├── src/
│   ├── skills-controller.ts    # MCP 服务器核心
│   └── cli.ts                   # CLI 工具
├── dist/                        # 编译输出
├── anthropic-skills/            # Anthropic 官方技能库
├── claudekit-skills/            # ClaudeKit 技能库
├── awesome-claude-skills/       # 社区技能库
├── bundles/                     # 技能包配置
├── test/                        # 测试文件
├── package.json
├── tsconfig.json
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

### CLI 工具

```bash
# 列出所有技能
skillscontroller list

# 搜索技能
skillscontroller search "database"

# 安装技能包
skillscontroller install bundles/fullstack-react.yaml
```

---

## 技能来源

| 来源 | Stars | 技能数 | 亮点 |
|------|-------|--------|------|
| [Anthropic 官方](https://github.com/anthropics/anthropic-quickstarts) | 30.7k | 16 | docx, pdf, frontend-design |
| [ClaudeKit](https://github.com/jorgeboman/claudekit-skills) | 1k | 29 | databases, devops, sequential-thinking |
| [awesome-claude-skills](https://github.com/yutongyang/awesome-claude-skills) | 3.9k | 15 | video-downloader, image-enhancer |

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

**让每一次 AI 对话都拥有专家级能力** ⚡
