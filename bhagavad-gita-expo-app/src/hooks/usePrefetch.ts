import { useQueryClient } from '@tanstack/react-query';
import { queryKeys } from './useGitaData';
import * as api from '../services/api';
import { apiChapterToChapter, apiVerseToShloka } from '../utils/adapters';

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
