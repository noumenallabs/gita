import React from 'react';
import { View, Text, ViewStyle, TextStyle } from 'react-native';
import { Colors } from '../../constants/theme';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'error';
  size?: 'small' | 'medium' | 'large';
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'medium',
  style,
  textStyle,
}) => {
  const getBadgeStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      borderRadius: size === 'small' ? 10 : size === 'large' ? 16 : 12,
      paddingHorizontal: size === 'small' ? 6 : size === 'large' ? 12 : 8,
      paddingVertical: size === 'small' ? 2 : size === 'large' ? 6 : 4,
      alignSelf: 'flex-start',
      alignItems: 'center',
      justifyContent: 'center',
    };

    switch (variant) {
      case 'primary':
        return {
          ...baseStyle,
          backgroundColor: Colors.primary[500],
        };
      case 'secondary':
        return {
          ...baseStyle,
          backgroundColor: Colors.primary[50],
          borderWidth: 1,
          borderColor: Colors.primary[200],
        };
      case 'success':
        return {
          ...baseStyle,
          backgroundColor: '#10b981',
        };
      case 'warning':
        return {
          ...baseStyle,
          backgroundColor: Colors.amber[500],
        };
      case 'error':
        return {
          ...baseStyle,
          backgroundColor: '#ef4444',
        };
      case 'default':
      default:
        return {
          ...baseStyle,
          backgroundColor: Colors.gray[100],
        };
    }
  };

  const getTextStyle = (): TextStyle => {
    const baseTextStyle: TextStyle = {
      fontSize: size === 'small' ? 10 : size === 'large' ? 14 : 12,
      fontWeight: '600',
    };

    switch (variant) {
      case 'primary':
        return {
          ...baseTextStyle,
          color: '#ffffff',
        };
      case 'secondary':
        return {
          ...baseTextStyle,
          color: Colors.primary[700],
        };
      case 'success':
        return {
          ...baseTextStyle,
          color: '#ffffff',
        };
      case 'warning':
        return {
          ...baseTextStyle,
          color: '#ffffff',
        };
      case 'error':
        return {
          ...baseTextStyle,
          color: '#ffffff',
        };
      case 'default':
      default:
        return {
          ...baseTextStyle,
          color: Colors.gray[700],
        };
    }
  };

  return (
    <View style={[getBadgeStyle(), style]}>
      {typeof children === 'string' ? (
        <Text style={[getTextStyle(), textStyle]}>{children}</Text>
      ) : (
        children
      )}
    </View>
  );
};
