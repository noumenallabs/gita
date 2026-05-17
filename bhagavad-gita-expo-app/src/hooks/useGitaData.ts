import { useQuery, useQueryClient, useInfiniteQuery } from '@tanstack/react-query';
import * as api from '../services/api';
import {
  apiChapterToChapter,
  apiVerseToShloka,
  apiVerseListItemToShloka,
} from '../utils/adapters';
import type { Chapter, Shloka } from '../types';
import type { ApiSearchResult } from '../types/api';

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
      const chapters = await api.fetchChapters();
      return chapters.map(apiChapterToChapter);
    },
    staleTime: 1000 * 60 * 60 * 24,
  });
}

export function useChapter(chapterNum: number) {
  return useQuery<ChapterWithVerses, Error>({
    queryKey: queryKeys.chapter(chapterNum),
    queryFn: async () => {
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
    },
    staleTime: 1000 * 60 * 60,
    enabled: chapterNum >= 1 && chapterNum <= 18,
  });
}

export function useChapterVerses(chapterNum: number) {
  return useInfiniteQuery({
    queryKey: queryKeys.chapterVerses(chapterNum),
    queryFn: async ({ pageParam }) => {
      const data = await api.fetchChapterVerses(chapterNum, pageParam, 50);
      return {
        verses: data.verses.map(apiVerseListItemToShloka),
        nextPage: pageParam * 50 < data.total ? pageParam + 1 : undefined,
        total: data.total,
      };
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
      const verse = await api.fetchVerse(chapterNum, verseNum);
      return apiVerseToShloka(verse);
    },
    staleTime: 1000 * 60 * 60,
    enabled: chapterNum >= 1 && chapterNum <= 18 && verseNum >= 1,
  });
}

export function useDailyVerse() {
  return useQuery({
    queryKey: queryKeys.dailyVerse,
    queryFn: async () => {
      const data = await api.fetchDailyVerse();
      return {
        date: data.date,
        verse: apiVerseToShloka(data.verse),
      };
    },
    staleTime: 1000 * 60 * 60,
    refetchInterval: 1000 * 60 * 60,
  });
}

export function useRandomVerse() {
  return useQuery<Shloka, Error>({
    queryKey: queryKeys.randomVerse,
    queryFn: async () => {
      const verse = await api.fetchRandomVerse();
      return apiVerseToShloka(verse);
    },
    staleTime: Infinity,
    enabled: false,
  });
}

export function useSearchVerses(query: string) {
  return useQuery<{ results: ApiSearchResult[]; count: number }, Error>({
    queryKey: queryKeys.search(query),
    queryFn: async () => {
      const data = await api.searchVerses(query, 30, 0);
      return { results: data.results, count: data.count };
    },
    staleTime: 1000 * 60 * 5,
    enabled: query.trim().length >= 2,
  });
}

export function useTranslators() {
  return useQuery({
    queryKey: queryKeys.translators,
    queryFn: api.fetchTranslators,
    staleTime: 1000 * 60 * 60 * 24,
  });
}

export function useCollections() {
  return useQuery({
    queryKey: queryKeys.collections,
    queryFn: api.fetchCollections,
    staleTime: 1000 * 60 * 60 * 24,
  });
}

export function useCollection(key: string) {
  return useQuery({
    queryKey: queryKeys.collection(key),
    queryFn: () => api.fetchCollection(key),
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
