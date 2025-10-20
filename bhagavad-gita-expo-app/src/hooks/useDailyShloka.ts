import { useState, useEffect, useCallback, useMemo } from 'react';
import { Shloka } from '../types';
import {
  getDailyShloka,
  getFormattedDate,
  getRandomShloka,
  isNewDay,
  getDailyShlokaStats,
} from '../utils/dailyShloka';

interface DailyShlokaState {
  currentShloka: Shloka | null;
  displayDate: string;
  lastUpdateDate: Date;
  isManuallyRefreshed: boolean;
  stats: {
    totalShlokas: number;
    daysToCycle: number;
    chaptersRepresented: number;
    averageShlokaPerChapter: number;
  } | null;
}

interface UseDailyShlokaReturn {
  // Current state
  currentShloka: Shloka | null;
  displayDate: string;
  isManuallyRefreshed: boolean;
  stats: DailyShlokaState['stats'];
  isLoading: boolean;
  error: string | null;

  // Actions
  refreshShloka: () => void;
  resetToDaily: () => void;

  // Utilities
  checkForNewDay: () => boolean;
}

/**
 * Custom hook for managing daily shloka functionality
 */
export function useDailyShloka(shlokas: Shloka[]): UseDailyShlokaReturn {
  const [state, setState] = useState<DailyShlokaState>({
    currentShloka: null,
    displayDate: '',
    lastUpdateDate: new Date(),
    isManuallyRefreshed: false,
    stats: null,
  });

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Calculate stats when shlokas change
  const stats = useMemo(() => {
    if (shlokas.length === 0) return null;
    return getDailyShlokaStats(shlokas);
  }, [shlokas]);

  // Initialize daily shloka
  const initializeDailyShloka = useCallback(() => {
    try {
      setIsLoading(true);
      setError(null);

      if (shlokas.length === 0) {
        throw new Error('No shlokas available');
      }

      const today = new Date();
      const dailyShloka = getDailyShloka(shlokas, today);
      const formattedDate = getFormattedDate(today);

      setState({
        currentShloka: dailyShloka,
        displayDate: formattedDate,
        lastUpdateDate: today,
        isManuallyRefreshed: false,
        stats: getDailyShlokaStats(shlokas),
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load daily shloka';
      setError(errorMessage);
      console.error('Error initializing daily shloka:', err);
    } finally {
      setIsLoading(false);
    }
  }, [shlokas]);

  // Check if it's a new day and update accordingly
  const checkForNewDay = useCallback((): boolean => {
    if (!state.currentShloka || state.isManuallyRefreshed) {
      return false;
    }

    const now = new Date();
    const hasNewDay = isNewDay(state.lastUpdateDate, now);

    if (hasNewDay) {
      // Automatically update to new daily shloka
      const newDailyShloka = getDailyShloka(shlokas, now);
      const newFormattedDate = getFormattedDate(now);

      setState(prevState => ({
        ...prevState,
        currentShloka: newDailyShloka,
        displayDate: newFormattedDate,
        lastUpdateDate: now,
        isManuallyRefreshed: false,
      }));

      return true;
    }

    return false;
  }, [state.currentShloka, state.lastUpdateDate, state.isManuallyRefreshed, shlokas]);

  // Manually refresh to get a random shloka
  const refreshShloka = useCallback(() => {
    try {
      setError(null);

      if (shlokas.length === 0) {
        throw new Error('No shlokas available for refresh');
      }

      // Get a random shloka different from the current one
      const currentId = state.currentShloka?.id;
      const randomShloka = getRandomShloka(shlokas, currentId);

      setState(prevState => ({
        ...prevState,
        currentShloka: randomShloka,
        isManuallyRefreshed: true,
      }));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to refresh shloka';
      setError(errorMessage);
      console.error('Error refreshing shloka:', err);
    }
  }, [shlokas, state.currentShloka]);

  // Reset to the actual daily shloka
  const resetToDaily = useCallback(() => {
    try {
      setError(null);

      if (shlokas.length === 0) {
        throw new Error('No shlokas available');
      }

      const today = new Date();
      const dailyShloka = getDailyShloka(shlokas, today);
      const formattedDate = getFormattedDate(today);

      setState(prevState => ({
        ...prevState,
        currentShloka: dailyShloka,
        displayDate: formattedDate,
        lastUpdateDate: today,
        isManuallyRefreshed: false,
      }));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to reset to daily shloka';
      setError(errorMessage);
      console.error('Error resetting to daily shloka:', err);
    }
  }, [shlokas]);

  // Initialize on mount and when shlokas change
  useEffect(() => {
    initializeDailyShloka();
  }, [initializeDailyShloka]);

  // Set up interval to check for new day
  useEffect(() => {
    // Check every minute for new day
    const interval = setInterval(() => {
      checkForNewDay();
    }, 60000); // 1 minute

    // Also check when the component becomes visible (app foreground)
    const handleAppStateChange = () => {
      checkForNewDay();
    };

    // Note: In a real app, you'd want to listen to AppState changes
    // For now, we'll just rely on the interval

    return () => {
      clearInterval(interval);
    };
  }, [checkForNewDay]);

  return {
    // Current state
    currentShloka: state.currentShloka,
    displayDate: state.displayDate,
    isManuallyRefreshed: state.isManuallyRefreshed,
    stats,
    isLoading,
    error,

    // Actions
    refreshShloka,
    resetToDaily,

    // Utilities
    checkForNewDay,
  };
}

/**
 * Simplified hook for just getting the current daily shloka
 */
export function useCurrentDailyShloka(shlokas: Shloka[]): {
  shloka: Shloka | null;
  isLoading: boolean;
  error: string | null;
} {
  const { currentShloka, isLoading, error } = useDailyShloka(shlokas);

  return {
    shloka: currentShloka,
    isLoading,
    error,
  };
}
