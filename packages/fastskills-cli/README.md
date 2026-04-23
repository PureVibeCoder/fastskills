# FastSkills CLI

Command-line interface for managing FastSkills - a Claude Code skills aggregation platform.

## Installation

### From Source

```bash
# Clone the repository
git clone https://github.com/PureVibeCoder/fastskills.git
cd fastskills

# Build and link
cd packages/fastskills-cli
pnpm install
pnpm build
pnpm link
```

### Global Usage

After installation, you can use the `fastskills` command globally:

```bash
fastskills --help
```

## Usage

### List all installed skills

```bash
fastskills list
```

### Add a new skill

```bash
# Interactive mode
fastskills add

# With repository URL
fastskills add jimliu/baoyu-skills
fastskills add https://github.com/jimliu/baoyu-skills

# Non-interactive mode (skip prompts)
fastskills add jimliu/baoyu-skills --yes
```

### Remove a skill

```bash
fastskills remove <skill-id>
```

## Workflow

When you run `fastskills add <repo>`, the CLI will:

1. Clone the repository as a git submodule in `submodules/`
2. Scan for `SKILL.md` files
3. Display found skills for selection
4. Parse skill metadata (name, description, triggers)
5. Auto-detect or prompt for category
6. Update all required data files:
   - `packages/website/src/data/skill-sources.ts`
   - `packages/website/src/data/skills.ts`
   - `skills/fastskills-router/SKILL.md`
7. Output next steps

## Development

```bash
# Build
pnpm build

# Watch mode
pnpm dev

# Type checking
pnpm exec tsc --noEmit
```

## Directory Structure

```
packages/fastskills-cli/
├── bin/
│   └── fastskills.js      # CLI entry point
├── src/
│   ├── index.ts           # Main CLI setup
│   ├── commands/
│   │   ├── add.ts         # Add skill command
│   │   ├── list.ts        # List skills command
│   │   └── remove.ts      # Remove skill command
│   ├── updaters/
│   │   ├── skill-sources.ts
│   │   ├── skills.ts
│   │   └── router.ts
│   └── utils/
│       ├── categories.ts
│       ├── skill-sources.ts
│       ├── skills.ts
│       ├── category-detector.ts
│       └── trigger-extractor.ts
├── package.json
└── tsconfig.json
```
