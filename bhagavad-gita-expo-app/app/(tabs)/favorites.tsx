import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Modal,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { completeSlokas as shlokas } from '../../src/data';
import { MicroInteractions, createAnimatedValue } from '../../src/utils/animations';
import { GitaLogo } from '../../src/components/GitaLogo';
import { useFavorites } from '../../src/hooks/useFavorites';

export default function FavoritesScreen() {
  const { favorites, favoritesCount, toggleFavorite, getFavoriteShlokas, isLoading } = useFavorites();
  const [selectedTranslation, setSelectedTranslation] = useState<
    'english' | 'wordByWord' | 'commentary'
  >('english');
  const [showTranslationModal, setShowTranslationModal] = useState(false);

  // Animation values
  const [favoriteScales] = useState(
    () => new Map(shlokas.map(shloka => [shloka.id, createAnimatedValue(1)]))
  );

  const favoriteShlokas = getFavoriteShlokas(shlokas);

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

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerTop}>
              <View style={styles.headerIcon}>
                <LinearGradient
                  colors={['#ef4444', '#ec4899']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.headerIconGradient}
                >
                  <Ionicons name="heart" size={20} color="#ffffff" />
                </LinearGradient>
              </View>
              <View style={styles.headerText}>
                <Text style={styles.headerTitle}>Your Favorites</Text>
                <Text style={styles.headerSubtitle}>
                  {favoritesCount} saved shloka{favoritesCount !== 1 ? 's' : ''}
                </Text>
              </View>
              {/* Debug button - remove in production */}
              <Pressable
                style={styles.debugButton}
                onPress={async () => {
                  console.log('=== FAVORITES DEBUG ===');
                  await DebugUtils.checkAsyncStorage();
                  await DebugUtils.getStorageStats();
                  console.log('Favorites from hook:', favorites);
                  console.log('Favorites count:', favoritesCount);
                }}
              >
                <Text style={styles.debugButtonText}>Debug</Text>
              </Pressable>
            </View>
          </View>

          {/* Content */}
          <View style={styles.favoritesContainer}>
            {favoriteShlokas.length > 0 ? (
              <View style={styles.favoritesList}>
                {favoriteShlokas.map(shloka => (
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
                          <Ionicons name="heart" size={20} color="#ffffff" />
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
                ))}
              </View>
            ) : (
              // Empty State
              <View style={styles.emptyState}>
                <View style={styles.emptyStateCard}>
                  <LinearGradient
                    colors={['#fecaca', '#fbb6ce']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.emptyStateGradient}
                  >
                    <View style={styles.emptyStateIcon}>
                      <LinearGradient
                        colors={['#ef4444', '#ec4899']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.emptyStateIconGradient}
                      >
                        <Ionicons name="heart" size={32} color="#ffffff" />
                      </LinearGradient>
                    </View>
                    <Text style={styles.emptyStateTitle}>No favorites yet</Text>
                    <Text style={styles.emptyStateText}>
                      Tap the heart icon on any shloka to save it here for quick access
                    </Text>
                    <View style={styles.emptyStateHint}>
                      <Ionicons name="sparkles" size={16} color="#f97316" />
                      <Text style={styles.emptyStateHintText}>Start exploring the Gita</Text>
                    </View>
                  </LinearGradient>
                </View>
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
    gap: 12,
  },
  headerIcon: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  headerIconGradient: {
    width: 40,
    height: 40,
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
  favoritesContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  favoritesList: {
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
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 48,
  },
  emptyStateCard: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  emptyStateGradient: {
    paddingHorizontal: 48,
    paddingVertical: 48,
    alignItems: 'center',
  },
  emptyStateIcon: {
    marginBottom: 16,
    borderRadius: 16,
    overflow: 'hidden',
  },
  emptyStateIconGradient: {
    width: 64,
    height: 64,
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
    marginBottom: 16,
  },
  emptyStateHint: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 8,
  },
  emptyStateHintText: {
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
  // Debug styles - remove in production
  debugButton: {
    backgroundColor: '#ef4444',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  debugButtonText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },
});
