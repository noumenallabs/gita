import React from 'react';
import { View, Text, Pressable, ViewStyle, TextStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { GitaLogo } from './GitaLogo';
import { ThemeToggle } from './ThemeToggle';
import { useResponsive, useDeviceInfo } from '../context/ResponsiveContext';
import { getLayoutDimensions } from '../utils/responsive';
import { getAccessibilityProps } from '../utils/accessibility';

export interface AppHeaderProps {
  title?: string;
  showBackButton?: boolean;
  onBackPress?: () => void;
  showLogo?: boolean;
  showThemeToggle?: boolean;
  showBookBadge?: boolean;
  gradientColors?: readonly [string, string, ...string[]];
  style?: ViewStyle;
  titleStyle?: TextStyle;
}

export const AppHeader: React.FC<AppHeaderProps> = ({
  title,
  showBackButton = false,
  onBackPress,
  showLogo = true,
  showThemeToggle = true,
  showBookBadge = false,
  gradientColors,
  style,
  titleStyle,
}) => {
  const { state } = useResponsive();
  const { theme, isDarkMode: isDark } = state;
  const { screenWidth, isTablet, isLandscape } = useDeviceInfo();
  const insets = useSafeAreaInsets();
  const layoutDimensions = getLayoutDimensions();

  // Use theme gradients if not provided
  const headerGradients = gradientColors || theme.gradients.primary;

  const getHeaderHeight = () => {
    // Responsive header height based on device type
    const baseHeight = isTablet ? (isLandscape ? 64 : 72) : 56;
    return baseHeight + insets.top;
  };

  const getContainerStyle = (): ViewStyle => ({
    height: getHeaderHeight(),
    paddingTop: insets.top,
    paddingHorizontal: theme.spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    maxWidth: layoutDimensions.maxContentWidth,
    alignSelf: 'center',
    width: '100%',
  });

  const getLeftSectionStyle = (): ViewStyle => ({
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  });

  const getCenterSectionStyle = (): ViewStyle => ({
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 2,
  });

  const getRightSectionStyle = (): ViewStyle => ({
    flex: 1,
    alignItems: 'flex-end',
  });

  const getBackButtonStyle = (): ViewStyle => ({
    width: theme.touchTargets.medium,
    height: theme.touchTargets.medium,
    borderRadius: theme.touchTargets.medium / 2,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.sm,
  });

  const getTitleStyle = (): TextStyle => ({
    ...theme.typography.h5,
    color: isDark ? theme.colors.gray[100] : '#ffffff',
    textAlign: 'center',
    marginLeft: showLogo ? theme.spacing.xs : 0,
    // Responsive font size for tablets
    fontSize: isTablet ? theme.typography.h4.fontSize : theme.typography.h5.fontSize,
  });

  const getLogoContainerStyle = (): ViewStyle => ({
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  });

  const getBookBadgeStyle = (): ViewStyle => ({
    position: 'absolute',
    bottom: -2,
    right: title ? -2 : -2,
    width: 18,
    height: 18,
    backgroundColor: '#ea580c',
    borderRadius: 9,
    borderWidth: 2,
    borderColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  });

  // Get responsive logo size
  const getLogoSize = () => {
    return isTablet ? 40 : 32;
  };

  // Get responsive icon size
  const getIconSize = () => {
    return isTablet ? 28 : 24;
  };

  return (
    <LinearGradient
      colors={headerGradients}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[{ width: screenWidth }, style]}
    >
      <View style={getContainerStyle()}>
        {/* Left Section - Back Button */}
        <View style={getLeftSectionStyle()}>
          {showBackButton && (
            <Pressable
              onPress={onBackPress}
              style={({ pressed }) => [getBackButtonStyle(), pressed && { opacity: 0.7 }]}
              {...getAccessibilityProps('Go back', 'Navigate to previous screen', 'button')}
            >
              <Ionicons
                name="arrow-back"
                size={getIconSize()}
                color={isDark ? theme.colors.gray[100] : '#ffffff'}
              />
            </Pressable>
          )}
        </View>

        {/* Center Section - Logo and Title */}
        <View style={getCenterSectionStyle()}>
          <View style={getLogoContainerStyle()}>
            {showLogo && <GitaLogo size={getLogoSize()} animated={true} />}
            {showLogo && showBookBadge && (
              <View style={getBookBadgeStyle()}>
                <Ionicons name="book" size={10} color="#ffffff" />
              </View>
            )}
            {title && (
              <Text
                style={[getTitleStyle(), titleStyle]}
                {...getAccessibilityProps(title, undefined, 'header')}
              >
                {title}
              </Text>
            )}
          </View>
        </View>

        {/* Right Section - Theme Toggle */}
        <View style={getRightSectionStyle()}>
          {showThemeToggle && <ThemeToggle variant="icon" size="medium" />}
        </View>
      </View>
    </LinearGradient>
  );
};
