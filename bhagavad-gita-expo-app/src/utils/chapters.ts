import { Chapter, Shloka } from '../types';
import { chapters, shlokas } from '../data/gita-data';

/**
 * Gets all chapters with information about available shlokas
 */
export function getChaptersWithShlokaInfo(): Array<
  Chapter & { hasShlokas: boolean; shlokaCount: number }
> {
  return chapters.map(chapter => {
    const chapterShlokas = shlokas.filter(shloka => shloka.chapter === chapter.number);
    return {
      ...chapter,
      hasShlokas: chapterShlokas.length > 0,
      shlokaCount: chapterShlokas.length,
    };
  });
}

/**
 * Searches chapters by name, translation, or summary
 */
export function searchChapters(query: string): Chapter[] {
  if (!query.trim()) {
    return chapters;
  }

  const normalizedQuery = query.toLowerCase().trim();

  return chapters.filter(chapter => {
    const searchableText = [
      chapter.name,
      chapter.translation,
      chapter.summary,
      chapter.number.toString(),
    ]
      .join(' ')
      .toLowerCase();

    return searchableText.includes(normalizedQuery);
  });
}

/**
 * Gets popular chapter search terms
 */
export function getPopularChapterSearchTerms(): string[] {
  return [
    'karma',
    'dharma',
    'yoga',
    'meditation',
    'action',
    'knowledge',
    'devotion',
    'renunciation',
    'wisdom',
    'Arjuna',
  ];
}

/**
 * Gets a chapter by its number
 */
export function getChapterById(chapterNumber: number): Chapter | undefined {
  return chapters.find(chapter => chapter.number === chapterNumber);
}

/**
 * Gets shlokas for a specific chapter
 */
export function getShlokasByChapter(chapterNumber: number): Shloka[] {
  return shlokas.filter(shloka => shloka.chapter === chapterNumber);
}
