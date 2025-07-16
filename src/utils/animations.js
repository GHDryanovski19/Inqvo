// ============================================================================
// CENTRALIZED FRAMER MOTION ANIMATION CONFIGURATION
// ============================================================================

// Animation Durations
export const DURATION = {
  FAST: 0.15,
  NORMAL: 0.25,
  SLOW: 0.35,
  EXTRA_SLOW: 0.5
};

// Easing Functions (Enterprise-appropriate)
export const EASING = {
  SMOOTH: [0.4, 0, 0.2, 1],        // Interactive elements
  OUT: [0.25, 0.46, 0.45, 0.94],   // Enter animations
  IN: [0.55, 0.055, 0.675, 0.19],  // Exit animations
  IN_OUT: [0.645, 0.045, 0.355, 1] // Complex animations
};

// ============================================================================
// ENTERPRISE-APPROPRIATE ANIMATIONS (NO SCALING)
// ============================================================================

// Button Hover Effects (No scaling)
export const buttonHover = {
  hover: {
    y: -1,
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
    transition: { duration: DURATION.FAST, ease: EASING.SMOOTH }
  },
  tap: {
    y: 0,
    boxShadow: "0 2px 6px rgba(0, 0, 0, 0.1)",
    transition: { duration: DURATION.FAST, ease: EASING.SMOOTH }
  }
};

// Card Hover Effects (No scaling)
export const cardHover = {
  hover: {
    y: -2,
    boxShadow: "0 8px 24px rgba(0, 0, 0, 0.12)",
    transition: { duration: DURATION.NORMAL, ease: EASING.SMOOTH }
  }
};

// Interactive Element Hover (No scaling)
export const interactiveHover = {
  hover: {
    y: -1,
    transition: { duration: DURATION.FAST, ease: EASING.SMOOTH }
  },
  tap: {
    y: 0,
    transition: { duration: DURATION.FAST, ease: EASING.SMOOTH }
  }
};

// ============================================================================
// ENTRANCE ANIMATIONS
// ============================================================================

// Fade In
export const fadeIn = {
  initial: { opacity: 0 },
  animate: { 
    opacity: 1,
    transition: { duration: DURATION.NORMAL, ease: EASING.OUT }
  },
  exit: { 
    opacity: 0,
    transition: { duration: DURATION.FAST, ease: EASING.IN }
  }
};

// Slide Up
export const slideUp = {
  initial: { opacity: 0, y: 10 },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: { duration: DURATION.NORMAL, ease: EASING.OUT }
  },
  exit: { 
    opacity: 0, 
    y: -10,
    transition: { duration: DURATION.FAST, ease: EASING.IN }
  }
};

// Slide Down
export const slideDown = {
  initial: { opacity: 0, y: -10 },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: { duration: DURATION.NORMAL, ease: EASING.OUT }
  },
  exit: { 
    opacity: 0, 
    y: 10,
    transition: { duration: DURATION.FAST, ease: EASING.IN }
  }
};

// Slide Left
export const slideLeft = {
  initial: { opacity: 0, x: 10 },
  animate: { 
    opacity: 1, 
    x: 0,
    transition: { duration: DURATION.NORMAL, ease: EASING.OUT }
  },
  exit: { 
    opacity: 0, 
    x: -10,
    transition: { duration: DURATION.FAST, ease: EASING.IN }
  }
};

// Slide Right
export const slideRight = {
  initial: { opacity: 0, x: -10 },
  animate: { 
    opacity: 1, 
    x: 0,
    transition: { duration: DURATION.NORMAL, ease: EASING.OUT }
  },
  exit: { 
    opacity: 0, 
    x: 10,
    transition: { duration: DURATION.FAST, ease: EASING.IN }
  }
};

// ============================================================================
// STAGGERED ANIMATIONS
// ============================================================================

// Staggered Fade In
export const staggeredFadeIn = {
  initial: { opacity: 0 },
  animate: (i) => ({
    opacity: 1,
    transition: { 
      duration: DURATION.NORMAL, 
      ease: EASING.OUT,
      delay: i * 0.05 
    }
  })
};

