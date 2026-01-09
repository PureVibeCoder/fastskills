# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Status

| Item | Status |
|------|--------|
| **GitHub Repository** | https://github.com/PureVibeCoder/fastskills |
| **Live Website** | https://fastskills.pages.dev |
| **Remote MCP** | https://mcp.fastskills.xyz |
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

# MCP Server development
cd packages/mcp-server
pnpm dev                  # Start dev server with wrangler
pnpm test                 # Run tests
pnpm deploy               # Deploy to Cloudflare Workers
pnpm coverage-report      # Generate skill coverage report

# Run single test
pnpm --filter website exec vitest run src/utils/__tests__/specific.test.ts
pnpm --filter @fastskills/mcp-server exec vitest run src/__tests__/specific.test.ts

# Deployment
cd packages/website && pnpm build && wrangler pages deploy dist --project-name=fastskills --commit-dirty=true
cd packages/mcp-server && pnpm deploy
```

## Project Overview

**FastSkills** is a Claude Code skills aggregation platform with two main packages:
- **website**: Astro static site displaying 225+ skills from 10+ GitHub projects
- **mcp-server**: Remote MCP server (Cloudflare Workers) for dynamic skill search

## Architecture

### Monorepo Structure

```
packages/
├── website/              # Astro 5.x static site
│   ├── src/data/         # Skills/categories data (skills.ts is ~3MB generated)
│   ├── src/pages/        # Routes + API endpoints
│   └── src/utils/        # TypeScript utilities
├── mcp-server/           # Remote MCP server (Cloudflare Workers)
│   ├── src/engine/       # Search engine (TF-IDF), synonyms, intent detection
│   ├── src/routes/       # HTTP API routes
│   ├── src/mcp/          # MCP protocol handler
│   └── src/services/     # Skill search and content services
```

### MCP Server Engine

The `mcp-server` package provides a remote MCP server with three tools:
- `find_skills`: TF-IDF search with Chinese-English synonym expansion and intent detection
- `get_skill_content`: Returns full skill content for loading into Claude sessions
- `list_skills`: Lists all available skills with optional category filter

Key files:
- `engine/tfidf.ts`: Pure JS TF-IDF implementation (no external dependencies)
- `engine/synonyms.ts`: `CHINESE_TO_ENGLISH_SYNONYMS` and `DOMAIN_ALIASES`
- `engine/intent.ts`: Intent detection (`IntentType`: CREATE, RESEARCH, DEBUG, etc.)
- `services/skills.ts`: Skill search with score boosting
- `mcp/handler.ts`: MCP JSON-RPC protocol handler

### Skill Data Flow

1. Git submodules contain raw skills from various projects
2. Website generates static `skills.json` API endpoint
3. MCP server fetches from `https://fastskills.pages.dev/api/skills.json`

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
3. **Monorepo**: Use `pnpm --filter website` or `pnpm --filter @fastskills/mcp-server` from root
4. **Security**: Run security scanner on new skills before adding
