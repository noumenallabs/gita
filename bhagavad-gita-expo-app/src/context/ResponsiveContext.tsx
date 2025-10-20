import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { Dimensions, ScaledSize } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  getDeviceType,
  getResponsiveProps,
  DeviceTypeValue,
  isTablet,
  isLargeScreen,
  isLandscape as checkIsLandscape,
} from '../utils/responsive';
import {
  FontSizePreference,
  FontSizePreferenceValue,
  isScreenReaderEnabled,
  isReduceMotionEnabled,
} from '../utils/accessibility';
import {
  Theme,
  LightTheme,
  DarkTheme,
  HighContrastLightTheme,
  HighContrastDarkTheme,
  createTheme,
} from '../constants/theme';

// Storage keys
const STORAGE_KEYS = {
  THEME_MODE: '@gita_theme_mode',
  HIGH_CONTRAST: '@gita_high_contrast',
  FONT_SIZE_PREFERENCE: '@gita_font_size',
  REDUCE_MOTION: '@gita_reduce_motion',
} as const;

// Theme modes
export const ThemeMode = {
  LIGHT: 'light',
  DARK: 'dark',
  SYSTEM: 'system',
} as const;

export type ThemeModeValue = (typeof ThemeMode)[keyof typeof ThemeMode];

// State interface
export interface ResponsiveState {
  // Device info
  deviceType: DeviceTypeValue;
  isTablet: boolean;
  isLargeScreen: boolean;
  isLandscape: boolean;
  screenWidth: number;
  screenHeight: number;

  // Theme preferences
  themeMode: ThemeModeValue;
  isDarkMode: boolean;
  isHighContrast: boolean;

  // Accessibility preferences
  fontSizePreference: FontSizePreferenceValue;
  isScreenReaderActive: boolean;
  reduceMotion: boolean;

  // Current theme
  theme: Theme;

  // Loading state
  isLoading: boolean;
}

// Action types
export const ResponsiveActionType = {
  SET_DIMENSIONS: 'SET_DIMENSIONS',
  SET_THEME_MODE: 'SET_THEME_MODE',
  SET_HIGH_CONTRAST: 'SET_HIGH_CONTRAST',
  SET_FONT_SIZE_PREFERENCE: 'SET_FONT_SIZE_PREFERENCE',
  SET_SCREEN_READER_STATUS: 'SET_SCREEN_READER_STATUS',
  SET_REDUCE_MOTION: 'SET_REDUCE_MOTION',
  SET_LOADING: 'SET_LOADING',
  INITIALIZE_PREFERENCES: 'INITIALIZE_PREFERENCES',
} as const;

export type ResponsiveAction =
  | { type: typeof ResponsiveActionType.SET_DIMENSIONS; payload: { width: number; height: number } }
  | { type: typeof ResponsiveActionType.SET_THEME_MODE; payload: ThemeModeValue }
  | { type: typeof ResponsiveActionType.SET_HIGH_CONTRAST; payload: boolean }
  | { type: typeof ResponsiveActionType.SET_FONT_SIZE_PREFERENCE; payload: FontSizePreferenceValue }
  | { type: typeof ResponsiveActionType.SET_SCREEN_READER_STATUS; payload: boolean }
  | { type: typeof ResponsiveActionType.SET_REDUCE_MOTION; payload: boolean }
  | { type: typeof ResponsiveActionType.SET_LOADING; payload: boolean }
  | {
      type: typeof ResponsiveActionType.INITIALIZE_PREFERENCES;
      payload: {
        themeMode: ThemeModeValue;
        isHighContrast: boolean;
        fontSizePreference: FontSizePreferenceValue;
        reduceMotion: boolean;
      };
    };

// Context interface
export interface ResponsiveContextType {
  state: ResponsiveState;
  actions: {
    setThemeMode: (mode: ThemeModeValue) => void;
    setHighContrast: (enabled: boolean) => void;
    setFontSizePreference: (preference: FontSizePreferenceValue) => void;
    setReduceMotion: (enabled: boolean) => void;
    resetToDefaults: () => void;
  };
}

// Get system theme (simplified - in real app you'd use Appearance API)
const getSystemTheme = (): 'light' | 'dark' => {
  // For now, default to light. In a real app, you'd use:
  // import { Appearance } from 'react-native';
  // return Appearance.getColorScheme() || 'light';
  return 'light';
};

// Create theme based on preferences
const createCurrentTheme = (
  themeMode: ThemeModeValue,
  isHighContrast: boolean,
  fontSizePreference: FontSizePreferenceValue
): { theme: Theme; isDarkMode: boolean } => {
  const systemTheme = getSystemTheme();
  const isDarkMode =
    themeMode === ThemeMode.DARK || (themeMode === ThemeMode.SYSTEM && systemTheme === 'dark');

  let theme: Theme;

  if (isHighContrast) {
    theme = isDarkMode ? HighContrastDarkTheme : HighContrastLightTheme;
  } else {
    theme = isDarkMode ? DarkTheme : LightTheme;
  }

  // Update theme with font size preference
  theme = createTheme(isDarkMode, isHighContrast, fontSizePreference);

  return { theme, isDarkMode };
};

