# AI for Teachers — Design System

Inspired by Perplexity.ai's clean, minimal, sophisticated aesthetic.

## Design Principles

1. **Extreme whitespace** — Content breathes, never cramped
2. **Subtle hierarchy** — Typography does the work, not colors or boxes
3. **Monochromatic + one accent** — Near-black text, white/off-white backgrounds, single teal accent
4. **Invisible chrome** — UI elements disappear; content is primary
5. **Smooth, subtle animations** — Micro-interactions that feel premium
6. **Sans-serif typography** — Clean, modern, highly readable (Geist Sans)
7. **Card-free where possible** — Reduce visual containers; let content define boundaries

---

## Colors

### Backgrounds
| Token | Hex | Usage |
|-------|-----|-------|
| `--bg-primary` | `#FFFFFF` | Page background |
| `--bg-surface` | `#F9FAFB` | Subtle surface differentiation |
| `--bg-elevated` | `#F3F4F6` | Hover states, input backgrounds |
| `--bg-hover` | `#E5E7EB` | Active/pressed states |

### Text
| Token | Hex | Usage |
|-------|-----|-------|
| `--text-primary` | `#111827` | Headings, primary content |
| `--text-secondary` | `#4B5563` | Body text, descriptions |
| `--text-tertiary` | `#9CA3AF` | Labels, captions, timestamps |
| `--text-muted` | `#D1D5DB` | Placeholders, disabled states |

### Borders
| Token | Hex | Usage |
|-------|-----|-------|
| `--border-subtle` | `#F3F4F6` | Barely visible dividers |
| `--border-default` | `#E5E7EB` | Standard borders |
| `--border-focus` | `#20B2AA` | Focus rings (accent) |

### Accent (Teal)
| Token | Hex | Usage |
|-------|-----|-------|
| `--accent-primary` | `#20B2AA` | Primary buttons, links, active states |
| `--accent-hover` | `#1A9B94` | Hover state for accent |
| `--accent-subtle` | `rgba(32, 178, 170, 0.08)` | Accent backgrounds |
| `--accent-border` | `rgba(32, 178, 170, 0.25)` | Accent borders |

### Status
| Token | Hex | Usage |
|-------|-----|-------|
| `--success-primary` | `#10B981` | Completed, success |
| `--success-subtle` | `rgba(16, 185, 129, 0.08)` | Success backgrounds |
| `--warning-primary` | `#F59E0B` | In progress, caution |
| `--warning-subtle` | `rgba(245, 158, 11, 0.08)` | Warning backgrounds |
| `--error-primary` | `#EF4444` | Errors |
| `--error-subtle` | `rgba(239, 68, 68, 0.08)` | Error backgrounds |

### Skippy (preserved brand)
| Token | Hex | Usage |
|-------|-----|-------|
| `--skippy-coral` | `#FF6B6B` | Avatar warm accent |
| `--skippy-amber` | `#FFB347` | Avatar glow |
| `--skippy-glow` | `rgba(255, 179, 71, 0.2)` | Avatar glow effect |

---

## Typography

### Font Family
- **Sans:** Geist Sans (primary — all UI)
- **Mono:** Geist Mono (code blocks, artifact content)

### Scale
| Element | Size | Weight | Line Height | Letter Spacing |
|---------|------|--------|-------------|----------------|
| Display | 36px (2.25rem) | 600 | 1.2 | -0.025em |
| H1 | 30px (1.875rem) | 600 | 1.3 | -0.025em |
| H2 | 20px (1.25rem) | 500 | 1.4 | -0.01em |
| H3 | 16px (1rem) | 500 | 1.5 | 0 |
| Body | 15px (0.9375rem) | 400 | 1.6 | 0 |
| Small | 13px (0.8125rem) | 400 | 1.5 | 0 |
| Caption | 12px (0.75rem) | 400 | 1.4 | 0.01em |
| Overline | 11px (0.6875rem) | 500 | 1.3 | 0.06em |

### Weight Usage
- **400 (Regular):** Body text, descriptions
- **500 (Medium):** Subheadings, labels, nav items
- **600 (Semibold):** Page titles, primary CTAs

---

## Spacing

### Base Unit: 4px

