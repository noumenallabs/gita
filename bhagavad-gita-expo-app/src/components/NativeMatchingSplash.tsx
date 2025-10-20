import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { GitaLogo } from './GitaLogo';
import { DesignedLoadingIndicator } from './DesignedLoadingIndicator';

const { width, height } = Dimensions.get('window');

interface NativeMatchingSplashProps {
  onAnimationComplete?: () => void;
  minimumDisplayTime?: number;
}

export function NativeMatchingSplash({ 
  onAnimationComplete,
  minimumDisplayTime = 3000
}: NativeMatchingSplashProps) {
  // Animation values
  const backgroundAnim = useRef(new Animated.Value(0)).current; // 0 = solid orange, 1 = gradient
  const logoScaleAnim = useRef(new Animated.Value(1)).current;
  const logoOpacity = useRef(new Animated.Value(1)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;
  const textSlideAnim = useRef(new Animated.Value(20)).current;
  const loadingOpacity = useRef(new Animated.Value(0)).current;
  const decorativeOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const startTime = Date.now();

    // Animation sequence that starts from native splash appearance
    const animationSequence = Animated.sequence([
      // Phase 1: Start exactly like native splash (500ms)
      Animated.delay(500),
      
      // Phase 2: Transition to gradient background (800ms)
      Animated.timing(backgroundAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: false, // Can't use native driver for background
      }),
      
      // Phase 3: Add decorative elements (600ms)
      Animated.timing(decorativeOpacity, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      
      // Phase 4: Enhance logo with scale animation (400ms)
      Animated.spring(logoScaleAnim, {
        toValue: 1.1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
      
      // Phase 5: Add text (600ms)
      Animated.parallel([
        Animated.timing(textSlideAnim, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(textOpacity, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
      ]),
      
      // Phase 6: Add loading indicator (400ms)
      Animated.timing(loadingOpacity, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
    ]);

    // Start the animation
    animationSequence.start();

    // Complete after minimum time
    const completeAnimation = () => {
      const elapsedTime = Date.now() - startTime;
      const remainingTime = Math.max(0, minimumDisplayTime - elapsedTime);
      
      setTimeout(() => {
        if (onAnimationComplete) {
          onAnimationComplete();
        }
      }, remainingTime);
    };

    // Complete after animations + minimum time
    setTimeout(completeAnimation, 3300);

    // Cleanup
    return () => {
      animationSequence.stop();
    };
  }, [minimumDisplayTime, onAnimationComplete]);

  return (
    <View style={styles.container}>
      {/* Background that transitions from solid orange to gradient */}
      <Animated.View style={[styles.solidBackground, {
        opacity: backgroundAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [1, 0],
        }),
      }]} />
      
      <Animated.View style={[styles.gradientContainer, {
        opacity: backgroundAnim,
      }]}>
        <LinearGradient
          colors={['#f97316', '#f59e0b', '#ea580c']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradient}
        />
      </Animated.View>

      {/* Decorative circles - fade in after background transition */}
      <Animated.View style={[styles.decorativeBackground, { opacity: decorativeOpacity }]}>
        <View style={[styles.decorativeCircle, styles.decorativeCircle1]} />
        <View style={[styles.decorativeCircle, styles.decorativeCircle2]} />
      </Animated.View>

      {/* Logo - starts same as native, then enhances */}
      <Animated.View
        style={[
          styles.logoContainer,
          {
            transform: [{ scale: logoScaleAnim }],
            opacity: logoOpacity,
          },
        ]}
      >
        <View style={styles.logoWrapper}>
          <GitaLogo size={120} color="#ffffff" />
        </View>
      </Animated.View>

      {/* Text - appears after logo enhancement */}
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

      {/* Loading indicator - appears last */}
      <Animated.View
        style={[
          styles.loadingContainer,
          {
            opacity: loadingOpacity,
          },
        ]}
      >
        <DesignedLoadingIndicator 
          text="Loading wisdom..."
          color="rgba(255, 255, 255, 0.9)"
          size="medium"
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  solidBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#f97316', // Exact same as native splash
  },
  gradientContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  gradient: {
    flex: 1,
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
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
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
    marginBottom: 48,
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
  loadingContainer: {
    position: 'relative',
    zIndex: 10,
    alignItems: 'center',
  },
});