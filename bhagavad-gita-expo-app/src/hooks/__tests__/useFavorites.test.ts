import { renderHook, act } from '@testing-library/react-native';
import { useFavorites, useFavoriteStatus, useFavoritesList } from '../useFavorites';
import { Shloka } from '../../types';

// Mock the AppContext
const mockActions = {
  toggleFavorite: jest.fn(),
  clearError: jest.fn(),
};

const mockState = {
  favorites: new Set(['2.47', '3.27']),
  isLoading: false,
  error: null as string | null,
};

jest.mock('../../context/AppContext', () => ({
  useAppContext: () => ({
    state: mockState,
    actions: mockActions,
  }),
}));

describe('useFavorites', () => {
  const mockShlokas: Shloka[] = [
    {
      id: '2.47',
      chapter: 2,
      verse: 47,
      sanskrit: 'कर्मण्येवाधिकारस्ते मा फलेषु कदाचन',
      transliteration: 'karmaṇy-evādhikāras te mā phaleṣhu kadāchana',
      translations: {
        english: 'You have a right to perform your prescribed duties.',
        wordByWord: 'karmaṇi—in prescribed duties; eva—only',
        commentary: 'This teaches the principle of Nishkama Karma.',
      },
    },
    {
      id: '3.27',
      chapter: 3,
      verse: 27,
      sanskrit: 'प्रकृतेः क्रियमाणानि गुणैः कर्माणि सर्वशः',
      transliteration: 'prakṛiteḥ kriyamāṇāni guṇaiḥ karmāṇi sarvaśhaḥ',
      translations: {
        english: 'All actions are performed by the modes of material nature.',
        wordByWord: 'prakṛiteḥ—of material nature; kriyamāṇāni—carried out',
        commentary: 'This verse explains the three modes of material nature.',
      },
    },
    {
      id: '6.5',
      chapter: 6,
      verse: 5,
      sanskrit: 'उद्धरेदात्मनात्मानं नात्मानमवसादयेत्',
      transliteration: 'uddhared ātmanātmānaṁ nātmānam avasādayet',
      translations: {
        english: 'Elevate yourself through the power of your mind.',
        wordByWord: 'uddharet—elevate; ātmanā—through the mind',
        commentary: 'This verse emphasizes self-responsibility.',
      },
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    mockState.favorites = new Set(['2.47', '3.27']);
    mockState.isLoading = false;
    mockState.error = null;
  });

  describe('useFavorites hook', () => {
    it('should return correct favorites array', () => {
      const { result } = renderHook(() => useFavorites());

      expect(result.current.favorites).toEqual(['2.47', '3.27']);
      expect(result.current.favoritesCount).toBe(2);
      expect(result.current.hasFavorites).toBe(true);
    });

    it('should check if shloka is favorite correctly', () => {
      const { result } = renderHook(() => useFavorites());

      expect(result.current.isFavorite('2.47')).toBe(true);
      expect(result.current.isFavorite('3.27')).toBe(true);
      expect(result.current.isFavorite('6.5')).toBe(false);
    });

    it('should call toggleFavorite action', async () => {
      const { result } = renderHook(() => useFavorites());

      await act(async () => {
        await result.current.toggleFavorite('6.5');
      });

      expect(mockActions.toggleFavorite).toHaveBeenCalledWith('6.5');
    });

    it('should add to favorites when not already favorited', async () => {
      const { result } = renderHook(() => useFavorites());

      await act(async () => {
        await result.current.addToFavorites('6.5');
      });

      expect(mockActions.toggleFavorite).toHaveBeenCalledWith('6.5');
    });

    it('should not add to favorites when already favorited', async () => {
      const { result } = renderHook(() => useFavorites());

      await act(async () => {
        await result.current.addToFavorites('2.47');
      });

      expect(mockActions.toggleFavorite).not.toHaveBeenCalled();
    });

    it('should remove from favorites when favorited', async () => {
      const { result } = renderHook(() => useFavorites());

      await act(async () => {
        await result.current.removeFromFavorites('2.47');
      });

      expect(mockActions.toggleFavorite).toHaveBeenCalledWith('2.47');
    });

    it('should not remove from favorites when not favorited', async () => {
      const { result } = renderHook(() => useFavorites());

      await act(async () => {
        await result.current.removeFromFavorites('6.5');
      });

      expect(mockActions.toggleFavorite).not.toHaveBeenCalled();
    });

    it('should filter favorite shlokas correctly', () => {
      const { result } = renderHook(() => useFavorites());

      const favoriteShlokas = result.current.getFavoriteShlokas(mockShlokas);

      expect(favoriteShlokas).toHaveLength(2);
      expect(favoriteShlokas[0].id).toBe('2.47');
      expect(favoriteShlokas[1].id).toBe('3.27');
    });

    it('should get favorite statuses for multiple shlokas', () => {
      const { result } = renderHook(() => useFavorites());

      const statuses = result.current.getFavoriteStatuses(['2.47', '3.27', '6.5']);

      expect(statuses).toEqual({
        '2.47': true,
        '3.27': true,
        '6.5': false,
      });
    });
  });

  describe('useFavoriteStatus hook', () => {
    it('should return correct favorite status for specific shloka', () => {
      const { result } = renderHook(() => useFavoriteStatus('2.47'));

      expect(result.current.isFavorite).toBe(true);
      expect(result.current.isLoading).toBe(false);
    });

    it('should toggle favorite for specific shloka', async () => {
      const { result } = renderHook(() => useFavoriteStatus('6.5'));

      await act(async () => {
        await result.current.toggle();
      });

      expect(mockActions.toggleFavorite).toHaveBeenCalledWith('6.5');
    });
  });

  describe('useFavoritesList hook', () => {
    it('should return favorite shlokas and metadata', () => {
      const { result } = renderHook(() => useFavoritesList(mockShlokas));

      expect(result.current.favoriteShlokas).toHaveLength(2);
      expect(result.current.hasFavorites).toBe(true);
      expect(result.current.favoritesCount).toBe(2);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBe(null);
    });

    it('should handle empty favorites', () => {
      // Mock empty favorites
      mockState.favorites = new Set<string>();

      const { result } = renderHook(() => useFavoritesList(mockShlokas));

      expect(result.current.favoriteShlokas).toHaveLength(0);
      expect(result.current.hasFavorites).toBe(false);
      expect(result.current.favoritesCount).toBe(0);
    });
  });

  describe('Integration scenarios', () => {
    it('should handle loading state', () => {
      mockState.isLoading = true;

      const { result } = renderHook(() => useFavorites());

      expect(result.current.isLoading).toBe(true);
    });

    it('should handle error state', () => {
      mockState.error = 'Failed to save favorites';

      const { result } = renderHook(() => useFavorites());

      expect(result.current.error).toBe('Failed to save favorites');
    });

    it('should clear error when requested', async () => {
      const { result } = renderHook(() => useFavorites());

      await act(async () => {
        result.current.clearError();
      });

      expect(mockActions.clearError).toHaveBeenCalled();
    });
  });

  describe('Performance and memoization', () => {
    it('should memoize favorites array', () => {
      const { result, rerender } = renderHook(() => useFavorites());

      const firstFavorites = result.current.favorites;

      // Rerender without changing state
      rerender();

      const secondFavorites = result.current.favorites;

      // Should be the same reference (memoized)
      expect(firstFavorites).toBe(secondFavorites);
    });

    it('should memoize favorite status checks', () => {
      const { result } = renderHook(() => useFavorites());

      const isFavorite1 = result.current.isFavorite;
      const isFavorite2 = result.current.isFavorite;

      // Should be the same function reference (memoized)
      expect(isFavorite1).toBe(isFavorite2);
    });

    it('should memoize filtered favorite shlokas', () => {
      const { result, rerender } = renderHook(() => useFavoritesList(mockShlokas));

      const firstFavoriteShlokas = result.current.favoriteShlokas;

      // Rerender with same shlokas
      rerender();

      const secondFavoriteShlokas = result.current.favoriteShlokas;

      // Should be the same reference (memoized)
      expect(firstFavoriteShlokas).toBe(secondFavoriteShlokas);
    });
  });
});
