import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Ionicons from '@expo/vector-icons/build/Ionicons';
import * as Haptics from 'expo-haptics';
import { MicroInteractions, createAnimatedValue } from '../../src/utils/animations';
import { useFavorites } from '../../src/hooks/useFavorites';
import { ErrorBoundary } from '../../src/components/ErrorBoundary';

function FavoritesScreenContent() {
  const { favorites, favoritesCount, toggleFavorite, isLoading } = useFavorites();
  const [showTranslationModal, setShowTranslationModal] = useState(false);

  // Animation values
  const [favoriteScales] = useState(() => new Map());

  const favoriteIds = Array.from(favorites);

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
            </View>
          </View>

          {/* Content */}
          <View style={styles.favoritesContainer}>
            {favoriteIds.length > 0 ? (
              <View style={styles.favoritesList}>
                {favoriteIds.map((id) => {
                  const parts = id.split('.');
                  const chapter = parts[0] ?? '';
                  const verse = parts[1] ?? '';

                  return (
                    <View key={id} style={styles.shlokaCard}>
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
                              {chapter}.{verse}
                            </Text>
                          </View>
                          <Text style={styles.shlokaChapterText}>
                            Chapter {chapter}, Verse {verse}
                          </Text>
                        </View>
                        <Animated.View
                          style={{
                            transform: [
                              { scale: favoriteScales.get(id) || createAnimatedValue(1) },
                            ],
                          }}
                        >
                          <Pressable
                            style={styles.favoriteButton}
                            onPressIn={() => {
                              const scale = favoriteScales.get(id);
                              if (scale) MicroInteractions.favoriteToggle(scale, false).start();
                            }}
                            onPress={async () => {
                              await toggleFavorite(id);
                              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                            }}
                          >
                            <Ionicons name="heart" size={20} color="#ffffff" />
                          </Pressable>
                        </Animated.View>
                      </LinearGradient>

                      {/* Info */}
                      <View style={styles.sanskritSection}>
                        <View style={styles.sanskritBox}>
                          <Text style={styles.sanskritText}>
                            Tap to view this verse in Chapter {chapter}
                          </Text>
                        </View>
                      </View>
                    </View>
                  );
                })}
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

    </View>
  );
}

export default function FavoritesScreen() {
  return <ErrorBoundary><FavoritesScreenContent /></ErrorBoundary>;
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
});
