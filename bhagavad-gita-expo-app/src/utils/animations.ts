import { Animated, Easing } from 'react-native';
import * as Haptics from 'expo-haptics';

// Animation configurations
export const AnimationConfig = {
  // Page transitions
  pageTransition: {
    duration: 300,
    easing: Easing.out(Easing.cubic),
  },

  // Tab transitions
  tabTransition: {
    duration: 250,
    easing: Easing.out(Easing.quad),
  },

  // Micro-interactions
  microInteraction: {
    duration: 150,
    easing: Easing.out(Easing.quad),
  },

  // Loading states
  loading: {
    duration: 1000,
    easing: Easing.inOut(Easing.ease),
  },

  // Skeleton shimmer
  shimmer: {
    duration: 1500,
    easing: Easing.inOut(Easing.ease),
  },
};

// Page transition animations
export class PageTransitions {
  static fadeIn(animatedValue: Animated.Value, callback?: () => void) {
    return Animated.timing(animatedValue, {
      toValue: 1,
      duration: AnimationConfig.pageTransition.duration,
      easing: AnimationConfig.pageTransition.easing,
      useNativeDriver: true,
    }).start(callback);
  }

  static fadeOut(animatedValue: Animated.Value, callback?: () => void) {
    return Animated.timing(animatedValue, {
      toValue: 0,
      duration: AnimationConfig.pageTransition.duration,
      easing: AnimationConfig.pageTransition.easing,
      useNativeDriver: true,
    }).start(callback);
  }

  static slideInFromRight(animatedValue: Animated.Value, callback?: () => void) {
    return Animated.timing(animatedValue, {
      toValue: 0,
      duration: AnimationConfig.pageTransition.duration,
      easing: AnimationConfig.pageTransition.easing,
      useNativeDriver: true,
    }).start(callback);
  }

  static slideOutToLeft(animatedValue: Animated.Value, callback?: () => void) {
    return Animated.timing(animatedValue, {
      toValue: -100,
      duration: AnimationConfig.pageTransition.duration,
      easing: AnimationConfig.pageTransition.easing,
      useNativeDriver: true,
    }).start(callback);
  }

  static scaleIn(animatedValue: Animated.Value, callback?: () => void) {
    return Animated.timing(animatedValue, {
      toValue: 1,
      duration: AnimationConfig.pageTransition.duration,
      easing: Easing.out(Easing.back(1.2)),
      useNativeDriver: true,
    }).start(callback);
  }

  static crossFade(
    fadeOutValue: Animated.Value,
    fadeInValue: Animated.Value,
    callback?: () => void
  ) {
    return Animated.parallel([
      Animated.timing(fadeOutValue, {
        toValue: 0,
        duration: AnimationConfig.pageTransition.duration / 2,
        easing: AnimationConfig.pageTransition.easing,
        useNativeDriver: true,
      }),
      Animated.timing(fadeInValue, {
        toValue: 1,
        duration: AnimationConfig.pageTransition.duration / 2,
        delay: AnimationConfig.pageTransition.duration / 4,
        easing: AnimationConfig.pageTransition.easing,
        useNativeDriver: true,
      }),
    ]).start(callback);
  }
}

// Tab transition animations
export class TabTransitions {
  static switchTab(
    currentTabAnim: Animated.Value,
    newTabAnim: Animated.Value,
    callback?: () => void
  ) {
    return Animated.parallel([
      Animated.timing(currentTabAnim, {
        toValue: 0,
        duration: AnimationConfig.tabTransition.duration,
        easing: AnimationConfig.tabTransition.easing,
        useNativeDriver: true,
      }),
      Animated.timing(newTabAnim, {
        toValue: 1,
        duration: AnimationConfig.tabTransition.duration,
        easing: AnimationConfig.tabTransition.easing,
        useNativeDriver: true,
      }),
    ]).start(callback);
  }

  static tabIndicator(animatedValue: Animated.Value, toValue: number) {
    return Animated.spring(animatedValue, {
      toValue,
      tension: 100,
      friction: 8,
      useNativeDriver: true,
    });
  }
}

