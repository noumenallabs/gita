import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { EnhancedSplashScreen } from './EnhancedSplashScreen';

interface SeamlessSplashWrapperProps {
  children: React.ReactNode;
}

export function SeamlessSplashWrapper({ children }: SeamlessSplashWrapperProps) {
  const [appPhase, setAppPhase] = useState<'native' | 'custom' | 'app'>('native');

  useEffect(() => {
    let isMounted = true;

    const initializeApp = async () => {
      try {
        // Keep native splash visible
        await SplashScreen.preventAutoHideAsync();

        // Phase 1: Native splash is showing
        // Wait for React Native to be fully ready
        await new Promise(resolve => setTimeout(resolve, 500));

        if (!isMounted) return;

        // Phase 2: Transition to custom splash
        setAppPhase('custom');
        
        // Small delay to ensure custom splash renders
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // Now hide native splash since custom splash is showing
        await SplashScreen.hideAsync();

      } catch (error) {
        console.error('Error initializing app:', error);
        if (isMounted) {
          setAppPhase('app');
          await SplashScreen.hideAsync();
        }
      }
    };

    initializeApp();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleCustomSplashComplete = () => {
    setAppPhase('app');
  };

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      
      {/* Render based on current phase */}
      {appPhase === 'native' && (
        // During native splash phase, render nothing (native splash shows)
        <View style={styles.container} />
      )}
      
      {appPhase === 'custom' && (
        // During custom splash phase, show our splash
        <EnhancedSplashScreen 
          onAnimationComplete={handleCustomSplashComplete}
          minimumDisplayTime={3000}
        />
      )}
      
      {appPhase === 'app' && (
        // During app phase, show the actual app
        children
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});