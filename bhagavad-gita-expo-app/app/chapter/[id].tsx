import React from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Ionicons from '@expo/vector-icons/build/Ionicons';
import { AppHeader } from '../../src/components/AppHeader';
import { ShlokaCard } from '../../src/components/ShlokaCard';
import { useChapter } from '../../src/hooks/useGitaData';
import { useRecordProgress } from '../../src/hooks/useStreak';
import { ErrorBoundary } from '../../src/components/ErrorBoundary';
import { SkeletonVerseCard } from '../../src/components/Skeleton';
import { Colors, Gradients } from '../../src/constants/theme';
import { useAppContext } from '../../src/context/AppContext';
import type { Shloka } from '../../src/types';

function ChapterDetailContent() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { state, actions } = useAppContext();

  const chapterNumber = parseInt(id as string, 10);
  const { data: chapter, isLoading, isError, refetch } = useChapter(chapterNumber);
  const recordProgress = useRecordProgress();

  const handleBackPress = () => {
    router.back();
  };

  const handleToggleFavorite = (shlokaId: string) => {
    actions.toggleFavorite(shlokaId);
  };

  const handleVerseView = (shloka: Shloka) => {
    recordProgress.mutate({
      chapterNumber: shloka.chapter,
      verseNumber: shloka.verse,
      status: 'read',
    });
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <AppHeader
          title={`Chapter ${chapterNumber}`}
          showBackButton={true}
          onBackPress={handleBackPress}
          showLogo={true}
          showBookBadge={true}
        />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary?.[500] ?? '#f97316'} />
          <Text style={styles.loadingText}>Loading chapter...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (isError || !chapter) {
    return (
      <SafeAreaView style={styles.container}>
        <AppHeader
          title="Chapter Not Found"
          showBackButton={true}
          onBackPress={handleBackPress}
          showLogo={true}
          showBookBadge={true}
        />
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={48} color="#ef4444" />
          <Text style={styles.errorTitle}>Failed to Load Chapter</Text>
          <Text style={styles.errorSubtitle}>Please check your connection and try again.</Text>
          <Pressable style={styles.retryButton} onPress={() => refetch()}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  const chapterShlokas = chapter.verses ?? [];

  const renderShloka = ({ item }: { item: Shloka }) => (
    <View style={styles.shlokaContainer}>
      <ShlokaCard
        shloka={item}
        isFavorite={state.favorites.has(item.id)}
        onToggleFavorite={handleToggleFavorite}
        showChapterInfo={false}
      />
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyStateContainer}>
      <Text style={styles.emptyStateTitle}>No Verses Available</Text>
      <Text style={styles.emptyStateSubtitle}>
        This chapter contains {chapter.verseCount} verses. They will appear here once loaded.
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <AppHeader
        title={`Chapter ${chapter.number}`}
        showBackButton={true}
        onBackPress={handleBackPress}
        showLogo={true}
        showBookBadge={true}
      />

      <FlatList
        data={chapterShlokas}
        renderItem={renderShloka}
        keyExtractor={item => item.id}
        ListHeaderComponent={
          <View>
            {/* Chapter Header Card */}
            <LinearGradient
              colors={Gradients.sunset}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.chapterHeader}
            >
              <Text style={styles.chapterNumber}>Chapter {chapter.number}</Text>
              <Text style={styles.chapterName}>{chapter.name}</Text>
              <Text style={styles.chapterTranslation}>{chapter.translation}</Text>
              <View style={styles.chapterStats}>
                <Text style={styles.versesCount}>{chapter.verseCount} verses</Text>
                <Text style={styles.availableShlokas}>
                  {chapterShlokas.length} verse{chapterShlokas.length !== 1 ? 's' : ''} loaded
                </Text>
              </View>
            </LinearGradient>

            {/* Chapter Summary */}
            {chapter.summary ? (
              <View style={styles.summaryContainer}>
                <Text style={styles.summaryTitle}>Summary</Text>
                <Text style={styles.summaryText}>{chapter.summary}</Text>
              </View>
            ) : null}

            {/* Shlokas Section Header */}
            {chapterShlokas.length > 0 && (
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Chapter Verses</Text>
              </View>
            )}
          </View>
        }
        ListEmptyComponent={renderEmptyState}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

export default function ChapterDetailScreen() {
  return (
    <ErrorBoundary>
      <ChapterDetailContent />
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.gray[50],
  },
  scrollContent: {
    flexGrow: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  loadingText: {
    fontSize: 16,
    color: '#6b7280',
  },
  chapterHeader: {
    margin: 16,
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
  },
  chapterNumber: {
    fontSize: 16,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 4,
  },
  chapterName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 8,
  },
  chapterTranslation: {
    fontSize: 16,
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    marginBottom: 16,
  },
  chapterStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.3)',
  },
  versesCount: {
    fontSize: 14,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.9)',
  },
  availableShlokas: {
    fontSize: 14,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.9)',
  },
  summaryContainer: {
    margin: 16,
    marginTop: 0,
    padding: 20,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.gray[900],
    marginBottom: 12,
  },
  summaryText: {
    fontSize: 16,
    lineHeight: 24,
    color: Colors.gray[700],
  },
  sectionHeader: {
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.gray[900],
  },
  shlokaContainer: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
    marginTop: 40,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.gray[900],
    textAlign: 'center',
    marginBottom: 12,
  },
  emptyStateSubtitle: {
    fontSize: 16,
    color: Colors.gray[600],
    textAlign: 'center',
    lineHeight: 24,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
    gap: 12,
  },
  errorTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#ef4444',
    textAlign: 'center',
  },
  errorSubtitle: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
  },
  retryButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#f97316',
    marginTop: 8,
  },
  retryButtonText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 16,
  },
});
