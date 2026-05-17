import { Shloka, SearchResult, SearchIndex } from '../types';
import { validateSearchQuery } from './validation';

/**
 * Creates a search index for efficient text searching
 */
export function createSearchIndex(shlokas: Shloka[]): SearchIndex[] {
  return shlokas.map(shloka => {
    // Combine all searchable text
    const searchableText = [
      shloka.sanskrit,
      shloka.transliteration,
      shloka.translations.english,
      shloka.translations.wordByWord,
      shloka.translations.commentary,
    ]
      .join(' ')
      .toLowerCase();

    // Extract keywords for faster searching
    const keywords = extractKeywords(searchableText);

    return {
      id: shloka.id,
      chapter: shloka.chapter,
      verse: shloka.verse,
      searchableText,
      keywords,
    };
  });
}

/**
 * Extracts meaningful keywords from text
 */
function extractKeywords(text: string): string[] {
  // Remove common stop words and extract meaningful terms
  const stopWords = new Set([
    'the',
    'a',
    'an',
    'and',
    'or',
    'but',
    'in',
    'on',
    'at',
    'to',
    'for',
    'of',
    'with',
    'by',
    'is',
    'are',
    'was',
    'were',
    'be',
    'been',
    'being',
    'have',
    'has',
    'had',
    'do',
    'does',
    'did',
    'will',
    'would',
    'could',
    'should',
    'may',
    'might',
    'must',
    'can',
    'shall',
    'this',
    'that',
    'these',
    'those',
    'i',
    'you',
    'he',
    'she',
    'it',
    'we',
    'they',
    'my',
    'your',
    'his',
    'her',
    'its',
    'our',
    'their',
    'me',
    'him',
    'her',
    'us',
    'them',
  ]);

  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ') // Remove punctuation
    .split(/\s+/)
    .filter(word => word.length > 2 && !stopWords.has(word))
    .filter((word, index, arr) => arr.indexOf(word) === index); // Remove duplicates
}

/**
 * Searches through shlokas using the search index
 */
