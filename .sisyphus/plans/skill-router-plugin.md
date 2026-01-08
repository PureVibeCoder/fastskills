# Skills Router Plugin 实现计划

> 智能技能发现与动态加载系统 - 基于 Claude Code 2.1.0+ 热加载能力

**创建日期**: 2026-01-08  
**状态**: 规划中  
**预估工时**: 3-5 天

---

## 1. 项目概述

### 1.1 目标
构建一个 Claude Code Plugin，实现：
- **智能技能发现**：根据用户意图语义匹配最相关的技能
- **动态热加载**：利用 Claude Code 原生 filesystem watcher 按需加载技能
- **技能管理**：加载、卸载、列表管理

### 1.2 核心价值
| 问题 | 解决方案 |
|------|---------|
| 1000+ 技能用户无法记忆 | TF-IDF 语义搜索 + 意图识别 |
| 手动复制技能文件繁琐 | Symlink 自动创建 |
| Context window 被占满 | 按需加载，用完卸载 |

### 1.3 技术架构
```
┌─────────────────────────────────────────────────────────────┐
│                  skills-router Plugin                        │
├─────────────────────────────────────────────────────────────┤
│  packages/skills-router/                                     │
│  ├── src/                                                   │
│  │   ├── index.ts           # MCP Server 入口               │
│  │   ├── tools/             # MCP 工具实现                   │
│  │   │   ├── find-skills.ts                                 │
│  │   │   ├── load-skills.ts                                 │
│  │   │   ├── unload-skill.ts                                │
│  │   │   └── list-skills.ts                                 │
│  │   ├── engine/            # 核心引擎                       │
│  │   │   ├── intent.ts      # 意图识别 (复用旧代码)          │
│  │   │   ├── search.ts      # TF-IDF 搜索                   │
│  │   │   └── loader.ts      # 热加载触发器                   │
│  │   └── data/              # 数据层                         │
│  │       ├── index.ts       # 技能索引                       │
│  │       └── skills.json    # 241+ 技能元数据                │
│  ├── plugin.json            # Plugin 清单                    │
│  └── package.json                                           │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. 实现阶段

### Phase 1: 基础设施 (Day 1)

#### 1.1 创建 monorepo 包结构
```bash
packages/
├── website/          # 现有
└── skills-router/    # 新增
    ├── src/
    ├── plugin.json
    ├── package.json
    └── tsconfig.json
```

#### 1.2 依赖配置
```json
{
  "dependencies": {
    "@modelcontextprotocol/sdk": "^1.12.0",
    "natural": "^6.10.0",
    "glob": "^10.3.0"
  },
  "devDependencies": {
    "typescript": "^5.3.0",
    "tsx": "^4.7.0"
  }
}
```

#### 1.3 Plugin 清单
```json
// plugin.json
{
  "name": "skills-router",
  "version": "1.0.0",
  "description": "智能技能发现与动态加载",
  "mcpServers": {
    "skills-router": {
      "command": "npx",
      "args": ["tsx", "src/index.ts"]
    }
  }
}
```

**交付物**:
- [ ] `packages/skills-router/` 目录结构
- [ ] `package.json` 配置完成
- [ ] `plugin.json` 清单文件
- [ ] TypeScript 配置

---

### Phase 2: 技能索引生成器 (Day 1-2)

#### 2.1 从现有数据生成索引
复用 `packages/website/src/data/skills.ts` 的数据结构：

```typescript
// scripts/generate-index.ts
interface SkillMeta {
  id: string;
  name: string;
  description: string;
  category: string;
  source: string;
  triggers: string[];
  path: string;          // 相对于项目根目录的路径
  fullDescription?: string; // 完整描述用于搜索
}

