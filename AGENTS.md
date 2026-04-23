# AGENTS.md

**Generated:** 2026-01-19 | **Commit:** 74996e8 | **Branch:** main

## OVERVIEW

FastSkills: Claude Code skills aggregation platform (265+ skills from 14+ sources) with intelligent routing. Core product is the Router (`skills/fastskills-router/SKILL.md`) that auto-detects user intent and loads relevant skills.

## STRUCTURE

```
fastskills/
├── packages/website/          # Astro marketplace (see packages/website/AGENTS.md)
├── skills/fastskills-router/  # Core product - Intelligent Router
├── purevibecoder-skills/      # Original skills (frontend-designer, dan-koe-writing)
├── hooks/                     # Claude Code session-start auto-injection
├── .claude-plugin/            # Plugin marketplace manifests
└── *-skills/                  # 14+ git submodules (content sources)
```

## WHERE TO LOOK

| Task | Location | Notes |
|------|----------|-------|
| Add new skill | See "Adding New Skills" below | 3-file sync required |
| Fix website UI | `packages/website/src/components/` | Astro components |
| Update routing | `skills/fastskills-router/SKILL.md` | ROUTES TABLE section |
| Security audit | `packages/website/src/utils/security-scanner.ts` | Regex patterns |
| Build/deploy | `packages/website/` | `pnpm build` triggers injection |

## SKILL CONTENT INJECTION

```
SKILL.md files (submodules) 
    ↓ inject-skill-content.mjs (build-time)
    ↓ public/data/skills-content.json (~2.7MB)
    ↓ Astro pages render content
```

**CRITICAL**: `content` fields in `skills.ts` are intentionally empty - auto-filled during build.

## ADDING NEW SKILLS (3-File Sync)

### 1. `packages/website/src/data/skill-sources.ts`
```typescript
'new-skill-id': { source: 'source-name', path: 'skill-folder' },
```

### 2. `packages/website/src/data/skills.ts`
```typescript
{
  id: 'new-skill-id',
  name: '技能名称',
  description: '技能描述',
  category: categories[categoryIndex['category-name'] ?? 0],
  source: 'source-name',
  triggers: ['关键词1', 'keyword2'],
  priority: N,
  content: ''  // Keep empty - auto-filled
}
```

### 3. `skills/fastskills-router/SKILL.md`
Add to ROUTES TABLE:
```
| Priority | ID | Keywords | Load Skills |
| N | new-route | 关键词, keywords | new-skill-id |
```

## COMMANDS

```bash
# Development
pnpm install && pnpm dev       # Start dev server (localhost:4321)
pnpm build                     # Build + content injection
pnpm typecheck                 # TypeScript check
pnpm --filter website test     # Run tests

# Deployment
cd packages/website && pnpm build && wrangler pages deploy dist --project-name=fastskills --commit-dirty=true
```

## ANTI-PATTERNS (FORBIDDEN)

| Pattern | Why |
|---------|-----|
| Manually fill `content` in `skills.ts` | Auto-cleared by build script |
| `eval()`, `shell=True` in skills | Security scanner will flag |
| Skip security audit for new skills | Score <60 = DO NOT include |
| Edit without submodule init | `git submodule update --init --recursive` first |
| Use `JSON.stringify()` in voltagent | Use `safeStringify` from `@voltagent/internal` |

## SECURITY AUDIT (Mandatory for New Skills)

```typescript
import { scanSkillSecurity } from './utils/security-scanner';
const result = await scanSkillSecurity(skillContent, skillId);
// Score >= 80: Safe | 60-79: Review | <60: REJECT
```

**Critical patterns detected**: `eval()`, `shell=True`, `../`, internal IPs, `pickle.load`, `dangerouslySetInnerHTML`

## CONVENTIONS

- **TypeScript**: Strict mode, no explicit `any` (warn level)
- **Formatting**: Prettier - `trailingComma: "none"`, `printWidth: 100`, `singleQuote: true`
- **Files**: kebab-case (`.ts`), PascalCase (`.astro`)
- **Unused vars**: Prefix with `_` to pass linting
- **Chinese UI**: Interface text is Chinese; code comments mixed

## GOTCHAS

1. **Submodules**: Clone with `--recursive` or run `git submodule update --init --recursive`
2. **Large file**: `skills.ts` is 85k+ lines - use grep/offset, never read whole file
3. **Monorepo**: Use `pnpm --filter website` from root
4. **Em dash bug**: Avoid `—` (em dash) in files - may crash Claude Code CLI

## VALIDATION BEFORE COMMITTING

```bash
pnpm typecheck  # No TS errors
pnpm lint       # No ESLint errors  
pnpm test       # All tests pass
pnpm build      # Build succeeds + content injection works
```

## HIERARCHY

```
./AGENTS.md (this file)
└── packages/website/AGENTS.md
```
