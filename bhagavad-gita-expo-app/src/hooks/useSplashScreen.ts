import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import * as SplashScreen from 'expo-splash-screen';

interface LoadingTask {
  name: string;
  task: () => Promise<void>;
}

interface UseSplashScreenOptions {
  loadingTasks?: LoadingTask[];
  minimumSplashTime?: number;
  showProgress?: boolean;
}

/**
 * Hook to manage splash screen visibility and app loading state
 */
export function useSplashScreen(options: UseSplashScreenOptions = {}) {
  const {
    loadingTasks = [],
    minimumSplashTime = 2000,
    showProgress = false,
  } = options;

  const [isAppReady, setIsAppReady] = useState(false);
  const [showCustomSplash, setShowCustomSplash] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [currentLoadingText, setCurrentLoadingText] = useState('Initializing...');
  const hasInitialized = useRef(false);

  // Memoize loading tasks to prevent infinite re-renders
  const memoizedTasks = useMemo(() => loadingTasks, [JSON.stringify(loadingTasks.map(t => t.name))]);

  useEffect(() => {
    // Prevent multiple initializations
    if (hasInitialized.current) return;
    hasInitialized.current = true;

    // Keep the native splash screen visible while we prepare the app
    SplashScreen.preventAutoHideAsync();

    const prepareApp = async () => {
      try {
        const startTime = Date.now();
        
        if (memoizedTasks.length > 0) {
          // Execute loading tasks with progress tracking
          for (let i = 0; i < memoizedTasks.length; i++) {
            const task = memoizedTasks[i];
            setCurrentLoadingText(task.name);
            
            await task.task();
            
            // Update progress
            const progress = (i + 1) / memoizedTasks.length;
            setLoadingProgress(progress);
          }
        } else {
          // Default loading simulation
          setCurrentLoadingText('Loading data...');
          setLoadingProgress(0.3);
          await new Promise(resolve => setTimeout(resolve, 500));
          
          setCurrentLoadingText('Preparing interface...');
          setLoadingProgress(0.7);
          await new Promise(resolve => setTimeout(resolve, 500));
          
          setCurrentLoadingText('Almost ready...');
          setLoadingProgress(1);
          await new Promise(resolve => setTimeout(resolve, 300));
        }

        // Ensure minimum splash time
        const elapsedTime = Date.now() - startTime;
        if (elapsedTime < minimumSplashTime) {
          await new Promise(resolve => 
            setTimeout(resolve, minimumSplashTime - elapsedTime)
          );
        }
        
        setIsAppReady(true);
      } catch (error) {
        console.error('Error preparing app:', error);
        setCurrentLoadingText('Error occurred, continuing...');
        setLoadingProgress(1);
        setIsAppReady(true);
      }
    };

    prepareApp();
  }, []); // Empty dependency array to run only once

  useEffect(() => {
    if (isAppReady) {
      // Hide the native splash screen once the app is ready
      SplashScreen.hideAsync();
    }
  }, [isAppReady]);

  const handleCustomSplashComplete = useCallback(() => {
    setShowCustomSplash(false);
  }, []);

  return {
    isAppReady,
    showCustomSplash,
    loadingProgress,
    currentLoadingText,
    showProgress,
    handleCustomSplashComplete,
  };
}

/**
 * Hook for simple splash screen without loading tasks
 */
export function useSimpleSplashScreen() {
  return useSplashScreen({
    minimumSplashTime: 2000,
    showProgress: false,
  });
}

/**
 * Hook for splash screen with loading progress
 */
export function useLoadingSplashScreen(loadingTasks: LoadingTask[]) {
  return useSplashScreen({
    loadingTasks,
    minimumSplashTime: 1500,
    showProgress: true,
  });
}