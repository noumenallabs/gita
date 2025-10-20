import React, { useMemo } from 'react';
import { View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { LoadingSplashScreen } from './LoadingSplashScreen';
import { useLoadingSplashScreen } from '../hooks/useSplashScreen';
import { StorageService } from '../utils/storage';

interface AppWithSplashProps {
  children: React.ReactNode;
}

export function AppWithSplash({ children }: AppWithSplashProps) {
  // Memoize loading tasks to prevent infinite re-renders
  const loadingTasks = useMemo(() => [
    {
      name: 'Loading preferences...',
      task: async () => {
        await StorageService.loadUserPreferences();
      },
    },
    {
      name: 'Loading favorites...',
      task: async () => {
        await StorageService.loadFavorites();
      },
    },
    {
      name: 'Preparing data...',
      task: async () => {
        // Simulate data preparation
        await new Promise(resolve => setTimeout(resolve, 500));
      },
    },
    {
      name: 'Finalizing...',
      task: async () => {
        await StorageService.performDataMigration();
      },
    },
  ], []);

  const { 
    isAppReady, 
    showCustomSplash, 
    loadingProgress, 
    currentLoadingText, 
    showProgress,
    handleCustomSplashComplete 
  } = useLoadingSplashScreen(loadingTasks);

  // Don't render the main app until ready
  if (!isAppReady) {
    return null;
  }

  return (
    <View style={{ flex: 1 }}>
      {children}
      
      <StatusBar style="auto" />
      
      {/* Custom splash screen overlay */}
      {showCustomSplash && (
        <LoadingSplashScreen 
          onAnimationComplete={handleCustomSplashComplete}
          loadingProgress={loadingProgress}
          loadingText={currentLoadingText}
          showProgress={showProgress}
        />
      )}
    </View>
  );
}