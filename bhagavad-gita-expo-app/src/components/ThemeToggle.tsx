import React from 'react';
import { Pressable, Text, View, ViewStyle, TextStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useResponsive, useDeviceInfo } from '../context/ResponsiveContext';
import { getAccessibilityProps } from '../utils/accessibility';

export interface ThemeToggleProps {
  style?: ViewStyle;
  size?: 'small' | 'medium' | 'large';
  showLabel?: boolean;
  variant?: 'icon' | 'button' | 'card';
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({
  style,
  size = 'medium',
  showLabel = false,
  variant = 'icon',
}) => {
  const { state, actions } = useResponsive();
  const { theme, isDarkMode: isDark } = state;
  const { isTablet } = useDeviceInfo();

  const handleToggle = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    // Cycle through theme modes
    const currentMode = state.themeMode;
    const nextMode = currentMode === 'light' ? 'dark' : currentMode === 'dark' ? 'system' : 'light';
    await actions.setThemeMode(nextMode);
  };

  const getIconSize = () => {
    const baseSize = {
      small: 20,
      medium: 24,
      large: 28,
    }[size];

    return isTablet ? baseSize + 4 : baseSize;
  };

  const getThemeIcon = () => {
    return isDark ? 'sunny' : 'moon';
  };

  const getThemeLabel = () => {
    return isDark ? 'Light Mode' : 'Dark Mode';
  };

  const getContainerStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      alignItems: 'center',
      justifyContent: 'center',
    };

    switch (variant) {
      case 'icon':
        return {
          ...baseStyle,
          width: theme.touchTargets.medium,
          height: theme.touchTargets.medium,
          borderRadius: theme.touchTargets.medium / 2,
          backgroundColor: 'rgba(255, 255, 255, 0.2)',
        };

      case 'button':
        return {
          ...baseStyle,
          flexDirection: 'row',
          paddingHorizontal: theme.spacing.md,
          paddingVertical: theme.spacing.sm,
          borderRadius: theme.borderRadius.md,
          backgroundColor: theme.isDark ? theme.colors.gray[800] : theme.colors.gray[100],
          borderWidth: 1,
          borderColor: theme.isDark ? theme.colors.gray[700] : theme.colors.gray[200],
          ...theme.shadows.sm,
        };

      case 'card':
        return {
          ...baseStyle,
          flexDirection: 'row',
          padding: theme.spacing.md,
          borderRadius: theme.borderRadius.lg,
          backgroundColor: theme.isDark ? theme.colors.gray[800] : theme.colors.gray[50],
          borderWidth: 1,
          borderColor: theme.isDark ? theme.colors.gray[700] : theme.colors.gray[200],
          ...theme.shadows.md,
        };

      default:
        return baseStyle;
    }
  };

  const getIconColor = () => {
    switch (variant) {
      case 'icon':
        return theme.isDark ? theme.colors.gray[100] : '#ffffff';
      case 'button':
      case 'card':
        return theme.isDark ? theme.colors.gray[300] : theme.colors.gray[700];
      default:
        return theme.colors.gray[600];
    }
  };

  const getLabelStyle = (): TextStyle => ({
    ...theme.typography.label,
    color: theme.isDark ? theme.colors.gray[300] : theme.colors.gray[700],
    marginLeft: theme.spacing.xs,
    fontSize: isTablet ? theme.typography.body1.fontSize : theme.typography.label.fontSize,
  });

  return (
    <Pressable
      onPress={handleToggle}
      style={({ pressed }) => [getContainerStyle(), pressed && { opacity: 0.7 }, style]}
      {...getAccessibilityProps(
        `Switch to ${getThemeLabel()}`,
        `Currently using ${isDark ? 'dark' : 'light'} mode. Tap to switch to ${getThemeLabel().toLowerCase()}`,
        'button'
      )}
    >
      <Ionicons name={getThemeIcon()} size={getIconSize()} color={getIconColor()} />
      {showLabel && <Text style={getLabelStyle()}>{getThemeLabel()}</Text>}
    </Pressable>
  );
};
