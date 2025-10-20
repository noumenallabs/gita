import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { EnhancedSplashScreen } from './EnhancedSplashScreen';

interface SimpleSplashWrapperProps {
  children: React.ReactNode;
}

export function SimpleSplashWrapper({ children }: SimpleSplashWrapperProps) {
  const [isAppReady, setIsAppReady] = useState(false);
  const [showCustomSplash, setShowCustomSplash] = useState(true);
  const [customSplashReady, setCustomSplashReady] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const prepareApp = async () => {
      try {
        // Keep the native splash screen visible
        await SplashScreen.preventAutoHideAsync();

        // Wait a moment for custom splash to be ready
        await new Promise(resolve => setTimeout(resolve, 100));

        if (isMounted) {
          // Mark custom splash as ready
          setCustomSplashReady(true);
          
          // Wait another moment for custom splash to render
          await new Promise(resolve => setTimeout(resolve, 200));
          
          // Now hide native splash and show app content
          await SplashScreen.hideAsync();
          setIsAppReady(true);
        }
      } catch (error) {
        console.error('Error preparing app:', error);
        if (isMounted) {
          setCustomSplashReady(true);
          setIsAppReady(true);
          await SplashScreen.hideAsync();
        }
      }
    };

    prepareApp();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleCustomSplashComplete = () => {
    setShowCustomSplash(false);
  };

  // Don't render anything until custom splash is ready
  if (!customSplashReady) {
    return null;
  }

  return (
    <View style={{ flex: 1 }}>
      {/* Only render app content after it's ready AND splash is showing */}
      {isAppReady && !showCustomSplash && children}
      
      <StatusBar style="auto" />
      
      {/* Custom splash screen - shows immediately when ready */}
      {showCustomSplash && (
        <EnhancedSplashScreen 
          onAnimationComplete={handleCustomSplashComplete}
          minimumDisplayTime={3000}
        />
      )}
    </View>
  );
}