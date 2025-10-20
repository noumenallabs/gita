import { useCallback, useMemo } from 'react';
import { useAppContext } from '../context/AppContext';
import { TabName, UserPreferences } from '../types';

/**
 * Hook for managing general app state
 */
export function useAppState() {
  const { state, actions } = useAppContext();

  return {
    // Current state
    currentTab: state.currentTab,
    searchQuery: state.searchQuery,
    selectedChapter: state.selectedChapter,
    theme: state.theme,
    isLoading: state.isLoading,
    error: state.error,

    // Actions
    setCurrentTab: actions.setCurrentTab,
    setSearchQuery: actions.setSearchQuery,
    setSelectedChapter: actions.setSelectedChapter,
    toggleTheme: actions.toggleTheme,
    setLoading: actions.setLoading,
    setError: actions.setError,
    clearError: actions.clearError,
  };
}

/**
 * Hook for managing navigation state
 */
export function useNavigation() {
  const { state, actions } = useAppContext();

  const navigateToTab = useCallback(
    (tab: TabName) => {
      actions.setCurrentTab(tab);
    },
    [actions]
  );

  const navigateToChapter = useCallback(
    (chapterId: number) => {
      actions.setSelectedChapter(chapterId);
      actions.setCurrentTab('browse');
    },
    [actions]
  );

  const navigateBack = useCallback(() => {
    if (state.selectedChapter !== null) {
      actions.setSelectedChapter(null);
    }
  }, [state.selectedChapter, actions]);

  const canGoBack = useMemo(() => {
    return state.selectedChapter !== null;
  }, [state.selectedChapter]);

  return {
    currentTab: state.currentTab,
    selectedChapter: state.selectedChapter,
    canGoBack,
    navigateToTab,
    navigateToChapter,
    navigateBack,
  };
}

/**
 * Hook for managing search state
 */
export function useSearch() {
  const { state, actions } = useAppContext();

  const setQuery = useCallback(
    (query: string) => {
      actions.setSearchQuery(query);
    },
    [actions]
  );

  const clearQuery = useCallback(() => {
    actions.setSearchQuery('');
  }, [actions]);

  const hasQuery = useMemo(() => {
    return state.searchQuery.trim().length > 0;
  }, [state.searchQuery]);

  return {
    query: state.searchQuery,
    hasQuery,
    setQuery,
    clearQuery,
  };
}

/**
 * Hook for managing user preferences
 */
export function useUserPreferences() {
  const { state, actions } = useAppContext();

  const updatePreference = useCallback(
    async <K extends keyof UserPreferences>(key: K, value: UserPreferences[K]) => {
      await actions.updateUserPreferences({ [key]: value });
    },
    [actions]
  );

  const updateMultiplePreferences = useCallback(
    async (preferences: Partial<UserPreferences>) => {
      await actions.updateUserPreferences(preferences);
    },
    [actions]
  );

  return {
    preferences: state.userPreferences,
    isLoading: state.isLoading,
    error: state.error,
    updatePreference,
    updateMultiplePreferences,
    clearError: actions.clearError,
  };
}

/**
 * Hook for managing theme
 */
export function useTheme() {
  const { state, actions } = useAppContext();

  const isDark = useMemo(() => {
    return state.theme === 'dark';
  }, [state.theme]);

  const isLight = useMemo(() => {
    return state.theme === 'light';
  }, [state.theme]);

  return {
    theme: state.theme,
    isDark,
    isLight,
    toggleTheme: actions.toggleTheme,
  };
}

/**
 * Hook for managing loading and error states
 */
export function useAppStatus() {
  const { state, actions } = useAppContext();

  const setLoading = useCallback(
    (loading: boolean) => {
      actions.setLoading(loading);
    },
    [actions]
  );

  const setError = useCallback(
    (error: string | null) => {
      actions.setError(error);
    },
    [actions]
  );

  const clearError = useCallback(() => {
    actions.clearError();
  }, [actions]);

  const hasError = useMemo(() => {
    return state.error !== null;
  }, [state.error]);

  return {
    isLoading: state.isLoading,
    error: state.error,
    hasError,
    setLoading,
    setError,
    clearError,
  };
}
