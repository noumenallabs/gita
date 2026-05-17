import React from 'react';
import { View, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';

export function SacredBackground() {
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {/* Top-right glow */}
      <View
        style={[
          styles.glow,
          {
            top: -100,
            right: -100,
            width: 300,
            height: 300,
            borderRadius: 150,
            backgroundColor: colors.accent,
            opacity: 0.06,
          },
        ]}
      />
      {/* Bottom-left glow */}
      <View
        style={[
          styles.glow,
          {
            bottom: -80,
            left: -80,
            width: 250,
            height: 250,
            borderRadius: 125,
            backgroundColor: colors.accent,
            opacity: 0.03,
          },
        ]}
      />
    </View>
  );
}

export function OrnamentalDivider({ color = colors.textMuted }: { color?: string }) {
  return (
    <View style={styles.dividerContainer}>
      <View style={[styles.dividerLine, { backgroundColor: color }]} />
      <View
        style={{
          width: 12,
          height: 12,
          backgroundColor: color,
          opacity: 0.3,
          borderRadius: 6,
          transform: [{ rotate: '45deg' }],
        }}
      />
      <View style={[styles.dividerLine, { backgroundColor: color }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  glow: {
    position: 'absolute',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginVertical: 28,
    paddingHorizontal: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    opacity: 0.2,
  },
});
