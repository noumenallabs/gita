import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { AppState, AppActions, UserPreferences, TabName } from '../types';
import { StorageService } from '../utils/storage';

// Action types for the reducer
type AppActionType =
  | { type: 'TOGGLE_FAVORITE'; payload: string }
  | { type: 'SET_FAVORITES'; payload: string[] }
  | { type: 'SET_SEARCH_QUERY'; payload: string }
  | { type: 'SET_SELECTED_CHAPTER'; payload: number | null }
  | { type: 'SET_CURRENT_TAB'; payload: TabName }
  | { type: 'TOGGLE_THEME' }
  | { type: 'UPDATE_USER_PREFERENCES'; payload: Partial<UserPreferences> }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'CLEAR_ERROR' }
  | { type: 'HYDRATE_STATE'; payload: Partial<AppState> };

// Initial state
const initialState: AppState = {
  favorites: new Set<string>(),
  currentTab: 'home',
  searchQuery: '',
  selectedChapter: null,
  theme: 'system',
  userPreferences: {
    favoriteShlokas: [],
    defaultTranslationView: 'english',
    theme: 'system',
    fontSize: 'medium',
    showSanskrit: true,
    highContrast: false,
  },
  isLoading: false,
  error: null,
};

// Reducer function
function appReducer(state: AppState, action: AppActionType): AppState {
  switch (action.type) {
    case 'TOGGLE_FAVORITE': {
      const newFavorites = new Set(state.favorites);
      const shlokaId = action.payload;

      if (newFavorites.has(shlokaId)) {
        newFavorites.delete(shlokaId);
      } else {
        newFavorites.add(shlokaId);
      }

      const favoriteShlokas = Array.from(newFavorites);

      return {
        ...state,
        favorites: newFavorites,
        userPreferences: {
          ...state.userPreferences,
          favoriteShlokas,
        },
      };
    }

    case 'SET_FAVORITES': {
      const favoriteShlokas = action.payload;
      return {
        ...state,
        favorites: new Set(favoriteShlokas),
        userPreferences: {
          ...state.userPreferences,
          favoriteShlokas,
        },
      };
    }

    case 'SET_SEARCH_QUERY':
      return {
        ...state,
        searchQuery: action.payload,
      };

    case 'SET_SELECTED_CHAPTER':
      return {
        ...state,
        selectedChapter: action.payload,
      };

    case 'SET_CURRENT_TAB':
      return {
        ...state,
        currentTab: action.payload,
      };

    case 'TOGGLE_THEME': {
      // Cycle through: light -> dark -> system -> light
      let newTheme: 'light' | 'dark' | 'system';
      switch (state.theme) {
        case 'light':
          newTheme = 'dark';
          break;
        case 'dark':
          newTheme = 'system';
          break;
        case 'system':
        default:
          newTheme = 'light';
          break;
      }

      return {
        ...state,
        theme: newTheme,
        userPreferences: {
          ...state.userPreferences,
          theme: newTheme,
        },
      };
    }

    case 'UPDATE_USER_PREFERENCES': {
      const updatedPreferences = {
        ...state.userPreferences,
        ...action.payload,
      };

      return {
        ...state,
        userPreferences: updatedPreferences,
        // Update related state if theme changed
        theme: updatedPreferences.theme || state.theme,
        // Update favorites set if favoriteShlokas changed
        favorites: updatedPreferences.favoriteShlokas
          ? new Set(updatedPreferences.favoriteShlokas)
          : state.favorites,
      };
    }

    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      };

    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
      };

    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null,
      };

    case 'HYDRATE_STATE':
      return {
        ...state,
        ...action.payload,
        // Ensure favorites is a Set
        favorites:
          action.payload.favorites instanceof Set
            ? action.payload.favorites
            : new Set(action.payload.userPreferences?.favoriteShlokas || []),
      };

    default:
      return state;
  }
}

// Context type
interface AppContextType {
  state: AppState;
  actions: AppActions;
}

// Create context
const AppContext = createContext<AppContextType | undefined>(undefined);

// Provider component
interface AppProviderProps {
  children: ReactNode;
}