export function searchShlokas(
  queryOrShlokas: string | Shloka[] | undefined | null,
  shlokasOrQuery: Shloka[] | string,
  searchIndex?: SearchIndex[],
  maxResults: number = 20
): SearchResult[] {
  let query: string;
  let shlokas: Shloka[];
  let finalSearchIndex: SearchIndex[];

  if (Array.isArray(queryOrShlokas) || queryOrShlokas === undefined || queryOrShlokas === null) {
    // Called as: searchShlokas(shlokas, query)
    shlokas = (queryOrShlokas || []) as Shloka[];
    query = shlokasOrQuery as string;
    finalSearchIndex = createSearchIndex(shlokas);
  } else {
    // Called as: searchShlokas(query, shlokas, searchIndex, maxResults)
    query = queryOrShlokas;
    shlokas = shlokasOrQuery as Shloka[];
    finalSearchIndex = searchIndex || createSearchIndex(shlokas);
  }

  // Gracefully handle undefined or empty shlokas array
  if (!shlokas || !Array.isArray(shlokas) || shlokas.length === 0) {
    return [];
  }

  // Gracefully handle invalid query type
  if (typeof query !== 'string') {
    return [];
  }

  // Validate query
  const validation = validateSearchQuery(query);
  if (!validation.isValid) {
    return [];
  }

  const normalizedQuery = query.toLowerCase().trim();
  if (normalizedQuery.length === 0) {
    return [];
  }

  const results: SearchResult[] = [];
  const queryTerms = normalizedQuery.split(/\s+/).filter(term => term.length > 0);

  shlokas.forEach((shloka, index) => {
    const searchIndexItem = finalSearchIndex[index];
    let bestScore = 0;
    let bestMatchType: SearchResult['matchType'] = 'english';
    let bestMatchText = '';

    // Search in different fields with different weights and priorities
    const searchFields = [
      { text: shloka.sanskrit, type: 'sanskrit' as const, weight: 2.0, priority: 1 },
      { text: shloka.transliteration, type: 'transliteration' as const, weight: 1.8, priority: 2 },
      { text: shloka.translations.english, type: 'english' as const, weight: 1.5, priority: 3 },
      {
        text: shloka.translations.wordByWord,
        type: 'wordByWord' as const,
        weight: 1.2,
        priority: 4,
      },
      {
        text: shloka.translations.commentary,
        type: 'commentary' as const,
        weight: 1.0,
        priority: 5,
      },
    ];

    const fieldScores: Array<{
      score: number;
      type: SearchResult['matchType'];
      text: string;
      priority: number;
    }> = [];

    for (const field of searchFields) {
      const fieldScore = calculateFieldScore(normalizedQuery, queryTerms, field.text);
      if (fieldScore > 0) {
        const weightedScore = fieldScore * field.weight;
        fieldScores.push({
          score: weightedScore,
          type: field.type,
          text: extractMatchText(field.text, normalizedQuery),
          priority: field.priority,
        });
      }
    }

    // Find the best match (highest score, then by priority)
    if (fieldScores.length > 0) {
      fieldScores.sort((a, b) => {
        if (Math.abs(a.score - b.score) < 0.1) {
          return a.priority - b.priority; // Lower priority number = higher priority
        }
        return b.score - a.score;
      });

      const bestMatch = fieldScores[0];
      bestScore = bestMatch.score;
      bestMatchType = bestMatch.type;
      bestMatchText = bestMatch.text;

      // Boost score for keyword matches
      const keywordScore = calculateKeywordScore(queryTerms, searchIndexItem.keywords);
      bestScore += keywordScore * 0.3;

      // Boost score for exact phrase matches
      if (normalizedQuery.length > 3) {
        const cleanQuery = stripDiacritics(normalizedQuery);
        for (const field of searchFields) {
          const cleanFieldText = stripDiacritics(field.text.toLowerCase());
          if (cleanFieldText.includes(cleanQuery)) {
            bestScore += 1.0 * field.weight;
            break;
          }
        }
      }
    }

    // Boost score for chapter/verse number matches independent of text matching
    const chapterVerseBoost = calculateChapterVerseBoost(queryTerms, shloka);
    if (chapterVerseBoost > 0) {
      if (bestScore === 0) {
        bestScore = chapterVerseBoost * 4.0;
        bestMatchType = 'english';
        bestMatchText = `Chapter ${shloka.chapter}, Verse ${shloka.verse}`;
      } else {
        bestScore += chapterVerseBoost;
      }
    }

    // Only include results with meaningful scores
    if (bestScore > 0.2) {
      results.push({
        shloka,
        matchType: bestMatchType,
        matchText: bestMatchText,
        score: Math.min(bestScore, 10), // Cap score at 10 for normalization
        matches: queryTerms,
      });
    }
  });

  // Sort by score (descending) and limit results
  return results.sort((a, b) => b.score - a.score).slice(0, maxResults);
}

/**
 * Calculates search score for a specific field
 */
function calculateFieldScore(query: string, queryTerms: string[], fieldText: string): number {
  const cleanField = stripDiacritics(fieldText.toLowerCase());
  const cleanQuery = stripDiacritics(query);
  let score = 0;

  // Exact phrase match (highest score)
  if (cleanField.includes(cleanQuery)) {
    score += 2.0;
  }

  // Individual term matches
  for (const term of queryTerms) {
    const cleanTerm = stripDiacritics(term);
    if (cleanField.includes(cleanTerm)) {
      // Boost score for whole word matches
      const wordRegex = new RegExp(`\\b${cleanTerm}\\b`, 'i');
      if (wordRegex.test(cleanField)) {
        score += 1.0;
      } else {
        score += 0.5;
      }
    }
  }

  // Boost score based on term density
  const cleanTerms = queryTerms.map(term => stripDiacritics(term));
  const termDensity =
    cleanTerms.filter(cleanTerm => cleanField.includes(cleanTerm)).length / queryTerms.length;
  score *= 1 + termDensity;

  return score;
}

/**
 * Calculates score based on keyword matches
 */
