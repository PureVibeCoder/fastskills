---
name: modern-frontend-design
description: |
  Expert frontend design system for creating distinctive, production-grade interfaces.

  **Use this skill when:**
  - User requests to build or design web components, pages, or applications
  - User asks to improve or redesign existing UI/UX
  - User wants modern, distinctive frontend implementations that avoid generic aesthetics
  - User requests help with design systems, typography, colors, or animations

  **This skill provides:**
  - Comprehensive design workflows (discovery → concept → implementation)
  - 12+ aesthetic direction templates (neo-brutalist, glassmorphism, art deco, etc.)
  - Production-ready code patterns for React, Vue, and vanilla JS
  - Typography systems, color theory, and animation libraries
  - Anti-patterns to avoid generic AI-generated looks

  **Do NOT use for:**
  - Pure backend development
  - Data processing or API design
  - Simple text content creation
skills:
---

#  Frontend Design System Skill

> Create distinctive, production-grade frontend interfaces that transcend generic AI aesthetics.

## 🎯 Core Philosophy

**Every interface tells a story.** Design is not decoration applied to functionality—it's the synthesis of purpose, emotion, and interaction into a cohesive experience.

### Before Writing Any Code

Always establish these three foundations:

1. **Context**: What problem does this solve? Who uses it? What emotion should it evoke?
2. **Concept**: What's the core metaphor or idea that drives all design decisions?
3. **Commitment**: Choose a bold direction and execute it with precision throughout.

---

## 📋 Design Process Workflow

### Phase 1: Discovery & Concept

**ALWAYS START HERE** — Understand the request deeply:

- What is the literal requirement?
- What is the underlying need?
- What emotional response should this evoke?
- What makes this different from everything else?

### Phase 2: Choose an Aesthetic Direction

Select ONE primary aesthetic direction and commit to it:

| Direction | Key Characteristics | Best For |
|-----------|-------------------|----------|
| **Neo-Brutalist** | Raw concrete textures, bold typography, harsh contrasts | Bold statements, developer tools |
| **Soft Minimalism** | Muted palettes, generous whitespace, subtle interactions | Wellness, productivity apps |
| **Retro-Futuristic** | CRT effects, scan lines, neon glows, cyberpunk | Gaming, tech showcases |
| **Editorial/Magazine** | Dynamic grids, mixed media, bold type | Content-heavy sites, blogs |
| **Organic/Natural** | Flowing shapes, nature-inspired palettes | Eco-friendly, health brands |
| **Glass Morphism** | Translucent layers, backdrop filters, depth | Modern apps, dashboards |
| **Maximalist Chaos** | Information density, collage aesthetics | Creative portfolios, art sites |
| **Art Deco** | Geometric patterns, gold accents, vintage luxury | Luxury brands, events |
| **Memphis Design** | Bold patterns, primary colors, playful geometry | Creative agencies, startups |
| **Swiss Design** | Grid systems, sans-serif type, functional beauty | Corporate, professional |
| **Dark Academia** | Rich textures, serif typography, scholarly | Education, publishing |
| **Y2K Revival** | Gradients, metallics, early-web nostalgia | Pop culture, entertainment |
| **Custom Hybrid** | Combine 2-3 directions for something unique | When context demands it |

### Phase 3: Design System Definition

Define your design tokens BEFORE coding:

```css
/* Example: Neo-Brutalist System */
:root {
  /* Typography Scale */
  --font-display: 'Archivo Black', sans-serif;  /* Never use Inter/Roboto */
  --font-body: 'Work Sans', sans-serif;
  --scale-base: clamp(1rem, 2vw, 1.125rem);
  --scale-ratio: 1.333;  /* Perfect fourth */

  /* Spatial System */
  --space-unit: 0.5rem;
  --grid-columns: 12;
  --container-max: 1440px;

  /* Color Philosophy */
  --color-ink: #0A0A0A;
  --color-paper: #F7F3F0;
  --color-accent: #FF3E00;
  --color-bruise: #7B68EE;

  /* Animation Timing */
  --ease-out-expo: cubic-bezier(0.19, 1, 0.22, 1);
  --duration-base: 200ms;
  --stagger-delay: 50ms;
}
```

