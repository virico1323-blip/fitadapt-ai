# Design Brief

## Direction

FitAdapt AI — Premium dark fitness tech with ML-adaptive personality

## Tone

Precise, data-first, premium dark — inspired by Linear and Vercel's design language applied to fitness

## Differentiation

Teal + coral dual-accent gradient system on near-black blue-tinted surfaces creates a focused, technical feel distinct from generic gym-app aesthetics

## Color Palette

| Token      | OKLCH          | Role                               |
| ---------- | -------------- | ---------------------------------- |
| background | 0.13 0.01 220  | Deep blue-black base               |
| foreground | 0.95 0.008 220 | Near-white, slightly cool          |
| card       | 0.17 0.012 220 | Elevated surface, slightly lighter |
| primary    | 0.72 0.16 190  | Teal — CTAs and active states      |
| accent     | 0.70 0.20 32   | Coral — achievements and highlights|
| muted      | 0.20 0.012 220 | Subtle section backgrounds         |

## Typography

- Display + Body: Plus Jakarta Sans — headings, UI labels, body copy
- Mono: JetBrains Mono — stats, data values, technical output
- Scale: hero `text-5xl md:text-7xl font-bold tracking-tight`, h2 `text-3xl md:text-5xl`, label `text-xs uppercase tracking-widest`, body `text-base`

## Elevation & Depth

Three-tier surface stack: background → card → popover, with glow shadows only on primary CTAs

## Structural Zones

| Zone    | Background         | Border                    | Notes                           |
| ------- | ------------------ | ------------------------- | ------------------------------- |
| Header  | bg-card            | border-b border-border/60 | Sticky, backdrop-blur           |
| Content | bg-background      | —                         | Sections alternate bg-muted/20  |
| Footer  | bg-card            | border-t                  | Consistent elevation with header|

## Spacing & Rhythm

64px section gaps, 24px card padding, 16px internal component spacing, 8px micro-gaps

## Component Patterns

- Buttons: rounded-lg, gradient-primary for primary, ghost/outline for secondary, hover:opacity-90
- Cards: rounded-xl, bg-card, border-border/60, hover:border-primary/40 hover:shadow-elevated
- Badges: semantic color variants with border accents

## Motion

- Entrance: motion/react fade+slide-up, stagger 70ms per item, viewport once
- Hover: transition-smooth (0.3s cubic) on all interactive elements, scale-105 on icon containers
- Decorative: floatOrb animation on hero background blobs (6s ease-in-out infinite)

## Constraints

- Dark only — no light mode toggle, color-scheme: dark on html
- No raw color literals — all via OKLCH CSS variables
- Glow shadows restricted to primary CTAs only

## Signature Detail

gradient-primary applied to icon containers, buttons, and text creates a cohesive teal-to-coral energy system across the entire product
