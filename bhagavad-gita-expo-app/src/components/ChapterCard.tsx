import React, { useState, memo, useMemo, useCallback } from 'react';
import { View, Text, Pressable, StyleSheet, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Ionicons from '@expo/vector-icons/build/Ionicons';
import * as Haptics from 'expo-haptics';
import { Card } from './ui/Card';
import { Badge } from './ui/Badge';
import { useResponsive } from '../context/ResponsiveContext';
import { useDeviceInfo } from '../context/ResponsiveContext';
import { Chapter } from '../types';
import { MicroInteractions, createAnimatedValue } from '../utils/animations';

export interface ChapterCardProps {
  chapter: Chapter;
  onPress: (chapterId: number) => void;
  hasShlokas: boolean;
}

// Create styles function outside component for better performance
const createStyles = (theme: any, isTablet: boolean) =>
  StyleSheet.create({
    card: {
      marginVertical: theme.spacing.xs,
      marginHorizontal: theme.spacing.md,
      overflow: 'hidden',
      ...theme.shadows.md,
    },
    pressable: {
      flex: 1,
    },
    pressed: {
      opacity: 0.95,
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
    chapterNumber: {
      width: isTablet ? 48 : 40,
      height: isTablet ? 48 : 40,
      borderRadius: isTablet ? 24 : 20,
      backgroundColor: 'rgba(255, 255, 255, 0.25)',
      alignItems: 'center',
      justifyContent: 'center',
      ...theme.shadows.sm,
    },
    chapterNumberText: {
      color: '#ffffff',
      fontSize: isTablet ? 20 : 18,
      fontWeight: '700',
    },
    headerRight: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    badge: {
      marginRight: theme.spacing.xs,
    },
    chevron: {
      opacity: 0.9,
    },
    content: {
      padding: theme.spacing.md,
      backgroundColor: theme.isDark ? theme.colors.gray[800] : '#ffffff',
    },
    chapterName: {
      ...theme.typography.h5,
      color: theme.isDark ? theme.colors.gray[100] : theme.colors.gray[800],
      marginBottom: 4,
      fontSize: isTablet ? theme.typography.h4.fontSize : theme.typography.h5.fontSize,
    },
    chapterTranslation: {
      ...theme.typography.body2,
      color: theme.isDark ? theme.colors.gray[400] : theme.colors.gray[600],
      fontStyle: 'italic',
      marginBottom: theme.spacing.sm,
    },
    divider: {
      height: 1,
      backgroundColor: theme.isDark ? theme.colors.gray[700] : theme.colors.gray[200],
      marginVertical: theme.spacing.sm,
    },
    summary: {
      ...theme.typography.body2,
      color: theme.isDark ? theme.colors.gray[300] : theme.colors.gray[700],
      marginBottom: theme.spacing.sm,
    },
    footer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    verseCount: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    verseCountText: {
      ...theme.typography.caption,
      color: theme.isDark ? theme.colors.gray[500] : theme.colors.gray[500],
      marginLeft: 4,
      fontWeight: '500',
    },
  });

export const ChapterCard: React.FC<ChapterCardProps> = memo(
  ({ chapter, onPress, hasShlokas }) => {
    const { state } = useResponsive();
    const { theme } = state;
    const { isTablet } = useDeviceInfo();
    const [scaleAnim] = useState(createAnimatedValue(1));

    // Memoize styles to prevent recreation on every render
    const styles = useMemo(() => createStyles(theme, isTablet), [theme, isTablet]);

    const handlePress = useCallback(async () => {
      // Add micro-interaction animation
      MicroInteractions.buttonPress(scaleAnim, true).start();
      onPress(chapter.number);
    }, [scaleAnim, onPress, chapter.number]);

    const getGradientColors = useMemo(() => {
      // Vary gradient colors slightly for visual interest
      const variations = [theme.gradients.primary, theme.gradients.amber, theme.gradients.sunset];
      return variations[chapter.number % variations.length];
    }, [theme.gradients, chapter.number]);

    return (
      <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
        <Card variant="elevated" style={styles.card} padding={0}>
          <Pressable
            onPress={handlePress}
            style={({ pressed }) => [styles.pressable, pressed && styles.pressed]}
          >
            <LinearGradient
              colors={getGradientColors}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.header}
            >
              <View style={styles.headerContent}>
                <View style={styles.chapterNumber}>
                  <Text style={styles.chapterNumberText}>{chapter.number}</Text>
                </View>
                <View style={styles.headerRight}>
                  {hasShlokas && (
                    <Badge variant="secondary" style={styles.badge}>
                      Sample Verses
                    </Badge>
                  )}
                  <Ionicons
                    name="chevron-forward"
                    size={isTablet ? 24 : 20}
                    color="#ffffff"
                    style={styles.chevron}
                  />
                </View>
              </View>
            </LinearGradient>

            <View style={styles.content}>
              <Text style={styles.chapterName} numberOfLines={2}>
                {chapter.name}
              </Text>
              <Text style={styles.chapterTranslation} numberOfLines={2}>
                {chapter.translation}
              </Text>

              <View style={styles.divider} />

              <Text style={styles.summary} numberOfLines={3}>
                {chapter.summary}
              </Text>

              <View style={styles.footer}>
                <View style={styles.verseCount}>
                  <Ionicons
                    name="book-outline"
                    size={isTablet ? 18 : 16}
                    color={theme.isDark ? theme.colors.gray[500] : theme.colors.gray[500]}
                  />
                  <Text style={styles.verseCountText}>{chapter.verses} verses</Text>
                </View>
              </View>
            </View>
          </Pressable>
        </Card>
      </Animated.View>
    );
  },
  (prevProps, nextProps) => {
    // Custom comparison function for memo optimization
    return (
      prevProps.chapter.number === nextProps.chapter.number &&
      prevProps.hasShlokas === nextProps.hasShlokas &&
      prevProps.onPress === nextProps.onPress
    );
  }
);

ChapterCard.displayName = 'ChapterCard';
