import React from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { colors, radius, spacing } from '../theme/colors';
import { fonts, fontSize, lineHeight as lh } from '../theme/typography';

interface VerseItem {
  id: string;
  chapter: number;
  verse: number;
  sanskrit: string;
  english: string;
}

interface VerseCarouselProps {
  verses: VerseItem[];
  onSelect?: (verse: VerseItem) => void;
}

export function VerseCarousel({ verses, onSelect }: VerseCarouselProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      snapToInterval={292}
      decelerationRate="fast"
      contentContainerStyle={styles.scrollContent}
      style={styles.scroll}
    >
      {verses.map((v, i) => (
        <CarouselCard key={v.id} verse={v} index={i} onSelect={onSelect} />
      ))}
    </ScrollView>
  );
}

function CarouselCard({
  verse,
  index,
  onSelect,
}: {
  verse: VerseItem;
  index: number;
  onSelect?: (v: VerseItem) => void;
}) {
  const scale = useSharedValue(1);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View style={[styles.card, animStyle]}>
      <Pressable
        style={styles.cardInner}
        onPressIn={() => {
          scale.value = withSpring(0.96, { damping: 15 });
        }}
        onPressOut={() => {
          scale.value = withSpring(1, { damping: 15 });
        }}
        onPress={() => onSelect?.(verse)}
      >
        <View style={styles.cardBadge}>
          <Text style={styles.badgeText}>
            {verse.chapter}.{verse.verse}
          </Text>
        </View>
        <Text style={styles.sanskrit} numberOfLines={3}>
          {verse.sanskrit}
        </Text>
        <Text style={styles.english} numberOfLines={3}>
          {verse.english}
        </Text>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  scroll: {
    marginHorizontal: -spacing.lg,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    gap: 12,
  },
  card: {
    width: 280,
  },
  cardInner: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.xl,
    padding: spacing.xl,
    minHeight: 180,
    shadowColor: colors.accent,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 30,
    elevation: 0,
  },
  cardBadge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.accentSoft,
    borderWidth: 1,
    borderColor: 'rgba(92,184,150,0.12)',
    borderRadius: radius.full,
    paddingHorizontal: 10,
    paddingVertical: 3,
    marginBottom: 12,
  },
  badgeText: {
    fontFamily: fonts.bodySemiBold,
    fontSize: fontSize.small,
    color: colors.accent,
  },
  sanskrit: {
    fontFamily: 'serif',
    fontSize: fontSize.sanskrit,
    color: colors.text,
    lineHeight: fontSize.sanskrit * lh.sanskritTight,
    marginBottom: 10,
  },
  english: {
    fontFamily: fonts.body,
    fontSize: fontSize.body,
    color: colors.textSoft,
    lineHeight: fontSize.body * lh.relaxed,
  },
});
