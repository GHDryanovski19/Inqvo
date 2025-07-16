// ============================================================================
// OPTIMIZED FRAMER MOTION ANIMATION CONFIGURATION
// Enterprise-focused, performance-optimized animations
// ============================================================================

// Animation Durations (Optimized for speed)
export const DURATION = {
  INSTANT: 0.05,
  FAST: 0.1,
  NORMAL: 0.15,
  SLOW: 0.25
};

// Easing Functions (Optimized for performance)
export const EASING = {
  LINEAR: "linear",
  EASE_OUT: "easeOut",
  EASE_IN: "easeIn",
  EASE_IN_OUT: "easeInOut"
};

// ============================================================================
// HOVER ANIMATIONS (NO SCALING)
// ============================================================================

// Button Hover (No scaling, optimized)
export const buttonHover = {
  whileHover: {
    y: -1,
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
    transition: { duration: DURATION.FAST, ease: EASING.EASE_OUT }
  },
  whileTap: {
    y: 0,
    boxShadow: "0 2px 6px rgba(0, 0, 0, 0.1)",
    transition: { duration: DURATION.INSTANT }
  }
};

// Card Hover (No scaling, optimized)
export const cardHover = {
  whileHover: {
    y: -2,
    boxShadow: "0 8px 24px rgba(0, 0, 0, 0.12)",
    transition: { duration: DURATION.NORMAL, ease: EASING.EASE_OUT }
  }
};

// Interactive Element Hover (No scaling)
export const interactiveHover = {
  whileHover: {
    y: -1,
    transition: { duration: DURATION.FAST, ease: EASING.EASE_OUT }
  },
  whileTap: {
    y: 0,
    transition: { duration: DURATION.INSTANT }
  }
};

// Link Hover (No scaling)
export const linkHover = {
  whileHover: {
    color: "var(--primary-color, #3B82F6)",
    transition: { duration: DURATION.FAST, ease: EASING.EASE_OUT }
  }
};

// ============================================================================
// ENTRANCE ANIMATIONS (OPTIMIZED)
// ============================================================================

// Fade In (Fast)
export const fadeIn = {
  initial: { opacity: 0 },
  animate: { 
    opacity: 1,
    transition: { duration: DURATION.NORMAL, ease: EASING.EASE_OUT }
  },
  exit: { 
    opacity: 0,
    transition: { duration: DURATION.FAST, ease: EASING.EASE_IN }
  }
};

// Slide Up (Optimized)
export const slideUp = {
  initial: { opacity: 0, y: 10 },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: { duration: DURATION.NORMAL, ease: EASING.EASE_OUT }
  },
  exit: { 
    opacity: 0, 
    y: -10,
    transition: { duration: DURATION.FAST, ease: EASING.EASE_IN }
  }
};

// Slide Down (Optimized)
export const slideDown = {
  initial: { opacity: 0, y: -10 },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: { duration: DURATION.NORMAL, ease: EASING.EASE_OUT }
  },
  exit: { 
    opacity: 0, 
    y: 10,
    transition: { duration: DURATION.FAST, ease: EASING.EASE_IN }
  }
};

// Slide Left (Optimized)
export const slideLeft = {
  initial: { opacity: 0, x: 10 },
  animate: { 
    opacity: 1, 
    x: 0,
    transition: { duration: DURATION.NORMAL, ease: EASING.EASE_OUT }
  },
  exit: { 
    opacity: 0, 
    x: -10,
    transition: { duration: DURATION.FAST, ease: EASING.EASE_IN }
  }
};

// Slide Right (Optimized)
export const slideRight = {
  initial: { opacity: 0, x: -10 },
  animate: { 
    opacity: 1, 
    x: 0,
    transition: { duration: DURATION.NORMAL, ease: EASING.EASE_OUT }
  },
  exit: { 
    opacity: 0, 
    x: 10,
    transition: { duration: DURATION.FAST, ease: EASING.EASE_IN }
  }
};

// ============================================================================
// STAGGERED ANIMATIONS (OPTIMIZED)
// ============================================================================

// Container with staggered children
export const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: DURATION.NORMAL,
      ease: EASING.EASE_OUT,
      staggerChildren: 0.03 // Faster stagger for better performance
    }
  }
};

// Item variants for staggered animations
export const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: DURATION.NORMAL, ease: EASING.EASE_OUT }
  }
};

// Staggered Fade In
export const staggeredFadeIn = {
  initial: { opacity: 0 },
  animate: (i) => ({
    opacity: 1,
    transition: { 
      duration: DURATION.NORMAL, 
      ease: EASING.EASE_OUT,
      delay: i * 0.03 // Faster stagger
    }
  })
};