async function generateIndex() {
  const skills: SkillMeta[] = [];
  
  // 扫描所有 SKILL.md 文件
  const skillFiles = await glob('**/SKILL.md', {
    ignore: ['node_modules/**', '.git/**']
  });
  
  for (const file of skillFiles) {
    const content = await fs.readFile(file, 'utf-8');
    const { data, content: body } = matter(content);
    
    skills.push({
      id: data.name,
      name: data.name,
      description: data.description,
      category: inferCategory(file),
      source: inferSource(file),
      triggers: extractTriggers(data.description),
      path: path.dirname(file),
      fullDescription: body.slice(0, 2000) // 前2000字符
    });
  }
  
  await fs.writeFile('src/data/skills.json', JSON.stringify(skills, null, 2));
}
```

#### 2.2 触发词提取
```typescript
// 从描述中提取关键触发词
function extractTriggers(description: string): string[] {
  // 使用 natural 的词干提取
  const tokenizer = new natural.WordTokenizer();
  const tokens = tokenizer.tokenize(description.toLowerCase());
  
  // 过滤停用词，提取关键词
  return tokens
    .filter(t => t.length > 2)
    .filter(t => !STOPWORDS.includes(t))
    .slice(0, 10);
}
```

**交付物**:
- [ ] `scripts/generate-index.ts` 索引生成脚本
- [ ] `src/data/skills.json` 241+ 技能的元数据
- [ ] 自动触发词提取逻辑

---

### Phase 3: 搜索引擎 (Day 2)

#### 3.1 TF-IDF 搜索实现
```typescript
// src/engine/search.ts
import { TfIdf } from 'natural';
import skills from '../data/skills.json';

class SkillSearchEngine {
  private tfidf: TfIdf;
  private skills: SkillMeta[];

  constructor() {
    this.tfidf = new TfIdf();
    this.skills = skills;
    
    // 建立索引
    this.skills.forEach(skill => {
      const document = [
        skill.name,
        skill.description,
        skill.triggers.join(' '),
        skill.fullDescription || ''
      ].join(' ');
      
      this.tfidf.addDocument(document);
    });
  }

  search(query: string, limit: number = 5): SearchResult[] {
    const results: SearchResult[] = [];
    
    this.tfidf.tfidfs(query, (index, score) => {
      if (score > 0) {
        results.push({
          skill: this.skills[index],
          score: score,
          reason: this.generateReason(query, this.skills[index])
        });
      }
    });
    
    return results
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);
  }

  private generateReason(query: string, skill: SkillMeta): string {
    // 生成推荐理由
    const queryTokens = new Set(query.toLowerCase().split(/\s+/));
    const matchedTriggers = skill.triggers.filter(t => 
      queryTokens.has(t.toLowerCase())
    );
    
    if (matchedTriggers.length > 0) {
      return `匹配关键词: ${matchedTriggers.join(', ')}`;
    }
    return `语义相关: ${skill.category}`;
  }
}
```

#### 3.2 意图识别 (复用旧代码)
```typescript
// src/engine/intent.ts
// 从 git show 670bfb2^:packages/mcp-server/src/skills-controller.ts 复用

enum IntentType {
  CREATE = "create",
  RESEARCH = "research",
  DEBUG = "debug",
  REFACTOR = "refactor",
  DOCUMENT = "document",
  TEST = "test",
  DEPLOY = "deploy",
  ANALYZE = "analyze",
  CONVERT = "convert",
  UNKNOWN = "unknown",
}

const INTENT_PATTERNS: IntentPattern[] = [
  {
    intent: IntentType.CREATE,
    patterns: [/创建|新建|开发|实现|写一个|做一个|build|create|implement|make/i],
    weight: 1.0
  },
  // ... 其他意图模式
];

function detectIntent(query: string): IntentType {
  let bestMatch = { intent: IntentType.UNKNOWN, score: 0 };
  
  for (const pattern of INTENT_PATTERNS) {
    for (const regex of pattern.patterns) {
      if (regex.test(query)) {
        const score = pattern.weight;
        if (score > bestMatch.score) {
          bestMatch = { intent: pattern.intent, score };
        }
      }
    }
  }
  
  return bestMatch.intent;
}
```

**交付物**:
- [ ] `src/engine/search.ts` TF-IDF 搜索引擎
- [ ] `src/engine/intent.ts` 意图识别器
- [ ] 单元测试覆盖

---

### Phase 4: 热加载器 (Day 2-3)

#### 4.1 Symlink 管理器
```typescript
// src/engine/loader.ts
import * as fs from 'fs/promises';
import * as path from 'path';
import * as os from 'os';

class SkillLoader {
  private claudeSkillsDir: string;
  private loadedSkills: Map<string, string> = new Map();

  constructor() {
    this.claudeSkillsDir = path.join(os.homedir(), '.claude', 'skills');
  }

