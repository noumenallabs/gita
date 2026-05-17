import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as userApi from '../services/userApi';
import type { ApiBookmark } from '../types/api';

export const bookmarkKeys = {
  all: ['bookmarks'] as const,
  list: (collection?: string) => ['bookmarks', collection ?? 'all'] as const,
};

export function useBookmarks(collection?: string) {
  return useQuery<{ bookmarks: ApiBookmark[] }, Error>({
    queryKey: bookmarkKeys.list(collection),
    queryFn: () => userApi.getBookmarks(collection),
    staleTime: 1000 * 30,
  });
}

export function useCreateBookmark() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      chapterNumber,
      verseNumber,
      collection,
      note,
    }: {
      chapterNumber: number;
      verseNumber: number;
      collection?: string;
      note?: string;
    }) => userApi.createBookmark(chapterNumber, verseNumber, collection, note),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: bookmarkKeys.all });
    },
  });
}

export function useUpdateBookmark() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      bookmarkId,
      updates,
    }: {
      bookmarkId: number;
      updates: { note?: string; collection?: string };
    }) => userApi.updateBookmark(bookmarkId, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: bookmarkKeys.all });
    },
  });
}

export function useDeleteBookmark() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (bookmarkId: number) => userApi.deleteBookmark(bookmarkId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: bookmarkKeys.all });
    },
  });
}
