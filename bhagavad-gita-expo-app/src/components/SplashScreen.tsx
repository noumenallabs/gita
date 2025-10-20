import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { GitaLogo } from './GitaLogo';

const { width, height } = Dimensions.get('window');

interface SplashScreenProps {
  onAnimationComplete?: () => void;
}

export function SplashScreen({ onAnimationComplete }: SplashScreenProps) {
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.5)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const textSlideAnim = useRef(new Animated.Value(20)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(0)).current;
  const circle1Scale = useRef(new Animated.Value(0)).current;
  const circle2Scale = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Start the animation sequence
    const animationSequence = Animated.sequence([
      // Initial fade in
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      
      // Decorative circles animation
      Animated.parallel([
        Animated.timing(circle1Scale, {
          toValue: 1,
          duration: 1000,
          delay: 200,
          useNativeDriver: true,
        }),
        Animated.timing(circle2Scale, {
          toValue: 1,
          duration: 1000,
          delay: 400,
          useNativeDriver: true,
        }),
      ]),
      
      // Logo animation with spring effect
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 50,
          friction: 7,
          delay: 200,
          useNativeDriver: true,
        }),
        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: 800,
          delay: 200,
          useNativeDriver: true,
        }),
      ]),
      
      // Text slide up animation
      Animated.parallel([
        Animated.timing(textSlideAnim, {
          toValue: 0,
          duration: 600,
          delay: 600,
          useNativeDriver: true,
        }),
        Animated.timing(textOpacity, {
          toValue: 1,
          duration: 600,
          delay: 600,
          useNativeDriver: true,
        }),
      ]),
      
      // Hold for a moment
      Animated.delay(1000),
    ]);

    // Start pulse animation
    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 0.3,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );

    // Start animations
    animationSequence.start(() => {
      // Animation complete callback
      if (onAnimationComplete) {
        setTimeout(onAnimationComplete, 500);
      }
    });

    pulseAnimation.start();

    // Cleanup
    return () => {
      animationSequence.stop();
      pulseAnimation.stop();
    };
  }, []);

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <LinearGradient
        colors={['#f97316', '#f59e0b', '#ea580c']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        {/* Decorative background circles */}
        <View style={styles.decorativeBackground}>
          <Animated.View
            style={[
              styles.decorativeCircle,
              styles.decorativeCircle1,
              {
                transform: [{ scale: circle1Scale }],
                opacity: circle1Scale.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, 0.1],
                }),
              },
            ]}
          />
          <Animated.View
            style={[
              styles.decorativeCircle,
              styles.decorativeCircle2,
              {
                transform: [{ scale: circle2Scale }],
                opacity: circle2Scale.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, 0.1],
                }),
              },
            ]}
          />
        </View>

        {/* Logo */}
        <Animated.View
          style={[
            styles.logoContainer,
            {
              transform: [{ scale: scaleAnim }],
              opacity: logoOpacity,
            },
          ]}
        >
          <View style={styles.logoWrapper}>
            <GitaLogo size={128} color="#ffffff" />
          </View>
        </Animated.View>

        {/* App name and subtitle */}
        <Animated.View
          style={[
            styles.textContainer,
            {
              transform: [{ translateY: textSlideAnim }],
              opacity: textOpacity,
            },
          ]}
        >
          <Text style={styles.appName}>Bhagavad Gita</Text>
          <Text style={styles.subtitle}>TIMELESS WISDOM</Text>
        </Animated.View>

        {/* Subtle pulse overlay */}
        <Animated.View
          style={[
            styles.pulseOverlay,
            {
              opacity: pulseAnim,
            },
          ]}
        />
      </LinearGradient>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 50,
  },
  gradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  decorativeBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    overflow: 'hidden',
  },
  decorativeCircle: {
    position: 'absolute',
    backgroundColor: '#ffffff',
    borderRadius: 1000,
  },
  decorativeCircle1: {
    width: 256,
    height: 256,
    top: height * 0.25 - 128,
    left: width * 0.25 - 128,
  },
  decorativeCircle2: {
    width: 320,
    height: 320,
    bottom: height * 0.25 - 160,
    right: width * 0.25 - 160,
  },
  logoContainer: {
    position: 'relative',
    zIndex: 10,
    marginBottom: 32,
  },
  logoWrapper: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 16,
  },
  textContainer: {
    position: 'relative',
    zIndex: 10,
    alignItems: 'center',
  },
  appName: {
    fontSize: 32,
    fontWeight: '300',
    color: '#ffffff',
    textAlign: 'center',
    letterSpacing: 2,
    marginBottom: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    letterSpacing: 4,
    fontWeight: '500',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  pulseOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#ffffff',
    pointerEvents: 'none',
  },
});