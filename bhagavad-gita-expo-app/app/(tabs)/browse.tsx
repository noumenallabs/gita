import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  TextInput,
  Modal,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import {
  completeChapters as chapters,
  completeSlokas as shlokas,
  getSlokasByChapter,
} from '../../src/data';
import { MicroInteractions, createAnimatedValue } from '../../src/utils/animations';
import { GitaLogo } from '../../src/components/GitaLogo';
import { useFavorites } from '../../src/hooks/useFavorites';

// Gradient variations for chapters
const getChapterGradient = (chapterNum: number): readonly [string, string] => {
  const gradients: readonly [string, string][] = [
    ['#f97316', '#f59e0b'], // orange to amber
    ['#ea580c', '#d97706'], // darker orange to amber
    ['#f59e0b', '#f97316'], // amber to orange
  ];
  return gradients[(chapterNum - 1) % gradients.length];
};

export default function BrowseScreen() {
  const { isFavorite, toggleFavorite } = useFavorites();
  const [selectedChapter, setSelectedChapter] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTranslation, setSelectedTranslation] = useState<
    'english' | 'wordByWord' | 'commentary'
  >('english');
  const [showTranslationModal, setShowTranslationModal] = useState(false);

  // Animation values for chapter cards
  const [chapterCardScales] = useState(
    () => new Map(chapters.map(chapter => [chapter.number, createAnimatedValue(1)]))
  );
  const [backButtonScale] = useState(createAnimatedValue(1));
  const [favoriteScales] = useState(
    () => new Map(shlokas.map(shloka => [shloka.id, createAnimatedValue(1)]))
  );

  // Filter chapters based on search query
  const filteredChapters = useMemo(() => {
    if (!searchQuery.trim()) {
      return chapters;
    }
    return chapters.filter(
      chapter =>
        chapter.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        chapter.translation.toLowerCase().includes(searchQuery.toLowerCase()) ||
        chapter.summary.en.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const selectedChapterData = chapters.find(c => c.number === selectedChapter);
  const chapterShlokas = selectedChapter ? getSlokasByChapter(selectedChapter) : [];



  const getTranslationText = (shloka: any) => {
    switch (selectedTranslation) {
      case 'english':
        return shloka.translations.english;
      case 'wordByWord':
        return shloka.translations.wordByWord;
      case 'commentary':
        return shloka.translations.commentary;
    }
  };

  const translationLabels = {
    english: 'English Translation',
    wordByWord: 'Word by Word',
    commentary: 'Commentary',
  };

  if (!selectedChapter) {
    // Chapter List View
    return (
      <View style={styles.container}>
        <SafeAreaView style={styles.safeArea}>
          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            {/* Header Section */}
            <View style={styles.header}>
              <View style={styles.headerTop}>
                <View style={styles.headerIcon}>
                  <View style={styles.iconContainer}>
                      <Ionicons name="book" size={18} color="#ffffff" />
                  </View>
                </View>
                <View style={styles.headerText}>
                  <Text style={styles.headerTitle}>Browse Chapters</Text>
                  <Text style={styles.headerSubtitle}>Explore 18 chapters of wisdom</Text>
                </View>
              </View>

              {/* Search Bar */}
              <View style={styles.searchContainer}>
                <Ionicons name="book" size={16} color="#6b7280" style={styles.searchIcon} />
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search chapters..."
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  placeholderTextColor="#9ca3af"
                />
              </View>
            </View>

            {/* Chapter List */}
            <View style={styles.chapterList}>
              {filteredChapters.map(chapter => {
                const gradientColors = getChapterGradient(chapter.number);

                return (
                  <Animated.View
                    key={chapter.number}
                    style={{
                      transform: [
                        { scale: chapterCardScales.get(chapter.number) || createAnimatedValue(1) },
                      ],
                    }}
                  >
                    <Pressable
                      style={styles.chapterCard}
                      onPressIn={() => {
                        const scale = chapterCardScales.get(chapter.number);
                        if (scale) MicroInteractions.buttonPress(scale, false).start();
                      }}
                      onPress={() => {
                        setSelectedChapter(chapter.number);
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                      }}
                    >
                      {/* Gradient top bar */}
                      <LinearGradient
                        colors={gradientColors}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.chapterGradientBar}
                      />

                      <View style={styles.chapterCardContent}>
                        <View style={styles.chapterCardMain}>
                          {/* Chapter Number Badge */}
                          <View style={styles.chapterBadgeContainer}>
                            <LinearGradient
                              colors={gradientColors}
                              start={{ x: 0, y: 0 }}
                              end={{ x: 1, y: 1 }}
                              style={styles.chapterBadge}
                            >
                              <Text style={styles.chapterBadgeNumber}>{chapter.number}</Text>
                            </LinearGradient>
                          </View>

                          {/* Chapter Info */}
                          <View style={styles.chapterInfo}>
                            <Text style={styles.chapterName} numberOfLines={1}>
                              {chapter.name}
                            </Text>
                            <Text style={styles.chapterTranslation} numberOfLines={1}>
                              {chapter.translation}
                            </Text>
                            <Text style={styles.chapterSummary} numberOfLines={2}>
                              {chapter.summary.en}
                            </Text>

                            {/* Footer Info */}
                            <View style={styles.chapterFooter}>
                              <View style={styles.verseCount}>
                                <View style={styles.dot} />
                                <Text style={styles.verseCountText}>{chapter.verses} verses</Text>
                              </View>
                            </View>
                          </View>
                        </View>

                        {/* Arrow */}
                        <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
                      </View>
                    </Pressable>
                  </Animated.View>
                );
              })}

              {filteredChapters.length === 0 && (
                <View style={styles.noResults}>
                  <Ionicons name="book" size={48} color="#9ca3af" />
                  <Text style={styles.noResultsTitle}>No chapters found</Text>
                  <Text style={styles.noResultsText}>Try a different search term</Text>
                </View>
              )}
            </View>
          </ScrollView>
        </SafeAreaView>
      </View>
    );
  }

  // Chapter Detail View
  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Back Button and Chapter Header */}
          <View style={styles.chapterDetailHeader}>
            <Animated.View style={{ transform: [{ scale: backButtonScale }] }}>
              <Pressable
                style={styles.backButton}
                onPressIn={() => MicroInteractions.buttonPress(backButtonScale, false).start()}
                onPress={() => {
                  setSelectedChapter(null);
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                }}
              >
                <Ionicons name="chevron-back" size={16} color="#6b7280" />
                <Text style={styles.backButtonText}>Back to Chapters</Text>
              </Pressable>
            </Animated.View>

            {/* Chapter Detail Card */}
            <View style={styles.chapterDetailCard}>
              <LinearGradient
                colors={getChapterGradient(selectedChapterData?.number || 1)}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.chapterDetailGradient}
              >
                {/* Decorative background */}
                <View style={styles.chapterDetailDecoration} />

                <View style={styles.chapterDetailContent}>
                  <View style={styles.chapterDetailTop}>
                    <View style={styles.chapterDetailBadge}>
                      <Text style={styles.chapterDetailBadgeText}>
                        {selectedChapterData?.number}
                      </Text>
                    </View>
                    <View style={styles.chapterDetailInfo}>
                      <Text style={styles.chapterDetailName}>{selectedChapterData?.name}</Text>
                      <Text style={styles.chapterDetailTranslation}>
                        {selectedChapterData?.translation}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.chapterDetailSummary}>
                    <Text style={styles.chapterDetailSummaryText}>
                      {selectedChapterData?.summary.en}
                    </Text>
                  </View>

                  <View style={styles.chapterDetailFooter}>
                    <View style={styles.chapterDetailStat}>
                      <View style={styles.chapterDetailDot} />
                      <Text style={styles.chapterDetailStatText}>
                        {selectedChapterData?.verses} verses total
                      </Text>
                    </View>
                    {chapterShlokas.length > 0 && (
                      <View style={styles.chapterDetailStat}>
                        <View style={[styles.chapterDetailDot, { backgroundColor: '#10b981' }]} />
                        <Text style={styles.chapterDetailStatText}>
                          {chapterShlokas.length} verse{chapterShlokas.length !== 1 ? 's' : ''}{' '}
                          available
                        </Text>
                      </View>
                    )}
                  </View>
                </View>
              </LinearGradient>
            </View>
          </View>

          {/* Shlokas */}
          <View style={styles.shlokasContainer}>
            {chapterShlokas.length > 0 ? (
              chapterShlokas.map(shloka => (
                <View key={shloka.id} style={styles.shlokaCard}>
                  {/* Shloka Header */}
                  <LinearGradient
                    colors={['#f97316', '#f59e0b']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.shlokaHeader}
                  >
                    <View style={styles.shlokaHeaderContent}>
                      <View style={styles.shlokaChapterBadge}>
                        <Text style={styles.shlokaChapterBadgeText}>
                          {shloka.chapter}.{shloka.verse}
                        </Text>
                      </View>
                      <Text style={styles.shlokaChapterText}>
                        Chapter {shloka.chapter}, Verse {shloka.verse}
                      </Text>
                    </View>
                    <Animated.View
                      style={{
                        transform: [
                          { scale: favoriteScales.get(shloka.id) || createAnimatedValue(1) },
                        ],
                      }}
                    >
                      <Pressable
                        style={styles.favoriteButton}
                        onPressIn={() => {
                          const scale = favoriteScales.get(shloka.id);
                          if (scale) MicroInteractions.favoriteToggle(scale, false).start();
                        }}
                        onPress={async () => {
                          await toggleFavorite(shloka.id);
                          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                        }}
                      >
                        <Ionicons
                          name={isFavorite(shloka.id) ? 'heart' : 'heart-outline'}
                          size={20}
                          color="#ffffff"
                        />
                      </Pressable>
                    </Animated.View>
                  </LinearGradient>

                  {/* Sanskrit Section */}
                  <View style={styles.sanskritSection}>
                    <View style={styles.sanskritBox}>
                      <Text style={styles.sanskritText}>{shloka.sanskrit}</Text>
                    </View>
                    <View style={styles.transliterationBox}>
                      <Text style={styles.transliterationText}>{shloka.transliteration}</Text>
                    </View>
                  </View>

                  {/* Translation Section */}
                  <View style={styles.translationSection}>
                    <Pressable
                      style={styles.translationSelector}
                      onPress={() => setShowTranslationModal(true)}
                    >
                      <Text style={styles.translationSelectorText}>
                        {translationLabels[selectedTranslation]}
                      </Text>
                      <Ionicons name="chevron-down" size={16} color="#6b7280" />
                    </Pressable>

                    <View style={styles.translationContent}>
                      <Text style={styles.translationText}>{getTranslationText(shloka)}</Text>
                    </View>
                  </View>
                </View>
              ))
            ) : (
              <View style={styles.noShlokas}>
                <View style={styles.noShlokasIcon}>
                  <LinearGradient
                    colors={getChapterGradient(selectedChapterData?.number || 1)}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.noShlokasIconGradient}
                  >
                    <GitaLogo size={32} color="#ffffff" />
                  </LinearGradient>
                </View>
                <Text style={styles.noShlokasTitle}>Complete Chapter Available</Text>
                <Text style={styles.noShlokasText}>
                  All verses from this chapter are now available
                </Text>
                <Text style={styles.noShlokasSubtext}>
                  This chapter contains {selectedChapterData?.verses} verses in total
                </Text>
              </View>
            )}
          </View>
        </ScrollView>
      </SafeAreaView>

      {/* Translation Selection Modal */}
      <Modal
        visible={showTranslationModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowTranslationModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Translation</Text>
              <Text style={styles.modalSubtitle}>Choose how you want to read this shloka</Text>
            </View>

            <View style={styles.translationOptions}>
              {(Object.keys(translationLabels) as Array<keyof typeof translationLabels>).map(
                type => (
                  <TouchableOpacity
                    key={type}
                    style={[
                      styles.translationOption,
                      selectedTranslation === type && styles.translationOptionSelected,
                    ]}
                    onPress={() => {
                      setSelectedTranslation(type);
                      setShowTranslationModal(false);
                    }}
                  >
                    <View style={styles.translationOptionContent}>
                      <Text
                        style={[
                          styles.translationOptionTitle,
                          selectedTranslation === type && styles.translationOptionTitleSelected,
                        ]}
                      >
                        {translationLabels[type]}
                      </Text>
                      <Text
                        style={[
                          styles.translationOptionDescription,
                          selectedTranslation === type &&
                          styles.translationOptionDescriptionSelected,
                        ]}
                      >
                        {type === 'english' && 'Complete verse translation'}
                        {type === 'wordByWord' && 'Detailed word meanings'}
                        {type === 'commentary' && 'In-depth explanation'}
                      </Text>
                    </View>
                    {selectedTranslation === type && (
                      <Ionicons name="checkmark" size={20} color="#ffffff" />
                    )}
                  </TouchableOpacity>
                )
              )}
            </View>

            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setShowTranslationModal(false)}
            >
              <Text style={styles.modalCloseButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fef7f0',
  },
  safeArea: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 24,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 12,
  },
  headerIcon: {
    width: 48,
    height: 48,
    backgroundColor: '#f97316',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  iconContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bookIconBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 20,
    height: 20,
    backgroundColor: '#ea580c',
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  headerText: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 2,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#6b7280',
  },
  searchContainer: {
    position: 'relative',
  },
  searchIcon: {
    position: 'absolute',
    left: 12,
    top: 14,
    zIndex: 1,
  },
  searchInput: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    paddingLeft: 40,
    paddingRight: 16,
    paddingVertical: 12,
    fontSize: 16,
    borderWidth: 2,
    borderColor: '#e5e7eb',
    color: '#1f2937',
  },
  chapterList: {
    paddingHorizontal: 16,
    gap: 12,
    paddingBottom: 20,
  },
  chapterCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  chapterGradientBar: {
    height: 8,
  },
  chapterCardContent: {
    padding: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  chapterCardMain: {
    flex: 1,
    flexDirection: 'row',
    gap: 16,
  },
  chapterBadgeContainer: {
    position: 'relative',
  },
  chapterBadge: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  chapterBadgeNumber: {
    fontSize: 20,
    fontWeight: '600',
    color: '#ffffff',
  },

  chapterInfo: {
    flex: 1,
  },
  chapterName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  chapterTranslation: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 8,
  },
  chapterSummary: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
    marginBottom: 12,
  },
  chapterFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  verseCount: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#f97316',
  },
  verseCountText: {
    fontSize: 12,
    color: '#6b7280',
  },

  noResults: {
    alignItems: 'center',
    paddingVertical: 48,
  },
  noResultsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginTop: 16,
    marginBottom: 8,
  },
  noResultsText: {
    fontSize: 14,
    color: '#6b7280',
  },
  // Chapter Detail Styles
  chapterDetailHeader: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 16,
    backgroundColor: '#fef7f0',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 12,
    paddingVertical: 8,
    paddingHorizontal: 8,
    marginLeft: -8,
  },
  backButtonText: {
    fontSize: 14,
    color: '#6b7280',
  },
  chapterDetailCard: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  chapterDetailGradient: {
    padding: 24,
    position: 'relative',
    overflow: 'hidden',
  },
  chapterDetailDecoration: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.1,
    backgroundColor: 'transparent',
  },
  chapterDetailContent: {
    position: 'relative',
    zIndex: 10,
  },
  chapterDetailTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 16,
    marginBottom: 16,
  },
  chapterDetailBadge: {
    width: 64,
    height: 64,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  chapterDetailBadgeText: {
    fontSize: 24,
    fontWeight: '600',
    color: '#ffffff',
  },
  chapterDetailInfo: {
    flex: 1,
  },
  chapterDetailName: {
    fontSize: 20,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 8,
  },
  chapterDetailTranslation: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
  },
  chapterDetailSummary: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    marginBottom: 16,
  },
  chapterDetailSummaryText: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    lineHeight: 20,
  },
  chapterDetailFooter: {
    flexDirection: 'row',
    gap: 16,
  },
  chapterDetailStat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  chapterDetailDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.8)',
  },
  chapterDetailStatText: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.9)',
  },
  shlokasContainer: {
    paddingHorizontal: 16,
    paddingTop: 8,
    gap: 16,
    paddingBottom: 20,
  },
  shlokaCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  shlokaHeader: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  shlokaHeaderContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  shlokaChapterBadge: {
    width: 32,
    height: 32,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  shlokaChapterBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#ffffff',
  },
  shlokaChapterText: {
    fontSize: 14,
    color: '#ffffff',
    flex: 1,
  },
  favoriteButton: {
    padding: 8,
  },
  sanskritSection: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 12,
  },
  sanskritBox: {
    backgroundColor: '#fff7ed',
    borderRadius: 12,
    padding: 16,
  },
  sanskritText: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
    color: '#1f2937',
  },
  transliterationBox: {
    backgroundColor: '#fffbeb',
    borderRadius: 12,
    padding: 16,
  },
  transliterationText: {
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
    fontStyle: 'italic',
    color: '#6b7280',
  },
  translationSection: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  translationSelector: {
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  translationSelectorText: {
    fontSize: 14,
    color: '#374151',
  },
  translationContent: {
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  translationText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#374151',
  },
  noShlokas: {
    alignItems: 'center',
    paddingVertical: 48,
  },
  noShlokasIcon: {
    marginBottom: 16,
  },
  noShlokasIconGradient: {
    width: 64,
    height: 64,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noShlokasTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 8,
  },
  noShlokasText: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 16,
    textAlign: 'center',
  },
  noShlokasSubtext: {
    fontSize: 12,
    color: '#9ca3af',
    textAlign: 'center',
  },
  // Modal styles (same as home screen)
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 40,
    maxHeight: '70%',
  },
  modalHeader: {
    marginBottom: 24,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 8,
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
  },
  translationOptions: {
    gap: 12,
    marginBottom: 24,
  },
  translationOption: {
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  translationOptionSelected: {
    backgroundColor: '#f97316',
    borderColor: '#ea580c',
  },
  translationOptionContent: {
    flex: 1,
  },
  translationOptionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  translationOptionTitleSelected: {
    color: '#ffffff',
  },
  translationOptionDescription: {
    fontSize: 12,
    color: '#6b7280',
  },
  translationOptionDescriptionSelected: {
    color: 'rgba(255, 255, 255, 0.9)',
  },
  modalCloseButton: {
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  modalCloseButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
});