// Staggered Slide Up
export const staggeredSlideUp = {
  initial: { opacity: 0, y: 20 },
  animate: (i) => ({
    opacity: 1,
    y: 0,
    transition: { 
      duration: DURATION.NORMAL, 
      ease: EASING.OUT,
      delay: i * 0.05 
    }
  })
};

// ============================================================================
// CONTAINER ANIMATIONS
// ============================================================================

// Container with staggered children
export const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: DURATION.NORMAL,
      ease: EASING.OUT,
      staggerChildren: 0.05
    }
  }
};

// Item variants for staggered animations
export const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: DURATION.NORMAL, ease: EASING.OUT }
  }
};

// ============================================================================
// LOADING ANIMATIONS
// ============================================================================

// Subtle Pulse (No scaling)
export const subtlePulse = {
  animate: {
    opacity: [1, 0.7, 1],
    transition: {
      duration: 2,
      ease: EASING.IN_OUT,
      repeat: Infinity
    }
  }
};

// Rotation
export const rotate = {
  animate: {
    rotate: 360,
    transition: {
      duration: 1,
      ease: "linear",
      repeat: Infinity
    }
  }
};

// ============================================================================
// MODAL ANIMATIONS
// ============================================================================

// Modal Backdrop
export const modalBackdrop = {
  initial: { opacity: 0 },
  animate: { 
    opacity: 1,
    transition: { duration: DURATION.NORMAL, ease: EASING.OUT }
  },
  exit: { 
    opacity: 0,
    transition: { duration: DURATION.FAST, ease: EASING.IN }
  }
};

// Modal Content
export const modalContent = {
  initial: { opacity: 0, y: 20, scale: 0.95 },
  animate: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: { duration: DURATION.NORMAL, ease: EASING.OUT }
  },
  exit: { 
    opacity: 0, 
    y: 20, 
    scale: 0.95,
    transition: { duration: DURATION.FAST, ease: EASING.IN }
  }
};

// ============================================================================
// DROPDOWN ANIMATIONS
// ============================================================================

// Dropdown Menu
export const dropdownMenu = {
  initial: { opacity: 0, y: -10, scale: 0.95 },
  animate: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: { duration: DURATION.FAST, ease: EASING.OUT }
  },
  exit: { 
    opacity: 0, 
    y: -10, 
    scale: 0.95,
    transition: { duration: DURATION.FAST, ease: EASING.IN }
  }
};

// ============================================================================
// PAGE TRANSITIONS
// ============================================================================

// Page Transition
export const pageTransition = {
  initial: { opacity: 0, x: -20 },
  animate: { 
    opacity: 1, 
    x: 0,
    transition: { duration: DURATION.NORMAL, ease: EASING.OUT }
  },
  exit: { 
    opacity: 0, 
    x: 20,
    transition: { duration: DURATION.FAST, ease: EASING.IN }
  }
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

// Create custom hover animation
export const createHoverAnimation = (y = -1, shadow = "0 4px 12px rgba(0, 0, 0, 0.15)") => ({
  hover: {
    y,
    boxShadow: shadow,
    transition: { duration: DURATION.FAST, ease: EASING.SMOOTH }
  },
  tap: {
    y: 0,
    boxShadow: "0 2px 6px rgba(0, 0, 0, 0.1)",
    transition: { duration: DURATION.FAST, ease: EASING.SMOOTH }
  }
});

// Create custom entrance animation
export const createEntranceAnimation = (direction = "up", distance = 20) => {
  const variants = {
    initial: { opacity: 0 },
    animate: { 
      opacity: 1,
      transition: { duration: DURATION.NORMAL, ease: EASING.OUT }
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
  ease: EASING.SMOOTH
};

// Quick animation presets
export const presets = {
  button: buttonHover,
  card: cardHover,
  interactive: interactiveHover,
  fadeIn,
  slideUp,
  slideDown,
  slideLeft,
  slideRight,
  modal: modalContent,
  dropdown: dropdownMenu,
  page: pageTransition
}; 