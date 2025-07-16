# Centralized Animation System

## Overview
This document describes the centralized animation configuration for the Inqvo application. All animations are designed to be enterprise-appropriate, avoiding scaling/growing effects that can feel unprofessional.

## Core Principles
- **No scaling effects** - Elements should not grow or shrink on hover
- **Subtle movements** - Use translateY/translateX for hover effects
- **Consistent timing** - All animations use standardized durations
- **Smooth easing** - Professional cubic-bezier curves
- **Performance focused** - Optimized for 60fps animations

## Animation Durations
```scss
$animation-duration-fast: 0.15s;   // Quick feedback
$animation-duration-normal: 0.25s; // Standard interactions
$animation-duration-slow: 0.35s;   // Complex animations
```

## Easing Functions
```scss
$ease-out: cubic-bezier(0.25, 0.46, 0.45, 0.94);     // Enter animations
$ease-in: cubic-bezier(0.55, 0.055, 0.675, 0.19);    // Exit animations
$ease-in-out: cubic-bezier(0.645, 0.045, 0.355, 1);  // Complex animations
$ease-smooth: cubic-bezier(0.4, 0, 0.2, 1);          // Interactive elements
```

## Available Mixins

### Interactive Elements
```scss
@include interactive-button;    // Button hover effects (translateY, shadow)
@include interactive-card;      // Card hover effects (translateY, shadow)
@include interactive-link;      // Link hover effects (color only)
@include interactive-icon;      // Icon hover effects (color only)
```

### Transitions
```scss
@include smooth-transition;     // All properties
@include color-transition;      // Color, background, border
@include opacity-transition;    // Opacity only
@include transform-transition;  // Transform only (no scaling)
@include shadow-transition;     // Box-shadow only
```

### Animations
```scss
@include fade-in;               // Fade in from opacity 0
@include slide-up;              // Slide up from below
@include slide-down;            // Slide down from above
@include slide-left;            // Slide in from right
@include slide-right;           // Slide in from left
@include subtle-pulse;          // Subtle opacity pulse
@include shimmer;               // Loading shimmer effect
```

## Usage Examples

### Buttons
```scss
.my-button {
  @include interactive-button;
}
```

### Cards
```scss
.my-card {
  @include interactive-card;
}
```

### Links
```scss
.my-link {
  @include interactive-link;
}
```

### Icons
```scss
.my-icon {
  @include interactive-icon;
}
```

### Custom Transitions
```scss
.my-element {
  @include smooth-transition;
  
  &:hover {
    background-color: $primary-color;
    color: white;
  }
}
```

### Page Transitions
```scss
.page-enter {
  @include slide-up;
}
```

## Utility Classes
The system also provides utility classes for common animations:

```scss
.animate-fade-in
.animate-slide-up
.animate-slide-down
.animate-slide-left
.animate-slide-right
.animate-subtle-pulse
.animate-shimmer

.transition-smooth
.transition-color
.transition-opacity
.transition-transform
.transition-shadow
```

## Implementation Guidelines

### 1. Always Use Mixins
Instead of writing custom transitions, use the provided mixins:
```scss
// ❌ Don't do this
.my-element {
  transition: all 0.2s ease;
  &:hover { transform: scale(1.05); }
}

// ✅ Do this
.my-element {
  @include smooth-transition;
  &:hover { transform: translateY(-1px); }
}
```

### 2. Avoid Scaling Effects
Never use `scale()` transforms for hover effects:
```scss
// ❌ Don't do this
&:hover { transform: scale(1.05); }

// ✅ Do this
&:hover { transform: translateY(-1px); }
```

### 3. Use Appropriate Durations
- Fast (0.15s): Quick feedback, button hovers
- Normal (0.25s): Standard interactions, card hovers
- Slow (0.35s): Complex animations, page transitions

### 4. Consistent Easing
Always use the predefined easing functions:
```scss
// ❌ Don't do this
transition: all 0.2s ease;

// ✅ Do this
@include smooth-transition;
```

## Migration Guide

### From Custom Transitions
Replace custom transition definitions with mixins:

```scss
// Old way
.old-button {
  transition: all 0.2s ease;
  &:hover { transform: scale(1.05); }
}

// New way
.new-button {
  @include interactive-button;
}
```

### From Framer Motion
Replace Framer Motion animations with CSS animations:

```jsx
// Old way
<motion.button whileHover={{ scale: 1.05 }}>

// New way
<button className="interactive-button">
```

## Performance Considerations

1. **Use transform and opacity** for animations (GPU accelerated)
2. **Avoid layout-triggering properties** like width, height, margin
3. **Keep animations short** (under 300ms for interactions)
4. **Use will-change sparingly** only for complex animations

## Browser Support
All animations use modern CSS features supported by:
- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## Testing
Test animations on:
- Different devices (mobile, tablet, desktop)
- Various screen sizes
- Different performance levels
- Reduced motion preferences

## Accessibility
- Respect `prefers-reduced-motion` media query
- Ensure animations don't interfere with focus indicators
- Provide alternative states for users with vestibular disorders 