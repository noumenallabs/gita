import React from 'react';
import { View, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useResponsive } from '../context/ResponsiveContext';

export interface AppBackgroundProps {
  children: React.ReactNode;
  variant?: 'solid' | 'gradient' | 'subtle';
  style?: ViewStyle;
}

export const AppBackground: React.FC<AppBackgroundProps> = ({
  children,
  variant = 'solid',
  style,
}) => {
  const { state } = useResponsive();
  const { theme, isDarkMode: isDark } = state;

  const getBackgroundColor = () => {
    return isDark ? '#0a0a0a' : theme.colors.gray[50];
  };

  const getGradientColors = (): readonly [string, string, ...string[]] => {
    if (isDark) {
      return ['#0a0a0a', '#1a1a1a', '#0a0a0a'];
    }
    return [theme.colors.gray[50], '#fefefe', theme.colors.gray[50]];
  };

  const getSubtleGradientColors = (): readonly [string, string, ...string[]] => {
    if (isDark) {
      return ['#0a0a0a', '#0f0f0f'];
    }
    return [theme.colors.gray[50], '#fefefe'];
  };

  const containerStyle: ViewStyle = {
    flex: 1,
    ...style,
  };

  switch (variant) {
    case 'gradient':
      return (
        <LinearGradient
          colors={getGradientColors()}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={containerStyle}
        >
          {children}
        </LinearGradient>
      );

    case 'subtle':
      return (
        <LinearGradient
          colors={getSubtleGradientColors()}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={containerStyle}
        >
          {children}
        </LinearGradient>
      );

    case 'solid':
    default:
      return (
        <View style={[containerStyle, { backgroundColor: getBackgroundColor() }]}>{children}</View>
      );
  }
};
