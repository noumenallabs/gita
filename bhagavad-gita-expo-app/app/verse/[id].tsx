import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { colors, radius, spacing } from '../../src/theme/colors';
import { fonts, fontSize, lineHeight as lh } from '../../src/theme/typography';
import { cardStyle } from '../../src/theme/cardStyles';
import { SacredBackground } from '../../src/components/SacredBackground';
import { TranslationTabs } from '../../src/components/TranslationTabs';
import { ActionButton } from '../../src/components/ActionButton';
import { useVerse } from '../../src/hooks/useGitaData';
import { useFavorites } from '../../src/hooks/useFavorites';

export default function VerseDetailScreen() {
  const params = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('meaning');
  const { isFavorite, toggleFavorite } = useFavorites();

  const [chapter, verse] = (params.id || '2-47').split('-').map(Number);
  const { data: verseData, isLoading } = useVerse(chapter, verse);

  const isFav = verseData ? isFavorite(verseData.id) : false;

  return (
    <View style={styles.screen}>
      <SacredBackground />
      <SafeAreaView style={styles.safe} edges={['top']}>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <Animated.View entering={FadeInDown.duration(400)}>
            <View style={styles.header}>
              <Pressable style={styles.backBtn} onPress={() => router.back()}>
                <MaterialCommunityIcons name="arrow-left" size={22} color={colors.text} />
              </Pressable>
              <View style={styles.headerBadge}>
                <Text style={styles.headerBadgeText}>
                  {chapter}.{verse}
                </Text>
              </View>
              <View style={styles.headerActions}>
                <ActionButton
                  icon={isFav ? 'heart' : 'heart-outline'}
                  active={isFav}
                  onPress={() => verseData && toggleFavorite(verseData.id)}
                />
                <ActionButton icon="share-variant" />
              </View>
            </View>
          </Animated.View>

          {isLoading ? (
            <View style={styles.loadingWrap}>
              <Text style={styles.loadingText}>Loading verse...</Text>
            </View>
          ) : verseData ? (
            <>
              {/* Sanskrit Block */}
              <Animated.View entering={FadeInDown.delay(100).duration(400)}>
                <View style={cardStyle()}>
                  <View style={styles.sanskritBlock}>
                    <Text style={styles.sanskrit}>{verseData.sanskrit}</Text>
                    <Text style={styles.transliteration}>{verseData.transliteration}</Text>
                  </View>
                </View>
              </Animated.View>

              {/* Translation Tabs */}
              <Animated.View entering={FadeInDown.delay(200).duration(400)}>
                <View style={styles.translationSection}>
                  <TranslationTabs
                    tabs={[
                      { key: 'meaning', label: 'Meaning' },
                      { key: 'wordByWord', label: 'Word by Word' },
                      ...(verseData.commentaries?.length
                        ? [{ key: 'commentary', label: 'Commentary' }]
                        : []),
                    ]}
                    activeKey={activeTab}
                    onChange={setActiveTab}
                  />

                  <View style={cardStyle()}>
                    <View style={styles.translationContent}>
                      {activeTab !== 'commentary' ? (
                        <Text style={styles.translationText}>
                          {activeTab === 'meaning'
                            ? verseData.translations?.english || ''
                            : verseData.translations?.wordByWord || ''}
                        </Text>
                      ) : (
                        verseData.commentaries?.map((c, i) => (
                          <View key={c.authorKey + i} style={{ marginBottom: 24 }}>
                            <Text style={{ fontFamily: fonts.bodySemiBold, color: colors.accent, marginBottom: 8, fontSize: fontSize.body }}>
                              {c.displayName}
                            </Text>
                            <Text style={styles.translationText}>
                              {c.translations.englishCommentary || c.translations.english || c.translations.hindi}
                            </Text>
                          </View>
                        )) || <Text style={styles.translationText}>No commentaries available.</Text>
                      )}
                    </View>
                  </View>
                </View>
              </Animated.View>

              {/* Action Bar */}
              <Animated.View entering={FadeInDown.delay(250).duration(400)}>
                <View style={styles.actionBar}>
                  <ActionButton icon="share-variant" />
                </View>
              </Animated.View>
            </>
          ) : (
            <View style={styles.loadingWrap}>
              <MaterialCommunityIcons name="cloud-off-outline" size={32} color={colors.textMuted} />
              <Text style={styles.loadingText}>Could not load verse</Text>
            </View>
          )}

          {/* Verse Navigation */}
          <Animated.View entering={FadeInDown.delay(300).duration(400)}>
            <View style={styles.verseNav}>
              <Pressable
                style={styles.navBtn}
                onPress={() => {
                  if (verse > 1) router.replace(`/verse/${chapter}-${verse - 1}`);
                }}
              >
                <MaterialCommunityIcons name="chevron-left" size={20} color={colors.textMuted} />
                <Text style={styles.navBtnText}>Previous</Text>
              </Pressable>
              <Pressable
                style={styles.navBtn}
                onPress={() => {
                  router.replace(`/verse/${chapter}-${verse + 1}`);
                }}
              >
                <Text style={styles.navBtnText}>Next</Text>
                <MaterialCommunityIcons name="chevron-right" size={20} color={colors.textMuted} />
              </Pressable>
            </View>
          </Animated.View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  safe: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: spacing.lg,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    marginBottom: 20,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: radius.lg,
    backgroundColor: 'rgba(255,255,255,0.04)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerBadge: {
    marginLeft: 12,
    backgroundColor: colors.accentSoft,
    borderWidth: 1,
    borderColor: 'rgba(92,184,150,0.12)',
    borderRadius: radius.full,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  headerBadgeText: {
    fontFamily: fonts.bodySemiBold,
    fontSize: fontSize.small,
    color: colors.accent,
  },
  headerActions: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 6,
  },
  loadingWrap: {
    padding: spacing.xxxl,
    alignItems: 'center',
    gap: 8,
  },
  loadingText: {
    fontFamily: fonts.body,
    fontSize: fontSize.body,
    color: colors.textMuted,
  },
  sanskritBlock: {
    padding: spacing.xxl,
    alignItems: 'center',
  },
  sanskrit: {
    fontFamily: 'serif',
    fontSize: fontSize.sanskrit,
    color: colors.text,
    lineHeight: fontSize.sanskrit * lh.sanskrit,
    textAlign: 'center',
    marginBottom: 16,
  },
  transliteration: {
    fontFamily: fonts.body,
    fontSize: fontSize.body,
    color: colors.textSoft,
    textAlign: 'center',
    lineHeight: fontSize.body * lh.relaxed,
    fontStyle: 'italic',
  },
  translationSection: {
    paddingHorizontal: spacing.lg,
    marginTop: 20,
  },
  translationContent: {
    padding: spacing.xl,
  },
  translationText: {
    fontFamily: fonts.body,
    fontSize: fontSize.verse,
    color: colors.text,
    lineHeight: fontSize.verse * lh.relaxed,
  },
  actionBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: spacing.xxl,
    marginTop: 24,
    marginBottom: 8,
  },
  verseNav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    marginTop: 16,
  },
  navBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 8,
  },
  navBtnText: {
    fontFamily: fonts.body,
    fontSize: fontSize.body,
    color: colors.textMuted,
  },
});
