import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors, radius, spacing } from '../src/theme/colors';
import { fonts, fontSize } from '../src/theme/typography';

export default function OnboardingScreen({ onComplete }: { onComplete?: () => void }) {
  const handleComplete = async () => {
    await AsyncStorage.setItem('onboarding_complete', 'true');
    onComplete?.();
  };

  return (
    <View style={styles.screen}>
      <SafeAreaView style={styles.safe}>
        <View style={styles.content}>
          <Animated.View entering={FadeInDown.delay(200).duration(600)} style={styles.omWrap}>
            <Text style={styles.om}>ॐ</Text>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(400).duration(400)} style={styles.textBlock}>
            <Text style={styles.title}>Bhagavad Gita</Text>
            <Text style={styles.subtitle}>Complete Collection · 701 Verses</Text>
            <Text style={styles.tagline}>
              Experience the timeless wisdom of Krishna's teachings with Sanskrit text, translations, and commentary from 22 renowned scholars.
            </Text>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(600).duration(400)}>
            <Pressable style={styles.btn} onPress={handleComplete}>
              <Text style={styles.btnText}>Begin Reading</Text>
              <MaterialCommunityIcons name="arrow-right" size={18} color="#fff" />
            </Pressable>
          </Animated.View>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  safe: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.xxxl,
    justifyContent: 'center',
    alignItems: 'center',
  },
  omWrap: {
    marginBottom: 32,
  },
  om: {
    fontSize: 64,
    color: colors.accent,
  },
  textBlock: {
    alignItems: 'center',
    marginBottom: 48,
  },
  title: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 28,
    color: colors.text,
    letterSpacing: 1,
    marginBottom: 6,
  },
  subtitle: {
    fontFamily: fonts.body,
    fontSize: fontSize.body,
    color: colors.accent,
    marginBottom: 16,
  },
  tagline: {
    fontFamily: fonts.body,
    fontSize: fontSize.body,
    color: colors.textSoft,
    textAlign: 'center',
    lineHeight: fontSize.body * 1.7,
    paddingHorizontal: 16,
  },
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.accent,
    borderRadius: radius.xl,
    paddingHorizontal: 32,
    paddingVertical: 16,
  },
  btnText: {
    fontFamily: fonts.bodySemiBold,
    fontSize: fontSize.body,
    color: '#fff',
  },
});
