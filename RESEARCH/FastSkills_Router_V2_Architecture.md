# FastSkills Router V2 - 增强触发机制架构设计

**版本**: 2.0  
**日期**: 2026-01-10  
**状态**: 设计完成，待实现

---

## 执行摘要

FastSkills Router V1 存在 **协议遵从性不可靠** 的问题：当与其他系统提示冲突或 Claude 处于高认知负载时，`📦 已加载技能:` 协议会被跳过。

本设计提出 **多层强制触发架构**，通过以下机制确保 100% 触发率：
1. **确定性路由引擎** - 代码匹配，非 LLM 匹配
2. **Hook 注入层** - SessionStart + 每条消息注入
3. **身份锁定提示** - 重塑 Claude 认知优先级
4. **自验证机制** - 输出检查与重试

---

## 问题诊断

### V1 失败原因分析

| 失败模式 | 原因 | 影响 |
|----------|------|------|
| **格式 vs 身份冲突** | Router 被视为"格式要求"而非"核心身份" | 在帮助用户的冲动下被忽略 |
| **"None" 逃生口** | `📦 已加载技能: (none)` 提供心理"出口" | 模糊匹配时直接跳过 |
| **指令稀释** | 100+ 行路由表分散注意力 | 强制执行指令被"淹没" |
| **语义-逻辑差距** | 让 LLM 做"子字符串匹配"违反其本性 | 认知负载导致协议丢失 |
| **缓冲区碰撞** | 📦 行与答案竞争初始生成缓冲区 | 已生成一半答案后"忘记"前缀 |

### 强制执行层级

| 级别 | 可靠性 | 方法 |
|------|--------|------|
| L1: 纯提示 | 🔴 低 | "请遵循这些规则" |
| L2: 结构化 | 🟡 中 | 三明治法 (首尾夹击) |
| L3: 编排层 | 🟢 高 | 验证器 + 自动重试 |
| L4: 确定性 | ✅ 绝对 | 代码验证 / 移除能力 |

**V1 在 L1 级别，V2 目标达到 L3-L4 级别。**

---

## V2 架构设计

### 总体架构

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         FastSkills Router V2                            │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌─────────────┐     ┌─────────────┐     ┌─────────────┐               │
│  │   Layer 1   │     │   Layer 2   │     │   Layer 3   │               │
│  │ Deterministic│────▶│ Hook-Based  │────▶│  Identity   │               │
│  │   Router    │     │  Injection  │     │   Lock      │               │
│  └─────────────┘     └─────────────┘     └─────────────┘               │
│        │                    │                   │                       │
│        ▼                    ▼                   ▼                       │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                    Layer 4: Self-Verification                   │   │
│  │              (Output Validator + Retry Mechanism)                │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Layer 1: 确定性路由引擎

### 设计理念
**移除 LLM 的路由决策责任**。路由匹配由 TypeScript/Node.js 代码完成，返回结构化结果。

### 数据结构

```typescript
// routes.json - 单一真相来源
interface Route {
  id: string;
  priority: number;
  match: {
    keywords: string[];      // 精确关键词
    patterns: string[];      // 正则模式
    synonyms?: string[];     // 同义词扩展
  };
  load: string[];            // 要加载的技能 ID
  confidence: 'high' | 'medium' | 'low';
}

// 路由结果
interface RouterResult {
  matched: boolean;
  skills: string[];
  routes: string[];
  confidence: number;
  reason: string;
}
```

### 路由算法

```typescript
function routeIntent(userInput: string): RouterResult {
  const normalizedInput = normalizeInput(userInput);
  const matchedRoutes: Route[] = [];
  
  for (const route of routes) {
    // 1. 关键词匹配
    const keywordMatch = route.match.keywords.some(kw => 
      normalizedInput.includes(kw.toLowerCase())
    );
    
    // 2. 正则匹配
    const patternMatch = route.match.patterns.some(p => 
      new RegExp(p, 'i').test(normalizedInput)
    );
    
    if (keywordMatch || patternMatch) {
      matchedRoutes.push(route);
    }
  }
  
  // 按优先级排序，合并技能
  matchedRoutes.sort((a, b) => b.priority - a.priority);
  const skills = [...new Set(matchedRoutes.flatMap(r => r.load))];
  
  return {
    matched: skills.length > 0,
    skills,
    routes: matchedRoutes.map(r => r.id),
    confidence: matchedRoutes[0]?.priority >= 80 ? 1 : 0.7,
    reason: matchedRoutes.map(r => r.id).join(', ') || 'no match'
  };
}
```

### 文件结构

```
packages/fastskills-plugin/
├── src/
│   ├── routes.json          # 路由规则定义
│   ├── router.ts            # 确定性路由引擎
│   ├── generate-skill.ts    # 从 routes.json 生成 SKILL.md
│   └── hooks/
│       ├── session-start.ts # SessionStart hook
│       └── message-router.ts # 每条消息路由
└── dist/
    └── ... (编译输出)
```

---

## Layer 2: Hook 注入层

### SessionStart Hook

