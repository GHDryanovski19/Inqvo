// Centralized Animation Configuration
// Fast, snappy animations optimized for performance

export const animations = {
  // Page Transitions
  page: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.2, ease: "easeOut" }
  },

  // Fade In
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { duration: 0.15, ease: "easeOut" }
  },

  // Slide In (from left)
  slideInLeft: {
    initial: { x: -20, opacity: 0 },
    animate: { x: 0, opacity: 1 },
    transition: { duration: 0.2, ease: "easeOut" }
  },

  // Slide In (from right)
  slideInRight: {
    initial: { x: 20, opacity: 0 },
    animate: { x: 0, opacity: 1 },
    transition: { duration: 0.2, ease: "easeOut" }
  },

  // Slide In (from top)
  slideInTop: {
    initial: { y: -20, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    transition: { duration: 0.2, ease: "easeOut" }
  },

  // Slide In (from bottom)
  slideInBottom: {
    initial: { y: 20, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    transition: { duration: 0.2, ease: "easeOut" }
  },

  // Stagger Children
  staggerContainer: {
    animate: {
      transition: {
        staggerChildren: 0.05
      }
    }
  },

  // List Item
  listItem: {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
    transition: { duration: 0.15, ease: "easeOut" }
  },

  // Form Field
  formField: {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.15, ease: "easeOut" }
  },

  // Button Hover
  buttonHover: {
    whileHover: { 
      backgroundColor: "var(--primary-dark, #2A9245)",
      transition: { duration: 0.1, ease: "easeOut" }
    },
    whileTap: { 
      backgroundColor: "var(--primary-dark, #2A9245)",
      transition: { duration: 0.05 }
    }
  },

  // Card Hover
  cardHover: {
    whileHover: { 
      boxShadow: "0 8px 25px rgba(0, 0, 0, 0.12)",
      transition: { duration: 0.15, ease: "easeOut" }
    }
  },

  // Modal
  modal: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.2, ease: "easeOut" }
  },

  modalContent: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 20 },
    transition: { duration: 0.2, ease: "easeOut" }
  },

  // Dropdown
  dropdown: {
    initial: { opacity: 0, y: -10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
    transition: { duration: 0.15, ease: "easeOut" }
  },

  // Toast
  toast: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    transition: { duration: 0.2, ease: "easeOut" }
  },

  // Loading Spinner
  spinner: {
    animate: { 
      rotate: 360,
      transition: { 
        duration: 1, 
        ease: "linear", 
        repeat: Infinity 
      }
    }
  }
}

// Animation variants for specific components
export const variants = {
  // Invoice Items List
  invoiceItems: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  },

  // Invoice Item
  invoiceItem: {
    hidden: { opacity: 0, x: -20 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.2, ease: "easeOut" }
    },
    exit: { 
      opacity: 0, 
      x: 20,
      transition: { duration: 0.15, ease: "easeIn" }
    }
  },

  // Form Sections
  formSection: {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.2, ease: "easeOut" }
    }
  },

  // Client Selection
  clientSelection: {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { duration: 0.15, ease: "easeOut" }
    }
  }
}

// Animation presets for common use cases
export const presets = {
  // Fast fade in
  fastFade: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { duration: 0.1, ease: "easeOut" }
  },

  // Quick slide in
  quickSlide: {
    initial: { x: -10, opacity: 0 },
    animate: { x: 0, opacity: 1 },
    transition: { duration: 0.15, ease: "easeOut" }
  },

  // Instant appearance
  instant: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { duration: 0.05 }
  }
}

// Hook for easy animation usage
export const useAnimation = (type = 'fadeIn') => {
  return animations[type] || animations.fadeIn
}

// Hook for staggered animations
export const useStaggeredAnimation = (delay = 0.05) => {
  return {
    animate: {
      transition: {
        staggerChildren: delay
      }
    }
  }
} 