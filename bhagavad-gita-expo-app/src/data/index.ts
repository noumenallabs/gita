// Re-export all data and types
export { chapters, shlokas } from './gita-data';
export type { Shloka, Chapter } from './gita-data';

// New complete dataset (719 slokas with full commentaries)
export {
  chapters as completeChapters,
  slokas as completeSlokas,
  legacySlokas,
  stats,
  getChapter,
  getSlokasByChapter,
  getShloka,
  getShlokaById,
  searchSlokas,
  getRandomShloka,
  getDailyShloka,
} from './gita-complete';

export type {
  Chapter as CompleteChapter,
  Shloka as CompleteShloka,
  Commentary,
  Translations as CompleteTranslations,
} from './types';