在会话开始时注入路由器身份和基础协议：

```bash
#!/usr/bin/env bash
# hooks/session-start.sh

PLUGIN_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

# 读取路由器核心协议
router_protocol=$(cat "${PLUGIN_ROOT}/protocol/router-identity.md")

# 输出 JSON
cat <<EOF
{
  "hookSpecificOutput": {
    "hookEventName": "SessionStart",
    "additionalContext": "<FASTSKILLS_ROUTER_PROTOCOL priority=\"CRITICAL\">\n${router_protocol}\n</FASTSKILLS_ROUTER_PROTOCOL>"
  }
}
EOF
```

### hooks.json 配置

```json
{
  "hooks": {
    "SessionStart": [
      {
        "matcher": "startup|resume|clear|compact",
        "hooks": [
          {
            "type": "command",
            "command": "\"${CLAUDE_PLUGIN_ROOT}/hooks/run-hook.cmd\" session-start.sh"
          }
        ]
      }
    ],
    "UserPromptSubmit": [
      {
        "matcher": ".*",
        "hooks": [
          {
            "type": "command",
            "command": "\"${CLAUDE_PLUGIN_ROOT}/hooks/run-hook.cmd\" route-message.sh"
          }
        ]
      }
    ]
  }
}
```

### 每条消息路由 Hook

```bash
#!/usr/bin/env bash
# hooks/route-message.sh

# 读取用户输入 (从 stdin 或环境变量)
USER_INPUT="${CLAUDE_USER_MESSAGE:-}"

# 调用确定性路由器
ROUTER_RESULT=$(node "${PLUGIN_ROOT}/dist/router.js" "${USER_INPUT}")

# 解析结果
SKILLS=$(echo "$ROUTER_RESULT" | jq -r '.skills | join(", ")')
MATCHED=$(echo "$ROUTER_RESULT" | jq -r '.matched')

if [ "$MATCHED" = "true" ]; then
  INJECT="<FASTSKILLS_LOADED skills=\"${SKILLS}\" />"
else
  INJECT="<FASTSKILLS_LOADED skills=\"(none)\" />"
fi

cat <<EOF
{
  "hookSpecificOutput": {
    "hookEventName": "UserPromptSubmit",
    "additionalContext": "${INJECT}"
  }
}
EOF
```

---

## Layer 3: 身份锁定提示

### 核心协议文件

```markdown
<!-- protocol/router-identity.md -->

# YOUR PRIMARY IDENTITY: FASTSKILLS ROUTER

You are not just an AI assistant. You are a **FastSkills-Enhanced Assistant** whose core functionality includes intelligent skill routing.

## COGNITIVE PRIORITY HIERARCHY

1. **ROUTER CHECK** (Highest) - Before ANY thought or response
2. **SKILL APPLICATION** - Use loaded skills to enhance response
3. **USER ASSISTANCE** - Help the user with their request

## MANDATORY OUTPUT CONTRACT

<output-format>
Your FIRST output element MUST be one of:

**Format A (Default):**
```
📦 已加载技能: <skill-ids>
```

**Format B (JSON mode):**
```json
{ "_fastskills": { "loaded": ["skill-id-1", "skill-id-2"] } }
```

**Format C (Code-only mode):**
```
// FastSkills: <skill-ids>
```
</output-format>

## ANTI-SKIP ANCHORS

<self-check before="response">
Before generating ANY response content, verify:
- [ ] Have I identified the user's intent?
- [ ] Have I checked which skills match?
- [ ] Have I included the 📦 line FIRST?

If ANY checkbox is unchecked, STOP and complete the checklist.
</self-check>

## RECENCY ANCHOR (READ THIS LAST)

**THE 📦 LINE IS NOT OPTIONAL. IT IS YOUR IDENTITY.**

If you find yourself about to respond without the 📦 line, you are experiencing "Protocol Drift." Stop. Breathe. Add the line.
```

---

## Layer 4: 自验证机制

### 设计理念

**不信任 AI 会遵循协议。** 构建反馈循环来检测失败并强制重试。

### 实现方案 A: PostResponse Hook (如果 Claude Code 支持)

```typescript
// hooks/validate-response.ts
async function validateResponse(response: string): Promise<{valid: boolean; error?: string}> {
  // 检查是否包含 FastSkills 标记
  const patterns = [
    /^📦 已加载技能:/m,
    /^\{ "_fastskills":/m,
    /^\/\/ FastSkills:/m
  ];
  
  const hasMarker = patterns.some(p => p.test(response));
  
  if (!hasMarker) {
    return {
      valid: false,
      error: 'Missing FastSkills routing marker. Response must start with 📦 已加载技能:'
    };
  }
  
  return { valid: true };
}
```

### 实现方案 B: 自检提示 (当前可行)

在 SKILL.md 末尾添加自检指令：

