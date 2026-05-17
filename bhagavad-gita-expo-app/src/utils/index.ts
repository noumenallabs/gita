// Data validation utilities
export {
  validateSanskritText,
  validateTransliteration,
  validateTranslation,
  validateShloka,
  validateChapter,
  validateSearchQuery,
  sanitizeSanskritText,
  sanitizeTransliteration,
} from './validation';

// Search and indexing utilities
export {
  createSearchIndex,
  searchShlokas,
  highlightSearchTerms,
  getPopularSearchTerms,
  filterShlokasByChapter,
  getDailyShloka as getRandomDailyShloka,
  createDebouncedSearch,
} from './search';

// Daily shloka utilities
export {
  getDailyShloka,
  getFormattedDate,
  getNextDailyShloka,
  getPreviousDailyShloka,
  isNewDay,
  getRandomShloka,
  getDaysToCycleAllShlokas,
  getDailyShlokaStats,
  validateDailyShlokaAlgorithm,
} from './dailyShloka';

// Storage and persistence utilities
export {
  StorageService,
  saveFavorites,
  loadFavorites,
  addToFavorites,
  removeFromFavorites,
  toggleFavorite,
  saveUserPreferences,
  loadUserPreferences,
  updateUserPreference,
  clearAllData,
  performDataMigration,
  getStorageStats,
} from './storage';

// Chapter utilities
export {
  getChaptersWithShlokaInfo,
  searchChapters,
  getPopularChapterSearchTerms,
  getChapterById,
  getShlokasByChapter,
} from './chapters';

// Note: Context and hooks are exported from their respective directories to avoid circular imports

// Animation utilities
export {
  AnimationConfig,
  PageTransitions,
  TabTransitions,
  MicroInteractions,
  LoadingAnimations,
  createAnimatedValue,
  interpolateRotation,
  interpolateOpacity,
  interpolateScale,
  interpolateTranslateX,
} from './animations';

// Responsive design utilities
export {
  DeviceType,
  Breakpoints,
  getDeviceType,
  isTablet,
  isLargeScreen,
  scale,
  verticalScale,
  moderateScale,
  getFontSize,
  getSpacing,
  getLayoutDimensions,
  getOrientation,
  isLandscape,
  getSafeAreaPadding,
  getGridItemWidth,
  getResponsiveProps,
  getAccessibleFontSize,
  getTouchTargetSize,
} from './responsive';

// Accessibility utilities
export {
  FontSizePreference,
  FontSizeMultipliers,
  HighContrastColors,
  getSanskritAccessibilityLabel,
  announceForScreenReader,
  isScreenReaderEnabled,
  isReduceMotionEnabled,
  getAccessibleFontSize as getAccessibilityFontSize,
  getAccessibilityProps,
  getSanskritAccessibilityProps,
  getTranslationAccessibilityProps,
  getNavigationAccessibilityProps,
  getFavoriteAccessibilityProps,
  getExpandableAccessibilityProps,
  getSearchAccessibilityProps,
  announceAction,
  getCardAccessibilityProps,
} from './accessibility';

// Accessibility testing utilities (development only)
export {
  testAccessibilityLabels,
  testAccessibilityRoles,
  testTouchTargetSize,
  testTextContrast,
  testSanskritAccessibility,
  testReduceMotionSupport,
  runAccessibilityTestSuite,
  logAccessibilityResults,
  checkAccessibilitySettings,
  announceToScreenReader,
  validateAccessibilityProps,
  testShlokaCardAccessibility,
  testButtonAccessibility,
  type AccessibilityTestResult,
  type AccessibilityTestSuite,
} from './accessibilityTesting';

// Text optimization utilities
export {
  getSanskritTextProps,
  getTransliterationTextProps,
  getTranslationTextProps,
  optimizeTextForSearch,
  containsSanskrit,
  getSanskritFontFamily,
  getOptimalLineHeight,
  measureText,
  clearTextMeasurementCache,
  optimizeForScreenReader,
  truncateText,
} from './textOptimization';

// Re-export types for convenience
export type {
  Shloka,
  Chapter,
  SearchResult,
  SearchIndex,
  ValidationResult,
  DataValidationOptions,
  AppState,
  AppActions,
  AppContext,
  UserPreferences,
  TranslationView,
  TabName,
} from '../types';
