---
name: ui-skills
description: Opinionated UI/UX constraints for building better interfaces with agents
---

# UI Skills - Constraint-Based Interface Development

> **Purpose**: Prevent generic AI-generated aesthetics through strict, opinionated constraints.
> **Source**: https://ui-skills.com by @ibelick

## Core Philosophy

These are **RULES, not suggestions**. Follow them to create distinctive, performant interfaces that avoid the "AI look".

---

## 1. Stack Constraints

### MUST Use
- **Tailwind CSS defaults** - Don't override without reason
- **motion/react** for scripting animations

### NEVER Use
- Custom CSS frameworks that conflict with Tailwind
- Inline styles for animation (use Tailwind or motion/react)

---

## 2. Component Constraints

### MUST Always
- Use **accessible component primitives** (e.g., Radix UI, HeadlessUI)
- Add `aria-label` to icon-only buttons
- Implement keyboard navigation
- Use **structural skeletons** for loading states

### NEVER
- Use `<div>` for clickable elements (use `<button>`)
- Skip accessibility attributes
- Rebuild keyboard or focus behavior by hand

---

## 3. Interaction Constraints

### MUST Use
- **AlertDialog** for destructive or irreversible actions
- **h-dvh** over **h-screen** for viewport height
- Ensure **empty states** have one clear next action

### NEVER
- Confirm destructive actions with simple `confirm()` dialog
- Use fixed pixel heights for full-screen layouts

---

## 4. Animation Constraints

### MUST Always
- Animate **only compositor props** (transform, opacity)
- Ensure interaction feedback **NEVER exceeds 200ms**

### NEVER
- Animate width, height, or other layout properties
- Use slow animations (>200ms for feedback)

---

## 5. Typography Constraints

### MUST Use
- **text-balance** for headings
- **tabular-nums** for data

### NEVER
- Leave headings un-balanced (causes orphaned words)

---

## 6. Layout Constraints

### MUST Maintain
- A **fixed z-index scale** (e.g., 10, 20, 30, 40, 50)
- **size-x** for square elements

### NEVER
- Use random z-index values (z-index: 9999)
- Create z-index conflicts

---

## 7. Performance Constraints

### MUST Avoid
- Large `blur()` or `backdrop-filter` surfaces (use sparingly)

### NEVER
- Use `useEffect` for anything that can be expressed as render logic
- Apply blur to entire page backgrounds
- Use backdrop-filter on scrollable containers

---

## 8. Design Constraints

### MUST NEVER (Unless Explicitly Requested)
- Use gradients

### ALWAYS
- Question gradient usage (are they necessary?)
- Prefer solid colors or subtle textures

---

## Application Workflow

When building UI/UX:

1. **Review constraints** relevant to the task
2. **Apply MUST rules** as non-negotiable
3. **Avoid NEVER patterns** at all costs
4. **Document exceptions** if client explicitly requests violations

---

## Integration with Other Skills

- **Complements**: `frontend-designer` (creative aesthetics)
- **Overlaps with**: `ui-ux-pro-max` (design database)
- **Best paired with**: `react-components`, `modern-frontend-design`

---

## Credits

Original constraints by [@ibelick](https://github.com/ibelick)
Website: https://ui-skills.com
Repository: https://github.com/ibelick/ui-skills
