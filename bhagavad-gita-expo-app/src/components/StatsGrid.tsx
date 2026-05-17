import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, radius, spacing } from '../theme/colors';
import { fonts, fontSize } from '../theme/typography';

interface StatItem {
  icon: string;
  value: string | number;
  label: string;
  color?: string;
}

interface StatsGridProps {
  stats: StatItem[];
  columns?: 2 | 3;
}

export function StatsGrid({ stats, columns = 2 }: StatsGridProps) {
  return (
    <View style={styles.grid}>
      {stats.map((stat, i) => (
        <View
          key={i}
          style={[styles.card, columns === 3 && styles.cardThreeCol]}
        >
          <View style={[styles.iconWrap, { backgroundColor: stat.color || colors.accentSoft }]}>
            <MaterialCommunityIcons name={stat.icon as any} size={18} color={colors.accent} />
          </View>
          <Text style={styles.value}>{stat.value}</Text>
          <Text style={styles.label}>{stat.label}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  card: {
    width: '47%',
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.xl,
    padding: spacing.lg,
    alignItems: 'center',
  },
  cardThreeCol: {
    width: '30%',
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  value: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 26,
    color: colors.text,
    fontWeight: '700',
  },
  label: {
    fontFamily: fonts.body,
    fontSize: fontSize.small,
    color: colors.textMuted,
    marginTop: 2,
  },
});