### Phase 4: Implementation

Follow the implementation patterns in the sections below.

---

## 🎨 Implementation Patterns

### Typography Hierarchy

Never use default font stacks. Always pair fonts intentionally:

```css
/* ❌ Bad - Generic AI Slop */
font-family: Inter, system-ui, sans-serif;

/* ✅ Good - Intentional Pairing */
font-family: 'Instrument Serif', 'Crimson Pro', serif;  /* Editorial */
font-family: 'Space Mono', 'JetBrains Mono', monospace;  /* Tech */
font-family: 'Bebas Neue', 'Oswald', sans-serif;  /* Bold Display */
font-family: 'Playfair Display', 'Libre Baskerville', serif;  /* Luxury */
```

**Recommended Font Pairings by Context:**

- **Tech/Developer**: Space Mono + Inter, JetBrains Mono + Manrope
- **Editorial**: Instrument Serif + Work Sans, Lora + Open Sans
- **Bold/Impact**: Bebas Neue + Roboto Condensed, Archivo Black + Inter
- **Luxury**: Playfair Display + Montserrat, Cormorant + Lato
- **Modern**: DM Sans + DM Serif, Plus Jakarta + Fraunces

### Color Usage

Avoid predictable gradients. Use color with intention:

```css
/* ❌ Bad - Overused Purple Gradient */
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);

/* ✅ Good - Risograph-inspired Duotone */
background:
  linear-gradient(45deg, #FF6B6B 0%, transparent 70%),
  linear-gradient(-45deg, #4ECDC4 0%, transparent 70%),
  #F7FFF7;

/* ✅ Good - Noise Texture Overlay */
background:
  url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.02'/%3E%3C/svg%3E"),
  linear-gradient(180deg, #0A0E27 0%, #151B3D 100%);
```

### Layout Strategies

Break the grid intentionally:

```css
/* Dynamic asymmetric grid */
.container {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 3fr 1fr;
  grid-template-rows: auto 1fr auto;
  gap: clamp(1rem, 3vw, 2rem);
}

.hero-content {
  grid-column: 1 / span 3;
  grid-row: 2;
  z-index: 2;
}

.hero-visual {
  grid-column: 3 / -1;
  grid-row: 1 / span 2;
  margin-top: -10vh;  /* Break container boundaries */
}
```

---

## ✨ Animation & Interaction

### Entrance Animations

One orchestrated entrance beats scattered micro-interactions:

```css
@keyframes revealUp {
  from {
    opacity: 0;
    transform: translateY(30px) scale(0.98);
  }
}

.hero > * {
  animation: revealUp 800ms var(--ease-out-expo) both;
}

.hero > *:nth-child(1) { animation-delay: 0ms; }
.hero > *:nth-child(2) { animation-delay: 80ms; }
.hero > *:nth-child(3) { animation-delay: 160ms; }
```

### Scroll-Triggered Effects

```javascript
// Parallax with Intersection Observer
const parallaxElements = document.querySelectorAll('[data-parallax]');
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const scrolled = window.pageYOffset;
      const rate = scrolled * entry.target.dataset.parallax;
      entry.target.style.transform = `translateY(${rate}px)`;
    }
  });
});
parallaxElements.forEach(el => observer.observe(el));
```

### Hover States That Surprise

```css
.card {
  transition: transform 200ms var(--ease-out-expo);
}

.card:hover {
  transform: perspective(1000px) rotateX(5deg) scale(1.02);
}

.card:hover::before {
  /* Reveal hidden layer */
  opacity: 1;
  transform: translate(-5px, -5px);
}
```

---

## ⚠️ Critical Anti-Patterns to Avoid

### The "AI Look" Checklist

