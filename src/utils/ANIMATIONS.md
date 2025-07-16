# Centralized Framer Motion Animation System

## Overview
This document describes the centralized Framer Motion animation configuration for the Inqvo application. All animations are designed to be enterprise-appropriate, avoiding scaling/growing effects that can feel unprofessional.

## Core Principles
- **No scaling effects** - Elements should not grow or shrink on hover
- **Subtle movements** - Use translateY/translateX for hover effects
- **Consistent timing** - All animations use standardized durations
- **Smooth easing** - Professional cubic-bezier curves
- **Performance focused** - Optimized for 60fps animations

## Animation Durations
```javascript
DURATION.FAST = 0.15      // Quick feedback
DURATION.NORMAL = 0.25    // Standard interactions
DURATION.SLOW = 0.35      // Complex animations
DURATION.EXTRA_SLOW = 0.5 // Page transitions
```

## Easing Functions
```javascript
EASING.SMOOTH = [0.4, 0, 0.2, 1]        // Interactive elements
EASING.OUT = [0.25, 0.46, 0.45, 0.94]   // Enter animations
EASING.IN = [0.55, 0.055, 0.675, 0.19]  // Exit animations
EASING.IN_OUT = [0.645, 0.045, 0.355, 1] // Complex animations
```

## Available Animations

### Interactive Elements (No Scaling)
```javascript
import { buttonHover, cardHover, interactiveHover } from '../utils/animations';

// Button hover effects (translateY + shadow)
<motion.button variants={buttonHover} whileHover="hover" whileTap="tap">

// Card hover effects (translateY + shadow)
<motion.div variants={cardHover} whileHover="hover">

// Interactive element hover (translateY only)
<motion.div variants={interactiveHover} whileHover="hover" whileTap="tap">
```

### Entrance Animations
```javascript
import { fadeIn, slideUp, slideDown, slideLeft, slideRight } from '../utils/animations';

// Fade in
<motion.div variants={fadeIn} initial="initial" animate="animate" exit="exit">

// Slide up
<motion.div variants={slideUp} initial="initial" animate="animate" exit="exit">

// Slide down
<motion.div variants={slideDown} initial="initial" animate="animate" exit="exit">

// Slide left/right
<motion.div variants={slideLeft} initial="initial" animate="animate" exit="exit">
<motion.div variants={slideRight} initial="initial" animate="animate" exit="exit">
```

### Staggered Animations
```javascript
import { staggeredFadeIn, staggeredSlideUp, containerVariants, itemVariants } from '../utils/animations';

// Container with staggered children
<motion.div variants={containerVariants} initial="hidden" animate="visible">
  {items.map((item, i) => (
    <motion.div key={item.id} variants={itemVariants}>
      {item.content}
    </motion.div>
  ))}
</motion.div>

// Custom staggered animation
{items.map((item, i) => (
  <motion.div
    key={item.id}
    variants={staggeredFadeIn}
    initial="initial"
    animate="animate"
    custom={i}
  >
    {item.content}
  </motion.div>
))}
```

### Loading Animations
```javascript
import { subtlePulse, rotate } from '../utils/animations';

// Subtle pulse (no scaling)
<motion.div variants={subtlePulse} animate="animate">

// Rotation
<motion.div variants={rotate} animate="animate">
```

### Modal Animations
```javascript
import { modalBackdrop, modalContent } from '../utils/animations';

// Modal backdrop
<motion.div variants={modalBackdrop} initial="initial" animate="animate" exit="exit">

// Modal content
<motion.div variants={modalContent} initial="initial" animate="animate" exit="exit">
```

### Dropdown Animations
```javascript
import { dropdownMenu } from '../utils/animations';

// Dropdown menu
<motion.div variants={dropdownMenu} initial="initial" animate="animate" exit="exit">
```

### Page Transitions
```javascript
import { pageTransition } from '../utils/animations';

// Page transition
<motion.div variants={pageTransition} initial="initial" animate="animate" exit="exit">
```

## Usage Examples

### Button Component
```jsx
import { motion } from 'framer-motion';
import { buttonHover } from '../utils/animations';

const Button = ({ children, ...props }) => (
  <motion.button
    variants={buttonHover}
    whileHover="hover"
    whileTap="tap"
    {...props}
  >
    {children}
  </motion.button>
);
```

