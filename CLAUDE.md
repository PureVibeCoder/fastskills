# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Status

| Item | Status |
|------|--------|
| **GitHub Repository** | https://github.com/PureVibeCoder/fastskills |
| **Live Website** | https://fastskills.pages.dev |
| **Deployment** | GitHub Actions (auto) + Wrangler CLI (manual) |

## Quick Commands

```bash
# Development
pnpm install              # Install dependencies
pnpm dev                  # Start website dev server (http://localhost:4321)
pnpm build                # Build website for production
pnpm typecheck            # TypeScript checking

# Tests and linting
pnpm --filter website test
pnpm --filter website lint

# Run single test
pnpm --filter website exec vitest run src/utils/__tests__/specific.test.ts

# Manual deployment
cd packages/website && pnpm build && wrangler pages deploy dist --project-name=fastskills --commit-dirty=true
```

## Project Overview

**FastSkills** is a Claude Code skills aggregation platform that provides:
- **Skill Aggregation**: 225+ skills from 10+ GitHub open-source projects
- **Intelligent Routing**: One skill file that auto-detects intent and loads relevant skills
- **Scenario Packs**: 25 pre-packaged skill sets for different workflows

### Core Product: FastSkills Router

The main product is a single skill file that acts as an intelligent router:

```
purevibecoder-skills/fastskills-router/SKILL.md
```

Users add this to their `CLAUDE.md` via @ reference:
```markdown
@https://raw.githubusercontent.com/PureVibeCoder/fastskills/main/purevibecoder-skills/fastskills-router/SKILL.md
```

This enables Claude to automatically detect user intent and load relevant skills from the 225+ skill library.

## Architecture

### Monorepo Structure

```
packages/
├── website/              # Astro 5.x static site
│   ├── src/data/         # Skills/categories data (skills.ts is ~3MB generated)
│   ├── src/pages/        # Routes + API endpoints
│   └── src/utils/        # TypeScript utilities
├── fastskills-plugin/    # Router generator script
│   └── generate.ts       # Generates the router SKILL.md

purevibecoder-skills/
└── fastskills-router/    # The core product
    └── SKILL.md          # Intelligent skill router (~50KB index)
```

### Skill Data Flow

1. Git submodules contain raw skills from various projects
2. `fastskills-plugin/generate.ts` scans all skills and generates the router
3. Router contains skill index + intent detection rules
4. Users reference the router in their CLAUDE.md

### Git Submodules

Skills are aggregated from external repos as submodules:
- `anthropic-skills/`, `claudekit-skills/`, `scientific-skills/`
- `awesome-claude-skills/`, `composio-skills/`, `obsidian-skills/`
- `voltagent-skills/`, `deep-research-skills/`

Clone with: `git clone --recursive https://github.com/PureVibeCoder/fastskills.git`

## Code Style

- **TypeScript**: Strict mode, no explicit any
- **Components**: PascalCase (.astro files)
- **Utilities**: kebab-case (.ts files)
- **Formatting**: Prettier (semi, singleQuote, tabWidth: 2)
- **Chinese UI**: Interface text is in Chinese

## Before Committing

1. `pnpm typecheck` - No TypeScript errors
2. `pnpm lint` - No ESLint errors
3. `pnpm test` - All tests pass
4. `pnpm build` - Build succeeds

## Important Notes

1. **Submodules**: Clone with `git clone --recursive` or run `git submodule update --init --recursive`
2. **Large files**: `packages/website/src/data/skills.ts` is ~3MB, use grep/offset when reading
3. **Monorepo**: Use `pnpm --filter website` from root
4. **Security**: Run security scanner on new skills before adding
5. **CI/CD**: GitHub Actions auto-deploys website on push to main
