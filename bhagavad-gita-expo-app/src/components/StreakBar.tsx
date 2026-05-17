import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withSequence, withTiming } from 'react-native-reanimated';
import { useEffect } from 'react';
import { colors, radius, spacing } from '../theme/colors';
import { fonts, fontSize } from '../theme/typography';

interface StreakBarProps {
  streak: number;
  message?: string;
}

export function StreakBar({ streak, message = 'Keep it up!' }: StreakBarProps) {
  const breathe = useSharedValue(1);

  useEffect(() => {
    breathe.value = withRepeat(
      withSequence(withTiming(1.1, { duration: 1250 }), withTiming(1, { duration: 1250 })),
      -1,
      false
    );
  }, []);

  const breatheStyle = useAnimatedStyle(() => ({
    transform: [{ scale: breathe.value }],
  }));

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Animated.View style={[styles.iconWrap, breatheStyle]}>
          <MaterialCommunityIcons name="fire" size={18} color={colors.accent} />
        </Animated.View>
        <View style={styles.textWrap}>
          <Text style={styles.count}>{streak}-day streak</Text>
          <Text style={styles.message}>{message}</Text>
        </View>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{streak}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.lg,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.xl,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  iconWrap: {
    width: 32,
    height: 32,
    borderRadius: radius.lg,
    backgroundColor: 'rgba(92,184,150,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  textWrap: {
    flex: 1,
  },
  count: {
    fontFamily: fonts.bodySemiBold,
    fontSize: fontSize.body,
    color: colors.text,
    letterSpacing: 0.2,
  },
  message: {
    fontFamily: fonts.body,
    fontSize: fontSize.small,
    color: colors.textMuted,
    marginTop: 1,
  },
  badge: {
    backgroundColor: 'rgba(92,184,150,0.12)',
    borderRadius: radius.full,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  badgeText: {
    fontFamily: fonts.bodySemiBold,
    fontSize: fontSize.small,
    color: colors.accent,
  },
});
