import { useCallback, useMemo } from 'react';
import { useAppContext } from '../context/AppContext';
import { Shloka } from '../types';

/**
 * Custom hook for managing favorites functionality
 */
export function useFavorites() {
  const { state, actions } = useAppContext();

  // Get favorites as array
  const favorites = useMemo(() => {
    return Array.from(state.favorites);
  }, [state.favorites]);

  // Get favorites count
  const favoritesCount = useMemo(() => {
    return state.favorites.size;
  }, [state.favorites]);

  // Check if a shloka is favorited
  const isFavorite = useCallback(
    (shlokaId: string): boolean => {
      return state.favorites.has(shlokaId);
    },
    [state.favorites]
  );

  // Toggle favorite status
  const toggleFavorite = useCallback(
    async (shlokaId: string) => {
      await actions.toggleFavorite(shlokaId);
    },
    [actions]
  );

  // Add to favorites
  const addToFavorites = useCallback(
    async (shlokaId: string) => {
      if (!state.favorites.has(shlokaId)) {
        await actions.toggleFavorite(shlokaId);
      }
    },
    [state.favorites, actions]
  );

  // Remove from favorites
  const removeFromFavorites = useCallback(
    async (shlokaId: string) => {
      if (state.favorites.has(shlokaId)) {
        await actions.toggleFavorite(shlokaId);
      }
    },
    [state.favorites, actions]
  );

  // Filter shlokas to get only favorites
  const getFavoriteShlokas = useCallback(
    (allShlokas: Shloka[]): Shloka[] => {
      return allShlokas.filter(shloka => state.favorites.has(shloka.id));
    },
    [state.favorites]
  );

  // Check if there are any favorites
  const hasFavorites = useMemo(() => {
    return state.favorites.size > 0;
  }, [state.favorites]);

  // Get favorite status for multiple shlokas
  const getFavoriteStatuses = useCallback(
    (shlokaIds: string[]): Record<string, boolean> => {
      const statuses: Record<string, boolean> = {};
      shlokaIds.forEach(id => {
        statuses[id] = state.favorites.has(id);
      });
      return statuses;
    },
    [state.favorites]
  );

  return {
    // State
    favorites,
    favoritesCount,
    hasFavorites,
    isLoading: state.isLoading,
    error: state.error,

    // Actions
    isFavorite,
    toggleFavorite,
    addToFavorites,
    removeFromFavorites,
    getFavoriteShlokas,
    getFavoriteStatuses,

    // Utility actions
    clearError: actions.clearError,
  };
}

/**
 * Hook for getting favorite status of a specific shloka
 */
export function useFavoriteStatus(shlokaId: string) {
  const { isFavorite, toggleFavorite, isLoading } = useFavorites();

  const favoriteStatus = useMemo(
    () => ({
      isFavorite: isFavorite(shlokaId),
      isLoading,
    }),
    [isFavorite, shlokaId, isLoading]
  );

  const toggle = useCallback(async () => {
    await toggleFavorite(shlokaId);
  }, [toggleFavorite, shlokaId]);

  return {
    ...favoriteStatus,
    toggle,
  };
}

/**
 * Hook for managing favorites list view
 */
export function useFavoritesList(allShlokas: Shloka[]) {
  const { getFavoriteShlokas, hasFavorites, favoritesCount, isLoading, error } = useFavorites();

  const favoriteShlokas = useMemo(() => {
    return getFavoriteShlokas(allShlokas);
  }, [getFavoriteShlokas, allShlokas]);

  return {
    favoriteShlokas,
    hasFavorites,
    favoritesCount,
    isLoading,
    error,
  };
}
