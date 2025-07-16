/**
 * Theme utility functions for dynamic theme management
 */

// Apply theme colors to CSS custom properties
export const applyTheme = (theme) => {
  const root = document.documentElement;
  
  // Primary colors
  if (theme.primaryColor) {
    root.style.setProperty('--primary-color', theme.primaryColor);
    // Generate darker and lighter variants
    const primaryRgb = hexToRgb(theme.primaryColor);
    if (primaryRgb) {
      root.style.setProperty('--primary-rgb', `${primaryRgb.r}, ${primaryRgb.g}, ${primaryRgb.b}`);
      root.style.setProperty('--primary-dark', darkenColor(theme.primaryColor, 0.2));
      root.style.setProperty('--primary-light', lightenColor(theme.primaryColor, 0.2));
    }
  }
  
  // Secondary colors
  if (theme.secondaryColor) {
    root.style.setProperty('--secondary-color', theme.secondaryColor);
    const secondaryRgb = hexToRgb(theme.secondaryColor);
    if (secondaryRgb) {
      root.style.setProperty('--secondary-rgb', `${secondaryRgb.r}, ${secondaryRgb.g}, ${secondaryRgb.b}`);
      root.style.setProperty('--secondary-dark', darkenColor(theme.secondaryColor, 0.2));
      root.style.setProperty('--secondary-light', lightenColor(theme.secondaryColor, 0.2));
    }
  }
  
  // Status colors
  if (theme.successColor) {
    root.style.setProperty('--success-color', theme.successColor);
    const successRgb = hexToRgb(theme.successColor);
    if (successRgb) {
      root.style.setProperty('--success-rgb', `${successRgb.r}, ${successRgb.g}, ${successRgb.b}`);
      root.style.setProperty('--success-dark', darkenColor(theme.successColor, 0.2));
      root.style.setProperty('--success-light', lightenColor(theme.successColor, 0.3));
    }
  }
  
  if (theme.warningColor) {
    root.style.setProperty('--warning-color', theme.warningColor);
    const warningRgb = hexToRgb(theme.warningColor);
    if (warningRgb) {
      root.style.setProperty('--warning-rgb', `${warningRgb.r}, ${warningRgb.g}, ${warningRgb.b}`);
      root.style.setProperty('--warning-dark', darkenColor(theme.warningColor, 0.2));
      root.style.setProperty('--warning-light', lightenColor(theme.warningColor, 0.3));
    }
  }
  
  if (theme.errorColor) {
    root.style.setProperty('--error-color', theme.errorColor);
    const errorRgb = hexToRgb(theme.errorColor);
    if (errorRgb) {
      root.style.setProperty('--error-rgb', `${errorRgb.r}, ${errorRgb.g}, ${errorRgb.b}`);
      root.style.setProperty('--error-dark', darkenColor(theme.errorColor, 0.2));
      root.style.setProperty('--error-light', lightenColor(theme.errorColor, 0.3));
    }
  }
  
  if (theme.infoColor) {
    root.style.setProperty('--info-color', theme.infoColor);
    const infoRgb = hexToRgb(theme.infoColor);
    if (infoRgb) {
      root.style.setProperty('--info-rgb', `${infoRgb.r}, ${infoRgb.g}, ${infoRgb.b}`);
      root.style.setProperty('--info-dark', darkenColor(theme.infoColor, 0.2));
      root.style.setProperty('--info-light', lightenColor(theme.infoColor, 0.3));
    }
  }
};

// Reset theme to defaults
export const resetTheme = () => {
  const root = document.documentElement;
  
  // Reset all custom properties
  root.style.removeProperty('--primary-color');
  root.style.removeProperty('--primary-dark');
  root.style.removeProperty('--primary-light');
  root.style.removeProperty('--primary-rgb');
  
  root.style.removeProperty('--secondary-color');
  root.style.removeProperty('--secondary-dark');
  root.style.removeProperty('--secondary-light');
  root.style.removeProperty('--secondary-rgb');
  
  root.style.removeProperty('--success-color');
  root.style.removeProperty('--success-dark');
  root.style.removeProperty('--success-light');
  root.style.removeProperty('--success-rgb');
  
  root.style.removeProperty('--warning-color');
  root.style.removeProperty('--warning-dark');
  root.style.removeProperty('--warning-light');
  root.style.removeProperty('--warning-rgb');
  
  root.style.removeProperty('--error-color');
  root.style.removeProperty('--error-dark');
  root.style.removeProperty('--error-light');
  root.style.removeProperty('--error-rgb');
  
  root.style.removeProperty('--info-color');
  root.style.removeProperty('--info-dark');
  root.style.removeProperty('--info-light');
  root.style.removeProperty('--info-rgb');
};

// Utility functions
export const hexToRgb = (hex) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
};

export const rgbToHex = (r, g, b) => {
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
};

export const darkenColor = (hex, amount) => {
  const rgb = hexToRgb(hex);
  if (!rgb) return hex;
  
  const r = Math.max(0, rgb.r - Math.round(255 * amount));
  const g = Math.max(0, rgb.g - Math.round(255 * amount));
  const b = Math.max(0, rgb.b - Math.round(255 * amount));
  
  return rgbToHex(r, g, b);
};

export const lightenColor = (hex, amount) => {
  const rgb = hexToRgb(hex);
  if (!rgb) return hex;
  
  const r = Math.min(255, rgb.r + Math.round(255 * amount));
  const g = Math.min(255, rgb.g + Math.round(255 * amount));
  const b = Math.min(255, rgb.b + Math.round(255 * amount));
  
  return rgbToHex(r, g, b);
};

// Preset themes
export const presetThemes = {
  modernGreen: {
    primaryColor: '#10b981',
    secondaryColor: '#059669',
    successColor: '#059669',
    warningColor: '#f59e0b',
    errorColor: '#ef4444',
    infoColor: '#3b82f6'
  },
  professionalBlue: {
    primaryColor: '#3b82f6',
    secondaryColor: '#1d4ed8',
    successColor: '#10b981',
    warningColor: '#f59e0b',
    errorColor: '#ef4444',
    infoColor: '#6366f1'
  },
  elegantPurple: {
    primaryColor: '#8b5cf6',
    secondaryColor: '#7c3aed',
    successColor: '#10b981',
    warningColor: '#f59e0b',
    errorColor: '#ef4444',
    infoColor: '#3b82f6'
  },
  corporateGray: {
    primaryColor: '#6b7280',
    secondaryColor: '#4b5563',
    successColor: '#10b981',
    warningColor: '#f59e0b',
    errorColor: '#ef4444',
    infoColor: '#3b82f6'
  },
  vibrantTeal: {
    primaryColor: '#14b8a6',
    secondaryColor: '#0d9488',
    successColor: '#10b981',
    warningColor: '#f59e0b',
    errorColor: '#ef4444',
    infoColor: '#3b82f6'
  },
  warmAmber: {
    primaryColor: '#f59e0b',
    secondaryColor: '#d97706',
    successColor: '#10b981',
    warningColor: '#f59e0b',
    errorColor: '#ef4444',
    infoColor: '#3b82f6'
  }
};

// Apply preset theme
export const applyPresetTheme = (themeName) => {
  const theme = presetThemes[themeName];
  if (theme) {
    applyTheme(theme);
    return theme;
  }
  return null;
}; 