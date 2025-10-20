import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { AppHeader } from '../../src/components/AppHeader';
import { ShlokaCard } from '../../src/components/ShlokaCard';
import { getChapter, getSlokasByChapter } from '../../src/data';
import { Chapter, Shloka } from '../../src/data/types';
import { Colors, Gradients } from '../../src/constants/theme';
import { useAppContext } from '../../src/context/AppContext';

export default function ChapterDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { state, actions } = useAppContext();

  // Find the chapter data
  const chapter: Chapter | undefined = useMemo(() => {
    const chapterNumber = parseInt(id as string, 10);
    return getChapter(chapterNumber);
  }, [id]);

  // Find shlokas for this chapter
  const chapterShlokas: Shloka[] = useMemo(() => {
    const chapterNumber = parseInt(id as string, 10);
    return getSlokasByChapter(chapterNumber);
  }, [id]);

  const handleBackPress = () => {
    router.back();
  };

  const handleToggleFavorite = (shlokaId: string) => {
    actions.toggleFavorite(shlokaId);
  };

  // Handle invalid chapter ID
  if (!chapter) {
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
          <Text style={styles.errorTitle}>Chapter Not Found</Text>
          <Text style={styles.errorSubtitle}>The requested chapter could not be found.</Text>
        </View>
      </SafeAreaView>
    );
  }

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
      <Text style={styles.emptyStateTitle}>Complete Chapter Available</Text>
      <Text style={styles.emptyStateSubtitle}>
        This chapter contains {chapter.verses} verses. All verses are now available in the complete
        collection.
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
                <Text style={styles.versesCount}>{chapter.verses} verses</Text>
                <Text style={styles.availableShlokas}>
                  {chapterShlokas.length} verse{chapterShlokas.length !== 1 ? 's' : ''} available
                </Text>
              </View>
            </LinearGradient>

            {/* Chapter Summary */}
            <View style={styles.summaryContainer}>
              <Text style={styles.summaryTitle}>Summary</Text>
              <Text style={styles.summaryText}>{chapter.summary.en}</Text>
            </View>

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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.gray[50],
  },
  scrollContent: {
    flexGrow: 1,
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
  },
  errorTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.primary[500],
    textAlign: 'center',
    marginBottom: 12,
  },
  errorSubtitle: {
    fontSize: 16,
    color: Colors.gray[600],
    textAlign: 'center',
  },
});
