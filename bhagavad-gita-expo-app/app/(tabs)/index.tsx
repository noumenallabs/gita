import React, { useState, useMemo } from 'react';
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
import { completeSlokas as shlokas, getDailyShloka, stats } from '../../src/data';
import { MicroInteractions, createAnimatedValue } from '../../src/utils/animations';
import { GitaLogo } from '../../src/components/GitaLogo';
import { useFavorites } from '../../src/hooks/useFavorites';

export default function HomeScreen() {
  // Get deterministic shloka based on current date from complete dataset
  const dailyShloka = useMemo(() => {
    return getDailyShloka();
  }, []);

  const { isFavorite: isShlokaFavorite, toggleFavorite } = useFavorites();

  const [showSanskrit, setShowSanskrit] = useState(false);
  const [selectedTranslation, setSelectedTranslation] = useState<
    'english' | 'hindi' | 'wordByWord' | 'commentary'
  >('english');
  const [selectedCommentary, setSelectedCommentary] = useState<number>(0);
  const [showCommentaryModal, setShowCommentaryModal] = useState(false);
  const [showTranslationModal, setShowTranslationModal] = useState(false);

  // Check if daily shloka is favorite
  const isFavorite = isShlokaFavorite(dailyShloka.id);

  // Animation values
  const [dailyCardScale] = useState(createAnimatedValue(1));
  const [chapterRefScale] = useState(createAnimatedValue(1));
  const [favoriteScale] = useState(createAnimatedValue(1));
  const [sanskritToggleScale] = useState(createAnimatedValue(1));
  const [translationScale] = useState(createAnimatedValue(1));
  const [refreshScale] = useState(createAnimatedValue(1));
  const [commentaryScale] = useState(createAnimatedValue(1));

  const formatDate = () => {
    const today = new Date();
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
    };
    return today.toLocaleDateString('en-US', options);
  };

  const getTranslationText = () => {
    switch (selectedTranslation) {
      case 'english':
        return dailyShloka.translations.english;
      case 'hindi':
        return dailyShloka.translations.hindi;
      case 'wordByWord':
        return dailyShloka.translations.wordByWord;
      case 'commentary':
        return dailyShloka.translations.commentary;
    }
  };

  const translationLabels = {
    english: 'English Translation',
    hindi: 'Hindi Translation',
    wordByWord: 'Word by Word',
    commentary: 'Primary Commentary',
  };

  const availableCommentaries = dailyShloka.commentaries.filter(c => 
    Object.keys(c.translations).length > 0
  );

  const getCurrentCommentary = () => {
    if (availableCommentaries.length === 0) return null;
    const commentary = availableCommentaries[selectedCommentary];
    
    // Prefer English commentary, then English translation, then Hindi
    return commentary.translations.englishCommentary || 
           commentary.translations.english || 
           commentary.translations.hindiCommentary ||
           commentary.translations.hindi ||
           Object.values(commentary.translations)[0];
  };

  return (
    <View style={styles.container}>
      {/* Header with decorative elements */}
      <LinearGradient
        colors={['#ea580c', '#f97316', '#f59e0b']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        {/* Decorative background elements */}
        <View style={styles.decorativeBackground}>
          <View style={[styles.decorativeCircle, styles.decorativeCircle1]} />
          <View style={[styles.decorativeCircle, styles.decorativeCircle2]} />
        </View>

        <SafeAreaView style={styles.headerSafeArea}>
          <View style={styles.headerContent}>
            <View style={styles.logoContainer}>
              <View style={styles.logoIcon}>
                <GitaLogo size={40} color="#ffffff" />
              </View>
              <View style={styles.titleContainer}>
                <Text style={styles.headerTitle}>Bhagavad Gita</Text>
                <Text style={styles.headerSubtitle}>
                  Complete Collection • {stats.totalSlokas} Verses
                </Text>
              </View>
              {/* Debug button - remove in production */}
              <Pressable
                style={styles.debugButton}
                onPress={async () => {
                  console.log('=== HOME DEBUG ===');
                  console.log('Daily shloka ID:', dailyShloka.id);
                  console.log('Is favorite:', isFavorite);
                  await DebugUtils.checkAsyncStorage();
                  await DebugUtils.getStorageStats();
                }}
              >
                <Text style={styles.debugButtonText}>Debug</Text>
              </Pressable>
            </View>
          </View>
        </SafeAreaView>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Daily Header Card */}
        <Animated.View style={[styles.dailyHeaderCard, { transform: [{ scale: dailyCardScale }] }]}>
          <Pressable
            onPressIn={() => MicroInteractions.buttonPress(dailyCardScale, false).start()}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            }}
          >
            <LinearGradient
              colors={['#f97316', '#ea580c', '#f59e0b']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.dailyHeaderGradient}
            >
              {/* Decorative pattern */}
              <View style={styles.cardDecorativeBackground}>
                <View style={[styles.cardDecorativeCircle, styles.cardDecorativeCircle1]} />
                <View style={[styles.cardDecorativeCircle, styles.cardDecorativeCircle2]} />
              </View>

              <View style={styles.dailyHeaderContent}>
                <View style={styles.dailyHeaderTop}>
                  <View style={styles.dailyHeaderLeft}>
                    <View style={styles.sparkleIcon}>
                      <Ionicons name="sparkles" size={20} color="#ffffff" />
                    </View>
                    <View style={styles.dailyHeaderText}>
                      <Text style={styles.dailyHeaderTitle}>Shloka of the Day</Text>
                      <Text style={styles.dailyHeaderSubtitle}>From the complete collection</Text>
                    </View>
                  </View>
                  <Animated.View style={{ transform: [{ scale: refreshScale }] }}>
                    <Pressable
                      style={styles.refreshButton}
                      onPressIn={() => MicroInteractions.buttonPress(refreshScale, false).start()}
                      onPress={() => {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                      }}
                    >
                      <Ionicons name="refresh" size={20} color="#ffffff" />
                    </Pressable>
                  </Animated.View>
                </View>

                <View style={styles.dateContainer}>
                  <Ionicons name="calendar-outline" size={16} color="rgba(255,255,255,0.9)" />
                  <Text style={styles.dateText}>{formatDate()}</Text>
                </View>
              </View>
            </LinearGradient>
          </Pressable>
        </Animated.View>

        {/* Shloka Card */}
        <Animated.View style={[styles.shlokaCard, { transform: [{ scale: chapterRefScale }] }]}>
          {/* Header with chapter info */}
          <LinearGradient
            colors={['#f97316', '#f59e0b']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.shlokaHeader}
          >
            <Pressable
              style={styles.shlokaHeaderContent}
              onPressIn={() => MicroInteractions.buttonPress(chapterRefScale, false).start()}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              }}
            >
              <View style={styles.chapterBadge}>
                <Text style={styles.chapterBadgeText}>
                  {dailyShloka.chapter}.{dailyShloka.verse}
                </Text>
              </View>
              <Text style={styles.chapterText}>
                Chapter {dailyShloka.chapter}, Verse {dailyShloka.verse}
              </Text>
            </Pressable>
            <Animated.View style={{ transform: [{ scale: favoriteScale }] }}>
              <Pressable
                style={styles.favoriteButton}
                onPressIn={() => MicroInteractions.favoriteToggle(favoriteScale, false).start()}
                onPress={async () => {
                  await toggleFavorite(dailyShloka.id);
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                }}
              >
                <Ionicons name={isFavorite ? 'heart' : 'heart-outline'} size={20} color="#ffffff" />
              </Pressable>
            </Animated.View>
          </LinearGradient>

          {/* Sanskrit Section */}
          <View style={styles.sanskritSection}>
            <Animated.View style={{ transform: [{ scale: sanskritToggleScale }] }}>
              <Pressable
                style={styles.sectionToggle}
                onPressIn={() => MicroInteractions.buttonPress(sanskritToggleScale, false).start()}
                onPress={() => {
                  setShowSanskrit(!showSanskrit);
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                }}
              >
                <Text style={styles.sectionToggleText}>Sanskrit & Transliteration</Text>
                <Ionicons
                  name={showSanskrit ? 'chevron-up' : 'chevron-down'}
                  size={16}
                  color="#ea580c"
                />
              </Pressable>
            </Animated.View>

            {showSanskrit && (
              <View style={styles.sanskritContent}>
                <View style={styles.sanskritBox}>
                  <Text style={styles.sanskritText}>{dailyShloka.sanskrit}</Text>
                </View>
                <View style={styles.transliterationBox}>
                  <Text style={styles.transliterationText}>{dailyShloka.transliteration}</Text>
                </View>
              </View>
            )}
          </View>

          {/* Translation Section */}
          <View style={styles.translationSection}>
            <Animated.View style={{ transform: [{ scale: translationScale }] }}>
              <Pressable
                style={styles.translationSelector}
                onPressIn={() => MicroInteractions.buttonPress(translationScale, false).start()}
                onPress={() => {
                  setShowTranslationModal(true);
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                }}
              >
                <Text style={styles.translationSelectorText}>
                  {translationLabels[selectedTranslation]}
                </Text>
                <Ionicons name="chevron-down" size={16} color="#6b7280" />
              </Pressable>
            </Animated.View>

            <View style={styles.translationContent}>
              <Text style={styles.translationText}>{getTranslationText()}</Text>
            </View>
          </View>

          {/* Commentary Section */}
          {availableCommentaries.length > 0 && (
            <View style={styles.commentarySection}>
              <Animated.View style={{ transform: [{ scale: commentaryScale }] }}>
                <Pressable
                  style={styles.commentarySelector}
                  onPressIn={() => MicroInteractions.buttonPress(commentaryScale, false).start()}
                  onPress={() => {
                    setShowCommentaryModal(true);
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  }}
                >
                  <View style={styles.commentarySelectorContent}>
                    <Text style={styles.commentarySelectorTitle}>Scholar Commentary</Text>
                    <Text style={styles.commentarySelectorSubtitle}>
                      {availableCommentaries[selectedCommentary]?.displayName}
                    </Text>
                  </View>
                  <Ionicons name="chevron-down" size={16} color="#6b7280" />
                </Pressable>
              </Animated.View>

              <View style={styles.commentaryContent}>
                <Text style={styles.commentaryText}>{getCurrentCommentary()}</Text>
              </View>
            </View>
          )}
        </Animated.View>

        {/* Info Card */}
        <View style={styles.infoCard}>
          <Text style={styles.infoText}>
            Experience all {stats.totalSlokas} verses with commentaries from{' '}
            {stats.totalCommentators} renowned scholars. A new shloka is selected each day from the
            complete collection.
          </Text>
        </View>
      </ScrollView>

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
                        {type === 'hindi' && 'Hindi translation'}
                        {type === 'wordByWord' && 'Detailed word meanings'}
                        {type === 'commentary' && 'Primary explanation'}
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

      {/* Commentary Selection Modal */}
      <Modal
        visible={showCommentaryModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowCommentaryModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Scholar</Text>
              <Text style={styles.modalSubtitle}>Choose a commentary from renowned scholars</Text>
            </View>

            <ScrollView style={styles.commentaryOptions} showsVerticalScrollIndicator={false}>
              {availableCommentaries.map((commentary, index) => (
                <TouchableOpacity
                  key={commentary.authorKey}
                  style={[
                    styles.commentaryOption,
                    selectedCommentary === index && styles.commentaryOptionSelected,
                  ]}
                  onPress={() => {
                    setSelectedCommentary(index);
                    setShowCommentaryModal(false);
                  }}
                >
                  <View style={styles.commentaryOptionContent}>
                    <Text
                      style={[
                        styles.commentaryOptionTitle,
                        selectedCommentary === index && styles.commentaryOptionTitleSelected,
                      ]}
                    >
                      {commentary.displayName}
                    </Text>
                    <Text
                      style={[
                        styles.commentaryOptionDescription,
                        selectedCommentary === index && styles.commentaryOptionDescriptionSelected,
                      ]}
                    >
                      {Object.keys(commentary.translations).length} translation(s) available
                    </Text>
                  </View>
                  {selectedCommentary === index && (
                    <Ionicons name="checkmark" size={20} color="#ffffff" />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>

            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setShowCommentaryModal(false)}
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
    backgroundColor: '#fef7f0', // Light orange background like web app
  },
  header: {
    paddingHorizontal: 24,
    paddingBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    position: 'relative',
    overflow: 'hidden',
  },
  decorativeBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.1,
  },
  decorativeCircle: {
    position: 'absolute',
    backgroundColor: '#ffffff',
    borderRadius: 1000,
  },
  decorativeCircle1: {
    width: 256,
    height: 256,
    top: -128,
    right: -128,
  },
  decorativeCircle2: {
    width: 192,
    height: 192,
    bottom: -96,
    left: -96,
  },
  headerSafeArea: {
    position: 'relative',
    zIndex: 10,
  },
  headerContent: {
    paddingTop: 12,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  logoIcon: {
    width: 56,
    height: 56,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    position: 'relative',
  },
  bookIconBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 18,
    height: 18,
    backgroundColor: '#ea580c',
    borderRadius: 9,
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

  titleContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 4,
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  dailyHeaderCard: {
    marginTop: 16,
    marginBottom: 16,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  dailyHeaderGradient: {
    padding: 24,
    position: 'relative',
    overflow: 'hidden',
  },
  cardDecorativeBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.1,
  },
  cardDecorativeCircle: {
    position: 'absolute',
    backgroundColor: '#ffffff',
    borderRadius: 1000,
  },
  cardDecorativeCircle1: {
    width: 128,
    height: 128,
    top: -64,
    right: -64,
  },
  cardDecorativeCircle2: {
    width: 96,
    height: 96,
    bottom: -48,
    left: -48,
  },
  dailyHeaderContent: {
    position: 'relative',
    zIndex: 10,
  },
  dailyHeaderTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  dailyHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  sparkleIcon: {
    width: 40,
    height: 40,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  dailyHeaderText: {
    flex: 1,
  },
  dailyHeaderTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 2,
  },
  dailyHeaderSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
  },
  refreshButton: {
    padding: 8,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dateText: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
  },
  shlokaCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    marginBottom: 16,
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
  chapterBadge: {
    width: 32,
    height: 32,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  chapterBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#ffffff',
  },
  chapterText: {
    fontSize: 14,
    color: '#ffffff',
    flex: 1,
  },
  favoriteButton: {
    padding: 8,
  },
  sanskritSection: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  sectionToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  sectionToggleText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#ea580c',
  },
  sanskritContent: {
    paddingTop: 12,
    paddingBottom: 16,
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
  infoCard: {
    backgroundColor: '#dbeafe',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#bfdbfe',
  },
  infoText: {
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
    color: '#1e40af',
  },
  // Modal styles
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
  // Commentary Section Styles
  commentarySection: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  commentarySelector: {
    backgroundColor: '#fef3c7',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#fbbf24',
  },
  commentarySelectorContent: {
    flex: 1,
  },
  commentarySelectorTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#92400e',
    marginBottom: 2,
  },
  commentarySelectorSubtitle: {
    fontSize: 12,
    color: '#a16207',
  },
  commentaryContent: {
    backgroundColor: '#fffbeb',
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: '#fde68a',
  },
  commentaryText: {
    fontSize: 15,
    lineHeight: 22,
    color: '#451a03',
    fontStyle: 'italic',
  },
  // Commentary Modal Styles
  commentaryOptions: {
    maxHeight: 300,
    marginBottom: 24,
  },
  commentaryOption: {
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 2,
    borderColor: 'transparent',
    marginBottom: 8,
  },
  commentaryOptionSelected: {
    backgroundColor: '#fbbf24',
    borderColor: '#f59e0b',
  },
  commentaryOptionContent: {
    flex: 1,
  },
  commentaryOptionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  commentaryOptionTitleSelected: {
    color: '#ffffff',
  },
  commentaryOptionDescription: {
    fontSize: 12,
    color: '#6b7280',
  },
  commentaryOptionDescriptionSelected: {
    color: 'rgba(255, 255, 255, 0.9)',
  },
  // Debug styles - remove in production
  debugButton: {
    backgroundColor: '#ef4444',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginLeft: 8,
  },
  debugButtonText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '600',
  },
});