// Staggered Slide Up
export const staggeredSlideUp = {
  initial: { opacity: 0, y: 10 },
  animate: (i) => ({
    opacity: 1,
    y: 0,
    transition: { 
      duration: DURATION.NORMAL, 
      ease: EASING.EASE_OUT,
      delay: i * 0.03 // Faster stagger
    }
  })
};

// ============================================================================
// LOADING ANIMATIONS (OPTIMIZED)
// ============================================================================

// Subtle Pulse (No scaling)
export const subtlePulse = {
  animate: {
    opacity: [1, 0.8, 1],
    transition: {
      duration: 1.5,
      ease: EASING.EASE_IN_OUT,
      repeat: Infinity
    }
  }
};

// Rotation (Optimized)
export const rotate = {
  animate: {
    rotate: 360,
    transition: {
      duration: 1,
      ease: EASING.LINEAR,
      repeat: Infinity
    }
  }
};

// ============================================================================
// MODAL ANIMATIONS (NO SCALING)
// ============================================================================

// Modal Backdrop
export const modalBackdrop = {
  initial: { opacity: 0 },
  animate: { 
    opacity: 1,
    transition: { duration: DURATION.NORMAL, ease: EASING.EASE_OUT }
  },
  exit: { 
    opacity: 0,
    transition: { duration: DURATION.FAST, ease: EASING.EASE_IN }
  }
};

// Modal Content (No scaling)
export const modalContent = {
  initial: { opacity: 0, y: 20 },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: { duration: DURATION.NORMAL, ease: EASING.EASE_OUT }
  },
  exit: { 
    opacity: 0, 
    y: 20,
    transition: { duration: DURATION.FAST, ease: EASING.EASE_IN }
  }
};

// ============================================================================
// DROPDOWN ANIMATIONS (NO SCALING)
// ============================================================================

// Dropdown Menu (No scaling)
export const dropdownMenu = {
  initial: { opacity: 0, y: -10 },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: { duration: DURATION.FAST, ease: EASING.EASE_OUT }
  },
  exit: { 
    opacity: 0, 
    y: -10,
    transition: { duration: DURATION.FAST, ease: EASING.EASE_IN }
  }
};

// ============================================================================
// PAGE TRANSITIONS (OPTIMIZED)
// ============================================================================

// Page Transition
export const pageTransition = {
  initial: { opacity: 0, x: -10 },
  animate: { 
    opacity: 1, 
    x: 0,
    transition: { duration: DURATION.NORMAL, ease: EASING.EASE_OUT }
  },
  exit: { 
    opacity: 0, 
    x: 10,
    transition: { duration: DURATION.FAST, ease: EASING.EASE_IN }
  }
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

// Create custom hover animation (No scaling)
export const createHoverAnimation = (y = -1, shadow = "0 4px 12px rgba(0, 0, 0, 0.15)") => ({
  whileHover: {
    y,
    boxShadow: shadow,
    transition: { duration: DURATION.FAST, ease: EASING.EASE_OUT }
  },
  whileTap: {
    y: 0,
    boxShadow: "0 2px 6px rgba(0, 0, 0, 0.1)",
    transition: { duration: DURATION.INSTANT }
  }
});

// Create custom entrance animation (No scaling)
export const createEntranceAnimation = (direction = "up", distance = 10) => {
  const variants = {
    initial: { opacity: 0 },
    animate: { 
      opacity: 1,
      transition: { duration: DURATION.NORMAL, ease: EASING.EASE_OUT }
    }
  };

  switch (direction) {
    case "up":
      variants.initial.y = distance;
      variants.animate.y = 0;
      break;
    case "down":
      variants.initial.y = -distance;
      variants.animate.y = 0;
      break;
    case "left":
      variants.initial.x = distance;
      variants.animate.x = 0;
      break;
    case "right":
      variants.initial.x = -distance;
      variants.animate.x = 0;
      break;
  }

  return variants;
};

// ============================================================================
// PRESET CONFIGURATIONS
// ============================================================================

// Default animation config for components
export const defaultAnimationConfig = {
  duration: DURATION.NORMAL,
  ease: EASING.EASE_OUT
};

// Quick animation presets
export const presets = {
  button: buttonHover,
  card: cardHover,
  interactive: interactiveHover,
  link: linkHover,
  fadeIn,
  slideUp,
  slideDown,
  slideLeft,
  slideRight,
  modal: modalContent,
  dropdown: dropdownMenu,
  page: pageTransition
}; 