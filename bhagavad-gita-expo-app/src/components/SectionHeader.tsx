import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
  Layout,
  FadeIn,
  FadeOut,
} from 'react-native-reanimated';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, radius, spacing } from '../theme/colors';
import { fonts, fontSize } from '../theme/typography';

interface SectionItem {
  id: string;
  label: string;
  completed?: boolean;
}

interface SectionHeaderProps {
  emoji: string;
  title: string;
  subtitle: string;
  items: SectionItem[];
  defaultOpen?: boolean;
  renderItem?: (item: SectionItem, index: number) => React.ReactNode;
}

export function SectionHeader({
  emoji,
  title,
  subtitle,
  items,
  defaultOpen = false,
  renderItem,
}: SectionHeaderProps) {
  const [expanded, setExpanded] = useState(defaultOpen);
  const rotate = useSharedValue(defaultOpen ? 1 : 0);

  const toggle = () => {
    setExpanded(!expanded);
    rotate.value = withTiming(expanded ? 0 : 1, { duration: 250, easing: Easing.out(Easing.cubic) });
  };

  const chevronStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotate.value * 180}deg` }],
  }));

  return (
    <View style={styles.container}>
      <Pressable style={styles.header} onPress={toggle}>
        <Text style={styles.emoji}>{emoji}</Text>
        <View style={styles.headerText}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>{subtitle}</Text>
        </View>
        <Animated.View style={chevronStyle}>
          <MaterialCommunityIcons name="chevron-down" size={20} color={colors.textMuted} />
        </Animated.View>
      </Pressable>

      {expanded && (
        <Animated.View entering={FadeIn.duration(300)} exiting={FadeOut.duration(200)}>
          <View style={styles.items}>
            {items.map((item, i) =>
              renderItem ? (
                <React.Fragment key={item.id}>{renderItem(item, i)}</React.Fragment>
              ) : (
                <DefaultItem key={item.id} item={item} index={i} />
              )
            )}
          </View>
        </Animated.View>
      )}
    </View>
  );
}

function DefaultItem({ item, index }: { item: SectionItem; index: number }) {
  return (
    <Animated.View
      entering={FadeIn.delay(index * 50).duration(300)}
      style={styles.item}
    >
      <View style={styles.itemLeft}>
        <MaterialCommunityIcons
          name={item.completed ? 'check-circle' : 'book-open-page-variant'}
          size={16}
          color={item.completed ? colors.green : colors.textMuted}
        />
        <Text style={styles.itemLabel}>{item.label}</Text>
      </View>
      <MaterialCommunityIcons name="chevron-right" size={16} color={colors.textMuted} />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.sm,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.xl,
    paddingHorizontal: spacing.lg,
    paddingVertical: 14,
  },
  emoji: {
    fontSize: 20,
    marginRight: 12,
  },
  headerText: {
    flex: 1,
  },
  title: {
    fontFamily: fonts.bodySemiBold,
    fontSize: fontSize.body,
    color: colors.text,
  },
  subtitle: {
    fontFamily: fonts.body,
    fontSize: fontSize.small,
    color: colors.textMuted,
    marginTop: 1,
  },
  items: {
    marginTop: spacing.sm,
    gap: 6,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255,255,255,0.015)',
    borderRadius: radius.xl,
    paddingHorizontal: spacing.lg,
    paddingVertical: 12,
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  itemLabel: {
    fontFamily: fonts.body,
    fontSize: fontSize.body,
    color: colors.text,
  },
});
