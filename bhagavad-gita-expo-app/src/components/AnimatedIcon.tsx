import React from 'react';
import { StyleSheet } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withSequence, withTiming } from 'react-native-reanimated';
import { useEffect } from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface AnimatedIconProps {
  name: string;
  size?: number;
  color?: string;
  breathe?: boolean;
}

export function AnimatedIcon({ name, size = 24, color = '#fff', breathe = true }: AnimatedIconProps) {
  const scale = useSharedValue(1);

  useEffect(() => {
    if (!breathe) return;
    scale.value = withRepeat(
      withSequence(
        withTiming(1.1, { duration: 1250 }),
        withTiming(1, { duration: 1250 })
      ),
      -1,
      false
    );
  }, [breathe]);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View style={animStyle}>
      <MaterialCommunityIcons name={name as any} size={size} color={color} />
    </Animated.View>
  );
}

export default AnimatedIcon;