// Micro-interaction animations
export class MicroInteractions {
  static buttonPress(animatedValue: Animated.Value, withHaptic = true) {
    if (withHaptic) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }

    return Animated.sequence([
      Animated.timing(animatedValue, {
        toValue: 0.95,
        duration: AnimationConfig.microInteraction.duration / 2,
        easing: AnimationConfig.microInteraction.easing,
        useNativeDriver: true,
      }),
      Animated.timing(animatedValue, {
        toValue: 1,
        duration: AnimationConfig.microInteraction.duration / 2,
        easing: AnimationConfig.microInteraction.easing,
        useNativeDriver: true,
      }),
    ]);
  }

  static favoriteToggle(animatedValue: Animated.Value, withHaptic = true) {
    if (withHaptic) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }

    return Animated.sequence([
      Animated.timing(animatedValue, {
        toValue: 1.3,
        duration: AnimationConfig.microInteraction.duration,
        easing: Easing.out(Easing.back(2)),
        useNativeDriver: true,
      }),
      Animated.timing(animatedValue, {
        toValue: 1,
        duration: AnimationConfig.microInteraction.duration,
        easing: AnimationConfig.microInteraction.easing,
        useNativeDriver: true,
      }),
    ]);
  }

  static expandCollapse(animatedValue: Animated.Value, isExpanded: boolean, callback?: () => void) {
    return Animated.timing(animatedValue, {
      toValue: isExpanded ? 1 : 0,
      duration: AnimationConfig.microInteraction.duration * 2,
      easing: AnimationConfig.microInteraction.easing,
      useNativeDriver: false, // Layout animations need this to be false
    }).start(callback);
  }

  static pullToRefresh(animatedValue: Animated.Value, isRefreshing: boolean) {
    return Animated.timing(animatedValue, {
      toValue: isRefreshing ? 1 : 0,
      duration: AnimationConfig.microInteraction.duration,
      easing: AnimationConfig.microInteraction.easing,
      useNativeDriver: true,
    });
  }
}

// Loading and skeleton animations
export class LoadingAnimations {
  static shimmer(animatedValue: Animated.Value) {
    return Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: AnimationConfig.shimmer.duration,
          easing: AnimationConfig.shimmer.easing,
          useNativeDriver: true,
        }),
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: AnimationConfig.shimmer.duration,
          easing: AnimationConfig.shimmer.easing,
          useNativeDriver: true,
        }),
      ])
    );
  }

  static pulse(animatedValue: Animated.Value) {
    return Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1.05,
          duration: AnimationConfig.loading.duration / 2,
          easing: AnimationConfig.loading.easing,
          useNativeDriver: true,
        }),
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: AnimationConfig.loading.duration / 2,
          easing: AnimationConfig.loading.easing,
          useNativeDriver: true,
        }),
      ])
    );
  }

  static rotate(animatedValue: Animated.Value) {
    return Animated.loop(
      Animated.timing(animatedValue, {
        toValue: 1,
        duration: AnimationConfig.loading.duration,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );
  }
}

// Utility functions
export const createAnimatedValue = (initialValue = 0) => new Animated.Value(initialValue);

export const interpolateRotation = (animatedValue: Animated.Value) => {
  return animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });
};

export const interpolateOpacity = (
  animatedValue: Animated.Value,
  inputRange = [0, 1],
  outputRange = [0, 1]
) => {
  return animatedValue.interpolate({
    inputRange,
    outputRange,
    extrapolate: 'clamp',
  });
};

export const interpolateScale = (
  animatedValue: Animated.Value,
  inputRange = [0, 1],
  outputRange = [0, 1]
) => {
  return animatedValue.interpolate({
    inputRange,
    outputRange,
    extrapolate: 'clamp',
  });
};

export const interpolateTranslateX = (
  animatedValue: Animated.Value,
  inputRange = [0, 1],
  outputRange = [0, 100]
) => {
  return animatedValue.interpolate({
    inputRange,
    outputRange,
    extrapolate: 'clamp',
  });
};
