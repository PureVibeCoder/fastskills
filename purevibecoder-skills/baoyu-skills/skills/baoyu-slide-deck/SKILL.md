---
name: baoyu-slide-deck
description: Generate professional slide deck images from content. Creates comprehensive outlines with style instructions, then generates individual slide images. Use when user asks to "create slides", "make a presentation", "generate deck", or "slide deck".
---

# Slide Deck Generator

Transform content into professional slide deck images with flexible style options.

## Usage

```bash
/baoyu-slide-deck path/to/content.md
/baoyu-slide-deck path/to/content.md --style sketch-notes
/baoyu-slide-deck path/to/content.md --audience executives
/baoyu-slide-deck path/to/content.md --lang zh
/baoyu-slide-deck path/to/content.md --slides 10
/baoyu-slide-deck path/to/content.md --outline-only
/baoyu-slide-deck  # Then paste content
```

## Script Directory

**Important**: All scripts are located in the `scripts/` subdirectory of this skill.

**Agent Execution Instructions**:
1. Determine this SKILL.md file's directory path as `SKILL_DIR`
2. Script path = `${SKILL_DIR}/scripts/<script-name>.ts`
3. Replace all `${SKILL_DIR}` in this document with the actual path

**Script Reference**:
| Script | Purpose |
|--------|---------|
| `scripts/merge-to-pptx.ts` | Merge slides into PowerPoint |
| `scripts/merge-to-pdf.ts` | Merge slides into PDF |

## Options

| Option | Description |
|--------|-------------|
| `--style <name>` | Visual style (see Style Gallery) |
| `--audience <type>` | Target audience: beginners, intermediate, experts, executives, general |
| `--lang <code>` | Output language (en, zh, ja, etc.) |
| `--slides <number>` | Target slide count (recommended: 8-25, max: 30) |
| `--outline-only` | Generate outline only, skip image generation |

**Slide Count Guidance**:
| Content Length | Recommended Slides |
|----------------|-------------------|
| Short (< 1000 words) | 5-10 |
| Medium (1000-3000 words) | 10-18 |
| Long (3000-5000 words) | 15-25 |
| Very Long (> 5000 words) | 20-30 (consider splitting) |

Maximum 30 slides per deck. For longer content, split into multiple decks.

## Audience Guidelines

Design decisions should adapt to target audience. Use `--audience` to set.

| Audience | Content Density | Visual Style | Terminology | Slides |
|----------|-----------------|--------------|-------------|--------|
| `beginners` | Low | Friendly, illustrative | Plain language | 8-15 |
| `intermediate` | Medium | Balanced, structured | Some jargon OK | 10-20 |
| `experts` | High | Data-rich, precise | Technical terms | 12-25 |
| `executives` | Medium-High | Clean, impactful | Business language | 8-12 |
| `general` | Medium | Accessible, engaging | Minimal jargon | 10-18 |

### Audience-Specific Principles

**Beginners**:
- One concept per slide
- Visual metaphors over abstract diagrams
- Step-by-step progression
- Generous whitespace

**Experts**:
- Multiple data points per slide acceptable
- Technical diagrams with precise labels
- Assume domain knowledge
- Dense but organized information

**Executives**:
- Lead with insights, not data
- "So what?" on every slide
- Decision-enabling content
- Bottom-line upfront (BLUF)

## Style Gallery

### Style Selection Principles

**Content-First Approach**:
1. Analyze content topic, mood, and industry before selecting
2. Consider target audience expectations
3. Match style to subject matter (not personal preference)

**Quick Reference by Content Type**:
| Content Type | Recommended Styles |
|--------------|-------------------|
| Technical/Architecture | `blueprint`, `intuition-machine` |
| Educational/Tutorials | `sketch-notes`, `chalkboard` |
| Corporate/Business | `corporate`, `minimal` |
| Creative/Artistic | `vector-illustration`, `watercolor` |
| Product/SaaS | `notion`, `bold-editorial` |
| Scientific/Research | `scientific`, `editorial-infographic` |

