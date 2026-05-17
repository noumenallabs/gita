import React from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import { colors, radius, spacing } from '../../src/theme/colors';
import { fonts, fontSize } from '../../src/theme/typography';
import { cardStyle } from '../../src/theme/cardStyles';
import { SacredBackground } from '../../src/components/SacredBackground';
import { useChapters } from '../../src/hooks/useGitaData';

export default function ChaptersScreen() {
  const router = useRouter();
  const { data: chapters, isLoading } = useChapters();

  const totalChapters = 18;
  const loadedCount = chapters?.length || 0;
  const progressPercent = Math.round((loadedCount / totalChapters) * 100);

  return (
    <View style={styles.screen}>
      <SacredBackground />
      <SafeAreaView style={styles.safe} edges={['top']}>
        <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <Animated.View entering={FadeInDown.duration(400)}>
            <View style={styles.headerRow}>
              <Text style={styles.screenTitle}>Chapters</Text>
              <View style={styles.headerBadge}>
                <Text style={styles.headerBadgeText}>{loadedCount} / {totalChapters}</Text>
              </View>
            </View>
          </Animated.View>

          {isLoading ? (
            <View style={styles.loadingWrap}>
              <Text style={styles.loadingText}>Loading chapters...</Text>
            </View>
          ) : (
            <View style={styles.chapterList}>
              {chapters?.map((ch, i) => (
                <Animated.View key={ch.number} entering={FadeInDown.delay(150 + i * 40).duration(300)}>
                  <Pressable style={styles.chapterItem} onPress={() => router.push(`/verse/${ch.number}-1`)}>
                    <View style={styles.chapterLeft}>
                      <View style={styles.chapterNum}>
                        <Text style={styles.chapterNumText}>{ch.number}</Text>
                      </View>
                      <View style={styles.chapterInfo}>
                        <Text style={styles.chapterName}>{ch.translation}</Text>
                        <Text style={styles.chapterSanskrit}>{ch.name}</Text>
                      </View>
                    </View>
                    <View style={styles.chapterRight}>
                      <Text style={styles.verseCount}>{ch.verses} verses</Text>
                      <MaterialCommunityIcons name="chevron-right" size={16} color={colors.textMuted} />
                    </View>
                  </Pressable>
                </Animated.View>
              ))}
            </View>
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
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: spacing.lg, marginBottom: 20 },
  screenTitle: { fontFamily: fonts.bodySemiBold, fontSize: fontSize.heading, color: colors.text },
  headerBadge: { backgroundColor: colors.accentSoft, borderRadius: radius.full, paddingHorizontal: 12, paddingVertical: 4 },
  headerBadgeText: { fontFamily: fonts.bodySemiBold, fontSize: fontSize.small, color: colors.accent },
  progressCard: { padding: spacing.xl },
  loadingWrap: { padding: spacing.xxxl, alignItems: 'center' },
  loadingText: { fontFamily: fonts.body, fontSize: fontSize.body, color: colors.textMuted },
  chapterList: { paddingHorizontal: spacing.lg, gap: 8 },
  chapterItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border, borderRadius: radius.xl, paddingHorizontal: spacing.lg, paddingVertical: 14 },
  chapterLeft: { flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1 },
  chapterNum: { width: 32, height: 32, borderRadius: radius.lg, backgroundColor: colors.accentSoft, alignItems: 'center', justifyContent: 'center' },
  chapterNumText: { fontFamily: fonts.bodySemiBold, fontSize: fontSize.small, color: colors.accent },
  chapterInfo: { flex: 1 },
  chapterName: { fontFamily: fonts.bodySemiBold, fontSize: fontSize.body, color: colors.text },
  chapterSanskrit: { fontFamily: fonts.body, fontSize: fontSize.small, color: colors.textMuted, marginTop: 1 },
  chapterRight: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  verseCount: { fontFamily: fonts.body, fontSize: fontSize.small, color: colors.textMuted },
});
