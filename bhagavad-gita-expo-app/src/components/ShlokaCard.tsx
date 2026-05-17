import React, { useState, memo, useCallback, useMemo } from 'react';
import { View, Text, Pressable, StyleSheet, Modal, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Ionicons from '@expo/vector-icons/build/Ionicons';
import * as Haptics from 'expo-haptics';
import { Card } from './ui/Card';
import {
  useResponsive,
  useTheme,
  useDeviceInfo,
  useAccessibility,
} from '../context/ResponsiveContext';
import { getLayoutDimensions } from '../utils/responsive';
import {
  getSanskritAccessibilityProps,
  getTranslationAccessibilityProps,
  getFavoriteAccessibilityProps,
  getExpandableAccessibilityProps,
  announceAction,
} from '../utils/accessibility';
import { Shloka, TranslationView } from '../types';

export interface ShlokaCardProps {
  shloka: Shloka;
  isFavorite?: boolean;
  onToggleFavorite?: (id: string) => void;
  showChapterInfo?: boolean;
  defaultTranslationView?: TranslationView;
}

// Helper function for accessibility props
const getAccessibilityProps = (
  label: string,
  hint?: string,
  role?: string,
  state?: { selected?: boolean }
) => ({
  accessibilityLabel: label,
  accessibilityHint: hint,
  accessibilityRole: role as any,
  accessibilityState: state,
});

// Create responsive styles function - memoized outside component
const createStyles = (theme: any, isTablet: boolean, screenWidth: number, layoutDimensions: any) =>
  StyleSheet.create({
    card: {
      marginVertical: theme.spacing.xs,
      marginHorizontal: layoutDimensions.containerPadding,
      overflow: 'hidden',
      maxWidth: layoutDimensions.maxContentWidth,
      alignSelf: 'center',
      width: isTablet ? '100%' : screenWidth - layoutDimensions.containerPadding * 2,
    },
    favoriteCard: {
      borderWidth: 2,
      borderColor: theme.colors.primary[200],
      shadowColor: theme.colors.primary[500],
      ...theme.shadows.lg,
    },
    header: {
      paddingHorizontal: theme.spacing.md,
      paddingVertical: isTablet ? theme.spacing.md : theme.spacing.sm,
    },
    headerContent: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    headerLeft: {
      flex: 1,
    },
    chapterInfo: {
      ...theme.typography.caption,
      color: '#ffffff',
      opacity: 0.9,
      marginBottom: 2,
    },
    verseNumber: {
      ...theme.typography.label,
      color: '#ffffff',
      fontSize: isTablet ? theme.typography.body1.fontSize : theme.typography.label.fontSize,
    },
    favoriteButton: {
      padding: theme.spacing.xs,
      minWidth: theme.touchTargets.medium,
      minHeight: theme.touchTargets.medium,
      alignItems: 'center',
      justifyContent: 'center',
    },
    content: {
      padding: theme.spacing.md,
    },
    section: {
      marginBottom: theme.spacing.md,
    },
    sectionHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: theme.spacing.xs,
      minHeight: theme.touchTargets.medium,
    },
    sectionTitle: {
      ...theme.typography.h6,
      color: theme.isDark ? theme.colors.gray[200] : theme.colors.gray[800],
      fontSize: isTablet ? theme.typography.h5.fontSize : theme.typography.h6.fontSize,
    },
    sectionSubtitle: {
      ...theme.typography.label,
      color: theme.isDark ? theme.colors.gray[400] : theme.colors.gray[700],
      marginBottom: theme.spacing.xs,
      marginTop: theme.spacing.sm,
    },
    sectionContent: {
      paddingTop: theme.spacing.xs,
    },
    expandableContent: {
      overflow: 'hidden',
    },
    sanskritText: {
      ...theme.typography.sanskrit,
      color: theme.isDark ? theme.colors.gray[200] : theme.colors.gray[800],
      textAlign: 'left',
      fontSize: isTablet
        ? theme.typography.sanskrit.fontSize * 1.1
        : theme.typography.sanskrit.fontSize,
      // Optimize text rendering for Sanskrit
      textAlignVertical: 'center',
      includeFontPadding: false,
    },
    transliterationText: {
      ...theme.typography.transliteration,
      color: theme.isDark ? theme.colors.gray[400] : theme.colors.gray[700],
      // Optimize text rendering
      includeFontPadding: false,
    },
    translationText: {
      ...theme.typography.body1,
      color: theme.isDark ? theme.colors.gray[200] : theme.colors.gray[800],
      marginTop: theme.spacing.xs,
      fontSize: isTablet ? theme.typography.body1.fontSize * 1.05 : theme.typography.body1.fontSize,
      // Optimize text rendering
      includeFontPadding: false,
    },
    divider: {
      height: 1,
      backgroundColor: theme.isDark ? theme.colors.gray[700] : theme.colors.gray[200],
      marginVertical: theme.spacing.sm,
    },
    // Modal and Bottom Sheet Styles
    modalOverlay: {
      flex: 1,
      justifyContent: 'flex-end',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalBackdrop: {
      flex: 1,
    },
    bottomSheet: {
      backgroundColor: theme.isDark ? theme.colors.gray[800] : theme.colors.gray[50],
      borderTopLeftRadius: theme.borderRadius.xl,
      borderTopRightRadius: theme.borderRadius.xl,
      paddingBottom: 34, // Safe area padding
      maxHeight: '50%',
      maxWidth: isTablet ? 500 : '100%',
      alignSelf: 'center',
      width: '100%',
    },
    sheetHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.gray[200],
    },
    sheetTitle: {
      ...theme.typography.h5,
      color: theme.colors.gray[800],
    },
    closeButton: {
      padding: theme.spacing.xs,
      minWidth: theme.touchTargets.medium,
      minHeight: theme.touchTargets.medium,
      alignItems: 'center',
      justifyContent: 'center',
    },
    sheetContent: {
      paddingHorizontal: theme.spacing.lg,
      paddingTop: theme.spacing.md,
    },
    translationOption: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: theme.spacing.md,
      paddingHorizontal: theme.spacing.md,
      borderRadius: theme.borderRadius.md,
      marginBottom: theme.spacing.xs,
      backgroundColor: theme.colors.gray[50],
      borderWidth: 2,
      borderColor: 'transparent',
      minHeight: theme.touchTargets.large,
    },
    translationOptionSelected: {
      backgroundColor: theme.colors.primary[50],
      borderColor: theme.colors.primary[200],
    },
    translationOptionContent: {
      flex: 1,
    },
    translationOptionTitle: {
      ...theme.typography.body1,
      color: theme.colors.gray[800],
      marginBottom: 4,
    },
    translationOptionTitleSelected: {
      color: theme.colors.primary[700],
    },
    translationOptionDescription: {
      ...theme.typography.body2,
      color: theme.colors.gray[600],
    },
    translationOptionDescriptionSelected: {
      color: theme.colors.primary[600],
    },
  });

