// Context and main app hooks
export { useAppContext, AppProvider, AppContext } from '../context/AppContext';

// Favorites management hooks (local)
export { useFavorites, useFavoriteStatus, useFavoritesList } from './useFavorites';

// API data hooks
export {
  useChapters,
  useChapter,
  useChapterVerses,
  useVerse,
  useDailyVerse,
  useRandomVerse,
  useSearchVerses,
  useTranslators,
  useCollections,
  useCollection,
  usePrefetchChapter,
} from './useGitaData';

// User progress hooks
export {
  useStreak,
  useActivity,
  useUserMilestones,
  useVerseProgress,
  useChapterProgress,
  useRecordProgress,
} from './useStreak';

// Bookmark hooks
export {
  useBookmarks,
  useCreateBookmark,
  useUpdateBookmark,
  useDeleteBookmark,
} from './useBookmarks';

// General app state hooks
export {
  useAppState,
  useNavigation,
  useSearch,
  useUserPreferences,
  useTheme,
  useAppStatus,
} from './useAppState';

// Daily shloka hooks (legacy - now using useDailyVerse from useGitaData)
export { useDailyShloka, useCurrentDailyShloka } from './useDailyShloka';

// Splash screen hooks
export {
  useSplashScreen,
  useSimpleSplashScreen,
  useLoadingSplashScreen
} from './useSplashScreen';
