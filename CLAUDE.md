# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Status

| Item | Status |
|------|--------|
| **GitHub Repository** | https://github.com/PureVibeCoder/fastskills |
| **Live Website** | https://fastskills.pages.dev |
| **Deployment Method** | Wrangler CLI (manual) |

## Quick Commands

### Development
```bash
pnpm install              # Install dependencies
pnpm dev                  # Start dev server (http://localhost:4321)
pnpm build                # Build for production
pnpm typecheck            # TypeScript checking
pnpm test                 # Run tests
pnpm lint                 # ESLint check
```

### Deployment
```bash
# Build and deploy to Cloudflare Pages
cd packages/website && pnpm build && wrangler pages deploy dist --project-name=fastskills --commit-dirty=true
```

## Project Overview

**FastSkills** is a Claude Code skills aggregation platform built with Astro. It collects 241+ skills from 10+ GitHub open-source projects and packages them into 21 scenario-based skill packs.

### Repository Structure

```
fastskills/
├── packages/
│   ├── website/               # Astro static website (main codebase)
│   │   ├── src/
│   │   │   ├── components/    # Astro components
│   │   │   ├── data/          # Skills and categories data
│   │   │   ├── pages/         # Page routes and API endpoints
│   │   │   ├── styles/        # Global CSS
│   │   │   └── utils/         # TypeScript utilities
│   │   └── dist/              # Build output
│   └── skills-router/         # Skills routing MCP plugin
├── anthropic-skills/          # Git submodule - Anthropic official skills
├── awesome-claude-skills/     # Git submodule - Community skills
├── claudekit-skills/          # Git submodule - ClaudeKit skills
├── scientific-skills/         # Git submodule - 138+ scientific skills
├── composio-skills/           # Git submodule - Composio integrations
├── voltagent-skills/          # Git submodule - VoltAgent AI framework
├── obsidian-skills/           # Git submodule - Knowledge management
└── deep-research-skills/      # Git submodule - Research framework
```

## Tech Stack

- **Framework**: Astro 5.x
- **Language**: TypeScript (strict mode)
- **Styling**: Vanilla CSS with CSS variables
- **Testing**: Vitest with happy-dom
- **Linting**: ESLint + Prettier
- **Deployment**: Cloudflare Pages via Wrangler CLI

## Code Style

- **Formatting**: Prettier (semi, singleQuote, tabWidth: 2)
- **TypeScript**: Strict mode, no explicit any
- **Components**: PascalCase (.astro files)
- **Utilities**: kebab-case (.ts files)
- **Constants**: SCREAMING_SNAKE_CASE

## Before Committing

1. `pnpm typecheck` - No TypeScript errors
2. `pnpm lint` - No ESLint errors
3. `pnpm test` - All tests pass
4. `pnpm build` - Build succeeds

## Important Notes

1. **Submodules**: Clone with `--recursive` flag
2. **Monorepo**: Use `pnpm --filter website` from root
3. **Chinese UI**: Interface text is in Chinese
4. **Security**: Run security scanner on new skills before adding
