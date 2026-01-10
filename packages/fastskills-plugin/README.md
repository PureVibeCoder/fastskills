# FastSkills 自动增强插件

> 🚀 让 Claude Code 自动检测上下文，智能加载 227+ 专业技能，无感增强能力

## 特性

- **完全无感知** - 正常对话，系统自动检测意图
- **智能路由** - 根据上下文自动匹配最相关的技能
- **用户可见** - 显示当前加载了哪些技能
- **持久化** - 加载的技能在整个会话期间生效
- **离线可用** - 无需依赖远程 MCP 服务器

## 快速安装

### 方法 1：直接复制（推荐）

1. 打开生成的 `FASTSKILLS.md` 文件
2. 复制全部内容
3. 粘贴到你的 `~/.claude/CLAUDE.md` 文件中

```bash
# 或者使用命令行
cat packages/fastskills-plugin/FASTSKILLS.md >> ~/.claude/CLAUDE.md
```

### 方法 2：符号链接

```bash
# 创建符号链接（需要先移除或重命名现有 CLAUDE.md）
ln -s /path/to/fastskills/packages/fastskills-plugin/FASTSKILLS.md ~/.claude/CLAUDE.md
```

### 方法 3：使用脚本生成最新版本

```bash
cd packages/fastskills-plugin
pnpm install
pnpm generate
```

## 使用效果

安装后，当你与 Claude Code 对话时：

```
用户: 帮我写一个 React 登录组件

Claude: 📦 已加载技能: react-components, frontend-design

[高质量的 React 组件代码，应用了最佳实践...]
```

```
用户: 分析这个单细胞数据

Claude: 📦 已加载技能: scanpy, biopython, scientific-visualization

[专业的单细胞分析代码和解释...]
```

## 工作原理

```
用户输入 → 意图检测 → 关键词匹配 → 自动加载技能 → 增强回复
```

### 意图检测

系统会检测 10+ 种意图类型：

| 意图 | 触发词示例 |
|------|-----------|
| CREATE | 创建、开发、写一个、build、create |
| RESEARCH | 研究、分析、查找、analyze |
| DEBUG | 调试、修复、bug、fix |
| DESIGN | 设计、UI、界面、style |
| TEST | 测试、e2e、coverage |
| DEPLOY | 部署、docker、kubernetes |

### 关键词匹配

支持中英文双语匹配：

| 中文 | 自动扩展 |
|-----|---------|
| 蛋白质 | protein, alphafold, esm |
| 单细胞 | single-cell, scanpy |
| 前端 | frontend, react, vue |
| 数据库 | database, sql, mongodb |

## 包含的技能

### 热门技能（45 个，完整内容内嵌）

**通用开发**
- backend-development, database-design
- frontend-design, modern-frontend-design, react-components
- devops, docker, code-review, webapp-testing

**文档处理**
- doc-coauthoring, docx, pdf, pptx, xlsx

**思维方法**
- sequential-thinking, planning-with-files, brainstorming

**数据分析**
- matplotlib, plotly, seaborn, statistical-analysis

**科学研究**
- rdkit, scanpy, biopython, scientific-writing

### 索引技能（211 个，按需加载）

所有技能都有索引，可通过 GitHub Raw URL 按需获取完整内容。

## 文件大小

| 内容 | 大小 |
|-----|------|
| 索引（211 个技能） | ~50 KB |
| 热门技能（45 个） | ~520 KB |
| 总计 | ~570 KB |

## 更新

重新运行生成脚本获取最新技能：

```bash
cd packages/fastskills-plugin
pnpm generate
```

## 自定义

### 修改热门技能列表

编辑 `generate.ts` 中的 `TOP_50_SKILLS` 数组：

```typescript
const TOP_50_SKILLS = [
  'backend-development',
  'your-favorite-skill',
  // ...
];
```

### 添加自定义规则

在生成的 `FASTSKILLS.md` 末尾添加你自己的规则。

## 故障排除

### 技能没有自动加载？

1. 确认 `~/.claude/CLAUDE.md` 包含完整内容
2. 检查是否有语法错误
3. 重启 Claude Code

### 文件太大？

可以只复制需要的部分：
- 系统说明 + 意图规则（必需）
- 技能索引（推荐）
- 热门技能内容（按需选择）

## License

MIT
