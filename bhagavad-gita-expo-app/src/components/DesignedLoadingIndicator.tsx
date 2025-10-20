import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';

interface DesignedLoadingIndicatorProps {
  text?: string;
  color?: string;
  size?: 'small' | 'medium' | 'large';
}

export function DesignedLoadingIndicator({ 
  text = 'Loading...',
  color = '#ffffff',
  size = 'medium'
}: DesignedLoadingIndicatorProps) {
  // Animation values for dots
  const dot1Anim = useRef(new Animated.Value(0)).current;
  const dot2Anim = useRef(new Animated.Value(0)).current;
  const dot3Anim = useRef(new Animated.Value(0)).current;
  
  // Animation values for pulse ring
  const pulseScale = useRef(new Animated.Value(0.8)).current;
  const pulseOpacity = useRef(new Animated.Value(0.3)).current;

  const sizes = {
    small: { dot: 6, gap: 6, text: 14 },
    medium: { dot: 8, gap: 8, text: 16 },
    large: { dot: 10, gap: 10, text: 18 },
  };

  const currentSize = sizes[size];

  useEffect(() => {
    // Animated dots sequence
    const dotsAnimation = Animated.loop(
      Animated.sequence([
        // Animate dots in sequence
        Animated.timing(dot1Anim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(dot2Anim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(dot3Anim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        // Fade all out together
        Animated.parallel([
          Animated.timing(dot1Anim, {
            toValue: 0,
            duration: 400,
            useNativeDriver: true,
          }),
          Animated.timing(dot2Anim, {
            toValue: 0,
            duration: 400,
            useNativeDriver: true,
          }),
          Animated.timing(dot3Anim, {
            toValue: 0,
            duration: 400,
            useNativeDriver: true,
          }),
        ]),
        Animated.delay(300),
      ])
    );

    // Pulse ring animation
    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.parallel([
          Animated.timing(pulseScale, {
            toValue: 1.2,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseOpacity, {
            toValue: 0,
            duration: 1000,
            useNativeDriver: true,
          }),
        ]),
        Animated.parallel([
          Animated.timing(pulseScale, {
            toValue: 0.8,
            duration: 0,
            useNativeDriver: true,
          }),
          Animated.timing(pulseOpacity, {
            toValue: 0.3,
            duration: 0,
            useNativeDriver: true,
          }),
        ]),
      ])
    );

    dotsAnimation.start();
    pulseAnimation.start();

    return () => {
      dotsAnimation.stop();
      pulseAnimation.stop();
    };
  }, []);

  return (
    <View style={styles.container}>
      {/* Pulse ring */}
      <Animated.View
        style={[
          styles.pulseRing,
          {
            width: currentSize.dot * 6,
            height: currentSize.dot * 6,
            borderRadius: currentSize.dot * 3,
            borderColor: color,
            transform: [{ scale: pulseScale }],
            opacity: pulseOpacity,
          },
        ]}
      />
      
      {/* Loading dots */}
      <View style={[styles.dotsContainer, { gap: currentSize.gap }]}>
        <Animated.View
          style={[
            styles.dot,
            {
              width: currentSize.dot,
              height: currentSize.dot,
              borderRadius: currentSize.dot / 2,
              backgroundColor: color,
              opacity: dot1Anim,
              transform: [
                {
                  scale: dot1Anim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.5, 1],
                  }),
                },
                {
                  translateY: dot1Anim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, -4],
                  }),
                },
              ],
            },
          ]}
        />
        <Animated.View
          style={[
            styles.dot,
            {
              width: currentSize.dot,
              height: currentSize.dot,
              borderRadius: currentSize.dot / 2,
              backgroundColor: color,
              opacity: dot2Anim,
              transform: [
                {
                  scale: dot2Anim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.5, 1],
                  }),
                },
                {
                  translateY: dot2Anim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, -4],
                  }),
                },
              ],
            },
          ]}
        />
        <Animated.View
          style={[
            styles.dot,
            {
              width: currentSize.dot,
              height: currentSize.dot,
              borderRadius: currentSize.dot / 2,
              backgroundColor: color,
              opacity: dot3Anim,
              transform: [
                {
                  scale: dot3Anim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.5, 1],
                  }),
                },
                {
                  translateY: dot3Anim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, -4],
                  }),
                },
              ],
            },
          ]}
        />
      </View>

      {/* Loading text */}
      <Text
        style={[
          styles.loadingText,
          {
            fontSize: currentSize.text,
            color: color,
          },
        ]}
      >
        {text}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  pulseRing: {
    position: 'absolute',
    borderWidth: 2,
  },
  dotsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  dot: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  loadingText: {
    textAlign: 'center',
    fontWeight: '500',
    letterSpacing: 1,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
});