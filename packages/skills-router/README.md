# FastSkills Router

> 智能技能发现与动态加载系统 - 基于 Claude Code 热加载能力

[![Version](https://img.shields.io/badge/version-1.0.0-blue)]()
[![Skills](https://img.shields.io/badge/Skills-189+-green)]()
[![MCP](https://img.shields.io/badge/MCP-1.12.0-orange)]()
[![Website](https://img.shields.io/badge/Website-fastskills.xyz-success)](https://fastskills.xyz)

## 功能特性

- **智能技能发现**：基于 TF-IDF 语义搜索，根据用户意图自动推荐最相关的技能
- **动态热加载**：利用 Claude Code 原生 filesystem watcher 按需加载技能
- **意图识别**：支持 11 种意图类型（CREATE, RESEARCH, DEBUG, DEPLOY 等）
- **安全验证**：路径安全检查，防止目录遍历攻击
- **中英文支持**：同时支持中文和英文查询

## 快速开始

### 安装

```bash
cd packages/skills-router
pnpm install
pnpm build
```

### 作为 MCP 服务器使用

添加到 Claude Code 配置：

```json
{
  "mcpServers": {
    "fastskills-router": {
      "command": "node",
      "args": ["/path/to/packages/skills-router/dist/index.js"]
    }
  }
}
```

### 作为 Plugin 安装

```bash
/plugin install ./packages/skills-router
```

## MCP 工具

### find_skills

根据任务描述智能推荐技能。

```json
{
  "query": "我需要分析单细胞RNA数据",
  "limit": 5,
  "category": "bioinformatics"
}
```

### load_skills

动态加载技能到当前会话。

```json
{
  "skills": ["scanpy", "rdkit", "frontend-design"]
}
```

### unload_skill

卸载不再需要的技能。

```json
{
  "skill_id": "scanpy"
}
```

### list_active_skills

列出当前已加载的所有技能。

## 技能分类

| 分类 | 技能数 | 说明 |
|------|--------|------|
| frontend | 65 | 前端开发、UI 设计 |
| devops | 60 | 运维、CI/CD、容器化 |
| backend | 31 | 后端开发、API、数据库 |
| testing | 12 | 测试、QA |
| skill-dev | 5 | 技能开发工具 |
| ml-ai | 4 | 机器学习、AI |
| bioinformatics | 3 | 生物信息学 |
| scientific | 2 | 科学研究 |
| lab-automation | 2 | 实验室自动化 |
| data-viz | 2 | 数据可视化 |
| document | 2 | 文档处理 |
| media | 1 | 媒体处理 |

## 开发

```bash
# 开发模式（热重载）
pnpm dev

# 类型检查
pnpm typecheck

# 重新生成技能索引
pnpm generate-index

# 构建
pnpm build
```

## 项目结构

```
packages/skills-router/
├── src/
│   ├── index.ts           # MCP Server 入口
│   ├── types.ts           # TypeScript 类型定义
│   ├── tools/             # MCP 工具实现
│   │   ├── find-skills.ts
│   │   ├── load-skills.ts
│   │   ├── unload-skill.ts
│   │   └── list-skills.ts
│   ├── engine/            # 核心引擎
│   │   ├── intent.ts      # 意图识别
│   │   ├── search.ts      # TF-IDF 搜索
│   │   ├── loader.ts      # 热加载器
│   │   └── security.ts    # 安全验证
│   └── data/
│       └── skills.json    # 技能索引
├── scripts/
│   └── generate-index.ts
├── plugin.json
├── package.json
└── tsconfig.json
```

## 技术栈

- **MCP SDK**: @modelcontextprotocol/sdk ^1.12.0
- **NLP**: natural ^8.0.1 (TF-IDF)
- **Schema**: zod ^3.22.0
- **Runtime**: Node.js >= 18.0.0

## 链接

- **官网**: [fastskills.xyz](https://fastskills.xyz)
- **GitHub**: [github.com/PureVibeCoder/fastskills](https://github.com/PureVibeCoder/fastskills)

## License

MIT