// Initial state
const createInitialState = (): ResponsiveState => {
  const { width, height } = Dimensions.get('window');
  const responsiveProps = getResponsiveProps();
  const { theme, isDarkMode } = createCurrentTheme(
    ThemeMode.LIGHT,
    false,
    FontSizePreference.MEDIUM
  );

  return {
    deviceType: responsiveProps.deviceType,
    isTablet: responsiveProps.isTablet,
    isLargeScreen: responsiveProps.isLargeScreen,
    isLandscape: responsiveProps.isLandscape,
    screenWidth: width,
    screenHeight: height,
    themeMode: ThemeMode.LIGHT,
    isDarkMode,
    isHighContrast: false,
    fontSizePreference: FontSizePreference.MEDIUM,
    isScreenReaderActive: false,
    reduceMotion: false,
    theme,
    isLoading: true,
  };
};

// Reducer
const responsiveReducer = (state: ResponsiveState, action: ResponsiveAction): ResponsiveState => {
  switch (action.type) {
    case ResponsiveActionType.SET_DIMENSIONS: {
      const { width, height } = action.payload;
      const deviceType = getDeviceType();

      return {
        ...state,
        screenWidth: width,
        screenHeight: height,
        deviceType,
        isTablet: isTablet(),
        isLargeScreen: isLargeScreen(),
        isLandscape: checkIsLandscape(),
      };
    }

    case ResponsiveActionType.SET_THEME_MODE: {
      const { theme, isDarkMode } = createCurrentTheme(
        action.payload,
        state.isHighContrast,
        state.fontSizePreference
      );

      return {
        ...state,
        themeMode: action.payload,
        isDarkMode,
        theme,
      };
    }

    case ResponsiveActionType.SET_HIGH_CONTRAST: {
      const { theme, isDarkMode } = createCurrentTheme(
        state.themeMode,
        action.payload,
        state.fontSizePreference
      );

      return {
        ...state,
        isHighContrast: action.payload,
        theme,
      };
    }

    case ResponsiveActionType.SET_FONT_SIZE_PREFERENCE: {
      const { theme } = createCurrentTheme(state.themeMode, state.isHighContrast, action.payload);

      return {
        ...state,
        fontSizePreference: action.payload,
        theme,
      };
    }

    case ResponsiveActionType.SET_SCREEN_READER_STATUS:
      return {
        ...state,
        isScreenReaderActive: action.payload,
      };

    case ResponsiveActionType.SET_REDUCE_MOTION:
      return {
        ...state,
        reduceMotion: action.payload,
      };

    case ResponsiveActionType.SET_LOADING:
      return {
        ...state,
        isLoading: action.payload,
      };

    case ResponsiveActionType.INITIALIZE_PREFERENCES: {
      const { themeMode, isHighContrast, fontSizePreference, reduceMotion } = action.payload;
      const { theme, isDarkMode } = createCurrentTheme(
        themeMode,
        isHighContrast,
        fontSizePreference
      );

      return {
        ...state,
        themeMode,
        isDarkMode,
        isHighContrast,
        fontSizePreference,
        reduceMotion,
        theme,
        isLoading: false,
      };
    }

    default:
      return state;
  }
};

// Create context
const ResponsiveContext = createContext<ResponsiveContextType | undefined>(undefined);

// Provider component
export interface ResponsiveProviderProps {
  children: ReactNode;
}

