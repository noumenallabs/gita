import React, { useEffect, useRef, useState } from 'react';
import { Animated, View, StyleSheet, DimensionValue } from 'react-native';

interface SkeletonProps {
  width?: DimensionValue;
  height?: number;
  borderRadius?: number;
  style?: Animated.WithAnimatedValue<object>;
}

export function Skeleton({
  width = '100%',
  height = 16,
  borderRadius = 4,
  style,
}: SkeletonProps) {
  const opacityRef = useRef(new Animated.Value(0.3));

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacityRef.current, {
          toValue: 0.7,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(opacityRef.current, {
          toValue: 0.3,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    );
    animation.start();
    return () => animation.stop();
  }, []);

  return (
    <Animated.View
      style={[
        styles.skeleton,
        { width, height, borderRadius, opacity: opacityRef.current },
        style,
      ]}
    />
  );
}

export function SkeletonLine({ width = '100%' }: { width?: DimensionValue }) {
  return <Skeleton width={width} height={14} borderRadius={4} />;
}

export function SkeletonCircle({ size = 40 }: { size?: number }) {
  return (
    <Skeleton
      width={size}
      height={size}
      borderRadius={size / 2}
    />
  );
}

export function SkeletonBlock({ height = 120 }: { height?: number }) {
  return <Skeleton width="100%" height={height} borderRadius={8} />;
}

export function SkeletonCard() {
  return (
    <View style={styles.card}>
      <SkeletonLine width="60%" />
      <View style={styles.spacer} />
      <SkeletonLine width="100%" />
      <View style={styles.spacer} />
      <SkeletonLine width="80%" />
    </View>
  );
}

export function SkeletonVerseCard() {
  return (
    <View style={styles.verseCard}>
      <SkeletonLine width="30%" />
      <View style={styles.spacer} />
      <SkeletonBlock height={60} />
      <View style={styles.spacer} />
      <SkeletonLine width="90%" />
      <View style={styles.spacer} />
      <SkeletonLine width="70%" />
    </View>
  );
}

export function SkeletonChapterCard() {
  return (
    <View style={styles.chapterCard}>
      <View style={styles.chapterRow}>
        <SkeletonCircle size={48} />
        <View style={styles.chapterText}>
          <SkeletonLine width="70%" />
          <View style={styles.spacerSmall} />
          <SkeletonLine width="50%" />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  skeleton: {
    backgroundColor: '#e5e7eb',
  },
  card: {
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#f9fafb',
  },
  verseCard: {
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#f9fafb',
    marginVertical: 8,
  },
  chapterCard: {
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#f9fafb',
    marginBottom: 12,
  },
  chapterRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  chapterText: {
    flex: 1,
    marginLeft: 12,
  },
  spacer: {
    height: 12,
  },
  spacerSmall: {
    height: 6,
  },
});
