import { getFontSize, getSpacing, getTouchTargetSize } from '../utils/responsive';
import {
  FontSizePreference,
  FontSizePreferenceValue,
  HighContrastColors,
} from '../utils/accessibility';

export const Colors = {
  primary: {
    50: '#fff7ed',
    100: '#ffedd5',
    200: '#fed7aa',
    300: '#fdba74',
    400: '#fb923c',
    500: '#f97316',
    600: '#ea580c',
    700: '#c2410c',
    800: '#9a3412',
    900: '#7c2d12',
  },
  amber: {
    50: '#fffbeb',
    100: '#fef3c7',
    200: '#fde68a',
    300: '#fcd34d',
    400: '#fbbf24',
    500: '#f59e0b',
    600: '#d97706',
    700: '#b45309',
    800: '#92400e',
    900: '#78350f',
  },
  red: {
    50: '#fef2f2',
    100: '#fee2e2',
    200: '#fecaca',
    300: '#fca5a5',
    400: '#f87171',
    500: '#ef4444',
    600: '#dc2626',
    700: '#b91c1c',
    800: '#991b1b',
    900: '#7f1d1d',
  },
  gray: {
    50: '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    300: '#d1d5db',
    400: '#9ca3af',
    500: '#6b7280',
    600: '#4b5563',
    700: '#374151',
    800: '#1f2937',
    900: '#111827',
  },
};

export const Gradients = {
  primary: ['#f97316', '#ea580c'] as const,
  secondary: ['#fb923c', '#f59e0b'] as const,
  amber: ['#fbbf24', '#f59e0b'] as const,
  sunset: ['#fb923c', '#f59e0b'] as const,
};

// Dark theme colors
export const DarkColors = {
  primary: {
    50: '#7c2d12',
    100: '#9a3412',
    200: '#c2410c',
    300: '#ea580c',
    400: '#f97316',
    500: '#fb923c',
    600: '#fdba74',
    700: '#fed7aa',
    800: '#ffedd5',
    900: '#fff7ed',
  },
  amber: {
    50: '#78350f',
    100: '#92400e',
    200: '#b45309',
    300: '#d97706',
    400: '#f59e0b',
    500: '#fbbf24',
    600: '#fcd34d',
    700: '#fde68a',
    800: '#fef3c7',
    900: '#fffbeb',
  },
  red: {
    50: '#7f1d1d',
    100: '#991b1b',
    200: '#b91c1c',
    300: '#dc2626',
    400: '#ef4444',
    500: '#f87171',
    600: '#fca5a5',
    700: '#fecaca',
    800: '#fee2e2',
    900: '#fef2f2',
  },
  gray: {
    50: '#111827',
    100: '#1f2937',
    200: '#374151',
    300: '#4b5563',
    400: '#6b7280',
    500: '#9ca3af',
    600: '#d1d5db',
    700: '#e5e7eb',
    800: '#f3f4f6',
    900: '#f9fafb',
  },
};

// Dark theme gradients - enhanced for better contrast
export const DarkGradients = {
  primary: ['#fb923c', '#ea580c'] as const,
  secondary: ['#f59e0b', '#d97706'] as const,
  amber: ['#fbbf24', '#f59e0b'] as const,
  sunset: ['#fb923c', '#ea580c'] as const,
};

