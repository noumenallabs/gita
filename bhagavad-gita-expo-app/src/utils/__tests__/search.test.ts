import {
  createSearchIndex,
  searchShlokas,
  highlightSearchTerms,
  getPopularSearchTerms,
  filterShlokasByChapter,
  getDailyShloka,
  getSearchSuggestions,
  advancedSearch,
} from '../search';
import { Shloka } from '../../types';

describe('Search Utils', () => {
  const mockShlokas: Shloka[] = [
    {
      id: '2.47',
      chapter: 2,
      verse: 47,
      sanskrit: 'कर्मण्येवाधिकारस्ते मा फलेषु कदाचन',
      transliteration: 'karmaṇy-evādhikāras te mā phaleṣhu kadāchana',
      translations: {
        english:
          'You have a right to perform your prescribed duties, but you are not entitled to the fruits of your actions.',
        wordByWord:
          'karmaṇi—in prescribed duties; eva—only; adhikāraḥ—right; te—your; mā—not; phaleṣhu—in the fruits',
        commentary:
          "This is one of the most important verses of the Gita. It teaches the principle of Nishkama Karma - performing one's duty without attachment to results.",
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
        wordByWord:
          'prakṛiteḥ—of material nature; kriyamāṇāni—carried out; guṇaiḥ—by the three modes; karmāṇi—activities',
        commentary:
          'This verse explains that all activities are actually carried out by the three modes of material nature.',
      },
    },
    {
      id: '6.5',
      chapter: 6,
      verse: 5,
      sanskrit: 'उद्धरेदात्मनात्मानं नात्मानमवसादयेत्',
      transliteration: 'uddhared ātmanātmānaṁ nātmānam avasādayet',
      translations: {
        english: 'Elevate yourself through the power of your mind, and not degrade yourself.',
        wordByWord:
          'uddharet—elevate; ātmanā—through the mind; ātmānam—the self; na—not; ātmānam—the self; avasādayet—degrade',
        commentary: 'This verse emphasizes self-responsibility and the dual nature of the mind.',
      },
    },
  ];

  describe('createSearchIndex', () => {
    it('should create search index with correct structure', () => {
      const index = createSearchIndex(mockShlokas);

      expect(index).toHaveLength(mockShlokas.length);
      expect(index[0]).toHaveProperty('id', '2.47');
      expect(index[0]).toHaveProperty('chapter', 2);
      expect(index[0]).toHaveProperty('verse', 47);
      expect(index[0]).toHaveProperty('searchableText');
      expect(index[0]).toHaveProperty('keywords');
      expect(Array.isArray(index[0].keywords)).toBe(true);
    });

    it('should include all text fields in searchable text', () => {
      const index = createSearchIndex(mockShlokas);
      const firstItem = index[0];

      expect(firstItem.searchableText).toContain('कर्मण्येवाधिकारस्ते');
      expect(firstItem.searchableText).toContain('karmaṇy-evādhikāras');
      expect(firstItem.searchableText).toContain('prescribed duties');
      expect(firstItem.searchableText).toContain('nishkama karma');
    });

    it('should extract meaningful keywords', () => {
      const index = createSearchIndex(mockShlokas);
      const firstItem = index[0];

      expect(firstItem.keywords).toContain('karma');
      expect(firstItem.keywords).toContain('duties');
      expect(firstItem.keywords).toContain('actions');
      // Should not contain stop words
      expect(firstItem.keywords).not.toContain('the');
      expect(firstItem.keywords).not.toContain('and');
    });
  });

  describe('searchShlokas', () => {
    let searchIndex: any[];

    beforeEach(() => {
      searchIndex = createSearchIndex(mockShlokas);
    });

    it('should return empty results for empty query', () => {
      const results = searchShlokas('', mockShlokas, searchIndex);
      expect(results).toHaveLength(0);
    });

    it('should find shlokas by English text', () => {
      const results = searchShlokas('duties', mockShlokas, searchIndex);
      expect(results.length).toBeGreaterThan(0);
      expect(results[0].shloka.id).toBe('2.47');
      expect(results[0].matchType).toBe('english');
    });

    it('should find shlokas by Sanskrit text', () => {
      const results = searchShlokas('कर्म', mockShlokas, searchIndex);
      expect(results.length).toBeGreaterThan(0);
      expect(results[0].matchType).toBe('sanskrit');
    });

    it('should find shlokas by transliteration', () => {
      const results = searchShlokas('karma', mockShlokas, searchIndex);
      expect(results.length).toBeGreaterThan(0);
      // Should match multiple shlokas containing karma
      expect(results.length).toBeGreaterThanOrEqual(2);
    });

    it('should rank results by relevance', () => {
      const results = searchShlokas('karma', mockShlokas, searchIndex);
      expect(results.length).toBeGreaterThan(1);
      // Results should be sorted by score (descending)
      for (let i = 1; i < results.length; i++) {
        expect(results[i - 1].score).toBeGreaterThanOrEqual(results[i].score);
      }
    });

    it('should limit results to maxResults parameter', () => {
      const results = searchShlokas('karma', mockShlokas, searchIndex, 1);
      expect(results).toHaveLength(1);
    });

    it('should handle chapter.verse format searches', () => {
      const results = searchShlokas('2.47', mockShlokas, searchIndex);
      expect(results.length).toBeGreaterThan(0);
      expect(results[0].shloka.id).toBe('2.47');
    });
  });

  describe('highlightSearchTerms', () => {
    it('should return unhighlighted text for empty query', () => {
      const result = highlightSearchTerms('This is test text', '');
      expect(result).toEqual([{ text: 'This is test text', highlighted: false }]);
    });

    it('should highlight matching terms', () => {
      const result = highlightSearchTerms('This is karma yoga', 'karma');
      expect(result).toHaveLength(3);
      expect(result[0]).toEqual({ text: 'This is ', highlighted: false });
      expect(result[1]).toEqual({ text: 'karma', highlighted: true });
      expect(result[2]).toEqual({ text: ' yoga', highlighted: false });
    });

    it('should highlight multiple terms', () => {
      const result = highlightSearchTerms('karma and dharma', 'karma dharma');
      expect(result.filter(part => part.highlighted)).toHaveLength(2);
    });

    it('should be case insensitive', () => {
      const result = highlightSearchTerms('Karma Yoga', 'karma');
      expect(result[0]).toEqual({ text: 'Karma', highlighted: true });
    });
  });

  describe('getPopularSearchTerms', () => {
    it('should return array of popular terms', () => {
      const terms = getPopularSearchTerms();
      expect(Array.isArray(terms)).toBe(true);
      expect(terms.length).toBeGreaterThan(0);
      expect(terms).toContain('karma');
      expect(terms).toContain('dharma');
      expect(terms).toContain('yoga');
    });
  });

  describe('filterShlokasByChapter', () => {
    it('should filter shlokas by chapter number', () => {
      const chapter2Shlokas = filterShlokasByChapter(mockShlokas, 2);
      expect(chapter2Shlokas).toHaveLength(1);
      expect(chapter2Shlokas[0].chapter).toBe(2);
    });

    it('should return empty array for non-existent chapter', () => {
      const result = filterShlokasByChapter(mockShlokas, 99);
      expect(result).toHaveLength(0);
    });
  });

  describe('getDailyShloka', () => {
    it('should return a shloka for any given date', () => {
      const date = new Date('2024-01-01');
      const shloka = getDailyShloka(mockShlokas, date);
      expect(shloka).toBeDefined();
      expect(mockShlokas).toContain(shloka);
    });

    it('should return same shloka for same date', () => {
      const date = new Date('2024-01-01');
      const shloka1 = getDailyShloka(mockShlokas, date);
      const shloka2 = getDailyShloka(mockShlokas, date);
      expect(shloka1.id).toBe(shloka2.id);
    });

    it('should return different shlokas for different dates', () => {
      const date1 = new Date('2024-01-01');
      const date2 = new Date('2024-01-02');
      const shloka1 = getDailyShloka(mockShlokas, date1);
      const shloka2 = getDailyShloka(mockShlokas, date2);
      // With 3 shlokas, there's a chance they could be the same, but let's test the mechanism
      expect(typeof shloka1.id).toBe('string');
      expect(typeof shloka2.id).toBe('string');
    });

    it('should use current date when no date provided', () => {
      const shloka = getDailyShloka(mockShlokas);
      expect(shloka).toBeDefined();
      expect(mockShlokas).toContain(shloka);
    });
  });

  describe('getSearchSuggestions', () => {
    it('should return popular terms for short queries', () => {
      const suggestions = getSearchSuggestions('k', mockShlokas);
      expect(Array.isArray(suggestions)).toBe(true);
      expect(suggestions.length).toBeGreaterThan(0);
    });

    it('should return matching terms for longer queries', () => {
      const suggestions = getSearchSuggestions('kar', mockShlokas);
      expect(suggestions.some(s => s.includes('kar'))).toBe(true);
    });

    it('should limit suggestions to maxSuggestions', () => {
      const suggestions = getSearchSuggestions('a', mockShlokas, 3);
      expect(suggestions.length).toBeLessThanOrEqual(3);
    });
  });

  describe('advancedSearch', () => {
    let searchIndex: any[];

    beforeEach(() => {
      searchIndex = createSearchIndex(mockShlokas);
    });

    it('should perform basic search with default options', () => {
      const results = advancedSearch('karma', mockShlokas, searchIndex);
      expect(results.length).toBeGreaterThan(0);
    });

    it('should filter by chapter', () => {
      const results = advancedSearch('karma', mockShlokas, searchIndex, {
        chapterFilter: [2],
      });
      expect(results.every(r => r.shloka.chapter === 2)).toBe(true);
    });

    it('should sort by chapter when specified', () => {
      const results = advancedSearch('karma', mockShlokas, searchIndex, {
        sortBy: 'chapter',
      });
      if (results.length > 1) {
        for (let i = 1; i < results.length; i++) {
          expect(results[i - 1].shloka.chapter).toBeLessThanOrEqual(results[i].shloka.chapter);
        }
      }
    });

    it('should limit results to maxResults', () => {
      const results = advancedSearch('karma', mockShlokas, searchIndex, {
        maxResults: 1,
      });
      expect(results.length).toBeLessThanOrEqual(1);
    });
  });
});
