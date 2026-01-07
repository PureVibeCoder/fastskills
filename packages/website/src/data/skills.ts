import { categories, type Category } from './categories';

export interface Skill {
  id: string;
  name: string;
  description: string;
  category: Category;
  source: 'anthropic' | 'claudekit' | 'scientific' | 'community' | 'composio' | 'voltagent' | 'obsidian' | 'planning';
  triggers: string[];
  priority: number;
  content: string;
}

export const skills: Skill[] = [
  // Frontend Skills
  {
    id: 'frontend-design',
    name: 'Frontend Design',
    description: '创建生产级前端界面，遵循设计原则和最佳实践',
    category: categories[0],
    source: 'anthropic',
    triggers: ['UI', '界面', '组件', '页面', 'CSS', '设计'],
    priority: 6,
    content: `---
name: frontend-design
description: Create distinctive, production-grade frontend interfaces with high design quality. Use this skill when the user asks to build web components, pages, artifacts, posters, or applications (examples include websites, landing pages, dashboards, React components, HTML/CSS layouts, or when styling/beautifying any web UI). Generates creative, polished code and UI design that avoids generic AI aesthetics.
license: Complete terms in LICENSE.txt
---

This skill guides creation of distinctive, production-grade frontend interfaces that avoid generic "AI slop" aesthetics. Implement real working code with exceptional attention to aesthetic details and creative choices.

The user provides frontend requirements: a component, page, application, or interface to build. They may include context about the purpose, audience, or technical constraints.

## Design Thinking

Before coding, understand the context and commit to a BOLD aesthetic direction:
- **Purpose**: What problem does this interface solve? Who uses it?
- **Tone**: Pick an extreme: brutally minimal, maximalist chaos, retro-futuristic, organic/natural, luxury/refined, playful/toy-like, editorial/magazine, brutalist/raw, art deco/geometric, soft/pastel, industrial/utilitarian, etc. There are so many flavors to choose from. Use these for inspiration but design one that is true to the aesthetic direction.
- **Constraints**: Technical requirements (framework, performance, accessibility).
- **Differentiation**: What makes this UNFORGETTABLE? What's the one thing someone will remember?

**CRITICAL**: Choose a clear conceptual direction and execute it with precision. Bold maximalism and refined minimalism both work - the key is intentionality, not intensity.

Then implement working code (HTML/CSS/JS, React, Vue, etc.) that is:
- Production-grade and functional
- Visually striking and memorable
- Cohesive with a clear aesthetic point-of-view
- Meticulously refined in every detail

## Frontend Aesthetics Guidelines

Focus on:
- **Typography**: Choose fonts that are beautiful, unique, and interesting. Avoid generic fonts like Arial and Inter; opt instead for distinctive choices that elevate the frontend's aesthetics; unexpected, characterful font choices. Pair a distinctive display font with a refined body font.
- **Color & Theme**: Commit to a cohesive aesthetic. Use CSS variables for consistency. Dominant colors with sharp accents outperform timid, evenly-distributed palettes.
- **Motion**: Use animations for effects and micro-interactions. Prioritize CSS-only solutions for HTML. Use Motion library for React when available. Focus on high-impact moments: one well-orchestrated page load with staggered reveals (animation-delay) creates more delight than scattered micro-interactions. Use scroll-triggering and hover states that surprise.
- **Spatial Composition**: Unexpected layouts. Asymmetry. Overlap. Diagonal flow. Grid-breaking elements. Generous negative space OR controlled density.
- **Backgrounds & Visual Details**: Create atmosphere and depth rather than defaulting to solid colors. Add contextual effects and textures that match the overall aesthetic. Apply creative forms like gradient meshes, noise textures, geometric patterns, layered transparencies, dramatic shadows, decorative borders, custom cursors, and grain overlays.

NEVER use generic AI-generated aesthetics like overused font families (Inter, Roboto, Arial, system fonts), cliched color schemes (particularly purple gradients on white backgrounds), predictable layouts and component patterns, and cookie-cutter design that lacks context-specific character.

Interpret creatively and make unexpected choices that feel genuinely designed for the context. No design should be the same. Vary between light and dark themes, different fonts, different aesthetics. NEVER converge on common choices (Space Grotesk, for example) across generations.

**IMPORTANT**: Match implementation complexity to the aesthetic vision. Maximalist designs need elaborate code with extensive animations and effects. Minimalist or refined designs need restraint, precision, and careful attention to spacing, typography, and subtle details. Elegance comes from executing the vision well.

Remember: Claude is capable of extraordinary creative work. Don't hold back, show what can truly be created when thinking outside the box and committing fully to a distinctive vision.
`
  },
  {
    id: 'modern-frontend-design',
    name: 'Modern Frontend Design',
    description: '现代前端设计系统，包含设计模式和美学原则',
    category: categories[0],
    source: 'anthropic',
    triggers: ['现代前端', '设计系统', '美学', '视觉'],
    priority: 7,
    content: `---
name: modern-frontend-design
description: Comprehensive frontend design system for creating distinctive, production-grade interfaces that avoid generic AI aesthetics. Use when users request web components, pages, applications, or any frontend interface. Provides design workflows, aesthetic guidelines, code patterns, animation libraries, typography systems, color theory, and anti-patterns to create memorable, context-specific designs that feel genuinely crafted rather than generated.
license: Complete terms in LICENSE.txt
---

# Modern Frontend Design

This skill provides a comprehensive frontend design system for creating distinctive, production-grade interfaces that avoid generic "AI slop" aesthetics. It guides the creation of memorable, context-specific designs that feel genuinely crafted rather than generated.

## Design Philosophy

### Core Principles

1. **Intentionality Over Defaults**
   - Every design choice should be deliberate
   - Avoid generic defaults (system fonts, standard colors, predictable layouts)
   - Question "why" for every aesthetic decision

2. **Context-Specific Design**
   - Design for the specific use case, audience, and purpose
   - Consider the brand identity, user needs, and functional requirements
   - Create designs that are unique to the project, not generic templates

3. **Production-Grade Quality**
   - Implement working, functional code
   - Ensure accessibility and responsiveness
   - Focus on attention to detail in every element

4. **Distinctive Aesthetics**
   - Commit to bold, memorable visual directions
   - Avoid cliched design patterns and overused visual elements
   - Create designs that stand out and leave a lasting impression

## Design Workflow

### Step 1: Discovery and Context

Before starting any design work, gather information about:

- **Purpose**: What problem does this interface solve? What is the core function?
- **Audience**: Who are the users? What are their needs, preferences, and technical level?
- **Tone**: What feeling should the interface convey? (e.g., professional, playful, luxurious, minimalist)
- **Constraints**: Are there technical limitations? (e.g., framework requirements, performance budgets, accessibility standards)

### Step 2: Conceptual Direction

Choose a clear aesthetic vision and commit to it fully:

- **Minimalist/Refined**: Clean lines, generous whitespace, subtle interactions, restrained color palette
- **Bold/Maximalist**: Strong visual statements, vibrant colors, complex layouts, dramatic animations
- **Retro/ Nostalgic**: Vintage aesthetics, warm colors, classic typography, nostalgic interactions
- **Futuristic/Tech**: Dark themes, neon accents, geometric shapes, sleek animations
- **Organic/Natural**: Soft shapes, earth tones, natural textures, flowing layouts
- **Luxury/Editorial**: Elegant typography, refined spacing, sophisticated color palette, high-contrast elements

**Critical**: Execute the chosen direction with precision and consistency. The key is intentionality, not just intensity.

### Step 3: Design System Foundation

Establish a cohesive design system before implementing components:

1. **Typography System**
   - Choose distinctive fonts that elevate the design
   - Pair a unique display font with a refined body font
   - Establish clear hierarchy through size, weight, and spacing
   - Consider font licensing and web font performance

2. **Color Palette**
   - Commit to a cohesive color scheme with a dominant primary color
   - Use sharp accent colors to create visual interest
   - Ensure sufficient contrast for accessibility
   - Use CSS custom properties for consistency and theming

3. **Spacing and Layout**
   - Establish a consistent spacing scale (e.g., 4px, 8px, 16px, 24px, 32px, 48px, 64px)
   - Use grid systems for alignment and structure
   - Consider responsive breakpoints and fluid layouts

4. **Motion and Animation**
   - Define animation duration and easing curves
   - Prioritize meaningful motion that enhances user understanding
   - Use CSS animations when possible for performance
   - Consider reduced motion preferences for accessibility

### Step 4: Component Design

Design individual components with the overall aesthetic in mind:

- **Buttons**: Consider size, shape, hover states, active states, and loading states
- **Forms**: Design clear input fields, helpful validation, and intuitive error states
- **Cards**: Create depth through shadows, borders, and background treatments
- **Navigation**: Design clear hierarchies and intuitive interaction patterns
- **Modals/Dialogs**: Ensure focus management and clear close interactions

### Step 5: Refinement and Polish

- Review the design for consistency and cohesion
- Test interactions and animations for smoothness
- Check accessibility (contrast, keyboard navigation, screen reader compatibility)
- Optimize for performance (lazy loading, image optimization, code splitting)

## Design Patterns

### Visual Hierarchy

1. **Size Hierarchy**: Larger elements draw more attention
2. **Color Hierarchy**: Bold colors stand out from muted tones
3. **Space Hierarchy**: Whitespace directs focus and creates breathing room
4. **Typography Hierarchy**: Different sizes and weights create clear reading order

### Component Patterns

1. **Card Pattern**
   - Container with consistent padding and background
   - Clear visual boundaries through shadows or borders
   - Hierarchical content organization

2. **List Pattern**
   - Consistent item spacing and alignment
   - Clear visual separation between items
   - Interactive states for clickable items

3. **Form Pattern**
   - Clear labels and instructions
   - Visual feedback for focus, error, and success states
   - Logical tab order and keyboard navigation

4. **Navigation Pattern**
   - Clear current location indication
   - Consistent hover and active states
   - Responsive behavior for mobile devices

## Anti-Patterns to Avoid

### Generic AI Aesthetic

1. **Overused Font Choices**
   - Avoid: Inter, Roboto, Arial, system fonts
   - Choose: Unique, characterful fonts that elevate the design

2. **Cliched Color Schemes**
   - Avoid: Purple gradients on white backgrounds
   - Choose: Bold, cohesive color palettes with strong accent colors

3. **Predictable Layouts**
   - Avoid: Standard card grids, predictable hero sections
   - Choose: Unexpected layouts with asymmetry and visual interest

4. **Cookie-Cutter Components**
   - Avoid: Generic button styles, standard form inputs
   - Choose: Custom components that fit the specific design vision

5. **Lacking Context**
   - Avoid: Designs that could work anywhere for any purpose
   - Choose: Designs that are clearly crafted for the specific context

### Performance Anti-Patterns

1. **Over-Animation**
   - Avoid: Animating every element with complex transitions
   - Choose: Strategic animation that enhances user understanding

2. **Image Bloat**
   - Avoid: Large, unoptimized images
   - Choose: Properly sized, compressed, and lazy-loaded images

3. **Excessive DOM Depth**
   - Avoid: Deeply nested HTML structures
   - Choose: Semantic, flat HTML that is easy to understand and maintain

## Implementation Guidelines

### CSS Best Practices

1. **Use CSS Custom Properties**
   \`\`\`css
   :root {
     --color-primary: #6366f1;
     --color-secondary: #ec4899;
     --font-display: 'Space Grotesk', sans-serif;
     --font-body: 'Inter', sans-serif;
     --spacing-sm: 0.5rem;
     --spacing-md: 1rem;
     --spacing-lg: 2rem;
   }
   \`\`\`

2. **Embrace Modern CSS Features**
   - CSS Grid for complex layouts
   - Flexbox for component-level layout
   - Container queries for responsive components
   - Custom properties for theming

3. **Mobile-First Approach**
   - Design for mobile first, then enhance for larger screens
   - Use relative units (rem, em, %) for scalability
   - Test on actual devices when possible

### JavaScript Considerations

1. **Progressive Enhancement**
   - Ensure core functionality works without JavaScript
   - Add enhanced interactions as improvements
   - Handle JavaScript failures gracefully

2. **Performance Optimization**
   - Use code splitting and lazy loading
   - Minimize main thread blocking
   - Optimize animation performance with will-change

## Accessibility Guidelines

### Semantic HTML

1. **Use Proper Elements**
   - \`<button>\` for clickable actions
   - \`<a>\` for links
   - \`<input>\` for form inputs
   - \`<h1>-<h6>\` for headings

2. **ARIA Attributes**
   - Use \`aria-label\` for icon-only buttons
   - Use \`aria-expanded\` for collapsible elements
   - Use \`aria-describedby\` for additional context

### Keyboard Navigation

1. **Focus Management**
   - Visible focus indicators on all interactive elements
   - Logical tab order
   - Skip links for main content

2. **Interactive Patterns**
   - Space/Enter to activate buttons
   - Arrow keys for menus and lists
   - Escape to close modals and dropdowns

### Visual Accessibility

1. **Color Contrast**
   - Minimum 4.5:1 for normal text
   - Minimum 3:1 for large text and UI components
   - Do not rely solely on color to convey information

2. **Reduced Motion**
   - Respect \`prefers-reduced-motion\` media query
   - Provide alternatives to auto-playing animations

## Animation Guidelines

### Purposeful Animation

1. **Feedback Animations**
   - Button hover and click feedback
   - Form validation indicators
   - Loading states and progress indicators

2. **Transition Animations**
   - Page transitions
   - Modal open/close
   - Expand/collapse content
   - Filter and sort updates

3. **Attention Animations**
   - New content notification
   - Important alerts
   - Achievement or success indicators

### Animation Principles

1. **Duration**
   - Micro-interactions: 100-200ms
   - Standard transitions: 200-400ms
   - Complex animations: 400-600ms

2. **Easing**
   - Ease-out for entering elements
   - Ease-in for exiting elements
   - Ease-in-out for state changes

3. **Performance**
   - Use CSS transforms and opacity
   - Avoid animating layout properties (width, height, margin)
   - Use \`will-change\` sparingly for complex animations

## Testing and Quality Assurance

### Visual Testing

1. **Cross-Browser Testing**
   - Test on Chrome, Firefox, Safari, and Edge
   - Verify consistent rendering across browsers
   - Test on actual devices when possible

2. **Responsive Testing**
   - Test at common breakpoints (320px, 768px, 1024px, 1440px)
   - Verify touch targets are large enough (44x44px minimum)
   - Test both portrait and landscape orientations

### Functional Testing

1. **Interaction Testing**
   - Test all interactive elements
   - Verify hover, focus, and active states
   - Test keyboard navigation

2. **Form Testing**
   - Test all input types
   - Verify validation messages
   - Test error handling and recovery

### Accessibility Testing

1. **Automated Testing**
   - Use Lighthouse for accessibility audits
   - Use axe DevTools for detailed analysis
   - Run tests regularly during development

2. **Manual Testing**
   - Navigate using only keyboard
   - Test with screen reader (VoiceOver, NVDA)
   - Test with browser zoom up to 200%

## Resources

### Typography Resources

1. **Google Fonts**: Free, open-source fonts
2. **Adobe Fonts**: High-quality professional fonts
3. **Font Squirrel**: Free fonts with web font generator

### Color Resources

1. **Coolors**: Color palette generator
2. **Color Hunt**: Curated color palettes
3. **Tailwind Colors**: Pre-built color systems

### Animation Resources

1. **Animate.css**: Ready-to-use CSS animations
2. **Framer Motion**: React animation library
3. **GSAP**: Professional-grade animation platform

### Design Inspiration

1. **Dribbble**: Design inspiration and trends
2. **Awwwards**: Website design showcases
3. **CodePen**: Frontend code examples

## Conclusion

Creating distinctive, production-grade frontend interfaces requires intentionality, attention to detail, and a commitment to excellence. By following the principles and guidelines in this design system, you can create memorable, effective interfaces that stand out from generic AI-generated designs.

Remember: The key to great design is not just following rules, but understanding when to break them in service of the overall vision. Be bold, be intentional, and create something truly unique.
`
  },
  {
    id: 'react-components',
    name: 'React Components',
    description: 'React 组件开发和状态管理最佳实践',
    category: categories[0],
    source: 'community',
    triggers: ['React', '组件', 'useState', 'useEffect', 'Hooks'],
    priority: 6,
    content: `---
name: react-components
description: |
  React 组件开发专家。
  精通 Hooks、状态管理和组件设计模式。
---

# React Components

React 组件开发和架构最佳实践。

## 技能范围

- 函数式组件和 Hooks
- 状态管理（Context、Redux、Zustand）
- 组件设计模式
- 性能优化
`
  },

  // Additional Frontend Skills
  {
    id: 'brand-guidelines',
    name: 'Brand Guidelines',
    description: '应用品牌色彩和排版规范，包括 Anthropic 官方品牌风格',
    category: categories[0],
    source: 'anthropic',
    triggers: ['品牌', '品牌色彩', '品牌规范', 'branding', '品牌设计'],
    priority: 6,
    content: `---
name: brand-guidelines
description: Applies Anthropic's official brand colors and typography to any sort of artifact that may benefit from having Anthropic's look-and-feel. Use it when brand colors or style guidelines, visual formatting, or company design standards apply.
license: Complete terms in LICENSE.txt
---

# Anthropic Brand Styling

## Overview

To access Anthropic's official brand identity and style resources, use this skill.

**Keywords**: branding, corporate identity, visual identity, post-processing, styling, brand colors, typography, Anthropic brand, visual formatting, visual design

## Brand Guidelines

### Colors

**Main Colors:**

- Dark: \`#141413\` - Primary text and dark backgrounds
- Light: \`#faf9f5\` - Light backgrounds and text on dark
- Mid Gray: \`#b0aea5\` - Secondary elements
- Light Gray: \`#e8e6dc\` - Subtle backgrounds

**Accent Colors:**

- Orange: \`#d97757\` - Primary accent
- Blue: \`#6a9bcc\` - Secondary accent
- Green: \`#788c5d\` - Tertiary accent

### Typography

- **Headings**: Poppins (with Arial fallback)
- **Body Text**: Lora (with Georgia fallback)
- **Note**: Fonts should be pre-installed in your environment for best results

## Features

### Smart Font Application

- Applies Poppins font to headings (24pt and larger)
- Applies Lora font to body text
- Automatically falls back to Arial/Georgia if custom fonts unavailable
- Preserves readability across all systems

### Text Styling

- Headings (24pt+): Poppins font
- Body text: Lora font
- Smart color selection based on background
- Preserves text hierarchy and formatting

### Shape and Accent Colors

- Non-text shapes use accent colors
- Cycles through orange, blue, and green accents
- Maintains visual interest while staying on-brand

## Technical Details

### Font Management

- Uses system-installed Poppins and Lora fonts when available
- Provides automatic fallback to Arial (headings) and Georgia (body)
- No font installation required - works with existing system fonts
- For best results, pre-install Poppins and Lora fonts in your environment

### Color Application

- Uses RGB color values for precise brand matching
- Applied via python-pptx's RGBColor class
- Maintains color fidelity across different systems
`
  },
  {
    id: 'canvas-design',
    name: 'Canvas Design',
    description: '创建高质量的视觉艺术和设计作品，使用 PDF 和 PNG 格式输出',
    category: categories[0],
    source: 'anthropic',
    triggers: ['海报', '艺术设计', '视觉创作', 'canvas', '设计'],
    priority: 7,
    content: `---
name: canvas-design
description: Create beautiful visual art in .png and .pdf documents using design philosophy. You should use this skill when the user asks to create a poster, piece of art, design, or other static piece. Create original visual designs, never copying existing artists' work to avoid copyright violations.
license: Complete terms in LICENSE.txt
---

These are instructions for creating design philosophies - aesthetic movements that are then EXPRESSED VISUALLY. Output only .md files, .pdf files, and .png files.

Complete this in two steps:
1. Design Philosophy Creation (.md file)
2. Express by creating it on a canvas (.pdf file or .png file)

First, undertake this task:

## DESIGN PHILOSOPHY CREATION

To begin, create a VISUAL PHILOSOPHY (not layouts or templates) that will be interpreted through:
- Form, space, color, composition
- Images, graphics, shapes, patterns
- Minimal text as visual accent

### THE CRITICAL UNDERSTANDING
- What is received: Some subtle input or instructions by the user that should be taken into account, but used as a foundation; it should not constrain creative freedom.
- What is created: A design philosophy/aesthetic movement.
- What happens next: Then, the same version receives the philosophy and EXPRESSES IT VISUALLY - creating artifacts that are 90% visual design, 10% essential text.

Consider this approach:
- Write a manifesto for an art movement
- The next phase involves making the artwork

The philosophy must emphasize: Visual expression. Spatial communication. Artistic interpretation. Minimal words.

### HOW TO GENERATE A VISUAL PHILOSOPHY

**Name the movement** (1-2 words): "Brutalist Joy" / "Chromatic Silence" / "Metabolist Dreams"

**Articulate the philosophy** (4-6 paragraphs - concise but complete):

To capture the VISUAL essence, express how the philosophy manifests through:
- Space and form
- Color and material
- Scale and rhythm
- Composition and balance
- Visual hierarchy

**CRITICAL GUIDELINES:**
- **Avoid redundancy**: Each design aspect should be mentioned once. Avoid repeating points about color theory, spatial relationships, or typographic principles unless adding new depth.
- **Emphasize craftsmanship REPEATEDLY**: The philosophy MUST stress multiple times that the final work should appear as though it took countless hours to create, was labored over with care, and comes from someone at the absolute top of their field. This framing is essential - repeat phrases like "meticulously crafted," "the product of deep expertise," "painstaking attention," "master-level execution."
- **Leave creative space**: Remain specific about the aesthetic direction, but concise enough that the next Claude has room to make interpretive choices also at a extremely high level of craftmanship.

The philosophy must guide the next version to express ideas VISUALLY, not through text. Information lives in design, not paragraphs.

### PHILOSOPHY EXAMPLES

**"Concrete Poetry"**
Philosophy: Communication through monumental form and bold geometry.
Visual expression: Massive color blocks, sculptural typography (huge single words, tiny labels), Brutalist spatial divisions, Polish poster energy meets Le Corbusier. Ideas expressed through visual weight and spatial tension, not explanation. Text as rare, powerful gesture - never paragraphs, only essential words integrated into the visual architecture. Every element placed with the precision of a master craftsman.

**"Chromatic Language"**
Philosophy: Color as the primary information system.
Visual expression: Geometric precision where color zones create meaning. Typography minimal - small sans-serif labels letting chromatic fields communicate. Think Josef Albers' interaction meets data visualization. Information encoded spatially and chromatically. Words only to anchor what color already shows. The result of painstaking chromatic calibration.

**"Analog Meditation"**
Philosophy: Quiet visual contemplation through texture and breathing room.
Visual expression: Paper grain, ink bleeds, vast negative space. Photography and illustration dominate. Typography whispered (small, restrained, serving the visual). Japanese photobook aesthetic. Images breathe across pages. Text appears sparingly - short phrases, never explanatory blocks. Each composition balanced with the care of a meditation practice.

**"Organic Systems"**
Philosophy: Natural clustering and modular growth patterns.
Visual expression: Rounded forms, organic arrangements, color from nature through architecture. Information shown through visual diagrams, spatial relationships, iconography. Text only for key labels floating in space. The composition tells the story through expert spatial orchestration.

**"Geometric Silence"**
Philosophy: Pure order and restraint.
Visual expression: Grid-based precision, bold photography or stark graphics, dramatic negative space. Typography precise but minimal - small essential text, large quiet zones. Swiss formalism meets Brutalist material honesty. Structure communicates, not words. Every alignment the work of countless refinements.

### ESSENTIAL PRINCIPLES
- **VISUAL PHILOSOPHY**: Create an aesthetic worldview to be expressed through design
- **MINIMAL TEXT**: Always emphasize that text is sparse, essential-only, integrated as visual element - never lengthy
- **SPATIAL EXPRESSION**: Ideas communicate through space, form, color, composition - not paragraphs
- **ARTISTIC FREEDOM**: The next Claude interprets the philosophy visually - provide creative room
- **PURE DESIGN**: This is about making ART OBJECTS, not documents with decoration
- **EXPERT CRAFTSMANSHIP**: Repeatedly emphasize the final work must look meticulously crafted, labored over with care, the product of countless hours by someone at the top of their field

**The design philosophy should be 4-6 paragraphs long.** Fill it with poetic design philosophy that brings together the core vision. Avoid repeating the same points. Keep the design philosophy generic without mentioning the intention of the art, as if it can be used wherever. Output the design philosophy as a .md file.

---

## DEDUCING THE SUBTLE REFERENCE

**CRITICAL STEP**: Before creating the canvas, identify the subtle conceptual thread from the original request.

**THE ESSENTIAL PRINCIPLE**:
The topic is a **subtle, niche reference embedded within the art itself** - not always literal, always sophisticated. Someone familiar with the subject should feel it intuitively, while others simply experience a masterful abstract composition. The design philosophy provides the aesthetic language. The deduced topic provides the soul - the quiet conceptual DNA woven invisibly into form, color, and composition.

This is **VERY IMPORTANT**: The reference must be refined so it enhances the work's depth without announcing itself. Think like a jazz musician quoting another song - only those who know will catch it, but everyone appreciates the music.

---

## CANVAS CREATION

With both the philosophy and the conceptual framework established, express it on a canvas. Take a moment to gather thoughts and clear the mind. Use the design philosophy created and the instructions below to craft a masterpiece, embodying all aspects of the philosophy with expert craftsmanship.

**IMPORTANT**: For any type of content, even if the user requests something for a movie/game/book, the approach should still be sophisticated. Never lose sight of the idea that this should be art, not something that's cartoony or amateur.

To create museum or magazine quality work, use the design philosophy as the foundation. Create one single page, highly visual, design-forward PDF or PNG output (unless asked for more pages). Generally use repeating patterns and perfect shapes. Treat the abstract philosophical design as if it were a scientific bible, borrowing the visual language of systematic observation—dense accumulation of marks, repeated elements, or layered patterns that build meaning through patient repetition and reward sustained viewing. Add sparse, clinical typography and systematic reference markers that suggest this could be a diagram from an imaginary discipline, treating the invisible subject with the same reverence typically reserved for documenting observable phenomena. Anchor the piece with simple phrase(s) or details positioned subtly, using a limited color palette that feels intentional and cohesive. Embrace the paradox of using analytical visual language to express ideas about human experience: the result should feel like an artifact that proves something ephemeral can be studied, mapped, and understood through careful attention. This is true art.

**Text as a contextual element**: Text is always minimal and visual-first, but let context guide whether that means whisper-quiet labels or bold typographic gestures. A punk venue poster might have larger, more aggressive type than a minimalist ceramics studio identity. Most of the time, font should be thin. All use of fonts must be design-forward and prioritize visual communication. Regardless of text scale, nothing falls off the page and nothing overlaps. Every element must be contained within the canvas boundaries with proper margins. Check carefully that all text, graphics, and visual elements have breathing room and clear separation. This is non-negotiable for professional execution. **IMPORTANT: Use different fonts if writing text. Search the \`./canvas-fonts\` directory. Regardless of approach, sophistication is non-negotiable.**

Download and use whatever fonts are needed to make this a reality. Get creative by making the typography actually part of the art itself -- if the art is abstract, bring the font onto the canvas, not typeset digitally.

To push boundaries, follow design instinct/intuition while using the philosophy as a guiding principle. Embrace ultimate design freedom and choice. Push aesthetics and design to the frontier.

**CRITICAL**: To achieve human-crafted quality (not AI-generated), create work that looks like it took countless hours. Make it appear as though someone at the absolute top of their field labored over every detail with painstaking care. Ensure the composition, spacing, color choices, typography - everything screams expert-level craftsmanship. Double-check that nothing overlaps, formatting is flawless, every detail perfect. Create something that could be shown to people to prove expertise and rank as undeniably impressive.

Output the final result as a single, downloadable .pdf or .png file, alongside the design philosophy used as a .md file.

---

## FINAL STEP

**IMPORTANT**: The user ALREADY said "It isn't perfect enough. It must be pristine, a masterpiece if craftsmanship, as if it were about to be displayed in a museum."

**CRITICAL**: To refine the work, avoid adding more graphics; instead refine what has been created and make it extremely crisp, respecting the design philosophy and the principles of minimalism entirely. Rather than adding a fun filter or refactoring a font, consider how to make the existing composition more cohesive with the art. If the instinct is to call a new function or draw a new shape, STOP and instead ask: "How can I make what's already here more of a piece of art?"

Take a second pass. Go back to the code and refine/polish further to make this a philosophically designed masterpiece.

## MULTI-PAGE OPTION

To create additional pages when requested, create more creative pages along the same lines as the design philosophy but distinctly different as well. Bundle those pages in the same .pdf or many .pngs. Treat the first page as just a single page in a whole coffee table book waiting to be filled. Make the next pages unique twists and memories of the original. Have them almost tell a story in a very tasteful way. Exercise full creative freedom.
`
  },
  {
    id: 'theme-factory',
    name: 'Theme Factory',
    description: '应用专业主题样式到幻灯片和文档，支持 10 种预设主题和自定义主题',
    category: categories[0],
    source: 'anthropic',
    triggers: ['主题', '主题样式', '配色方案', '设计主题'],
    priority: 6,
    content: `---
name: theme-factory
description: Toolkit for styling artifacts with a theme. These artifacts can be slides, docs, reportings, HTML landing pages, etc. There are 10 pre-set themes with colors/fonts that you can apply to any artifact that has been creating, or can generate a new theme on-the-fly.
license: Complete terms in LICENSE.txt
---


# Theme Factory Skill

This skill provides a curated collection of professional font and color themes themes, each with carefully selected color palettes and font pairings. Once a theme is chosen, it can be applied to any artifact.

## Purpose

To apply consistent, professional styling to presentation slide decks, use this skill. Each theme includes:
- A cohesive color palette with hex codes
- Complementary font pairings for headers and body text
- A distinct visual identity suitable for different contexts and audiences

## Usage Instructions

To apply styling to a slide deck or other artifact:

1. **Show the theme showcase**: Display the \`theme-showcase.pdf\` file to allow users to see all available themes visually. Do not make any modifications to it; simply show the file for viewing.
2. **Ask for their choice**: Ask which theme to apply to the deck
3. **Wait for selection**: Get explicit confirmation about the chosen theme
4. **Apply the theme**: Once a theme has been chosen, apply the selected theme's colors and fonts to the deck/artifact

## Themes Available

The following 10 themes are available, each showcased in \`theme-showcase.pdf\`:

1. **Ocean Depths** - Professional and calming maritime theme
2. **Sunset Boulevard** - Warm and vibrant sunset colors
3. **Forest Canopy** - Natural and grounded earth tones
4. **Modern Minimalist** - Clean and contemporary grayscale
5. **Golden Hour** - Rich and warm autumnal palette
6. **Arctic Frost** - Cool and crisp winter-inspired theme
7. **Desert Rose** - Soft and sophisticated dusty tones
8. **Tech Innovation** - Bold and modern tech aesthetic
9. **Botanical Garden** - Fresh and organic garden colors
10. **Midnight Galaxy** - Dramatic and cosmic deep tones

## Theme Details

Each theme is defined in the \`themes/\` directory with complete specifications including:
- Cohesive color palette with hex codes
- Complementary font pairings for headers and body text
- Distinct visual identity suitable for different contexts and audiences

## Application Process

After a preferred theme is selected:
1. Read the corresponding theme file from the \`themes/\` directory
2. Apply the specified colors and fonts consistently throughout the deck
3. Ensure proper contrast and readability
4. Maintain the theme's visual identity across all slides

## Create your Own Theme
To handle cases where none of the existing themes work for an artifact, create a custom theme. Based on provided inputs, generate a new theme similar to the ones above. Give the theme a similar name describing what the font/color combinations represent. Use any basic description provided to choose appropriate colors/fonts. After generating the theme, show it for review and verification. Following that, apply the theme as described above.
`
  },

  // Backend Skills
  {
    id: 'backend-development',
    name: 'Backend Development',
    description: '后端开发、API 设计、服务端架构',
    category: categories[1],
    source: 'claudekit',
    triggers: ['后端', 'API', '服务端', '服务器', 'REST', 'GraphQL'],
    priority: 6,
    content: `---
name: backend-development
description: |
  后端开发专家。
  精通 API 设计、数据库架构和服务端开发。
---

# Backend Development

全栈后端开发能力。

## 核心领域

- RESTful API 设计
- GraphQL API
- 数据库建模
- 认证和授权
- 微服务架构
`
  },
  {
    id: 'database-design',
    name: 'Database Design',
    description: '数据库设计、SQL 优化、数据建模',
    category: categories[1],
    source: 'claudekit',
    triggers: ['数据库', 'SQL', 'PostgreSQL', 'MySQL', 'MongoDB'],
    priority: 6,
    content: `---
name: database-design
description: |
  数据库设计和优化专家。
  支持关系型和非关系型数据库。
---

# Database Design

专业的数据库设计和优化技能。

## 支持的数据库

- PostgreSQL
- MySQL
- MongoDB
- Redis
- SQLite
`
  },

  // Testing Skills
  {
    id: 'webapp-testing',
    name: 'Web App Testing',
    description: '使用 Playwright 进行 E2E 测试',
    category: categories[2],
    source: 'community',
    triggers: ['E2E', '测试', 'playwright', '端到端', '自动化测试'],
    priority: 6,
    content: `---
name: webapp-testing
description: Toolkit for interacting with and testing local web applications using Playwright. Supports verifying frontend functionality, debugging UI behavior, capturing browser screenshots, and viewing browser logs.
license: Complete terms in LICENSE.txt
---

# Web Application Testing

To test local web applications, write native Python Playwright scripts.

**Helper Scripts Available**:
- \`scripts/with_server.py\` - Manages server lifecycle (supports multiple servers)

**Always run scripts with \`--help\` first** to see usage. DO NOT read the source until you try running the script first and find that a customized solution is abslutely necessary. These scripts can be very large and thus pollute your context window. They exist to be called directly as black-box scripts rather than ingested into your context window.

## Decision Tree: Choosing Your Approach

\`\`\`
User task -> Is it static HTML?
    ├─ Yes -> Read HTML file directly to identify selectors
    │         ├- Success -> Write Playwright script using selectors
    │         └- Fails/Incomplete -> Treat as dynamic (below)
    │
└─ No (dynamic webapp) -> Is the server already running?
    ├─ No -> Run: python scripts/with_server.py --help
    │        Then use the helper + write simplified Playwright script
    │
    └─ Yes -> Reconnaissance-then-action:
        1. Navigate and wait for networkidle
        2. Take screenshot or inspect DOM
        3. Identify selectors from rendered state
        4. Execute actions with discovered selectors
\`\`\`

## Example: Using with_server.py

To start a server, run \`--help\` first, then use the helper:

**Single server:**
\`\`\`bash
python scripts/with_server.py --server "npm run dev" --port 5173 -- python your_automation.py
\`\`\`

**Multiple servers (e.g., backend + frontend):**
\`\`\`bash
python scripts/with_server.py \\
  --server "cd backend && python server.py" --port 3000 \\
  --server "cd frontend && npm run dev" --port 5173 \\
  -- python your_automation.py
\`\`\`

To create an automation script, include only Playwright logic (servers are managed automatically):
\`\`\`python
from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True) # Always launch chromium in headless mode
    page = browser.new_page()
    page.goto('http://localhost:5173') # Server already running and ready
    page.wait_for_load_state('networkidle') # CRITICAL: Wait for JS to execute
    # ... your automation logic
    browser.close()
\`\`\`

## Reconnaissance-Then-Action Pattern

1. **Inspect rendered DOM**:
   \`\`\`python
   page.screenshot(path='/tmp/inspect.png', full_page=True)
   content = page.content()
   page.locator('button').all()
   \`\`\`

2. **Identify selectors** from inspection results

3. **Execute actions** using discovered selectors

## Common Pitfall

❌ **Don't** inspect the DOM before waiting for \`networkidle\` on dynamic apps
✅ **Do** wait for \`page.wait_for_load_state('networkidle')\` before inspection

## Best Practices

- **Use bundled scripts as black boxes** - To accomplish a task, consider whether one of the scripts available in \`scripts/\` can help. These scripts handle common, complex workflows reliably without cluttering the context window. Use \`--help\` to see usage, then invoke directly.
- Use \`sync_playwright()\` for synchronous scripts
- Always close the browser when done
- Use descriptive selectors: \`text=\`, \`role=\`, CSS selectors, or IDs
- Add appropriate waits: \`page.wait_for_selector()\` or \`page.wait_for_timeout()\`

## Reference Files

- **examples/** - Examples showing common patterns:
  - \`element_discovery.py\` - Discovering buttons, links, and inputs on a page
  - \`static_html_automation.py\` - Using file:// URLs for local HTML
  - \`console_logging.py\` - Capturing console logs during automation
`
  },
  {
    id: 'code-review',
    name: 'Code Review',
    description: '代码审查、PR 评审、质量检查',
    category: categories[2],
    source: 'community',
    triggers: ['审查', 'review', 'PR', '代码质量', 'Code Review'],
    priority: 7,
    content: `---
name: code-review
description: |
  代码审查专家。
  全面的 PR 评审和代码质量检查。
---

# Code Review

专业的代码审查和质量管理。

## 审查维度

- 代码正确性
- 性能考虑
- 安全问题
- 可维护性
- 最佳实践
`
  },

  // DevOps Skills
  {
    id: 'devops',
    name: 'DevOps',
    description: 'CI/CD、Docker、部署自动化',
    category: categories[3],
    source: 'claudekit',
    triggers: ['DevOps', 'CI/CD', '部署', 'Docker', 'Kubernetes'],
    priority: 6,
    content: `---
name: devops
description: |
  DevOps 自动化专家。
  精通 CI/CD、容器化和云部署。
---

# DevOps

现代化的 DevOps 实践和自动化。

## 核心技能

- Docker 容器化
- Kubernetes 编排
- GitHub Actions
- CI/CD 管道
- 云平台部署
`
  },
  {
    id: 'docker',
    name: 'Docker',
    description: 'Docker 容器化和容器编排',
    category: categories[3],
    source: 'community',
    triggers: ['Docker', '容器', 'Dockerfile', 'docker-compose'],
    priority: 6,
    content: `---
name: docker
description: |
  Docker 容器化专家。
  优化镜像构建和容器配置。
---

# Docker

专业的 Docker 容器化解决方案。

## 技能范围

- Dockerfile 优化
- 多阶段构建
- docker-compose 编排
- 镜像优化和安全
`
  },

  // Documentation Skills
  {
    id: 'document-skills',
    name: 'Document Skills',
    description: '文档生成、Markdown 处理',
    category: categories[5],
    source: 'community',
    triggers: ['文档', 'Markdown', 'readme', '文档生成'],
    priority: 5,
    content: `---
name: document-skills
description: |
  技术文档专家。
  生成高质量的 README 和 API 文档。
---

# Document Skills

专业的技术文档编写能力。

## 文档类型

- README 文档
- API 文档
- 用户指南
- 开发者文档
- 变更日志
`
  },
  {
    id: 'pdf',
    name: 'PDF',
    description: 'PDF 生成和处理',
    category: categories[5],
    source: 'anthropic',
    triggers: ['PDF', 'pdf文件', '导出PDF'],
    priority: 6,
    content: `---
name: pdf
description: |
  PDF 文档处理专家。
  生成、转换和处理 PDF 文件。
---

# PDF

PDF 文档处理解决方案。

## 能力范围

- PDF 生成
- PDF 转换
- 文档合并
- PDF 解析
`
  },

  // Additional Document Skills
  {
    id: 'doc-coauthoring',
    name: 'Doc Co-Authoring',
    description: '协同文档创作工作流，指导用户完成文档创建、编辑和审查流程',
    category: categories[5],
    source: 'anthropic',
    triggers: ['文档协作', '协同写作', '文档编辑', 'doc coauthoring'],
    priority: 7,
    content: `---
name: doc-coauthoring
description: Guide users through a structured workflow for co-authoring documentation. Use when user wants to write documentation, proposals, technical specs, decision docs, or similar structured content. This workflow helps users efficiently transfer context, refine content through iteration, and verify the doc works for readers. Trigger when user mentions writing docs, creating proposals, drafting specs, or similar documentation tasks.
---

# Doc Co-Authoring Workflow

This skill provides a structured workflow for guiding users through collaborative document creation. Act as an active guide, walking users through three stages: Context Gathering, Refinement & Structure, and Reader Testing.

## When to Offer This Workflow

**Trigger conditions:**
- User mentions writing documentation: "write a doc", "draft a proposal", "create a spec", "write up"
- User mentions specific doc types: "PRD", "design doc", "decision doc", "RFC"
- User seems to be starting a substantial writing task

**Initial offer:**
Offer the user a structured workflow for co-authoring the document. Explain the three stages:

1. **Context Gathering**: User provides all relevant context while Claude asks clarifying questions
2. **Refinement & Structure**: Iteratively build each section through brainstorming and editing
3. **Reader Testing**: Test the doc with a fresh Claude (no context) to catch blind spots before others read it

Explain that this approach helps ensure the doc works well when others read it (including when they paste it into Claude). Ask if they want to try this workflow or prefer to work freeform.

If user declines, work freeform. If user accepts, proceed to Stage 1.

## Stage 1: Context Gathering

**Goal:** Close the gap between what the user knows and what Claude knows, enabling smart guidance later.

### Initial Questions

Start by asking the user for meta-context about the document:

1. What type of document is this? (e.g., technical spec, decision doc, proposal)
2. Who's the primary audience?
3. What's the desired impact when someone reads this?
4. Is there a template or specific format to follow?
5. Any other constraints or context to know?

Inform them they can answer in shorthand or dump information however works best for them.

**If user provides a template or mentions a doc type:**
- Ask if they have a template document to share
- If they provide a link to a shared document, use the appropriate integration to fetch it
- If they provide a file, read it

**If user mentions editing an existing shared document:**
- Use the appropriate integration to read the current state
- Check for images without alt-text
- If images exist without alt-text, explain that when others use Claude to understand the doc, Claude won't be able to see them. Ask if they want alt-text generated. If so, request they paste each image into chat for descriptive alt-text generation.

### Info Dumping

Once initial questions are answered, encourage the user to dump all the context they have. Request information such as:
- Background on the project/problem
- Related team discussions or shared documents
- Why alternative solutions aren't being used
- Organizational context (team dynamics, past incidents, politics)
- Timeline pressures or constraints
- Technical architecture or dependencies
- Stakeholder concerns

Advise them not to worry about organizing it - just get it all out. Offer multiple ways to provide context:
- Info dump stream-of-consciousness
- Point to team channels or threads to read
- Link to shared documents

**If integrations are available** (e.g., Slack, Teams, Google Drive, SharePoint, or other MCP servers), mention that these can be used to pull in context directly.

**If no integrations are detected and in Claude.ai or Claude app:** Suggest they can enable connectors in their Claude settings to allow pulling context from messaging apps and document storage directly.

Inform them clarifying questions will be asked once they've done their initial dump.

**During context gathering:**

- If user mentions team channels or shared documents:
  - If integrations available: Inform them the content will be read now, then use the appropriate integration
  - If integrations not available: Explain lack of access. Suggest they enable connectors in Claude settings, or paste the relevant content directly.

- If user mentions entities/projects that are unknown:
  - Ask if connected tools should be searched to learn more
  - Wait for user confirmation before searching

- As user provides context, track what's being learned and what's still unclear

**Asking clarifying questions:**

When user signals they've done their initial dump (or after substantial context provided), ask clarifying questions to ensure understanding:

Generate 5-10 numbered questions based on gaps in the context.

Inform them they can use shorthand to answer (e.g., "1: yes, 2: see #channel, 3: no because backwards compat"), link to more docs, point to channels to read, or just keep info-dumping. Whatever's most efficient for them.

**Exit condition:**
Sufficient context has been gathered when questions show understanding - when edge cases and trade-offs can be asked about without needing basics explained.

**Transition:**
Ask if there's any more context they want to provide at this stage, or if it's time to move on to drafting the document.

If user wants to add more, let them. When ready, proceed to Stage 2.

## Stage 2: Refinement & Structure

**Goal:** Build the document section by section through brainstorming, curation, and iterative refinement.

**Instructions to user:**
Explain that the document will be built section by section. For each section:
1. Clarifying questions will be asked about what to include
2. 5-20 options will be brainstormed
3. User will indicate what to keep/remove/combine
4. The section will be drafted
5. It will be refined through surgical edits

Start with whichever section has the most unknowns (usually the core decision/proposal), then work through the rest.

**Section ordering:**

If the document structure is clear:
Ask which section they'd like to start with.

Suggest starting with whichever section has the most unknowns. For decision docs, that's usually the core proposal. For specs, it's typically the technical approach. Summary sections are best left for last.

If user doesn't know what sections they need:
Based on the type of document and template, suggest 3-5 sections appropriate for the doc type.

Ask if this structure works, or if they want to adjust it.

**Once structure is agreed:**

Create the initial document structure with placeholder text for all sections.

**If access to artifacts is available:**
Use \`create_file\` to create an artifact. This gives both Claude and the user a scaffold to work from.

Inform them that the initial structure with placeholders for all sections will be created.

Create artifact with all section headers and brief placeholder text like "[To be written]" or "[Content here]".

Provide the scaffold link and indicate it's time to fill in each section.

**If no access to artifacts:**
Create a markdown file in the working directory. Name it appropriately (e.g., \`decision-doc.md\`, \`technical-spec.md\`).

Inform them that the initial structure with placeholders for all sections will be created.

Create file with all section headers and placeholder text.

Confirm the filename has been created and indicate it's time to fill in each section.

**For each section:**

### Step 1: Clarifying Questions

Announce work will begin on the [SECTION NAME] section. Ask 5-10 clarifying questions about what should be included:

Generate 5-10 specific questions based on context and section purpose.

Inform them they can answer in shorthand or just indicate what's important to cover.

### Step 2: Brainstorming

For the [SECTION NAME] section, brainstorm [5-20] things that might be included, depending on the section's complexity. Look for:
- Context shared that might have been forgotten
- Angles or considerations not yet mentioned

Generate 5-20 numbered options based on section complexity. At the end, offer to brainstorm more if they want additional options.

### Step 3: Curation

Ask which points should be kept, removed, or combined. Request brief justifications to help learn priorities for the next sections.

Provide examples:
- "Keep 1,4,7,9"
- "Remove 3 (duplicates 1)"
- "Remove 6 (audience already knows this)"
- "Combine 11 and 12"

**If user gives freeform feedback** (e.g., "looks good" or "I like most of it but...") instead of numbered selections, extract their preferences and proceed. Parse what they want kept/removed/changed and apply it.

### Step 4: Gap Check

Based on what they've selected, ask if there's anything important missing for the [SECTION NAME] section.

### Step 5: Drafting

Use \`str_replace\` to replace the placeholder text for this section with the actual drafted content.

Announce the [SECTION NAME] section will be drafted now based on what they've selected.

**If using artifacts:**
After drafting, provide a link to the artifact.

Ask them to read through it and indicate what to change. Note that being specific helps learning for the next sections.

**If using a file (no artifacts):**
After drafting, confirm completion.

Inform them the [SECTION NAME] section has been drafted in [filename]. Ask them to read through it and indicate what to change. Note that being specific helps learning for the next sections.

**Key instruction for user (include when drafting the first section):**
Provide a note: Instead of editing the doc directly, ask them to indicate what to change. This helps learning of their style for future sections. For example: "Remove the X bullet - already covered by Y" or "Make the third paragraph more concise".

### Step 6: Iterative Refinement

As user provides feedback:
- Use \`str_replace\` to make edits (never reprint the whole doc)
- **If using artifacts:** Provide link to artifact after each edit
- **If using files:** Just confirm edits are complete
- If user edits doc directly and asks to read it: mentally note the changes they made and keep them in mind for future sections (this shows their preferences)

**Continue iterating** until user is satisfied with the section.

### Quality Checking

After 3 consecutive iterations with no substantial changes, ask if anything can be removed without losing important information.

When section is done, confirm [SECTION NAME] is complete. Ask if ready to move to the next section.

**Repeat for all sections.**

### Near Completion

As approaching completion (80%+ of sections done), announce intention to re-read the entire document and check for:
- Flow and consistency across sections
- Redundancy or contradictions
- Anything that feels like "slop" or generic filler
- Whether every sentence carries weight

Read entire document and provide feedback.

**When all sections are drafted and refined:**
Announce all sections are drafted. Indicate intention to review the complete document one more time.

Review for overall coherence, flow, completeness.

Provide any final suggestions.

Ask if ready to move to Reader Testing, or if they want to refine anything else.

## Stage 3: Reader Testing

**Goal:** Test the document with a fresh Claude (no context bleed) to verify it works for readers.

**Instructions to user:**
Explain that testing will now occur to see if the document actually works for readers. This catches blind spots - things that make sense to the authors but might confuse others.

### Testing Approach

**If access to sub-agents is available (e.g., in Claude Code):**

Perform the testing directly without user involvement.

### Step 1: Predict Reader Questions

Announce intention to predict what questions readers might ask when trying to discover this document.

Generate 5-10 questions that readers would realistically ask.

### Step 2: Test with Sub-Agent

Announce that these questions will be tested with a fresh Claude instance (no context from this conversation).

For each question, invoke a sub-agent with just the document content and the question.

Summarize what Reader Claude got right/wrong for each question.

### Step 3: Run Additional Checks

Announce additional checks will be performed.

Invoke sub-agent to check for ambiguity, false assumptions, contradictions.

Summarize any issues found.

### Step 4: Report and Fix

If issues found:
Report that Reader Claude struggled with specific issues.

List the specific issues.

Indicate intention to fix these gaps.

Loop back to refinement for problematic sections.

---

**If no access to sub-agents (e.g., claude.ai web interface):**

The user will need to do the testing manually.

### Step 1: Predict Reader Questions

Ask what questions people might ask when trying to discover this document. What would they type into Claude.ai?

Generate 5-10 questions that readers would realistically ask.

### Step 2: Setup Testing

Provide testing instructions:
1. Open a fresh Claude conversation: https://claude.ai
2. Paste or share the document content (if using a shared doc platform with connectors enabled, provide the link)
3. Ask Reader Claude the generated questions

For each question, instruct Reader Claude to provide:
- The answer
- Whether anything was ambiguous or unclear
- What knowledge/context the doc assumes is already known

Check if Reader Claude gives correct answers or misinterprets anything.

### Step 3: Additional Checks

Also ask Reader Claude:
- "What in this doc might be ambiguous or unclear to readers?"
- "What knowledge or context does this doc assume readers already have?"
- "Are there any internal contradictions or inconsistencies?"

### Step 4: Iterate Based on Results

Ask what Reader Claude got wrong or struggled with. Indicate intention to fix those gaps.

Loop back to refinement for any problematic sections.

---

### Exit Condition (Both Approaches)

When Reader Claude consistently answers questions correctly and doesn't surface new gaps or ambiguities, the doc is ready.

## Final Review

When Reader Testing passes:
Announce the doc has passed Reader Claude testing. Before completion:

1. Recommend they do a final read-through themselves - they own this document and are responsible for its quality
2. Suggest double-checking any facts, links, or technical details
3. Ask them to verify it achieves the impact they wanted

Ask if they want one more review, or if the work is done.

**If user wants final review, provide it. Otherwise:**
Announce document completion. Provide a few final tips:
- Consider linking this conversation in an appendix so readers can see how the doc was developed
- Use appendices to provide depth without bloating the main doc
- Update the doc as feedback is received from real readers

## Tips for Effective Guidance

**Tone:**
- Be direct and procedural
- Explain rationale briefly when it affects user behavior
- Don't try to "sell" the approach - just execute it

**Handling Deviations:**
- If user wants to skip a stage: Ask if they want to skip this and write freeform
- If user seems frustrated: Acknowledge this is taking longer than expected. Suggest ways to move faster
- Always give user agency to adjust the process

**Context Management:**
- Throughout, if context is missing on something mentioned, proactively ask
- Don't let gaps accumulate - address them as they come up

**Artifact Management:**
- Use \`create_file\` for drafting full sections
- Use \`str_replace\` for all edits
- Provide artifact link after every change
- Never use artifacts for brainstorming lists - that's just conversation

**Quality over Speed:**
- Don't rush through stages
- Each iteration should make meaningful improvements
- The goal is a document that actually works for readers
`
  },
  {
    id: 'docx',
    name: 'DOCX',
    description: '专业的 Word 文档创建、编辑和分析，支持跟踪更改、评论和格式保留',
    category: categories[5],
    source: 'anthropic',
    triggers: ['Word', 'docx', '文档编辑', 'Word文档'],
    priority: 7,
    content: `---
name: docx
description: "Comprehensive document creation, editing, and analysis with support for tracked changes, comments, formatting preservation, and text extraction. When Claude needs to work with professional documents (.docx files) for: (1) Creating new documents, (2) Modifying or editing content, (3) Working with tracked changes, (4) Adding comments, or any other document tasks"
license: Proprietary. LICENSE.txt has complete terms
---

# DOCX creation, editing, and analysis

## Overview

A user may ask you to create, edit, or analyze the contents of a .docx file. A .docx file is essentially a ZIP archive containing XML files and other resources that you can read or edit. You have different tools and workflows available for different tasks.

## Workflow Decision Tree

### Reading/Analyzing Content
Use "Text extraction" or "Raw XML access" sections below

### Creating New Document
Use "Creating a new Word document" workflow

### Editing Existing Document
- **Your own document + simple changes**
  Use "Basic OOXML editing" workflow

- **Someone else's document**
  Use **"Redlining workflow"** (recommended default)

- **Legal, academic, business, or government docs**
  Use **"Redlining workflow"** (required)

## Reading and analyzing content

### Text extraction
If you just need to read the text contents of a document, you should convert the document to markdown using pandoc. Pandoc provides excellent support for preserving document structure and can show tracked changes:

\`\`\`bash
# Convert document to markdown with tracked changes
pandoc --track-changes=all path-to-file.docx -o output.md
# Options: --track-changes=accept/reject/all
\`\`\`

### Raw XML access
You need raw XML access for: comments, complex formatting, document structure, embedded media, and metadata. For any of these features, you'll need to unpack a document and read its raw XML contents.

#### Unpacking a file
\`python ooxml/scripts/unpack.py <office_file> <output_directory>\`

#### Key file structures
* \`word/document.xml\` - Main document contents
* \`word/comments.xml\` - Comments referenced in document.xml
* \`word/media/\` - Embedded images and media files
* Tracked changes use \`<w:ins>\` (insertions) and \`<w:del>\` (deletions) tags

## Creating a new Word document

When creating a new Word document from scratch, use **docx-js**, which allows you to create Word documents using JavaScript/TypeScript.

### Workflow
1. **MANDATORY - READ ENTIRE FILE**: Read [\`docx-js.md\`](docx-js.md) (~500 lines) completely from start to finish. **NEVER set any range limits when reading this file.** Read the full file content for detailed syntax, critical formatting rules, and best practices before proceeding with document creation.
2. Create a JavaScript/TypeScript file using Document, Paragraph, TextRun components (You can assume all dependencies are installed, but if not, refer to the dependencies section below)
3. Export as .docx using Packer.toBuffer()

## Editing an existing Word document

When editing an existing Word document, use the **Document library** (a Python library for OOXML manipulation). The library automatically handles infrastructure setup and provides methods for document manipulation. For complex scenarios, you can access the underlying DOM directly through the library.

### Workflow
1. **MANDATORY - READ ENTIRE FILE**: Read [\`ooxml.md\`](ooxml.md) (~600 lines) completely from start to finish. **NEVER set any range limits when reading this file.** Read the full file content for the Document library API and XML patterns for directly editing document files.
2. Unpack the document: \`python ooxml/scripts/unpack.py <office_file> <output_directory>\`
3. Create and run a Python script using the Document library (see "Document Library" section in ooxml.md)
4. Pack the final document: \`python ooxml/scripts/pack.py <input_directory> <office_file>\`

The Document library provides both high-level methods for common operations and direct DOM access for complex scenarios.

## Redlining workflow for document review

This workflow allows you to plan comprehensive tracked changes using markdown before implementing them in OOXML. **CRITICAL**: For complete tracked changes, you must implement ALL changes systematically.

**Batching Strategy**: Group related changes into batches of 3-10 changes. This makes debugging manageable while maintaining efficiency. Test each batch before moving to the next.

**Principle: Minimal, Precise Edits**
When implementing tracked changes, only mark text that actually changes. Repeating unchanged text makes edits harder to review and appears unprofessional. Break replacements into: [unchanged text] + [deletion] + [insertion] + [unchanged text]. Preserve the original run's RSID for unchanged text by extracting the \`<w:r>\` element from the original and reusing it.

### Tracked changes workflow

1. **Get markdown representation**: Convert document to markdown with tracked changes preserved:
   \`\`\`bash
   pandoc --track-changes=all path-to-file.docx -o current.md
   \`\`\`

2. **Identify and group changes**: Review the document and identify ALL changes needed, organizing them into logical batches:

   **Location methods** (for finding changes in XML):
   - Section/heading numbers (e.g., "Section 3.2", "Article IV")
   - Paragraph identifiers if numbered
   - Grep patterns with unique surrounding text
   - Document structure (e.g., "first paragraph", "signature block")
   - **DO NOT use markdown line numbers** - they don't map to XML structure

   **Batch organization** (group 3-10 related changes per batch):
   - By section: "Batch 1: Section 2 amendments", "Batch 2: Section 5 updates"
   - By type: "Batch 1: Date corrections", "Batch 2: Party name changes"
   - By complexity: Start with simple text replacements, then tackle complex structural changes
   - Sequential: "Batch 1: Pages 1-3", "Batch 2: Pages 4-6"

3. **Read documentation and unpack**:
   - **MANDATORY - READ ENTIRE FILE**: Read [\`ooxml.md\`](ooxml.md) (~600 lines) completely from start to finish. **NEVER set any range limits when reading this file.** Pay special attention to the "Document Library" and "Tracked Change Patterns" sections.
   - **Unpack the document**: \`python ooxml/scripts/unpack.py <file.docx> <dir>\`
   - **Note the suggested RSID**: The unpack script will suggest an RSID to use for your tracked changes. Copy this RSID for use in step 4b.

4. **Implement changes in batches**: Group changes logically (by section, by type, or by proximity) and implement them together in a single script. This approach:
   - Makes debugging easier (smaller batch = easier to isolate errors)
   - Allows incremental progress
   - Maintains efficiency (batch size of 3-10 changes works well)

5. **Pack the document**: After all batches are complete, convert the unpacked directory back to .docx:
   \`\`\`bash
   python ooxml/scripts/pack.py unpacked reviewed-document.docx
   \`\`\`

6. **Final verification**: Do a comprehensive check of the complete document:
   - Convert final document to markdown:
     \`\`\`bash
     pandoc --track-changes=all reviewed-document.docx -o verification.md
     \`\`\`
   - Verify ALL changes were applied correctly
   - Check that no unintended changes were introduced

## Converting Documents to Images

To visually analyze Word documents, convert them to images using a two-step process:

1. **Convert DOCX to PDF**:
   \`\`\`bash
   soffice --headless --convert-to pdf document.docx
   \`\`\`

2. **Convert PDF pages to JPEG images**:
   \`\`\`bash
   pdftoppm -jpeg -r 150 document.pdf page
   \`\`\`
   This creates files like \`page-1.jpg\`, \`page-2.jpg\`, etc.

## Code Style Guidelines
**IMPORTANT**: When generating code for DOCX operations:
- Write concise code
- Avoid verbose variable names and redundant operations
- Avoid unnecessary print statements

## Dependencies

Required dependencies (install if not available):

- **pandoc**: \`sudo apt-get install pandoc\` (for text extraction)
- **docx**: \`npm install -g docx\` (for creating new documents)
- **LibreOffice**: \`sudo apt-get install libreoffice\` (for PDF conversion)
- **Poppler**: \`sudo apt-get install poppler-utils\` (for pdftoppm to convert PDF to images)
- **defusedxml**: \`pip install defusedxml\` (for secure XML parsing)
`
  },
  {
    id: 'pptx',
    name: 'PPTX',
    description: '专业的 PowerPoint 演示文稿创建、编辑和分析，支持布局和幻灯片管理',
    category: categories[5],
    source: 'anthropic',
    triggers: ['PowerPoint', 'pptx', '演示文稿', '幻灯片'],
    priority: 7,
    content: `---
name: pptx
description: "Presentation creation, editing, and analysis. When Claude needs to work with presentations (.pptx files) for: (1) Creating new presentations, (2) Modifying or editing content, (3) Working with layouts, (4) Adding comments or speaker notes, or any other presentation tasks"
license: Proprietary. LICENSE.txt has complete terms
---

# PPTX creation, editing, and analysis

## Overview

A user may ask you to create, edit, or analyze the contents of a .pptx file. A .pptx file is essentially a ZIP archive containing XML files and other resources that you can read or edit. You have different tools and workflows available for different tasks.

## Reading and analyzing content

### Text extraction
If you just need to read the text contents of a presentation, you should convert the document to markdown:

\`\`\`bash
# Convert document to markdown
python -m markitdown path-to-file.pptx
\`\`\`

### Raw XML access
You need raw XML access for: comments, speaker notes, slide layouts, animations, design elements, and complex formatting. For any of these features, you'll need to unpack a presentation and read its raw XML contents.

#### Unpacking a file
\`python ooxml/scripts/unpack.py <office_file> <output_dir>\`

#### Key file structures
* \`ppt/presentation.xml\` - Main presentation metadata and slide references
* \`ppt/slides/slide{N}.xml\` - Individual slide contents (slide1.xml, slide2.xml, etc.)
* \`ppt/notesSlides/notesSlide{N}.xml\` - Speaker notes for each slide
* \`ppt/comments/modernComment_*.xml\` - Comments for specific slides
* \`ppt/slideLayouts/\` - Layout templates for slides
* \`ppt/slideMasters/\` - Master slide templates
* \`ppt/theme/\` - Theme and styling information
* \`ppt/media/\` - Images and other media files

## Creating a new PowerPoint presentation **without a template**

When creating a new PowerPoint presentation from scratch, use the **html2pptx** workflow to convert HTML slides to PowerPoint with accurate positioning.

### Workflow
1. **MANDATORY - READ ENTIRE FILE**: Read [\`html2pptx.md\`](html2pptx.md) completely from start to finish. **NEVER set any range limits when reading this file.** Read the full file content for detailed syntax, critical formatting rules, and best practices before proceeding with presentation creation.
2. Create an HTML file for each slide with proper dimensions (e.g., 720pt × 405pt for 16:9)
3. Create and run a JavaScript file using the [\`html2pptx.js\`](scripts/html2pptx.js) library to convert HTML slides to PowerPoint and save the presentation
4. **Visual validation**: Generate thumbnails and inspect for layout issues

## Editing an existing PowerPoint presentation

When edit slides in an existing PowerPoint presentation, you need to work with the raw Office Open XML (OOXML) format. This involves unpacking the .pptx file, editing the XML content, and repacking it.

### Workflow
1. **MANDATORY - READ ENTIRE FILE**: Read [\`ooxml.md\`](ooxml.md) (~500 lines) completely from start to finish.
2. Unpack the presentation: \`python ooxml/scripts/unpack.py <office_file> <output_dir>\`
3. Edit the XML files (primarily \`ppt/slides/slide{N}.xml\` and related files)
4. **CRITICAL**: Validate immediately after each edit and fix any validation errors before proceeding
5. Pack the final presentation: \`python ooxml/scripts/pack.py <input_directory> <office_file>\`

## Creating Thumbnail Grids

To create visual thumbnail grids of PowerPoint slides for quick analysis and reference:

\`\`\`bash
python scripts/thumbnail.py template.pptx [output_prefix]
\`\`\`

## Converting Slides to Images

To visually analyze PowerPoint slides, convert them to images using a two-step process:

1. **Convert PPTX to PDF**:
   \`\`\`bash
   soffice --headless --convert-to pdf template.pptx
   \`\`\`

2. **Convert PDF pages to JPEG images**:
   \`\`\`bash
   pdftoppm -jpeg -r 150 template.pdf slide
   \`\`\`

## Code Style Guidelines
**IMPORTANT**: When generating code for PPTX operations:
- Write concise code
- Avoid verbose variable names and redundant operations
- Avoid unnecessary print statements

## Dependencies

Required dependencies (should already be installed):

- **markitdown**: \`pip install "markitdown[pptx]"\` (for text extraction from presentations)
- **pptxgenjs**: \`npm install -g pptxgenjs\` (for creating presentations via html2pptx)
- **playwright**: \`npm install -g playwright\` (for HTML rendering in html2pptx)
- **LibreOffice**: \`sudo apt-get install libreoffice\` (for PDF conversion)
- **Poppler**: \`sudo apt-get install poppler-utils\` (for pdftoppm to convert PDF to images)
- **defusedxml**: \`pip install defusedxml\` (for secure XML parsing)
`
  },
  {
    id: 'xlsx',
    name: 'XLSX',
    description: '专业的电子表格创建、编辑和分析，支持公式、格式和数据可视化',
    category: categories[5],
    source: 'anthropic',
    triggers: ['Excel', 'xlsx', '电子表格', '电子表格公式'],
    priority: 7,
    content: `---
name: xlsx
description: "Comprehensive spreadsheet creation, editing, and analysis with support for formulas, formatting, data analysis, and visualization. When Claude needs to work with spreadsheets (.xlsx, .xlsm, .csv, .tsv, etc) for: (1) Creating new spreadsheets with formulas and formatting, (2) Reading or analyzing data, (3) Modify existing spreadsheets while preserving formulas, (4) Data analysis and visualization in spreadsheets, or (5) Recalculating formulas"
license: Proprietary. LICENSE.txt has complete terms
---

# Requirements for Outputs

## All Excel files

### Zero Formula Errors
- Every Excel model MUST be delivered with ZERO formula errors (#REF!, #DIV/0!, #VALUE!, #N/A, #NAME?)

### Preserve Existing Templates (when updating templates)
- Study and EXACTLY match existing format, style, and conventions when modifying files
- Never impose standardized formatting on files with established patterns
- Existing template conventions ALWAYS override these guidelines

## Financial models

### Color Coding Standards
Unless otherwise stated by the user or existing template

#### Industry-Standard Color Conventions
- **Blue text (RGB: 0,0,255)**: Hardcoded inputs, and numbers users will change for scenarios
- **Black text (RGB: 0,0,0)**: ALL formulas and calculations
- **Green text (RGB: 0,128,0)**: Links pulling from other worksheets within same workbook
- **Red text (RGB: 255,0,0)**: External links to other files
- **Yellow background (RGB: 255,255,0)**: Key assumptions needing attention or cells that need to be updated

### Number Formatting Standards

#### Required Format Rules
- **Years**: Format as text strings (e.g., "2024" not "2,024")
- **Currency**: Use $#,##0 format; ALWAYS specify units in headers ("Revenue ($mm)")
- **Zeros**: Use number formatting to make all zeros "-", including percentages (e.g., "$#,##0;($#,##0);-")
- **Percentages**: Default to 0.0% format (one decimal)
- **Multiples**: Format as 0.0x for valuation multiples (EV/EBITDA, P/E)
- **Negative numbers**: Use parentheses (123) not minus -123

### Formula Construction Rules

#### Assumptions Placement
- Place ALL assumptions (growth rates, margins, multiples, etc.) in separate assumption cells
- Use cell references instead of hardcoded values in formulas
- Example: Use =B5*(1+$B$6) instead of =B5*1.05

#### Formula Error Prevention
- Verify all cell references are correct
- Check for off-by-one errors in ranges
- Ensure consistent formulas across all projection periods
- Test with edge cases (zero values, negative numbers)
- Verify no unintended circular references

#### Documentation Requirements for Hardcodes
- Comment or in cells beside (if end of table). Format: "Source: [System/Document], [Date], [Specific Reference], [URL if applicable]"
- Examples:
  - "Source: Company 10-K, FY2024, Page 45, Revenue Note, [SEC EDGAR URL]"
  - "Source: Company 10-Q, Q2 2025, Exhibit 99.1, [SEC EDGAR URL]"
  - "Source: Bloomberg Terminal, 8/15/2025, AAPL US Equity"
  - "Source: FactSet, 8/20/2025, Consensus Estimates Screen"

# XLSX creation, editing, and analysis

## Overview

A user may ask you to create, edit, or analyze the contents of an .xlsx file. You have different tools and workflows available for different tasks.

## Important Requirements

**LibreOffice Required for Formula Recalculation**: You can assume LibreOffice is installed for recalculating formula values using the \`recalc.py\` script. The script automatically configures LibreOffice on first run

## Reading and analyzing data

### Data analysis with pandas
For data analysis, visualization, and basic operations, use **pandas** which provides powerful data manipulation capabilities:

\`\`\`python
import pandas as pd

# Read Excel
df = pd.read_excel('file.xlsx')  # Default: first sheet
all_sheets = pd.read_excel('file.xlsx', sheet_name=None)  # All sheets as dict

# Analyze
df.head()      # Preview data
df.info()      # Column info
df.describe()  # Statistics

# Write Excel
df.to_excel('output.xlsx', index=False)
\`\`\`

## Common Workflow
1. **Choose tool**: pandas for data, openpyxl for formulas/formatting
2. **Create/Load**: Create new workbook or load existing file
3. **Modify**: Add/edit data, formulas, and formatting
4. **Save**: Write to file
5. **Recalculate formulas (MANDATORY IF USING FORMULAS)**: Use the recalc.py script
6. **Verify and fix any errors**: Fix identified errors and recalculate again

### Creating new Excel files

\`\`\`python
# Using openpyxl for formulas and formatting
from openpyxl import Workbook
from openpyxl.styles import Font, PatternFill, Alignment

wb = Workbook()
sheet = wb.active

# Add data
sheet['A1'] = 'Hello'
sheet['B1'] = 'World'
sheet.append(['Row', 'of', 'data'])

# Add formula
sheet['B2'] = '=SUM(A1:A10)'

# Formatting
sheet['A1'].font = Font(bold=True, color='FF0000')
sheet['A1'].fill = PatternFill('solid', start_color='FFFF00')
sheet['A1'].alignment = Alignment(horizontal='center')

# Column width
sheet.column_dimensions['A'].width = 20

wb.save('output.xlsx')
\`\`\`

### Editing existing Excel files

\`\`\`python
# Using openpyxl to preserve formulas and formatting
from openpyxl import load_workbook

# Load existing file
wb = load_workbook('existing.xlsx')
sheet = wb.active  # or wb['SheetName'] for specific sheet

# Working with multiple sheets
for sheet_name in wb.sheetnames:
    sheet = wb[sheet_name]
    print(f"Sheet: {sheet_name}")

# Modify cells
sheet['A1'] = 'New Value'
sheet.insert_rows(2)  # Insert row at position 2
sheet.delete_cols(3)  # Delete column 3

# Add new sheet
new_sheet = wb.create_sheet('NewSheet')
new_sheet['A1'] = 'Data'

wb.save('modified.xlsx')
\`\`\`

## Recalculating formulas

Excel files created or modified by openpyxl contain formulas as strings but not calculated values. Use the provided \`recalc.py\` script to recalculate formulas:

\`\`\`bash
python recalc.py <excel_file> [timeout_seconds]
\`\`\`

## Best Practices

### Library Selection
- **pandas**: Best for data analysis, bulk operations, and simple data export
- **openpyxl**: Best for complex formatting, formulas, and Excel-specific features

### Working with openpyxl
- Cell indices are 1-based (row=1, column=1 refers to cell A1)
- Use \`data_only=True\` to read calculated values: \`load_workbook('file.xlsx', data_only=True)\`
- **Warning**: If opened with \`data_only=True\` and saved, formulas are replaced with values and permanently lost
- For large files: Use \`read_only=True\` for reading or \`write_only=True\` for writing
- Formulas are preserved but not evaluated - use recalc.py to update values

### Working with pandas
- Specify data types to avoid inference issues: \`pd.read_excel('file.xlsx', dtype={'id': str})\`
- For large files, read specific columns: \`pd.read_excel('file.xlsx', usecols=['A', 'C', 'E'])\`
- Handle dates properly: \`pd.read_excel('file.xlsx', parse_dates=['date_column'])\`

## Code Style Guidelines
**IMPORTANT**: When generating Python code for Excel operations:
- Write minimal, concise Python code without unnecessary comments
- Avoid verbose variable names and redundant operations
- Avoid unnecessary print statements

**For Excel files themselves**:
- Add comments to cells with complex formulas or important assumptions
- Document data sources for hardcoded values
- Include notes for key calculations and model sections
`
  },

  // Knowledge Management Skills (Obsidian)
  {
    id: 'obsidian-markdown',
    name: 'Obsidian Markdown',
    description: '创建和编辑 Obsidian 风格的 Markdown 文件，支持 wikilinks、callouts、properties 等',
    category: categories[6],
    source: 'obsidian',
    triggers: ['Obsidian', 'wikilinks', 'callout', 'markdown', '双链', '知识库', 'Obsidian笔记'],
    priority: 7,
    content: `---
name: obsidian-markdown
description: Create and edit Obsidian Flavored Markdown with wikilinks, embeds, callouts, properties, and other Obsidian-specific syntax. Use when working with .md files in Obsidian, or when the user mentions wikilinks, callouts, frontmatter, tags, embeds, or Obsidian notes.
---

# Obsidian Flavored Markdown Skill

This skill enables Claude Code to create and edit valid Obsidian Flavored Markdown, including all Obsidian-specific syntax extensions.

## Overview

Obsidian uses a combination of Markdown flavors:
- [CommonMark](https://commonmark.org/)
- [GitHub Flavored Markdown](https://github.github.com/gfm/)
- [LaTeX](https://www.latex-project.org/) for math
- Obsidian-specific extensions (wikilinks, callouts, embeds, etc.)

For complete syntax reference, see the full SKILL.md file in obsidian-skills/obsidian-markdown/
`
  },
  {
    id: 'obsidian-bases',
    name: 'Obsidian Bases',
    description: '创建和编辑 Obsidian Bases 格式文件，支持数据库视图和结构化数据',
    category: categories[6],
    source: 'obsidian',
    triggers: ['Obsidian Bases', 'base文件', '数据库视图', 'Obsidian数据库', 'Bases', '视图'],
    priority: 6,
    content: `---
name: obsidian-bases
version: "1.0.0"
description: Create and edit Obsidian Bases (.base files) with views, filters, formulas, and summaries. Use when working with .base files, creating database-like views of notes, or when the user mentions Bases, table views, card views, filters, or formulas in Obsidian.
---

# Obsidian Bases Skill

This skill enables Claude Code to create and edit valid Obsidian Bases (\`.base\` files) including views, filters, formulas, and all related configurations.

## Overview

Obsidian Bases are YAML-based files that define dynamic views of notes in an Obsidian vault. A Base file can contain multiple views, global filters, formulas, property configurations, and custom summaries.

For complete syntax reference, see the full SKILL.md file in obsidian-skills/obsidian-bases/
`
  },
  {
    id: 'json-canvas',
    name: 'JSON Canvas',
    description: '创建和编辑 JSON Canvas 无限画布文件，可视化知识图谱',
    category: categories[6],
    source: 'obsidian',
    triggers: ['JSON Canvas', 'canvas', '画布', '可视化', '知识图谱', 'Canvas文件', '无限画布'],
    priority: 6,
    content: `---
name: json-canvas
version: "1.0.0"
description: Create and edit JSON Canvas files (.canvas) with nodes, edges, groups, and connections. Use when working with .canvas files, creating visual canvases, mind maps, flowcharts, or when the user mentions Canvas files in Obsidian.
---

# JSON Canvas Skill

This skill enables Claude Code to create and edit valid JSON Canvas files (\`.canvas\`) used in Obsidian and other applications.

## Overview

JSON Canvas is an open file format for infinite canvas data. Canvas files use the \`.canvas\` extension and contain valid JSON following the [JSON Canvas Spec 1.0](https://jsoncanvas.org/spec/1.0/).

For complete syntax reference, see the full SKILL.md file in obsidian-skills/json-canvas/
`
  },

  // Media Skills
  {
    id: 'image-enhancer',
    name: 'Image Enhancer',
    description: '图片增强和处理',
    category: categories[7],
    source: 'community',
    triggers: ['图片', '图像', '增强', 'Image'],
    priority: 5,
    content: `---
name: image-enhancer
description: |
  图片处理和增强专家。
  图像编辑、优化和格式转换。
---

# Image Enhancer

专业的图片处理解决方案。

## 功能特性

- 图片裁剪和调整
- 格式转换
- 压缩优化
- 滤镜应用
`
  },

  // Additional Media Skills
  {
    id: 'algorithmic-art',
    name: 'Algorithmic Art',
    description: '使用 p5.js 创建算法艺术、生成艺术和交互式视觉作品',
    category: categories[7],
    source: 'anthropic',
    triggers: ['算法艺术', '生成艺术', 'p5.js', '创意编程'],
    priority: 6,
    content: `---
name: algorithmic-art
description: Creating algorithmic art using p5.js with seeded randomness and interactive parameter exploration. Use this when users request creating art using code, generative art, algorithmic art, flow fields, or particle systems. Create original algorithmic art rather than copying existing artists' work to avoid copyright violations.
license: Complete terms in LICENSE.txt
---

Algorithmic philosophies are computational aesthetic movements that are then expressed through code. Output .md files (philosophy), .html files (interactive viewer), and .js files (generative algorithms).

This happens in two steps:
1. Algorithmic Philosophy Creation (.md file)
2. Express by creating p5.js generative art (.html + .js files)

First, undertake this task:

## ALGORITHMIC PHILOSOPHY CREATION

To begin, create an ALGORITHMIC PHILOSOPHY (not static images or templates) that will be interpreted through:
- Computational processes, emergent behavior, mathematical beauty
- Seeded randomness, noise fields, organic systems
- Particles, flows, fields, forces
- Parametric variation and controlled chaos

### THE CRITICAL UNDERSTANDING
- What is received: Some subtle input or instructions by the user to take into account, but use as a foundation; it should not constrain creative freedom.
- What is created: An algorithmic philosophy/generative aesthetic movement.
- What happens next: The same version receives the philosophy and EXPRESSES IT IN CODE - creating p5.js sketches that are 90% algorithmic generation, 10% essential parameters.

Consider this approach:
- Write a manifesto for a generative art movement
- The next phase involves writing the algorithm that brings it to life

The philosophy must emphasize: Algorithmic expression. Emergent behavior. Computational beauty. Seeded variation.

### HOW TO GENERATE AN ALGORITHMIC PHILOSOPHY

**Name the movement** (1-2 words): "Organic Turbulence" / "Quantum Harmonics" / "Emergent Stillness"

**Articulate the philosophy** (4-6 paragraphs - concise but complete):

To capture the ALGORITHMIC essence, express how this philosophy manifests through:
- Computational processes and mathematical relationships?
- Noise functions and randomness patterns?
- Particle behaviors and field dynamics?
- Temporal evolution and system states?
- Parametric variation and emergent complexity?

**CRITICAL GUIDELINES:**
- **Avoid redundancy**: Each algorithmic aspect should be mentioned once. Avoid repeating concepts about noise theory, particle dynamics, or mathematical principles unless adding new depth.
- **Emphasize craftsmanship REPEATEDLY**: The philosophy MUST stress multiple times that the final algorithm should appear as though it took countless hours to develop, was refined with care, and comes from someone at the absolute top of their field. This framing is essential - repeat phrases like "meticulously crafted algorithm," "the product of deep computational expertise," "painstaking optimization," "master-level implementation."
- **Leave creative space**: Be specific about the algorithmic direction, but concise enough that the next Claude has room to make interpretive implementation choices at an extremely high level of craftsmanship.

The philosophy must guide the next version to express ideas ALGORITHMICALLY, not through static images. Beauty lives in the process, not the final frame.

### PHILOSOPHY EXAMPLES

**"Organic Turbulence"**
Philosophy: Chaos constrained by natural law, order emerging from disorder.
Algorithmic expression: Flow fields driven by layered Perlin noise. Thousands of particles following vector forces, their trails accumulating into organic density maps. Multiple noise octaves create turbulent regions and calm zones. Color emerges from velocity and density - fast particles burn bright, slow ones fade to shadow. The algorithm runs until equilibrium - a meticulously tuned balance where every parameter was refined through countless iterations by a master of computational aesthetics.

**"Quantum Harmonics"**
Philosophy: Discrete entities exhibiting wave-like interference patterns.
Algorithmic expression: Particles initialized on a grid, each carrying a phase value that evolves through sine waves. When particles are near, their phases interfere - constructive interference creates bright nodes, destructive creates voids. Simple harmonic motion generates complex emergent mandalas. The result of painstaking frequency calibration where every ratio was carefully chosen to produce resonant beauty.

**"Recursive Whispers"**
Philosophy: Self-similarity across scales, infinite depth in finite space.
Algorithmic expression: Branching structures that subdivide recursively. Each branch slightly randomized but constrained by golden ratios. L-systems or recursive subdivision generate tree-like forms that feel both mathematical and organic. Subtle noise perturbations break perfect symmetry. Line weights diminish with each recursion level. Every branching angle the product of deep mathematical exploration.

### ESSENTIAL PRINCIPLES
- **ALGORITHMIC PHILOSOPHY**: Creating a computational worldview to be expressed through code
- **PROCESS OVER PRODUCT**: Always emphasize that beauty emerges from the algorithm's execution - each run is unique
- **PARAMETRIC EXPRESSION**: Ideas communicate through mathematical relationships, forces, behaviors - not static composition
- **ARTISTIC FREEDOM**: The next Claude interprets the philosophy algorithmically - provide creative implementation room
- **PURE GENERATIVE ART**: This is about making LIVING ALGORITHMS, not static images with randomness
- **EXPERT CRAFTSMANSHIP**: Repeatedly emphasize the final algorithm must feel meticulously crafted, refined through countless iterations, the product of deep expertise by someone at the absolute top of their field in computational aesthetics

**The algorithmic philosophy should be 4-6 paragraphs long.** Fill it with poetic computational philosophy that brings together the intended vision. Avoid repeating the same points. Output this algorithmic philosophy as a .md file.

---

## DEDUCING THE CONCEPTUAL SEED

**CRITICAL STEP**: Before implementing the algorithm, identify the subtle conceptual thread from the original request.

**THE ESSENTIAL PRINCIPLE**:
The concept is a **subtle, niche reference embedded within the algorithm itself** - not always literal, always sophisticated. Someone familiar with the subject should feel it intuitively, while others simply experience a masterful generative composition. The algorithmic philosophy provides the computational language. The deduced concept provides the soul - the quiet conceptual DNA woven invisibly into parameters, behaviors, and emergence patterns.

---

## P5.JS IMPLEMENTATION

With the philosophy AND conceptual framework established, express it through code.

### TECHNICAL REQUIREMENTS

**Seeded Randomness (Art Blocks Pattern)**:
\`\`\`javascript
// ALWAYS use a seed for reproducibility
let seed = 12345; // or hash from user input
randomSeed(seed);
noiseSeed(seed);
\`\`\`

**Parameter Structure - FOLLOW THE PHILOSOPHY**:
\`\`\`javascript
let params = {
  seed: 12345,  // Always include seed for reproducibility
  // colors
  // Add parameters that control YOUR algorithm
};
\`\`\`

**Core Algorithm - EXPRESS THE PHILOSOPHY**:
The algorithmic philosophy should dictate what to build.

**Canvas Setup**: Standard p5.js structure:
\`\`\`javascript
function setup() {
  createCanvas(1200, 1200);
  // Initialize your system
}

function draw() {
  // Your generative algorithm
  // Can be static (noLoop) or animated
}
\`\`\`

### CRAFTSMANSHIP REQUIREMENTS

**CRITICAL**: To achieve mastery, create algorithms that feel like they emerged through countless iterations by a master generative artist.

- **Balance**: Complexity without visual noise, order without rigidity
- **Color Harmony**: Thoughtful palettes, not random RGB values
- **Composition**: Even in randomness, maintain visual hierarchy and flow
- **Performance**: Smooth execution, optimized for real-time if animated
- **Reproducibility**: Same seed ALWAYS produces identical output

### OUTPUT FORMAT

Output:
1. **Algorithmic Philosophy** - As markdown or text explaining the generative aesthetic
2. **Single HTML Artifact** - Self-contained interactive generative art built from \`templates/viewer.html\`

The HTML artifact contains everything: p5.js (from CDN), the algorithm, parameter controls, and UI - all in one file that works immediately in claude.ai artifacts or any browser.
`
  },
  {
    id: 'slack-gif-creator',
    name: 'Slack GIF Creator',
    description: '为 Slack 创建优化的动画 GIF，支持表情 GIF 和消息 GIF',
    category: categories[7],
    source: 'anthropic',
    triggers: ['Slack GIF', '动画', '表情', 'gif'],
    priority: 5,
    content: `---
name: slack-gif-creator
description: Knowledge and utilities for creating animated GIFs optimized for Slack. Provides constraints, validation tools, and animation concepts. Use when users request animated GIFs for Slack like "make me a GIF of X doing Y for Slack."
license: Complete terms in LICENSE.txt
---

# Slack GIF Creator

A toolkit providing utilities and knowledge for creating animated GIFs optimized for Slack.

## Slack Requirements

**Dimensions:**
- Emoji GIFs: 128x128 (recommended)
- Message GIFs: 480x480

**Parameters:**
- FPS: 10-30 (lower is smaller file size)
- Colors: 48-128 (fewer = smaller file size)
- Duration: Keep under 3 seconds for emoji GIFs

## Core Workflow

\`\`\`python
from core.gif_builder import GIFBuilder
from PIL import Image, ImageDraw

# 1. Create builder
builder = GIFBuilder(width=128, height=128, fps=10)

# 2. Generate frames
for i in range(12):
    frame = Image.new('RGB', (128, 128), (240, 248, 255))
    draw = ImageDraw.Draw(frame)
    # Draw your animation using PIL primitives
    builder.add_frame(frame)

# 3. Save with optimization
builder.save('output.gif', num_colors=48, optimize_for_emoji=True)
\`\`\`

## Drawing Graphics

### Drawing from Scratch
When drawing graphics from scratch, use PIL ImageDraw primitives:

\`\`\`python
from PIL import ImageDraw

draw = ImageDraw.Draw(frame)

# Circles/ovals
draw.ellipse([x1, y1, x2, y2], fill=(r, g, b), outline=(r, g, b), width=3)

# Stars, triangles, any polygon
points = [(x1, y1), (x2, y2), (x3, y3), ...]
draw.polygon(points, fill=(r, g, b), outline=(r, g, b), width=3)

# Lines
draw.line([(x1, y1), (x2, y2)], fill=(r, g, b), width=5)

# Rectangles
draw.rectangle([x1, y1, x2, y2], fill=(r, g, b), outline=(r, g, b), width=3)
\`\`\`

### Making Graphics Look Good

- **Use thicker lines** - Always set \`width=2\` or higher for outlines
- **Add visual depth**: Use gradients, layer multiple shapes
- **Pay attention to colors**: Use vibrant, complementary colors
- **Be creative and detailed**: A good Slack GIF should look polished

## Available Utilities

### GIFBuilder (\`core.gif_builder\`)
Assembles frames and optimizes for Slack:
\`\`\`python
builder = GIFBuilder(width=128, height=128, fps=10)
builder.add_frame(frame)
builder.save('out.gif', num_colors=48, optimize_for_emoji=True, remove_duplicates=True)
\`\`\`

### Validators (\`core.validators\`)
Check if GIF meets Slack requirements:
\`\`\`python
from core.validators import validate_gif, is_slack_ready
passes, info = validate_gif('my.gif', is_emoji=True, verbose=True)
\`\`\`

### Easing Functions (\`core.easing\`)
Smooth motion instead of linear:
\`\`\`python
from core.easing import interpolate
y = interpolate(start=0, end=400, t=t, easing='ease_out')
\`\`\`

### Frame Helpers (\`core.frame_composer\`)
Convenience functions for common needs:
\`\`\`python
from core.frame_composer import (
    create_blank_frame, create_gradient_background,
    draw_circle, draw_star
)
\`\`\`

## Animation Concepts

### Shake/Vibrate
Offset object position with oscillation using \`math.sin()\` or \`math.cos()\`.

### Pulse/Heartbeat
Scale object size rhythmically using \`math.sin()\`.

### Bounce
Object falls and bounces using easing functions.

### Spin/Rotate
Rotate object around center using \`image.rotate()\`.

### Fade In/Out
Gradually appear or disappear by adjusting alpha channel.

### Slide
Move object from off-screen to position using easing.

### Zoom
Scale and position for zoom effect.

### Explode/Particle Burst
Create particles radiating outward with gravity and fade out.

## Optimization Strategies

Only when asked to make the file size smaller:
1. **Fewer frames** - Lower FPS or shorter duration
2. **Fewer colors** - \`num_colors=48\` instead of 128
3. **Smaller dimensions** - 128x128 instead of 480x480
4. **Remove duplicates** - \`remove_duplicates=True\`
5. **Emoji mode** - \`optimize_for_emoji=True\`

\`\`\`python
# Maximum optimization for emoji
builder.save('emoji.gif', num_colors=48, optimize_for_emoji=True, remove_duplicates=True)
\`\`\`

## Dependencies

\`\`\`bash
pip install pillow imageio numpy
\`\`\`
`
  },

  // Thinking Skills
  {
    id: 'sequential-thinking',
    name: 'Sequential Thinking',
    description: '逐步推理和顺序思考',
    category: categories[8],
    source: 'claudekit',
    triggers: ['顺序思考', '逐步推理', '逻辑推理'],
    priority: 4,
    content: `---
name: sequential-thinking
description: |
  顺序思考专家。
  通过逐步推理解决复杂问题。
---

# Sequential Thinking

结构化的逐步推理方法。

## 思考模式

1. 问题分解
2. 逐步分析
3. 逻辑推理
4. 结论验证
`
  },
  {
    id: 'planning-with-files',
    name: 'Planning with Files',
    description: 'Manus 风格持久化 Markdown 规划，用文档作为 LLM 的外部存储',
    category: categories[8],
    source: 'planning',
    triggers: ['规划', '任务', '计划', 'plan', 'task_plan', 'notes', 'Manus', '文件规划', '持久化规划'],
    priority: 8,
    content: `---
name: planning-with-files
description: |
  Manus 风格持久化 Markdown 规划。
  用文档作为 LLM 的外部存储，实现任务规划、进度追踪和知识存储。
  适用于：复杂任务、多步骤项目、研究任务、任何需要结构化输出的场景。
---

# Planning with Files

像 Manus 一样工作：使用持久化 Markdown 文件作为你的"磁盘工作内存"。

## 核心概念

Manus AI（被 Meta 以 20 亿美元收购）的核心工作流模式——用文件系统作为 LLM 的外部存储。

## 3-文件模式

对于每个非平凡任务，创建三个文件：

| 文件 | 用途 | 更新时机 |
|------|------|----------|
| \`task_plan.md\` | 追踪阶段和进度 | 每个阶段后 |
| \`notes.md\` | 存储研究发现 | 研究过程中 |
| \`[产出物].md\` | 最终输出 | 完成后 |

## 核心工作流

- 循环 1：创建 task_plan.md，包含目标和阶段
- 循环 2：研究 → 保存到 notes.md → 更新 task_plan.md
- 循环 3：读取 notes.md → 创建产出物 → 更新 task_plan.md
- 循环 4：交付最终输出

## 关键规则

1. **始终先创建计划** - 对于复杂任务，永远不要跳过 task_plan.md
2. **决策前读取计划** - 每次重大决策前重新读取，保持目标在注意力窗口
3. **行动后更新** - 完成每个阶段后立即更新计划文件
4. **存储而非塞入** - 大内容存入文件，而非塞入上下文
5. **记录所有错误** - 每次错误都记录在"Errors Encountered"部分

## 触发词

规划、任务、计划、plan、task_plan、notes、Manus、文件规划、持久化规划
`
  },

  // Tools Skills
  {
    id: 'mcp-builder',
    name: 'MCP Builder',
    description: 'MCP 服务器创建和开发',
    category: categories[9],
    source: 'community',
    triggers: ['MCP', '服务器', '集成', 'Model Context Protocol'],
    priority: 6,
    content: `---
name: mcp-builder
description: |
  MCP 服务器开发专家。
  创建和调试 Model Context Protocol 服务器。
---

# MCP Builder

MCP 服务器开发和集成。

## 开发能力

- MCP 服务器架构
- 工具函数开发
- 资源管理
- Prompt 模板
- 客户端集成
`
  },
  {
    id: 'browser-automation',
    name: 'Browser Automation',
    description: '浏览器自动化和网页抓取',
    category: categories[9],
    source: 'community',
    triggers: ['浏览器', '自动化', '抓取', 'Puppeteer', 'Playwright'],
    priority: 5,
    content: `---
name: browser-automation
description: |
  浏览器自动化专家。
  使用 Puppeteer/Playwright 进行网页操作。
---

# Browser Automation

浏览器自动化和网页交互。

## 自动化能力

- 网页导航
- 元素交互
- 数据抓取
- 截图和 PDF
- 表单填写
`
  },

  // Scientific Skills (示例 - 实际包含 138 个技能)
  {
    id: 'biopython',
    name: 'BioPython',
    description: '生物序列分析、基因组学、蛋白质结构分析',
    category: categories[4],
    source: 'scientific',
    triggers: ['生物', '基因', 'DNA', 'RNA', '蛋白质', '序列分析', 'BioPython'],
    priority: 7,
    content: `---
name: biopython
description: |
  BioPython 生物信息学分析专家。
  处理生物序列、基因组数据、蛋白质结构。
---

# BioPython

专业的生物信息学分析工具。

## 核心功能

- DNA/RNA 序列分析
- 蛋白质结构预测
- 系统发育树构建
- BLAST 搜索
- GenBank 数据处理
`
  },
  {
    id: 'rdkit',
    name: 'RDKit',
    description: '化学信息学、分子操作、药物发现',
    category: categories[4],
    source: 'scientific',
    triggers: ['化学', '分子', '药物', '化合物', 'RDKit', 'SMILES'],
    priority: 7,
    content: `---
name: rdkit
description: |
  RDKit 化学信息学专家。
  分子结构分析、药物性质预测、虚拟筛选。
---

# RDKit

化学信息学和药物发现工具。

## 主要能力

- 分子结构操作
- 化学性质计算
- 分子指纹生成
- 子结构搜索
- 3D 分子构象
`
  },
  {
    id: 'scanpy',
    name: 'Scanpy',
    description: '单细胞 RNA 测序分析、细胞类型鉴定',
    category: categories[4],
    source: 'scientific',
    triggers: ['单细胞', 'scRNA-seq', 'Scanpy', '细胞', '基因表达'],
    priority: 7,
    content: `---
name: scanpy
description: |
  Scanpy 单细胞分析专家。
  处理和分析单细胞 RNA-seq 数据。
---

# Scanpy

单细胞 RNA 测序数据分析。

## 分析流程

- 质量控制和过滤
- 归一化和批次矫正
- 降维和聚类
- 差异表达分析
- 细胞类型注释
`
  },
  {
    id: 'deepchem',
    name: 'DeepChem',
    description: '深度学习药物发现、分子性质预测',
    category: categories[4],
    source: 'scientific',
    triggers: ['深度学习', '药物发现', 'DeepChem', 'AI药物', '分子预测'],
    priority: 7,
    content: `---
name: deepchem
description: |
  DeepChem 深度学习药物发现专家。
  使用 AI 预测分子性质和生物活性。
---

# DeepChem

AI 驱动的药物发现平台。

## 核心功能

- 分子性质预测
- ADMET 预测
- 蛋白-配体结合预测
- 图神经网络模型
- 虚拟筛选
`
  },
  {
    id: 'pubmed-database',
    name: 'PubMed',
    description: '生物医学文献搜索和分析',
    category: categories[4],
    source: 'scientific',
    triggers: ['文献', 'PubMed', '论文', '生物医学', '科研'],
    priority: 6,
    content: `---
name: pubmed-database
description: |
  PubMed 文献检索专家。
  搜索和分析生物医学文献。
---

# PubMed

生物医学文献数据库访问。

## 功能特性

- 关键词搜索
- 高级查询构建
- 文献元数据提取
- 引用分析
- 相关文献推荐
`
  },
  {
    id: 'planning-with-files',
    name: 'Planning with Files',
    description: '使用 Manus 风格的持久化 Markdown 文件进行规划、进度跟踪和知识存储',
    category: categories[13],
    source: 'planning',
    triggers: ['规划', '计划', '任务管理', '进度跟踪', '工作流', 'planning', 'workflow', '组织工作'],
    priority: 8,
    content: `---
name: planning-with-files
description: Transforms workflow to use Manus-style persistent markdown files for planning, progress tracking, and knowledge storage. Use when starting complex tasks, multi-step projects, research tasks, or when the user mentions planning, organizing work, tracking progress, or wants structured output.
---

# Planning with Files

Work like Manus: Use persistent markdown files as your "working memory on disk."

## Quick Start

Before ANY complex task:

1. **Create task_plan.md** in the working directory
2. **Define phases** with checkboxes
3. **Update after each phase** - mark [x] and change status
4. **Read before deciding** - refresh goals in attention window

## The 3-File Pattern

For every non-trivial task, create THREE files:

| File | Purpose | When to Update |
|------|---------|----------------|
| task_plan.md | Track phases and progress | After each phase |
| notes.md | Store findings and research | During research |
| [deliverable].md | Final output | At completion |

## Core Workflow

Loop 1: Create task_plan.md with goal and phases
Loop 2: Research → save to notes.md → update task_plan.md
Loop 3: Read notes.md → create deliverable → update task_plan.md
Loop 4: Deliver final output

### The Loop in Detail

**Before each major action:**
Read task_plan.md to refresh goals in attention window

**After each phase:**
Edit task_plan.md to mark [x] and update status

**When storing information:**
Write notes.md - don't stuff context, store in file

## task_plan.md Template

Create this file FIRST for any complex task:

# Task Plan: [Brief Description]

## Goal
[One sentence describing the end state]

## Phases
- [ ] Phase 1: Plan and setup
- [ ] Phase 2: Research/gather information
- [ ] Phase 3: Execute/build
- [ ] Phase 4: Review and deliver

## Key Questions
1. [Question to answer]
2. [Question to answer]

## Decisions Made
- [Decision]: [Rationale]

## Errors Encountered
- [Error]: [Resolution]

## Status
**Currently in Phase X** - [What I'm doing now]

## notes.md Template

For research and findings:

# Notes: [Topic]

## Sources

### Source 1: [Name]
- URL: [link]
- Key points:
  - [Finding]
  - [Finding]

## Synthesized Findings

### [Category]
- [Finding]
- [Finding]

## Critical Rules

### 1. ALWAYS Create Plan First
Never start a complex task without task_plan.md. This is non-negotiable.

### 2. Read Before Decide
Before any major decision, read the plan file. This keeps goals in your attention window.

### 3. Update After Act
After completing any phase, immediately update the plan file:
- Mark completed phases with [x]
- Update the Status section
- Log any errors encountered

### 4. Store, Don't Stuff
Large outputs go to files, not context. Keep only paths in working memory.

### 5. Log All Errors
Every error goes in the "Errors Encountered" section. This builds knowledge for future tasks.

## When to Use This Pattern

**Use 3-file pattern for:**
- Multi-step tasks (3+ steps)
- Research tasks
- Building/creating something
- Tasks spanning multiple tool calls
- Anything requiring organization

**Skip for:**
- Simple questions
- Single-file edits
- Quick lookups

## Anti-Patterns to Avoid

| Don't | Do Instead |
|-------|------------|
| Use TodoWrite for persistence | Create task_plan.md file |
| State goals once and forget | Re-read plan before each decision |
| Hide errors and retry | Log errors to plan file |
| Stuff everything in context | Store large content in files |
| Start executing immediately | Create plan file FIRST |
`
  }
];

// 按分类获取技能
export function getSkillsByCategory(categoryId: string): Skill[] {
  return skills.filter(skill => skill.category.id === categoryId);
}

// 根据 ID 获取技能
export function getSkillById(id: string): Skill | undefined {
  return skills.find(skill => skill.id === id);
}

// 搜索技能
export function searchSkills(query: string): Skill[] {
  const lowerQuery = query.toLowerCase();
  return skills.filter(skill =>
    skill.name.toLowerCase().includes(lowerQuery) ||
    skill.description.toLowerCase().includes(lowerQuery) ||
    skill.triggers.some(trigger => trigger.toLowerCase().includes(lowerQuery))
  );
}