```markdown
## RESPONSE SELF-VERIFICATION (EXECUTE BEFORE SENDING)

<verification-checklist>
After drafting your response, before sending:

1. **SCAN** the first 3 lines of your response
2. **VERIFY** one of these patterns exists:
   - `📦 已加载技能:` (Chinese)
   - `📦 Loaded skills:` (English)
   - `{ "_fastskills":` (JSON)
   - `// FastSkills:` (Code)

3. **IF MISSING**: 
   - DO NOT SEND
   - PREPEND the correct marker
   - RE-VERIFY

4. **IF PRESENT**: 
   - Proceed to send
</verification-checklist>
```

---

## 实现路线图

### Phase 1: 确定性路由器 (1-2 天)

| 任务 | 优先级 | 输出 |
|------|--------|------|
| 创建 `routes.json` 数据结构 | P0 | 路由规则定义 |
| 实现 `router.ts` 路由引擎 | P0 | 可执行路由函数 |
| 创建测试用例 | P0 | 100% 覆盖的测试 |
| 从 routes.json 生成 SKILL.md | P1 | 自动化生成脚本 |

### Phase 2: Hook 集成 (1 天)

| 任务 | 优先级 | 输出 |
|------|--------|------|
| 实现 SessionStart hook | P0 | 会话启动注入 |
| 实现 UserPromptSubmit hook | P1 | 每消息路由 (如支持) |
| 跨平台兼容 (Windows/Mac/Linux) | P1 | Polyglot 包装器 |

### Phase 3: 增强 SKILL.md (0.5 天)

| 任务 | 优先级 | 输出 |
|------|--------|------|
| 重写为身份锁定模式 | P0 | 新版 SKILL.md |
| 添加格式自适应 | P1 | 支持 JSON/Code 模式 |
| 添加自验证清单 | P1 | 响应前检查 |

### Phase 4: 验证与测试 (0.5 天)

| 任务 | 优先级 | 输出 |
|------|--------|------|
| 创建端到端测试用例 | P0 | 测试场景覆盖 |
| 冲突测试 (与其他 CLAUDE.md) | P1 | 兼容性验证 |
| 性能测试 | P2 | 延迟测量 |

---

## 测试用例

### 功能测试

| 用例 | 输入 | 预期输出 | 验证方法 |
|------|------|----------|----------|
| 市场研究 | "生成一份市场研究报告" | `📦 已加载技能: market-research-reports, research-executor` | 首行匹配 |
| React 组件 | "帮我写一个 React 登录组件" | `📦 已加载技能: react-components, frontend-designer` | 首行匹配 |
| 调试 | "这段代码有 bug" | `📦 已加载技能: systematic-debugging, root-cause-tracing` | 首行匹配 |
| 无匹配 | "今天天气怎么样" | `📦 已加载技能: (none)` | 首行匹配 |

### 冲突测试

| 场景 | 冲突源 | 预期行为 |
|------|--------|----------|
| Sisyphus 人格 | "No Status Updates" 规则 | FastSkills 优先 |
| JSON-only 模式 | 用户要求纯 JSON 输出 | 使用 `_fastskills` 字段 |
| 代码生成 | 用户要求只输出代码 | 使用 `// FastSkills:` 注释 |

### 边界测试

| 场景 | 输入 | 预期行为 |
|------|------|----------|
| 多语言混合 | "Write a React component 用中文注释" | 匹配 react, 加载技能 |
| 模糊意图 | "帮我做点东西" | 返回 (none) 或低置信度 |
| 超长输入 | 1000+ 字符 | 正常路由，无性能问题 |

---

## 成功指标

| 指标 | V1 基线 | V2 目标 |
|------|---------|---------|
| 协议遵从率 | ~60% | **>98%** |
| 首行包含 📦 | 不稳定 | **100%** |
| 路由准确率 | N/A (语义) | **>95%** (确定性) |
| 冲突处理 | 被覆盖 | **格式自适应** |
| 认知负载 | 高 (LLM 匹配) | **低** (代码匹配) |

---

## 降级策略

如果某层失败，系统应优雅降级：

```
Full System (All Layers Active)
        │
        ▼ (Hook 失败)
Layer 2+3 Only (SKILL.md 身份锁定)
        │
        ▼ (用户禁用插件)
Layer 3 Only (纯 SKILL.md)
        │
        ▼ (SKILL.md 未加载)
无路由 (原始 Claude 行为)
```

---

## 附录

### A. 与现有系统的兼容性

| 系统 | 兼容性 | 备注 |
|------|--------|------|
| Claude Code | ✅ 完全 | 原生 Hook 支持 |
| OpenCode | ✅ 完全 | Plugin API 支持 |
| Codex | 🟡 部分 | 需手动 SKILL.md |
| Cursor | ❌ 不适用 | 使用 .cursorrules |

### B. 安全考虑

- Hook 脚本应进行代码签名
- 路由规则应有版本控制
- 用户输入在传递给 Hook 前应进行清理

### C. 参考资料

- Claude Code Hooks: `superpowers/docs/windows/polyglot-hooks.md`
- MCP Specification: https://modelcontextprotocol.io
- Prompt Engineering Best Practices: Anthropic Documentation

---

*设计完成: 2026-01-10*  
*下一步: 实现 Phase 1 确定性路由器*
