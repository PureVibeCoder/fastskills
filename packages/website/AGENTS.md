# packages/website/AGENTS.md

Astro 5.x marketplace for FastSkills. Cloudflare Pages deployment.

## STRUCTURE

```
src/
├── components/    # Astro components (PascalCase.astro)
├── data/          # Skills registry, categories, repo-config
├── pages/         # Routes + API endpoints
├── utils/         # packager.ts, security-scanner.ts
└── styles/        # global.css (CSS variables)
public/data/       # skills-content.json (generated)
scripts/           # inject-skill-content.mjs
```

## WHERE TO LOOK

| Task | Location |
|------|----------|
| Fix component styling | `src/components/*.astro` |
| Add skill metadata | `src/data/skills.ts` (metadata only, content empty) |
| Map skill paths | `src/data/skill-sources.ts` |
| Add skill source repo | `src/data/repo-config.ts` |
| Security patterns | `src/utils/security-scanner.ts` |
| Download/ZIP logic | `src/utils/packager.ts` |

## KEY FILES (Complexity Hotspots)

| File | Lines | Notes |
|------|-------|-------|
| `src/data/skills.ts` | 85k+ | NEVER read whole file. Use grep/offset. |
| `src/pages/index.astro` | 800+ | Main orchestration. Modify components instead. |
| `src/utils/security-scanner.ts` | 380+ | Critical regex patterns. Run tests after changes. |
| `src/utils/packager.ts` | 300+ | JSZip client-side bundling. |

## DATA FLOW

```
repo-config.ts → skill-sources.ts → skills.ts (metadata)
                                         ↓
inject-skill-content.mjs → skills-content.json → [id].astro pages
```

## COMMANDS

```bash
pnpm dev          # Dev server (localhost:4321)
pnpm build        # Build + content injection
pnpm test         # Vitest
pnpm typecheck    # tsc --noEmit
pnpm lint         # ESLint
```

## CONVENTIONS (Website-Specific)

- **Components**: Use scoped `<style>` tags with CSS variables from `global.css`
- **Props**: Define `interface Props` in frontmatter
- **Tests**: `src/**/__tests__/*.test.ts` with Vitest + happy-dom
- **API routes**: `src/pages/api/*.ts`

## ANTI-PATTERNS

| Forbidden | Alternative |
|-----------|-------------|
| Read entire `skills.ts` | Use grep or line offset |
| Hardcode colors in components | Use `var(--color-*)` from global.css |
| Edit Layout.astro lint rules | It's excluded from ESLint intentionally |
| Manual content in skills.ts | Let build script inject from SKILL.md |

## TESTING

```bash
pnpm vitest run src/utils/__tests__/packager.test.ts  # Single test
pnpm vitest run --testNamePattern="filterSkillsForPack"  # Pattern match
```

## CSS DESIGN SYSTEM

```css
--color-primary: #22C55E;     /* Mint green */
--color-secondary: #06B6D4;   /* Cyan */
--color-bg: #FAFAFA;          /* Light background */
--color-text: #1A1A1A;        /* Dark text */
--color-border: #E5E7EB;      /* Border */
```
