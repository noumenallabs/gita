import React, { useState, useEffect, useMemo } from 'react';
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
import Ionicons from '@expo/vector-icons/build/Ionicons';
import * as Haptics from 'expo-haptics';
import { useSearchVerses } from '../../src/hooks/useGitaData';
import { SkeletonVerseCard } from '../../src/components/Skeleton';
import { MicroInteractions, createAnimatedValue } from '../../src/utils/animations';
import { GitaLogo } from '../../src/components/GitaLogo';
import { useFavorites } from '../../src/hooks/useFavorites';

export default function SearchScreen() {
  const { isFavorite, toggleFavorite } = useFavorites();
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [selectedTranslation, setSelectedTranslation] = useState<
    'english' | 'wordByWord' | 'commentary'
  >('english');
  const [showTranslationModal, setShowTranslationModal] = useState(false);

  const popularSearches = ['karma', 'dharma', 'yoga', 'soul', 'action', 'duty'];

  const [searchButtonScales] = useState(
    () => new Map(popularSearches.map(term => [term, createAnimatedValue(1)]))
  );
  const [favoriteScales] = useState(() => new Map());
  const [clearButtonScale] = useState(createAnimatedValue(1));

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const { data, isLoading, error, refetch } = useSearchVerses(debouncedQuery);
  const searchResults = data?.results ?? [];
  const resultCount = data?.count ?? 0;

  const translationLabels = {
    english: 'English Translation',
    wordByWord: 'Word by Word',
    commentary: 'Commentary',
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerTop}>
              <View style={styles.iconContainer}>
                <Ionicons name="search" size={32} color="#ea580c" />
              </View>
              <View style={styles.headerText}>
                <Text style={styles.headerTitle}>Search Shlokas</Text>
                <Text style={styles.headerSubtitle}>Search across 719 verses</Text>
              </View>
            </View>

            {/* Search Input */}
            <View style={styles.searchContainer}>
              <Ionicons name="search" size={20} color="#6b7280" style={styles.searchIcon} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search by keyword or verse number..."
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholderTextColor="#9ca3af"
              />
              {searchQuery && (
                <Animated.View style={{ transform: [{ scale: clearButtonScale }] }}>
                  <Pressable
                    style={styles.clearButton}
                    onPressIn={() => MicroInteractions.buttonPress(clearButtonScale, false).start()}
                    onPress={() => {
                      setSearchQuery('');
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    }}
                  >
                    <Ionicons name="close" size={20} color="#6b7280" />
                  </Pressable>
                </Animated.View>
              )}
            </View>

            {/* Popular Searches */}
            {!searchQuery && (
              <View style={styles.popularSearches}>
                <Text style={styles.popularSearchesTitle}>Popular searches:</Text>
                <View style={styles.popularSearchesGrid}>
                  {popularSearches.map(term => (
                    <Animated.View
                      key={term}
                      style={{
                        transform: [
                          { scale: searchButtonScales.get(term) || createAnimatedValue(1) },
                        ],
                      }}
                    >
                      <Pressable
                        style={styles.popularSearchButton}
                        onPressIn={() => {
                          const scale = searchButtonScales.get(term);
                          if (scale) MicroInteractions.buttonPress(scale, false).start();
                        }}
                        onPress={() => {
                          setSearchQuery(term);
                          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                        }}
                      >
                        <Ionicons name="sparkles" size={12} color="#ea580c" />
                        <Text style={styles.popularSearchText}>{term}</Text>
                      </Pressable>
                    </Animated.View>
                  ))}
                </View>
              </View>
            )}
          </View>

          {/* Results */}
          <View style={styles.resultsContainer}>
            {!searchQuery.trim() ? (
              // Empty State
              <View style={styles.emptyState}>
                <View style={styles.emptyStateIcon}>
                  <LinearGradient
                    colors={['#f97316', '#f59e0b']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.emptyStateIconGradient}
                  >
                    <GitaLogo size={32} color="#ffffff" />
                  </LinearGradient>
                </View>
                <Text style={styles.emptyStateTitle}>Search the Gita</Text>
                <Text style={styles.emptyStateText}>
                  Enter keywords, verse numbers (e.g., "2.47"), or phrases to discover timeless
                  wisdom
                </Text>
              </View>
            ) : isLoading ? (
              // Loading State
              <View style={styles.resultsList}>
                <SkeletonVerseCard />
                <SkeletonVerseCard />
                <SkeletonVerseCard />
              </View>
            ) : error ? (
              // Error State
              <View style={styles.noResults}>
                <View style={styles.noResultsIcon}>
                  <Ionicons name="alert-circle" size={32} color="#ef4444" />
                </View>
                <Text style={styles.noResultsTitle}>Something went wrong</Text>
                <Text style={styles.noResultsText}>
                  Failed to search verses. Please try again.
                </Text>
                <Pressable
                  style={styles.clearSearchButton}
                  onPress={() => refetch()}
                >
                  <Text style={styles.clearSearchButtonText}>Retry</Text>
                </Pressable>
              </View>
            ) : searchResults.length > 0 ? (
              // Results
              <>
                <View style={styles.resultsHeader}>
                  <View style={styles.resultsDot} />
                  <Text style={styles.resultsCount}>
                    Found {resultCount} shloka{resultCount !== 1 ? 's' : ''}
                  </Text>
                </View>

                <View style={styles.resultsList}>
                  {searchResults.map(result => {
                    const verseId = `${result.chapter_number}.${result.verse_number}`;
                    return (
                      <View key={verseId} style={styles.shlokaCard}>
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
                                {result.chapter_number}.{result.verse_number}
                              </Text>
                            </View>
                            <Text style={styles.shlokaChapterText}>
                              Chapter {result.chapter_number}, Verse {result.verse_number}
                            </Text>
                          </View>
                          <Animated.View
                            style={{
                              transform: [
                                { scale: favoriteScales.get(verseId) || createAnimatedValue(1) },
                              ],
                            }}
                          >
                            <Pressable
                              style={styles.favoriteButton}
                              onPressIn={() => {
                                const scale = favoriteScales.get(verseId);
                                if (scale) MicroInteractions.favoriteToggle(scale, false).start();
                              }}
                              onPress={async () => {
                                await toggleFavorite(verseId);
                                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                              }}
                            >
                              <Ionicons
                                name={isFavorite(verseId) ? 'heart' : 'heart-outline'}
                                size={20}
                                color="#ffffff"
                              />
                            </Pressable>
                          </Animated.View>
                        </LinearGradient>

                        {/* Sanskrit Section */}
                        <View style={styles.sanskritSection}>
                          <View style={styles.sanskritBox}>
                            <Text style={styles.sanskritText}>{result.slok}</Text>
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
                            <Text style={styles.translationText}>
                              {result.text ?? 'Select a verse to view full translation'}
                            </Text>
                          </View>
                        </View>
                      </View>
                    );
                  })}
                </View>
              </>
            ) : (
              // No Results
              <View style={styles.noResults}>
                <View style={styles.noResultsIcon}>
                  <Ionicons name="search" size={32} color="#9ca3af" />
                </View>
                <Text style={styles.noResultsTitle}>No results found</Text>
                <Text style={styles.noResultsText}>No shlokas found matching "{searchQuery}"</Text>
                <Pressable style={styles.clearSearchButton} onPress={() => setSearchQuery('')}>
                  <Text style={styles.clearSearchButtonText}>Clear search</Text>
                </Pressable>
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
    gap: 8,
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
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
    marginBottom: 16,
  },
  searchIcon: {
    position: 'absolute',
    left: 16,
    top: 18,
    zIndex: 1,
  },
  searchInput: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    paddingLeft: 48,
    paddingRight: 48,
    paddingVertical: 16,
    fontSize: 16,
    borderWidth: 2,
    borderColor: '#e5e7eb',
    color: '#1f2937',
  },
  clearButton: {
    position: 'absolute',
    right: 8,
    top: 8,
    padding: 8,
  },
  popularSearches: {
    marginTop: 8,
  },
  popularSearchesTitle: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 12,
  },
  popularSearchesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  popularSearchButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    gap: 4,
  },
  popularSearchText: {
    fontSize: 14,
    color: '#374151',
  },
  resultsContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 48,
  },
  emptyStateIcon: {
    marginBottom: 16,
  },
  emptyStateIconGradient: {
    width: 64,
    height: 64,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 20,
  },
  resultsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  resultsDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#f97316',
  },
  resultsCount: {
    fontSize: 14,
    color: '#6b7280',
  },
  resultsList: {
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
  noResults: {
    alignItems: 'center',
    paddingVertical: 48,
  },
  noResultsIcon: {
    width: 64,
    height: 64,
    backgroundColor: '#f3f4f6',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  noResultsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 8,
  },
  noResultsText: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 16,
  },
  clearSearchButton: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  clearSearchButtonText: {
    fontSize: 14,
    color: '#374151',
  },
  // Modal styles (same as other screens)
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
