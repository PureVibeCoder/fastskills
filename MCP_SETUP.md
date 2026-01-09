# FastSkills MCP 服务器配置指南

FastSkills 是一个 **MCP（Model Context Protocol）服务器**，提供动态技能加载和智能搜索功能。

## 核心概念

- **MCP 服务器**：FastSkills 本身就是一个 MCP 服务器
- **动态加载**：无需预装 240+ 技能，通过 MCP 按需加载
- **智能搜索**：使用 TF-IDF 算法进行语义搜索
- **上下文优化**：保持 Claude 的上下文窗口精简

## 安装方式

### 方式 1：通过 MCP JSON 配置（推荐）

这是 **最推荐的方式**，直接在 Claude Code 中配置 MCP 服务器。

#### 1.1 本地 MCP 服务器

如果你有本地 FastSkills 项目：

```json
{
  "mcpServers": {
    "fastskills": {
      "command": "node",
      "args": ["/path/to/fastskills/packages/skills-router/dist/index.js"]
    }
  }
}
```

**配置位置**：
- **Claude Code**: `~/.claude/mcp.json`
- **OpenCode**: 项目根目录 `.mcp.json`

#### 1.2 远程 MCP 服务器

使用云托管的 FastSkills MCP（即将推出）：

```json
{
  "mcpServers": {
    "fastskills": {
      "command": "npx",
      "args": ["@fastskills/mcp-client", "--remote=https://mcp.fastskills.xyz"]
    }
  }
}
```

### 方式 2：HTTP API（零安装）

直接调用云端 API，无需配置 MCP 服务器：

```bash
# 搜索技能
curl -X POST https://mcp.fastskills.xyz/find_skills \
  -H "Content-Type: application/json" \
  -d '{"query": "单细胞RNA分析", "limit": 5}'

# 加载技能
curl -X POST https://mcp.fastskills.xyz/load_skills \
  -H "Content-Type: application/json" \
  -d '{"skills": ["scanpy", "anndata"]}'

# 列出所有技能
curl https://mcp.fastskills.xyz/list_skills
```

### 方式 3：Claude Code 插件

在 Claude Code 中使用插件市场安装：

```bash
/plugin marketplace add fastskills-skills
/plugin install ai-ml-tools@fastskills
```

### 方式 4：手动复制（备选）

适用于离线环境或特定场景：

```bash
# 克隆仓库
git clone --recursive https://github.com/PureVibeCoder/fastskills.git

# 复制技能到本地
cp -r fastskills/anthropic-skills/.claude/skills/* ~/.claude/skills/

# 重新启动 Claude Code
```

## 使用 FastSkills MCP

### 搜索技能

通过 MCP 工具搜索相关技能：

```
用户: "我需要一个单细胞RNA分析的技能"

Claude 使用 MCP:
→ find_skills(query="单细胞RNA分析", limit=5)
→ 返回: scanpy, scvi-tools, anndata, seurat, celltype-annotation

用户: "加载 scanpy 和 anndata"
Claude 使用 MCP:
→ load_skills(skills=["scanpy", "anndata"])
→ 技能现在可用于会话
```

### 动态加载

MCP 支持热加载和卸载：

```
# 加载技能
load_skills(["frontend-design", "test-driven-development"])

# 卸载技能（释放上下文）
unload_skills(["frontend-design"])

# 查看已加载的技能
list_loaded_skills()
```

## MCP 工具列表

| 工具 | 描述 | 参数 |
|------|------|------|
| `find_skills` | 智能搜索技能 | `query` (string), `limit` (number, default=5) |
| `load_skills` | 加载技能到会话 | `skills` (array of skill IDs) |
| `unload_skills` | 卸载技能 | `skills` (array of skill IDs) |
| `list_skills` | 列出所有技能 | `category` (optional) |
| `list_loaded_skills` | 查看已加载的技能 | 无 |
| `get_skill_content` | 获取技能完整内容 | `skill_id` (string) |
| `get_skill_info` | 获取技能元数据 | `skill_id` (string) |

