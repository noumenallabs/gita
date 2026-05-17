import React from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { BlurView } from 'expo-blur';
import { colors, radius } from '../theme/colors';
import { fonts, fontSize } from '../theme/typography';
import { LinearGradient } from 'expo-linear-gradient';

interface Tab {
  key: string;
  icon: string;
  iconActive: string;
}

const TABS: Tab[] = [
  { key: 'home', icon: 'home-outline', iconActive: 'home' },
  { key: 'chapters', icon: 'book-open-outline', iconActive: 'book-open' },
  { key: 'journey', icon: 'compass-outline', iconActive: 'compass' },
  { key: 'profile', icon: 'account-outline', iconActive: 'account' },
];

interface FrostedNavBarProps {
  active: string;
  onChange: (key: string) => void;
}

export function FrostedNavBar({ active, onChange }: FrostedNavBarProps) {
  return (
    <View style={styles.wrapper}>
      <LinearGradient
        colors={['transparent', `${colors.bgDeep}cc`]}
        style={styles.fadeGradient}
        pointerEvents="none"
      />
      <BlurView intensity={20} tint="dark" style={styles.container}>
        <View style={styles.inner}>
          {TABS.map((tab) => (
            <TabItem
              key={tab.key}
              tab={tab}
              isActive={tab.key === active}
              onPress={() => onChange(tab.key)}
            />
          ))}
        </View>
      </BlurView>
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
          scale.value = withSpring(0.85, { damping: 15 });
        }}
        onPressOut={() => {
          scale.value = withSpring(1, { damping: 15 });
        }}
        onPress={onPress}
      >
        <MaterialCommunityIcons
          name={isActive ? (tab.iconActive as any) : (tab.icon as any)}
          size={22}
          color={isActive ? colors.accent : colors.textMuted}
        />
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  fadeGradient: {
    height: 30,
  },
  container: {
    overflow: 'hidden',
    borderTopWidth: 1,
    borderTopColor: `${colors.border}80`,
  },
  inner: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingTop: 8,
    paddingBottom: 28,
    backgroundColor: `${colors.bgDeep}e6`,
  },
  tab: {
    width: 48,
    height: 36,
    borderRadius: radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabActive: {
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
});
