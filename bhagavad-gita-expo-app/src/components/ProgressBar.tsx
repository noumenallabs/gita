import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, Easing } from 'react-native-reanimated';
import { colors, radius, spacing } from '../theme/colors';
import { fonts, fontSize } from '../theme/typography';

interface ProgressBarProps {
  progress: number; // 0-100
  label?: string;
  showPercent?: boolean;
  height?: number;
  delay?: number;
  color?: string;
}

export function ProgressBar({
  progress,
  label,
  showPercent = true,
  height = 4,
  delay = 0,
  color = colors.accent,
}: ProgressBarProps) {
  const width = useSharedValue(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      width.value = withTiming(progress, {
        duration: 1200,
        easing: Easing.out(Easing.cubic),
      });
    }, delay);
    return () => clearTimeout(timer);
  }, [progress, delay]);

  const fillStyle = useAnimatedStyle(() => ({
    width: `${width.value}%`,
  }));

  return (
    <View>
      {(label || showPercent) && (
        <View style={styles.labelRow}>
          {label && <Text style={styles.label}>{label}</Text>}
          {showPercent && <Text style={styles.percent}>{Math.round(progress)}%</Text>}
        </View>
      )}
      <View style={[styles.track, { height, borderRadius: height / 2 }]}>
        <Animated.View
          style={[
            styles.fill,
            fillStyle,
            { height, borderRadius: height / 2, backgroundColor: color },
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  label: {
    fontFamily: fonts.body,
    fontSize: fontSize.small,
    color: colors.textSoft,
  },
  percent: {
    fontFamily: fonts.bodySemiBold,
    fontSize: fontSize.small,
    color: colors.textMuted,
  },
  track: {
    backgroundColor: colors.border,
    overflow: 'hidden',
  },
  fill: {
    position: 'absolute',
    left: 0,
    top: 0,
  },
});
