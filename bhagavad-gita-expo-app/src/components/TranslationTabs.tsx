import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { colors, radius, spacing } from '../theme/colors';
import { fonts, fontSize } from '../theme/typography';

interface Tab {
  key: string;
  label: string;
}

interface TranslationTabsProps {
  tabs: Tab[];
  activeKey: string;
  onChange: (key: string) => void;
}

export function TranslationTabs({ tabs, activeKey, onChange }: TranslationTabsProps) {
  return (
    <View style={styles.container}>
      {tabs.map((tab) => (
        <TabItem
          key={tab.key}
          tab={tab}
          isActive={tab.key === activeKey}
          onPress={() => onChange(tab.key)}
        />
      ))}
    </View>
  );
}

function TabItem({
  tab,
  isActive,
  onPress,
}: {
  tab: Tab;
  isActive: boolean;
  onPress: () => void;
}) {
  const scale = useSharedValue(1);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View style={animStyle}>
      <Pressable
        style={[styles.tab, isActive && styles.tabActive]}
        onPressIn={() => {
          scale.value = withSpring(0.96, { damping: 15 });
        }}
        onPressOut={() => {
          scale.value = withSpring(1, { damping: 15 });
        }}
        onPress={onPress}
      >
        <Text style={[styles.tabText, isActive && styles.tabTextActive]}>
          {tab.label}
        </Text>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: spacing.lg,
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: radius.full,
    backgroundColor: 'rgba(255,255,255,0.04)',
  },
  tabActive: {
    backgroundColor: colors.accentSoft,
  },
  tabText: {
    fontFamily: fonts.body,
    fontSize: fontSize.small,
    color: colors.textMuted,
  },
  tabTextActive: {
    color: colors.accent,
    fontFamily: fonts.bodySemiBold,
  },
});
