# AGENTS.md

This file provides guidance to AI coding agents working in this repository.

## Project Overview

**Skills Controller** is a Claude Code skills aggregation platform built with Astro. It collects 241+ skills from 10+ GitHub open-source projects and packages them into 21 scenario-based skill packs for developers and researchers.

### Repository Structure

```
skillscontroller/
├── packages/website/          # Main Astro website (primary codebase)
│   ├── src/
│   │   ├── components/        # Astro components (.astro)
│   │   ├── data/              # TypeScript data files (skills, categories)
│   │   ├── layouts/           # Page layouts
│   │   ├── pages/             # Page routes and API endpoints
│   │   ├── styles/            # Global CSS
│   │   └── utils/             # TypeScript utilities
│   └── public/                # Static assets
├── anthropic-skills/          # Git submodule - Anthropic official skills
├── awesome-claude-skills/     # Git submodule - Community skills
├── claudekit-skills/          # Git submodule - ClaudeKit skills
├── scientific-skills/         # Git submodule - 138+ scientific skills
├── voltagent-skills/          # Git submodule - VoltAgent AI framework
├── obsidian-skills/           # Git submodule - Knowledge management
└── deep-research-skills/      # Git submodule - Research framework
```

## Build/Lint/Test Commands

### From Repository Root

```bash
pnpm install              # Install all dependencies
pnpm dev                  # Start dev server (http://localhost:4321)
pnpm build                # Build for production
pnpm preview              # Preview production build
pnpm typecheck            # Run TypeScript type checking
```

### From packages/website Directory

```bash
pnpm dev                  # Start Astro dev server
pnpm build                # Build static site
pnpm preview              # Preview build
pnpm typecheck            # TypeScript checking (tsc --noEmit)
pnpm test                 # Run all tests (vitest run)
pnpm test:watch           # Run tests in watch mode
pnpm test:ui              # Run tests with UI
pnpm lint                 # ESLint check
pnpm lint:fix             # ESLint auto-fix
pnpm format               # Prettier format
pnpm format:check         # Prettier check
```

### Running a Single Test

```bash
# From packages/website
pnpm vitest run src/utils/__tests__/packager.test.ts
pnpm vitest run --testNamePattern="filterSkillsForPack"
```

## Code Style Guidelines

### TypeScript

- **Strict mode**: Uses `astro/tsconfigs/strict`
- **No explicit any**: `@typescript-eslint/no-explicit-any` is set to `warn`
- **Unused vars**: Use `_` prefix for intentionally unused parameters
- **ES modules**: All files use ES module syntax (`import`/`export`)

### Formatting (Prettier)

```json
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "none",
  "printWidth": 100
}
```

### Import Order

1. External packages (npm modules)
2. Internal absolute imports
3. Relative imports
4. Type imports last (using `import type`)

```typescript
// Example
import JSZip from 'jszip';
import type { Skill } from '../data/skills';
import { SKILL_TO_SOURCE } from '../data/skill-sources';
```

### Naming Conventions

| Element | Convention | Example |
|---------|------------|---------|
| Files (TypeScript) | kebab-case | `skill-sources.ts` |
| Files (Components) | PascalCase | `SkillCard.astro` |
| Interfaces/Types | PascalCase | `interface Skill {}` |
| Functions | camelCase | `filterSkillsForPack()` |
| Constants | SCREAMING_SNAKE_CASE | `SKILL_TO_SOURCE` |
| CSS variables | kebab-case with prefix | `--color-text-secondary` |

### Astro Components

- Use frontmatter (`---`) for TypeScript logic
- Define `Props` interface for component props
- Use scoped `<style>` tags for component CSS
- Use CSS variables from global styles

```astro
---
import type { Skill } from '../data/skills';

interface Props {
  skill: Skill;
}

const { skill } = Astro.props;
---

<div class="skill-card">
  <h3>{skill.name}</h3>
</div>

<style>
  .skill-card {
    padding: var(--spacing-md);
  }
</style>
```

### Test Files

- Location: `src/**/__tests__/*.test.ts`
- Framework: Vitest with happy-dom environment
- Use `describe`/`it`/`expect` from vitest
- Create mock helpers for complex types

```typescript
import { describe, it, expect } from 'vitest';

describe('functionName', () => {
  it('describes expected behavior', () => {
    expect(result).toBe(expected);
  });
});
```

### Error Handling

- Use try/catch with specific error handling
- Log errors with `console.warn` or `console.error`
- Provide fallback values when possible

```typescript
try {
  const response = await fetch(apiUrl);
  if (response.ok) {
    return await response.text();
  }
} catch (error) {
  console.warn(`[packager] Failed to fetch:`, error);
}
return null;
```

