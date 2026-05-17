import React from 'react';
import { View, Text, StyleSheet, FlatList, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { SacredBackground } from '../../src/components/SacredBackground';
import { colors, spacing, radius } from '../../src/theme/colors';
import { fonts, fontSize } from '../../src/theme/typography';
import { useFavorites } from '../../src/hooks/useFavorites';

export default function FavoritesScreen() {
  const { favorites, toggleFavorite } = useFavorites();
  const router = useRouter();

  return (
    <View style={styles.screen}>
      <SacredBackground />
      <SafeAreaView style={styles.safe} edges={['top']}>
        <View style={styles.header}>
          <Text style={styles.title}>Favorites</Text>
        </View>

        {favorites.length === 0 ? (
          <View style={styles.emptyWrap}>
            <MaterialCommunityIcons name="heart-broken-outline" size={48} color={colors.textMuted} />
            <Text style={styles.emptyText}>You haven't favorited any verses yet.</Text>
          </View>
        ) : (
          <FlatList
            data={favorites}
            keyExtractor={(item) => item}
            contentContainerStyle={styles.list}
            renderItem={({ item, index }) => (
              <Animated.View entering={FadeInDown.delay(index * 50).duration(400)}>
                <Pressable
                  style={styles.card}
                  onPress={() => router.push(`/verse/${item.replace('.', '-')}`)}
                >
                  <View style={styles.cardInfo}>
                    <Text style={styles.verseId}>Verse {item}</Text>
                    <Text style={styles.readMore}>Tap to read</Text>
                  </View>
                  <Pressable onPress={() => toggleFavorite(item)} style={styles.heartBtn}>
                    <MaterialCommunityIcons name="heart" size={24} color={colors.accent} />
                  </Pressable>
                </Pressable>
              </Animated.View>
            )}
          />
        )}
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  safe: { flex: 1 },
  header: { padding: spacing.lg, paddingBottom: spacing.md },
  title: { fontFamily: fonts.heading, fontSize: fontSize.h2, color: colors.text },
  emptyWrap: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 16 },
  emptyText: { fontFamily: fonts.body, fontSize: fontSize.body, color: colors.textMuted },
  list: { padding: spacing.lg, gap: spacing.md },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: radius.lg,
    padding: spacing.xl,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  cardInfo: { flex: 1 },
  verseId: { fontFamily: fonts.bodySemiBold, fontSize: fontSize.h4, color: colors.text, marginBottom: 4 },
  readMore: { fontFamily: fonts.body, fontSize: fontSize.small, color: colors.textSoft },
  heartBtn: { padding: spacing.sm },
});
