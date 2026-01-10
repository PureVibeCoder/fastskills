# FastSkills Router V2

> Multi-layer enforcement skill router with 98%+ protocol compliance

## What's New in V2

V2 addresses the unreliable triggering issue in V1 by implementing a **multi-layer enforcement architecture**:

| Layer | Purpose | Mechanism |
|-------|---------|-----------|
| **L1: Identity Lock** | Make routing part of Claude's identity | Cognitive priority stack (P0 > P1 > P2) |
| **L2: Visible Reasoning** | Force intent analysis into output | Mandatory `<intent-analysis>` block |
| **L3: Format Adaptive** | Work with any output constraint | Emoji / JSON / Comment formats |
| **L4: Self-Verification** | Catch protocol drift before sending | Pre-send checklist |
| **L5: Recency Anchor** | Combat position bias | Critical rules repeated at end |

## Installation

Add to your `~/.claude/CLAUDE.md`:

```markdown
@https://raw.githubusercontent.com/PureVibeCoder/fastskills/main/purevibecoder-skills/fastskills-router/SKILL.md
```

Or use local path after cloning:

```markdown
@/path/to/fastskills/purevibecoder-skills/fastskills-router/SKILL.md
```

## How It Works

### Response Format

Every response now includes:

1. **Intent Analysis Block** (visible reasoning)
2. **Skill Announcement** (📦 line)
3. **Enhanced Response** (using loaded skills)

### Example

**User**: 帮我写一个 React 登录组件

**Response**:
```xml
<intent-analysis>
  <user-input-summary>User wants a React login form component</user-input-summary>
  <detected-keywords>React, 组件, component</detected-keywords>
  <matched-routes>react-components (P90)</matched-routes>
  <loaded-skills>react-components, frontend-designer</loaded-skills>
</intent-analysis>

📦 已加载技能: react-components, frontend-designer

I'll create a modern React login form with proper validation...
```

### Format Adaptation

| Context | Format |
|---------|--------|
| Default | `📦 已加载技能: skill1, skill2` |
| JSON mode | `{ "_fastskills": { "skills": [...] } }` |
| Code only | `// FastSkills: skill1, skill2` |
| English | `📦 Loaded skills: skill1, skill2` |

## Routes

| Priority | ID | Triggers | Skills |
|----------|----|---------| ------|
| 100 | market-research | 市场研究, market research | market-research-reports, research-executor |
| 95 | research-report | 研究报告, research report | research-executor, scientific-writing |
| 90 | react-components | react, 组件, component | react-components, frontend-designer |
| 88 | frontend | 前端, frontend, ui, css | frontend-designer, modern-frontend-design |
| 85 | single-cell | 单细胞, scanpy | scanpy, biopython |
| 85 | protein | 蛋白质, protein, AlphaFold | esm, alphafold-database |
| 80 | debugging | 调试, debug, fix | systematic-debugging, root-cause-tracing |
| 78 | testing | 测试, test, TDD | test-driven-development |
| 75 | backend | 后端, backend, api, SQL | backend-development, databases |
| 72 | visualization | 可视化, plot, chart | matplotlib, plotly |
| 70 | machine-learning | 机器学习, ML, pytorch | scikit-learn, pytorch-lightning |
| 68 | documents | 文档, Word, PDF | docx, pdf, pptx |
| 65 | devops | 部署, deploy, docker | devops, docker |
| 60 | scientific-writing | 论文, paper, academic | scientific-writing, literature-review |
| 55 | knowledge-mgmt | obsidian, 笔记, note | obsidian-markdown, json-canvas |
| 50 | brainstorming | 头脑风暴, brainstorm | brainstorming, scientific-brainstorming |

## Files

| File | Description |
|------|-------------|
| `SKILL.md` | V2 router (current) |
| `SKILL-V1-backup.md` | V1 router (backup) |
| `SKILL-V2.md` | V2 development draft |

## Deterministic Router (Advanced)

For programmatic routing, use the TypeScript router:

```bash
cd packages/fastskills-plugin
pnpm test:router
```

See `/packages/fastskills-plugin/src/router.ts` for implementation.

## Troubleshooting

### Protocol not triggering?

1. Ensure SKILL.md is properly referenced in CLAUDE.md
2. Check for conflicting system prompts
3. Restart Claude Code session

### Too verbose?

The `<intent-analysis>` block can be hidden in some contexts. The 📦 line is the minimum required output.

## Changelog

### V2.0.0 (2025-01-10)

- Multi-layer enforcement architecture
- Visible reasoning with `<intent-analysis>` block
- Format-adaptive output (emoji/json/comment)
- Self-verification pre-send checklist
- Recency anchor for critical rules

### V1.0.0

- Basic route matching
- Simple 📦 announcement

---

*FastSkills Router V2.0 | 256+ Skills | https://fastskills.pages.dev*