export function AppProvider({ children }: AppProviderProps) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Actions object
  const actions: AppActions = {
    toggleFavorite: async (id: string) => {
      try {
        dispatch({ type: 'CLEAR_ERROR' });

        // Persist to storage first
        const result = await StorageService.toggleFavorite(id);

        // Update state with actual result from storage
        dispatch({ type: 'SET_FAVORITES', payload: result.favorites });
      } catch (error) {
        dispatch({ type: 'SET_ERROR', payload: 'Failed to update favorites' });
        console.error('Error toggling favorite:', error);
      }
    },

    setSearchQuery: (query: string) => {
      dispatch({ type: 'SET_SEARCH_QUERY', payload: query });
    },

    setSelectedChapter: (id: number | null) => {
      dispatch({ type: 'SET_SELECTED_CHAPTER', payload: id });
    },

    setCurrentTab: (tab: TabName) => {
      dispatch({ type: 'SET_CURRENT_TAB', payload: tab });
    },

    toggleTheme: async () => {
      try {
        dispatch({ type: 'TOGGLE_THEME' });

        // Persist theme change - the new theme is calculated in the reducer
        // We'll get it from the updated state in the next render
      } catch (error) {
        dispatch({ type: 'SET_ERROR', payload: 'Failed to update theme' });
        console.error('Error updating theme:', error);
      }
    },

    updateUserPreferences: async (preferences: Partial<UserPreferences>) => {
      try {
        dispatch({ type: 'SET_LOADING', payload: true });
        dispatch({ type: 'CLEAR_ERROR' });

        // Optimistically update UI
        dispatch({ type: 'UPDATE_USER_PREFERENCES', payload: preferences });

        // Persist to storage
        const updatedPreferences = {
          ...state.userPreferences,
          ...preferences,
        };
        await StorageService.saveUserPreferences(updatedPreferences);
      } catch (error) {
        // Revert optimistic update on error
        const revertPreferences: Partial<UserPreferences> = {};
        Object.keys(preferences).forEach(key => {
          const typedKey = key as keyof UserPreferences;
          revertPreferences[typedKey] = state.userPreferences[typedKey] as any;
        });
        dispatch({ type: 'UPDATE_USER_PREFERENCES', payload: revertPreferences });
        dispatch({ type: 'SET_ERROR', payload: 'Failed to update preferences' });
        console.error('Error updating user preferences:', error);
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    },

    setLoading: (loading: boolean) => {
      dispatch({ type: 'SET_LOADING', payload: loading });
    },

    setError: (error: string | null) => {
      dispatch({ type: 'SET_ERROR', payload: error });
    },

    clearError: () => {
      dispatch({ type: 'CLEAR_ERROR' });
    },
  };

  // Hydrate state from storage on mount
  useEffect(() => {
    const hydrateState = async () => {
      try {
        dispatch({ type: 'SET_LOADING', payload: true });

        // Perform data migration if needed
        await StorageService.performDataMigration();

        // Load user preferences and favorites
        const [userPreferences, favorites] = await Promise.all([
          StorageService.loadUserPreferences(),
          StorageService.loadFavorites(),
        ]);

        // Hydrate state
        dispatch({
          type: 'HYDRATE_STATE',
          payload: {
            userPreferences,
            favorites: new Set(favorites),
            theme: userPreferences.theme,
          },
        });
      } catch (error) {
        console.error('Error hydrating state:', error);
        dispatch({ type: 'SET_ERROR', payload: 'Failed to load app data' });
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };

    hydrateState();
  }, []);

  // Note: Favorites are now persisted directly in the toggleFavorite action
  // This effect is removed to avoid double persistence

  // Persist user preferences when they change
  useEffect(() => {
    const persistPreferences = async () => {
      try {
        await StorageService.saveUserPreferences(state.userPreferences);
      } catch (error) {
        console.error('Error persisting user preferences:', error);
      }
    };

    // Only persist if not in initial loading state
    if (!state.isLoading) {
      persistPreferences();
    }
  }, [state.userPreferences, state.isLoading]);

  const contextValue: AppContextType = {
    state,
    actions,
  };

  return <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>;
}

// Custom hook to use the app context
export function useAppContext(): AppContextType {
  const context = useContext(AppContext);

  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }

  return context;
}

// Export the context for advanced use cases
export { AppContext };
