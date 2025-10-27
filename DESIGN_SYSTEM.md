# TEMPOINK Minimalistic Design System
**Version:** 2.0 (Mobile-First Black & White)
**Last Updated:** October 26, 2025

---

## Design Philosophy

**Core Principles:**
1. **Minimalism First** - Less is more, focus on content
2. **Mobile-First** - Design for small screens, enhance for large
3. **Black & White Only** - Strict monochrome palette
4. **Roboto Everywhere** - Single, clean typeface throughout
5. **Clarity & Legibility** - Maximum readability at all sizes

---

## 1. Color System (Monochrome)

### Brand Colors
```css
/* Primary Colors */
--color-black: #000000;
--color-white: #FFFFFF;

/* Neutral Grays (Minimal - Only 3 shades) */
--color-gray-100: #F5F5F5;  /* Subtle backgrounds */
--color-gray-500: #E0E0E0;  /* Borders, dividers */
--color-gray-900: #333333;  /* Soft black for text */
```

### Semantic Usage
```css
/* Text */
--text-primary: #000000;      /* Headlines, important text */
--text-secondary: #333333;    /* Body text, paragraphs */
--text-tertiary: #666666;     /* Captions, metadata */
--text-inverse: #FFFFFF;      /* Text on dark backgrounds */

/* Backgrounds */
--bg-primary: #FFFFFF;        /* Main background */
--bg-secondary: #F5F5F5;      /* Subtle contrast sections */
--bg-dark: #000000;           /* Dark sections, CTAs */

/* Borders */
--border-light: #E0E0E0;      /* Subtle dividers */
--border-medium: #CCCCCC;     /* Clear separation */
--border-dark: #000000;       /* Strong emphasis */

/* Interactive States */
--state-hover: #000000;       /* Hover backgrounds */
--state-active: #333333;      /* Active/pressed state */
--state-disabled: #E0E0E0;    /* Disabled elements */
```

### Color Usage Rules
1. **Text on white:** Always #000000 or #333333
2. **Text on black:** Always #FFFFFF
3. **No gradients** - Flat colors only
4. **No shadows** - Use borders for depth
5. **Contrast ratio:** Minimum 7:1 (AAA standard)

---

## 2. Typography System

### Font Stack (Roboto Only)
```css
/* Single Font Family */
--font-primary: 'Roboto', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;

/* Font Weights */
--font-weight-light: 300;     /* Captions, subtle text */
--font-weight-regular: 400;   /* Body text, paragraphs */
--font-weight-medium: 500;    /* Subheadings, emphasis */
--font-weight-bold: 700;      /* Headlines, CTAs */
--font-weight-black: 900;     /* Hero text, major impact */
```

### Mobile-First Type Scale
```css
/* Base Size (Mobile: 16px, Desktop: 18px) */
--font-size-base: clamp(16px, 2vw, 18px);

/* Headings - Fluid Typography */
--font-h1: clamp(32px, 7vw, 56px);   /* Mobile: 32px → Desktop: 56px */
--font-h2: clamp(24px, 5vw, 40px);   /* Mobile: 24px → Desktop: 40px */
--font-h3: clamp(20px, 4vw, 32px);   /* Mobile: 20px → Desktop: 32px */
--font-h4: clamp(18px, 3vw, 24px);   /* Mobile: 18px → Desktop: 24px */
--font-h5: clamp(16px, 2.5vw, 20px); /* Mobile: 16px → Desktop: 20px */
--font-h6: clamp(14px, 2vw, 18px);   /* Mobile: 14px → Desktop: 18px */

/* Body Text */
--font-body-large: clamp(18px, 2.5vw, 20px);
--font-body: clamp(16px, 2vw, 18px);
--font-body-small: clamp(14px, 1.8vw, 16px);
--font-caption: clamp(12px, 1.5vw, 14px);
```

### Line Height
```css
/* Optimized for Readability */
--line-height-tight: 1.2;    /* Headlines only */
--line-height-base: 1.5;     /* Body text (not 2em!) */
--line-height-relaxed: 1.75; /* Long-form content */
```

### Letter Spacing
```css
--letter-spacing-tight: -0.02em;  /* Large headlines */
--letter-spacing-normal: 0;       /* Default */
--letter-spacing-wide: 0.05em;    /* Uppercase labels */
```

### Typography Usage
```css
/* Headlines */
h1, h2, h3 {
  font-family: var(--font-primary);
  font-weight: var(--font-weight-bold);
  line-height: var(--line-height-tight);
  color: var(--text-primary);
  letter-spacing: var(--letter-spacing-tight);
}

/* Body Text */
body, p {
  font-family: var(--font-primary);
  font-weight: var(--font-weight-regular);
  line-height: var(--line-height-base);
  color: var(--text-secondary);
}

/* UI Elements */
button, .button {
  font-family: var(--font-primary);
  font-weight: var(--font-weight-medium);
  letter-spacing: var(--letter-spacing-wide);
  text-transform: uppercase;
}
```

---

## 3. Spacing System (8px Grid)

### Base Unit
```css
--space-unit: 8px;
```