**NEVER do all of these together:**

- ❌ Purple/blue gradient backgrounds
- ❌ Inter or system fonts
- ❌ Centered hero with subheading
- ❌ 3-column feature cards
- ❌ Rounded corners on everything
- ❌ Drop shadows on all cards
- ❌ #6366F1 as primary color
- ❌ 16px border radius
- ❌ "Modern", "Clean", "Simple" as only descriptors

### Common Pitfalls

1. **Over-animation**: Not everything needs to move. Choose moments.
2. **Timid Choices**: Commit fully to your aesthetic direction.
3. **Mismatched Complexity**: Minimal designs need perfect details, not elaborate code.
4. **Context Ignorance**: A banking app shouldn't look like a music festival site.
5. **Trend Chasing**: Glass morphism everywhere is the new purple gradient.

---

## 🛠️ Framework-Specific Guidelines

### React Components

Emphasize composition and state management:

```jsx
// Use compound components for complex UI
const Card = ({ children }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  return (
    <CardContext.Provider value={{ isExpanded, setIsExpanded }}>
      <article className="card" data-expanded={isExpanded}>
        {children}
      </article>
    </CardContext.Provider>
  );
};

Card.Header = ({ children }) => {
  const { setIsExpanded } = useContext(CardContext);
  return (
    <header onClick={() => setIsExpanded(prev => !prev)}>
      {children}
    </header>
  );
};
```

### Vue Composition

Leverage reactive design:

```vue
<script setup>
import { ref, computed } from 'vue'

const theme = ref('dark')
const themeClasses = computed(() => ({
  'theme-dark': theme.value === 'dark',
  'theme-light': theme.value === 'light'
}))
</script>

<template>
  <div :class="themeClasses">
    <!-- content -->
  </div>
</template>
```

### Vanilla JavaScript

Progressive enhancement approach:

```javascript
// Feature detection before enhancement
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        entry.target.classList.toggle('is-visible', entry.isIntersecting);
      });
    },
    { threshold: 0.1 }
  );

  document.querySelectorAll('[data-animate]').forEach(el => {
    observer.observe(el);
  });
}
```

---

## ✅ Quality Checklist

Before delivering any frontend:

### Visual Impact
- [ ] Does it have a clear point of view?
- [ ] Would someone remember this tomorrow?
- [ ] Does it avoid all generic AI patterns?

### Technical Excellence
- [ ] Responsive across all breakpoints (mobile, tablet, desktop)?
- [ ] Accessible (ARIA labels, keyboard navigation, focus states)?
- [ ] Performance optimized (lazy loading, code splitting)?
- [ ] Cross-browser tested (Chrome, Firefox, Safari, Edge)?

### Attention to Detail
- [ ] Custom focus states defined for all interactive elements?
- [ ] Loading and error states designed and implemented?
- [ ] Micro-interactions enhance usability without distraction?
- [ ] Typography hierarchy consistent and readable?

---

## 📚 Resources

### Scripts (Optional)
- **generate-palette.py**: Create cohesive color systems from a base color
- **optimize-animations.py**: Convert CSS animations to GPU-accelerated transforms
- **accessibility-check.py**: Validate WCAG compliance

### References (Optional)
- **aesthetic-systems.md**: Deep dive into each design direction with examples
- **typography-pairings.md**: Curated font combinations by mood and purpose
- **animation-curves.md**: Custom easing functions and timing patterns
- **color-psychology.md**: Emotional impact of color choices

### Assets (Optional)
- **reset-styles/**: Modern CSS reset variations
- **grid-systems/**: Flexible grid templates
- **icon-sets/**: Custom SVG icon libraries
- **texture-library/**: Background patterns and noise textures

---

## 🎯 Final Reminder

You are not generating "a frontend"—you are **crafting an experience**.

- Every choice should serve the concept
- Every detail should reinforce the story
- The user should feel something when they see it

**Make it memorable. Make it distinctive. Make it feel designed, not generated.**