**Note**: Full style specifications in `references/styles/<style>.md`

### Available Styles

| Style | Description | Best For |
|-------|-------------|----------|
| `blueprint` (Default) | Technical schematics, grid texture | Architecture, system design |
| `chalkboard` | Black chalkboard, colorful chalk | Education, tutorials, classroom |
| `notion` | SaaS dashboard, card-based layouts | Product demos, SaaS, B2B |
| `bold-editorial` | Magazine cover, bold typography, dark | Product launches, keynotes |
| `corporate` | Navy/gold, structured layouts | Investor decks, proposals |
| `dark-atmospheric` | Cinematic dark mode, glowing accents | Entertainment, gaming |
| `editorial-infographic` | Magazine explainers, flat illustrations | Tech explainers, research |
| `fantasy-animation` | Ghibli/Disney style, hand-drawn | Educational, storytelling |
| `intuition-machine` | Technical briefing, bilingual labels | Technical docs, academic |
| `minimal` | Ultra-clean, maximum whitespace | Executive briefings, premium |
| `pixel-art` | Retro 8-bit, chunky pixels | Gaming, developer talks |
| `scientific` | Academic diagrams, precise labeling | Biology, chemistry, medical |
| `sketch-notes` | Hand-drawn, warm & friendly | Educational, tutorials |
| `vector-illustration` | Flat vector, retro & cute | Creative, children's content |
| `vintage` | Aged-paper, historical styling | Historical, heritage, biography |
| `watercolor` | Hand-painted textures, natural warmth | Lifestyle, wellness, travel |

## Auto Style Selection

| Content Signals | Selected Style |
|-----------------|----------------|
| tutorial, learn, education, guide, intro, beginner | `sketch-notes` |
| classroom, teaching, school, chalkboard, blackboard | `chalkboard` |
| architecture, system, data, analysis, technical | `blueprint` |
| creative, children, kids, cute, illustration | `vector-illustration` |
| briefing, academic, research, bilingual, infographic, concept | `intuition-machine` |
| executive, minimal, clean, simple, elegant | `minimal` |
| saas, product, dashboard, metrics, productivity | `notion` |
| investor, quarterly, business, corporate, proposal | `corporate` |
| launch, marketing, keynote, bold, impact, magazine | `bold-editorial` |
| entertainment, music, gaming, creative, atmospheric | `dark-atmospheric` |
| explainer, journalism, science communication | `editorial-infographic` |
| story, fantasy, animation, magical, whimsical | `fantasy-animation` |
| gaming, retro, pixel, developer, nostalgia | `pixel-art` |
| biology, chemistry, medical, pathway, scientific | `scientific` |
| history, heritage, vintage, expedition, historical | `vintage` |
| lifestyle, wellness, travel, artistic, natural | `watercolor` |
| Default | `blueprint` |

## Layout Gallery

Optional layout hints for individual slides. Specify in outline's `// LAYOUT` section.

### Slide-Specific Layouts

| Layout | Description | Best For |
|--------|-------------|----------|
| `title-hero` | Large centered title + subtitle | Cover slides, section breaks |
| `quote-callout` | Featured quote with attribution | Testimonials, key insights |
| `key-stat` | Single large number as focal point | Impact statistics, metrics |
| `split-screen` | Half image, half text | Feature highlights, comparisons |
| `icon-grid` | Grid of icons with labels | Features, capabilities, benefits |
| `two-columns` | Content in balanced columns | Paired information, dual points |
| `three-columns` | Content in three columns | Triple comparisons, categories |
| `image-caption` | Full-bleed image + text overlay | Visual storytelling, emotional |
| `agenda` | Numbered list with highlights | Session overview, roadmap |
| `bullet-list` | Structured bullet points | Simple content, lists |

### Infographic-Derived Layouts