function calculateKeywordScore(queryTerms: string[], keywords: string[]): number {
  let score = 0;

  for (const term of queryTerms) {
    if (keywords.includes(term)) {
      score += 0.5;
    }
  }

  return score;
}

/**
 * Extracts relevant text snippet around the match
 */
function extractMatchText(text: string, query: string, maxLength: number = 150): string {
  const cleanText = stripDiacritics(text.toLowerCase());
  const cleanQuery = stripDiacritics(query.toLowerCase());
  const queryIndex = cleanText.indexOf(cleanQuery);

  if (queryIndex === -1) {
    // If exact query not found, return beginning of text
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  }

  // Extract text around the match
  const start = Math.max(0, queryIndex - 50);
  const end = Math.min(text.length, queryIndex + query.length + 50);

  let excerpt = text.substring(start, end);

  // Add ellipsis if needed
  if (start > 0) excerpt = '...' + excerpt;
  if (end < text.length) excerpt = excerpt + '...';

  return excerpt;
}

/**
 * Highlights search terms in text for React Native
 */
export function highlightSearchTerms(
  text: string,
  query: string
): Array<{ text: string; highlighted: boolean }> {
  if (!query.trim()) return [{ text, highlighted: false }];

  const queryTerms = query
    .toLowerCase()
    .split(/\s+/)
    .filter(term => term.length > 0);
  if (queryTerms.length === 0) return [{ text, highlighted: false }];

  // Create a regex that matches any of the query terms
  const regexPattern = queryTerms
    .map(term => term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
    .join('|');
  const regex = new RegExp(`(${regexPattern})`, 'gi');

  const parts: Array<{ text: string; highlighted: boolean }> = [];
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    // Add text before the match
    if (match.index > lastIndex) {
      parts.push({
        text: text.substring(lastIndex, match.index),
        highlighted: false,
      });
    }

    // Add the highlighted match
    parts.push({
      text: match[0],
      highlighted: true,
    });

    lastIndex = match.index + match[0].length;
  }

  // Add remaining text
  if (lastIndex < text.length) {
    parts.push({
      text: text.substring(lastIndex),
      highlighted: false,
    });
  }

  return parts.length > 0 ? parts : [{ text, highlighted: false }];
}

/**
 * Gets popular search suggestions
 */
export function getPopularSearchTerms(): string[] {
  return [
    'karma',
    'dharma',
    'soul',
    'action',
    'duty',
    'meditation',
    'yoga',
    'Krishna',
    'Arjuna',
    'mind',
    'self',
    'eternal',
    'devotion',
    'wisdom',
    'righteousness',
  ];
}

/**
 * Filters shlokas by chapter
 */
export function filterShlokasByChapter(shlokas: Shloka[], chapterNumber: number): Shloka[] {
  return shlokas.filter(shloka => shloka.chapter === chapterNumber);
}

/**
 * Gets a random shloka for daily display
 */
export function getDailyShloka(shlokas: Shloka[], date: Date = new Date()): Shloka {
  // Create deterministic selection based on date
  const dateString = date.toISOString().split('T')[0]; // YYYY-MM-DD format
  const dateHash = hashString(dateString);
  const index = Math.abs(dateHash) % shlokas.length;

  return shlokas[index];
}

/**
 * Simple string hash function for deterministic selection
 */
function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return hash;
}

/**
 * Calculates boost for chapter/verse number matches
 */
function calculateChapterVerseBoost(queryTerms: string[], shloka: Shloka): number {
  let boost = 0;

  for (const term of queryTerms) {
    // Check for chapter number match
    if (term === shloka.chapter.toString()) {
      boost += 0.5;
    }

    // Check for verse number match
    if (term === shloka.verse.toString()) {
      boost += 0.3;
    }

    // Check for chapter.verse format (e.g., "2.47")
    if (term === `${shloka.chapter}.${shloka.verse}`) {
      boost += 1.0;
    }
  }

  return boost;
}

/**
 * Advanced search with filters and sorting options
 */
