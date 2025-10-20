// Context and main app hooks
export { useAppContext, AppProvider, AppContext } from '../context/AppContext';

// Favorites management hooks
export { useFavorites, useFavoriteStatus, useFavoritesList } from './useFavorites';

// General app state hooks
export {
  useAppState,
  useNavigation,
  useSearch,
  useUserPreferences,
  useTheme,
  useAppStatus,
} from './useAppState';

// Daily shloka hooks
export { useDailyShloka, useCurrentDailyShloka } from './useDailyShloka';

// Splash screen hooks
export { 
  useSplashScreen, 
  useSimpleSplashScreen, 
  useLoadingSplashScreen 
} from './useSplashScreen';