| Layout | Description | Best For |
|--------|-------------|----------|
| `linear-progression` | Sequential flow left-to-right | Timelines, step-by-step |
| `binary-comparison` | Side-by-side A vs B | Before/after, pros-cons |
| `comparison-matrix` | Multi-factor grid | Feature comparisons |
| `hierarchical-layers` | Pyramid or stacked levels | Priority, importance |
| `hub-spoke` | Central node with radiating items | Concept maps, ecosystems |
| `bento-grid` | Varied-size tiles | Overview, summary |
| `funnel` | Narrowing stages | Conversion, filtering |
| `dashboard` | Metrics with charts/numbers | KPIs, data display |
| `venn-diagram` | Overlapping circles | Relationships, intersections |
| `circular-flow` | Continuous cycle | Recurring processes |
| `winding-roadmap` | Curved path with milestones | Journey, timeline |
| `tree-branching` | Parent-child hierarchy | Org charts, taxonomies |
| `iceberg` | Visible vs hidden layers | Surface vs depth |
| `bridge` | Gap with connection | Problem-solution |

**Usage**: Add `Layout: <name>` in slide's `// LAYOUT` section to guide visual composition.

### Layout Selection Tips

**Match Layout to Content**:
| Content Type | Recommended Layouts |
|--------------|-------------------|
| Single narrative | `bullet-list`, `image-caption` |
| Two concepts | `split-screen`, `binary-comparison` |
| Three items | `three-columns`, `icon-grid` |
| Process/Steps | `linear-progression`, `winding-roadmap` |
| Data/Metrics | `dashboard`, `key-stat` |
| Relationships | `hub-spoke`, `venn-diagram` |
| Hierarchy | `hierarchical-layers`, `tree-branching` |

**Layout Flow Patterns**:
| Position | Recommended Layouts |
|----------|-------------------|
| Opening | `title-hero`, `agenda` |
| Middle | Content-specific layouts |
| Closing | `quote-callout`, `key-stat` |

**Common Mistakes to Avoid**:
- ✗ Using 3-column layout for 2 items (leaves columns empty)
- ✗ Stacking charts/tables below text (use side-by-side instead)
- ✗ Image layouts without actual images
- ✗ Quote layouts for emphasis (use only for real quotes with attribution)

## Design Philosophy

This deck is designed for **reading and sharing**, not live presentation:
- Each slide must be **self-explanatory** without verbal commentary
- Structure content for **logical flow** when scrolling
- Include **all necessary context** within each slide
- Optimize for **social media sharing** and offline reading

### Visual Hierarchy Principles

| Principle | Description |
|-----------|-------------|
| Focal Point | ONE dominant element per slide draws attention first |
| Rule of Thirds | Position key elements at grid intersections |
| Z-Pattern | Guide eye: top-left → top-right → bottom-left → bottom-right |
| Size Contrast | Headlines 2-3x larger than body text |
| Breathing Room | Minimum 10% margin from all edges |

### Content Density

Professional presentations balance information density with clarity.

| Level | Description | Use When |
|-------|-------------|----------|
| High | Multiple data points, detailed charts, dense text | Expert audience, technical reviews, data-driven decisions |
| Medium | Key points with supporting details, moderate visuals | General business, mixed audiences |
| Low | One main idea, large visuals, minimal text | Beginners, keynotes, emotional impact |

**High-Density Principles** (McKinsey-style):
- Every element earns its space
- Data speaks louder than decoration
- Annotations explain insights, not describe data
- White space is strategic, not filler
- Information hierarchy guides the eye

**Density by Slide Type**:
| Slide Type | Recommended Density |
|------------|-------------------|
| Cover/Title | Low |
| Agenda/Overview | Medium |
| Content/Analysis | Medium-High |
| Data/Metrics | High |
| Quote/Impact | Low |
| Summary/Takeaway | Medium |

### Color Selection

**Content-First Approach**:
1. Analyze content topic, mood, and industry
2. Consider target audience expectations
3. Match palette to subject matter (not defaults)
4. Ensure strong contrast for readability

