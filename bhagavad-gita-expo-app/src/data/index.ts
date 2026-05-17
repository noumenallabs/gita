// Legacy data exports - kept for backward compatibility
export { chapters, shlokas } from './gita-data';
export type { Shloka, Chapter } from './gita-data';

// Note: The complete dataset (gita-complete.ts) has been moved to assets/data/
// Use the new data hooks from '../hooks/useGitaData' instead:
// - useChapters() - Load chapter metadata
// - useShlokas(chapterNumber) - Load shlokas for a specific chapter
// - useSearchShlokas(query) - Search shlokas
// - useDailyShloka() - Get daily shloka

// Type exports
export type {
  Chapter as CompleteChapter,
  Shloka as CompleteShloka,
  Commentary,
  Translations as CompleteTranslations,
} from './types';
