import React, { useEffect, ReactNode } from 'react';
import { Animated, ViewStyle } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { PageTransitions, createAnimatedValue } from '../utils/animations';

export interface AnimatedPageProps {
  children: ReactNode;
  style?: ViewStyle;
  animationType?: 'fade' | 'slide' | 'scale' | 'none';
  duration?: number;
  delay?: number;
}

export const AnimatedPage: React.FC<AnimatedPageProps> = ({
  children,
  style,
  animationType = 'fade',
  duration = 300,
  delay = 0,
}) => {
  const fadeAnim = createAnimatedValue(animationType === 'none' ? 1 : 0);
  const slideAnim = createAnimatedValue(animationType === 'slide' ? 50 : 0);
  const scaleAnim = createAnimatedValue(animationType === 'scale' ? 0.9 : 1);

  useFocusEffect(
    React.useCallback(() => {
      // Animate in when page comes into focus
      const animations: Animated.CompositeAnimation[] = [];

      if (animationType === 'fade') {
        animations.push(
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration,
            delay,
            useNativeDriver: true,
          })
        );
      }

      if (animationType === 'slide') {
        animations.push(
          Animated.parallel([
            Animated.timing(fadeAnim, {
              toValue: 1,
              duration,
              delay,
              useNativeDriver: true,
            }),
            Animated.timing(slideAnim, {
              toValue: 0,
              duration,
              delay,
              useNativeDriver: true,
            }),
          ])
        );
      }

      if (animationType === 'scale') {
        animations.push(
          Animated.parallel([
            Animated.timing(fadeAnim, {
              toValue: 1,
              duration,
              delay,
              useNativeDriver: true,
            }),
            Animated.timing(scaleAnim, {
              toValue: 1,
              duration,
              delay,
              useNativeDriver: true,
            }),
          ])
        );
      }

      if (animations.length > 0) {
        Animated.parallel(animations).start();
      }

      return () => {
        // Cleanup animations when page loses focus
        fadeAnim.stopAnimation();
        slideAnim.stopAnimation();
        scaleAnim.stopAnimation();
      };
    }, [animationType, duration, delay, fadeAnim, slideAnim, scaleAnim])
  );

  const getAnimatedStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      flex: 1,
    };

    if (animationType === 'none') {
      return baseStyle;
    }

    if (animationType === 'fade') {
      return {
        ...baseStyle,
        opacity: fadeAnim,
      };
    }

    if (animationType === 'slide') {
      return {
        ...baseStyle,
        opacity: fadeAnim,
        transform: [{ translateY: slideAnim }],
      };
    }

    if (animationType === 'scale') {
      return {
        ...baseStyle,
        opacity: fadeAnim,
        transform: [{ scale: scaleAnim }],
      };
    }

    return baseStyle;
  };

  return <Animated.View style={[getAnimatedStyle(), style]}>{children}</Animated.View>;
};

// Specialized page components
export const FadeInPage: React.FC<Omit<AnimatedPageProps, 'animationType'>> = props => (
  <AnimatedPage {...props} animationType="fade" />
);

export const SlideInPage: React.FC<Omit<AnimatedPageProps, 'animationType'>> = props => (
  <AnimatedPage {...props} animationType="slide" />
);

export const ScaleInPage: React.FC<Omit<AnimatedPageProps, 'animationType'>> = props => (
  <AnimatedPage {...props} animationType="scale" />
);
