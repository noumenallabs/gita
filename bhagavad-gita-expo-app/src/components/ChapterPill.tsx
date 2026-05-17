import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { colors, radius, spacing } from '../theme/colors';
import { fonts, fontSize } from '../theme/typography';

interface ChapterPillProps {
  number: number;
  name: string;
  verseCount: number;
  onPress?: () => void;
}

export function ChapterPill({ number, name, verseCount, onPress }: ChapterPillProps) {
  const scale = useSharedValue(1);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View style={[styles.card, animStyle]}>
      <Pressable
        style={styles.inner}
        onPressIn={() => {
          scale.value = withSpring(0.96, { damping: 15 });
        }}
        onPressOut={() => {
          scale.value = withSpring(1, { damping: 15 });
        }}
        onPress={onPress}
      >
        <Text style={styles.chapterLabel}>CH.{number}</Text>
        <Text style={styles.name} numberOfLines={2}>
          {name}
        </Text>
        <Text style={styles.verseCount}>{verseCount} verses</Text>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 140,
  },
  inner: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.xl,
    padding: spacing.lg,
    minHeight: 120,
    justifyContent: 'space-between',
  },
  chapterLabel: {
    fontFamily: fonts.bodySemiBold,
    fontSize: fontSize.micro,
    color: colors.textMuted,
    letterSpacing: 2,
    textTransform: 'uppercase' as const,
  },
  name: {
    fontFamily: fonts.bodySemiBold,
    fontSize: fontSize.body,
    color: colors.text,
    marginTop: 6,
  },
  verseCount: {
    fontFamily: fonts.body,
    fontSize: fontSize.small,
    color: colors.textMuted,
    marginTop: 4,
  },
});