| Token | Value | Common Usage |
|-------|-------|--------------|
| `space-1` | 4px | Tight gaps (icon+text) |
| `space-2` | 8px | Inline spacing |
| `space-3` | 12px | Small component padding |
| `space-4` | 16px | Standard padding |
| `space-5` | 20px | Card padding |
| `space-6` | 24px | Section gaps |
| `space-8` | 32px | Section spacing |
| `space-10` | 40px | Large sections |
| `space-12` | 48px | Page-level spacing |
| `space-16` | 64px | Major section breaks |

### Page Layout
- **Max content width:** 720px (max-w-3xl)
- **Page horizontal padding:** 24px mobile, 48px desktop
- **Page vertical padding:** 40px mobile, 64px desktop

---

## Components

### Buttons

**Primary (Accent)**
```
Background: var(--accent-primary)
Text: #FFFFFF
Border: none
Border-radius: 8px
Padding: 10px 20px
Font: 14px/500
Hover: var(--accent-hover)
Transition: all 150ms ease
```

**Secondary (Ghost)**
```
Background: transparent
Text: var(--text-secondary)
Border: 1px solid var(--border-default)
Border-radius: 8px
Padding: 10px 20px
Font: 14px/500
Hover: bg var(--bg-elevated)
```

**Tertiary (Text only)**
```
Background: none
Text: var(--accent-primary)
Padding: 4px 8px
Font: 14px/500
Hover: text var(--accent-hover), bg var(--accent-subtle)
```

### Inputs

**Text Input / Textarea**
```
Background: var(--bg-surface)
Text: var(--text-primary)
Border: 1px solid var(--border-default)
Border-radius: 10px
Padding: 12px 16px
Font: 15px/400
Placeholder: var(--text-muted)
Focus: border var(--accent-primary), ring 2px var(--accent-subtle)
```

### Cards (minimal — only when needed)
```
Background: var(--bg-primary) (white)
Border: 1px solid var(--border-subtle)
Border-radius: 12px
Padding: 20px
Shadow: none (or 0 1px 2px rgba(0,0,0,0.04) on hover)
Hover: border var(--border-default)
```

### Navigation
- Sidebar: White background, no visible border (use subtle shadow or nothing)
- Nav items: Text only, no background. Active = accent color + font-weight 500
- Hover: Subtle background (var(--bg-surface))

### Badges / Status
```
Border-radius: 9999px (pill)
Padding: 2px 10px
Font: 12px/500
Background: status-subtle color
Text: status-primary color
No border
```

---

## Animation

### Durations
| Type | Duration |
|------|----------|
| Micro (color, opacity) | 150ms |
| Standard (transforms) | 200ms |
| Emphasis (modals, panels) | 300ms |
| Page transitions | 400ms |

### Easing
- **Standard:** `cubic-bezier(0.4, 0, 0.2, 1)` — for most transitions
- **Enter:** `cubic-bezier(0, 0, 0.2, 1)` — elements appearing
- **Exit:** `cubic-bezier(0.4, 0, 1, 1)` — elements leaving

### Micro-interactions
- **Button hover:** Slight background shift, no transform
- **Card hover:** Border color subtly shifts
- **Input focus:** Border color + ring animation
- **Phase indicator dots:** Smooth scale + color transition
- **Loading:** Gentle pulse, not bouncing dots
- **Panel slide:** translateX with ease-out

---

## Shadows

| Level | Value | Usage |
|-------|-------|-------|
| None | `none` | Default — prefer borderless |
| Subtle | `0 1px 2px rgba(0,0,0,0.04)` | Hover lift |
| Medium | `0 4px 12px rgba(0,0,0,0.06)` | Floating panels |
| Large | `0 8px 24px rgba(0,0,0,0.08)` | Modals, dropdowns |

---

## Iconography

- **Style:** Outline (stroke), 1.5px weight
- **Size:** 16px (sm), 20px (md), 24px (lg)
- **Color:** Inherits text color (currentColor)
- **No filled icons** except for play/pause controls

---

## Key Differences from Previous Design

| Aspect | Before | After |
|--------|--------|-------|
| Theme | Dark (#0a0a0a) | Light (#FFFFFF) |
| Accent | Blue (#3b82f6) | Teal (#20B2AA) |
| Cards | Heavy borders, dark backgrounds | Borderless or subtle border |
| Text | Near-white on black | Near-black on white |
| Spacing | Compact | Generous |
| Shadows | Colored glows | Neutral, minimal |
| Chrome | Visible borders everywhere | Content defines boundaries |
| Hierarchy | Color-based | Typography-based |