  async ensureDir(): Promise<void> {
    await fs.mkdir(this.claudeSkillsDir, { recursive: true });
  }

  async loadSkill(skillId: string, sourcePath: string): Promise<LoadResult> {
    await this.ensureDir();
    
    const targetPath = path.join(this.claudeSkillsDir, skillId);
    
    // 检查是否已加载
    if (this.loadedSkills.has(skillId)) {
      return { status: 'already_loaded', path: targetPath };
    }
    
    // 检查目标是否已存在
    try {
      const stat = await fs.lstat(targetPath);
      if (stat.isSymbolicLink()) {
        // 已存在 symlink，更新记录
        this.loadedSkills.set(skillId, targetPath);
        return { status: 'already_exists', path: targetPath };
      }
    } catch (e) {
      // 不存在，继续创建
    }
    
    // 创建 symlink
    const absoluteSource = path.resolve(sourcePath);
    await fs.symlink(absoluteSource, targetPath, 'dir');
    
    this.loadedSkills.set(skillId, targetPath);
    
    return { 
      status: 'loaded', 
      path: targetPath,
      message: `技能 ${skillId} 已加载，Claude Code 将自动检测`
    };
  }

  async unloadSkill(skillId: string): Promise<UnloadResult> {
    const targetPath = path.join(this.claudeSkillsDir, skillId);
    
    try {
      const stat = await fs.lstat(targetPath);
      if (stat.isSymbolicLink()) {
        await fs.unlink(targetPath);
        this.loadedSkills.delete(skillId);
        return { status: 'unloaded', skillId };
      }
      return { status: 'not_symlink', skillId, message: '目标不是由本工具创建的' };
    } catch (e) {
      return { status: 'not_found', skillId };
    }
  }

  async listLoaded(): Promise<string[]> {
    await this.ensureDir();
    
    const entries = await fs.readdir(this.claudeSkillsDir, { withFileTypes: true });
    return entries
      .filter(e => e.isSymbolicLink() || e.isDirectory())
      .map(e => e.name);
  }
}
```

#### 4.2 安全检查
```typescript
// src/engine/security.ts
// 复用旧代码的安全验证逻辑

function validateSkillPath(sourcePath: string): ValidationResult {
  const absolutePath = path.resolve(sourcePath);
  
  // 检查路径遍历
  if (absolutePath.includes('..')) {
    return { valid: false, error: '路径包含 ..' };
  }
  
  // 检查是否在允许的目录内
  const allowedPrefixes = [
    process.cwd(),
    path.join(os.homedir(), '.claude'),
  ];
  
  const isAllowed = allowedPrefixes.some(prefix => 
    absolutePath.startsWith(prefix)
  );
  
  if (!isAllowed) {
    return { valid: false, error: '路径不在允许范围内' };
  }
  
  return { valid: true };
}
```

**交付物**:
- [ ] `src/engine/loader.ts` Symlink 管理器
- [ ] `src/engine/security.ts` 安全检查
- [ ] 加载/卸载逻辑测试

---

### Phase 5: MCP 工具实现 (Day 3)

#### 5.1 find_skills 工具
```typescript
// src/tools/find-skills.ts
import { z } from 'zod';
import { SkillSearchEngine } from '../engine/search';
import { detectIntent } from '../engine/intent';

export const findSkillsSchema = z.object({
  query: z.string().describe('任务描述或关键词'),
  limit: z.number().default(5).describe('返回结果数量'),
  category: z.string().optional().describe('限定分类'),
});

export async function findSkills(args: z.infer<typeof findSkillsSchema>) {
  const engine = new SkillSearchEngine();
  const intent = detectIntent(args.query);
  
  let results = engine.search(args.query, args.limit * 2);
  
  // 根据意图过滤
  if (intent !== 'unknown') {
    results = results.filter(r => 
      isIntentCompatible(r.skill, intent)
    );
  }
  
  // 根据分类过滤
  if (args.category) {
    results = results.filter(r => 
      r.skill.category === args.category
    );
  }
  
  return {
    intent,
    results: results.slice(0, args.limit).map(r => ({
      id: r.skill.id,
      name: r.skill.name,
      description: r.skill.description.slice(0, 200),
      category: r.skill.category,
      score: Math.round(r.score * 100) / 100,
      reason: r.reason
    }))
  };
}
```

#### 5.2 load_skills 工具
```typescript
// src/tools/load-skills.ts
import { z } from 'zod';
import { SkillLoader } from '../engine/loader';
import skills from '../data/skills.json';