// Typography system
export const Typography = {
  // Headings
  h1: {
    fontSize: getFontSize(32),
    fontWeight: '700' as const,
    lineHeight: getFontSize(40),
  },
  h2: {
    fontSize: getFontSize(28),
    fontWeight: '600' as const,
    lineHeight: getFontSize(36),
  },
  h3: {
    fontSize: getFontSize(24),
    fontWeight: '600' as const,
    lineHeight: getFontSize(32),
  },
  h4: {
    fontSize: getFontSize(20),
    fontWeight: '600' as const,
    lineHeight: getFontSize(28),
  },
  h5: {
    fontSize: getFontSize(18),
    fontWeight: '600' as const,
    lineHeight: getFontSize(24),
  },
  h6: {
    fontSize: getFontSize(16),
    fontWeight: '600' as const,
    lineHeight: getFontSize(22),
  },

  // Body text - enhanced line height for better readability
  body1: {
    fontSize: getFontSize(16),
    fontWeight: '400' as const,
    lineHeight: getFontSize(26),
    letterSpacing: 0.1,
  },
  body2: {
    fontSize: getFontSize(14),
    fontWeight: '400' as const,
    lineHeight: getFontSize(22),
    letterSpacing: 0.1,
  },

  // Sanskrit text - enhanced for better readability
  sanskrit: {
    fontSize: getFontSize(19),
    fontWeight: '500' as const,
    lineHeight: getFontSize(30),
    letterSpacing: 0.3,
  },
  transliteration: {
    fontSize: getFontSize(16),
    fontWeight: '400' as const,
    lineHeight: getFontSize(25),
    fontStyle: 'italic' as const,
    letterSpacing: 0.2,
  },

  // UI text
  caption: {
    fontSize: getFontSize(12),
    fontWeight: '400' as const,
    lineHeight: getFontSize(16),
  },
  button: {
    fontSize: getFontSize(16),
    fontWeight: '600' as const,
    lineHeight: getFontSize(20),
  },
  label: {
    fontSize: getFontSize(14),
    fontWeight: '500' as const,
    lineHeight: getFontSize(18),
  },
};

// Spacing system
export const Spacing = {
  xs: getSpacing(4),
  sm: getSpacing(8),
  md: getSpacing(16),
  lg: getSpacing(24),
  xl: getSpacing(32),
  xxl: getSpacing(48),
};

// Border radius system
export const BorderRadius = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  full: 9999,
};

// Shadow system - enhanced for better depth perception
export const Shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.16,
    shadowRadius: 12,
    elevation: 8,
  },
  xl: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.22,
    shadowRadius: 24,
    elevation: 16,
  },
};

// Dark theme shadows - reduced opacity for dark backgrounds
export const DarkShadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 8,
  },
  xl: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.6,
    shadowRadius: 24,
    elevation: 16,
  },
};

// Touch targets
export const TouchTargets = {
  small: getTouchTargetSize(32),
  medium: getTouchTargetSize(40),
  large: getTouchTargetSize(48),
  xlarge: getTouchTargetSize(56),
};

// Theme interface
export interface Theme {
  colors: typeof Colors;
  gradients: typeof Gradients;
  typography: typeof Typography;
  spacing: typeof Spacing;
  borderRadius: typeof BorderRadius;
  shadows: typeof Shadows;
  touchTargets: typeof TouchTargets;
  isDark: boolean;
  isHighContrast: boolean;
  fontSizePreference: FontSizePreferenceValue;
}

// Create theme function
export const createTheme = (
  isDark: boolean = false,
  isHighContrast: boolean = false,
  fontSizePreference: FontSizePreferenceValue = FontSizePreference.MEDIUM
): Theme => {
  let colors = isDark ? DarkColors : Colors;
  const gradients = isDark ? DarkGradients : Gradients;
  const shadows = isDark ? DarkShadows : Shadows;

  if (isHighContrast) {
    colors = {
      ...colors,
      ...HighContrastColors,
    } as any;
  }

  return {
    colors,
    gradients: gradients as typeof Gradients,
    typography: Typography,
    spacing: Spacing,
    borderRadius: BorderRadius,
    shadows,
    touchTargets: TouchTargets,
    isDark,
    isHighContrast,
    fontSizePreference,
  };
};

// Default themes
export const LightTheme = createTheme(false, false, FontSizePreference.MEDIUM);
export const DarkTheme = createTheme(true, false, FontSizePreference.MEDIUM);
export const HighContrastLightTheme = createTheme(false, true, FontSizePreference.MEDIUM);
export const HighContrastDarkTheme = createTheme(true, true, FontSizePreference.MEDIUM);