export function advancedSearch(
  query: string,
  shlokas: Shloka[],
  searchIndex: SearchIndex[],
  options: {
    maxResults?: number;
    chapterFilter?: number[];
    sortBy?: 'relevance' | 'chapter' | 'verse';
    includeTypes?: Array<'sanskrit' | 'transliteration' | 'english' | 'wordByWord' | 'commentary'>;
  } = {}
): SearchResult[] {
  const {
    maxResults = 20,
    chapterFilter,
    sortBy = 'relevance',
    includeTypes = ['sanskrit', 'transliteration', 'english', 'wordByWord', 'commentary'],
  } = options;

  // Filter shlokas by chapter if specified
  let filteredShlokas = shlokas;
  let filteredIndex = searchIndex;

  if (chapterFilter && chapterFilter.length > 0) {
    const chapterSet = new Set(chapterFilter);
    filteredShlokas = shlokas.filter(shloka => chapterSet.has(shloka.chapter));
    filteredIndex = searchIndex.filter(item => chapterSet.has(item.chapter));
  }

  // Perform search
  const results = searchShlokas(query, filteredShlokas, filteredIndex, maxResults * 2);

  // Filter by included types (this would require modifying the search to track which types matched)
  // For now, we'll keep all results

  // Apply sorting
  switch (sortBy) {
    case 'chapter':
      results.sort((a, b) => {
        if (a.shloka.chapter !== b.shloka.chapter) {
          return a.shloka.chapter - b.shloka.chapter;
        }
        return a.shloka.verse - b.shloka.verse;
      });
      break;
    case 'verse':
      results.sort((a, b) => a.shloka.verse - b.shloka.verse);
      break;
    case 'relevance':
    default:
      // Already sorted by relevance
      break;
  }

  return results.slice(0, maxResults);
}

/**
 * Get search suggestions based on partial query
 */
export function getSearchSuggestions(
  partialQuery: string,
  shlokas: Shloka[],
  maxSuggestions: number = 5
): string[] {
  if (partialQuery.length < 2) {
    return getPopularSearchTerms().slice(0, maxSuggestions);
  }

  const suggestions = new Set<string>();
  const normalizedQuery = partialQuery.toLowerCase();

  // Add popular terms that match
  getPopularSearchTerms().forEach(term => {
    if (term.toLowerCase().includes(normalizedQuery)) {
      suggestions.add(term);
    }
  });

  // Add terms from shloka content that match
  shlokas.forEach(shloka => {
    const allText = [
      shloka.translations.english,
      shloka.translations.wordByWord,
      shloka.translations.commentary,
    ]
      .join(' ')
      .toLowerCase();

    // Extract words that start with the query
    const words = allText.match(/\b\w+/g) || [];
    words.forEach(word => {
      if (word.startsWith(normalizedQuery) && word.length > partialQuery.length) {
        suggestions.add(word);
      }
    });
  });

  return Array.from(suggestions).slice(0, maxSuggestions);
}

/**
 * Debounced search function for performance
 */
export function createDebouncedSearch(
  searchFunction: (query: string) => SearchResult[],
  delay: number = 300
) {
  let timeoutId: any;

  return (query: string, callback: (results: SearchResult[]) => void) => {
    clearTimeout(timeoutId);

    timeoutId = setTimeout(() => {
      const results = searchFunction(query);
      callback(results);
    }, delay);
  };
}

/**
 * Standard utility to strip IAST diacritical markings for ASCII search compatibility
 */
export function stripDiacritics(str: string): string {
  return str
    .replace(/[āā]/gi, 'a')
    .replace(/[īī]/gi, 'i')
    .replace(/[ūū]/gi, 'u')
    .replace(/[ṛṛ]/gi, 'r')
    .replace(/[ḷḷ]/gi, 'l')
    .replace(/[ṅṅ]/gi, 'n')
    .replace(/[ññ]/gi, 'n')
    .replace(/[ṭṭ]/gi, 't')
    .replace(/[ḍḍ]/gi, 'd')
    .replace(/[ṇṇ]/gi, 'n')
    .replace(/[śś]/gi, 's')
    .replace(/[ṣṣ]/gi, 's')
    .replace(/[ḥḥ]/gi, 'h')
    .replace(/[ṁṁ]/gi, 'm');
}