export const loadSkillsSchema = z.object({
  skills: z.array(z.string()).describe('要加载的技能 ID 列表'),
});

export async function loadSkills(args: z.infer<typeof loadSkillsSchema>) {
  const loader = new SkillLoader();
  const results: LoadResult[] = [];
  
  for (const skillId of args.skills) {
    const skill = skills.find(s => s.id === skillId);
    
    if (!skill) {
      results.push({ 
        skillId, 
        status: 'not_found', 
        error: `技能 ${skillId} 不存在` 
      });
      continue;
    }
    
    const result = await loader.loadSkill(skillId, skill.path);
    results.push({ skillId, ...result });
  }
  
  const loaded = results.filter(r => r.status === 'loaded');
  const failed = results.filter(r => r.status !== 'loaded' && r.status !== 'already_loaded');
  
  return {
    success: failed.length === 0,
    loaded: loaded.map(r => r.skillId),
    already_loaded: results.filter(r => r.status === 'already_loaded').map(r => r.skillId),
    failed: failed,
    message: loaded.length > 0 
      ? `已加载 ${loaded.length} 个技能，Claude Code 将自动检测` 
      : '没有新技能被加载'
  };
}
```

#### 5.3 MCP Server 入口
```typescript
// src/index.ts
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { 
  CallToolRequestSchema, 
  ListToolsRequestSchema 
} from '@modelcontextprotocol/sdk/types.js';

import { findSkills, findSkillsSchema } from './tools/find-skills';
import { loadSkills, loadSkillsSchema } from './tools/load-skills';
import { unloadSkill, unloadSkillSchema } from './tools/unload-skill';
import { listSkills } from './tools/list-skills';

const server = new Server({
  name: 'skills-router',
  version: '1.0.0',
}, {
  capabilities: { tools: {} }
});

// 注册工具
server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    {
      name: 'find_skills',
      description: '根据任务描述智能推荐技能。当用户描述一个任务但你不确定需要什么专业技能时使用。',
      inputSchema: { type: 'object', properties: { 
        query: { type: 'string' }, 
        limit: { type: 'number', default: 5 } 
      }, required: ['query'] }
    },
    {
      name: 'load_skills',
      description: '动态加载技能到当前会话。加载后 Claude Code 会自动检测并启用。',
      inputSchema: { type: 'object', properties: {
        skills: { type: 'array', items: { type: 'string' } }
      }, required: ['skills'] }
    },
    {
      name: 'unload_skill',
      description: '卸载不再需要的技能，释放 context window。',
      inputSchema: { type: 'object', properties: {
        skill_id: { type: 'string' }
      }, required: ['skill_id'] }
    },
    {
      name: 'list_active_skills',
      description: '列出当前已加载的所有技能。',
      inputSchema: { type: 'object', properties: {} }
    }
  ]
}));

// 处理工具调用
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;
  
  switch (name) {
    case 'find_skills':
      return { content: [{ type: 'text', text: JSON.stringify(await findSkills(args)) }] };
    case 'load_skills':
      return { content: [{ type: 'text', text: JSON.stringify(await loadSkills(args)) }] };
    case 'unload_skill':
      return { content: [{ type: 'text', text: JSON.stringify(await unloadSkill(args)) }] };
    case 'list_active_skills':
      return { content: [{ type: 'text', text: JSON.stringify(await listSkills()) }] };
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
});

// 启动
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('Skills Router MCP Server started');
}

