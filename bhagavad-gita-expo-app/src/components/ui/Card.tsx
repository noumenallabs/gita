import React from 'react';
import { View, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useResponsive } from '../../context/ResponsiveContext';

export interface CardProps {
  children: React.ReactNode;
  variant?: 'default' | 'elevated' | 'gradient';
  gradientColors?: readonly [string, string, ...string[]];
  style?: ViewStyle;
  padding?: number;
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  gradientColors,
  style,
  padding = 16,
}) => {
  const { state } = useResponsive();
  const { theme } = state;

  const getCardStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      borderRadius: theme.borderRadius.lg,
      padding,
    };

    switch (variant) {
      case 'elevated':
        return {
          ...baseStyle,
          backgroundColor: theme.isDark ? theme.colors.gray[800] : '#ffffff',
          ...theme.shadows.lg,
        };
      case 'gradient':
        return {
          ...baseStyle,
          overflow: 'hidden',
        };
      case 'default':
      default:
        return {
          ...baseStyle,
          backgroundColor: theme.isDark ? theme.colors.gray[800] : '#ffffff',
          borderWidth: 1,
          borderColor: theme.isDark ? theme.colors.gray[700] : theme.colors.gray[200],
        };
    }
  };

  if (variant === 'gradient') {
    const colors = gradientColors || theme.gradients.primary;
    return (
      <LinearGradient
        colors={colors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[getCardStyle(), style]}
      >
        {children}
      </LinearGradient>
    );
  }

  return <View style={[getCardStyle(), style]}>{children}</View>;
};