## 配置示例

### 完整的 .mcp.json 配置

```json
{
  "mcpServers": {
    "fastskills": {
      "command": "node",
      "args": ["${CLAUDE_PLUGIN_ROOT}/dist/index.js"],
      "env": {
        "LOG_LEVEL": "info",
        "CACHE_ENABLED": "true"
      }
    },
    "fastskills-remote": {
      "command": "npx",
      "args": ["@fastskills/mcp-client", "--remote"],
      "env": {
        "FASTSKILLS_API": "https://mcp.fastskills.xyz",
        "API_TIMEOUT": "30000"
      }
    }
  }
}
```

### 仅加载特定分类

```json
{
  "mcpServers": {
    "fastskills-scientific": {
      "command": "node",
      "args": ["${CLAUDE_PLUGIN_ROOT}/dist/index.js"],
      "env": {
        "SKILL_CATEGORY": "scientific",
        "MAX_SKILLS": "50"
      }
    }
  }
}
```

## 最佳实践

### 1. 按需加载，保持上下文清晰

```
❌ 不推荐: 一次加载所有 240+ 技能
✅ 推荐: 根据任务需要加载 3-5 个相关技能
```

### 2. 定期卸载不用的技能

```
会话开始: load_skills(["task-planning"])
执行任务中...
任务完成: unload_skills(["task-planning"])
→ 释放上下文窗口给其他技能
```

### 3. 使用搜索而不是记忆技能名

```
❌ 不推荐: "给我加载 scanpy、anndata、scvi-tools..."
✅ 推荐: "我需要单细胞RNA分析的技能"
→ MCP 自动搜索并推荐相关技能
```

## 调试

### 检查 MCP 连接

```bash
# 列出可用的 MCP 服务器
curl https://mcp.fastskills.xyz/health

# 查看 MCP 日志
tail -f ~/.claude/mcp.log
```

### 常见问题

| 问题 | 解决方案 |
|------|--------|
| MCP 无法连接 | 检查 `~/.claude/mcp.json` 配置是否正确 |
| 搜索结果不准确 | 使用更具体的查询词，如 "RNA-seq 单细胞分析" |
| 技能加载失败 | 检查技能 ID 是否正确，使用 `list_skills()` 验证 |
| 上下文溢出 | 卸载不必要的技能，只保留当前任务所需的 |

## 与其他安装方式的对比

| 方式 | 优点 | 缺点 | 适用场景 |
|------|------|------|--------|
| **MCP 配置** | 动态加载、智能搜索、节省上下文 | 需要支持 MCP | 推荐使用 |
| **HTTP API** | 零依赖、无需安装 | 需要网络连接 | 快速测试、集成 |
| **插件市场** | 开箱即用、官方支持 | 受平台限制 | Claude Code 专用 |
| **手动复制** | 完全离线、无外部依赖 | 难以维护、占用上下文 | 离线环境 |

## 后续功能

### 即将推出

- [ ] **本地缓存**：缓存已加载技能，加速后续加载
- [ ] **技能推荐**：基于对话内容自动推荐相关技能
- [ ] **团队协作**：共享技能集合和配置
- [ ] **实时更新**：技能库自动同步最新版本
- [ ] **离线支持**：完整技能库本地备份

## 相关文档

- [项目 README](./README.md) - 项目概述
- [快速开始](./README.md#快速开始--快速开始) - 使用指南
- [安全须知](./README.md#security--安全须知) - 安全审查检查清单
- [GitHub Issues](https://github.com/PureVibeCoder/fastskills/issues) - 问题反馈

## 获取帮助

- **官网**: [fastskills.pages.dev](https://fastskills.pages.dev)
- **API 文档**: [mcp.fastskills.xyz](https://mcp.fastskills.xyz)
- **GitHub**: [PureVibeCoder/fastskills](https://github.com/PureVibeCoder/fastskills)
- **问题反馈**: [Issues](https://github.com/PureVibeCoder/fastskills/issues)
