# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Status

| Item | Status |
|------|--------|
| **GitHub Repository** | https://github.com/PureVibeCoder/fastskills |
| **Live Website** | https://fastskills.pages.dev |
| **HTTP API** | https://mcp.fastskills.xyz |
| **Deployment Method** | Wrangler CLI (manual) |

## Quick Commands

```bash
# Development
pnpm install              # Install dependencies (use --recursive for submodules)
pnpm dev                  # Start website dev server (http://localhost:4321)
pnpm build                # Build website for production
pnpm typecheck            # TypeScript checking
pnpm test                 # Run tests
pnpm lint                 # ESLint check

# Skills Router development
cd packages/skills-router
pnpm dev                  # Start router in watch mode
pnpm test                 # Run router tests
pnpm generate-index       # Regenerate skills index from submodules

# Run single test
pnpm --filter website exec vitest run src/utils/__tests__/specific.test.ts
pnpm --filter @fastskills/router exec vitest run src/__tests__/specific.test.ts

# Deployment
cd packages/website && pnpm build && wrangler pages deploy dist --project-name=fastskills --commit-dirty=true
```

## Project Overview

**FastSkills** is a Claude Code skills aggregation platform with two main packages:
- **website**: Astro static site displaying 225+ skills from 10+ GitHub projects
- **skills-router**: MCP server for dynamic skill loading via TF-IDF search

## Architecture

### Monorepo Structure

```
packages/
├── website/              # Astro 5.x static site
│   ├── src/data/         # Skills/categories data (skills.ts is ~3MB generated)
│   ├── src/pages/        # Routes + API endpoints
│   └── src/utils/        # TypeScript utilities
├── skills-router/        # MCP server for dynamic skill loading
│   ├── src/engine/       # Search engine (TF-IDF), intent detection, loader
│   ├── src/tools/        # MCP tool handlers (find/load/unload/list)
│   └── src/data/         # skills.json index (generated from submodules)
```

### Skills Router Engine

The `skills-router` package provides an MCP server with four tools:
- `find_skills`: TF-IDF search with Chinese-English synonym expansion and intent detection
- `load_skills`: Returns full skill content for loading into Claude sessions
- `unload_skill`: Releases skills from context
- `list_active_skills`: Shows currently loaded skills

Key files:
- `engine/search.ts`: TF-IDF search with `CHINESE_TO_ENGLISH_SYNONYMS` and `DOMAIN_ALIASES`
- `engine/intent.ts`: Intent detection (`IntentType`: CREATE, RESEARCH, DEBUG, etc.)
- `engine/loader.ts`: Skill content fetching and caching
- `server.ts`: MCP server setup with tool handlers

### Skill Data Flow

1. Git submodules contain raw skills from various projects
2. `scripts/generate-index.ts` processes submodules → `src/data/skills.json`
3. Website reads from `packages/website/src/data/skills.ts`
4. Router reads from `packages/skills-router/src/data/skills.json`

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

1. **Submodules**: Clone with `--recursive` flag
2. **Large files**: `packages/website/src/data/skills.ts` is ~3MB, use grep/offset when reading
3. **Monorepo**: Use `pnpm --filter website` or `pnpm --filter @fastskills/router` from root
4. **Security**: Run security scanner on new skills before adding