**Quick Palette Guide**:
| Content Type | Recommended Palettes |
|--------------|---------------------|
| Technical/Architecture | Blues, grays, blueprint tones |
| Educational/Friendly | Warm colors, earth tones |
| Corporate/Professional | Navy, gold, structured palettes |
| Creative/Artistic | Bold colors, unexpected combinations |
| Scientific/Medical | Clean whites, precise color coding |

**Note**: Full color specs in `references/styles/<style>.md`

### Typography Principles

| Element | Treatment |
|---------|-----------|
| Headlines | Bold, 2-3x body size, narrative style |
| Body Text | Regular weight, readable size |
| Captions | Smaller, lighter weight |
| Data Labels | Monospace for technical content |
| Emphasis | Use bold or color, not underlines |

### Font Recommendations

Fonts for AI-generated slides. Specify in prompts for consistent rendering.

**English Fonts**:
| Font | Style | Best For |
|------|-------|----------|
| Liter | Sans-serif, geometric | Modern, clean, technical |
| HedvigLettersSans | Sans-serif, distinctive | Brand-forward, creative |
| Oranienbaum | High-contrast serif | Elegant, classical |
| SortsMillGoudy | Classical serif | Traditional, readable |
| Coda | Round sans-serif | Friendly, approachable |

**Chinese Fonts**:
| Font | Style | Best For |
|------|-------|----------|
| MiSans | Modern sans-serif | Clean, versatile, screen-optimized |
| Noto Sans SC | Neutral sans-serif | Standard, multilingual |
| siyuanSongti | Refined Song typeface | Elegant, editorial |
| alimamashuheiti | Geometric sans-serif | Commercial, structured |
| LXGW Bright | Song-Kai hybrid | Warm, readable |

**Multilingual Pairing**:
| Use Case | English | Chinese |
|----------|---------|---------|
| Technical | Liter | MiSans |
| Editorial | Oranienbaum | siyuanSongti |
| Friendly | Coda | LXGW Bright |
| Corporate | HedvigLettersSans | alimamashuheiti |

### Consistency Requirements

| Element | Guideline |
|---------|-----------|
| Spacing | Consistent margins and padding throughout |
| Colors | Maximum 3-4 colors per slide, palette consistent across deck |
| Typography | Same font families and sizes for same content types |
| Visual Language | Repeat patterns, shapes, and treatments |

## Visual Elements Reference

Quick reference for visual treatments. Full specs in style definitions.

### Background Treatments

| Treatment | Description | Best For |
|-----------|-------------|----------|
| Solid color | Single background color | Clean, minimal |
| Split background | Two colors, diagonal or vertical | Contrast, sections |
| Gradient | Subtle vertical or diagonal fade | Modern, dynamic |
| Textured | Pattern or texture overlay | Character, style |

### Typography Treatments

| Treatment | Description | Best For |
|-----------|-------------|----------|
| Size contrast | 3-4x difference headline vs body | Impact, hierarchy |
| All-caps headers | Uppercase with letter spacing | Authority, structure |
| Monospace data | Fixed-width for numbers/code | Technical, precision |
| Hand-drawn | Organic, imperfect letterforms | Friendly, approachable |

### Geometric Accents

| Element | Description | Best For |
|---------|-------------|----------|
| Diagonal dividers | Angled section separators | Energy, movement |
| Corner brackets | L-shaped frames | Focus, framing |
| Circles/hexagons | Shape frames for images | Modern, tech |
| Underline accents | Thick lines under headers | Emphasis, hierarchy |

## File Management

### Output Directory

Each session creates an independent directory named by content slug:

```
slide-deck/{topic-slug}/
├── source-{slug}.{ext}    # Source files (text, images, etc.)
├── outline.md
├── outline-{style}.md     # Style variant outlines
├── prompts/
│   └── 01-slide-cover.md, 02-slide-{slug}.md, ...
├── 01-slide-cover.png, 02-slide-{slug}.png, ...
├── {topic-slug}.pptx
└── {topic-slug}.pdf
```