export const ResponsiveProvider: React.FC<ResponsiveProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(responsiveReducer, createInitialState());

  // Load preferences from storage
  useEffect(() => {
    const loadPreferences = async () => {
      try {
        const [themeMode, isHighContrast, fontSizePreference, reduceMotion] = await Promise.all([
          AsyncStorage.getItem(STORAGE_KEYS.THEME_MODE),
          AsyncStorage.getItem(STORAGE_KEYS.HIGH_CONTRAST),
          AsyncStorage.getItem(STORAGE_KEYS.FONT_SIZE_PREFERENCE),
          AsyncStorage.getItem(STORAGE_KEYS.REDUCE_MOTION),
        ]);

        dispatch({
          type: ResponsiveActionType.INITIALIZE_PREFERENCES,
          payload: {
            themeMode: (themeMode as ThemeModeValue) || ThemeMode.LIGHT,
            isHighContrast: isHighContrast === 'true',
            fontSizePreference:
              (fontSizePreference as FontSizePreferenceValue) || FontSizePreference.MEDIUM,
            reduceMotion: reduceMotion === 'true',
          },
        });
      } catch (error) {
        console.warn('Failed to load preferences:', error);
        dispatch({ type: ResponsiveActionType.SET_LOADING, payload: false });
      }
    };

    loadPreferences();
  }, []);

  // Check accessibility settings
  useEffect(() => {
    const checkAccessibilitySettings = async () => {
      try {
        const [screenReaderEnabled, reduceMotionEnabled] = await Promise.all([
          isScreenReaderEnabled(),
          isReduceMotionEnabled(),
        ]);

        dispatch({
          type: ResponsiveActionType.SET_SCREEN_READER_STATUS,
          payload: screenReaderEnabled,
        });

        if (reduceMotionEnabled && !state.reduceMotion) {
          dispatch({ type: ResponsiveActionType.SET_REDUCE_MOTION, payload: true });
        }
      } catch (error) {
        console.warn('Failed to check accessibility settings:', error);
      }
    };

    checkAccessibilitySettings();
  }, [state.reduceMotion]);

  // Listen to dimension changes
  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      dispatch({
        type: ResponsiveActionType.SET_DIMENSIONS,
        payload: { width: window.width, height: window.height },
      });
    });

    return () => subscription?.remove();
  }, []);

  // Actions
  const setThemeMode = async (mode: ThemeModeValue) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.THEME_MODE, mode);
      dispatch({ type: ResponsiveActionType.SET_THEME_MODE, payload: mode });
    } catch (error) {
      console.warn('Failed to save theme mode:', error);
    }
  };

  const setHighContrast = async (enabled: boolean) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.HIGH_CONTRAST, enabled.toString());
      dispatch({ type: ResponsiveActionType.SET_HIGH_CONTRAST, payload: enabled });
    } catch (error) {
      console.warn('Failed to save high contrast setting:', error);
    }
  };

  const setFontSizePreference = async (preference: FontSizePreferenceValue) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.FONT_SIZE_PREFERENCE, preference);
      dispatch({ type: ResponsiveActionType.SET_FONT_SIZE_PREFERENCE, payload: preference });
    } catch (error) {
      console.warn('Failed to save font size preference:', error);
    }
  };

  const setReduceMotion = async (enabled: boolean) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.REDUCE_MOTION, enabled.toString());
      dispatch({ type: ResponsiveActionType.SET_REDUCE_MOTION, payload: enabled });
    } catch (error) {
      console.warn('Failed to save reduce motion setting:', error);
    }
  };

  const resetToDefaults = async () => {
    try {
      await Promise.all([
        AsyncStorage.removeItem(STORAGE_KEYS.THEME_MODE),
        AsyncStorage.removeItem(STORAGE_KEYS.HIGH_CONTRAST),
        AsyncStorage.removeItem(STORAGE_KEYS.FONT_SIZE_PREFERENCE),
        AsyncStorage.removeItem(STORAGE_KEYS.REDUCE_MOTION),
      ]);

      dispatch({
        type: ResponsiveActionType.INITIALIZE_PREFERENCES,
        payload: {
          themeMode: ThemeMode.LIGHT,
          isHighContrast: false,
          fontSizePreference: FontSizePreference.MEDIUM,
          reduceMotion: false,
        },
      });
    } catch (error) {
      console.warn('Failed to reset preferences:', error);
    }
  };

  const contextValue: ResponsiveContextType = {
    state,
    actions: {
      setThemeMode,
      setHighContrast,
      setFontSizePreference,
      setReduceMotion,
      resetToDefaults,
    },
  };

  return <ResponsiveContext.Provider value={contextValue}>{children}</ResponsiveContext.Provider>;
};

// Hook to use responsive context
export const useResponsive = (): ResponsiveContextType => {
  const context = useContext(ResponsiveContext);
  if (!context) {
    throw new Error('useResponsive must be used within a ResponsiveProvider');
  }
  return context;
};

// Convenience hooks
export const useTheme = (): Theme => {
  const { state } = useResponsive();
  return state.theme;
};

export const useDeviceInfo = () => {
  const { state } = useResponsive();
  return {
    deviceType: state.deviceType,
    isTablet: state.isTablet,
    isLargeScreen: state.isLargeScreen,
    isLandscape: state.isLandscape,
    screenWidth: state.screenWidth,
    screenHeight: state.screenHeight,
  };
};

export const useAccessibility = () => {
  const { state, actions } = useResponsive();
  return {
    fontSizePreference: state.fontSizePreference,
    isScreenReaderActive: state.isScreenReaderActive,
    reduceMotion: state.reduceMotion,
    isHighContrast: state.isHighContrast,
    setFontSizePreference: actions.setFontSizePreference,
    setReduceMotion: actions.setReduceMotion,
    setHighContrast: actions.setHighContrast,
  };
};
