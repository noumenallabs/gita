import React from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import { colors, radius, spacing } from '../../src/theme/colors';
import { fonts, fontSize, lineHeight as lh } from '../../src/theme/typography';
import { cardStyle } from '../../src/theme/cardStyles';
import { SacredBackground } from '../../src/components/SacredBackground';
import { ChapterPill } from '../../src/components/ChapterPill';
import { useChapters, useDailyVerse } from '../../src/hooks/useGitaData';

export default function HomeScreen() {
  const router = useRouter();
  const { data: chapters, isLoading: chaptersLoading } = useChapters();
  const { data: dailyVerse, isLoading: verseLoading } = useDailyVerse();
  const verse = dailyVerse?.verse;

  return (
    <View style={styles.screen}>
      <SacredBackground />
      <SafeAreaView style={styles.safe} edges={['top']}>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Daily Verse Card */}
          <Animated.View entering={FadeInDown.delay(100).duration(400)}>
            <View style={cardStyle({ glow: true })}>
              <View style={styles.cardContent}>
                <View style={styles.cardHeader}>
                  <Text style={styles.cardLabel}>SHLOKA OF THE DAY</Text>
                  {verse && (
                    <View style={styles.badge}>
                      <Text style={styles.badgeText}>{verse.chapter}.{verse.verse}</Text>
                    </View>
                  )}
                </View>

                {verseLoading ? (
                  <View style={styles.loadingWrap}>
                    <Text style={styles.loadingText}>Loading...</Text>
                  </View>
                ) : verse ? (
                  <>
                    <Text style={styles.sanskrit} numberOfLines={4}>{verse.sanskrit}</Text>
                    <Text style={styles.transliteration} numberOfLines={3}>{verse.transliteration}</Text>
                    <Text style={styles.english} numberOfLines={4}>{verse.translations?.english || ''}</Text>
                    <Pressable style={styles.readMore} onPress={() => router.push(`/verse/${verse.chapter}-${verse.verse}`)}>
                      <Text style={styles.readMoreText}>Read full verse</Text>
                      <MaterialCommunityIcons name="arrow-right" size={14} color={colors.accent} />
                    </Pressable>
                  </>
                ) : (
                  <View style={styles.loadingWrap}>
                    <MaterialCommunityIcons name="cloud-off-outline" size={32} color={colors.textMuted} />
                    <Text style={styles.loadingText}>Could not load verse</Text>
                  </View>
                )}
              </View>
            </View>
          </Animated.View>

          {/* Chapters */}
          <Animated.View entering={FadeInDown.delay(200).duration(400)}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Chapters</Text>
            </View>
          </Animated.View>

          {chaptersLoading ? (
            <View style={styles.loadingWrap}>
              <Text style={styles.loadingText}>Loading chapters...</Text>
            </View>
          ) : (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chapterScroll}>
              {chapters?.slice(0, 8).map((ch, i) => (
                <Animated.View key={ch.number} entering={FadeInDown.delay(250 + i * 50).duration(400)}>
                  <ChapterPill
                    number={ch.number}
                    name={ch.translation}
                    verseCount={ch.verses}
                    onPress={() => router.push(`/verse/${ch.number}-1`)}
                  />
                </Animated.View>
              ))}
            </ScrollView>
          )}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  safe: { flex: 1 },
  scroll: { flex: 1 },
  scrollContent: { paddingTop: spacing.lg, paddingBottom: 100 },
  cardContent: { padding: spacing.xl },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  cardLabel: { fontFamily: fonts.bodySemiBold, fontSize: fontSize.caption, color: colors.textMuted, letterSpacing: 3 },
  badge: { backgroundColor: colors.accentSoft, borderWidth: 1, borderColor: 'rgba(212,162,76,0.12)', borderRadius: radius.full, paddingHorizontal: 10, paddingVertical: 3 },
  badgeText: { fontFamily: fonts.bodySemiBold, fontSize: fontSize.small, color: colors.accent },
  sanskrit: { fontFamily: 'serif', fontSize: fontSize.sanskrit, color: colors.text, lineHeight: fontSize.sanskrit * lh.sanskritTight, marginBottom: 10 },
  transliteration: { fontFamily: fonts.body, fontSize: fontSize.body, color: colors.textSoft, lineHeight: fontSize.body * lh.relaxed, fontStyle: 'italic', marginBottom: 10 },
  english: { fontFamily: fonts.body, fontSize: fontSize.bodyLarge, color: colors.text, lineHeight: fontSize.bodyLarge * lh.relaxed, marginBottom: 14 },
  readMore: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  readMoreText: { fontFamily: fonts.bodySemiBold, fontSize: fontSize.small, color: colors.accent },
  loadingWrap: { padding: spacing.xxxl, alignItems: 'center', gap: 8 },
  loadingText: { fontFamily: fonts.body, fontSize: fontSize.body, color: colors.textMuted },
  sectionHeader: { paddingHorizontal: spacing.lg, marginTop: 28, marginBottom: 14 },
  sectionTitle: { fontFamily: fonts.bodySemiBold, fontSize: fontSize.body, color: colors.text },
  chapterScroll: { paddingHorizontal: spacing.lg, gap: 12, paddingBottom: 8 },
});
