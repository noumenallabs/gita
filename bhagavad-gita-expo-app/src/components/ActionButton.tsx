import React from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { colors, radius } from '../theme/colors';

interface ActionButtonProps {
  icon: string;
  onPress?: () => void;
  active?: boolean;
  activeColor?: string;
  size?: number;
}

export function ActionButton({
  icon,
  onPress,
  active = false,
  activeColor = colors.red,
  size = 22,
}: ActionButtonProps) {
  const scale = useSharedValue(1);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View style={animStyle}>
      <Pressable
        style={styles.btn}
        onPressIn={() => {
          scale.value = withSpring(0.85, { damping: 15 });
        }}
        onPressOut={() => {
          scale.value = withSpring(1, { damping: 15 });
        }}
        onPress={onPress}
      >
        <MaterialCommunityIcons
          name={icon as any}
          size={size}
          color={active ? activeColor : colors.textMuted}
        />
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  btn: {
    width: 40,
    height: 40,
    borderRadius: radius.lg,
    backgroundColor: 'rgba(255,255,255,0.04)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
