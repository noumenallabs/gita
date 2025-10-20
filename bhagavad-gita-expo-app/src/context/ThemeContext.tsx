import React, { createContext, useContext, ReactNode } from 'react';
import { useColorScheme } from 'react-native';
import { useAppContext } from './AppContext';
import {
  Theme,
  LightTheme,
  DarkTheme,
  HighContrastLightTheme,
  HighContrastDarkTheme,
  createTheme,
} from '../constants/theme';
import { FontSizePreference } from '../utils/accessibility';

interface ThemeContextType {
  theme: Theme;
  isDark: boolean;
  isHighContrast: boolean;
  toggleTheme: () => void;
  setHighContrast: (enabled: boolean) => void;
  setFontSizePreference: (size: keyof typeof FontSizePreference) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const systemColorScheme = useColorScheme();
  const { state, actions } = useAppContext();

  // Determine if we should use dark theme
  const shouldUseDarkTheme = () => {
    if (state.userPreferences.theme === 'system') {
      return systemColorScheme === 'dark';
    }
    return state.userPreferences.theme === 'dark';
  };

  const isDark = shouldUseDarkTheme();
  const isHighContrast = state.userPreferences.highContrast || false;
  const fontSizePreference = state.userPreferences.fontSize || 'medium';

  // Create the appropriate theme
  const getTheme = (): Theme => {
    const fontSizePref =
      FontSizePreference[fontSizePreference.toUpperCase() as keyof typeof FontSizePreference];

    if (isHighContrast) {
      return isDark
        ? createTheme(true, true, fontSizePref)
        : createTheme(false, true, fontSizePref);
    }

    return isDark
      ? createTheme(true, false, fontSizePref)
      : createTheme(false, false, fontSizePref);
  };

  const theme = getTheme();

  const toggleTheme = async () => {
    const currentTheme = state.userPreferences.theme;
    let newTheme: 'light' | 'dark' | 'system';

    // Cycle through: light -> dark -> system -> light
    switch (currentTheme) {
      case 'light':
        newTheme = 'dark';
        break;
      case 'dark':
        newTheme = 'system';
        break;
      case 'system':
      default:
        newTheme = 'light';
        break;
    }

    await actions.updateUserPreferences({ theme: newTheme });
  };

  const setHighContrast = async (enabled: boolean) => {
    await actions.updateUserPreferences({ highContrast: enabled });
  };

  const setFontSizePreference = async (size: keyof typeof FontSizePreference) => {
    await actions.updateUserPreferences({ fontSize: size.toLowerCase() as any });
  };

  const contextValue: ThemeContextType = {
    theme,
    isDark,
    isHighContrast,
    toggleTheme,
    setHighContrast,
    setFontSizePreference,
  };

  return <ThemeContext.Provider value={contextValue}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext);

  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }

  return context;
}

// Export the context for advanced use cases
export { ThemeContext };
