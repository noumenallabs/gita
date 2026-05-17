import { useQuery, useQueryClient, useInfiniteQuery } from '@tanstack/react-query';
import * as api from '../services/api';
import {
  apiChapterToChapter,
  apiVerseToShloka,
  apiVerseListItemToShloka,
} from '../utils/adapters';
import type { Chapter, Shloka } from '../types';
import type { ApiSearchResult } from '../types/api';
import { chapters as localChapters, shlokas as localShlokas } from '../data/gita-data';

export interface ChapterWithVerses extends Omit<Chapter, 'verses'> {
  verses: Shloka[];
  verseCount: number;
}

export const queryKeys = {
  chapters: ['chapters'] as const,
  chapter: (num: number) => ['chapter', num] as const,
  chapterVerses: (num: number) => ['chapterVerses', num] as const,
  verse: (ch: number, v: number) => ['verse', ch, v] as const,
  search: (query: string) => ['search', query] as const,
  dailyVerse: ['dailyVerse'] as const,
  randomVerse: ['randomVerse'] as const,
  translators: ['translators'] as const,
  collections: ['collections'] as const,
  collection: (key: string) => ['collection', key] as const,
  milestones: ['milestones'] as const,
};

export function useChapters() {
  return useQuery<Chapter[], Error>({
    queryKey: queryKeys.chapters,
    queryFn: async () => {
      try {
        const chapters = await api.fetchChapters();
        return chapters.map(apiChapterToChapter);
      } catch (e) {
        console.warn('API fetch failed, falling back to local data:', e);
        return localChapters;
      }
    },
    staleTime: 1000 * 60 * 60 * 24,
  });
}

export function useChapter(chapterNum: number) {
  return useQuery<ChapterWithVerses, Error>({
    queryKey: queryKeys.chapter(chapterNum),
    queryFn: async () => {
      try {
        const data = await api.fetchChapter(chapterNum, true);
        const chapter = apiChapterToChapter(data);
        return {
          number: chapter.number,
          name: chapter.name,
          translation: chapter.translation,
          summary: chapter.summary,
          verseCount: chapter.verses,
          verses: data.verses.map(apiVerseToShloka),
        };
      } catch (e) {
        console.warn('API fetch failed, falling back to local data:', e);
        const chapter = localChapters.find(c => c.number === chapterNum)!;
        const verses = localShlokas.filter(s => s.chapter === chapterNum);
        return { ...chapter, verses, verseCount: verses.length };
      }
    },
    staleTime: 1000 * 60 * 60,
    enabled: chapterNum >= 1 && chapterNum <= 18,
  });
}