export const ShlokaCard: React.FC<ShlokaCardProps> = memo(
  ({
    shloka,
    isFavorite = false,
    onToggleFavorite,
    showChapterInfo = true,
    defaultTranslationView = 'english',
  }) => {
    const theme = useTheme();
    const { isTablet, screenWidth } = useDeviceInfo();
    const { reduceMotion } = useAccessibility();
    const layoutDimensions = getLayoutDimensions();

    const [isExpanded, setIsExpanded] = useState(false);
    const [currentTranslationView, setCurrentTranslationView] =
      useState<TranslationView>(defaultTranslationView);
    const [showTranslationSelector, setShowTranslationSelector] = useState(false);
    const [fadeAnim] = useState(new Animated.Value(1));
    const [favoriteScale] = useState(new Animated.Value(1));
    const [expandAnim] = useState(new Animated.Value(0));
    const [chevronRotation] = useState(new Animated.Value(0));

    // Memoize styles to prevent recreation on every render
    const styles = useMemo(
      () => createStyles(theme, isTablet, screenWidth, layoutDimensions),
      [theme, isTablet, screenWidth, layoutDimensions]
    );

    const toggleExpanded = useCallback(async () => {
      const newExpandedState = !isExpanded;
      setIsExpanded(newExpandedState);

      // Add haptic feedback
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

      // Announce action for screen readers
      announceAction(newExpandedState ? 'Sanskrit section expanded' : 'Sanskrit section collapsed');

      // Animate expand/collapse (respect reduce motion preference)
      const duration = reduceMotion ? 0 : 300;

      Animated.parallel([
        Animated.timing(expandAnim, {
          toValue: newExpandedState ? 1 : 0,
          duration,
          useNativeDriver: false, // Layout animations need this to be false
        }),
        Animated.timing(chevronRotation, {
          toValue: newExpandedState ? 1 : 0,
          duration,
          useNativeDriver: true,
        }),
      ]).start();
    }, [isExpanded, expandAnim, chevronRotation, reduceMotion]);

    const handleFavoritePress = useCallback(async () => {
      if (onToggleFavorite) {
        // Haptic feedback
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

        // Announce action for screen readers
        const action = isFavorite ? 'Removed from favorites' : 'Added to favorites';
        announceAction(action);

        // Scale animation for visual feedback (respect reduce motion)
        if (!reduceMotion) {
          Animated.sequence([
            Animated.timing(favoriteScale, {
              toValue: 1.2,
              duration: 100,
              useNativeDriver: true,
            }),
            Animated.timing(favoriteScale, {
              toValue: 1,
              duration: 100,
              useNativeDriver: true,
            }),
          ]).start();
        }

        onToggleFavorite(shloka.id);
      }
    }, [onToggleFavorite, shloka.id, isFavorite, favoriteScale, reduceMotion]);

    const handleTranslationChange = useCallback(
      (newView: TranslationView) => {
        // Announce change for screen readers
        const viewNames = {
          english: 'English translation',
          wordByWord: 'Word by word meaning',
          commentary: 'Commentary',
        };
        announceAction(`Switched to ${viewNames[newView]}`);

        // Fade animation (respect reduce motion)
        const duration = reduceMotion ? 0 : 150;

        Animated.timing(fadeAnim, {
          toValue: 0,
          duration,
          useNativeDriver: true,
        }).start(() => {
          // Change translation view
          setCurrentTranslationView(newView);
          setShowTranslationSelector(false);

          // Fade in new translation
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration,
            useNativeDriver: true,
          }).start();
        });
      },
      [fadeAnim, reduceMotion]
    );

    const renderHeader = useCallback(
      () => (
        <LinearGradient
          colors={theme.gradients.primary}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.header}
        >
          <View style={styles.headerContent}>
            <View style={styles.headerLeft}>
              {showChapterInfo && (
                <Text style={styles.chapterInfo}>
                  Chapter {shloka.chapter}, Verse {shloka.verse}
                </Text>
              )}
              <Text
                style={styles.verseNumber}
                {...getAccessibilityProps(`Verse ${shloka.id}`, undefined, 'text')}
              >
                {shloka.id}
              </Text>
            </View>
            {onToggleFavorite && (
              <Pressable
                onPress={handleFavoritePress}
                style={styles.favoriteButton}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                {...getFavoriteAccessibilityProps(isFavorite, shloka.id)}
              >
                <Animated.View style={{ transform: [{ scale: favoriteScale }] }}>
                  <Ionicons
                    name={isFavorite ? 'heart' : 'heart-outline'}
                    size={isTablet ? 28 : 24}
                    color={
                      isFavorite ? '#ff6b6b' : theme.isDark ? theme.colors.gray[100] : '#ffffff'
                    }
                  />
                </Animated.View>
              </Pressable>
            )}
          </View>
        </LinearGradient>
      ),
      [
        styles,
        showChapterInfo,
        shloka,
        onToggleFavorite,
        handleFavoritePress,
        isFavorite,
        favoriteScale,
        isTablet,
        theme,
      ]
    );

    const renderSanskritSection = useCallback(() => {
      const maxHeight = expandAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [0, isTablet ? 250 : 200], // Responsive height
      });

      const chevronRotate = chevronRotation.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '180deg'],
      });

      return (
        <View style={styles.section}>
          <Pressable
            onPress={toggleExpanded}
            style={styles.sectionHeader}
            {...getExpandableAccessibilityProps(
              'Sanskrit',
              isExpanded,
              'original Sanskrit text and transliteration'
            )}
          >
            <Text style={styles.sectionTitle}>Sanskrit</Text>
            <Animated.View style={{ transform: [{ rotate: chevronRotate }] }}>
              <Ionicons
                name="chevron-down"
                size={isTablet ? 24 : 20}
                color={theme.colors.primary[600]}
              />
            </Animated.View>
          </Pressable>

          <Animated.View
            style={[
              styles.expandableContent,
              {
                maxHeight,
                opacity: expandAnim,
              },
            ]}
          >
            {isExpanded && (
              <View style={styles.sectionContent}>
                <Text
                  style={styles.sanskritText}
                  accessible={true}
                  accessibilityLabel={`Sanskrit verse: ${shloka.transliteration}`}
                >
                  {shloka.sanskrit}
                </Text>

                <View style={styles.divider} />

                <Text style={styles.sectionSubtitle}>Transliteration</Text>
                <Text
                  style={styles.transliterationText}
                  {...getAccessibilityProps(
                    `Transliteration: ${shloka.transliteration}`,
                    'Pronunciation guide for Sanskrit text',
                    'text'
                  )}
                >
                  {shloka.transliteration}
                </Text>
              </View>
            )}
          </Animated.View>
        </View>
      );
    }, [styles, toggleExpanded, isExpanded, expandAnim, chevronRotation, isTablet, theme, shloka]);

    // Memoize translation text and title to prevent recalculation
    const translationText = useMemo(() => {
      switch (currentTranslationView) {
        case 'english':
          return shloka.translations.english;
        case 'wordByWord':
          return shloka.translations.wordByWord;
        case 'commentary':
          return shloka.translations.commentary;
        default:
          return shloka.translations.english;
      }
    }, [currentTranslationView, shloka.translations]);

    const translationTitle = useMemo(() => {
      switch (currentTranslationView) {
        case 'english':
          return 'English Translation';
        case 'wordByWord':
          return 'Word-by-Word Meaning';
        case 'commentary':
          return 'Commentary';
        default:
          return 'Translation';
      }
    }, [currentTranslationView]);

    const renderTranslationSection = useCallback(() => {
      return (
        <View style={styles.section}>
          <Pressable
            onPress={() => setShowTranslationSelector(true)}
            style={styles.sectionHeader}
            {...getAccessibilityProps(
              `${translationTitle} selector`,
              'Tap to change translation view',
              'button'
            )}
          >
            <Text style={styles.sectionTitle}>{translationTitle}</Text>
            <Ionicons
              name="swap-horizontal"
              size={isTablet ? 24 : 20}
              color={theme.colors.primary[600]}
            />
          </Pressable>
          <Animated.View style={{ opacity: fadeAnim }}>
            <Text
              style={styles.translationText}
              accessible={true}
              accessibilityLabel={`Translation: ${translationText}`}
            >
              {translationText}
            </Text>
          </Animated.View>
        </View>
      );
    }, [
      styles,
      translationTitle,
      translationText,
      currentTranslationView,
      fadeAnim,
      isTablet,
      theme,
    ]);

    const renderTranslationSelector = useCallback(
      () => (
        <Modal
          visible={showTranslationSelector}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setShowTranslationSelector(false)}
        >
          <View style={styles.modalOverlay}>
            <Pressable
              style={styles.modalBackdrop}
              onPress={() => setShowTranslationSelector(false)}
            />
            <View style={styles.bottomSheet}>
              <View style={styles.sheetHeader}>
                <Text style={styles.sheetTitle}>Select Translation View</Text>
                <Pressable
                  onPress={() => setShowTranslationSelector(false)}
                  style={styles.closeButton}
                  {...getAccessibilityProps(
                    'Close translation selector',
                    'Close the translation view selector',
                    'button'
                  )}
                >
                  <Ionicons name="close" size={isTablet ? 28 : 24} color={theme.colors.gray[600]} />
                </Pressable>
              </View>

              <View style={styles.sheetContent}>
                <TranslationOption
                  title="English Translation"
                  description="Clear, readable English translation"
                  isSelected={currentTranslationView === 'english'}
                  onPress={() => handleTranslationChange('english')}
                  styles={styles}
                />
                <TranslationOption
                  title="Word-by-Word Meaning"
                  description="Detailed breakdown of each Sanskrit word"
                  isSelected={currentTranslationView === 'wordByWord'}
                  onPress={() => handleTranslationChange('wordByWord')}
                  styles={styles}
                />
                <TranslationOption
                  title="Commentary"
                  description="Detailed explanation and context"
                  isSelected={currentTranslationView === 'commentary'}
                  onPress={() => handleTranslationChange('commentary')}
                  styles={styles}
                />
              </View>
            </View>
          </View>
        </Modal>
      ),
      [
        showTranslationSelector,
        styles,
        currentTranslationView,
        handleTranslationChange,
        isTablet,
        theme,
      ]
    );

    return (
      <>
        <Card
          variant="elevated"
          style={{
            ...styles.card,
            ...(isFavorite ? styles.favoriteCard : {}),
          }}
          padding={0}
        >
          {renderHeader()}
          <View style={styles.content}>
            {renderSanskritSection()}
            {renderTranslationSection()}
          </View>
        </Card>
        {renderTranslationSelector()}
      </>
    );
  },
  (prevProps, nextProps) => {
    // Custom comparison function for memo optimization
    return (
      prevProps.shloka.id === nextProps.shloka.id &&
      prevProps.isFavorite === nextProps.isFavorite &&
      prevProps.showChapterInfo === nextProps.showChapterInfo &&
      prevProps.defaultTranslationView === nextProps.defaultTranslationView
    );
  }
);

