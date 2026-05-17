import { useEffect, useCallback } from 'react';
import { useFavorites } from './useFavorites';
import { useBookmarks, useCreateBookmark, useDeleteBookmark } from './useBookmarks';
import { getUserId } from '../utils/userId';

export function useFavoriteSync() {
  const { favorites } = useFavorites();
  const { data: bookmarksData } = useBookmarks();
  const createBookmark = useCreateBookmark();
  const deleteBookmark = useDeleteBookmark();

  const syncFavoritesToBookmarks = useCallback(async () => {
    if (!bookmarksData) return;

    const localFavoriteIds = Array.from(favorites);
    const remoteBookmarkIds = bookmarksData.bookmarks.map(
      (b) => `${b.chapter_number}.${b.verse_number}`
    );

    const toAdd = localFavoriteIds.filter((id) => !remoteBookmarkIds.includes(id));
    const toRemove = remoteBookmarkIds.filter((id) => !localFavoriteIds.includes(id));

    for (const id of toAdd) {
      const parts = id.split('.');
      const chapter = parseInt(parts[0] ?? '0', 10);
      const verse = parseInt(parts[1] ?? '0', 10);
      if (chapter > 0 && verse > 0) {
        createBookmark.mutate({ chapterNumber: chapter, verseNumber: verse });
      }
    }

    for (const bookmarkId of toRemove.map((id) => {
      const b = bookmarksData.bookmarks.find(
        (bk) => `${bk.chapter_number}.${bk.verse_number}` === id
      );
      return b?.id;
    })) {
      if (bookmarkId) {
        deleteBookmark.mutate(bookmarkId);
      }
    }
  }, [favorites, bookmarksData, createBookmark, deleteBookmark]);

  useEffect(() => {
    const checkAndSync = async () => {
      try {
        await getUserId();
        syncFavoritesToBookmarks();
      } catch (error) {
        console.error('[useFavoriteSync] Sync failed:', error);
      }
    };

    checkAndSync();
  }, [syncFavoritesToBookmarks]);

  return {
    syncFavoritesToBookmarks,
  };
}