## Important Patterns

### Data Types

The core data types are in `src/data/`:

```typescript
// skills.ts
interface Skill {
  id: string;
  name: string;
  description: string;
  category: Category;
  source: 'anthropic' | 'claudekit' | 'scientific' | 'community' | ...;
  triggers: string[];
  priority: number;
  content: string;
}

// categories.ts
interface Category {
  id: string;
  name: string;
  nameEn: string;
  description: string;
  icon: string;
}
```

### Async Patterns

- Use `async/await` syntax
- Use `Promise.all` for parallel operations
- Arrow functions for callbacks

```typescript
const results = await Promise.all(
  items.map(async (item) => {
    const content = await fetchContent(item);
    return { id: item.id, content };
  })
);
```

## Deployment

- **Platform**: Cloudflare Pages
- **Build command**: `pnpm build`
- **Output directory**: `packages/website/dist`
- **Node version**: 20
- **pnpm version**: 8

## Gotchas

1. **Submodules**: This repo uses git submodules. Clone with `--recursive`
2. **Monorepo**: Commands from root use `pnpm --filter website`
3. **API routes**: Located in `src/pages/api/` with `.ts` extension
4. **Chinese content**: UI text is in Chinese; code comments may be mixed
5. **Layout ignored**: `src/layouts/Layout.astro` is excluded from ESLint

## Validation Before Committing

1. Run `pnpm typecheck` - ensure no TypeScript errors
2. Run `pnpm lint` - ensure no ESLint errors
3. Run `pnpm test` - ensure all tests pass
4. Run `pnpm build` - ensure build succeeds

---

## 🛡️ Security Audit for New Skills

**CRITICAL**: Before adding any new skill or skill source to this project, you MUST perform a security audit.

### Security Audit Workflow

When adding new skills (e.g., new git submodule, new skill files):

1. **Run the security scanner** on all new skill files:
   ```typescript
   // Use packages/website/src/utils/security-scanner.ts
   import { scanSkillSecurity } from './utils/security-scanner';
   const result = await scanSkillSecurity(skillContent, skillId);
   ```

2. **Check for these critical vulnerabilities**:
   - 🔴 **Code Injection**: `eval()`, `Function()`, `new Function()`
   - 🔴 **Command Injection**: `shell=True`, `shell: true`, `child_process.exec()`
   - 🔴 **Path Traversal**: `../`, `..\\`, URL-encoded variants
   - 🔴 **SSRF**: Internal IP addresses (127.0.0.1, 10.x.x.x, 192.168.x.x)
   - 🔴 **Unsafe Deserialization**: `pickle.load()`, `yaml.load()` without SafeLoader
   - 🔴 **XSS**: `dangerouslySetInnerHTML`, `innerHTML` assignments
   - 🟡 **Hardcoded Secrets**: API keys, passwords, tokens

3. **Review the security score**:
   - Score ≥ 80: Safe to include
   - Score 60-79: Review findings carefully
   - Score < 60: DO NOT include without fixing issues

4. **Document any exceptions**:
   If a skill has legitimate use of flagged patterns, document why it's safe in the PR description.

### Example Security Audit Command

```bash
# From packages/website directory
pnpm test -- --grep "security"

# Or manually check a skill file
grep -E "(eval\(|shell=True|shell:\s*true|\.\./|pickle\.load)" path/to/skill/SKILL.md
```

### Historical Vulnerabilities Fixed

| Date | Vulnerability | File | Fix |
|------|--------------|------|-----|
| 2024-01 | Path Traversal | `skill-content.ts` | Added `sanitizeSkillPath()` |
| 2024-01 | eval() Injection | `calculator.ts` | Safe math parser |
| 2024-01 | shell=True | `with_server.py` (3 files) | `shlex.split()` |

### Security Scanner Patterns

The security scanner (`packages/website/src/utils/security-scanner.ts`) detects:

| Pattern | Severity | Description |
|---------|----------|-------------|
| `eval(`, `Function(` | Critical | Arbitrary code execution |
| `shell=True`, `shell: true` | Critical | Command injection |
| `../`, `%2e%2e` | Critical | Path traversal |
| `127.0.0.1`, `10.`, `192.168.` | High | SSRF to internal networks |
| `pickle.load`, `yaml.load` | High | Unsafe deserialization |
| `dangerouslySetInnerHTML` | High | XSS vulnerability |
| API keys, passwords | Medium | Hardcoded secrets |

### Security-Related PRs

When submitting PRs that add new skills:
- [ ] Run security scanner on all new files
- [ ] Document security score in PR description
- [ ] Explain any flagged patterns that are false positives
- [ ] Update this document if new vulnerability patterns are discovered