### Spacing Scale
```css
--space-xxs: 4px;    /* 0.5 units - Tight spacing */
--space-xs: 8px;     /* 1 unit - Compact */
--space-sm: 16px;    /* 2 units - Small gaps */
--space-md: 24px;    /* 3 units - Default spacing */
--space-lg: 32px;    /* 4 units - Section spacing */
--space-xl: 48px;    /* 6 units - Large sections */
--space-2xl: 64px;   /* 8 units - Major sections */
--space-3xl: 96px;   /* 12 units - Hero spacing */
```

### Mobile-First Spacing
```css
/* Section Padding (Responsive) */
--section-padding-mobile: 48px 16px;     /* Vertical: 48px, Horizontal: 16px */
--section-padding-tablet: 64px 32px;     /* Vertical: 64px, Horizontal: 32px */
--section-padding-desktop: 96px 64px;    /* Vertical: 96px, Horizontal: 64px */

/* Component Spacing */
--component-gap: clamp(16px, 3vw, 32px); /* Responsive gap */
--grid-gap: clamp(16px, 2.5vw, 24px);    /* Grid spacing */
```

---

## 4. Layout System

### Container Widths (Mobile-First)
```css
/* Mobile First - No max-width */
--container-mobile: 100%;              /* Full width on mobile */
--container-tablet: 768px;             /* Tablet constraint */
--container-desktop: 1200px;           /* Desktop max-width */
--container-wide: 1400px;              /* Wide layouts */

/* Padding */
--container-padding-mobile: 16px;      /* Tight on mobile */
--container-padding-tablet: 32px;      /* Comfortable on tablet */
--container-padding-desktop: 48px;     /* Spacious on desktop */
```

### Grid System
```css
/* Mobile-First Grid */
--grid-columns-mobile: 4;              /* 4-column grid on mobile */
--grid-columns-tablet: 8;              /* 8-column grid on tablet */
--grid-columns-desktop: 12;            /* 12-column grid on desktop */

/* Column Gaps */
--grid-gap-mobile: 16px;
--grid-gap-tablet: 24px;
--grid-gap-desktop: 32px;
```

---

## 5. Responsive Breakpoints (Mobile-First)

### Standard Breakpoints
```css
/* Mobile First - Base styles apply to mobile */

/* Tablet Portrait */
@media (min-width: 640px) {
  /* Small tablets, large phones */
}

/* Tablet Landscape */
@media (min-width: 768px) {
  /* Primary tablet breakpoint */
}

/* Desktop */
@media (min-width: 1024px) {
  /* Small desktops, large tablets */
}

/* Large Desktop */
@media (min-width: 1280px) {
  /* Standard desktop screens */
}

/* Extra Large */
@media (min-width: 1536px) {
  /* Large monitors */
}
```

### Usage Rules
1. **Default styles = Mobile** (< 640px)
2. **Progressive enhancement** - Add features as screen grows
3. **No max-width queries** - Only min-width
4. **Touch-first** - 44px minimum tap targets
5. **Content-first** - Text readable without zoom

---

## 6. Components

### Buttons
```css
/* Primary Button (Black) */
.button-primary {
  background: #000000;
  color: #FFFFFF;
  padding: 14px 32px;
  border: 2px solid #000000;
  font-weight: 500;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  transition: all 0.2s ease;
}

.button-primary:hover {
  background: #FFFFFF;
  color: #000000;
  border-color: #000000;
}

/* Secondary Button (White) */
.button-secondary {
  background: #FFFFFF;
  color: #000000;
  padding: 14px 32px;
  border: 2px solid #000000;
  font-weight: 500;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

.button-secondary:hover {
  background: #000000;
  color: #FFFFFF;
}

/* Mobile Sizing */
@media (max-width: 767px) {
  .button {
    min-height: 44px;  /* iOS minimum */
    padding: 12px 24px;
    font-size: 14px;
  }
}
```

### Cards
```css
.card {
  background: #FFFFFF;
  border: 1px solid #E0E0E0;
  padding: clamp(16px, 3vw, 24px);
  transition: border-color 0.2s ease;
}

.card:hover {
  border-color: #000000;
}

/* No box-shadow - Minimalism */
```

### Forms
```css
.input {
  background: #FFFFFF;
  border: 2px solid #E0E0E0;
  padding: 12px 16px;
  font-family: var(--font-primary);
  font-size: 16px; /* Prevents zoom on iOS */
  color: #000000;
  transition: border-color 0.2s ease;
}

.input:focus {
  border-color: #000000;
  outline: none;
}

.input::placeholder {
  color: #999999;
}
```

---

## 7. Mobile-First Principles

### Touch Targets
```css
/* Minimum Interactive Size */
--touch-target-min: 44px;  /* iOS standard */

/* All interactive elements */
button, a, input[type="checkbox"], input[type="radio"] {
  min-height: 44px;
  min-width: 44px;
}
```

### Mobile Typography
```css
/* Readable without zoom */
body {
  font-size: 16px;  /* Never below 16px on mobile */
  line-height: 1.5; /* Compact but readable */
}

/* Reduce large headings on mobile */
h1 {
  font-size: clamp(32px, 7vw, 56px);
  line-height: 1.1;
  margin-bottom: 16px; /* Tight spacing on mobile */
}
```