### Card Component
```jsx
import { motion } from 'framer-motion';
import { cardHover } from '../utils/animations';

const Card = ({ children, ...props }) => (
  <motion.div
    variants={cardHover}
    whileHover="hover"
    {...props}
  >
    {children}
  </motion.div>
);
```

### List with Staggered Animation
```jsx
import { motion } from 'framer-motion';
import { containerVariants, itemVariants } from '../utils/animations';

const List = ({ items }) => (
  <motion.div
    variants={containerVariants}
    initial="hidden"
    animate="visible"
  >
    {items.map((item) => (
      <motion.div key={item.id} variants={itemVariants}>
        {item.content}
      </motion.div>
    ))}
  </motion.div>
);
```

### Custom Hover Animation
```jsx
import { motion } from 'framer-motion';
import { createHoverAnimation } from '../utils/animations';

const customHover = createHoverAnimation(-2, "0 8px 24px rgba(0, 0, 0, 0.12)");

const CustomComponent = () => (
  <motion.div
    variants={customHover}
    whileHover="hover"
    whileTap="tap"
  >
    Content
  </motion.div>
);
```

### Custom Entrance Animation
```jsx
import { motion } from 'framer-motion';
import { createEntranceAnimation } from '../utils/animations';

const slideUpAnimation = createEntranceAnimation("up", 30);

const Component = () => (
  <motion.div
    variants={slideUpAnimation}
    initial="initial"
    animate="animate"
  >
    Content
  </motion.div>
);
```

## Utility Functions

### createHoverAnimation(y, shadow)
Creates a custom hover animation with specified translateY and shadow values.
```javascript
const customHover = createHoverAnimation(-3, "0 12px 32px rgba(0, 0, 0, 0.15)");
```

### createEntranceAnimation(direction, distance)
Creates a custom entrance animation with specified direction and distance.
```javascript
const slideUp = createEntranceAnimation("up", 50);
const slideLeft = createEntranceAnimation("left", 30);
```

## Preset Configurations
```javascript
import { presets } from '../utils/animations';

// Quick access to common animations
const { button, card, interactive, fadeIn, slideUp, modal, dropdown, page } = presets;
```

## Implementation Guidelines

### 1. Always Use Preset Animations
Instead of creating custom animations, use the provided presets:
```jsx
// ❌ Don't do this
<motion.button whileHover={{ scale: 1.05 }}>

// ✅ Do this
<motion.button variants={buttonHover} whileHover="hover" whileTap="tap">
```

### 2. Avoid Scaling Effects
Never use `scale` transforms for hover effects:
```jsx
// ❌ Don't do this
whileHover={{ scale: 1.05 }}

// ✅ Do this
variants={buttonHover} // Uses translateY instead
```

### 3. Use Appropriate Durations
- Fast (0.15s): Quick feedback, button hovers
- Normal (0.25s): Standard interactions, card hovers
- Slow (0.35s): Complex animations, page transitions

### 4. Consistent Easing
Always use the predefined easing functions:
```jsx
// ❌ Don't do this
transition={{ duration: 0.2, ease: "ease" }}

// ✅ Do this
transition={{ duration: DURATION.FAST, ease: EASING.SMOOTH }}
```

## Migration Guide

### From CSS Transitions
Replace CSS transitions with Framer Motion:
```jsx
// Old way
<div className="button-with-css-transition">

// New way
<motion.button variants={buttonHover} whileHover="hover" whileTap="tap">
```

### From Custom Framer Motion
Replace custom Framer Motion animations with presets:
```jsx
// Old way
<motion.button whileHover={{ scale: 1.05, y: -2 }}>

// New way
<motion.button variants={buttonHover} whileHover="hover" whileTap="tap">
```

## Performance Considerations

1. **Use transform and opacity** for animations (GPU accelerated)
2. **Avoid layout-triggering properties** like width, height, margin
3. **Keep animations short** (under 300ms for interactions)
4. **Use will-change sparingly** only for complex animations

## Browser Support
All animations use Framer Motion features supported by:
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