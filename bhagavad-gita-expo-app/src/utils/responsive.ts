import { Dimensions, PixelRatio } from 'react-native';

// Get device dimensions
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Base dimensions for scaling (iPhone 12 Pro as reference)
const BASE_WIDTH = 390;
const BASE_HEIGHT = 844;

// Device type detection
export const DeviceType = {
  PHONE: 'phone',
  TABLET: 'tablet',
  LARGE_TABLET: 'large_tablet',
} as const;

export type DeviceTypeValue = (typeof DeviceType)[keyof typeof DeviceType];

// Breakpoints
export const Breakpoints = {
  SMALL_PHONE: 320,
  PHONE: 480,
  SMALL_TABLET: 768,
  TABLET: 1024,
  LARGE_TABLET: 1200,
} as const;

// Get current device type
export const getDeviceType = (): DeviceTypeValue => {
  if (SCREEN_WIDTH >= Breakpoints.LARGE_TABLET) {
    return DeviceType.LARGE_TABLET;
  }
  if (SCREEN_WIDTH >= Breakpoints.SMALL_TABLET) {
    return DeviceType.TABLET;
  }
  return DeviceType.PHONE;
};

// Check if device is tablet
export const isTablet = (): boolean => {
  const deviceType = getDeviceType();
  return deviceType === DeviceType.TABLET || deviceType === DeviceType.LARGE_TABLET;
};

// Check if device is large screen
export const isLargeScreen = (): boolean => {
  return SCREEN_WIDTH >= Breakpoints.TABLET;
};

// Responsive scaling functions
export const scale = (size: number): number => {
  const scaleRatio = SCREEN_WIDTH / BASE_WIDTH;
  return Math.round(PixelRatio.roundToNearestPixel(size * scaleRatio));
};

export const verticalScale = (size: number): number => {
  const scaleRatio = SCREEN_HEIGHT / BASE_HEIGHT;
  return Math.round(PixelRatio.roundToNearestPixel(size * scaleRatio));
};

export const moderateScale = (size: number, factor: number = 0.5): number => {
  return Math.round(size + (scale(size) - size) * factor);
};

// Typography scaling
export const getFontSize = (baseSize: number): number => {
  const deviceType = getDeviceType();

  switch (deviceType) {
    case DeviceType.LARGE_TABLET:
      return moderateScale(baseSize, 0.8);
    case DeviceType.TABLET:
      return moderateScale(baseSize, 0.6);
    default:
      return moderateScale(baseSize, 0.3);
  }
};

// Spacing scaling
export const getSpacing = (baseSpacing: number): number => {
  const deviceType = getDeviceType();

  switch (deviceType) {
    case DeviceType.LARGE_TABLET:
      return scale(baseSpacing * 1.5);
    case DeviceType.TABLET:
      return scale(baseSpacing * 1.2);
    default:
      return scale(baseSpacing);
  }
};

// Layout dimensions
export const getLayoutDimensions = () => {
  const deviceType = getDeviceType();

  return {
    containerPadding: getSpacing(16),
    cardMargin: getSpacing(8),
    maxContentWidth:
      deviceType === DeviceType.PHONE ? SCREEN_WIDTH : Math.min(SCREEN_WIDTH * 0.8, 800),
    columnCount: deviceType === DeviceType.PHONE ? 1 : deviceType === DeviceType.TABLET ? 2 : 3,
    headerHeight: process.env.EXPO_OS === 'ios' ? (isTablet() ? 88 : 56) : isTablet() ? 72 : 56,
    tabBarHeight: process.env.EXPO_OS === 'ios' ? (isTablet() ? 88 : 68) : isTablet() ? 72 : 68,
  };
};

// Orientation handling
export const getOrientation = () => {
  return SCREEN_WIDTH > SCREEN_HEIGHT ? 'landscape' : 'portrait';
};

export const isLandscape = (): boolean => {
  return getOrientation() === 'landscape';
};

// Safe area calculations
export const getSafeAreaPadding = () => {
  const deviceType = getDeviceType();

  return {
    top: process.env.EXPO_OS === 'ios' ? (deviceType === DeviceType.PHONE ? 44 : 24) : 24,
    bottom: process.env.EXPO_OS === 'ios' ? (deviceType === DeviceType.PHONE ? 34 : 0) : 0,
    horizontal: getSpacing(16),
  };
};

// Grid layout helpers
export const getGridItemWidth = (itemsPerRow: number, containerWidth?: number): number => {
  const width = containerWidth || SCREEN_WIDTH;
  const padding = getLayoutDimensions().containerPadding;
  const spacing = getSpacing(8);

  return (width - padding * 2 - spacing * (itemsPerRow - 1)) / itemsPerRow;
};

// Responsive component props
export const getResponsiveProps = () => {
  const deviceType = getDeviceType();
  const dimensions = getLayoutDimensions();

  return {
    deviceType,
    isTablet: isTablet(),
    isLargeScreen: isLargeScreen(),
    isLandscape: isLandscape(),
    dimensions,
    screenWidth: SCREEN_WIDTH,
    screenHeight: SCREEN_HEIGHT,
  };
};

// Text scaling for accessibility
export const getAccessibleFontSize = (baseSize: number, userFontScale: number = 1): number => {
  const responsiveSize = getFontSize(baseSize);
  return Math.min(responsiveSize * userFontScale, responsiveSize * 1.5); // Cap at 1.5x for readability
};

// Touch target sizing
export const getTouchTargetSize = (baseSize: number): number => {
  const minTouchTarget = 44; // iOS HIG minimum
  const scaledSize = scale(baseSize);
  return Math.max(scaledSize, minTouchTarget);
};
