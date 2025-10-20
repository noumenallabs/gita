import React, { useState } from 'react';
import { Pressable, Text, ViewStyle, TextStyle, Animated } from 'react-native';
import * as Haptics from 'expo-haptics';
import { useResponsive } from '../../context/ResponsiveContext';
import { MicroInteractions, createAnimatedValue } from '../../utils/animations';

export interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  enableHaptics?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  style,
  textStyle,
  enableHaptics = true,
}) => {
  const { state } = useResponsive();
  const { theme } = state;
  const [scaleAnim] = useState(createAnimatedValue(1));

  const getButtonStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      borderRadius: theme.borderRadius.md,
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: size === 'small' ? 36 : size === 'large' ? 52 : 44,
      paddingHorizontal: size === 'small' ? 12 : size === 'large' ? 24 : 16,
    };

    switch (variant) {
      case 'primary':
        return {
          ...baseStyle,
          backgroundColor: disabled
            ? theme.isDark
              ? theme.colors.gray[700]
              : theme.colors.gray[300]
            : theme.colors.primary[500],
          ...theme.shadows.md,
        };
      case 'secondary':
        return {
          ...baseStyle,
          backgroundColor: disabled
            ? theme.isDark
              ? theme.colors.gray[800]
              : theme.colors.gray[100]
            : theme.isDark
              ? theme.colors.gray[800]
              : theme.colors.primary[50],
          borderWidth: 1,
          borderColor: disabled
            ? theme.isDark
              ? theme.colors.gray[600]
              : theme.colors.gray[300]
            : theme.colors.primary[500],
        };
      case 'ghost':
        return {
          ...baseStyle,
          backgroundColor: 'transparent',
        };
      default:
        return baseStyle;
    }
  };

  const handlePress = async () => {
    if (disabled) return;

    // Add haptic feedback and animation
    if (enableHaptics) {
      MicroInteractions.buttonPress(scaleAnim, true).start();
    } else {
      MicroInteractions.buttonPress(scaleAnim, false).start();
    }

    onPress();
  };

  const getTextStyle = (): TextStyle => {
    const baseTextStyle: TextStyle = {
      fontWeight: '600',
      fontSize: size === 'small' ? 14 : size === 'large' ? 18 : 16,
    };

    switch (variant) {
      case 'primary':
        return {
          ...baseTextStyle,
          color: disabled
            ? theme.isDark
              ? theme.colors.gray[500]
              : theme.colors.gray[500]
            : '#ffffff',
        };
      case 'secondary':
        return {
          ...baseTextStyle,
          color: disabled
            ? theme.isDark
              ? theme.colors.gray[500]
              : theme.colors.gray[500]
            : theme.colors.primary[600],
        };
      case 'ghost':
        return {
          ...baseTextStyle,
          color: disabled
            ? theme.isDark
              ? theme.colors.gray[500]
              : theme.colors.gray[500]
            : theme.colors.primary[600],
        };
      default:
        return baseTextStyle;
    }
  };

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <Pressable
        onPress={handlePress}
        disabled={disabled}
        style={({ pressed }) => [getButtonStyle(), pressed && !disabled && { opacity: 0.8 }, style]}
      >
        <Text style={[getTextStyle(), textStyle]}>{title}</Text>
      </Pressable>
    </Animated.View>
  );
};
