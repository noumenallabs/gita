import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { NativeMatchingSplash } from './NativeMatchingSplash';

interface BlockingSplashWrapperProps {
  children: React.ReactNode;
}

export function BlockingSplashWrapper({ children }: BlockingSplashWrapperProps) {
  const [showApp, setShowApp] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const handleSplash = async () => {
      try {
        // Prevent native splash from hiding
        await SplashScreen.preventAutoHideAsync();
        
        // Keep native splash for a bit longer to ensure smooth transition
        setTimeout(async () => {
          if (isMounted) {
            // Hide native splash after our custom splash is definitely ready
            await SplashScreen.hideAsync();
          }
        }, 800);
        
      } catch (error) {
        console.error('Error handling splash:', error);
        if (isMounted) {
          await SplashScreen.hideAsync();
        }
      }
    };

    handleSplash();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleSplashComplete = () => {
    setShowApp(true);
  };

  // Block all app content until splash is complete
  if (!showApp) {
    return (
      <View style={styles.container}>
        <StatusBar style="auto" />
        <NativeMatchingSplash 
          onAnimationComplete={handleSplashComplete}
          minimumDisplayTime={3000}
        />
      </View>
    );
  }

  // Only render app after splash is complete
  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});