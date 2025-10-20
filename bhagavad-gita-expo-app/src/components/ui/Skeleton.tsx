import React, { useEffect } from 'react';
import { View, Animated, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../../constants/theme';
import { LoadingAnimations, createAnimatedValue } from '../../utils/animations';

export interface SkeletonProps {
  width?: number | string;
  height?: number;
  borderRadius?: number;
  style?: ViewStyle;
  variant?: 'default' | 'text' | 'circle' | 'card';
}

export const Skeleton: React.FC<SkeletonProps> = ({
  width = '100%',
  height = 20,
  borderRadius = 4,
  style,
  variant = 'default',
}) => {
  const shimmerAnim = createAnimatedValue(0);

  useEffect(() => {
    const animation = LoadingAnimations.shimmer(shimmerAnim);
    animation.start();

    return () => {
      animation.stop();
    };
  }, [shimmerAnim]);

  const getVariantStyles = (): ViewStyle => {
    switch (variant) {
      case 'text':
        return {
          height: 16,
          borderRadius: 2,
        };
      case 'circle':
        return {
          width: height,
          height: height,
          borderRadius: height / 2,
        };
      case 'card':
        return {
          height: 120,
          borderRadius: 12,
        };
      default:
        return {};
    }
  };

  const translateX = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-100, 100],
  });

  return (
    <View
      style={[
        {
          width: width as any,
          height,
          borderRadius,
          backgroundColor: Colors.gray[200],
          overflow: 'hidden',
        },
        getVariantStyles(),
        style,
      ]}
    >
      <Animated.View
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          transform: [{ translateX }],
        }}
      >
        <LinearGradient
          colors={['transparent', Colors.gray[100], 'transparent']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={{
            flex: 1,
            width: '200%',
          }}
        />
      </Animated.View>
    </View>
  );
};

// Skeleton components for specific use cases
export const SkeletonText: React.FC<{ lines?: number; style?: ViewStyle }> = ({
  lines = 3,
  style,
}) => (
  <View style={style}>
    {Array.from({ length: lines }).map((_, index) => (
      <Skeleton
        key={index}
        variant="text"
        width={index === lines - 1 ? '70%' : '100%'}
        style={{ marginBottom: index < lines - 1 ? 8 : 0 }}
      />
    ))}
  </View>
);

export const SkeletonCard: React.FC<{ style?: ViewStyle }> = ({ style }) => (
  <View style={[{ padding: 16 }, style]}>
    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
      <Skeleton variant="circle" height={40} style={{ marginRight: 12 }} />
      <View style={{ flex: 1 }}>
        <Skeleton variant="text" width="60%" style={{ marginBottom: 4 }} />
        <Skeleton variant="text" width="40%" height={12} />
      </View>
    </View>
    <SkeletonText lines={3} />
  </View>
);

export const SkeletonShlokaCard: React.FC<{ style?: ViewStyle }> = ({ style }) => (
  <View
    style={[
      {
        backgroundColor: '#ffffff',
        borderRadius: 12,
        marginVertical: 8,
        marginHorizontal: 16,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
      },
      style,
    ]}
  >
    {/* Header */}
    <View style={{ padding: 16, backgroundColor: Colors.gray[100] }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <View style={{ flex: 1 }}>
          <Skeleton variant="text" width="50%" style={{ marginBottom: 4 }} />
          <Skeleton variant="text" width="30%" height={12} />
        </View>
        <Skeleton variant="circle" height={24} />
      </View>
    </View>

    {/* Content */}
    <View style={{ padding: 16 }}>
      {/* Sanskrit section */}
      <View style={{ marginBottom: 16 }}>
        <Skeleton variant="text" width="40%" style={{ marginBottom: 8 }} />
        <SkeletonText lines={2} style={{ marginBottom: 12 }} />
        <Skeleton height={1} style={{ marginBottom: 12 }} />
        <Skeleton variant="text" width="30%" style={{ marginBottom: 8 }} />
        <SkeletonText lines={2} />
      </View>

      {/* Translation section */}
      <View>
        <Skeleton variant="text" width="50%" style={{ marginBottom: 8 }} />
        <SkeletonText lines={3} />
      </View>
    </View>
  </View>
);

export const SkeletonChapterCard: React.FC<{ style?: ViewStyle }> = ({ style }) => (
  <View
    style={[
      {
        backgroundColor: '#ffffff',
        borderRadius: 12,
        padding: 16,
        margin: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
      },
      style,
    ]}
  >
    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
      <Skeleton variant="circle" height={32} style={{ marginRight: 12 }} />
      <View style={{ flex: 1 }}>
        <Skeleton variant="text" width="70%" style={{ marginBottom: 4 }} />
        <Skeleton variant="text" width="50%" height={12} />
      </View>
    </View>
    <SkeletonText lines={2} />
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 12 }}>
      <Skeleton variant="text" width="30%" height={12} />
      <Skeleton variant="text" width="20%" height={12} />
    </View>
  </View>
);
