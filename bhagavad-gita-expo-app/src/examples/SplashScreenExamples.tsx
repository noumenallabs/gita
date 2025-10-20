import React from 'react';
import { View } from 'react-native';
import { 
  SplashScreen, 
  LoadingSplashScreen 
} from '../components';
import { 
  useSimpleSplashScreen, 
  useLoadingSplashScreen 
} from '../hooks';
import { StorageService } from '../utils/storage';

/**
 * Example 1: Simple splash screen without loading progress
 */
export function SimpleSplashExample() {
  const { isAppReady, showCustomSplash, handleCustomSplashComplete } = useSimpleSplashScreen();

  if (!isAppReady) {
    return null;
  }

  return (
    <View style={{ flex: 1 }}>
      {/* Your app content */}
      
      {showCustomSplash && (
        <SplashScreen onAnimationComplete={handleCustomSplashComplete} />
      )}
    </View>
  );
}

/**
 * Example 2: Loading splash screen with progress
 */
export function LoadingSplashExample() {
  const loadingTasks = [
    {
      name: 'Loading user data...',
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
      name: 'Preparing interface...',
      task: async () => {
        // Simulate UI preparation
        await new Promise(resolve => setTimeout(resolve, 800));
      },
    },
  ];

  const { 
    isAppReady, 
    showCustomSplash, 
    loadingProgress, 
    currentLoadingText, 
    showProgress,
    handleCustomSplashComplete 
  } = useLoadingSplashScreen(loadingTasks);

  if (!isAppReady) {
    return null;
  }

  return (
    <View style={{ flex: 1 }}>
      {/* Your app content */}
      
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

/**
 * Example 3: Custom loading tasks for different app states
 */
export function CustomLoadingExample() {
  // Define different loading tasks based on app state
  const getLoadingTasks = () => {
    const isFirstLaunch = false; // Check if this is first app launch
    const needsUpdate = false;   // Check if app needs data update
    
    const baseTasks = [
      {
        name: 'Loading preferences...',
        task: async () => {
          await StorageService.loadUserPreferences();
        },
      },
    ];

    if (isFirstLaunch) {
      baseTasks.push({
        name: 'Setting up app...',
        task: async () => {
          // First-time setup
          await new Promise(resolve => setTimeout(resolve, 1000));
        },
      });
    }

    if (needsUpdate) {
      baseTasks.push({
        name: 'Updating data...',
        task: async () => {
          // Update app data
          await new Promise(resolve => setTimeout(resolve, 1500));
        },
      });
    }

    baseTasks.push({
      name: 'Finalizing...',
      task: async () => {
        await StorageService.performDataMigration();
      },
    });

    return baseTasks;
  };

  const { 
    isAppReady, 
    showCustomSplash, 
    loadingProgress, 
    currentLoadingText, 
    showProgress,
    handleCustomSplashComplete 
  } = useLoadingSplashScreen(getLoadingTasks());

  if (!isAppReady) {
    return null;
  }

  return (
    <View style={{ flex: 1 }}>
      {/* Your app content */}
      
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

/**
 * Example 4: Error handling in loading tasks
 */
export function ErrorHandlingExample() {
  const loadingTasks = [
    {
      name: 'Loading critical data...',
      task: async () => {
        try {
          await StorageService.loadUserPreferences();
        } catch (error) {
          console.error('Failed to load preferences:', error);
          // Continue anyway with defaults
        }
      },
    },
    {
      name: 'Loading optional data...',
      task: async () => {
        try {
          await StorageService.loadFavorites();
        } catch (error) {
          console.error('Failed to load favorites:', error);
          // This is optional, so we can continue
        }
      },
    },
    {
      name: 'Validating data...',
      task: async () => {
        try {
          // Validate loaded data
          await new Promise(resolve => setTimeout(resolve, 500));
        } catch (error) {
          console.error('Data validation failed:', error);
          // Handle validation errors
        }
      },
    },
  ];

  const { 
    isAppReady, 
    showCustomSplash, 
    loadingProgress, 
    currentLoadingText, 
    showProgress,
    handleCustomSplashComplete 
  } = useLoadingSplashScreen(loadingTasks);

  if (!isAppReady) {
    return null;
  }

  return (
    <View style={{ flex: 1 }}>
      {/* Your app content */}
      
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