main().catch(console.error);
```

**交付物**:
- [ ] `src/tools/find-skills.ts`
- [ ] `src/tools/load-skills.ts`
- [ ] `src/tools/unload-skill.ts`
- [ ] `src/tools/list-skills.ts`
- [ ] `src/index.ts` MCP Server 入口
- [ ] 工具集成测试

---

### Phase 6: Plugin 打包与发布 (Day 4)

#### 6.1 Plugin 清单完善
```json
// plugin.json
{
  "name": "skills-router",
  "version": "1.0.0",
  "description": "智能技能发现与动态加载 - 从 241+ 技能中自动推荐最相关的能力",
  "author": "marovole",
  "repository": "https://github.com/PureVibeCoder/fastskills",
  "mcpServers": {
    "skills-router": {
      "command": "node",
      "args": ["dist/index.js"]
    }
  },
  "skills": [],
  "commands": {
    "/find-skill": {
      "description": "搜索技能",
      "handler": "find_skills"
    },
    "/load-skill": {
      "description": "加载技能",
      "handler": "load_skills"
    }
  }
}
```

#### 6.2 构建脚本
```json
// package.json scripts
{
  "scripts": {
    "build": "tsc",
    "generate-index": "tsx scripts/generate-index.ts",
    "prebuild": "npm run generate-index",
    "start": "node dist/index.js",
    "dev": "tsx watch src/index.ts",
    "package": "npm run build && npm pack"
  }
}
```

#### 6.3 发布到 Marketplace
```bash
# 本地测试
/plugin install ./packages/skills-router

# 发布到 GitHub
git tag skills-router-v1.0.0
git push --tags

# 用户安装
/plugin marketplace add PureVibeCoder/fastskills
/plugin install skills-router@fastskills
```

**交付物**:
- [ ] 完整的 `plugin.json`
- [ ] 构建和打包脚本
- [ ] README 文档
- [ ] 发布到 GitHub

---

### Phase 7: 测试与优化 (Day 4-5)

#### 7.1 测试用例
```typescript
// test/search.test.ts
describe('SkillSearchEngine', () => {
  it('should find scanpy for single-cell queries', () => {
    const results = engine.search('单细胞RNA分析');
    expect(results[0].skill.id).toBe('scanpy');
  });
  
  it('should find rdkit for chemistry queries', () => {
    const results = engine.search('分子对接 药物设计');
    expect(results.some(r => r.skill.id === 'rdkit')).toBe(true);
  });
  
  it('should respect category filter', () => {
    const results = engine.search('分析', { category: 'bioinformatics' });
    expect(results.every(r => r.skill.category === 'bioinformatics')).toBe(true);
  });
});
```

#### 7.2 性能优化
- [ ] 索引预热（启动时加载）
- [ ] 搜索结果缓存
- [ ] 大量技能时的分页

#### 7.3 用户体验优化
- [ ] 加载进度提示
- [ ] 技能冲突检测
- [ ] 卸载建议（长时间未使用的技能）

**交付物**:
- [ ] 完整测试套件
- [ ] 性能基准测试
- [ ] 用户文档

---

## 3. 风险与缓解

| 风险 | 概率 | 影响 | 缓解措施 |
|------|------|------|---------|
| Claude Code watcher 不检测 symlink | 低 | 高 | 使用复制代替 symlink |
| TF-IDF 准确度不足 | 中 | 中 | 增加触发词权重，结合意图 |
| Plugin 审核延迟 | 中 | 低 | 先支持本地安装 |
| 大量技能时搜索慢 | 低 | 中 | 预计算索引，分类缓存 |

---

## 4. 里程碑

| 阶段 | 预计完成 | 交付物 |
|------|---------|--------|
| Phase 1-2 | Day 1 | 基础设施 + 索引生成 |
| Phase 3-4 | Day 2-3 | 搜索引擎 + 热加载器 |
| Phase 5 | Day 3 | MCP 工具完成 |
| Phase 6 | Day 4 | Plugin 打包发布 |
| Phase 7 | Day 5 | 测试优化完成 |

---

## 5. 后续迭代

### v1.1 计划
- [ ] 向量搜索升级（sqlite-vec）
- [ ] 技能使用统计
- [ ] 个性化推荐（基于历史）

### v1.2 计划
- [ ] 技能依赖管理
- [ ] 技能组合推荐
- [ ] 在线更新技能索引

---

## 6. 快速开始命令

```bash
# 创建包目录
mkdir -p packages/skills-router/src/{tools,engine,data}
mkdir -p packages/skills-router/scripts

# 初始化
cd packages/skills-router
pnpm init
pnpm add @modelcontextprotocol/sdk natural glob gray-matter zod
pnpm add -D typescript tsx @types/node

# 开发
pnpm dev

# 测试
/plugin install ../packages/skills-router
```

---

**计划状态**: 待执行  
**下一步**: 运行 `/start-work` 开始实现