### Mobile Navigation
```css
/* Hamburger menu below 768px */
@media (max-width: 767px) {
  .mobile-menu {
    position: fixed;
    top: 0;
    right: 0;
    width: 100%;
    max-width: 320px;
    height: 100vh;
    background: #FFFFFF;
    border-left: 1px solid #E0E0E0;
    transform: translateX(100%);
    transition: transform 0.3s ease;
  }

  .mobile-menu.active {
    transform: translateX(0);
  }
}
```

### Mobile Images
```css
/* Full-bleed images on mobile */
@media (max-width: 767px) {
  .hero-image {
    width: 100vw;
    margin-left: calc(-50vw + 50%);
    margin-right: calc(-50vw + 50%);
  }
}
```

---

## 8. Animation & Transitions

### Minimalistic Animations
```css
/* Simple, Fast Transitions */
--transition-fast: 0.15s ease;
--transition-base: 0.2s ease;
--transition-slow: 0.3s ease;

/* Usage */
.interactive-element {
  transition: color var(--transition-fast),
              background var(--transition-base),
              border-color var(--transition-fast);
}

/* No complex animations - Keep it simple */
```

---

## 9. Accessibility

### Contrast Ratios (WCAG AAA)
- **Black on White:** 21:1 (Perfect)
- **#333 on White:** 12.6:1 (Excellent)
- **#666 on White:** 5.7:1 (Good for large text)

### Focus States
```css
*:focus-visible {
  outline: 2px solid #000000;
  outline-offset: 2px;
}
```

### Screen Reader Support
```css
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
```

---

## 10. Implementation Checklist

### Phase 1: Color System
- [ ] Remove all gray variations (keep only 3)
- [ ] Update all colors to black/white
- [ ] Remove coral pink accent (#f17c8f)
- [ ] Update buttons to black/white
- [ ] Update borders to #E0E0E0
- [ ] Remove all gradients

### Phase 2: Typography
- [ ] Replace Kurale with Roboto
- [ ] Replace Jomolhari with Roboto
- [ ] Update all headings to Roboto Bold
- [ ] Implement fluid typography with clamp()
- [ ] Change line-height from 2em to 1.5em
- [ ] Add letter-spacing to buttons

### Phase 3: Mobile-First
- [ ] Add mobile-first media queries
- [ ] Implement touch targets (44px min)
- [ ] Optimize mobile navigation
- [ ] Add responsive spacing
- [ ] Test on actual devices
- [ ] Verify no horizontal scroll

### Phase 4: Spacing
- [ ] Implement 8px grid system
- [ ] Update section padding
- [ ] Standardize component gaps
- [ ] Remove excessive spacing
- [ ] Balance white space

### Phase 5: Components
- [ ] Update button styles
- [ ] Simplify card designs
- [ ] Clean up form styles
- [ ] Remove unnecessary borders
- [ ] Remove box shadows

---

## 11. Design Examples

### Hero Section (Mobile-First)
```liquid
<section class="hero">
  <div class="hero__content">
    <h1 class="hero__title">Premium Temporary Tattoos</h1>
    <p class="hero__description">Express yourself without commitment</p>
    <button class="button-primary">Shop Collection</button>
  </div>
  <div class="hero__image">
    <img src="hero.jpg" alt="Temporary tattoos">
  </div>
</section>

<style>
.hero {
  display: grid;
  gap: var(--space-lg);
  padding: var(--space-2xl) var(--space-md);
  background: #FFFFFF;
}

@media (min-width: 768px) {
  .hero {
    grid-template-columns: 1fr 1fr;
    padding: var(--space-3xl) var(--space-xl);
  }
}
</style>
```

### Product Grid (Mobile-First)
```css
.product-grid {
  display: grid;
  gap: 16px;
  grid-template-columns: repeat(2, 1fr); /* Mobile: 2 columns */
}

@media (min-width: 768px) {
  .product-grid {
    grid-template-columns: repeat(3, 1fr); /* Tablet: 3 columns */
    gap: 24px;
  }
}

@media (min-width: 1024px) {
  .product-grid {
    grid-template-columns: repeat(4, 1fr); /* Desktop: 4 columns */
    gap: 32px;
  }
}
```

---

## 12. Brand Guidelines

### Visual Identity
- **Aesthetic:** Clean, minimal, modern
- **Mood:** Bold, confident, artistic
- **Feel:** Spacious, uncluttered, focused

### Do's
✅ Use pure black (#000000) and white (#FFFFFF)
✅ Use Roboto for all text
✅ Keep layouts simple and clean
✅ Use plenty of white space
✅ Design for mobile first
✅ Use 2px borders for emphasis
✅ Maintain high contrast

### Don'ts
❌ No colors except black/white/gray
❌ No decorative fonts
❌ No gradients or shadows
❌ No complex animations
❌ No small text on mobile
❌ No cluttered layouts
❌ No low-contrast combinations

---

**Design System Complete**
*Ready for implementation on feature/mobile-revamp branch*