interface TranslationOptionProps {
  title: string;
  description: string;
  isSelected: boolean;
  onPress: () => void;
  styles: any;
}

const TranslationOption: React.FC<TranslationOptionProps> = memo(
  ({ title, description, isSelected, onPress, styles }) => {
    const theme = useTheme();
    const { isTablet } = useDeviceInfo();

    return (
      <Pressable
        onPress={onPress}
        style={[styles.translationOption, isSelected && styles.translationOptionSelected]}
        {...getAccessibilityProps(
          title,
          `${description}. ${isSelected ? 'Currently selected' : 'Tap to select'}`,
          'button',
          { selected: isSelected }
        )}
      >
        <View style={styles.translationOptionContent}>
          <Text
            style={[
              styles.translationOptionTitle,
              isSelected && styles.translationOptionTitleSelected,
            ]}
          >
            {title}
          </Text>
          <Text
            style={[
              styles.translationOptionDescription,
              isSelected && styles.translationOptionDescriptionSelected,
            ]}
          >
            {description}
          </Text>
        </View>
        {isSelected && (
          <Ionicons
            name="checkmark-circle"
            size={isTablet ? 28 : 24}
            color={theme.colors.primary[500]}
          />
        )}
      </Pressable>
    );
  }
);

ShlokaCard.displayName = 'ShlokaCard';
TranslationOption.displayName = 'TranslationOption';