**Slug Generation**:
1. Extract main topic from content (2-4 words, kebab-case)
2. Example: "Introduction to Machine Learning" → `intro-machine-learning`

### Conflict Resolution

If `slide-deck/{topic-slug}/` already exists:
- Append timestamp: `{topic-slug}-YYYYMMDD-HHMMSS`
- Example: `intro-ml` exists → `intro-ml-20260118-143052`

### Source Files

Copy all sources with naming `source-{slug}.{ext}`:
- `source-article.md` (main text content)
- `source-diagram.png` (image from conversation)
- `source-data.xlsx` (additional file)

Multiple sources supported: text, images, files from conversation.

## Workflow

### Step 1: Analyze Content

1. Save source content (if pasted, save as `source.md`)
2. Follow `references/analysis-framework.md` for deep content analysis
3. Determine style (use `--style` or auto-select from signals)
4. Detect languages (source vs. user preference)
5. Plan slide count (`--slides` or dynamic)

### Step 2: Generate Outline Variants

1. Generate 3 style variant outlines based on content analysis
2. Follow `references/outline-template.md` for structure
3. Save as `outline-{style}.md` for each variant

### Step 3: User Confirmation

**Single AskUserQuestion with all applicable options:**

| Question | When to Ask |
|----------|-------------|
| Style variant | Always (3 options + custom) |
| Language | Only if source ≠ user language |

After selection:
- Copy selected `outline-{style}.md` to `outline.md`
- Regenerate in different language if requested
- User may edit `outline.md` for fine-tuning

If `--outline-only`, stop here.

### Step 4: Generate Prompts

1. Read `references/base-prompt.md`
2. Combine with style instructions from outline
3. Add slide-specific content
4. If `Layout:` specified in outline, include layout guidance in prompt:
   - Reference layout characteristics for image composition
   - Example: `Layout: hub-spoke` → "Central concept in middle with related items radiating outward"
5. Save to `prompts/` directory

### Step 5: Generate Images

1. Select available image generation skill
2. Generate session ID: `slides-{topic-slug}-{timestamp}`
3. Generate each slide with same session ID
4. Report progress: "Generated X/N"

### Step 6: Merge to PPTX and PDF

```bash
npx -y bun ${SKILL_DIR}/scripts/merge-to-pptx.ts <slide-deck-dir>
npx -y bun ${SKILL_DIR}/scripts/merge-to-pdf.ts <slide-deck-dir>
```

### Step 7: Output Summary

```
Slide Deck Complete!

Topic: [topic]
Style: [style name]
Location: [directory path]
Slides: N total

- 01-slide-cover.png ✓ Cover
- 02-slide-intro.png ✓ Content
- ...
- {NN}-slide-back-cover.png ✓ Back Cover

Outline: outline.md
PPTX: {topic-slug}.pptx
PDF: {topic-slug}.pdf
```

## Slide Modification

See `references/modification-guide.md` for:
- Edit single slide workflow
- Add new slide (with renumbering)
- Delete slide (with renumbering)
- File naming conventions

## References

| File | Content |
|------|---------|
| `references/analysis-framework.md` | Deep content analysis for presentations |
| `references/outline-template.md` | Outline structure and STYLE_INSTRUCTIONS format |
| `references/modification-guide.md` | Edit, add, delete slide workflows |
| `references/content-rules.md` | Content and style guidelines |
| `references/base-prompt.md` | Base prompt for image generation |
| `references/styles/<style>.md` | Full style specifications |

## Notes

- Image generation: 10-30 seconds per slide
- Auto-retry once on generation failure
- Use stylized alternatives for sensitive public figures
- Maintain style consistency via session ID

## Extension Support

Custom styles and configurations via EXTEND.md.

**Check paths** (priority order):
1. `.baoyu-skills/baoyu-slide-deck/EXTEND.md` (project)
2. `~/.baoyu-skills/baoyu-slide-deck/EXTEND.md` (user)

If found, load before Step 1. Extension content overrides defaults.