export function useChapterVerses(chapterNum: number) {
  return useInfiniteQuery({
    queryKey: queryKeys.chapterVerses(chapterNum),
    queryFn: async ({ pageParam }) => {
      try {
        const data = await api.fetchChapterVerses(chapterNum, pageParam, 50);
        return {
          verses: data.verses.map(apiVerseListItemToShloka),
          nextPage: pageParam * 50 < data.total ? pageParam + 1 : undefined,
          total: data.total,
        };
      } catch (e) {
        console.warn('API fetch failed, falling back to local data:', e);
        const verses = localShlokas.filter(s => s.chapter === chapterNum);
        return {
          verses: verses,
          nextPage: undefined,
          total: verses.length,
        };
      }
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.nextPage,
    staleTime: 1000 * 60 * 60,
    enabled: chapterNum >= 1 && chapterNum <= 18,
  });
}

export function useVerse(chapterNum: number, verseNum: number) {
  return useQuery<Shloka, Error>({
    queryKey: queryKeys.verse(chapterNum, verseNum),
    queryFn: async () => {
      try {
        const verse = await api.fetchVerse(chapterNum, verseNum);
        return apiVerseToShloka(verse);
      } catch (e) {
        console.warn('API fetch failed, falling back to local data:', e);
        return localShlokas.find(s => s.chapter === chapterNum && s.verse === verseNum)!;
      }
    },
    staleTime: 1000 * 60 * 60,
    enabled: chapterNum >= 1 && chapterNum <= 18 && verseNum >= 1,
  });
}

export function useDailyVerse() {
  return useQuery({
    queryKey: queryKeys.dailyVerse,
    queryFn: async () => {
      try {
        const data = await api.fetchDailyVerse();
        return {
          date: data.date,
          verse: apiVerseToShloka(data.verse),
        };
      } catch (e) {
        console.warn('API fetch failed, falling back to local data:', e);
        return {
          date: new Date().toISOString().split('T')[0],
          verse: localShlokas[0],
        };
      }
    },
    staleTime: 1000 * 60 * 60,
    refetchInterval: 1000 * 60 * 60,
  });
}

export function useRandomVerse() {
  return useQuery<Shloka, Error>({
    queryKey: queryKeys.randomVerse,
    queryFn: async () => {
      try {
        const verse = await api.fetchRandomVerse();
        return apiVerseToShloka(verse);
      } catch (e) {
        console.warn('API fetch failed, falling back to local data:', e);
        const rand = Math.floor(Math.random() * localShlokas.length);
        return localShlokas[rand];
      }
    },
    staleTime: Infinity,
    enabled: false,
  });
}

export function useSearchVerses(query: string) {
  return useQuery<{ results: ApiSearchResult[]; count: number }, Error>({
    queryKey: queryKeys.search(query),
    queryFn: async () => {
      try {
        const data = await api.searchVerses(query, 30, 0);
        return { results: data.results, count: data.count };
      } catch (e) {
        console.warn('API fetch failed, falling back to local search data:', e);
        const lowerQuery = query.toLowerCase();
        const localMatches = localShlokas.filter(s => 
          s.sanskrit.toLowerCase().includes(lowerQuery) || 
          s.translations.english.toLowerCase().includes(lowerQuery)
        ).slice(0, 30);
        return { 
          results: localMatches.map(s => ({
            chapter_number: s.chapter,
            verse_number: s.verse,
            slok: s.sanskrit,
            text: s.translations.english
          })), 
          count: localMatches.length 
        };
      }
    },
    staleTime: 1000 * 60 * 5,
    enabled: query.trim().length >= 2,
  });
}

export function useTranslators() {
  return useQuery({
    queryKey: queryKeys.translators,
    queryFn: async () => {
      try {
        return await api.fetchTranslators();
      } catch (e) {
        console.warn('API fetch failed for translators:', e);
        return [];
      }
    },
    staleTime: 1000 * 60 * 60 * 24,
  });
}

export function useCollections() {
  return useQuery({
    queryKey: queryKeys.collections,
    queryFn: async () => {
      try {
        return await api.fetchCollections();
      } catch (e) {
        console.warn('API fetch failed for collections:', e);
        return [];
      }
    },
    staleTime: 1000 * 60 * 60 * 24,
  });
}

export function useCollection(key: string) {
  return useQuery({
    queryKey: queryKeys.collection(key),
    queryFn: async () => {
      try {
        return await api.fetchCollection(key);
      } catch (e) {
        console.warn('API fetch failed for collection detail:', e);
        return { verses: [], id: 0, key, title_en: 'Offline', sort_order: 0, icon_emoji: null, title_hi: null, description_en: null, description_hi: null };
      }
    },
    staleTime: 1000 * 60 * 60 * 24,
    enabled: !!key,
  });
}

export function usePrefetchChapter() {
  const queryClient = useQueryClient();

  return (chapterNum: number) => {
    queryClient.prefetchQuery({
      queryKey: queryKeys.chapter(chapterNum),
      queryFn: async () => {
        const data = await api.fetchChapter(chapterNum, true);
        return {
          ...apiChapterToChapter(data),
          verses: data.verses.map(apiVerseToShloka),
        };
      },
      staleTime: 1000 * 60 * 60,
    });
  };
}
